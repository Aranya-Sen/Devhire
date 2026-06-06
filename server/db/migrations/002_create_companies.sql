CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(150) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  hashed_password TEXT NOT NULL,
  address TEXT,
  no_of_employees INTEGER DEFAULT 0
);