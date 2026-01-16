import { Users, UserCheck, UserX, Clock } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="card flex items-center gap-4">
        <div style={{
            padding: '1rem',
            borderRadius: '50%',
            backgroundColor: `${color}20`,
            color: color
        }}>
            <Icon size={24} />
        </div>
        <div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{title}</p>
            <p style={{ fontSize: '1.5rem', fontWeight: 700 }}>{value}</p>
        </div>
    </div>
);

const Dashboard = () => {
    // Mock data for now
    const stats = [
        { title: 'Total Employees', value: '12', icon: Users, color: '#6366f1' },
        { title: 'Present Today', value: '8', icon: UserCheck, color: '#10b981' },
        { title: 'Absent / Leave', value: '4', icon: UserX, color: '#ef4444' },
        { title: 'Late Arrivals', value: '2', icon: Clock, color: '#f59e0b' },
    ];

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h1 className="text-2xl font-bold">Dashboard</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Welcome back, Administrator</p>
                </div>
                <div>
                    <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                        {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                </div>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '1.5rem',
                marginBottom: '2rem'
            }}>
                {stats.map((stat, index) => (
                    <StatCard key={index} {...stat} />
                ))}
            </div>

            <div className="card">
                <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
                <p style={{ color: 'var(--text-secondary)' }}>No recent activity to show.</p>
            </div>
        </div>
    );
};

export default Dashboard;
