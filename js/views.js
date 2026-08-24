import { DEMO } from './mock-data.js';
import { getState, updateState, resetState } from './state.js';
import { go } from './router.js';
import { toast, loadComponent } from './ui.js';

const order = ['welcome', 'identify', 'identity', 'benefits', 'explainer', 'checklist', 'upload', 'details', 'bank', 'review', 'esign', 'confirmation', 'tracker'];

/** Produces a standard route shell with progress, drafting status and support. */
function shell(step, title, intro, content) {
  const position = Math.max(order.indexOf(step), 0);
  const progress = step === 'welcome' ? '' : `<div class="progress" aria-label="Journey progress">${order.slice(1).map((item, index) => `<span class="${index <= position - 1 ? 'is-complete' : ''}"></span>`).join('')}</div><p class="progress-copy">Step ${position} of 12 · saved automatically</p>`;
  return `<section class="app-shell"><header class="app-header"><a class="brand" href="#/welcome" aria-label="BenefitBridge home"><span class="brand-mark">B</span>BenefitBridge</a><button class="help-link" type="button" data-open-support>Need help? <span aria-hidden="true">?</span></button></header>${progress}<div class="view-heading"><p class="eyebrow">DEATH-BENEFIT CLAIM · DEMO</p><h1>${title}</h1><p>${intro}</p></div>${content}<footer class="autosave">◷ Progress auto-saved${getState().savedAt ? ` at ${getState().savedAt}` : ''}. You can leave and resume anytime.</footer><button class="help-fab" type="button" data-open-support>◌ Need help?</button></section>`;
}

/** Builds the primary and optional secondary actions for a screen. */
function actions(primary, secondary = '') {
  return `<div class="actions"><button class="button button-primary" type="button" data-action="${primary.action}">${primary.label}</button>${secondary ? `<button class="button button-secondary" type="button" data-action="${secondary.action}">${secondary.label}</button>` : ''}</div>`;
}

/** Returns a benefit card using the single mock benefit catalogue. */
function benefitCard(benefit) {
  return `<article class="benefit-card"><span class="benefit-icon">${benefit.icon}</span><div><div class="card-top"><p class="card-title">${benefit.title}</p><span class="status good">✓ ${benefit.status}</span></div><p class="muted">${benefit.code}</p><p>${benefit.detail}</p><strong>${benefit.value}</strong></div></article>`;
}

/** Renders a standard labelled input and keeps native controls accessible. */
function field(id, label, type = 'text', value = '', hint = '') {
  const saved = getState().forms[id] ?? value;
  return `<div class="field"><label for="${id}">${label}</label><input id="${id}" name="${id}" type="${type}" value="${saved}" ${hint ? `aria-describedby="${id}-hint"` : ''}>${hint ? `<small id="${id}-hint">${hint}</small>` : ''}</div>`;
}

/** Renders the requested screen, then attaches its scoped interactions. */
export function renderView(route) {
  const app = document.querySelector('#app');
  const views = { welcome, identify, identity, benefits, explainer, checklist, upload, details, bank, review, esign, confirmation, tracker, recovery, resume };
  app.innerHTML = (views[route] || welcome)();
  bindActions();
  bindInputs();
  loadComponent('#support-mount', 'components/support-sheet.html').then(bindSupport);
}

/** Draws the welcoming entry screen. */
function welcome() {
  const content = `<div class="hero-card"><div class="comfort-icon">♡</div><p class="eyebrow">ONE GUIDED APPLICATION</p><h2>Claim EPF savings, pension and insurance — together.</h2><p>We’ll explain each step, check your documents early and save your progress if you need a break.</p><div class="need-list"><strong>Before you begin</strong><span>✓ Member UAN or PF Member ID</span><span>✓ Nominee Aadhaar-linked mobile</span><span>✓ Death certificate and bank proof</span></div>${actions({ action: 'start', label: 'Start claim · about 10–15 minutes' }, { action: 'resume', label: 'Track or resume a claim' })}</div><div id="support-mount"></div>`;
  return shell('welcome', 'Claim benefits of a deceased EPFO member', 'We’re sorry for your loss. This independent demo shows a clearer, safer claim journey.', content);
}

