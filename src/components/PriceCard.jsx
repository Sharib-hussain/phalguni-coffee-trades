import { formatPrice } from '../utils/helpers';

export default function PriceCard({ type, price, date, translations, lang }) {
  const typeText = translations[lang][type.toLowerCase()];
  
  return (
    <div className="card">
      <div>
        <div className="type">{typeText}</div>
        <div className="price">{formatPrice(price)}</div>
      </div>
      <div className="meta">{translations[lang].lastUpdated} {date}</div>
    </div>
  );
}
