# Database Architecture

This directory contains a modular, production-ready database architecture that replaces the monolithic `database.ts` file.

## Architecture Overview

```
lib/database/
├── core/                    # Core infrastructure
│   ├── client.ts           # Supabase client singleton
│   ├── base-repository.ts  # Base repository with common functionality
│   └── types.ts           # Shared types
├── repositories/          # Data access layer
│   ├── profile.repository.ts
│   ├── preferences.repository.ts
│   ├── subscription.repository.ts
│   └── index.ts
├── services/             # Business logic layer
│   ├── profile.service.ts
│   ├── sync.service.ts
│   └── index.ts
└── index.ts             # Main exports
```

## Key Benefits

### 1. **Separation of Concerns**
- **Repositories**: Handle database operations and offline fallback
- **Services**: Handle business logic, validation, and complex operations
- **Core**: Shared infrastructure and utilities

### 2. **Scalability**
- Easy to add new entities without touching existing code
- Each entity has its own file and responsibilities
- Clear boundaries between layers

### 3. **Testability**
- Each repository and service can be tested independently
- Mock repositories easily for service testing
- Clear interfaces for dependency injection

### 4. **Maintainability**
- Small, focused files instead of one large file
- Consistent patterns across all entities
- Easy to find and modify specific functionality

## Usage Examples

### Basic Repository Usage

```typescript
import { profileRepository } from 'lib/database';

// Get user profile
const result = await profileRepository.getProfile(userId);
if (result.success) {
  console.log('Profile:', result.data);
} else {
  console.error('Error:', result.error);
}

// Update profile
await profileRepository.updateProfile(userId, {
  full_name: 'John Doe',
  bio: 'Software developer'
});
```

### Service Layer Usage (Recommended)

```typescript
import { profileService } from 'lib/database';

// Services include validation and business logic
const result = await profileService.updateProfile(userId, {
  email: 'invalid-email' // This will be validated
});

if (!result.success) {
  console.error('Validation error:', result.error?.message);
}
```

### Real-time Subscriptions

```typescript
import { profileService } from 'lib/database';

// Subscribe to profile changes
const subscription = profileService.subscribeToChanges(userId, (profile) => {
  console.log('Profile updated:', profile);
});

// Don't forget to unsubscribe
subscription?.unsubscribe();
```

### Sync Management

```typescript
import { syncService } from 'lib/database';

// Process sync queue
const result = await syncService.processSyncQueue();
console.log(`Processed: ${result.processed}, Failed: ${result.failed}`);

// Get sync status
const status = await syncService.getSyncQueueStatus();
console.log(`Pending: ${status.pending}, Failed: ${status.failed}`);
```

## Adding New Entities

### 1. Create Repository

```typescript
// lib/database/repositories/new-entity.repository.ts
import { BaseRepository, DatabaseResponse } from '../core/base-repository';
import type { NewEntity } from '../../../types/database';

export class NewEntityRepository extends BaseRepository {
  constructor() {
    super('new_entities'); // table name
  }

  async getEntity(id: string): Promise<DatabaseResponse<NewEntity>> {
    return this.executeWithFallback(
      // Online operation
      async () => {
        const supabase = this.client.getClient();
        const { data, error } = await supabase!
          .from('new_entities')
          .select('*')
          .eq('id', id)
          .single();
        if (error) throw error;
        return data;
      },
      // Offline fallback (optional)
      async () => {
        // Implement local storage fallback
        return null;
      }
    );
  }
}
```

### 2. Create Service (Optional)

```typescript
// lib/database/services/new-entity.service.ts
import { NewEntityRepository } from '../repositories/new-entity.repository';

export class NewEntityService {
  private repository: NewEntityRepository;

  constructor() {
    this.repository = new NewEntityRepository();
  }

  async getEntity(id: string) {
    // Add validation, business logic, etc.
    if (!id) {
      return { data: null, error: new Error('ID required'), success: false };
    }
    
    return this.repository.getEntity(id);
  }
}
```

### 3. Export from Index Files

```typescript
// Add to lib/database/repositories/index.ts
export { NewEntityRepository } from './new-entity.repository';

// Add to lib/database/services/index.ts
export { NewEntityService } from './new-entity.service';

// Add to lib/database/index.ts
export { NewEntityService } from './services';
export const newEntityService = new NewEntityService();
```

## Migration from Old Architecture

### Before (database.ts)
```typescript
import { database } from 'lib/database';

const profile = await database.getProfile(userId);
await database.updateProfile(userId, updates);
```

### After (new architecture)
```typescript
import { profileService } from 'lib/database';

const profile = await profileService.getProfile(userId);
await profileService.updateProfile(userId, updates);
```

The API is similar, but now you get better error handling, validation, and maintainability.

## Best Practices

1. **Use Services for Business Logic**: Always prefer services over direct repository access
2. **Handle Errors Gracefully**: All operations return `DatabaseResponse<T>` with success/error states
3. **Leverage Offline Support**: The base repository automatically handles offline scenarios
4. **Subscribe to Changes**: Use real-time subscriptions for live data updates
5. **Process Sync Queue**: Regularly process the sync queue for offline operations

## Type Safety

All operations are fully typed using the database types from `types/database.ts`:
- `Profile`, `ProfileInsert`, `ProfileUpdate`
- `UserPreferences`, `UserPreferencesInsert`, `UserPreferencesUpdate`
- `Subscription`, `SubscriptionInsert`, `SubscriptionUpdate`

The type aliases (`Insert`, `Update`, `Row`) are just TypeScript types that represent:
- **Row**: The complete data structure returned from the database
- **Insert**: Required and optional fields when creating new records
- **Update**: Fields that can be modified in existing records
