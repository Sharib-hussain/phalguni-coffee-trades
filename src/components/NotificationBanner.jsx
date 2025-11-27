import { translations } from '../utils/translations';

export default function NotificationBanner({ lang }) {
  return (
    <div className="notification-banner">
      <div className="notification-text">
        {translations[lang].note}
      </div>
    </div>
  );
}
