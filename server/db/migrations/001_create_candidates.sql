CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE candidates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  hashed_password TEXT NOT NULL,
  date_of_birth DATE,
  gender VARCHAR(20),
  college VARCHAR(150),
  year_of_graduation INTEGER,
  cgpa NUMERIC(3, 2),
  preferred_locations TEXT[] DEFAULT '{}',
  resume_url TEXT
);