import React, { useState, useEffect } from 'react';

const ApiTest = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    testApiConnection();
  }, []);

  const testApiConnection = async () => {
    try {
      const response = await fetch('/api/test/');
      if (!response.ok) {
        throw new Error('API call failed :(');
      }
      const jsonData = await response.json();
      setData(jsonData);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (loading) return <div>Testing API connection...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!data) return <div>No data received</div>;

  return (
    <div>
      <h2>API Test Result:</h2>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default ApiTest;
