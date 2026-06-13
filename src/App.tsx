import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Landing } from '@/pages/Landing';
import { Setup } from '@/pages/Setup';
import { Join } from '@/pages/Join';
import { Onboard } from '@/pages/Onboard';
import { PlanPage } from '@/pages/Plan';
import { NotFound } from '@/pages/NotFound';

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: 'var(--bg-panel)',
              border: '1px solid var(--border-accent)',
              color: 'var(--text-primary)',
              fontSize: '13px',
            },
          }}
        />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/setup" element={<Setup />} />
          <Route path="/join" element={<Join />} />
          <Route path="/session/:joinCode/onboard" element={<Onboard />} />
          <Route path="/session/:joinCode/plan" element={<PlanPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
