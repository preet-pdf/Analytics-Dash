
import React, { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import './CreateUser.css';
import Loading from './Loading';

const CreateUser = () => {
  const { getAccessTokenSilently, isLoading } = useAuth0();
  const [formData, setFormData] = useState({
    email: '',
    phone_number: '',
    given_name: '',
    family_name: '',
    nickname: '',
    picture: '',
    connection: 'Username-Password-Authentication', // default connection
    password: '',
  });
  if (isLoading) {
    return <Loading />;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = await getAccessTokenSilently({
        audience: 'https://login.auth0.com/api/v2/',
        scope: 'create:users'
      });
      console.log(token);

      const response = await fetch('https://login.auth0.com/api/v2/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        alert('User created successfully!');
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error('Error creating user:', error);
      alert('Error creating user.');
    }
  };

  return (
    <div className="CreateUser">
      <h2>Create User</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Email:
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </label>
        <label>
          Phone Number:
          <input type="text" name="phone_number" value={formData.phone_number} onChange={handleChange} />
        </label>
        <label>
          Given Name:
          <input type="text" name="given_name" value={formData.given_name} onChange={handleChange} required />
        </label>
        <label>
          Family Name:
          <input type="text" name="family_name" value={formData.family_name} onChange={handleChange} required />
        </label>
        <label>
          Nickname:
          <input type="text" name="nickname" value={formData.nickname} onChange={handleChange} />
        </label>
        <label>
          Picture URL:
          <input type="text" name="picture" value={formData.picture} onChange={handleChange} />
        </label>
        <label>
          Password:
          <input type="password" name="password" value={formData.password} onChange={handleChange} required />
        </label>
        <button type="submit">Create User</button>
      </form>
    </div>
  );
};

export default CreateUser;
