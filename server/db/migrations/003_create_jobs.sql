CREATE TYPE job_type_enum AS ENUM ('full-time', 'part-time', 'contract', 'internship');
CREATE TYPE job_status_enum AS ENUM ('open', 'closed');

CREATE TABLE jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  location VARCHAR(150),
  job_type job_type_enum NOT NULL DEFAULT 'full-time',
  tech_stack TEXT[] DEFAULT '{}',
  min_cgpa NUMERIC(3, 2) DEFAULT 0.00,
  status job_status_enum NOT NULL DEFAULT 'open',
  last_date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);