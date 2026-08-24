const KEY = 'benefitbridge_epfo_demo_state';

/** Reads the saved prototype journey, or starts a safe empty draft. */
export function getState() {
  const saved = localStorage.getItem(KEY);
  return saved ? JSON.parse(saved) : { step: 'welcome', forms: {}, uploads: {}, verified: {}, submitted: false, savedAt: null };
}

/** Merges a change into the saved journey and returns the new state. */
export function updateState(change) {
  const next = { ...getState(), ...change, savedAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) };
  localStorage.setItem(KEY, JSON.stringify(next));
  return next;
}

/** Removes the demo draft when a user intentionally starts a new claim. */
export function resetState() {
  localStorage.removeItem(KEY);
  return getState();
}
