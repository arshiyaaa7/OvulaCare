import { PCOSType, Symptom } from "@/types";

export const APP_NAME = "OvulaCare AI";
export const APP_TAGLINE = "Your Companion for PCOS Healing";
export const APP_DESCRIPTION = "Supporting women with PCOS through mental health journaling, symptom screening, and personalized care.";

export const FEATURES = [
  {
    title: "Symptom Checker",
    description: "Identify your PCOS type with our comprehensive AI-powered symptom analysis tool",
    icon: "ActivitySquare"
  },
  {
    title: "AI Journaling",
    description: "Track your mental health journey with compassionate AI-assisted journaling and insights",
    icon: "BookHeart"
  },
  {
    title: "PCOS Type Guide",
    description: "Understand your unique PCOS type and get personalized recommendations for healing",
    icon: "Compass"
  },
  {
    title: "Period Tracker",
    description: "Monitor your cycle patterns with our intuitive tracker designed for PCOS",
    icon: "Calendar"
  }
];

export const TESTIMONIALS = [
  {
    name: "Sarah Johnson",
    quote: "OvulaCare AI helped me understand my PCOS symptoms better than years of online research. The AI journaling feature has been life-changing for my mental health.",
    avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400"
  },
  {
    name: "Aisha Patel",
    quote: "The personalized recommendations and supportive community made me feel less alone in my PCOS journey. I finally have hope again.",
    avatar: "https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=400"
  },
  {
    name: "Elena Rodriguez",
    quote: "Finally, an app that understands the emotional side of PCOS, not just the physical symptoms. LIA feels like having a caring friend who truly gets it.",
    avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400"
  }
];

export const JOURNAL_PROMPTS = [
  "How are you feeling today? 💕",
  "Have you noticed any changes in your symptoms?",
  "What has helped you feel better this week?",
  "How has your energy level been today?",
  "What self-care activities did you practice today?",
  "How has your sleep been lately?",
  "What are you grateful for today? 🌸",
  "What challenges are you facing right now?",
  "How can you show yourself compassion today?",
  "What small victory can you celebrate today?"
];

export const PCOS_TYPES: PCOSType[] = [
  {
    id: "insulin-resistant",
    name: "Insulin Resistant PCOS",
    description: "The most common type, characterized by high insulin levels that lead to increased androgen production.",
    commonSymptoms: ["Weight gain", "Sugar cravings", "Fatigue", "Acne", "Irregular periods"],
    recommendations: ["Low-glycemic diet", "Regular exercise", "Intermittent fasting", "Stress management", "Inositol supplements"]
  },
  {
    id: "inflammatory",
    name: "Inflammatory PCOS",
    description: "Triggered by chronic inflammation in the body that disrupts hormone function.",
    commonSymptoms: ["Joint pain", "Skin issues", "Digestive problems", "Headaches", "Fatigue"],
    recommendations: ["Anti-inflammatory diet", "Omega-3 supplements", "Turmeric", "Stress reduction", "Adequate sleep"]
  },
  {
    id: "adrenal",
    name: "Adrenal PCOS",
    description: "Related to stress response and adrenal gland function rather than insulin resistance.",
    commonSymptoms: ["Stress sensitivity", "Fatigue", "Sleep issues", "Anxiety", "Normal insulin levels"],
    recommendations: ["Stress management", "Adaptogenic herbs", "Regular sleep schedule", "Mindfulness", "Vitamin B5"]
  },
  {
    id: "post-pill",
    name: "Post-Pill PCOS",
    description: "Occurs after stopping hormonal birth control, often temporary as hormones readjust.",
    commonSymptoms: ["Recent birth control discontinuation", "Sudden onset of symptoms", "Irregular periods", "Acne", "Hair issues"],
    recommendations: ["Patience", "Liver support", "Zinc", "Vitamin B complex", "Regular cycle tracking"]
  }
];

export const SYMPTOMS: Symptom[] = [
  {
    id: "irregular-periods",
    name: "Irregular Periods",
    description: "Cycles longer than 35 days or fewer than 8 cycles per year",
    category: "cycle"
  },
  {
    id: "acne",
    name: "Acne",
    description: "Persistent acne, especially on the jawline, chin, or upper neck",
    category: "physical"
  },
  {
    id: "hair-growth",
    name: "Excess Hair Growth",
    description: "Unwanted hair growth on face, chest, back, or other areas",
    category: "physical"
  },
  {
    id: "hair-loss",
    name: "Hair Thinning/Loss",
    description: "Hair thinning or loss, particularly on the scalp",
    category: "physical"
  },
  {
    id: "weight-gain",
    name: "Weight Gain",
    description: "Unexplained weight gain or difficulty losing weight",
    category: "physical"
  },
  {
    id: "fatigue",
    name: "Fatigue",
    description: "Persistent tiredness or lack of energy",
    category: "physical"
  },
  {
    id: "mood-changes",
    name: "Mood Changes",
    description: "Mood swings, anxiety, or depression",
    category: "mental"
  },
  {
    id: "sleep-issues",
    name: "Sleep Issues",
    description: "Difficulty falling asleep or staying asleep",
    category: "mental"
  },
  {
    id: "sugar-cravings",
    name: "Sugar Cravings",
    description: "Strong cravings for sugary foods",
    category: "physical"
  },
  {
    id: "brain-fog",
    name: "Brain Fog",
    description: "Difficulty concentrating or remembering things",
    category: "mental"
  }
];