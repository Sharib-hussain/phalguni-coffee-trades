import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { translations } from '../utils/translations';
import './AdminPage.css';

export default function AdminPage({ lang, onLangToggle }) {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    arabicaPrice: '',
    robustaPrice: '',
    arecanutPrice: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleAdminAuth = (e) => {
    e.preventDefault();
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
    navigate('/');
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

      setSuccessMessage('Price added successfully!');
      
      setFormData({
        date: new Date().toISOString().split('T')[0],
        arabicaPrice: '',
        robustaPrice: '',
        arecanutPrice: ''
      });

      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error adding price:', err);
      setErrorMessage(err.message || 'An error occurred while adding the price');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="admin-page">
      <header className="admin-page-header">
        <div className="admin-header-content">
          <button 
            onClick={() => navigate('/')}
            className="back-button"
            title="Go back to home"
          >
            ← {lang === 'kn' ? 'ಹಿಂದಿರುಗಿ' : 'Back'}
          </button>
          
          <h1>{lang === 'kn' ? '🔐 ನಿರ್ವಾಹಕ ಪ್ಯಾನೆಲ್' : '🔐 Admin Panel'}</h1>
          
          <button 
            onClick={onLangToggle}
            className="lang-toggle-button"
          >
            {lang === 'kn' ? 'EN' : 'ಕನ್ನಡ'}
          </button>
        </div>
      </header>

      <main className="admin-page-main">
        {!isAdmin ? (
          <div className="admin-login-container">
            <div className="login-card">
              <h2>{lang === 'kn' ? 'ನಿರ್ವಾಹಕ ಲಾಗಿನ್' : 'Admin Login'}</h2>
              
              {!showPasswordInput && (
                <button 
                  onClick={() => setShowPasswordInput(true)}
                  className="login-button"
                >
                  {lang === 'kn' ? 'ಪ್ರವೇಶ ಪಡೆಯಿರಿ' : 'Get Access'}
                </button>
              )}

              {showPasswordInput && (
                <form onSubmit={handleAdminAuth} className="login-form">
                  {errorMessage && (
                    <div className="error-message">
                      {errorMessage}
                    </div>
                  )}
                  
                  <div className="form-group">
                    <label htmlFor="adminPassword">
                      {lang === 'kn' ? 'ಪಾಸ್‌ವರ್ಡ್' : 'Password'}
                    </label>
                    <input
                      type="password"
                      id="adminPassword"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      placeholder={lang === 'kn' ? 'ಪಾಸ್‌ವರ್ಡ್ ನಮೂದಿಸಿ' : 'Enter password'}
                      autoFocus
                      className="password-input"
                    />
                  </div>

                  <div className="login-button-group">
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
          </div>
        ) : (
          <div className="admin-form-container">
            <div className="form-header">
              <h2>{lang === 'kn' ? '✎ ಬೆಲೆ ಸೇರಿಸಿ' : '✎ Add Price'}</h2>
              <button 
                onClick={handleLogout}
                className="logout-button"
              >
                {lang === 'kn' ? '🔓 ನಿರ್ಗಮನ' : '🔓 Logout'}
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

            <form onSubmit={handleSubmit} className="price-form-admin">
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
                className="submit-button-large"
              >
                {isSubmitting 
                  ? (lang === 'kn' ? 'ಸೇರಿಸುತ್ತಿದೆ...' : 'Adding...') 
                  : (lang === 'kn' ? 'ಸೇರಿಸಿ' : 'Add Price')}
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
