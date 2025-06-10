# Production Data Management Setup

This guide explains how to set up production-ready data management for your SimpleAI app template with Supabase integration.

## 📋 Overview

The data management system is designed with a **hybrid architecture** that:
- ✅ Works offline with local storage (SecureStore/localStorage)
- ✅ Syncs with remote database (Supabase) when online
- ✅ Provides real-time updates
- ✅ Handles sync conflicts and offline queuing
- ✅ Maintains data consistency across devices

## 🏗️ Architecture Layers

### 1. **Storage Layer** (`lib/storage.ts`)
- **Local Storage**: SecureStore (mobile) / localStorage (web)
- **Cross-platform compatibility**
- **Encryption for sensitive data**

### 2. **Database Layer** (`lib/database.ts`)
- **Remote Database**: Supabase integration
- **Offline Queue**: Sync pending operations
- **Real-time subscriptions**
- **Conflict resolution**

### 3. **Data Hooks** (`lib/useData.ts`)
- **React Hooks**: For component data management
- **Caching Strategy**: Local-first with remote sync
- **Loading States**: Proper UX during sync
- **Error Handling**: Graceful fallbacks

### 4. **Context Layer** (`contexts/`)
- **AuthContext**: User authentication state
- **SettingsContext**: User preferences
- **SubscriptionContext**: Subscription management

## 🚀 Quick Setup

### Step 1: Install Dependencies

```bash
# Core Supabase dependencies
npx expo install @supabase/supabase-js

# Network status monitoring (optional but recommended)
npx expo install @react-native-async-storage/async-storage
npx expo install @react-native-community/netinfo
```

### Step 2: Environment Configuration

Create `.env.local` in your project root:

```env
# Supabase Configuration
EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional: Feature flags
EXPO_PUBLIC_ENABLE_REMOTE_SYNC=true
EXPO_PUBLIC_SYNC_INTERVAL=300000
```

### Step 3: Database Schema Setup

Run this SQL in your Supabase SQL editor:

```sql
-- Enable Row Level Security
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Users table
CREATE TABLE public.users (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    email VARCHAR NOT NULL,
    name VARCHAR NOT NULL,
    avatar_url VARCHAR,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User preferences table
CREATE TABLE public.user_preferences (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    preferences JSONB NOT NULL DEFAULT '{}',
    sync_status VARCHAR DEFAULT 'synced',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subscriptions table
CREATE TABLE public.subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    plan VARCHAR NOT NULL DEFAULT 'free',
    status VARCHAR NOT NULL DEFAULT 'active',
    start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    end_date TIMESTAMP WITH TIME ZONE,
    auto_renew BOOLEAN DEFAULT true,
    payment_method VARCHAR,
    sync_status VARCHAR DEFAULT 'synced',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sync queue table (for offline support)
CREATE TABLE public.sync_queue (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    table_name VARCHAR NOT NULL,
    record_id VARCHAR NOT NULL,
    operation VARCHAR NOT NULL,
    data JSONB NOT NULL,
    sync_status VARCHAR DEFAULT 'pending',
    attempts INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security Policies
CREATE POLICY "Users can view own data" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON public.users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own preferences" ON public.user_preferences
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own subscriptions" ON public.subscriptions
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own sync queue" ON public.sync_queue
    FOR ALL USING (auth.uid() = user_id);
```

### Step 4: Enable Database Integration

Uncomment the database imports in your files:

```typescript
// In lib/useData.ts
import { database } from './database';

// In lib/database.ts
// Remove the linter disable comments and install @supabase/supabase-js
```

## 📱 Usage Examples

### Basic Data Hook Usage

```typescript
// In your component
import { useUserData, useDashboardData } from '../lib/useData';

export function ProfileScreen() {
  const { userData, isLoading, updateUserData, syncStatus } = useUserData({
    enableRemoteSync: true,
    syncOnMount: true,
    syncInterval: 5 * 60 * 1000, // 5 minutes
  });

  const handleUpdateProfile = async (updates) => {
    await updateUserData(updates);
    // Data is automatically synced to remote if online
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <View>
      <Text>{userData?.name}</Text>
      {syncStatus === 'syncing' && <SyncIndicator />}
      <Button onPress={() => handleUpdateProfile({ name: 'New Name' })} />
    </View>
  );
}
```

### Dashboard with Aggregated Data

