import { useState } from 'react';
import '../styles/AdminPanel.css';

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [form, setForm] = useState({
    date: new Date().toISOString().split('T')[0],
    arabica: '',
    robusta: '',
    arecanut: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD;
    
    if (password === adminPassword) {
      setIsAuthenticated(true);
      setPassword('');
      setMessage('');
    } else {
      setMessage('Invalid password');
      setMessageType('error');
      setPassword('');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch('/api/updateSheet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message || 'Price updated successfully!');
        setMessageType('success');
        setForm({
          date: new Date().toISOString().split('T')[0],
          arabica: '',
          robusta: '',
          arecanut: ''
        });
      } else {
        setMessage(data.error || 'Failed to update price');
        setMessageType('error');
      }
    } catch (error) {
      setMessage('Error: ' + error.message);
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword('');
    setMessage('');
    setForm({
      date: new Date().toISOString().split('T')[0],
      arabica: '',
      robusta: '',
      arecanut: ''
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="admin-container">
        <div className="admin-card">
          <h2>Admin Login</h2>
          <form onSubmit={handlePasswordSubmit} className="password-form">
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Login
            </button>
          </form>
          {message && <div className={`message ${messageType}`}>{message}</div>}
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <div className="admin-card">
        <div className="admin-header">
          <h2>Update Coffee Prices</h2>
          <button onClick={handleLogout} className="btn btn-logout">
            Logout
          </button>
        </div>

        <form onSubmit={handleSubmit} className="price-form">
          <div className="form-group">
            <label htmlFor="date">Date</label>
            <input
              type="date"
              id="date"
              name="date"
              value={form.date}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="arabica">Arabica (₹)</label>
            <input
              type="number"
              id="arabica"
              name="arabica"
              value={form.arabica}
              onChange={handleInputChange}
              placeholder="Enter Arabica price"
              step="0.01"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="robusta">Robusta (₹)</label>
            <input
              type="number"
              id="robusta"
              name="robusta"
              value={form.robusta}
              onChange={handleInputChange}
              placeholder="Enter Robusta price"
              step="0.01"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="arecanut">Arecanut (₹)</label>
            <input
              type="number"
              id="arecanut"
              name="arecanut"
              value={form.arecanut}
              onChange={handleInputChange}
              placeholder="Enter Arecanut price"
              step="0.01"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update Prices'}
          </button>
        </form>

        {message && (
          <div className={`message ${messageType}`}>{message}</div>
        )}
      </div>
    </div>
  );
}
