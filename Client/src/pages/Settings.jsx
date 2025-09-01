import React, { useState } from 'react';

const Settings = () => {
  const [settings, setSettings] = useState({
    companyName: 'SAP M-Pesa Integration',
    currency: 'KES',
    language: 'en',
    notifications: true,
    autoReconcile: true,
    syncFrequency: '30'
  });

  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSaveStatus('success');
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (error) {
      setSaveStatus('error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h1>Settings</h1>
      
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">General Settings</h3>
        </div>

        {saveStatus === 'success' && (
          <div style={{ 
            color: 'var(--success)', 
            padding: '10px', 
            margin: '15px', 
            backgroundColor: '#e6f7ee',
            borderRadius: 'var(--border-radius)'
          }}>
            Settings saved successfully!
          </div>
        )}

        {saveStatus === 'error' && (
          <div style={{ 
            color: 'var(--error)', 
            padding: '10px', 
            margin: '15px', 
            backgroundColor: '#fde9e7',
            borderRadius: 'var(--border-radius)'
          }}>
            Failed to save settings. Please try again.
          </div>
        )}

        <form onSubmit={handleSave}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="form-group">
              <label className="form-label">Company Name</label>
              <input
                type="text"
                name="companyName"
                className="form-input"
                value={settings.companyName}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Default Currency</label>
              <select
                name="currency"
                className="form-input"
                value={settings.currency}
                onChange={handleInputChange}
              >
                <option value="KES">Kenyan Shilling (KES)</option>
                <option value="USD">US Dollar (USD)</option>
                <option value="EUR">Euro (EUR)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Language</label>
              <select
                name="language"
                className="form-input"
                value={settings.language}
                onChange={handleInputChange}
              >
                <option value="en">English</option>
                <option value="sw">Swahili</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Sync Frequency (minutes)</label>
              <input
                type="number"
                name="syncFrequency"
                className="form-input"
                value={settings.syncFrequency}
                onChange={handleInputChange}
                min="1"
                max="60"
              />
            </div>
          </div>

          <div style={{ marginTop: '20px' }}>
            <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input
                type="checkbox"
                name="notifications"
                id="notifications"
                checked={settings.notifications}
                onChange={handleInputChange}
              />
              <label htmlFor="notifications" className="form-label" style={{ margin: 0 }}>
                Enable Email Notifications
              </label>
            </div>

            <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input
                type="checkbox"
                name="autoReconcile"
                id="autoReconcile"
                checked={settings.autoReconcile}
                onChange={handleInputChange}
              />
              <label htmlFor="autoReconcile" className="form-label" style={{ margin: 0 }}>
                Enable Auto-Reconciliation
              </label>
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={saving}
            style={{ marginTop: '20px' }}
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </form>
      </div>

      {/* M-Pesa Configuration */}
      <div className="card" style={{ marginTop: '20px' }}>
        <div className="card-header">
          <h3 className="card-title">M-Pesa Configuration</h3>
        </div>
        <div style={{ padding: '15px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="form-group">
              <label className="form-label">Consumer Key</label>
              <input
                type="password"
                className="form-input"
                value="••••••••••••••••"
                disabled
              />
            </div>

            <div className="form-group">
              <label className="form-label">Consumer Secret</label>
              <input
                type="password"
                className="form-input"
                value="••••••••••••••••"
                disabled
              />
            </div>

            <div className="form-group">
              <label className="form-label">Shortcode</label>
              <input
                type="text"
                className="form-input"
                value="174379"
                disabled
              />
            </div>

            <div className="form-group">
              <label className="form-label">Passkey</label>
              <input
                type="password"
                className="form-input"
                value="••••••••••••••••"
                disabled
              />
            </div>
          </div>
          <button className="btn btn-primary" style={{ marginTop: '15px' }}>
            Update M-Pesa Credentials
          </button>
        </div>
      </div>

      {/* SAP Configuration */}
      <div className="card" style={{ marginTop: '20px' }}>
        <div className="card-header">
          <h3 className="card-title">SAP Configuration</h3>
        </div>
        <div style={{ padding: '15px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="form-group">
              <label className="form-label">SAP Base URL</label>
              <input
                type="url"
                className="form-input"
                placeholder="https://sap.example.com"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Client ID</label>
              <input
                type="text"
                className="form-input"
                placeholder="100"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Username</label>
              <input
                type="text"
                className="form-input"
                placeholder="SAP_USER"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-input"
                placeholder="••••••••"
              />
            </div>
          </div>
          <button className="btn btn-primary" style={{ marginTop: '15px' }}>
            Test Connection
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;