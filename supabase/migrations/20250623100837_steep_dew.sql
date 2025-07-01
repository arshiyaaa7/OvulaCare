/*
  # Create video conversations table for Tavus AI integration

  1. New Tables
    - `video_conversations`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `message` (text) - User's original message
      - `tavus_video_id` (text) - Tavus video ID
      - `video_url` (text, nullable) - Final video URL
      - `status` (text) - processing, completed, failed
      - `error_message` (text, nullable) - Error details if failed
      - `created_at` (timestamp)
      - `completed_at` (timestamp, nullable)

  2. Security
    - Enable RLS on `video_conversations` table
    - Add policy for users to manage their own video conversations
*/

CREATE TABLE IF NOT EXISTS video_conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  message text NOT NULL,
  tavus_video_id text NOT NULL,
  video_url text,
  status text DEFAULT 'processing' CHECK (status IN ('processing', 'completed', 'failed')),
  error_message text,
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

-- Enable Row Level Security
ALTER TABLE video_conversations ENABLE ROW LEVEL SECURITY;

-- Create policy for users to manage their own video conversations
CREATE POLICY "Users can manage their own video conversations"
  ON video_conversations
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create index for efficient queries
CREATE INDEX idx_video_conversations_user_id ON video_conversations(user_id);
CREATE INDEX idx_video_conversations_tavus_id ON video_conversations(tavus_video_id);
CREATE INDEX idx_video_conversations_status ON video_conversations(status);