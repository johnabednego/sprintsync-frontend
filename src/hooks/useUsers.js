import { useState, useEffect } from 'react';
import axios from 'axios';
import baseUrl from '../components/baseUrl';

export function useUsers() {
  const [users, setUsers]   = useState([]);
  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get(`${baseUrl}/users`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setUsers(res.data.data))
      .catch(() => {/* swallow */});
  }, []);
  return users;
}
