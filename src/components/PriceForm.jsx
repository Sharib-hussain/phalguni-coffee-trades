import { useState } from 'react';
import { translations } from '../utils/translations';

export default function PriceForm({ lang, onSuccess, onError }) {
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
      <h2>{lang === 'kn' ? 'ಬೆಲೆ ಸೇರಿಸಿ' : 'Add Price'}</h2>
      
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
  );
}
