import { StrictMode } from 'react';
import { hydrateRoot, createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { routes } from './routes';
import './lib/i18n';
import './index.css';
import { registerServiceWorker } from './utils/serviceWorker';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

const router = createBrowserRouter(routes);

const App = (
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>
);

// Use hydrateRoot for SSR hydration, fallback to createRoot for client-only
const rootElement = document.getElementById('root')!;
if (rootElement.hasChildNodes()) {
  // SSR: Hydrate the existing server-rendered content
  hydrateRoot(rootElement, App);
} else {
  // Client-only: Render from scratch
  createRoot(rootElement).render(App);
}

// Register service worker for offline support
if (import.meta.env.PROD) {
  registerServiceWorker();
}