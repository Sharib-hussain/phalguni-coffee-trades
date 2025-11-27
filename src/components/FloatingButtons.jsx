import { useState } from 'react';
import { generatePriceMessage } from '../utils/helpers';

export default function FloatingButtons({ 
  lang, 
  priceData, 
  onRefresh, 
  isLoading 
}) {
  const [copySuccess, setCopySuccess] = useState(false);

  const handleCopy = async () => {
    try {
      const message = generatePriceMessage(
        lang,
        document.getElementById('arabicaPrice')?.textContent || '—',
        document.getElementById('robustaPrice')?.textContent || '—',
        document.getElementById('arecanutPrice')?.textContent || '—',
        priceData?.latest?.date || new Date().toISOString().split('T')[0]
      );
      
      await navigator.clipboard.writeText(message);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      alert('Could not copy message. Please try again.');
    }
  };

  return (
    <>
      <button 
        id="fabRefresh"
        className={`fab fab-primary ${isLoading ? 'loading' : ''}`}
        onClick={onRefresh}
        title={lang === 'en' ? 'Refresh' : 'ರಿಫ್ರೆಶ್'}
        style={{ display: 'none' }}
      >
        ⟳
      </button>
      <button 
        id="copyMsg"
        className={`fab fab-secondary ${copySuccess ? 'copy-success' : ''}`}
        onClick={handleCopy}
        title={lang === 'en' ? 'Copy Price Message' : 'ಸಂದೇಶ ನಕಲಿಸಿ'}
      >
        📋
      </button>
    </>
  );
}
