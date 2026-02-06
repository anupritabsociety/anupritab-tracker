import { apiGet, apiPost } from './client';

export async function getIssues() {
  return apiGet({ action: 'getIssues' });
}

export async function verifyPin(pin) {
  return apiGet({ action: 'verifyPin', pin });
}

export async function submitComplaint(formData) {
  return apiPost(formData);
}

export async function updateStatus(issueNo, statusKey) {
  return apiPost({ action: 'updateStatus', issueNo, statusKey });
}