/** Draws the member lookup form and non-blocking CAPTCHA simulation. */
function identify() {
  const content = `<form class="form-card" data-form="identify"><div class="info-callout">ⓘ Enter the member’s details as they appear in EPFO records. This demo accepts the shown UAN.</div>${field('uan', 'UAN or PF Member ID', 'text', DEMO.member.uan, 'DEMO: use 1010 1234 5678')}${field('member-name', 'Full name of deceased member', 'text', DEMO.member.name)}${field('member-dob', 'Date of birth', 'text', DEMO.member.dob, 'DD/MM/YYYY')}<div class="captcha">☑ CAPTCHA simulated for demo <span>Auto-verified</span></div>${actions({ action: 'find-member', label: 'Find member record' }, { action: 'back', label: 'Back' })}</form><div id="support-mount"></div>`;
  return shell('identify', 'Identify the deceased member', 'We use this only to find the right benefit record.', content);
}

/** Draws identity verification and the visible demo OTP. */
function identity() {
  const content = `<form class="form-card" data-form="identity"><div class="match-card"><span class="avatar">S</span><div><strong>${DEMO.nominee.name}</strong><p>Registered nominee · ${DEMO.nominee.relationship}</p><small>Record linked to ${DEMO.member.masked}</small></div></div>${field('nominee-aadhaar', 'Nominee Aadhaar number', 'text', DEMO.nominee.aadhaar, 'Masked demo value; no real Aadhaar is used.')}${field('nominee-dob', 'Your date of birth', 'text', DEMO.nominee.dob)}<div class="otp-panel"><div><strong>Aadhaar OTP</strong><p>Sent to mobile ending in ••23</p></div><span class="demo-tag">DEMO OTP: ${DEMO.otp}</span>${field('otp', 'Enter the 6-digit OTP', 'text', '', 'OTP expires in 01:00')}</div>${actions({ action: 'verify-identity', label: 'Verify and continue' }, { action: 'back', label: 'Back' })}</form><div id="support-mount"></div>`;
  return shell('identity', 'Verify your identity', 'This confirms you are the authorized nominee before any claim details are shared.', content);
}

/** Shows calculated bundled benefits with an explicit processing state. */
function benefits() {
  const content = `<section class="content-stack"><div class="success-strip">✓ Record assessed · all eligible benefits are bundled in one claim.</div><div class="benefit-grid">${DEMO.benefits.map(benefitCard).join('')}</div><div class="info-callout">ⓘ Amounts are indicative in this demo. Final benefits follow document and field-office verification.</div>${actions({ action: 'continue-explainer', label: 'Continue with all eligible benefits' }, { action: 'back', label: 'Back' })}</section><div id="support-mount"></div>`;
  return shell('benefits', 'Your eligible benefits', 'We have assessed the member record. Here is what this application can include.', content);
}

/** Explains the benefit bundle in plain language before requesting documents. */
function explainer() {
  const content = `<section class="content-stack policy"><article><span>1</span><div><h2>EPF is the member’s accumulated savings</h2><p>A one-time amount including employee and employer contributions plus interest.</p></div></article><article><span>2</span><div><h2>EPS provides monthly support</h2><p>The member’s service history makes the surviving spouse eligible for a monthly pension.</p></div></article><article><span>3</span><div><h2>EDLI is life insurance relief</h2><p>It may be paid because the member passed away while still in service.</p></div></article><div class="warning-callout">! Employer record dependency: ABC Pvt. Ltd. must confirm the exit reason as “Death”. If that is missing, we will help you notify them without losing this draft.</div>${actions({ action: 'documents', label: 'Proceed to document checklist' }, { action: 'back', label: 'Back' })}</section><div id="support-mount"></div>`;
  return shell('explainer', 'Why these benefits are included', 'Before you upload anything, here’s what each benefit means for your family.', content);
}

