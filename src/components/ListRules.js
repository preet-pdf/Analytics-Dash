import React, { useState, useEffect } from 'react';
import './RulesList.css';
import { useAuth0 } from '@auth0/auth0-react';
import Loading from './Loading';

const dummyRules = [
  {
    id: 1,
    name: 'Rule 1',
    description: 'This is rule 1',
    type: 'Type A',
    enabled: true,
  },
  {
    id: 2,
    name: 'Rule 2',
    description: 'This is rule 2',
    type: 'Type B',
    enabled: false,
  },
  {
    id: 3,
    name: 'Rule 3',
    description: 'This is rule 3',
    type: 'Type C',
    enabled: true,
  },
];

const ListRules = () => {
  const [rules, setRules] = useState(dummyRules);
  const { isLoading } = useAuth0();

  useEffect(() => {
    const fetchRules = async () => {
      try {
        const response = await fetch('http://localhost:3000/rules');
        const data = await response.json();
        setRules(data);
      } catch (error) {
        console.error('Error fetching rules:', error);
      }
    };

    // Uncomment the line below to fetch rules from the backend
    // fetchRules();
  }, []);
  if (isLoading) {
    return <Loading />;
  }
  const handleToggle = (ruleId) => {
    setRules((prevRules) =>
      prevRules.map((rule) =>
        rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule
      )
    );
  };

  return (
    <div className="RulesList">
      <h2>Rules List</h2>
      <table>
        <thead>
          <tr>
            <th>Rule Name</th>
            <th>Description</th>
            <th>Type</th>
            <th>Enabled</th>
          </tr>
        </thead>
        <tbody>
          {rules.map((rule) => (
            <tr key={rule.id}>
              <td>{rule.name}</td>
              <td>{rule.description}</td>
              <td>{rule.type}</td>
              <td>
                <button onClick={() => handleToggle(rule.id)}>
                  {rule.enabled ? 'Disable' : 'Enable'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListRules;
