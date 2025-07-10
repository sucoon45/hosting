-- Enum for user roles
CREATE TYPE user_role AS ENUM ('customer', 'admin');

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    role user_role DEFAULT 'customer' NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE NOT NULL,
    email_verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

-- Note: For actual database interaction in Node.js using 'pg',
-- this schema would be applied via migration files (e.g., using node-pg-migrate or similar).
-- The `gen_random_uuid()` function requires the `pgcrypto` extension.
-- Ensure it's enabled in your PostgreSQL database: CREATE EXTENSION IF NOT EXISTS pgcrypto;

COMMENT ON COLUMN users.id IS 'Primary key, UUID';
COMMENT ON COLUMN users.name IS 'Full name of the user';
COMMENT ON COLUMN users.email IS 'Unique email address for login and communication';
COMMENT ON COLUMN users.password_hash IS 'Hashed password (e.g., bcrypt)';
COMMENT ON COLUMN users.phone IS 'User''s phone number, optional';
COMMENT ON COLUMN users.role IS 'User role (customer or admin)';
COMMENT ON COLUMN users.is_verified IS 'Whether the user has verified their email address';
COMMENT ON COLUMN users.email_verified_at IS 'Timestamp when the email was verified';
COMMENT ON COLUMN users.created_at IS 'Timestamp of user creation';
COMMENT ON COLUMN users.updated_at IS 'Timestamp of last user update';
