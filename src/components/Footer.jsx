import { translations } from '../utils/translations';

export default function Footer({ lang }) {
  const t = translations[lang];
  
  return (
    <footer>
      <div className="small">{t.footer1}</div>
      <div className="small">{t.footer2}</div>
    </footer>
  );
}
