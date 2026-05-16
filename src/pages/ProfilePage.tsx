import React from 'react';
import { useAuth } from '../context/AuthContext';
import './ProfilePage.css';

const ProfilePage: React.FC = () => {
  const { user, isAuthenticated, login, logout } = useAuth();

  if (!isAuthenticated || !user) {
    return (
      <div className="profile-page">
        <div className="profile-card">
          <div className="profile-avatar-placeholder">?</div>
          <h2>Not signed in</h2>
          <p>Sign in with Quran Foundation to see your profile.</p>
          <button className="btn btn-primary" onClick={login}>Sign In</button>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-card">
        <div className="profile-avatar">
          {user.first_name?.[0] || user.email?.[0] || 'U'}
        </div>
        <h2>{user.first_name || 'User'}</h2>
        {user.last_name && <p className="profile-last-name">{user.last_name}</p>}
        {user.email && <p className="profile-email">{user.email}</p>}
        <div className="profile-id">
          <span>QF ID: {user.sub?.slice(0, 12)}...</span>
        </div>

        <div className="profile-actions">
          <button className="btn btn-outline" onClick={login}>Switch Account</button>
          <button className="btn btn-primary" onClick={logout}>Sign Out</button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
