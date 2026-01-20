-- Migration: Add invite tokens table for secure one-time-use access
-- Description: Implements one-time-use tokens with expiration for secure destination URL access
-- Date: 2026-01-20

BEGIN;

-- Create invite_tokens table
CREATE TABLE IF NOT EXISTS invite_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Relationships
  application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  ethos_profile_id INTEGER NOT NULL,

  -- Token data
  token TEXT NOT NULL UNIQUE,
  destination_url TEXT NOT NULL,

  -- Status tracking
  is_used BOOLEAN NOT NULL DEFAULT false,
  used_at TIMESTAMP WITH TIME ZONE,
  used_from_ip TEXT,

  -- Expiration (24 hours from creation)
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,

  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Constraint: if used, must have used_at timestamp
  CONSTRAINT invite_token_used_check CHECK (
    (is_used = false AND used_at IS NULL) OR
    (is_used = true AND used_at IS NOT NULL)
  )
);

-- Performance indexes
CREATE INDEX IF NOT EXISTS idx_invite_tokens_token ON invite_tokens(token);
CREATE INDEX IF NOT EXISTS idx_invite_tokens_application_id ON invite_tokens(application_id);
CREATE INDEX IF NOT EXISTS idx_invite_tokens_expires_at ON invite_tokens(expires_at);
CREATE INDEX IF NOT EXISTS idx_invite_tokens_is_used ON invite_tokens(is_used);
CREATE INDEX IF NOT EXISTS idx_invite_tokens_profile ON invite_tokens(ethos_profile_id);

-- Composite index for fast validation query
CREATE INDEX IF NOT EXISTS idx_invite_tokens_validation
  ON invite_tokens(token, is_used, expires_at);

-- Comments for documentation
COMMENT ON TABLE invite_tokens IS 'One-time-use invite tokens for secure destination URL access';
COMMENT ON COLUMN invite_tokens.token IS 'Cryptographically secure random token (64 char hex)';
COMMENT ON COLUMN invite_tokens.expires_at IS 'Token expires 24 hours after creation';
COMMENT ON COLUMN invite_tokens.is_used IS 'Token can only be used once';
COMMENT ON COLUMN invite_tokens.used_at IS 'Timestamp when token was redeemed';
COMMENT ON COLUMN invite_tokens.used_from_ip IS 'IP address from which token was redeemed (audit trail)';

COMMIT;
