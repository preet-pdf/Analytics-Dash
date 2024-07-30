import React, { useState, useEffect } from 'react';
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
    username: '',
    name: '',
    user_metadata: {},
    app_metadata: {},
    nickname: '',
    picture: '',
    connection: 'Username-Password-Authentication', // default connection
    password: '',
    role_id: '', // new field for role ID
  });
  const [connections, setConnections] = useState([]);
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [ruleData, setRuleData] = useState({
    name: '',
    description: '',
  });
  const [rolePermissions, setRolePermissions] = useState({
    resource_server_identifier: '',
    permission_name: '',
  });

  const [newRoleMerge, setNewRoleMerge] = useState({
    name: '',
    description: '',
  });
  const [rolePermissionsMerge, setRolePermissionsMerge] = useState([{
    resource_server_identifier: '',
    permission_name: '',
  }]);
  


  const handleRoleChangeMerge = (e) => {
    const { name, value } = e.target;
    setNewRoleMerge((prevData) => ({ ...prevData, [name]: value }));
  };

  const handlePermissionChangeMerge = (index, e) => {
    const { name, value } = e.target;
    const newPermissions = [...rolePermissionsMerge];
    newPermissions[index][name] = value;
    setRolePermissionsMerge(newPermissions);
  };

  const addPermissionField = () => {
    setRolePermissionsMerge([...rolePermissionsMerge, { resource_server_identifier: '', permission_name: '' }]);
  };
  

  const removePermissionField = (index) => {
    const newPermissions = [...rolePermissionsMerge];
    newPermissions.splice(index, 1);
    setRolePermissionsMerge(newPermissions);
  };
  



  useEffect(() => {
    // Fetch connections on component mount
    const fetchConnections = async () => {
      try {
        const response = await fetch('http://localhost:8000/user/list-connections');
        const data = await response.json();
        setConnections(data);
      } catch (error) {
        console.error('Error fetching connections:', error);
      }
    };

    // Fetch roles on component mount
    const fetchRoles = async () => {
      try {
        const response = await fetch('http://localhost:8000/role/get_role');
        const data = await response.json();
        setRoles(data.response.roles);
      } catch (error) {
        console.error('Error fetching roles:', error);
      }
    };

    const fetchPermissions = async () => {
      try {
        const response = await fetch('http://localhost:8000/role/list-permissions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        const permissionsArray = Object.values(data).flat();
        setPermissions(permissionsArray);
      } catch (error) {
        console.error('Error fetching permissions:', error);
      }
    };


    fetchConnections();
    fetchRoles();
    fetchPermissions();
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleRuleChange = (e) => {
    const { name, value } = e.target;
    setRuleData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handlePermissionChange = (e) => {
    const { name, value } = e.target;
    setRolePermissions((prevData) => ({ ...prevData, [name]: value }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = await getAccessTokenSilently({
        audience: 'https://login.auth0.com/api/v2/',
        scope: 'create:users'
      });
      console.log(token);
      console.log(formData);
      const response = await fetch('http://localhost:8000/user/create-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${token}`,
        },
       
        body: JSON.stringify({ user: formData, role_assignment: { role_id: formData.role_id } }),
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

  const handleSubmitMerge = async (e) => {
    e.preventDefault();
    const payload = {
      role: newRoleMerge,
      permission: rolePermissionsMerge, // This should be an array
    };
    try {
      const response = await fetch('http://localhost:8000/role/create_role_and_assign_permission', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
  
      const data = await response.json();
      if (response.ok) {
        alert('Role and permissions created successfully!');
        // fetchRoles(); // Refresh the roles list
      } else {
        alert(`Error: ${data.detail}`);
      }
    } catch (error) {
      console.error('Error creating role and permissions:', error);
      alert('Error creating role and permissions.');
    }
  };
  


  const handleRuleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8000/role/create_role', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ruleData),
      });

      const data = await response.json();
      if (response.ok) {
        alert('Role created successfully!');
        setRuleData({ name: '', description: '' }); // Clear form after successful creation
      } else {
        alert(`Error: ${data.detail}`);
      }
    } catch (error) {
      console.error('Error creating role:', error);
      alert('Error creating role.');
    }
  };

  const handlePermissionSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:8000/role/assign-permission/${rolePermissions.role_id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(rolePermissions),
      });

      const data = await response.json();
      if (response.ok) {
        alert('Permission assigned successfully!');
      } else {
        alert(`Error: ${data.detail}`);
      }
    } catch (error) {
      console.error('Error assigning permission:', error);
      alert('Error assigning permission.');
    }
  };




  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="container">
      <div className="CreateUser">
        <h2>Create User</h2>
        <form onSubmit={handleSubmit} className="form-section">
          <div className="form-group">
            <label>Email:</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Phone Number:</label>
            <input type="text" name="phone_number" value={formData.phone_number} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Given Name:</label>
            <input type="text" name="given_name" value={formData.given_name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Name:</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>UserName:</label>
            <input type="text" name="username" value={formData.username} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Family Name:</label>
            <input type="text" name="family_name" value={formData.family_name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Nickname:</label>
            <input type="text" name="nickname" value={formData.nickname} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Picture URL:</label>
            <input type="text" name="picture" value={formData.picture} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Connection:</label>
            <select name="connection" value={formData.connection} onChange={handleChange} required>
              {connections.map((connection) => (
                <option key={connection.id} value={connection.id}>
                  {connection.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Role:</label>
            <select name="role_id" value={formData.role_id} onChange={handleChange} required>
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>
          <button type="submit">Create User</button>
        </form>
        </div>
        <br></br>
        <div className="container">
        <h2>Create Role</h2>
        <form onSubmit={handleRuleSubmit} className="form-section">
          <div className="form-group">
            <label>Role Name:</label>
            <input type="text" name="name" value={ruleData.name} onChange={handleRuleChange} required />
          </div>
          <div className="form-group">
            <label>Description:</label>
            <input type="text" name="description" value={ruleData.description} onChange={handleRuleChange} />
          </div>
          <button type="submit">Create Role</button>
        </form>
        </div>
        <br></br>
        <div className="container">
  
        <h2>Assign Permission to Role</h2>
        <form onSubmit={handlePermissionSubmit} className="form-section">
          <div className="form-group">
            <label>Role:</label>
            <select name="role_id" value={rolePermissions.role_id} onChange={handlePermissionChange} required>
              <option value="">Select a role</option>
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Permission:</label>
            <select name="permission_name" value={rolePermissions.permission_name} onChange={handlePermissionChange} required>
              <option value="">Select a permission</option>
              {permissions.map((permission, index) => (
                <option key={index} value={permission.value}>
                  {permission.description}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Resource Server Identifier:</label>
            <input
              type="text"
              name="resource_server_identifier"
              value={rolePermissions.resource_server_identifier}
              onChange={handlePermissionChange}
              required
            />
          </div>
          <button type="submit">Assign Permission</button>
        </form>
        </div>
        <br></br>
        <div className="container">
        <div className="CreateRoleAndAssignPermission form-section">
          <h2>Create Role and Assign Direct Permissions</h2>
          <form onSubmit={handleSubmitMerge}>
            <div className="form-group">
              <label>Role Name:</label>
              <input type="text" name="name" value={newRoleMerge.name} onChange={handleRoleChangeMerge} required />
            </div>
            <div className="form-group">
              <label>Role Description:</label>
              <input type="text" name="description" value={newRoleMerge.description} onChange={handleRoleChangeMerge} required />
            </div>
  
            <h3>Permissions</h3>
            {rolePermissionsMerge.map((permission, index) => (
              <div key={index} className="form-group permission-field">
                <label>Resource Server Identifier:</label>
                <input
                  type="text"
                  name="resource_server_identifier"
                  value={permission.resource_server_identifier}
                  onChange={(e) => handlePermissionChangeMerge(index, e)}
                  required
                />
                <label>Permission Name:</label>
                <select
                  name="permission_name"
                  value={permission.permission_name}
                  onChange={(e) => handlePermissionChangeMerge(index, e)}
                  required
                >
                  <option value="">Select a permission</option>
                  {permissions.map((perm, permIndex) => (
                    <option key={permIndex} value={perm.value}>
                      {perm.description}
                    </option>
                  ))}
                </select>
                {index > 0 && (
                  <button type="button" className="add-button" onClick={() => removePermissionField(index)}>Remove Permission</button>
                )}
              </div>
            ))}
            <button type="button" className="add-button" onClick={addPermissionField}>Add Another Permission</button>
            <div className="buttons">
              <button type="submit">Create Role and Assign Permissions</button>
            </div>
          </form>
        </div>
        </div>
        <br></br>
        <div className="container">
  
        <h2>List of Roles</h2>
        <ul>
          {roles.map((role) => (
            <li key={role.id}>
              <strong >{role.name}:</strong> {role.description}
            </li>
          ))}
        </ul>
        </div>
        <br></br>
        <div className="container">
        <h2>List of Permissions</h2>
        <ul className="permission-list">
          {permissions.map((permission, index) => (
            <li key={index}>
              <strong>{permission.description}:</strong> {permission.value}
            </li>
          ))}
        </ul>

      </div>
    </div>
  );
  
  
};

export default CreateUser;
