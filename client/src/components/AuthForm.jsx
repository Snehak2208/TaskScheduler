import React, { useState } from 'react';
import { login, register } from '../api/auth';

export default function AuthForm({ setToken }) {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        const res = await login({ email: form.email, password: form.password });
        setToken(res.data.token); // send token up to App
      } else {
        await register(form);
        alert('Registered! Now log in.');
        setIsLogin(true);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 320, margin: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
      <h2>{isLogin ? 'Login' : 'Register'}</h2>
      {!isLogin && (
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
        />
      )}
      <input
        name="email"
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        required
      />
      <input
        name="password"
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Please wait...' : isLogin ? 'Login' : 'Register'}
      </button>
      <div
        onClick={() => setIsLogin(!isLogin)}
        style={{ cursor: 'pointer', color: 'blue', textAlign: 'center', marginTop: 12 }}
      >
        {isLogin ? 'Create an account' : 'Already have an account? Login'}
      </div>
    </form>
  );
}
