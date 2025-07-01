import { useState, useEffect } from 'react';
import axios from 'axios';
import baseUrl from '../components/baseUrl';

export function useTasks() {
  const [tasks, setTasks] = useState([]);
  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get(`${baseUrl}/tasks`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setTasks(res.data.data || []))
    .catch(() => {});
  }, []);
  return tasks;
}