```typescript
import { useDashboardData } from '../lib/useData';

export function DashboardScreen() {
  const { dashboardStats, isLoading } = useDashboardData({
    enableRemoteSync: true,
    syncOnMount: true,
  });

  return (
    <View>
      <Text>Welcome, {dashboardStats?.user?.name}</Text>
      <Text>Plan: {dashboardStats?.subscription?.plan}</Text>
      <Text>Features: {dashboardStats?.totalFeatures}</Text>
    </View>
  );
}
```

### Sync Management

```typescript
import { useSyncManager } from '../lib/useData';

export function SyncStatusComponent() {
  const { queueSize, isSyncing, processQueue, lastSyncTime } = useSyncManager();

  return (
    <View>
      {queueSize > 0 && (
        <Text>{queueSize} items waiting to sync</Text>
      )}
      {isSyncing && <Text>Syncing...</Text>}
      <Button onPress={processQueue} title="Sync Now" />
      {lastSyncTime && (
        <Text>Last sync: {lastSyncTime.toLocaleString()}</Text>
      )}
    </View>
  );
}
```

## 🔄 Migration Strategy

### Phase 1: Local-Only (Current State)
```typescript
// Use existing storage.ts
const { userData } = useUserData({ enableRemoteSync: false });
```

### Phase 2: Hybrid Mode
```typescript
// Enable remote sync gradually
const { userData } = useUserData({ 
  enableRemoteSync: true,
  syncOnMount: true 
});
```

### Phase 3: Full Cloud Integration
```typescript
// Real-time updates and full sync
const { userData } = useUserData({ 
  enableRemoteSync: true,
  syncOnMount: true,
  syncInterval: 60000 // 1 minute
});
```

## 🛡️ Security Considerations

### 1. **Row Level Security (RLS)**
- All tables have RLS enabled
- Users can only access their own data
- Policies enforce data isolation

### 2. **Data Encryption**
```typescript
// Sensitive data is encrypted locally
await storage.setItem('sensitive_data', encryptedValue);
```

### 3. **Authentication Flow**
```typescript
// Database automatically handles auth state
const user = await database.getCurrentUser();
```

## 📊 Monitoring & Analytics

### Performance Metrics
```typescript
// Track sync performance
const syncMetrics = {
  queueSize,
  syncDuration,
  errorRate,
  lastSyncTime,
};
```

### Error Tracking
```typescript
// Automatic error handling and reporting
try {
  await database.updateUser(userId, updates);
} catch (error) {
  // Automatically queued for retry
  console.error('Sync failed, queued for retry:', error);
}
```

## 🚀 Production Deployment

### 1. **Environment Variables**
```bash
# Production .env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
EXPO_PUBLIC_ENABLE_REMOTE_SYNC=true
```

### 2. **Database Indexes**
```sql
-- Performance indexes
CREATE INDEX idx_user_preferences_user_id ON user_preferences(user_id);
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_sync_queue_status ON sync_queue(sync_status, created_at);
```

### 3. **Backup Strategy**
- Automatic Supabase backups
- Local data persists as fallback
- Export/import functionality built-in

## 🔧 Customization

### Adding New Data Types

1. **Create the hook**:
```typescript
export function useCustomData(config: DataConfig) {
  return useAppData<CustomType>('custom_key', null, config);
}
```

2. **Add database operations**:
```typescript
// In database.ts
async updateCustomData(userId: string, data: CustomType) {
  // Implementation
}
```

3. **Use in components**:
```typescript
const { data, updateData } = useCustomData({ enableRemoteSync: true });
```

## 💡 Best Practices

### 1. **Loading States**
Always show loading indicators during sync operations.

### 2. **Offline Handling**
Design UI to work seamlessly offline with sync indicators.

### 3. **Error Recovery**
Implement retry mechanisms and user-friendly error messages.

### 4. **Performance**
Use sync intervals appropriate for your use case.

### 5. **Data Validation**
Validate data before saving locally and remotely.

## 🎯 Next Steps

1. **Install Supabase dependencies**
2. **Set up your Supabase project**
3. **Configure environment variables**
4. **Run database schema**
5. **Enable remote sync in your hooks**
6. **Test offline/online scenarios**
7. **Deploy to production**

This architecture provides a solid foundation for a production-ready app with seamless local/remote data management! 🚀 