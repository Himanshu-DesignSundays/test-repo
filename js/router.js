import { renderView } from './views.js';
import { focusApp } from './ui.js';

/** Returns the route requested in the URL hash. */
export function getRoute() {
  return window.location.hash.replace('#/', '') || 'welcome';
}

/** Navigates using GitHub Pages-safe hash routing. */
export function go(route) {
  window.location.hash = `#/${route}`;
}

/** Renders the active route and restores focus after navigation. */
export function initRouter() {
  const render = () => { renderView(getRoute()); focusApp(); };
  window.addEventListener('hashchange', render);
  render();
}
