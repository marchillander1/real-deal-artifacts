-- Create admin user marc@matchwise.tech if not exists
DO $$ 
BEGIN
  -- Check if user already exists in auth.users
  IF NOT EXISTS (
    SELECT 1 FROM auth.users WHERE email = 'marc@matchwise.tech'
  ) THEN
    -- Insert user into auth.users with hashed password
    INSERT INTO auth.users (
      id,
      email,
      encrypted_password,
      email_confirmed_at,
      created_at,
      updated_at,
      role,
      aud,
      confirmation_token,
      email_change_token_new,
      recovery_token
    ) VALUES (
      gen_random_uuid(),
      'marc@matchwise.tech',
      crypt('admin123', gen_salt('bf')), -- Password: admin123
      now(),
      now(),
      now(),
      'authenticated',
      'authenticated',
      '',
      '',
      ''
    );
  ELSE
    -- Update existing user's password
    UPDATE auth.users 
    SET encrypted_password = crypt('admin123', gen_salt('bf')),
        updated_at = now()
    WHERE email = 'marc@matchwise.tech';
  END IF;

  -- Ensure profile exists with admin role
  INSERT INTO public.profiles (id, email, full_name, role)
  SELECT 
    u.id,
    'marc@matchwise.tech',
    'Marc Hillander',
    'admin'
  FROM auth.users u
  WHERE u.email = 'marc@matchwise.tech'
  ON CONFLICT (id) 
  DO UPDATE SET 
    role = 'admin',
    full_name = 'Marc Hillander';
END $$;