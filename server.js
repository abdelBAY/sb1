import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import { createServer as createViteServer } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const isProduction = process.env.NODE_ENV === 'production';
const port = process.env.PORT || 5173;
const base = process.env.BASE || '/';

// Create http server
const createServer = async () => {
  const app = express();

  // Create Vite server
  let vite;
  if (!isProduction) {
    vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom',
      base,
    });
    // Use vite's connect instance as middleware
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist/client'), { index: false }));
  }

  app.use('*', async (req, res, next) => {
    const url = req.originalUrl.replace(base, '');

    try {
      let template;
      let render;

      if (!isProduction) {
        // Always read fresh template in dev
        template = await fs.readFile(path.resolve(__dirname, 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        const serverModule = await vite.ssrLoadModule('/src/entry-server.tsx');
        render = serverModule.render;
      } else {
        template = await fs.readFile(path.resolve(__dirname, 'dist/client/index.html'), 'utf-8');
        const serverModule = await import('./dist/server/entry-server.js');
        render = serverModule.render;
      }

      const rendered = await render(url);
      const html = template.replace('<div id="root"></div>', `<div id="root">${rendered.html}</div>`);

      res.status(200).set({ 'Content-Type': 'text/html' }).send(html);
    } catch (e) {
      vite?.ssrFixStacktrace(e);
      next(e);
    }
  });

  return { app };
};

createServer().then(({ app }) => {
  app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
  });
});

