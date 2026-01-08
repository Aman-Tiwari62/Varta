import React, { useEffect, useState } from 'react';

const App = () => {
  // states:
  const [status, setStatus] = useState("Checking");
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const checkBackend = async () => {
      try {
        const res = await fetch(BACKEND_URL);

        if (!res.ok) {
          throw new Error('Server error');
        }

        setStatus('connected to the server');

      } catch (error) {
        console.log(error);
        setStatus('not-connected to the server');
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

