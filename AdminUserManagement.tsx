import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaLock, FaSpinner, FaCheck, FaTimes, FaEdit, FaTrash, FaSearch, FaFilter, FaUserPlus } from 'react-icons/fa';
import { Card, CardTitle, Button, Table, Badge, Spinner, Alert, Flex } from '../common/styles';
import { userAPI } from '../../services/api';

interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'staff' | 'user';
  organization?: 'Bridgetunes' | 'MTN';
  status: 'active' | 'pending' | 'inactive';
  createdAt: string;
  lastLogin?: string;
}

const FilterContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  
  @media (max-width: ${({ theme }) => theme.breakpoints?.mobile || '576px'}) {
    flex-direction: column;
  }
`;

const FilterSelect = styled.select`
  padding: 0.5rem;
  border: 1px solid ${({ theme }) => theme.colors.light};
  border-radius: ${({ theme }) => theme.borderRadius?.medium || '0.375rem'};
  min-width: 150px;
`;

const SearchInput = styled.input`
  padding: 0.5rem;
  border: 1px solid ${({ theme }) => theme.colors.light};
  border-radius: ${({ theme }) => theme.borderRadius?.medium || '0.375rem'};
  flex-grow: 1;
`;

const TableContainer = styled.div`
  overflow-x: auto;
  margin-top: 1rem;
`;

const NoUsersMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: ${({ theme }) => theme.colors.gray};
`;

const RoleBadge = styled(Badge)<{ role: 'admin' | 'staff' | 'user' }>`
  background-color: ${({ theme, role }) => 
    role === 'admin' ? theme.colors.primary :
    role === 'staff' ? theme.colors.secondary :
    theme.colors.light};
  color: ${({ theme, role }) => 
    role === 'admin' || role === 'staff' ? 'white' : theme.colors.dark};
`;

const OrganizationBadge = styled(Badge)<{ organization?: 'Bridgetunes' | 'MTN' }>`
  background-color: ${({ theme, organization }) => 
    organization === 'Bridgetunes' ? '#FF6B6B' :
    organization === 'MTN' ? '#FFD166' :
    theme.colors.light};
  color: ${({ theme, organization }) => 
    organization === 'Bridgetunes' ? 'white' : 
    organization === 'MTN' ? '#333' : 
    theme.colors.dark};
`;

const StatusBadge = styled(Badge)<{ status: 'active' | 'pending' | 'inactive' }>`
  background-color: ${({ theme, status }) => 
    status === 'active' ? theme.colors.success :
    status === 'pending' ? theme.colors.warning :
    theme.colors.danger};
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  
  &:hover {
    transform: scale(1.05);
  }
`;

const ActionButton = styled(Button)`
  padding: 0.4rem;
  margin-right: 0.25rem;
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const StatCard = styled(motion.div)`
  background-color: white;
  border-radius: ${({ theme }) => theme.borderRadius?.medium || '0.375rem'};
  box-shadow: ${({ theme }) => theme.shadows?.small || '0 2px 4px rgba(0, 0, 0, 0.1)'};
  padding: 1.5rem;
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: ${({ theme }) => theme.colors.primary};
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.gray};
`;

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 1rem;
`;

const ModalContent = styled(motion.div)`
  background-color: white;
  border-radius: ${({ theme }) => theme.borderRadius?.medium || '0.375rem'};
  box-shadow: ${({ theme }) => theme.shadows?.large || '0 10px 25px rgba(0, 0, 0, 0.1)'};
  padding: 2rem;
  width: 100%;
  max-width: 500px;
`;

const ModalTitle = styled.h3`
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.light};
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const FormLabel = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

const FormInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${({ theme }) => theme.colors.light};
  border-radius: ${({ theme }) => theme.borderRadius?.medium || '0.375rem'};
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => `${theme.colors.primary}20`};
  }
`;

