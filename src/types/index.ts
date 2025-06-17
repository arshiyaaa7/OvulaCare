export interface User {
  id: string;
  name: string;
  email?: string;
  isAnonymous: boolean;
}

export interface JournalEntry {
  id: string;
  userId: string;
  content: string;
  mood: 'happy' | 'calm' | 'anxious' | 'sad' | 'hopeful';
  createdAt: string;
}

export interface MoodLog {
  id: string;
  user_id: string;
  date: string;
  mood: string;
  notes: string | null;
  response: string | null;
  created_at: string;
}

export interface Symptom {
  id: string;
  name: string;
  description: string;
  category: 'physical' | 'mental' | 'cycle';
}

export interface SymptomResponse {
  id: string;
  symptomId: string;
  userId: string;
  value: string | boolean | number;
  date: string;
}

export interface CycleDay {
  date: string;
  day: number;
  isMenstruation: boolean;
  mood?: 'happy' | 'calm' | 'anxious' | 'sad' | 'hopeful';
  symptoms?: string[];
  notes?: string;
}

export interface CycleData {
  userId: string;
  cycles: {
    startDate: string;
    endDate?: string;
    days: CycleDay[];
  }[];
}

export interface PCOSType {
  id: string;
  name: string;
  description: string;
  commonSymptoms: string[];
  recommendations: string[];
}

export interface CommunityPost {
  id: string;
  userId: string;
  content: string;
  createdAt: string;
  likes: number;
  replies: {
    id: string;
    userId: string;
    content: string;
    createdAt: string;
    likes: number;
  }[];
}