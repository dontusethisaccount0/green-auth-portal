
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  avatar?: string;
  createdAt: string;
  lastLogin?: string;
}

interface Session {
  id: string;
  userId: string;
  deviceInfo: string;
  location: string;
  ipAddress: string;
  lastActive: string;
  current: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  logoutSession: (sessionId: string) => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  getSessions: () => Promise<Session[]>;
  getAllUsers: () => Promise<User[]>;
  getUserById: (userId: string) => Promise<User>;
  getUserSessions: (userId: string) => Promise<Session[]>;
  updateUserRole: (userId: string, role: 'user' | 'admin') => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock data and functions (replace with actual API calls)
const mockUser: User = {
  id: '1',
  email: 'john@example.com',
  name: 'John Doe',
  role: 'user',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
  createdAt: '2024-01-15T10:00:00Z',
  lastLogin: '2024-06-11T08:30:00Z'
};

const mockAdmin: User = {
  id: '2',
  email: 'admin@example.com',
  name: 'Admin User',
  role: 'admin',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face',
  createdAt: '2024-01-01T00:00:00Z',
  lastLogin: '2024-06-11T09:00:00Z'
};

const mockUsers: User[] = [
  mockUser,
  mockAdmin,
  {
    id: '3',
    email: 'alice@example.com',
    name: 'Alice Johnson',
    role: 'user',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face',
    createdAt: '2024-02-10T14:20:00Z',
    lastLogin: '2024-06-10T16:45:00Z'
  },
  {
    id: '4',
    email: 'bob@example.com',
    name: 'Bob Wilson',
    role: 'user',
    createdAt: '2024-03-05T09:15:00Z',
    lastLogin: '2024-06-09T12:30:00Z'
  }
];

const mockSessions: Session[] = [
  {
    id: 'session-1',
    userId: '1',
    deviceInfo: 'Chrome on Windows 11',
    location: 'New York, US',
    ipAddress: '192.168.1.100',
    lastActive: '2024-06-11T09:30:00Z',
    current: true
  },
  {
    id: 'session-2',
    userId: '1',
    deviceInfo: 'Safari on iPhone 15',
    location: 'New York, US',
    ipAddress: '192.168.1.101',
    lastActive: '2024-06-10T18:45:00Z',
    current: false
  },
  {
    id: 'session-3',
    userId: '1',
    deviceInfo: 'Firefox on MacBook Pro',
    location: 'Boston, US',
    ipAddress: '10.0.0.50',
    lastActive: '2024-06-09T14:20:00Z',
    current: false
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in (from localStorage or token)
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user = email === 'admin@example.com' ? mockAdmin : mockUser;
    setUser(user);
    localStorage.setItem('user', JSON.stringify(user));
    setLoading(false);
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    // Mock Google OAuth
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const googleUser = {
      ...mockUser,
      name: 'Google User',
      email: 'googleuser@gmail.com'
    };
    setUser(googleUser);
    localStorage.setItem('user', JSON.stringify(googleUser));
    setLoading(false);
  };

  const register = async (email: string, password: string, name: string) => {
    setLoading(true);
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newUser: User = {
      id: Date.now().toString(),
      email,
      name,
      role: 'user',
      createdAt: new Date().toISOString()
    };
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
    setLoading(false);
  };

  const logout = async () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const logoutSession = async (sessionId: string) => {
    // Mock API call to logout specific session
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log(`Logged out session: ${sessionId}`);
  };

  const updateProfile = async (data: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const getSessions = async (): Promise<Session[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockSessions.filter(session => session.userId === user?.id);
  };

  const getAllUsers = async (): Promise<User[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockUsers;
  };

  const getUserById = async (userId: string): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const foundUser = mockUsers.find(u => u.id === userId);
    if (!foundUser) throw new Error('User not found');
    return foundUser;
  };

  const getUserSessions = async (userId: string): Promise<Session[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockSessions.filter(session => session.userId === userId);
  };

  const updateUserRole = async (userId: string, role: 'user' | 'admin') => {
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log(`Updated user ${userId} role to ${role}`);
  };

  const deleteUser = async (userId: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    console.log(`Deleted user ${userId}`);
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    loginWithGoogle,
    register,
    logout,
    logoutSession,
    updateProfile,
    getSessions,
    getAllUsers,
    getUserById,
    getUserSessions,
    updateUserRole,
    deleteUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
