import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Search, Calendar, Filter } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const History = () => {
    const { user } = useAuth();
    const [logs, setLogs] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterDate, setFilterDate] = useState('');

    useEffect(() => {
        const allLogs = JSON.parse(localStorage.getItem('attendance_logs') || '[]');
        let filtered = allLogs;

        // Filter by role
        if (user?.role !== 'admin') {
            filtered = allLogs.filter(log => log.userId === user?.email);
        }

        // Sort by latest
        filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        setLogs(filtered);
    }, [user]);

    const filteredLogs = logs.filter(log => {
        const matchesSearch = log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.userId.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDate = filterDate ? log.timestamp.startsWith(filterDate) : true;

        return matchesSearch && matchesDate;
    });

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Attendance History</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        {user?.role === 'admin' ? 'View all employee records' : 'My attendance records'}
                    </p>
                </div>
            </div>

            <div className="card mb-6">
                <div className="flex gap-4 flex-col md:flex-row"> {/* Native CSS for flex-col/row needs media query or just simple flex wrap */}
                    <div style={{ position: 'relative', flex: 1 }}>
                        <Search size={18} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                        <input
                            className="input"
                            style={{ paddingLeft: '2.5rem' }}
                            placeholder="Search by name or email..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Calendar size={18} color="var(--text-secondary)" />
                        <input
                            type="date"
                            className="input"
                            value={filterDate}
                            onChange={e => setFilterDate(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid var(--border-color)' }}>
                            <tr>
                                <th style={{ padding: '1rem', fontWeight: 600, fontSize: '0.875rem' }}>Employee</th>
                                <th style={{ padding: '1rem', fontWeight: 600, fontSize: '0.875rem' }}>Type</th>
                                <th style={{ padding: '1rem', fontWeight: 600, fontSize: '0.875rem' }}>Time</th>
                                <th style={{ padding: '1rem', fontWeight: 600, fontSize: '0.875rem' }}>Date</th>
                                <th style={{ padding: '1rem', fontWeight: 600, fontSize: '0.875rem' }}>Location</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredLogs.length > 0 ? (
                                filteredLogs.map(log => (
                                    <tr key={log.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                        <td style={{ padding: '1rem' }}>
                                            <div className="font-bold">{log.userName}</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{log.userId}</div>
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            <span style={{
                                                padding: '0.25rem 0.75rem',
                                                borderRadius: '1rem',
                                                fontSize: '0.75rem',
                                                fontWeight: 600,
                                                backgroundColor: log.type === 'check-in' ? '#dcfce7' : '#fee2e2',
                                                color: log.type === 'check-in' ? '#166534' : '#991b1b',
                                                textTransform: 'capitalize'
                                            }}>
                                                {log.type.replace('-', ' ')}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem', fontFamily: 'monospace' }}>
                                            {format(new Date(log.timestamp), 'h:mm a')}
                                        </td>
                                        <td style={{ padding: '1rem' }}>
                                            {format(new Date(log.timestamp), 'MMM d, yyyy')}
                                        </td>
                                        <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>
                                            {log.location}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                                        No records found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default History;
