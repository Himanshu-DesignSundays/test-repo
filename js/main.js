import { loadComponent } from './ui.js';
import { initRouter } from './router.js';

/** Starts shared components and the GitHub Pages-safe router. */
async function boot() {
  await loadComponent('#demo-banner', 'components/demo-banner.html');
  document.querySelector('[data-dismiss-demo]')?.addEventListener('click', () => document.querySelector('.demo-banner').remove());
  initRouter();
}

boot();
