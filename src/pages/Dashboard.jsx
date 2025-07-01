import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import baseUrl from '../components/baseUrl';
import { FaUsers, FaTasks, FaTags, FaProjectDiagram } from 'react-icons/fa';

export default function Dashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            const token = localStorage.getItem('token');
            try {
                let res;
                if (user.isAdmin) {
                    // Admin endpoint returns { users, tags, projects, tasks }
                    res = await axios.get(`${baseUrl}/stats/admin`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                } else {
                    // User endpoint returns { todo, inProgress, done }
                    res = await axios.get(`${baseUrl}/stats/me`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                }
                setStats(res.data);
            } catch {
                setStats({});
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, [user]);

    if (loading) return <p>Loading dashboard…</p>;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {user.isAdmin ? (
                <>
                    <StatCard label="Users" value={stats.users} icon={<FaUsers />} />
                    <StatCard label="Tags" value={stats.tags} icon={<FaTags />} />
                    <StatCard label="Projects" value={stats.projects} icon={<FaProjectDiagram />} />
                    <StatCard label="Tasks" value={stats.tasks} icon={<FaTasks />} />
                </>
            ) : (
                <>
                    <StatCard label="To Do" value={stats.todo} icon={<FaTasks />} />
                    <StatCard label="In Progress" value={stats.inProgress} icon={<FaTasks />} />
                    <StatCard label="Done" value={stats.done} icon={<FaTasks />} />
                </>
            )}
        </div>
    );
}

function StatCard({ label, value = 0, icon }) {
    return (
        <div className="flex items-center p-4 bg-white dark:bg-gray-800 rounded shadow">
            <div className="text-3xl text-indigo-600">{icon}</div>
            <div className="ml-4">
                <p className="text-lg font-semibold dark:text-gray-100">{value}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
            </div>
        </div>
    );
}
