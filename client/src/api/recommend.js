import axios from 'axios';
const API = 'http://localhost:5000/api/recommend';

export const getSchedule = (date, token) =>
  axios.get(`${API}?date=${date}`, { headers: { Authorization: `Bearer ${token}` } });