/** Renders documents dynamically from the mock requirements catalogue. */
function checklist() {
  const required = DEMO.documents.map(doc => `<li><span class="file-badge">▤</span><div><strong>${doc.label}</strong><p>${doc.note}</p></div><span class="status ${doc.required ? 'required' : 'optional'}">${doc.required ? 'Required' : 'If applicable'}</span></li>`).join('');
  const content = `<section class="content-stack"><ul class="checklist">${required}</ul><div class="info-callout">ⓘ Files can be JPG, PNG or PDF, up to 5 MB each. We check clarity before submission to avoid a later rejection.</div>${actions({ action: 'upload-documents', label: 'I have these documents' }, { action: 'back', label: 'Back' })}</section><div id="support-mount"></div>`;
  return shell('checklist', 'Documents to prepare', 'Only documents relevant to this claim are shown here.', content);
}

/** Renders the high-stakes uploader with validation and a recovery link. */
function upload() {
  const state = getState();
  const cards = DEMO.documents.slice(0, 3).map(doc => `<article class="upload-card"><div><strong>${doc.label}</strong><p>JPG, PNG or PDF · maximum 5 MB</p></div><label class="upload-control" for="${doc.id}"><span>${state.uploads[doc.id] ? '✓ File checked — clear enough' : 'Choose a file'}</span><input id="${doc.id}" type="file" accept=".jpg,.jpeg,.png,.pdf" data-upload="${doc.id}"></label><p class="upload-message" id="${doc.id}-message" aria-live="polite">${state.uploads[doc.id] ? '✓ Uploaded and verified readable.' : 'No file selected yet.'}</p></article>`).join('');
  const content = `<section class="content-stack"><div class="info-callout">ⓘ Upload a clear, original scan. If a document looks blurry, we’ll tell you before submission.</div>${cards}<button class="text-button" type="button" data-action="show-upload-error">My document keeps failing to upload</button>${actions({ action: 'continue-details', label: 'Continue to claim details' }, { action: 'back', label: 'Back' })}</section><div id="support-mount"></div>`;
  return shell('upload', 'Upload and check documents', 'Your documents stay in this demo browser session and are never sent anywhere.', content);
}

/** Shows pre-filled records while leaving practical contact fields editable. */
function details() {
  const content = `<form class="form-card" data-form="details"><section class="record-section"><h2>Member details</h2><dl><dt>Name</dt><dd>${DEMO.member.name}</dd><dt>UAN</dt><dd>${DEMO.member.uan}</dd><dt>Last employer</dt><dd>${DEMO.member.employer}</dd><dt>Date of exit</dt><dd>${DEMO.member.exit}</dd></dl></section><section class="record-section"><h2>Nominee details</h2><dl><dt>Name</dt><dd>${DEMO.nominee.name}</dd><dt>Relationship</dt><dd>${DEMO.nominee.relationship}</dd><dt>Address</dt><dd>${DEMO.nominee.address}</dd></dl></section>${field('email', 'Contact email', 'email', DEMO.nominee.email)}${field('alternate-mobile', 'Alternative mobile number', 'tel', DEMO.nominee.alternateMobile, 'Used only if the Aadhaar-linked number is unavailable.')}${actions({ action: 'save-details', label: 'Save and continue' }, { action: 'back', label: 'Back' })}</form><div id="support-mount"></div>`;
  return shell('details', 'Review member and relationship details', 'Verified information is pre-filled so you only need to confirm contact details.', content);
}

/** Collects bank fields and sets up the mock verification. */
function bank() {
  const content = `<form class="form-card" data-form="bank">${field('account-holder', 'Account holder name', 'text', DEMO.nominee.name, 'Must match the nominee name.')}${field('bank-name', 'Bank name and branch', 'text', DEMO.bank.name)}${field('account-number', 'Account number', 'text', DEMO.bank.account)}${field('confirm-account', 'Confirm account number', 'text', DEMO.bank.account)}${field('ifsc', 'IFSC code', 'text', DEMO.bank.ifsc)}<div class="choice-card"><input id="penny-drop" type="radio" name="verification" checked><label for="penny-drop"><strong>Penny drop verification (recommended)</strong><span>We simulate sending ₹1 to check this account.</span></label></div>${actions({ action: 'verify-bank', label: 'Verify bank account' }, { action: 'back', label: 'Back' })}</form><div id="support-mount"></div>`;
  return shell('bank', 'Verify bank account for benefit payment', 'Payments are only sent after the nominee account has been checked.', content);
}

