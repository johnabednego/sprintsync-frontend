import { useState, useEffect } from 'react';
import axios from 'axios';
import baseUrl from '../components/baseUrl';
import { toast } from 'react-toastify';

export function useProjects() {
  const [projects, setProjects] = useState([]);
  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get(`${baseUrl}/projects`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        // swagger-style: data.data if paginated; if unpaginated adjust accordingly
        setProjects(Array.isArray(data) ? data : data.data);
      } catch {
        toast.error('Failed to load projects');
      }
    })();
  }, []);
  return projects;
}
