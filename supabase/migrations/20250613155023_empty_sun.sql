/*
  # Create user profiles table

  1. New Tables
    - `user_profiles`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `full_name` (text)
      - `age` (integer)
      - `height` (integer, in cm)
      - `weight` (integer, in kg)
      - `cycle_length` (integer, in days)
      - `last_period_date` (date)
      - `diagnosed_with_pcos` (boolean)
      - `common_symptoms` (text array)
      - `mental_health_concerns` (text, nullable)
      - `personal_goal` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `user_profiles` table
    - Add policy for users to read and write their own profile data
*/

CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  full_name text NOT NULL,
  age integer NOT NULL CHECK (age >= 13 AND age <= 100),
  height integer NOT NULL CHECK (height >= 100 AND height <= 250),
  weight integer NOT NULL CHECK (weight >= 30 AND weight <= 300),
  cycle_length integer NOT NULL CHECK (cycle_length >= 21 AND cycle_length <= 45),
  last_period_date date NOT NULL,
  diagnosed_with_pcos boolean NOT NULL DEFAULT false,
  common_symptoms text[] DEFAULT '{}',
  mental_health_concerns text,
  personal_goal text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create policy for users to manage their own profile
CREATE POLICY "Users can manage their own profile"
  ON user_profiles
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();