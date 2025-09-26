import React from 'react';

const AccountScreen = ({ userProfile = null, onLogout = () => {} }) => {
  return (
    <div className="container">
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <h2>Account Screen</h2>
        <p>This will show user account information.</p>
        <button className="btn btn-danger" onClick={onLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default AccountScreen; 