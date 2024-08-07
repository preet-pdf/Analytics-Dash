const useAuditEvent = () => {
  const sendAuditEvent = (eventType, eventData) => {
    const isoDateString = new Date().toISOString();
    console.log(isoDateString);

    fetch('http://localhost:8080/audit/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ eventType, eventData, eventTime: isoDateString }),
    });
  };

  return sendAuditEvent;
};

export default useAuditEvent;
