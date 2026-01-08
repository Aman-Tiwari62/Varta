import React, { useEffect, useState } from 'react';

const App = () => {
  // states:
  const [status, setStatus] = useState("Checking");

  useEffect(() => {
    const checkBackend = async () => {
      try {
        const res = await fetch('https://modest-clarity-production.up.railway.app/');

        if (!res.ok) {
          throw new Error('Server error');
        }

        setStatus('connected');

      } catch (error) {
        console.log(error);
        setStatus('not-connected');
      }
    };

    checkBackend();
  }, []);

  return (
    <div>
      <h1>Chat App</h1>
      <p>message: {status}</p>
    </div>
  )
}

export default App

