import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Link } from 'react-router-dom';
import './UserProfile.css';
import Loading from './Loading';

const UserProfile = () => {
  const { user, isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [toggleState, setToggleState] = useState(false);

  const roles = user?.['https://test/sunday/roles'] || [];
  const hasCreateUserRole = roles.includes('menu-admin');
  
  useEffect(() => {
    const fetchToggleState = async () => {
      try {
        const token = await getAccessTokenSilently();
        const response = await fetch('http://localhost:3000/your-endpoint', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setToggleState(data.toggleState);
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
      const response = await fetch('http://localhost:3000/your-endpoint', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ toggleState: !toggleState }),
      });
      const data = await response.json();
      setToggleState(data.toggleState);
    } catch (error) {
      console.error('Error toggling state:', error);
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
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
                <button className="UserProfile-createuser-button">
                  Create User
                </button>
              </Link>
              <hr></hr>
              <button
                className="UserProfile-toggle-button"
                onClick={handleToggle}
              >
                Generate Alerts: {toggleState ? 'ON' : 'OFF'}
              </button>
              <hr></hr>
              <Link to="/list-rules">
                <button className="UserProfile-createuser-button">
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
