import React, { useState } from 'react';
import { useMealPlanner } from '../../context/MealPlannerContext';

const SettingsScreen = () => {
  const { settings, updateSettings, userData } = useMealPlanner();
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);

  const handleSettingChange = (key, value) => {
    updateSettings({ [key]: value });
  };

  const SettingItem = ({ icon, title, subtitle, onPress, rightElement, showChevron = true }) => (
    <div className="setting-item" onClick={onPress}>
      <div className="setting-left">
        <span className="setting-icon">{icon}</span>
        <div className="setting-text">
          <h3>{title}</h3>
          {subtitle && <p>{subtitle}</p>}
        </div>
      </div>
      <div className="setting-right">
        {rightElement}
        {showChevron && <span className="chevron">›</span>}
      </div>
    </div>
  );

  const ToggleSetting = ({ icon, title, subtitle, value, onChange }) => (
    <SettingItem
      icon={icon}
      title={title}
      subtitle={subtitle}
      rightElement={
        <label className="toggle-switch">
          <input
            type="checkbox"
            checked={value}
            onChange={(e) => onChange(e.target.checked)}
          />
          <span className="toggle-slider"></span>
        </label>
      }
      showChevron={false}
    />
  );

  return (
    <div className="settings-screen">
      <div className="settings-header">
        <h1>⚙️ Settings</h1>
        <p>Customize your meal planning experience</p>
      </div>

      {/* Account Section */}
      <div className="settings-section">
        <h2>Account</h2>
        <div className="settings-group">
          <SettingItem
            icon="👤"
            title="Profile"
            subtitle={userData.name || "Set up your profile"}
            onPress={() => setShowAccountModal(true)}
          />
          <SettingItem
            icon="🔐"
            title="Privacy & Security"
            subtitle="Manage your data and privacy"
            onPress={() => setShowPrivacyModal(true)}
          />
          <SettingItem
            icon="📧"
            title="Email Preferences"
            subtitle="Manage notifications and updates"
            onPress={() => setShowNotificationsModal(true)}
          />
        </div>
      </div>

      {/* App Preferences */}
      <div className="settings-section">
        <h2>App Preferences</h2>
        <div className="settings-group">
          <ToggleSetting
            icon="🌙"
            title="Dark Mode"
            subtitle="Switch between light and dark themes"
            value={settings.darkMode}
            onChange={(value) => handleSettingChange('darkMode', value)}
          />
          <ToggleSetting
            icon="🔔"
            title="Notifications"
            subtitle="Get reminders for meal planning"
            value={settings.notifications}
            onChange={(value) => handleSettingChange('notifications', value)}
          />
          <ToggleSetting
            icon="💾"
            title="Auto-save"
            subtitle="Automatically save your meal plans"
            value={settings.autosave}
            onChange={(value) => handleSettingChange('autosave', value)}
          />
        </div>
      </div>

      {/* Units & Measurements */}
      <div className="settings-section">
        <h2>Units & Measurements</h2>
        <div className="settings-group">
          <SettingItem
            icon="⚖️"
            title="Weight Unit"
            subtitle={`Currently: ${settings.weightUnit.toUpperCase()}`}
            rightElement={
              <select 
                value={settings.weightUnit}
                onChange={(e) => handleSettingChange('weightUnit', e.target.value)}
                className="unit-select"
                onClick={(e) => e.stopPropagation()}
              >
                <option value="kg">kg</option>
                <option value="lbs">lbs</option>
              </select>
            }
            showChevron={false}
          />
          <SettingItem
            icon="📏"
            title="Height Unit"
            subtitle={`Currently: ${settings.heightUnit.toUpperCase()}`}
            rightElement={
              <select 
                value={settings.heightUnit}
                onChange={(e) => handleSettingChange('heightUnit', e.target.value)}
                className="unit-select"
                onClick={(e) => e.stopPropagation()}
              >
                <option value="cm">cm</option>
                <option value="ft">ft</option>
              </select>
            }
            showChevron={false}
          />
        </div>
      </div>

      {/* Data & Storage */}
      <div className="settings-section">
        <h2>Data & Storage</h2>
        <div className="settings-group">
          <SettingItem
            icon="📤"
            title="Export Data"
            subtitle="Download your meal plans and recipes"
            onPress={() => alert('Export feature coming soon!')}
          />
          <SettingItem
            icon="📥"
            title="Import Data"
            subtitle="Import meal plans from other apps"
            onPress={() => alert('Import feature coming soon!')}
          />
          <SettingItem
            icon="🗑️"
            title="Clear All Data"
            subtitle="Remove all saved meal plans and preferences"
            onPress={() => {
              if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
                localStorage.clear();
                window.location.reload();
              }
            }}
          />
        </div>
      </div>

      {/* Support */}
      <div className="settings-section">
        <h2>Support</h2>
        <div className="settings-group">
          <SettingItem
            icon="❓"
            title="Help & FAQ"
            subtitle="Get help with using the app"
            onPress={() => alert('Help section coming soon!')}
          />
          <SettingItem
            icon="📞"
            title="Contact Support"
            subtitle="Get in touch with our team"
            onPress={() => alert('Contact support coming soon!')}
          />
          <SettingItem
            icon="⭐"
            title="Rate App"
            subtitle="Share your feedback"
            onPress={() => alert('Rating feature coming soon!')}
          />
        </div>
      </div>

      {/* About */}
      <div className="settings-section">
        <h2>About</h2>
        <div className="settings-group">
          <SettingItem
            icon="ℹ️"
            title="App Version"
            subtitle="1.0.0"
            showChevron={false}
          />
          <SettingItem
            icon="👥"
            title="About Us"
            subtitle="Meet our team"
            onPress={() => setShowAboutModal(true)}
          />
          <SettingItem
            icon="📄"
            title="Terms of Service"
            subtitle="Read our terms and conditions"
            onPress={() => alert('Terms of Service coming soon!')}
          />
          <SettingItem
            icon="🔒"
            title="Privacy Policy"
            subtitle="How we protect your data"
            onPress={() => alert('Privacy Policy coming soon!')}
          />
        </div>
      </div>

      {/* Account Modal */}
      {showAccountModal && (
        <div className="modal-overlay" onClick={() => setShowAccountModal(false)}>
          <div className="modal-content settings-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>👤 Account Settings</h2>
              <button className="close-btn" onClick={() => setShowAccountModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" defaultValue={userData.name || ''} placeholder="Enter your name" />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" defaultValue={userData.email || ''} placeholder="Enter your email" />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input type="tel" defaultValue={userData.phone || ''} placeholder="Enter your phone" />
              </div>
              <div className="form-group">
                <label>Date of Birth</label>
                <input type="date" defaultValue={userData.dob || ''} />
              </div>
              <div className="form-group">
                <label>Dietary Preferences</label>
                <select defaultValue={userData.dietary || ''}>
                  <option value="">None</option>
                  <option value="vegetarian">Vegetarian</option>
                  <option value="vegan">Vegan</option>
                  <option value="gluten-free">Gluten-Free</option>
                  <option value="keto">Keto</option>
                </select>
              </div>
              <div className="modal-actions">
                <button className="btn btn-secondary" onClick={() => setShowAccountModal(false)}>
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={() => setShowAccountModal(false)}>
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notifications Modal */}
      {showNotificationsModal && (
        <div className="modal-overlay" onClick={() => setShowNotificationsModal(false)}>
          <div className="modal-content settings-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>🔔 Notification Settings</h2>
              <button className="close-btn" onClick={() => setShowNotificationsModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <ToggleSetting
                icon="🍽️"
                title="Meal Reminders"
                subtitle="Get reminded about meal times"
                value={true}
                onChange={() => {}}
              />
              <ToggleSetting
                icon="🛒"
                title="Shopping Reminders"
                subtitle="Reminders to go shopping"
                value={true}
                onChange={() => {}}
              />
              <ToggleSetting
                icon="📅"
                title="Weekly Planning"
                subtitle="Weekly meal plan suggestions"
                value={true}
                onChange={() => {}}
              />
              <ToggleSetting
                icon="📱"
                title="Push Notifications"
                subtitle="Receive push notifications"
                value={true}
                onChange={() => {}}
              />
            </div>
          </div>
        </div>
      )}

      {/* Privacy Modal */}
      {showPrivacyModal && (
        <div className="modal-overlay" onClick={() => setShowPrivacyModal(false)}>
          <div className="modal-content settings-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>🔐 Privacy & Security</h2>
              <button className="close-btn" onClick={() => setShowPrivacyModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <ToggleSetting
                icon="📊"
                title="Analytics"
                subtitle="Help improve the app with usage data"
                value={true}
                onChange={() => {}}
              />
              <ToggleSetting
                icon="🍪"
                title="Cookies"
                subtitle="Allow cookies for better experience"
                value={true}
                onChange={() => {}}
              />
              <ToggleSetting
                icon="📍"
                title="Location Services"
                subtitle="Use location for nearby stores"
                value={false}
                onChange={() => {}}
              />
              <div className="privacy-info">
                <p>Your data is encrypted and stored securely. We never share your personal information with third parties.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* About Us Modal */}
      {showAboutModal && (
        <div className="modal-overlay" onClick={() => setShowAboutModal(false)}>
          <div className="modal-content settings-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>👥 About Us</h2>
              <button className="close-btn" onClick={() => setShowAboutModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="about-content">
                <div className="company-info">
                  <h3>🥪 Make Me A Sandwich</h3>
                  <p>Your personal meal planning assistant, helping you create delicious and healthy meal plans tailored to your preferences.</p>
                </div>
                
                <div className="leadership-section">
                  <h4>Leadership Team</h4>
                  <div className="team-member">
                    <div className="member-info">
                      <h5>Colum McNamee</h5>
                      <p className="role">Chief Executive Officer (CEO)</p>
                      <p className="description">Leading the vision and strategy for Make Me A Sandwich</p>
                    </div>
                  </div>
                  
                  <div className="team-member">
                    <div className="member-info">
                      <h5>Ru Hickson</h5>
                      <p className="role">Chief Operating Officer (COO)</p>
                      <p className="description">Overseeing daily operations and ensuring smooth user experience</p>
                    </div>
                  </div>
                </div>

                <div className="company-mission">
                  <h4>Our Mission</h4>
                  <p>To simplify meal planning and make healthy eating accessible to everyone. We believe that good food should be easy to plan, shop for, and prepare.</p>
                </div>

                <div className="contact-info">
                  <h4>Get in Touch</h4>
                  <p>Have questions or feedback? We'd love to hear from you!</p>
                  <div className="contact-methods">
                    <span>📧 support@makemeasandwich.app</span>
                    <span>🌐 www.makemeasandwich.app</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsScreen; 