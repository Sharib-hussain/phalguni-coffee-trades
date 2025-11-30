import { translations } from '../utils/translations';

export default function Header({ lang, onLangToggle }) {
  const handleAdminClick = () => {
    window.location.hash = '#/admin';
  };

  return (
    <header>
      <div className="header-top">
        <div className="logo">PC</div>
        <div className="controls">
          <button 
            id="langToggle" 
            className="btn btn-secondary"
            onClick={onLangToggle}
          >
            {lang === 'en' ? '🇮🇳 ಕನ್ನಡ' : '🇬🇧 English'}
          </button>
          <button 
            id="adminBtn" 
            className="btn btn-admin"
            onClick={handleAdminClick}
            title="Admin Panel"
          >
            ⚙️ Admin
          </button>
        </div>
      </div>
      <div>
        <h1>{translations[lang].title}</h1>
        <p className="lead">{translations[lang].subtitle}</p>
      </div>
    </header>
  );
}
