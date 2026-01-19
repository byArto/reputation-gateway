-- Seed data for testing
-- This file contains sample data for development

-- Insert sample projects
INSERT INTO projects (name, slug, criteria, manual_review, destination_url, destination_type) VALUES
(
  'DeFi Protocol Beta',
  'defi-protocol',
  '{"minScore": 1400, "minVouches": 1, "positiveReviews": true, "minAccountAge": 7}',
  true,
  'https://discord.gg/defi-protocol',
  'discord'
),
(
  'NFT Marketplace',
  'nft-marketplace',
  '{"minScore": 1600, "minVouches": 2, "positiveReviews": true, "minAccountAge": 30}',
  false,
  'https://beta.nftmarketplace.com',
  'beta'
),
(
  'Web3 Social App',
  'web3-social',
  '{"minScore": 1200, "minVouches": 0, "positiveReviews": false, "minAccountAge": 0}',
  true,
  'https://discord.gg/web3-social',
  'discord'
);

-- Insert sample applications for the first project
-- Note: You'll need to get the project_id from the projects table first
DO $$
DECLARE
  project_id UUID;
BEGIN
  SELECT id INTO project_id FROM projects WHERE slug = 'defi-protocol' LIMIT 1;

  IF project_id IS NOT NULL THEN
    INSERT INTO applications (
      project_id,
      ethos_profile_id,
      username,
      score,
      status,
      rejection_reason,
      criteria_snapshot,
      can_reapply_at
    ) VALUES
    (
      project_id,
      12345,
      'alice.eth',
      1650,
      'pending',
      NULL,
      '{"minScore": 1400, "minVouches": 1, "positiveReviews": true, "minAccountAge": 7}',
      NULL
    ),
    (
      project_id,
      23456,
      'bob_dev',
      1420,
      'accepted',
      NULL,
      '{"minScore": 1400, "minVouches": 1, "positiveReviews": true, "minAccountAge": 7}',
      NULL
    ),
    (
      project_id,
      34567,
      'charlie',
      1180,
      'rejected',
      'Score below minimum threshold',
      '{"minScore": 1400, "minVouches": 1, "positiveReviews": true, "minAccountAge": 7}',
      NOW() + INTERVAL '30 days'
    ),
    (
      project_id,
      45678,
      'diana.crypto',
      1720,
      'accepted',
      NULL,
      '{"minScore": 1400, "minVouches": 1, "positiveReviews": true, "minAccountAge": 7}',
      NULL
    );
  END IF;
END $$;
