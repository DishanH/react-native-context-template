import { databaseClient } from '../core/client';
import { storage } from '../../storage';
import type { SyncQueueItem } from '../core/base-repository';

/**
 * Sync Service - Handles offline synchronization with the database
 */
export class SyncService {
  private client = databaseClient;
  private isProcessing = false;

  /**
   * Process the sync queue
   */
  async processSyncQueue(): Promise<{ processed: number; failed: number }> {
    if (this.isProcessing) {
      console.log('Sync already in progress');
      return { processed: 0, failed: 0 };
    }

    if (!this.client.isAvailable()) {
      console.log('Database not available for sync');
      return { processed: 0, failed: 0 };
    }

    this.isProcessing = true;
    let processed = 0;
    let failed = 0;

    try {
      let queue: SyncQueueItem[] = (await storage.get('sync_queue', true)) || [];
      const pendingItems = queue.filter((item: SyncQueueItem) => 
        item.sync_status === 'pending' && item.attempts < 3
      );

      console.log(`Processing ${pendingItems.length} sync items`);

      for (const item of pendingItems) {
        try {
          await this.syncQueueItem(item);
          
          // Remove successful item from queue (update in-memory queue first)
          queue = queue.filter((q: SyncQueueItem) => q.id !== item.id);
          await storage.set('sync_queue', queue);
          processed++;
          
          console.log(`Synced: ${item.table_name} ${item.operation} for ${item.record_id}`);
        } catch (error) {
          console.error(`Failed to sync item ${item.id}:`, error);
          
          // Update attempts
          item.attempts += 1;
          item.sync_status = item.attempts >= 3 ? 'failed' : 'pending';
          item.updated_at = new Date().toISOString();
          
          // Update the item in the in-memory queue and persist
          queue = queue.map((q: SyncQueueItem) => (q.id === item.id ? item : q));
          await storage.set('sync_queue', queue);
          failed++;
        }
      }
    } finally {
      this.isProcessing = false;
    }

    return { processed, failed };
  }

  /**
   * Clear the entire sync queue
   */
  async clearSyncQueue(): Promise<void> {
    await storage.set('sync_queue', []);
  }

  /**
   * Get sync queue status
   */
  async getSyncQueueStatus(): Promise<{
    total: number;
    pending: number;
    failed: number;
    processing: boolean;
  }> {
    const queue = await storage.get('sync_queue', true) || [];
    const pending = queue.filter((item: SyncQueueItem) => item.sync_status === 'pending').length;
    const failed = queue.filter((item: SyncQueueItem) => item.sync_status === 'failed').length;

    return {
      total: queue.length,
      pending,
      failed,
      processing: this.isProcessing
    };
  }

  /**
   * Retry failed sync items
   */
  async retryFailedItems(): Promise<void> {
    const queue = await storage.get('sync_queue', true) || [];
    const updatedQueue = queue.map((item: SyncQueueItem) => {
      if (item.sync_status === 'failed') {
        return {
          ...item,
          sync_status: 'pending' as const,
          attempts: 0,
          updated_at: new Date().toISOString()
        };
      }
      return item;
    });

    await storage.set('sync_queue', updatedQueue);
  }

  /**
   * Get last sync time
   */
  async getLastSyncTime(): Promise<Date | null> {
    const lastSync = await storage.get('last_sync_time', false);
    return lastSync ? new Date(lastSync) : null;
  }

  /**
   * Update last sync time
   */
  private async updateLastSyncTime(): Promise<void> {
    await storage.set('last_sync_time', new Date().toISOString());
  }

  /**
   * Sync a single queue item
   */
  private async syncQueueItem(item: SyncQueueItem): Promise<void> {
    const supabase = this.client.getClient();
    if (!supabase) throw new Error('Supabase not available');

    const resolvePrimaryKey = (tableName: string): string => {
      switch (tableName) {
        case 'subscriptions':
          return 'user_id';
        default:
          return 'id';
      }
    };

    switch (item.operation) {
      case 'insert':
        const { error: insertError } = await supabase
          .from(item.table_name)
          .insert([item.data]);
        if (insertError) throw insertError;
        break;

      case 'update':
        // For user_preferences, we need to handle the special case
        if (item.table_name === 'user_preferences') {
          const { error: updateError } = await supabase
            .rpc('update_user_preferences', {
              new_preferences: item.data.preferences
            });
          if (updateError) throw updateError;
        } else {
          const primaryKey = resolvePrimaryKey(item.table_name);
          const { error: updateError } = await supabase
            .from(item.table_name)
            .update(item.data)
            .eq(primaryKey, item.record_id);
          if (updateError) throw updateError;
        }
        break;

      case 'delete':
        {
          const primaryKey = resolvePrimaryKey(item.table_name);
          const { error: deleteError } = await supabase
            .from(item.table_name)
            .delete()
            .eq(primaryKey, item.record_id);
          if (deleteError) throw deleteError;
        }
        break;

      default:
        throw new Error(`Unknown operation: ${item.operation}`);
    }

    // Update last sync time on successful sync
    await this.updateLastSyncTime();
  }
}
