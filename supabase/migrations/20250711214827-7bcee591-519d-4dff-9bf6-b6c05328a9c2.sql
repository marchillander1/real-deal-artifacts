-- Create or update the profile for the demo user to have admin role
INSERT INTO profiles (id, email, full_name, role)
VALUES ('be56401d-7924-4fef-b5d3-3d2df6160065', 'demo@matchwise.tech', 'Demo Admin', 'admin')
ON CONFLICT (id) 
DO UPDATE SET role = 'admin';