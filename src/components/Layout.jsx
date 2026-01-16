import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Calendar, LogOut, ClipboardList, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import '../styles/index.css';

const Sidebar = () => {
    const location = useLocation();
    const { logout, user } = useAuth();

    const isActive = (path) => location.pathname === path;

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
        { icon: Users, label: 'Employees', path: '/employees', role: 'admin' },
        { icon: ClipboardList, label: 'Attendance', path: '/attendance' },
        { icon: Calendar, label: 'History', path: '/history' },
        { icon: Settings, label: 'Settings', path: '/settings', role: 'admin' },
    ];

    const filteredNav = navItems.filter(item => !item.role || item.role === user?.role || user?.role === 'admin');

    return (
        <aside className="sidebar">
            <div className="logo-container">
                <h1 className="app-title">WorkPulse</h1>
                <p className="app-subtitle">Attendance System</p>
            </div>

            <nav className="nav-menu">
                {filteredNav.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
                    >
                        <item.icon size={20} />
                        <span>{item.label}</span>
                    </Link>
                ))}
            </nav>

            <div className="user-profile">
                <div className="user-info">
                    <p className="user-name">{user?.name}</p>
                    <p className="user-role">{user?.role}</p>
                </div>
                <button onClick={logout} className="logout-btn" title="Logout">
                    <LogOut size={18} />
                </button>
            </div>
        </aside>
    );
};

const Layout = ({ children }) => {
    return (
        <div className="layout-container">
            <Sidebar />
            <main className="main-content">
                {children}
            </main>
        </div>
    );
};

export default Layout;
