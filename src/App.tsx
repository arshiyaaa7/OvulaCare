import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './providers/ThemeProvider';
import { AuthProvider } from './providers/AuthProvider';
import { Toaster } from '@/components/ui/toaster';
import { AssistantAvatar } from '@/components/ui/assistant-avatar';

import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { DashboardPage } from './pages/DashboardPage';
import { SymptomCheckerPage } from './pages/SymptomCheckerPage';
import { JournalPage } from './pages/JournalPage';
import { CycleTrackerPage } from './pages/CycleTrackerPage';
import { CommunityPage } from './pages/CommunityPage';
import { ConnectionTestPage } from './pages/ConnectionTestPage';
import { AuthDebugPage } from './pages/AuthDebugPage';
import { AIFeaturesPage } from './pages/AIFeaturesPage';

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="ovulacare-theme">
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<AuthPage isLogin={true} />} />
            <Route path="/signup" element={<AuthPage isLogin={false} />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/symptom-checker" element={<SymptomCheckerPage />} />
            <Route path="/journal" element={<JournalPage />} />
            <Route path="/cycle-tracker" element={<CycleTrackerPage />} />
            <Route path="/community" element={<CommunityPage />} />
            <Route path="/ai-features" element={<AIFeaturesPage />} />
            <Route path="/connection-test" element={<ConnectionTestPage />} />
            <Route path="/auth-debug" element={<AuthDebugPage />} />
          </Routes>
          <AssistantAvatar />
        </Router>
        <Toaster />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;