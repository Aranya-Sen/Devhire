-- Run this once manually to create the admin
-- Replace the hash below with a bcrypt hash of your chosen password

INSERT INTO admins (name, email, hashed_password)
VALUES (
  'Super Admin',
  'admin@devhire.com',
  '$2a$10$O0ibkdjaa9yuR1EtYqU.1enS90NMTZHzod0Q4I42UfnyVMWWwEXZ.'
);