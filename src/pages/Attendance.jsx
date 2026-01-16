import { useState, useEffect } from 'react';
import { Clock, MapPin, CheckCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '../context/AuthContext';

const Attendance = () => {
    const { user } = useAuth();
    const [currentTime, setCurrentTime] = useState(new Date());
    const [status, setStatus] = useState('checked-out'); // 'checked-in' | 'checked-out'
    const [todayLogs, setTodayLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Clock timer
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        // Load today's logs for user
        const loadLogs = () => {
            const allLogs = JSON.parse(localStorage.getItem('attendance_logs') || '[]');
            const userLogs = allLogs.filter(log =>
                log.userId === user.email &&
                new Date(log.timestamp).toDateString() === new Date().toDateString()
            );

            setTodayLogs(userLogs);

            // Determine current status based on last log
            if (userLogs.length > 0) {
                const lastLog = userLogs[userLogs.length - 1]; // items are appended, so last is latest
                setStatus(lastLog.type === 'check-in' ? 'checked-in' : 'checked-out');
            } else {
                setStatus('checked-out');
            }
            setLoading(false);
        };

        loadLogs();
    }, [user]);

    const handleToggleAttendance = () => {
        const newStatus = status === 'checked-in' ? 'check-out' : 'check-in';
        const timestamp = new Date().toISOString();

        const newLog = {
            id: Date.now().toString(),
            userId: user.email,
            userName: user.name,
            type: newStatus,
            timestamp: timestamp,
            location: 'Office (Main)' // Mock location
        };

        const allLogs = JSON.parse(localStorage.getItem('attendance_logs') || '[]');
        const updatedLogs = [...allLogs, newLog];

        // Validate: Don't allow double check-in (already handled by button state, but good for safety)

        localStorage.setItem('attendance_logs', JSON.stringify(updatedLogs));

        // Update local state
        setTodayLogs([...todayLogs, newLog]);
        setStatus(newStatus === 'check-in' ? 'checked-in' : 'checked-out');
    };

    const getDuration = () => {
        if (todayLogs.length === 0) return '0 hrs 0 mins';

        // Simple calculation: sum of (CheckOut - CheckIn)
        // If currently checked in, add (Now - LastCheckIn)

        let totalMs = 0;
        let lastCheckIn = null;

        todayLogs.forEach(log => {
            if (log.type === 'check-in') {
                lastCheckIn = new Date(log.timestamp);
            } else if (log.type === 'check-out' && lastCheckIn) {
                totalMs += new Date(log.timestamp) - lastCheckIn;
                lastCheckIn = null;
            }
        });

        if (status === 'checked-in' && lastCheckIn) {
            totalMs += new Date() - lastCheckIn;
        }

        const hours = Math.floor(totalMs / (1000 * 60 * 60));
        const minutes = Math.floor((totalMs % (1000 * 60 * 60)) / (1000 * 60));
        return `${hours} hrs ${minutes} mins`;
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div className="text-center mb-8">
                <h1 className="text-2xl font-bold mb-2">Attendance</h1>
                <p style={{ color: 'var(--text-secondary)' }}>{format(currentTime, 'EEEE, MMMM do yyyy')}</p>
                <div style={{ fontSize: '3rem', fontWeight: 700, fontFamily: 'monospace', margin: '1rem 0', color: 'var(--primary-color)' }}>
                    {format(currentTime, 'HH:mm:ss')}
                </div>
            </div>

            <div className="card text-center mb-8" style={{ padding: '3rem' }}>
                <div className="mb-6">
                    <span style={{
                        display: 'inline-block',
                        padding: '0.5rem 1rem',
                        borderRadius: '2rem',
                        backgroundColor: status === 'checked-in' ? '#dcfce7' : '#f1f5f9',
                        color: status === 'checked-in' ? '#166534' : '#64748b',
                        fontWeight: 600,
                        fontSize: '0.875rem'
                    }}>
                        Currently: {status === 'checked-in' ? 'Checked In' : 'Checked Out'}
                    </span>
                </div>

                <button
                    onClick={handleToggleAttendance}
                    style={{
                        width: '200px',
                        height: '200px',
                        borderRadius: '50%',
                        backgroundColor: status === 'checked-in' ? '#ef4444' : '#10b981',
                        color: 'white',
                        fontSize: '1.5rem',
                        fontWeight: 700,
                        boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
                        transition: 'all 0.2s',
                        cursor: 'pointer',
                        border: '4px solid white',
                        outline: `4px solid ${status === 'checked-in' ? '#fecaca' : '#bbf7d0'}`
                    }}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                    {status === 'checked-in' ? 'Check Out' : 'Check In'}
                </button>

                <p className="mt-4" style={{ color: 'var(--text-secondary)' }}>
                    Total Hours Today: <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{getDuration()}</span>
                </p>
            </div>

            <div className="card">
                <h2 className="text-xl font-bold mb-4">Today's Activity</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {todayLogs.length === 0 ? (
                        <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '1rem' }}>No activity yet today.</p>
                    ) : (
                        todayLogs.map(log => (
                            <div key={log.id} style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                padding: '1rem',
                                backgroundColor: 'var(--background-color)',
                                borderRadius: 'var(--radius-md)',
                                borderLeft: `4px solid ${log.type === 'check-in' ? 'var(--success-color)' : 'var(--danger-color)'}`
                            }}>
                                <div className="flex items-center gap-3">
                                    {log.type === 'check-in' ? <CheckCircle size={20} color="var(--success-color)" /> : <XCircle size={20} color="var(--danger-color)" />}
                                    <div>
                                        <p style={{ fontWeight: 600, textTransform: 'capitalize' }}>{log.type.replace('-', ' ')}</p>
                                        <div className="flex items-center gap-1" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                            <MapPin size={12} />
                                            <span>{log.location}</span>
                                        </div>
                                    </div>
                                </div>
                                <div style={{ fontWeight: 600, fontFamily: 'monospace' }}>
                                    {format(new Date(log.timestamp), 'h:mm a')}
                                </div>
                            </div>
                        )).reverse()
                    )}
                </div>
            </div>
        </div>
    );
};

export default Attendance;
