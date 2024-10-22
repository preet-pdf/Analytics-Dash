import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import './ShowAudit.css';

const ShowAudit = () => {
  const { getAccessTokenSilently } = useAuth0();
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = await getAccessTokenSilently();

        const response = await fetch('http://localhost:8080/audit/eventTypeCountsPerHour', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const result = await response.json();
        setData(result);
      } catch (err) {
        setError('Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [getAccessTokenSilently]);

  const downloadCSV = () => {
    const csvData = [];

    for (const [hour, eventTypes] of Object.entries(data)) {
      for (const [eventType, values] of Object.entries(eventTypes)) {
        values.forEach(value => {
          csvData.push({
            Hour: hour,
            EventType: eventType,
            Data: JSON.stringify(value),
          });
        });
      }
    }

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [Object.keys(csvData[0])].concat(csvData.map(e => Object.values(e))).map(e => e.join(',')).join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'audit_event_counts.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderTable = () => {
    return Object.entries(data).map(([hour, eventTypes]) => (
      <div key={hour}>
        <h3>{hour}</h3>
        <table className="audit-table">
          <thead>
            <tr>
              <th>Event Type</th>
              <th>Data</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(eventTypes).map(([eventType, values]) => (
              <tr key={eventType}>
                <td>{eventType}</td>
                <td>
                  {values.map((value, index) => (
                    <div key={index}>
                      {Object.entries(value).map(([key, val]) => (
                        <div key={key}>
                          {key}: {val}
                        </div>
                      ))}
                    </div>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <div className="table-header">
        
        <button onClick={downloadCSV} style={{ marginLeft: 'auto' }}>
          Download Audit Data
        </button>
      </div>
      {renderTable()}
    </div>
  );
};

export default ShowAudit;
