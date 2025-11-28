import { useState } from 'react';
import { translations } from '../utils/translations';

export default function PriceForm({ lang, onSuccess, onError }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  
  const [formData, setFormData] = useState({
    cropName: '',
    date: new Date().toISOString().split('T')[0],
    arabicaPrice: '',
    robustaPrice: '',
    arecanutPrice: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const t = translations[lang] || translations.en;

  const handleAdminAuth = (e) => {
    e.preventDefault();
    // Simple password check (use environment variable for production)
    const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123';
    if (adminPassword === ADMIN_PASSWORD) {
      setIsAdmin(true);
      setShowPasswordInput(false);
      setAdminPassword('');
      setErrorMessage('');
    } else {
      setErrorMessage(lang === 'kn' ? 'ತಪ್ಪು ಪಾಸ್‌ವರ್ಡ್' : 'Incorrect password');
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
    setShowPasswordInput(false);
    setAdminPassword('');
    setSuccessMessage('');
    setErrorMessage('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      // Validate required fields
      if (!formData.date || !formData.arabicaPrice || !formData.robustaPrice) {
        throw new Error('Please fill in all required fields (date, arabica price, robusta price)');
      }

      const response = await fetch('/api/add-price', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: formData.date,
          arabica: formData.arabicaPrice,
          robusta: formData.robustaPrice,
          arecanut: formData.arecanutPrice || '—'
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add price');
      }

      const data = await response.json();
      setSuccessMessage('Price added successfully!');
      
      // Reset form
      setFormData({
        cropName: '',
        date: new Date().toISOString().split('T')[0],
        arabicaPrice: '',
        robustaPrice: '',
        arecanutPrice: ''
      });

      if (onSuccess) {
        onSuccess();
      }

      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error adding price:', err);
      setErrorMessage(err.message || 'An error occurred while adding the price');
      
      if (onError) {
        onError(err);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="price-form-container">
      {!isAdmin ? (
        <div className="admin-login">
          <h2>{lang === 'kn' ? '🔐 ನಿರ್ವಾಹಕ ಲಾಗಿನ್' : '🔐 Admin Login'}</h2>
          
          {!showPasswordInput && (
            <button 
              onClick={() => setShowPasswordInput(true)}
              className="admin-unlock-button"
            >
              {lang === 'kn' ? '✎ ಬೆಲೆ ಸೇರಿಸಿ' : '✎ Add Price'}
            </button>
          )}

          {showPasswordInput && (
            <form onSubmit={handleAdminAuth} className="admin-form">
              {errorMessage && (
                <div className="error-message">
                  {errorMessage}
                </div>
              )}
              
              <div className="form-group">
                <label htmlFor="adminPassword">
                  {lang === 'kn' ? 'ನಿರ್ವಾಹಕ ಪಾಸ್‌ವರ್ಡ್' : 'Admin Password'}
                </label>
                <input
                  type="password"
                  id="adminPassword"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder={lang === 'kn' ? 'ಪಾಸ್‌ವರ್ಡ್ ನಮೂದಿಸಿ' : 'Enter password'}
                  autoFocus
                />
              </div>

              <div className="admin-button-group">
                <button type="submit" className="submit-button">
                  {lang === 'kn' ? 'ಪ್ರವೇಶ' : 'Login'}
                </button>
                <button 
                  type="button" 
                  onClick={() => {
                    setShowPasswordInput(false);
                    setAdminPassword('');
                    setErrorMessage('');
                  }}
                  className="cancel-button"
                >
                  {lang === 'kn' ? 'ರದ್ದು ಮಾಡಿ' : 'Cancel'}
                </button>
              </div>
            </form>
          )}
        </div>
      ) : (
        <div>
          <div className="admin-header">
            <h2>{lang === 'kn' ? '✎ ಬೆಲೆ ಸೇರಿಸಿ' : '✎ Add Price'}</h2>
            <button 
              onClick={handleLogout}
              className="logout-button"
            >
              {lang === 'kn' ? 'ನಿರ್ಗಮನ' : 'Logout'}
            </button>
          </div>
      
          {successMessage && (
            <div className="success-message">
              {successMessage}
            </div>
          )}

          {errorMessage && (
            <div className="error-message">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="price-form">
            <div className="form-group">
              <label htmlFor="date">
                {lang === 'kn' ? 'ದಿನಾಂಕ' : 'Date'} *
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="arabicaPrice">
                {lang === 'kn' ? 'ಅರೇಬಿಕಾ ಬೆಲೆ' : 'Arabica Price'} *
              </label>
              <input
                type="number"
                id="arabicaPrice"
                name="arabicaPrice"
                value={formData.arabicaPrice}
                onChange={handleChange}
                placeholder="Enter price"
                step="0.01"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="robustaPrice">
                {lang === 'kn' ? 'ರೋಬಸ್ಟಾ ಬೆಲೆ' : 'Robusta Price'} *
              </label>
              <input
                type="number"
                id="robustaPrice"
                name="robustaPrice"
                value={formData.robustaPrice}
                onChange={handleChange}
                placeholder="Enter price"
                step="0.01"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="arecanutPrice">
                {lang === 'kn' ? 'ಅರೆಕಾ ಗಿಡಿ ಬೆಲೆ' : 'Arecanut Price'}
              </label>
              <input
                type="number"
                id="arecanutPrice"
                name="arecanutPrice"
                value={formData.arecanutPrice}
                onChange={handleChange}
                placeholder="Enter price (optional)"
                step="0.01"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="submit-button"
            >
              {isSubmitting 
                ? (lang === 'kn' ? 'ಸೇರಿಸುತ್ತಿದೆ...' : 'Adding...') 
                : (lang === 'kn' ? 'ಸೇರಿಸಿ' : 'Add Price')}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
