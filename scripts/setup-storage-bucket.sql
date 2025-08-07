-- Supabase Storage Setup for User Avatars
-- Run this script in your Supabase SQL Editor

-- 1. Create the user-avatars storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'user-avatars',
  'user-avatars', 
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

-- 2. Set up Row Level Security (RLS) policies for the bucket

-- Policy: Users can upload their own avatars
CREATE POLICY "Users can upload their own avatars"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'user-avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy: Users can view their own avatars
CREATE POLICY "Users can view their own avatars"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'user-avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy: Users can update their own avatars
CREATE POLICY "Users can update their own avatars"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'user-avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy: Users can delete their own avatars
CREATE POLICY "Users can delete their own avatars"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'user-avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- 3. Enable RLS on storage.objects (if not already enabled)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 4. Create helper function to clean up old avatars when new ones are uploaded
CREATE OR REPLACE FUNCTION clean_old_avatars()
RETURNS TRIGGER AS $$
BEGIN
  -- Delete other avatar files for the same user when a new one is uploaded
  DELETE FROM storage.objects 
  WHERE bucket_id = 'user-avatars' 
    AND name LIKE (storage.foldername(NEW.name))[1] || '/%'
    AND name != NEW.name
    AND created_at < NEW.created_at;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Create trigger to automatically clean up old avatars
DROP TRIGGER IF EXISTS trigger_clean_old_avatars ON storage.objects;
CREATE TRIGGER trigger_clean_old_avatars
  AFTER INSERT ON storage.objects
  FOR EACH ROW
  WHEN (NEW.bucket_id = 'user-avatars')
  EXECUTE FUNCTION clean_old_avatars();

-- 6. Create a helper function to get user's current avatar URL
CREATE OR REPLACE FUNCTION get_user_avatar_url(user_id UUID DEFAULT auth.uid())
RETURNS TEXT AS $$
DECLARE
  avatar_path TEXT;
  avatar_url TEXT;
BEGIN
  -- Get the most recent avatar for the user
  SELECT name INTO avatar_path
  FROM storage.objects
  WHERE bucket_id = 'user-avatars'
    AND name LIKE user_id::text || '/%'
  ORDER BY created_at DESC
  LIMIT 1;
  
  IF avatar_path IS NOT NULL THEN
    -- Generate the public URL
    avatar_url := 'https://' || current_setting('app.settings.supabase_url', true) || 
                 '/storage/v1/object/public/user-avatars/' || avatar_path;
    RETURN avatar_url;
  END IF;
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Update profiles table to automatically sync avatar_url when storage changes
CREATE OR REPLACE FUNCTION sync_profile_avatar()
RETURNS TRIGGER AS $$
DECLARE
  user_uuid UUID;
  new_avatar_url TEXT;
BEGIN
  -- Extract user ID from the file path
  user_uuid := (storage.foldername(NEW.name))[1]::UUID;
  
  -- Generate the public URL for the new avatar
  new_avatar_url := 'https://' || current_setting('app.settings.supabase_url', true) || 
                   '/storage/v1/object/public/user-avatars/' || NEW.name;
  
  -- Update the user's profile with the new avatar URL
  UPDATE profiles 
  SET 
    avatar_url = new_avatar_url,
    updated_at = NOW()
  WHERE id = user_uuid;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Create trigger to sync profile when avatar is uploaded
DROP TRIGGER IF EXISTS trigger_sync_profile_avatar ON storage.objects;
CREATE TRIGGER trigger_sync_profile_avatar
  AFTER INSERT ON storage.objects
  FOR EACH ROW
  WHEN (NEW.bucket_id = 'user-avatars')
  EXECUTE FUNCTION sync_profile_avatar();

-- Verification queries (optional - run these to check setup)
-- SELECT * FROM storage.buckets WHERE id = 'user-avatars';
-- SELECT * FROM storage.objects WHERE bucket_id = 'user-avatars' LIMIT 5;
