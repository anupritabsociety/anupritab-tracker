export const SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbyKE2nB5BRQv_lnNsDc2-ZVcEc9OaOVf4icp6vHv9kA5lUZBVnckG109u9ejb4MKg7a/exec';

export async function apiGet(params) {
  const url = SCRIPT_URL + '?' + new URLSearchParams(params).toString();
  const res = await fetch(url);
  const text = await res.text();
  return JSON.parse(text);
}

export async function apiPost(body) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);
  try {
    const res = await fetch(SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    const text = await res.text();
    return JSON.parse(text);
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      throw new Error('timeout');
    }
    throw err;
  }
}
