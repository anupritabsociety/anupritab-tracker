import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getIssues, verifyPin, submitComplaint, updateStatus } from '../issues';

vi.mock('../client', () => ({
  apiGet: vi.fn(),
  apiPost: vi.fn(),
}));

import { apiGet, apiPost } from '../client';

describe('API: issues', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('getIssues calls apiGet with correct action', async () => {
    apiGet.mockResolvedValue({ success: true, issues: [] });
    await getIssues();
    expect(apiGet).toHaveBeenCalledWith({ action: 'getIssues' });
  });

  it('verifyPin calls apiGet with pin', async () => {
    apiGet.mockResolvedValue({ valid: true });
    await verifyPin('1234');
    expect(apiGet).toHaveBeenCalledWith({ action: 'verifyPin', pin: '1234' });
  });

  it('submitComplaint calls apiPost with form data', async () => {
    const formData = { flat: '101', name: 'Test', description: 'Issue' };
    apiPost.mockResolvedValue({ success: true });
    await submitComplaint(formData);
    expect(apiPost).toHaveBeenCalledWith(formData);
  });

  it('updateStatus calls apiPost with correct params', async () => {
    apiPost.mockResolvedValue({ success: true });
    await updateStatus(42, 'progress');
    expect(apiPost).toHaveBeenCalledWith(
      { action: 'updateStatus', issueNo: 42, statusKey: 'progress' },
      { timeout: 10000 },
    );
  });

  it('getIssues returns response data', async () => {
    const mockData = { success: true, issues: [{ issueNo: 1 }] };
    apiGet.mockResolvedValue(mockData);
    const result = await getIssues();
    expect(result).toEqual(mockData);
  });

  it('verifyPin returns validation result', async () => {
    apiGet.mockResolvedValue({ valid: false });
    const result = await verifyPin('0000');
    expect(result.valid).toBe(false);
  });

  it('updateStatus returns result', async () => {
    apiPost.mockResolvedValue({ success: true });
    const result = await updateStatus(1, 'resolved');
    expect(result.success).toBe(true);
  });

  it('propagates errors from apiGet', async () => {
    apiGet.mockRejectedValue(new Error('Network error'));
    await expect(getIssues()).rejects.toThrow('Network error');
  });
});
