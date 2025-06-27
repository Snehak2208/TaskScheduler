import React, { useEffect, useState } from 'react';
import { getTasks, deleteTask } from '../api/task';

export default function TaskList({ token, refresh }) {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    if (token) {
      getTasks(token).then(res => setTasks(res.data));
    }
  }, [token, refresh]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    await deleteTask(id, token);
    setTasks(tasks.filter(t => t._id !== id));
  };

  return (
    <div>
      <h3>Your Tasks & Routines</h3>
      {tasks.length === 0 && <div>No tasks found.</div>}
      <ul>
        {tasks.map(t => (
          <li key={t._id} style={{ marginBottom: 8 }}>
            <b>{t.title}</b> ({t.category}) - {t.estimatedTime} min
            {t.isFixed && <> [Routine: {t.fixedStart} to {t.fixedEnd}]</>}
            <button onClick={() => handleDelete(t._id)} style={{ marginLeft: 8 }}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