/** Summarises the claim and requests a clear final confirmation. */
function review() {
  const rows = [['Member account', 'Matched'], ['Nominee identity', 'Verified'], ['Eligible benefits', 'EPF + EPS + EDLI'], ['Documents', 'Checked'], ['Bank account', 'Verified']].map(([label, value]) => `<li><span>${label}</span><strong>✓ ${value}</strong></li>`).join('');
  const content = `<section class="content-stack"><div class="review-card"><div class="card-top"><h2>Claim review</h2><span class="status good">Ready</span></div><ul class="review-list">${rows}</ul></div><div class="success-strip">✓ Pre-flight validation passed. Estimated processing after submission: 7–15 working days.</div>${actions({ action: 'to-esign', label: 'Perform e-sign and submit' }, { action: 'back', label: 'Back' })}</section><div id="support-mount"></div>`;
  return shell('review', 'Review and confirm your claim', 'Everything has a clear check before you take the final legally binding step.', content);
}

/** Shows e-sign consent before a mock pending and submission state. */
function esign() {
  const content = `<form class="form-card" data-form="esign"><div class="success-strip">✓ In a real service, Aadhaar e-sign is provided by UIDAI. This prototype only simulates that approval.</div><section class="record-section"><h2>Signing as</h2><dl><dt>Nominee</dt><dd>${DEMO.nominee.name}</dd><dt>Mobile</dt><dd>${DEMO.nominee.mobile}</dd><dt>Claim type</dt><dd>Unified death-benefit claim</dd></dl></section><div class="otp-panel"><strong>e-sign OTP</strong><p>DEMO OTP: ${DEMO.otp} · no real OTP is sent.</p>${field('esign-otp', 'Enter e-sign OTP', 'text', '')}</div><label class="consent"><input id="declaration" type="checkbox"> <span>I declare that the information I have provided is true to the best of my knowledge.</span></label>${actions({ action: 'submit-claim', label: 'E-sign and submit claim' }, { action: 'back', label: 'Back' })}</form><div id="support-mount"></div>`;
  return shell('esign', 'Sign and submit your claim', 'This is the final confirmation. Your saved draft remains available until submission succeeds.', content);
}

/** Displays an unambiguous success receipt with downstream actions. */
function confirmation() {
  const content = `<section class="content-stack centered"><div class="confirmation-mark">✓</div><h2>Your claim has been submitted</h2><p>We created a reference immediately so you do not have to wonder whether the submission worked.</p><article class="receipt-card"><p class="eyebrow">CLAIM REFERENCE · DEMO</p><strong>${DEMO.claimId}</strong><hr><dl><dt>Submitted on</dt><dd>24 May 2026, 11:46 AM</dd><dt>Applicant</dt><dd>${DEMO.nominee.name}</dd><dt>Member</dt><dd>${DEMO.member.name}</dd></dl></article><div class="info-callout">ⓘ A real deployment would send SMS and email updates. This demo does not contact anyone.</div>${actions({ action: 'track', label: 'Track claim status' }, { action: 'download', label: 'Download acknowledgement' })}</section><div id="support-mount"></div>`;
  return shell('confirmation', 'Claim submitted successfully', 'Keep this reference handy if you contact support.', content);
}

/** Draws a transparent, multi-stage tracking timeline. */
function tracker() {
  const items = DEMO.stages.map(([name, detail, time], index) => `<li class="${index === 0 ? 'done' : index === 1 ? 'active' : ''}"><span class="timeline-dot">${index === 0 ? '✓' : index + 1}</span><div><div class="card-top"><strong>${name}</strong><span class="status ${index === 0 ? 'good' : index === 1 ? 'pending' : 'optional'}">${index === 0 ? 'Complete' : index === 1 ? 'In progress' : 'Pending'}</span></div><p>${detail}</p><small>${time}</small></div></li>`).join('');
  const content = `<section class="content-stack"><article class="claim-chip"><p class="eyebrow">CLAIM ID · DEMO</p><strong>${DEMO.claimId}</strong><span>${DEMO.member.name} · ${DEMO.office}</span></article><ol class="timeline">${items}</ol><div class="info-callout">ⓘ Expected end-to-end time: 7–15 working days after submission. You will see a clear action card here if anything is needed.</div>${actions({ action: 'help', label: 'Get claim support' }, { action: 'home', label: 'Return home' })}</section><div id="support-mount"></div>`;
  return shell('tracker', 'Track your claim', 'See the current stage, who is reviewing it, and what happens next.', content);
}

