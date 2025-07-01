/*
  # Add insert policy for user profiles

  1. Security
    - Add policy for authenticated users to insert their own profile data
*/

CREATE POLICY "Allow insert for authenticated users"
  ON public.user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);