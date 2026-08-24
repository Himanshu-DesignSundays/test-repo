export const DEMO = {
  member: { name: 'Rajesh Kumar', masked: 'RAJ••H K••AR', uan: '1010 1234 5678', dob: '15/06/1985', employer: 'ABC Pvt. Ltd.', office: 'RPFC Gurugram', exit: '10/04/2024 (Death)' },
  nominee: { name: 'Sunita Kumari', aadhaar: 'XXXX XXXX 5678', mobile: '+91 98XXXXXX23', relationship: 'Wife', dob: '22/09/1987', address: 'Sector 44, Gurugram, Haryana', email: 'sunita.demo@example.in', alternateMobile: '+91 97XXXXXX18' },
  bank: { name: 'State Bank of India · Sector 44', account: 'XXXX XXXX 5678', ifsc: 'SBIN0001234' },
  otp: '845621', claimId: 'EPFO-DC-2026-984210', draftId: 'DRAFT-24-05-2026-1123', helpId: 'EPFO-HELP-7731',
  benefits: [
    { key: 'epf', title: 'Provident Fund', code: 'EPF · Form 20', detail: 'Employee + employer savings and accrued interest.', value: '₹4,38,762', status: 'Available', icon: '₹' },
    { key: 'eps', title: 'Monthly Pension', code: 'EPS-95 · Form 10D', detail: 'Monthly support for the surviving spouse and eligible children.', value: '₹2,750 / month', status: 'Eligible', icon: '◉' },
    { key: 'edli', title: 'Life Insurance', code: 'EDLI · Form 5IF', detail: 'Insurance relief because the member died while in service.', value: '₹5,00,000', status: 'Eligible', icon: '♢' }
  ],
  documents: [
    { id: 'death', label: 'Death certificate', note: 'Issued by Registrar of Births & Deaths', required: true },
    { id: 'bank-proof', label: 'Bank passbook or cancelled cheque', note: 'Show name, account number and IFSC', required: true },
    { id: 'aadhaar-card', label: 'Nominee Aadhaar card', note: 'Front and back, clear and readable', required: true },
    { id: 'children', label: "Children's birth certificates", note: 'Age proof for pension eligibility', required: false },
    { id: 'photo', label: 'Joint photo of nominee and children', note: 'If pension benefits apply', required: false }
  ],
  stages: [
    ['Submitted', 'Claim received and acknowledgement issued.', '24 May 2026, 11:46 AM'],
    ['Under initial scrutiny', 'Details and documents are being checked.', 'Expected within 2 working days'],
    ['Field office processing', 'Your RPFC office will assess the bundled benefits.', 'Expected within 7–15 working days'],
    ['Payment dispatched', 'Approved benefits will be sent to your verified account.', 'After approval']
  ]
};