const FormSelect = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${({ theme }) => theme.colors.light};
  border-radius: ${({ theme }) => theme.borderRadius?.medium || '0.375rem'};
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => `${theme.colors.primary}20`};
  }
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
`;

const AdminUserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [organizationFilter, setOrganizationFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    role: 'user',
    organization: '',
    password: '',
    confirmPassword: ''
  });
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'danger' | 'warning'; text: string } | null>(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    pendingUsers: 0,
    inactiveUsers: 0
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
    calculateStats();
  }, [users, roleFilter, statusFilter, organizationFilter, searchQuery]);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      // In a real implementation, this would call an API endpoint
      // For now, we'll simulate a response
      setTimeout(() => {
        const mockUsers: User[] = [
          {
            id: 'user-1',
            username: 'admin',
            email: 'admin@bridgetunes.com',
            role: 'admin',
            status: 'active',
            createdAt: '2023-01-15T10:30:00Z',
            lastLogin: '2023-04-25T08:45:00Z'
          },
          {
            id: 'user-2',
            username: 'mtn_staff1',
            email: 'staff1@mtn.com',
            role: 'staff',
            organization: 'MTN',
            status: 'active',
            createdAt: '2023-02-10T14:20:00Z',
            lastLogin: '2023-04-24T16:30:00Z'
          },
          {
            id: 'user-3',
            username: 'bt_manager',
            email: 'manager@bridgetunes.com',
            role: 'staff',
            organization: 'Bridgetunes',
            status: 'active',
            createdAt: '2023-02-15T09:10:00Z',
            lastLogin: '2023-04-23T11:15:00Z'
          },
          {
            id: 'user-4',
            username: 'new_staff',
            email: 'newstaff@bridgetunes.com',
            role: 'staff',
            organization: 'Bridgetunes',
            status: 'pending',
            createdAt: '2023-04-20T13:45:00Z'
          },
          {
            id: 'user-5',
            username: 'user1',
            email: 'user1@example.com',
            role: 'user',
            status: 'active',
            createdAt: '2023-03-05T16:20:00Z',
            lastLogin: '2023-04-22T09:30:00Z'
          },
          {
            id: 'user-6',
            username: 'user2',
            email: 'user2@example.com',
            role: 'user',
            status: 'inactive',
            createdAt: '2023-03-10T11:40:00Z',
            lastLogin: '2023-04-15T14:20:00Z'
          },
          {
            id: 'user-7',
            username: 'mtn_staff2',
            email: 'staff2@mtn.com',
            role: 'staff',
            organization: 'MTN',
            status: 'inactive',
            createdAt: '2023-02-20T10:15:00Z',
            lastLogin: '2023-04-10T13:45:00Z'
          },
          {
            id: 'user-8',
            username: 'new_user',
            email: 'newuser@example.com',
            role: 'user',
            status: 'pending',
            createdAt: '2023-04-22T15:30:00Z'
          }
        ];
        setUsers(mockUsers);
        setFilteredUsers(mockUsers);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to fetch users. Please try again.');
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = [...users];
    
    // Filter by role
    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }
    
    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(user => user.status === statusFilter);
    }
    
    // Filter by organization
    if (organizationFilter !== 'all') {
      filtered = filtered.filter(user => user.organization === organizationFilter);
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(user => 
        user.username.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query)
      );
    }
    
    setFilteredUsers(filtered);
  };

  const calculateStats = () => {
    const totalUsers = users.length;
    const activeUsers = users.filter(user => user.status === 'active').length;
    const pendingUsers = users.filter(user => user.status === 'pending').length;
    const inactiveUsers = users.filter(user => user.status === 'inactive').length;
    
    setStats({
      totalUsers,
      activeUsers,
      pendingUsers,
      inactiveUsers
    });
  };

  const handleRoleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRoleFilter(e.target.value);
  };

  const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
  };

  const handleOrganizationFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setOrganizationFilter(e.target.value);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleAddUser = () => {
    setModalMode('add');
    setCurrentUser(null);
    setFormData({
      username: '',
      email: '',
      role: 'user',
      organization: '',
      password: '',
      confirmPassword: ''
    });
    setShowModal(true);
  };

  const handleEditUser = (user: User) => {
    setModalMode('edit');
    setCurrentUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      role: user.role,
      organization: user.organization || '',
      password: '',
      confirmPassword: ''
    });
    setShowModal(true);
  };

  const handleToggleStatus = async (user: User) => {
    try {
      setProcessing(true);
      // In a real implementation, this would call an API endpoint
      // For now, we'll simulate a response
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const newStatus = user.status === 'active' ? 'inactive' : 'active';
      
      const updatedUsers = users.map(u => 
        u.id === user.id 
          ? { ...u, status: newStatus as 'active' | 'inactive' | 'pending' } 
          : u
      );
      
      setUsers(updatedUsers);
      setMessage({ 
        type: 'success', 
        text: `User ${user.username} has been ${newStatus === 'active' ? 'activated' : 'deactivated'}.` 
      });
    } catch (error) {
      console.error('Error toggling user status:', error);
      setMessage({ type: 'danger', text: 'Failed to update user status. Please try again.' });
    } finally {
      setProcessing(false);
    }
  };

  const handleResendVerification = async (user: User) => {
    try {
      setProcessing(true);
      // In a real implementation, this would call an API endpoint
      // For now, we'll simulate a response
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMessage({ 
        type: 'success', 
        text: `Verification email has been resent to ${user.email}.` 
      });
    } catch (error) {
      console.error('Error resending verification:', error);
      setMessage({ type: 'danger', text: 'Failed to resend verification email. Please try again.' });
    } finally {
      setProcessing(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.username.trim()) {
      setError('Username is required.');
      return false;
    }
    
    if (!formData.email.trim()) {
      setError('Email is required.');
      return false;
    }
    
    if (!formData.email.includes('@')) {
      setError('Please enter a valid email address.');
      return false;
    }
    
    if (formData.role === 'staff' && !formData.organization) {
      setError('Organization is required for staff members.');
      return false;
    }
    
    if (modalMode === 'add') {
      if (!formData.password) {
        setError('Password is required.');
        return false;
      }
      
      if (formData.password.length < 8) {
        setError('Password must be at least 8 characters long.');
        return false;
      }
      
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match.');
        return false;
      }
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!validateForm()) {
      return;
    }
    
    setProcessing(true);
    
    try {
      // In a real implementation, this would call an API endpoint
      // For now, we'll simulate a response
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (modalMode === 'add') {
        // Create new user
        const newUser: User = {
          id: `user-${users.length + 1}`,
          username: formData.username,
          email: formData.email,
          role: formData.role as 'admin' | 'staff' | 'user',
          ...(formData.role === 'staff' && { organization: formData.organization as 'Bridgetunes' | 'MTN' }),
          status: 'pending',
          createdAt: new Date().toISOString()
        };
        
        setUsers([...users, newUser]);
        setMessage({ 
          type: 'success', 
          text: `User ${formData.username} has been created. A verification email has been sent to ${formData.email}.` 
        });
      } else if (currentUser) {
        // Update existing user
        const updatedUsers = users.map(user => 
          user.id === currentUser.id 
            ? { 
                ...user, 
                username: formData.username,
                email: formData.email,
                role: formData.role as 'admin' | 'staff' | 'user',
                ...(formData.role === 'staff' 
                  ? { organization: formData.organization as 'Bridgetunes' | 'MTN' } 
                  : { or
(Content truncated due to size limit. Use line ranges to read in chunks)