/** Provides every recovery promise required by the prototype rules. */
function recovery() {
  const content = `<section class="content-stack"><div class="error-card" role="alert"><span>!</span><div><h2>Your document could not be uploaded</h2><p><strong>What happened:</strong> The file is larger than 5 MB or too blurry for a clear check.</p><p><strong>Who can fix it:</strong> You can replace the scan; no EPFO office action is needed.</p><p><strong>What to do:</strong> Scan again in good light, save as PDF/JPG below 5 MB, then upload it here.</p><p><strong>How long it takes:</strong> The new file is checked in under a minute.</p></div></div><div class="success-strip">✓ Your draft and completed checks are saved. Nothing has been lost.</div>${actions({ action: 'return-upload', label: 'Upload a clearer document' }, { action: 'support', label: 'Create support snapshot' })}</section><div id="support-mount"></div>`;
  return shell('recovery', 'A clear recovery path', 'We explain the problem and keep the work you have already completed.', content);
}

/** Lets returning citizens restart at their saved place without data loss. */
function resume() {
  const state = getState();
  const route = state.step === 'welcome' ? 'identify' : state.step;
  const content = `<section class="content-stack"><article class="resume-card"><span class="avatar">S</span><div><p class="eyebrow">SAVED DRAFT · DEMO</p><h2>Welcome back, ${DEMO.nominee.name.split(' ')[0]}</h2><p>Your claim draft ${DEMO.draftId} was saved ${state.savedAt || 'recently'}.</p><div class="mini-progress"><span></span></div><strong>Completed checks remain available</strong></div></article><div class="info-callout">ⓘ This demo restores a browser-only draft. A real service would verify your identity before showing personal details.</div>${actions({ action: `resume-${route}`, label: 'Resume application' }, { action: 'new-claim', label: 'Start a new claim' })}</section><div id="support-mount"></div>`;
  return shell('resume', 'Your saved claim is ready', 'You can continue from where you left off without re-entering completed details.', content);
}

/** Connects screen buttons to state changes and hash routes. */
function bindActions() {
  document.querySelectorAll('[data-action]').forEach(button => button.addEventListener('click', () => handleAction(button.dataset.action)));
}

/** Routes a named UI action while ensuring every transition saves progress. */
function handleAction(action) {
  const routes = { start: 'identify', resume: 'resume', back: previousRoute(), 'continue-explainer': 'explainer', documents: 'checklist', 'upload-documents': 'upload', 'continue-details': 'details', 'save-details': 'bank', 'to-esign': 'esign', track: 'tracker', help: 'tracker', home: 'welcome', 'return-upload': 'upload', support: 'tracker' };
  if (routes[action]) return navigate(routes[action]);
  if (action.startsWith('resume-')) return navigate(action.replace('resume-', ''));
  const handlers = { 'find-member': findMember, 'verify-identity': verifyIdentity, 'verify-bank': verifyBank, 'submit-claim': submitClaim, download: downloadReceipt, 'show-upload-error': () => go('recovery'), 'new-claim': newClaim };
  handlers[action]?.();
}

/** Finds the mock record after displaying an honest pending state. */
function findMember() {
  process('Searching the demo EPFO member record…', () => { updateState({ verified: { ...getState().verified, member: true } }); toast(`Record found: ${DEMO.member.masked}`); navigate('identity'); });
}

/** Checks the visible demo OTP and directs users to a specific recovery path. */
function verifyIdentity() {
  const otp = document.querySelector('#otp')?.value.trim();
  if (otp !== DEMO.otp) return toast(`Use the visible demo OTP: ${DEMO.otp}`);
  process('Verifying your identity with the demo service…', () => { updateState({ verified: { ...getState().verified, identity: true } }); navigate('benefits'); });
}

