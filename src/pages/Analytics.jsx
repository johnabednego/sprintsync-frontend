import { useEffect, useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { format, parseISO } from 'date-fns';
import baseUrl from '../components/baseUrl';

export default function Analytics() {
  const [data, setData] = useState([]);

  useEffect(() => {
    (async () => {
      const token = localStorage.getItem('token');
      // Endpoint returns array: [{ date: '2025-07-01', user1: 120, user2: 60, ... }, ...]
      const { data: chart } = await axios.get(`${baseUrl}/stats/time-per-day`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setData(chart);
    })();
  }, []);

  if (!data.length) return <p>Loading analytics…</p>;

  const users = Object.keys(data[0]).filter(k => k !== 'date');

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold dark:text-gray-100 mb-4">Time Logged Per Day</h2>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data}>
          <XAxis dataKey="date" tickFormatter={d => format(parseISO(d), 'MM/dd')} />
          <YAxis />
          <Tooltip labelFormatter={d => format(parseISO(d), 'PPP')} />
          <Legend />
          {users.map((u, i) => (
            <Line
              key={u}
              type="monotone"
              dataKey={u}
              stroke={`hsl(${(i*60)%360}, 70%, 50%)`}
              strokeWidth={2}
              dot={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
