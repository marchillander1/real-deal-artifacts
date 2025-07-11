-- Update the current user's profile to have admin role
UPDATE profiles 
SET role = 'admin' 
WHERE id = auth.uid();

-- If no profile exists, create one with admin role
INSERT INTO profiles (id, email, full_name, role)
SELECT auth.uid(), auth.email(), 'Admin User', 'admin'
WHERE NOT EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid());