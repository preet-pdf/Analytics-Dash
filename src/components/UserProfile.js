import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Link } from 'react-router-dom';
import './UserProfile.css';
import Loading from './Loading';
import useAuditEvent from './useAuditEvent';
import useSessionTime from './useSessionTime';

const UserProfile = () => {
  const { user, isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [toggleState, setToggleState] = useState(false);
  const [toggleStateForAlert, setToggleStateForAlert] = useState(false);

  const roles = user?.['https://test/sunday/roles'] || [];
  const hasCreateUserRole = roles.includes('menu-admin');
  
  const sendAuditEvent = useAuditEvent();
  useSessionTime();

  useEffect(() => {
    const fetchToggleState = async () => {
      try {
        const token = await getAccessTokenSilently();
        console.log(token);
        const response = await fetch('http://localhost:3000/your-endpoint', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setToggleState(data.toggleState);
        setToggleStateForAlert(data.toggleStateForAlert)
      } catch (error) {
        console.error('Error fetching toggle state:', error);
      }
    };

    if (isAuthenticated) {
      fetchToggleState();
    }
  }, [isAuthenticated, getAccessTokenSilently]);

  if (isLoading) {
    return <Loading />;
  }

  const handleToggle = async () => {
    try {
      const token = await getAccessTokenSilently();
      console.log(token);
      setToggleState(!toggleState);
      sendAuditEvent('rule_toggle_button', 'rule_' + !toggleState);
      const url = 'http://localhost:8000/rule/update_rule?status='+toggleState;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ toggleState: !toggleState }),
      });
      
    } catch (error) {
      console.error('Error toggling state:', error);
    }
  };

  const handleToggleForAlert = async () => {
    try {
      const token = await getAccessTokenSilently();
      setToggleStateForAlert(!toggleStateForAlert);
      sendAuditEvent('alert_toggle_button', 'alert_'+!toggleStateForAlert);
      const url = 'http://localhost:8000/alert/update_alert?status='+toggleStateForAlert;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ toggleStateForAlert: !toggleStateForAlert }),
      });
      
    } catch (error) {
      console.error('Error toggling state:', error);
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
    sendAuditEvent('dropdown_toggle', isDropdownOpen);
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="UserProfile">
      <img
        src={user.picture}
        alt={user.name}
        className="UserProfile-picture"
        onClick={toggleDropdown}
      />
      {isDropdownOpen && (
        <div className="UserProfile-dropdown">
          <img src={user.picture} alt={user.name} />
          <p>{user.name}</p>
          <p>{user.email}</p>
          <p>{user.nickname}</p>
          <p>Roles:</p>
          <ul>
            {roles.map((role, index) => (
              <li key={index}>{role}</li>
            ))}
          </ul>
          {hasCreateUserRole && (
            <div>
              <Link to="/createuser">
                <button className="UserProfile-createuser-button" onClick={() => sendAuditEvent('create_user_button_click', 'Create User')}>
                  Create User
                </button>
              </Link>
              <hr></hr>
              <button
                className="UserProfile-toggle-button"
                onClick={handleToggle}
              >
                Stop Rules: {toggleState ? 'Yes' : 'No'}
              </button>
              <hr></hr>
              <button
                className="UserProfile-toggle-button"
                onClick={handleToggleForAlert}
              >
                Stop Alerts: {toggleStateForAlert ? 'Yes' : 'No'}
              </button>
              <hr></hr>
              <Link to="/list-rules">
                <button className="UserProfile-createuser-button" onClick={() => sendAuditEvent('list_rules_button_click', 'List Rules')}>
                  List Rules
                </button>
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserProfile;
