import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import useAuditEvent from './useAuditEvent'; // Adjust the path as necessary

const LogoutButton = () => {
  const { logout } = useAuth0();
  const sendAuditEvent = useAuditEvent();

  const handleLogoutClick = () => {
    sendAuditEvent('logout_button_click', 'Log Out');
    logout({
      returnTo: window.location.origin,
    });
  };

  return (
    <button
      className="App-button"
      onClick={handleLogoutClick}
    >
      Log Out
    </button>
  );
};

export default LogoutButton;
