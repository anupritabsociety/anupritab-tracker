import { useState, useEffect, useCallback } from 'react';

export function useHashRouter(defaultPage = 'submit') {
  const getPage = () => {
    const hash = window.location.hash.replace('#', '');
    return hash === 'tracker' ? 'tracker' : defaultPage;
  };

  const [page, setPage] = useState(getPage);

  useEffect(() => {
    const onHashChange = () => setPage(getPage());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const navigateTo = useCallback(
    (newPage) => {
      if (newPage === page) return;
      window.location.hash = newPage;
      window.scrollTo(0, 0);
    },
    [page],
  );

  return { page, navigateTo };
}
