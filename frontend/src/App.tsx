/**
 * Digital Health Competency Framework App
 * Version: 1.0.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Layout } from '@/components/layout/Layout';
import { HomePage } from '@/pages/HomePage';
import { CompetenciesPage } from '@/pages/CompetenciesPage';
import { RolesPage } from '@/pages/RolesPage';
import { LearningModulesPage } from '@/pages/LearningModulesPage';
import { MappingsPage } from '@/pages/MappingsPage';

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/competencies" element={<CompetenciesPage />} />
            <Route path="/roles" element={<RolesPage />} />
            <Route path="/learning-modules" element={<LearningModulesPage />} />
            <Route path="/mappings" element={<MappingsPage />} />
          </Routes>
        </Layout>
      </Router>
    </QueryClientProvider>
  );
}

export default App;