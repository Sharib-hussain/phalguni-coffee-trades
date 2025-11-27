import { translations } from '../utils/translations';

export default function ContactCard({ lang }) {
  const t = translations[lang];
  
  return (
    <div style={{ marginTop: '18px' }}>
      <div className="card contact-card">
        <h2 className="contact-header">{t.contactHeader}</h2>
        <div className="contact-grid">
          <div className="contact-item">
            <div className="contact-name">{t.contact1}</div>
            <div className="contact-phone">{t.phone1}</div>
          </div>
          <div className="contact-item">
            <div className="contact-name">{t.contact2}</div>
            <div className="contact-phone">{t.phone2}</div>
          </div>
        </div>
        <div className="meta location">{t.location}</div>
      </div>
    </div>
  );
}
