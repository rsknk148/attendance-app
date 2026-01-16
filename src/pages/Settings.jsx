import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Save, Lock, User, Mail } from 'lucide-react';

const Settings = () => {
    const { user, updateProfile } = useAuth();
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        password: user?.password || '',
    });
    const [message, setMessage] = useState({ type: '', text: '' });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.password) {
            setMessage({ type: 'error', text: 'All fields are required' });
            return;
        }

        const success = updateProfile(formData);
        if (success) {
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } else {
            setMessage({ type: 'error', text: 'Failed to update profile' });
        }
    };

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h1 className="text-2xl font-bold mb-6">Settings</h1>

            <div className="card">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <User size={20} />
                    Admin Profile
                </h2>

                {message.text && (
                    <div style={{
                        padding: '1rem',
                        borderRadius: 'var(--radius-md)',
                        marginBottom: '1rem',
                        backgroundColor: message.type === 'error' ? '#fee2e2' : '#dcfce7',
                        color: message.type === 'error' ? '#991b1b' : '#166534'
                    }}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="label">Display Name</label>
                        <div style={{ position: 'relative' }}>
                            <User size={18} style={{ position: 'absolute', top: '50%', left: '10px', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                            <input
                                className="input"
                                style={{ paddingLeft: '2.5rem' }}
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="label">Email Address (Username)</label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={18} style={{ position: 'absolute', top: '50%', left: '10px', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                            <input
                                className="input"
                                style={{ paddingLeft: '2.5rem' }}
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="label">Password</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} style={{ position: 'absolute', top: '50%', left: '10px', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                            <input
                                className="input"
                                style={{ paddingLeft: '2.5rem' }}
                                type="text" // Showing text so they can see what they set
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="New password"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end mt-6">
                        <button type="submit" className="btn btn-primary">
                            <Save size={18} />
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>

            <div className="card mt-6" style={{ border: '1px solid var(--danger-color)' }}>
                <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--danger-color)' }}>Danger Zone</h2>
                <p className="mb-4 text-secondary">Resetting the application will clear all employee and attendance data.</p>
                <button
                    className="btn btn-danger"
                    onClick={() => {
                        if (confirm('Are you sure? This will delete ALL data including employees and history.')) {
                            localStorage.clear();
                            window.location.reload();
                        }
                    }}
                >
                    Reset Application Data
                </button>
            </div>
        </div>
    );
};

export default Settings;
