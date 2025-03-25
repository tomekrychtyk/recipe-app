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