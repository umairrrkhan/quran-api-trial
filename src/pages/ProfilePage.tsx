import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserProfile, getCollections } from '../services/qfUserApi';
import './ProfilePage.css';

const ProfilePage: React.FC = () => {
  const { user, isAuthenticated, login, logout, getAccessToken } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [collections, setCollections] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) return;
    setLoading(true);
    getAccessToken().then(token => {
      if (!token) { setLoading(false); return; }
      Promise.all([getUserProfile(token), getCollections(token)]).then(([p, c]) => {
        if (p.data) setProfile(p.data);
        if (c.data) setCollections(c.data);
        setLoading(false);
      }).catch(() => { setLoading(false); setError('Could not load profile data'); });
    });
  }, [isAuthenticated]);

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

        <div className="profile-stats">
          {loading && <p className="profile-loading">Loading cloud data...</p>}
          {error && <p className="profile-error">{error}</p>}
          {profile && (
            <div className="profile-stat-row">
              <span>Collections: {collections.length}</span>
            </div>
          )}
        </div>

        <div className="profile-actions">
          <button className="btn btn-primary" onClick={logout}>Sign Out</button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
