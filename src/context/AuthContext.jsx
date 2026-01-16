import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local storage for existing session
    const storedUser = localStorage.getItem('attendance_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    // Mock authentication

    // 1. Check if there are custom admin settings
    const customAdmin = JSON.parse(localStorage.getItem('admin_settings') || 'null');
    if (customAdmin && customAdmin.email === email && customAdmin.password === password) {
      setUser({ ...customAdmin, role: 'admin' });
      localStorage.setItem('attendance_user', JSON.stringify({ ...customAdmin, role: 'admin' }));
      return { success: true };
    }

    // 2. Default Admin Check (only if no custom settings matching default)
    // If custom admin is set, we strictly use that. But if not set, use default.
    // Or simpler: just check default if custom isn't set.
    if (!customAdmin && email === 'admin@company.com' && password === 'admin') {
      const userData = { name: 'Administrator', email, role: 'admin' };
      setUser(userData);
      localStorage.setItem('attendance_user', JSON.stringify(userData));
      return { success: true };
    }

    // Check if it matches a stored employee (will implement later)
    const employees = JSON.parse(localStorage.getItem('employees') || '[]');
    const employee = employees.find(e => e.email === email && e.password === password); // Simple password check

    if (employee) {
      const userData = { ...employee, role: 'employee' };
      setUser(userData);
      localStorage.setItem('attendance_user', JSON.stringify(userData));
      return { success: true };
    }

    return { success: false, error: 'Invalid credentials' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('attendance_user');
  };

  const updateProfile = (newData) => {
    const updatedUser = { ...user, ...newData };
    setUser(updatedUser);
    localStorage.setItem('attendance_user', JSON.stringify(updatedUser)); // Update session

    // Also update the 'source' if it was matched from employees list, but for admin query
    // we basically just stick to session for now or a separate 'admin_settings' key
    // For simplicity, let's persist admin settings in a dedicated key if it matches admin
    if (user.role === 'admin') {
      localStorage.setItem('admin_settings', JSON.stringify(updatedUser));
    }
    return true;
  };

  const value = {
    user,
    login,
    logout,
    updateProfile,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