/** Simulates a bank name match and retains the saved form afterwards. */
function verifyBank() {
  process('Checking nominee name and bank account…', () => { updateState({ verified: { ...getState().verified, bank: true } }); toast('✓ Bank account verified for demo payout'); navigate('review'); });
}

/** Requires consent, then mimics a server submission with an outcome. */
function submitClaim() {
  if (!document.querySelector('#declaration')?.checked) return toast('Please confirm the declaration before submitting.');
  if (document.querySelector('#esign-otp')?.value.trim() !== DEMO.otp) return toast(`Use the visible demo e-sign OTP: ${DEMO.otp}`);
  process('Submitting your signed claim and creating a reference…', () => { updateState({ submitted: true, step: 'confirmation' }); navigate('confirmation'); });
}

/** Displays a bounded loading overlay and makes slow behaviour transparent. */
function process(message, complete) {
  const overlay = document.createElement('div');
  overlay.className = 'processing-overlay';
  overlay.innerHTML = `<div class="processing-card" role="status" aria-live="polite"><span class="spinner"></span><strong>${message}</strong><p>Your draft is saved while we wait.</p></div>`;
  document.body.append(overlay);
  setTimeout(() => { overlay.remove(); complete(); }, 1800);
}

/** Records the active step then moves to the requested route. */
function navigate(route) {
  updateState({ step: route });
  go(route);
}

/** Maps a screen to its predecessor without relying on browser history. */
function previousRoute() {
  const current = window.location.hash.replace('#/', '') || 'welcome';
  const index = order.indexOf(current);
  return index > 0 ? order[index - 1] : 'welcome';
}

/** Clears the persisted draft only after an intentional fresh-start action. */
function newClaim() {
  resetState();
  toast('A new demo draft is ready.');
  go('welcome');
}

/** Makes a local acknowledgement file without relying on a server. */
function downloadReceipt() {
  const file = new Blob([`BenefitBridge demo acknowledgement\nClaim reference: ${DEMO.claimId}\nThis is not an official EPFO document.`], { type: 'text/plain' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(file); link.download = 'benefitbridge-demo-acknowledgement.txt'; link.click(); URL.revokeObjectURL(link.href);
  toast('Demo acknowledgement downloaded.');
}

/** Validates basic upload constraints locally before accepting a mock document. */
function bindInputs() {
  document.querySelectorAll('[data-upload]').forEach(input => input.addEventListener('change', () => validateUpload(input)));
  document.querySelectorAll('input:not([type="file"]):not([type="checkbox"]):not([type="radio"])').forEach(input => input.addEventListener('input', () => saveField(input)));
}

/** Saves field edits immediately so a refresh never silently removes a draft. */
function saveField(input) {
  updateState({ forms: { ...getState().forms, [input.id]: input.value } });
}

/** Checks size and type locally, preserving a successful document state. */
function validateUpload(input) {
  const file = input.files[0]; const message = document.querySelector(`#${input.id}-message`);
  if (!file) return;
  if (file.size > 5 * 1024 * 1024 || !/(pdf|png|jpe?g)$/i.test(file.name)) { message.textContent = 'This file cannot be checked. Use a clear JPG, PNG or PDF under 5 MB.'; return; }
  updateState({ uploads: { ...getState().uploads, [input.dataset.upload]: true } });
  message.textContent = `✓ ${file.name} uploaded and checked for readability.`; toast('Document checked successfully.');
}

/** Wires the fetched support component after it becomes available. */
function bindSupport() {
  const sheet = document.querySelector('.support-sheet');
  document.querySelectorAll('[data-open-support]').forEach(button => button.addEventListener('click', () => { sheet.hidden = false; }));
  sheet?.querySelector('[data-close-support]')?.addEventListener('click', () => { sheet.hidden = true; });
  sheet?.querySelectorAll('[data-diagnostic]').forEach(button => button.addEventListener('click', () => { sheet.hidden = true; toast(`${DEMO.helpId}: ${button.dataset.diagnostic}. Share this snapshot with 14470.`); }));
}
