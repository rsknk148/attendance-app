import { useState, useEffect } from 'react';
import { Plus, Trash2, Search, Mail, Phone, User as UserIcon } from 'lucide-react';

const Employees = () => {
    const [employees, setEmployees] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // New employee form state
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        position: '',
        department: '',
        phone: '',
        joinDate: new Date().toISOString().split('T')[0]
    });

    useEffect(() => {
        const stored = localStorage.getItem('employees');
        if (stored) {
            setEmployees(JSON.parse(stored));
        }
    }, []);

    const saveEmployees = (newEmployees) => {
        setEmployees(newEmployees);
        localStorage.setItem('employees', JSON.stringify(newEmployees));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newEmployee = {
            id: Date.now().toString(),
            ...formData,
            password: 'password123' // Default password
        };

        const updated = [...employees, newEmployee];
        saveEmployees(updated);
        setFormData({
            name: '',
            email: '',
            position: '',
            department: '',
            phone: '',
            joinDate: new Date().toISOString().split('T')[0]
        });
        setShowForm(false);
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this employee?')) {
            const updated = employees.filter(e => e.id !== id);
            saveEmployees(updated);
        }
    };

    const filteredEmployees = employees.filter(e =>
        e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.position.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Employees</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Manage your team members</p>
                </div>
                <button
                    className="btn btn-primary"
                    onClick={() => setShowForm(!showForm)}
                >
                    <Plus size={18} />
                    {showForm ? 'Cancel' : 'Add Employee'}
                </button>
            </div>

            {showForm && (
                <div className="card mb-6" style={{ animation: 'fadeIn 0.2s ease' }}>
                    <h2 className="text-xl font-bold mb-4">Add New Employee</h2>
                    <form onSubmit={handleSubmit}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                            <div className="form-group">
                                <label className="label">Full Name</label>
                                <input
                                    required
                                    className="input"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label className="label">Email</label>
                                <input
                                    required
                                    type="email"
                                    className="input"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label className="label">Position</label>
                                <input
                                    required
                                    className="input"
                                    value={formData.position}
                                    onChange={e => setFormData({ ...formData, position: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label className="label">Department</label>
                                <input
                                    required
                                    className="input"
                                    value={formData.department}
                                    onChange={e => setFormData({ ...formData, department: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label className="label">Phone</label>
                                <input
                                    className="input"
                                    value={formData.phone}
                                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label className="label">Join Date</label>
                                <input
                                    type="date"
                                    className="input"
                                    value={formData.joinDate}
                                    onChange={e => setFormData({ ...formData, joinDate: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="flex justify-end mt-4">
                            <button type="submit" className="btn btn-primary">Save Employee</button>
                        </div>
                    </form>
                </div>
            )}

            <div className="mb-4">
                <div style={{ position: 'relative', maxWidth: '300px' }}>
                    <Search size={18} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                    <input
                        className="input"
                        style={{ paddingLeft: '2.5rem' }}
                        placeholder="Search employees..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {filteredEmployees.map(employee => (
                    <div key={employee.id} className="card">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div style={{
                                    width: '40px', height: '40px', borderRadius: '50%',
                                    backgroundColor: '#e0e7ff', color: 'var(--primary-color)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>
                                    <UserIcon size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold">{employee.name}</h3>
                                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{employee.position}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => handleDelete(employee.id)}
                                className="btn-danger"
                                style={{ padding: '0.25rem', borderRadius: '4px' }}
                                title="Remove Employee"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>

                        <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <div className="flex items-center gap-2">
                                <Mail size={14} />
                                <span>{employee.email}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Phone size={14} />
                                <span>{employee.phone || 'N/A'}</span>
                            </div>
                            <div style={{ marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border-color)' }}>
                                Department: <span style={{ color: 'var(--text-primary)' }}>{employee.department}</span>
                            </div>
                        </div>
                    </div>
                ))}

                {filteredEmployees.length === 0 && (
                    <div className="card text-center" style={{ gridColumn: '1/-1', padding: '3rem' }}>
                        <p style={{ color: 'var(--text-secondary)' }}>No employees found. Add one to get started.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Employees;
