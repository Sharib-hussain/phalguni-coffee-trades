import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './styles/App.css';
import { translations } from './utils/translations';
import { fetchPrices } from './utils/api';
import Header from './components/Header';
import NotificationBanner from './components/NotificationBanner';
import PriceCard from './components/PriceCard';
import PriceHistory from './components/PriceHistory';
import ContactCard from './components/ContactCard';
import Footer from './components/Footer';
import FloatingButtons from './components/FloatingButtons';
import AdminPage from './pages/AdminPage';

function HomePage({ lang, onLangToggle, priceData, handleFetchPrices, isLoading }) {
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
          onLangToggle={onLangToggle}
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

          <div className="admin-link-container">
            <Link to="/admin" className="admin-link">
              {lang === 'kn' ? '🔐 ಬೆಲೆ ಸೇರಿಸಿ' : '🔐 Add Price'}
            </Link>
          </div>

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

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const handleFetchPrices = async () => {
    setIsLoading(true);
    try {
      const data = await fetchPrices();
      setPriceData(data);
    } catch (err) {
      console.error('Failed to fetch prices:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleFetchPrices();
  }, []);

  return (
    <Router basename="/phalguni-coffee-trades">
      <Routes>
        <Route 
          path="/" 
          element={
            <HomePage 
              lang={lang}
              onLangToggle={() => setLang(lang === 'en' ? 'kn' : 'en')}
              priceData={priceData}
              handleFetchPrices={handleFetchPrices}
              isLoading={isLoading}
            />
          }
        />
        <Route 
          path="/admin" 
          element={
            <AdminPage 
              lang={lang}
              onLangToggle={() => setLang(lang === 'en' ? 'kn' : 'en')}
            />
          }
        />
      </Routes>
    </Router>
  );
}
