import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import useAuditEvent from './useAuditEvent'; // Adjust

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();
  const sendAuditEvent = useAuditEvent();
  return (
    <button
    className="App-button"
      onClick={() => {
        sendAuditEvent('signin_button_click', 'Sign In');
        loginWithRedirect()
      }}
    >
      Log In
    </button>
  );
};

export default LoginButton;
