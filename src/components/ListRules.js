import React, { useState, useEffect } from 'react';
import './RulesList.css';
import Loading from './Loading';
import { useAuth0 } from '@auth0/auth0-react';


const ListRules = () => {
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { getAccessTokenSilently } = useAuth0();
  

  // Fetch rules from API
  useEffect(() => {
    const fetchRules = async () => {
      try {
        const accessToken = await getAccessTokenSilently();
        console.log("AccessToken: ", accessToken);

        const response = await fetch('http://localhost:8080/audit/getRules', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`, // Attach the access token
            'Content-Type': 'application/json',
          },
        });


        console.log(response);
        if (!response.ok) {
          throw new Error('Failed to fetch rules');
        }
        const data = await response.json();
        const formattedRules = formatRules(data.rules);
        setRules(formattedRules);
        console.log(rules);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchRules();
  }, []);

  // Format the rules for easier rendering
  const formatRules = (rules) => {
    const formatted = [];
    Object.keys(rules).forEach((ruleType) => {
      Object.keys(rules[ruleType]).forEach((ruleName) => {
        formatted.push({
          type: ruleType,
          name: ruleName,
          description: rules[ruleType][ruleName],
          enabled: true, // Default value for now
        });
      });
    });
    return formatted;
  };

  const handleToggle = (ruleName) => {
    setRules((prevRules) =>
      prevRules.map((rule) =>
        rule.name === ruleName ? { ...rule, enabled: !rule.enabled } : rule
      )
    );
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="RulesList">
      <h2>Live Rules List</h2>
      <table className="rules-table">
        <thead>
          <tr>
            <th>Rule Type</th>
            <th>Rule Name</th>
            <th>Description</th>
            <th>Enabled</th>
          </tr>
        </thead>
        <tbody>
          {rules.map((rule) => (
            <tr key={rule.name}>
              <td>{rule.type}</td>
              <td>{rule.name}</td>
              <td>{rule.description}</td>
              <td>
                <button
                  className={`toggle-button ${rule.enabled ? 'enabled' : 'disabled'}`}
                  onClick={() => handleToggle(rule.name)}
                >
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
