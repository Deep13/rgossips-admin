-- Brand Invitations: Admin-created placeholder brands awaiting claim
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS brand_invitations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  brand_name TEXT NOT NULL,
  instagram_username TEXT NOT NULL,
  logo_url TEXT DEFAULT '',
  notes TEXT DEFAULT '',

  -- Tracking
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Claim status
  status TEXT NOT NULL DEFAULT 'pending', -- pending, claimed, expired
  claimed_by UUID REFERENCES auth.users(id),
  claimed_at TIMESTAMPTZ,

  -- The resulting brand profile after claim
  brand_profile_id UUID REFERENCES brand_profiles(brand_id),

  CONSTRAINT unique_instagram_username UNIQUE (instagram_username)
);

-- Index for fast Instagram username lookups during login
CREATE INDEX IF NOT EXISTS idx_brand_invitations_ig
  ON brand_invitations (LOWER(instagram_username))
  WHERE status = 'pending';

-- RLS policies
ALTER TABLE brand_invitations ENABLE ROW LEVEL SECURITY;

-- Admins can read all invitations
CREATE POLICY "Admins can read invitations" ON brand_invitations
  FOR SELECT TO authenticated
  USING (true);

-- Service role can insert/update (used by admin panel + edge functions)
-- No INSERT/UPDATE policy needed since admin panel uses service role client

-- Public function to check if an Instagram username has a pending invitation
-- Called by the RGossips app during Instagram login
CREATE OR REPLACE FUNCTION check_brand_invitation(ig_username TEXT)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  invitation RECORD;
BEGIN
  SELECT id, brand_name, logo_url, instagram_username, status
  INTO invitation
  FROM brand_invitations
  WHERE LOWER(instagram_username) = LOWER(ig_username)
    AND status = 'pending'
  LIMIT 1;

  IF invitation IS NULL THEN
    RETURN json_build_object('found', false);
  END IF;

  RETURN json_build_object(
    'found', true,
    'invitation_id', invitation.id,
    'brand_name', invitation.brand_name,
    'logo_url', invitation.logo_url,
    'instagram_username', invitation.instagram_username
  );
END;
$$;

-- Function to claim an invitation (called after brand completes signup)
CREATE OR REPLACE FUNCTION claim_brand_invitation(
  invitation_id UUID,
  user_id UUID,
  profile_id UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE brand_invitations
  SET
    status = 'claimed',
    claimed_by = user_id,
    claimed_at = NOW(),
    brand_profile_id = profile_id
  WHERE id = invitation_id
    AND status = 'pending';

  RETURN FOUND;
END;
$$;
