import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import useAuditEvent from './useAuditEvent'; // Adjust the path as necessary

const SignupButton = () => {
  const { loginWithRedirect } = useAuth0();
  const sendAuditEvent = useAuditEvent();

  const handleSignupClick = () => {
    sendAuditEvent('signup_button_click', 'Sign Up');
    loginWithRedirect({
      screen_hint: 'signup',
    });
  };

  return (
    <button
      className="btn btn-primary btn-block"
      onClick={handleSignupClick}
    >
      Sign Up
    </button>
  );
};

export default SignupButton;
