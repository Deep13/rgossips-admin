-- Allow campaigns to be created for invited (unregistered) brands
-- Run this in Supabase SQL Editor

-- Make brand_id nullable (campaigns can exist without a registered brand)
ALTER TABLE campaigns ALTER COLUMN brand_id DROP NOT NULL;

-- Add reference to brand invitation
ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS brand_invitation_id UUID REFERENCES brand_invitations(id);

-- Add created_by_admin flag
ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS created_by_admin BOOLEAN DEFAULT false;

-- When a brand claims their invitation, migrate campaigns to the real brand_id
-- This function is called from the create-profile edge function
CREATE OR REPLACE FUNCTION migrate_invitation_campaigns(
  inv_id UUID,
  real_brand_id UUID
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  updated_count INTEGER;
BEGIN
  UPDATE campaigns
  SET brand_id = real_brand_id
  WHERE brand_invitation_id = inv_id
    AND (brand_id IS NULL);

  GET DIAGNOSTICS updated_count = ROW_COUNT;
  RETURN updated_count;
END;
$$;
