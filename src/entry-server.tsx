import { renderToString } from 'react-dom/server';
import { createStaticHandler, createStaticRouter, StaticRouterProvider } from 'react-router-dom/server';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StrictMode } from 'react';
import { routes } from './routes';
import './index.css';

export async function render(url: string) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5,
        retry: 1,
      },
    },
  });

  const { query, dataRoutes } = createStaticHandler(routes);
  const request = new Request(`http://localhost${url}`);
  const context = await query(request);
  
  if (context instanceof Response) {
    throw context;
  }

  const router = createStaticRouter(dataRoutes, context);

  const html = renderToString(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <StaticRouterProvider router={router} context={context} />
      </QueryClientProvider>
    </StrictMode>
  );

  return { html };
}

