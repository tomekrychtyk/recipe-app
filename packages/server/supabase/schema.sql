-- Drop the users table if it exists (this will also drop associated policies)
DROP TABLE IF EXISTS public.users;

-- Drop and recreate the Role enum type
DROP TYPE IF EXISTS public.role;
CREATE TYPE public.role AS ENUM ('admin', 'user');

-- Create the users table
CREATE TABLE public.users (
    id UUID PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    role role NOT NULL DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS on the users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policy to allow authenticated users to read all users
CREATE POLICY "Users can view all users"
ON users FOR SELECT
TO authenticated
USING (true);

-- Create policy to allow users to update their own record
CREATE POLICY "Users can update own record"
ON users FOR UPDATE
TO authenticated
USING (auth.uid() = id);

-- Create policy to allow inserting users (needed for registration)
CREATE POLICY "Enable insert for authenticated users"
ON users FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- Grant necessary permissions to authenticated users
GRANT ALL ON users TO authenticated; 