import { useEffect } from 'react';

const useSessionTime = () => {
  useEffect(() => {
    const trackStartTime = () => {
      localStorage.setItem('startTime', Date.now());
    };

    const displayTimeSpent = () => {
      const startTime = localStorage.getItem('startTime');
      if (startTime) {
        const endTime = Date.now();
        const elapsedTime = endTime - parseInt(startTime, 10);
        const seconds = Math.floor(elapsedTime / 1000);
        console.log(`You spent ${seconds} seconds on this page.`);

        fetch('http://localhost:8080/audit/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ eventType: 'spent_time', eventData: seconds, eventTime: new Date().toISOString() }),
        });
      }
    };

    window.addEventListener('beforeunload', displayTimeSpent);
    window.addEventListener('load', trackStartTime);

    return () => {
      window.removeEventListener('beforeunload', displayTimeSpent);
      window.removeEventListener('load', trackStartTime);
    };
  }, []);
};

export default useSessionTime;
