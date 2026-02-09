import React, { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import NotificationBell from './NotificationBell';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <h2>SAP M-Pesa Integration</h2>
      </div>
      <div className="navbar-right">
        <NotificationBell />
        <div className="user-menu">
          <span className="user-name">{user?.name}</span>
          <div className="user-dropdown">
            <button className="btn btn-primary" onClick={logout}>
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
