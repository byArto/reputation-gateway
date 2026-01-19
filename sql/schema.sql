-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  criteria JSONB NOT NULL,
  manual_review BOOLEAN NOT NULL DEFAULT false,
  destination_url TEXT NOT NULL,
  destination_type TEXT NOT NULL CHECK (destination_type IN ('discord', 'beta')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Applications table
CREATE TABLE IF NOT EXISTS applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  ethos_profile_id INTEGER NOT NULL,
  username TEXT NOT NULL,
  score INTEGER NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('accepted', 'rejected', 'pending')),
  rejection_reason TEXT,
  criteria_snapshot JSONB NOT NULL,
  can_reapply_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);
CREATE INDEX IF NOT EXISTS idx_applications_project_id ON applications(project_id);
CREATE INDEX IF NOT EXISTS idx_applications_ethos_profile_id ON applications(ethos_profile_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_created_at ON applications(created_at DESC);

-- Composite index for checking existing applications
CREATE INDEX IF NOT EXISTS idx_applications_project_ethos ON applications(project_id, ethos_profile_id);

-- Comments for documentation
COMMENT ON TABLE projects IS 'Stores project configurations and filter criteria';
COMMENT ON TABLE applications IS 'Stores user applications for beta access';

COMMENT ON COLUMN projects.criteria IS 'JSON object containing filter criteria: {minScore, minVouches, positiveReviews, minAccountAge}';
COMMENT ON COLUMN applications.criteria_snapshot IS 'Snapshot of project criteria at the time of application';
COMMENT ON COLUMN applications.can_reapply_at IS 'Timestamp when user can reapply after rejection';
