import { useState } from 'react';
import ComplaintForm from './ComplaintForm';
import SuccessCard from './SuccessCard';
import Footer from '../layout/Footer';
import { useAppContext } from '../../App';

export default function SubmitPage() {
  const { navigateTo, dispatch } = useAppContext();
  const [successResults, setSuccessResults] = useState(null);

  const handleSuccess = (results) => {
    setSuccessResults(results);
    dispatch({ type: 'RESET_TRACKER' });
  };

  return (
    <div className="max-w-[640px] mx-auto px-3.5 py-3 pb-[calc(56px+16px+env(safe-area-inset-bottom,0px))]">
      {successResults && (
        <SuccessCard
          results={successResults}
          onViewTracker={() => navigateTo('tracker')}
          onClose={() => setSuccessResults(null)}
        />
      )}

      <div className="text-base font-semibold text-text-primary mb-3.5 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-warning shrink-0" />
        {'\u0924\u0915\u094d\u0930\u093e\u0930 / \u0938\u0942\u091a\u0928\u093e \u0928\u094b\u0902\u0926\u0935\u093e'}
      </div>

      <ComplaintForm onSuccess={handleSuccess} />
      <Footer />
    </div>
  );
}
