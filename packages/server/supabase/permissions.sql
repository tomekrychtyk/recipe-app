-- Grant usage on the schema
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;

-- Grant access to the users table
GRANT ALL ON public.users TO authenticated;

-- Grant access to the role type
GRANT USAGE ON TYPE public.role TO authenticated;

-- Grant usage on the users id sequence if it exists
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated; 