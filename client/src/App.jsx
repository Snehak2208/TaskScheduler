import React, { useState } from 'react';
import AuthForm from './components/AuthForm';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [refresh, setRefresh] = useState(false);

  const handleSetToken = (newToken) => {
    setToken(newToken);
    localStorage.setItem('token', newToken);
  };

  if (!token) {
    return <AuthForm setToken={handleSetToken} />;
  }

  return (
    <div style={{ maxWidth: 600, margin: 'auto' }}>
      <button onClick={() => { setToken(null); localStorage.removeItem('token'); }}>Logout</button>
      <h1>Task & Routine Manager</h1>
      <TaskForm token={token} onTaskAdded={() => setRefresh(r => !r)} />
      <TaskList token={token} refresh={refresh} />
    </div>
  );
}

export default App;
