import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import emailjs from '@emailjs/browser';
import { useAuth } from '../context/AuthContext';
import { Mail, Key, Lock, ArrowLeft } from 'lucide-react';

const ForgotPassword = () => {
    // STEPS: 0 = Input Email, 1 = Verify Code, 2 = New Password
    const [step, setStep] = useState(0);
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [generatedCode, setGeneratedCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // EmailJS Keys - Ideally these should be in .env, but for this project we'll put placeholders here
    // User will need to replace these or we provide a UI to enter them if valid ones aren't hardcoded.
    // For this implementation, I will assume the user will replace them in code.
    const SERVICE_ID = 'service_yumj83s';
    const TEMPLATE_ID = 'template_ir4mg38';
    const PUBLIC_KEY = 'vLHmt0tGEiPidpRIL';

    const { resetPassword } = useAuth();
    const navigate = useNavigate();

    const handleSendCode = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        // Generate 6 digit code
        const newCode = Math.floor(100000 + Math.random() * 900000).toString();
        setGeneratedCode(newCode);

        try {
            // Send email
            await emailjs.send(
                SERVICE_ID,
                TEMPLATE_ID,
                {
                    to_email: email,
                    verification_code: newCode,
                },
                PUBLIC_KEY
            );

            setStep(1);
            setMessage({ type: 'success', text: 'Verification code sent to your email!' });
        } catch (error) {
            console.error('EmailJS Error:', error);

            // FALLBACK FOR DEMO: Always allow testing even if keys are missing
            // If email fails, we assume it's because keys are invalid/missing.
            alert(`[DEMO MODE] EmailJS keys are missing or invalid.\n\nYour verification code is: ${newCode}`);
            setStep(1);
            setMessage({ type: 'warning', text: 'Email delivery failed. Switched to Demo Mode.' });
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyCode = (e) => {
        e.preventDefault();
        if (code === generatedCode) {
            setStep(2);
            setMessage({ type: '', text: '' });
        } else {
            setMessage({ type: 'error', text: 'Invalid verification code' });
        }
    };

    const handleResetPassword = (e) => {
        e.preventDefault();
        const success = resetPassword(email, newPassword);
        if (success) {
            setMessage({ type: 'success', text: 'Password reset successfully!' });
            setTimeout(() => navigate('/login'), 2000);
        } else {
            setMessage({ type: 'error', text: 'Email not found in system.' });
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
            <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
                <button
                    onClick={() => navigate('/login')}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--text-secondary)' }}
                >
                    <ArrowLeft size={16} /> Back to Login
                </button>

                <h1 className="text-xl font-bold mb-4">Reset Password</h1>

                {message.text && (
                    <div style={{
                        padding: '0.75rem',
                        borderRadius: 'var(--radius-md)',
                        marginBottom: '1rem',
                        backgroundColor: message.type === 'error' ? '#fee2e2' : '#dcfce7',
                        color: message.type === 'error' ? '#991b1b' : '#166534',
                        fontSize: '0.875rem'
                    }}>
                        {message.text}
                    </div>
                )}

                {step === 0 && (
                    <form onSubmit={handleSendCode}>
                        <div className="form-group">
                            <label className="label">Email Address</label>
                            <div style={{ position: 'relative' }}>
                                <Mail size={18} style={{ position: 'absolute', top: '50%', left: '10px', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                                <input
                                    type="email"
                                    required
                                    className="input"
                                    style={{ paddingLeft: '2.5rem' }}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your registered email"
                                />
                            </div>
                        </div>
                        <button type="submit" className="btn btn-primary w-full" disabled={loading}>
                            {loading ? 'Sending...' : 'Send Verification Code'}
                        </button>
                    </form>
                )}

                {step === 1 && (
                    <form onSubmit={handleVerifyCode}>
                        <div className="form-group">
                            <label className="label">Verification Code</label>
                            <div style={{ position: 'relative' }}>
                                <Key size={18} style={{ position: 'absolute', top: '50%', left: '10px', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                                <input
                                    type="text"
                                    required
                                    className="input"
                                    style={{ paddingLeft: '2.5rem' }}
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    placeholder="Enter 6-digit code"
                                />
                            </div>
                        </div>
                        <button type="submit" className="btn btn-primary w-full">Verify Code</button>
                    </form>
                )}

                {step === 2 && (
                    <form onSubmit={handleResetPassword}>
                        <div className="form-group">
                            <label className="label">New Password</label>
                            <div style={{ position: 'relative' }}>
                                <Lock size={18} style={{ position: 'absolute', top: '50%', left: '10px', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                                <input
                                    type="password"
                                    required
                                    className="input"
                                    style={{ paddingLeft: '2.5rem' }}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Enter new password"
                                />
                            </div>
                        </div>
                        <button type="submit" className="btn btn-primary w-full">Update Password</button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default ForgotPassword;
