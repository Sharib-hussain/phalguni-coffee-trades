import { useState, useEffect } from 'react';
import './styles/App.css';
import { translations } from './utils/translations';
import { fetchPrices } from './utils/api';
import Header from './components/Header';
import NotificationBanner from './components/NotificationBanner';
import PriceCard from './components/PriceCard';
import PriceHistory from './components/PriceHistory';
import PriceForm from './components/PriceForm';
import ContactCard from './components/ContactCard';
import Footer from './components/Footer';
import FloatingButtons from './components/FloatingButtons';

export default function App() {
  const [lang, setLang] = useState(() => {
    const userLang = navigator.language.startsWith('kn') ? 'kn' : 'en';
    return userLang;
  });
  
  const [priceData, setPriceData] = useState({
    latest: null,
    history: []
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const handleFetchPrices = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchPrices();
      setPriceData(data);
    } catch (err) {
      console.error('Failed to fetch prices:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleFetchPrices();
  }, []);

  const latest = priceData.latest || {
    arabica: '—',
    robusta: '—',
    arecanut: '—',
    date: '—'
  };

  return (
    <>
      <NotificationBanner lang={lang} />
      <div className="wrap" style={{ marginTop: '50px' }}>
        <Header 
          lang={lang} 
          onLangToggle={() => setLang(lang === 'en' ? 'kn' : 'en')}
        />

        <main>
          <div className="grid">
            <PriceCard 
              type="arabica"
              price={latest.arabica}
              date={latest.date}
              translations={translations}
              lang={lang}
            />
            <PriceCard 
              type="robusta"
              price={latest.robusta}
              date={latest.date}
              translations={translations}
              lang={lang}
            />
            <PriceCard 
              type="arecanut"
              price={latest.arecanut}
              date={latest.date}
              translations={translations}
              lang={lang}
            />
          </div>

          <PriceHistory 
            data={priceData.history}
            lang={lang}
            translations={translations}
          />

          <PriceForm 
            lang={lang}
            onSuccess={handleFetchPrices}
            onError={(err) => setError(err.message)}
          />

          <ContactCard lang={lang} />
        </main>

        <Footer lang={lang} />
      </div>

      <FloatingButtons 
        lang={lang}
        priceData={priceData}
        onRefresh={handleFetchPrices}
        isLoading={isLoading}
      />
    </>
  );
}
