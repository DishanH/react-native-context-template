import { databaseClient } from './client';
import { storage } from '../../storage';

export interface DatabaseResponse<T> {
  data: T | null;
  error: Error | null;
  success: boolean;
}

export interface SyncQueueItem {
  id: string;
  table_name: string;
  record_id: string;
  operation: 'insert' | 'update' | 'delete';
  data: any;
  sync_status: 'pending' | 'synced' | 'failed';
  attempts: number;
  created_at: string;
  updated_at: string;
}

/**
 * Base repository class providing common database operations
 * All entity repositories should extend this class
 */
export abstract class BaseRepository {
  protected tableName: string;
  protected client = databaseClient;

  constructor(tableName: string) {
    this.tableName = tableName;
  }

  /**
   * Check if database is available
   */
  protected isOnline(): boolean {
    return this.client.isAvailable();
  }

  /**
   * Add operation to sync queue for offline support
   */
  protected async addToSyncQueue(
    recordId: string, 
    operation: 'insert' | 'update' | 'delete', 
    data: any
  ): Promise<void> {
    const queueItem: SyncQueueItem = {
      id: `${this.tableName}_${recordId}_${Date.now()}`,
      table_name: this.tableName,
      record_id: recordId,
      operation,
      data,
      sync_status: 'pending',
      attempts: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Store in local sync queue
    const currentQueue = await storage.get('sync_queue', true) || [];
    
    // Limit queue size to prevent storage overflow
    const MAX_QUEUE_SIZE = 100;
    if (currentQueue.length >= MAX_QUEUE_SIZE) {
      currentQueue.splice(0, currentQueue.length - MAX_QUEUE_SIZE + 1);
    }
    
    currentQueue.push(queueItem);
    await storage.set('sync_queue', currentQueue);
  }

  /**
   * Generic method to handle database operations with offline fallback
   */
  protected async executeWithFallback<T>(
    onlineOperation: () => Promise<T>,
    offlineOperation?: () => Promise<T>,
    syncData?: { recordId: string; operation: 'insert' | 'update' | 'delete'; data: any }
  ): Promise<DatabaseResponse<T>> {
    if (this.isOnline()) {
      try {
        const data = await onlineOperation();
        return { data, error: null, success: true };
      } catch (error) {
        console.error(`Database operation failed for ${this.tableName}:`, error);
        
        // Add to sync queue if sync data provided
        if (syncData) {
          await this.addToSyncQueue(syncData.recordId, syncData.operation, syncData.data);
        }
        
        // Try offline operation if available
        if (offlineOperation) {
          try {
            const fallbackData = await offlineOperation();
            return { data: fallbackData, error: error as Error, success: false };
          } catch (offlineError) {
            return { data: null, error: offlineError as Error, success: false };
          }
        }
        
        return { data: null, error: error as Error, success: false };
      }
    } else {
      // Offline mode
      if (syncData) {
        await this.addToSyncQueue(syncData.recordId, syncData.operation, syncData.data);
      }
      
      if (offlineOperation) {
        try {
          const data = await offlineOperation();
          return { data, error: null, success: true };
        } catch (error) {
          return { data: null, error: error as Error, success: false };
        }
      }
      
      return { data: null, error: new Error('Offline and no fallback available'), success: false };
    }
  }

  /**
   * Subscribe to real-time changes for this table
   */
  protected subscribeToChanges(
    filter: string,
    callback: (payload: any) => void
  ) {
    if (!this.isOnline()) return null;

    const supabase = this.client.getClient();
    if (!supabase) return null;

    return supabase
      .channel(`${this.tableName}_changes`)
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: this.tableName,
          filter 
        }, 
        callback
      )
      .subscribe();
  }
}
