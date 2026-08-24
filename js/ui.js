/** Fetches a reusable HTML component into an element, if the mount is present. */
export async function loadComponent(selector, path) {
  const mount = document.querySelector(selector);
  if (!mount) return;
  const response = await fetch(path);
  if (!response.ok) return;
  const markup = await response.text();
  if (document.querySelector(selector) !== mount) return;
  mount.innerHTML = markup;
}

/** Shows an accessible, temporary message. */
export function toast(message) {
  const region = document.querySelector('#toast-region');
  region.textContent = message;
  region.classList.add('is-visible');
  setTimeout(() => region.classList.remove('is-visible'), 4200);
}

/** Sets the current page focus to make route changes clear to keyboard users. */
export function focusApp() {
  document.querySelector('#app').focus();
}
