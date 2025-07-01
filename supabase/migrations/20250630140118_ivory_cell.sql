/*
  # Create mood logs table

  1. New Tables
    - `mood_logs`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `date` (date) - The date of the mood log
      - `mood` (text) - The mood value (happy, sad, anxious, etc.)
      - `notes` (text, nullable) - Optional notes from the user
      - `response` (text, nullable) - Additional response/thoughts
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `mood_logs` table
    - Add policy for users to manage their own mood logs
*/

CREATE TABLE IF NOT EXISTS mood_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date date NOT NULL,
  mood text NOT NULL,
  notes text,
  response text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, date)
);

-- Enable Row Level Security
ALTER TABLE mood_logs ENABLE ROW LEVEL SECURITY;

-- Create policy for users to manage their own mood logs
CREATE POLICY "Users can manage their own mood logs"
  ON mood_logs
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create index for efficient queries
CREATE INDEX idx_mood_logs_user_date ON mood_logs(user_id, date DESC);
CREATE INDEX idx_mood_logs_created_at ON mood_logs(created_at DESC);