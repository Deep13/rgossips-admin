-- Influencer Invitations: Admin-created placeholder influencers awaiting claim
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS influencer_invitations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  instagram_username TEXT NOT NULL,
  profile_photo_url TEXT DEFAULT '',
  notes TEXT DEFAULT '',

  -- Tracking
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Claim status
  status TEXT NOT NULL DEFAULT 'pending', -- pending, claimed
  claimed_by UUID REFERENCES auth.users(id),
  claimed_at TIMESTAMPTZ,
  influencer_profile_id UUID REFERENCES influencer_profiles(influencer_id),

  CONSTRAINT unique_influencer_ig_username UNIQUE (instagram_username)
);

CREATE INDEX IF NOT EXISTS idx_influencer_invitations_ig
  ON influencer_invitations (LOWER(instagram_username))
  WHERE status = 'pending';

ALTER TABLE influencer_invitations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read influencer invitations" ON influencer_invitations
  FOR SELECT TO authenticated
  USING (true);
