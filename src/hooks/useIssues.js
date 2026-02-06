import { useState, useCallback, useRef } from 'react';
import { getIssues as fetchIssues } from '../api/issues';
import { normalizeIssue } from '../lib/encoding';

export function useIssues() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const timeoutRef = useRef(null);
  const previousIssuesRef = useRef([]);

  const loadIssues = useCallback(async () => {
    setLoading(true);
    setError(null);

    // 15s timeout
    const timeoutPromise = new Promise((_, reject) => {
      timeoutRef.current = setTimeout(
        () => reject(new Error('timeout')),
        15000,
      );
    });

    try {
      const data = await Promise.race([fetchIssues(), timeoutPromise]);
      clearTimeout(timeoutRef.current);
      if (data.success) {
        setIssues((data.issues || []).map(normalizeIssue));
      } else {
        setError(
          '\u0924\u0915\u094d\u0930\u093e\u0930\u0940 \u0932\u094b\u0921 \u0915\u0930\u0924\u093e \u0906\u0932\u094d\u092f\u093e \u0928\u093e\u0939\u0940\u0924',
        ); // तक्रारी लोड करता आल्या नाहीत
      }
    } catch (err) {
      clearTimeout(timeoutRef.current);
      if (err.message === 'timeout') {
        setError(
          '\u0924\u0915\u094d\u0930\u093e\u0930\u0940 \u0932\u094b\u0921 \u0939\u094b\u0923\u094d\u092f\u093e\u0938 \u0935\u0947\u0933 \u0932\u093e\u0917\u0924 \u0906\u0939\u0947',
        ); // तक्रारी लोड होण्यास वेळ लागत आहे
      } else {
        setError(
          '\u0928\u0947\u091f\u0935\u0930\u094d\u0915 \u0915\u0928\u0947\u0915\u094d\u0936\u0928 \u0924\u092a\u093e\u0938\u093e',
        ); // नेटवर्क कनेक्शन तपासा
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const updateIssueLocally = useCallback((issueNo, newStatus) => {
    setIssues((prev) => {
      previousIssuesRef.current = prev;
      return prev.map((issue) =>
        issue.issueNo == issueNo ? { ...issue, status: newStatus } : issue,
      );
    });
  }, []);

  const revertIssues = useCallback(() => {
    if (previousIssuesRef.current.length > 0) {
      setIssues(previousIssuesRef.current);
    }
  }, []);

  return { issues, loading, error, loadIssues, updateIssueLocally, revertIssues };
}
