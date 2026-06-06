CREATE TYPE pipeline_stage_enum AS ENUM ('Applied', 'Screening', 'Interview', 'Offer', 'Rejected');

CREATE TABLE applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  candidate_id UUID NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
  resume_url TEXT NOT NULL,
  pipeline_stage pipeline_stage_enum NOT NULL DEFAULT 'Applied',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(job_id, candidate_id)
);