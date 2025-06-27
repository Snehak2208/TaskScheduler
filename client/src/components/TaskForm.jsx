import React, { useState } from 'react';
import { addTask } from '../api/task';

export default function TaskForm({ token, onTaskAdded }) {
  const [form, setForm] = useState({
    title: '',
    category: '',
    estimatedTime: 60,
    priority: 'Normal',
    isFixed: false,
    fixedStart: '',
    fixedEnd: '',
    date: new Date().toISOString().slice(0, 10)
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addTask(form, token);
      setForm({
        title: '',
        category: '',
        estimatedTime: 60,
        priority: 'Normal',
        isFixed: false,
        fixedStart: '',
        fixedEnd: '',
        date: new Date().toISOString().slice(0, 10)
      });
      onTaskAdded();
    } catch (err) {
      alert(err.response?.data?.message || 'Error adding task');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
      <input name="title" value={form.title} onChange={handleChange} placeholder="Task Title" required />
      <input name="category" value={form.category} onChange={handleChange} placeholder="Category (e.g. Study)" required />
      <input name="estimatedTime" type="number" value={form.estimatedTime} onChange={handleChange} placeholder="Estimated Time (min)" required />
      <select name="priority" value={form.priority} onChange={handleChange}>
        <option value="Low">Low</option>
        <option value="Normal">Normal</option>
        <option value="High">High</option>
      </select>
      <label>
        <input name="isFixed" type="checkbox" checked={form.isFixed} onChange={handleChange} />
        Fixed Job (Routine)
      </label>
      {form.isFixed && (
        <div style={{ display: 'flex', gap: 8 }}>
          <input name="fixedStart" type="time" value={form.fixedStart} onChange={handleChange} placeholder="Start Time" required={form.isFixed} />
          <input name="fixedEnd" type="time" value={form.fixedEnd} onChange={handleChange} placeholder="End Time" required={form.isFixed} />
        </div>
      )}
      <input name="date" type="date" value={form.date} onChange={handleChange} required />
      <button type="submit">Add Task</button>
    </form>
  );
}
