import { useState, useEffect } from 'react';
import axios from 'axios';
import baseUrl from '../components/baseUrl';

export function useTags() {
  const [tags, setTags] = useState([]);
  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get(`${baseUrl}/tags`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setTags(res.data))
      .catch(() => {/* silently ignore */});
  }, []);
  return tags;
}
