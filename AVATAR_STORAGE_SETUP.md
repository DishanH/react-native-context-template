# Avatar Storage Setup Guide

This guide explains how to set up Supabase Storage for user profile pictures in your React Native Context Template.

## 🚀 Quick Setup

### 1. Create the Storage Bucket

Run the SQL script in your **Supabase SQL Editor**:

```sql
-- Copy and paste the entire contents of scripts/setup-storage-bucket.sql
```

Or manually create the bucket in **Supabase Dashboard > Storage**:
- **Bucket name**: `user-avatars`
- **Public bucket**: ✅ Yes
- **File size limit**: 5MB
- **Allowed MIME types**: `image/jpeg, image/jpg, image/png, image/webp`

### 2. Verify Setup

Check that the bucket was created successfully:
- Go to **Supabase Dashboard > Storage**
- You should see a `user-avatars` bucket listed

### 3. Test Upload

1. Run your app and go to the **Edit Profile** screen
2. Tap the camera icon to change your profile picture
3. Select an image from your device
4. Tap **Save Changes**
5. The image should upload to Supabase Storage automatically!

## 📁 How It Works

### File Organization
```
user-avatars/
├── user-id-1/
│   └── avatar_1234567890.jpg
├── user-id-2/
│   └── avatar_1234567891.png
└── user-id-3/
    └── avatar_1234567892.webp
```

### Upload Process
1. **User selects image** → Local preview shown
2. **User taps Save** → Image uploaded to Supabase Storage
3. **Upload success** → Database updated with public URL
4. **Profile updated** → New avatar displayed everywhere

### Features Included
- ✅ **Automatic cleanup** - Old avatars deleted when new ones uploaded
- ✅ **Security** - Users can only access their own avatars
- ✅ **File validation** - Size limits and type checking
- ✅ **Progress feedback** - Loading states and error handling
- ✅ **Database sync** - Profile table automatically updated

## 🔒 Security

The setup includes Row Level Security (RLS) policies that ensure:
- Users can only upload to their own folder (`user-id/`)
- Users can only view/delete their own avatars
- All operations require authentication

## 🛠️ API Usage

The storage functionality is available through the `storageBucket` utility:

```typescript
import { storageBucket } from './lib/storage-bucket';

// Upload avatar
const result = await storageBucket.uploadAvatarRN(userId, imageUri);

// Delete avatar
await storageBucket.deleteAvatar(userId);

// Get avatar URL
const url = storageBucket.getAvatarUrl(userId, fileName);
```

## 🐛 Troubleshooting

### Upload fails with "Permission denied"
- Check that RLS policies were created correctly
- Verify user is authenticated
- Ensure bucket is public

### Images not displaying
- Check the public URL format in browser
- Verify bucket permissions
- Check network connectivity

### Old images not being deleted
- Verify the cleanup trigger was created
- Check Supabase logs for trigger errors

### File size errors
- Default limit is 5MB
- Adjust in bucket settings if needed
- Images are automatically compressed by expo-image-picker

## 📊 Monitoring

Monitor your storage usage in **Supabase Dashboard > Storage**:
- View uploaded files
- Check storage quota
- Monitor bandwidth usage

## 💰 Costs

Supabase Storage pricing (as of 2024):
- **Free tier**: 1GB storage + 2GB bandwidth
- **Pro tier**: 8GB storage + 10GB bandwidth
- **Additional**: $0.021/GB storage, $0.09/GB bandwidth

Profile images are typically 100-500KB each, so the free tier supports thousands of users.

## 🚀 Next Steps

Consider these enhancements:
- Image compression/optimization
- Multiple image sizes (thumbnails)
- Image cropping in-app
- Avatar placeholder system
- CDN integration for faster loading

---

That's it! Your users can now upload and manage their profile pictures with Supabase Storage. 🎉
