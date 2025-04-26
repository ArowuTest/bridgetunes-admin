import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaUsers, FaUserTie, FaUserEdit, FaTrash, FaCheck, FaTimes, FaFilter } from 'react-icons/fa';
import { Card, CardTitle, Button, Table, Badge, Spinner, Alert, Flex } from '../common/styles';
import { userAPI } from '../../services/api';

interface User {
  id: string;
  username: string;
  email: string;
  msisdn?: string;
  userType: 'staff' | 'public' | 'admin';
  organization?: 'Bridgetunes' | 'MTN' | null;
  isActive: boolean;
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

const UserTypeTag = styled(Badge)<{ userType: 'staff' | 'public' | 'admin' }>`
  background-color: ${({ theme, userType }) => 
    userType === 'staff' ? theme.colors.secondary :
    userType === 'admin' ? theme.colors.primary :
    theme.colors.success};
`;

const OrganizationTag = styled(Badge)<{ organization?: 'Bridgetunes' | 'MTN' | null }>`
  background-color: ${({ theme, organization }) => 
    organization === 'Bridgetunes' ? '#FF6B00' :
    organization === 'MTN' ? '#FFCC00' :
    theme.colors.light};
  color: ${({ theme, organization }) => 
    organization === 'MTN' ? theme.colors.dark :
    'white'};
`;

const ActionButton = styled(Button)`
  padding: 0.4rem;
  margin-right: 0.25rem;
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
  font-size: ${({ theme }) => theme.fontSizes?.medium || '1rem'};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const FormSelect = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${({ theme }) => theme.colors.light};
  border-radius: ${({ theme }) => theme.borderRadius?.medium || '0.375rem'};
  font-size: ${({ theme }) => theme.fontSizes?.medium || '1rem'};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
`;

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userTypeFilter, setUserTypeFilter] = useState<string>('all');
  const [organizationFilter, setOrganizationFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    msisdn: '',
    userType: 'public',
    organization: '',
    isActive: true
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'danger' | 'warning'; text: string } | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, userTypeFilter, organizationFilter, searchQuery]);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      // In a real implementation, this would call an API endpoint
      // For now, we'll simulate a response
      setTimeout(() => {
        const mockUsers: User[] = [
          {
            id: '1',
            username: 'admin',
            email: 'admin@bridgetunes.com',
            userType: 'admin',
            organization: 'Bridgetunes',
            isActive: true,
            createdAt: '2025-01-01T00:00:00Z',
            lastLogin: '2025-04-25T10:30:00Z'
          },
          {
            id: '2',
            username: 'mtn_manager',
            email: 'manager@mtn.com',
            userType: 'staff',
            organization: 'MTN',
            isActive: true,
            createdAt: '2025-01-15T00:00:00Z',
            lastLogin: '2025-04-24T14:20:00Z'
          },
          {
            id: '3',
            username: 'bridgetunes_staff',
            email: 'staff@bridgetunes.com',
            userType: 'staff',
            organization: 'Bridgetunes',
            isActive: true,
            createdAt: '2025-02-01T00:00:00Z',
            lastLogin: '2025-04-25T09:15:00Z'
          },
          {
            id: '4',
            username: 'john_doe',
            email: 'john@example.com',
            msisdn: '+2348012345678',
            userType: 'public',
            isActive: true,
            createdAt: '2025-03-10T00:00:00Z',
            lastLogin: '2025-04-20T16:45:00Z'
          },
          {
            id: '5',
            username: 'jane_smith',
            email: 'jane@example.com',
            msisdn: '+2348023456789',
            userType: 'public',
            isActive: true,
            createdAt: '2025-03-15T00:00:00Z',
            lastLogin: '2025-04-22T11:30:00Z'
          },
          {
            id: '6',
            username: 'mtn_support',
            email: 'support@mtn.com',
            userType: 'staff',
            organization: 'MTN',
            isActive: false,
            createdAt: '2025-02-10T00:00:00Z',
            lastLogin: '2025-03-15T08:20:00Z'
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
    
    // Filter by user type
    if (userTypeFilter !== 'all') {
      filtered = filtered.filter(user => user.userType === userTypeFilter);
    }
    
    // Filter by organization
    if (organizationFilter !== 'all') {
      if (organizationFilter === 'none') {
        filtered = filtered.filter(user => !user.organization);
      } else {
        filtered = filtered.filter(user => user.organization === organizationFilter);
      }
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(user => 
        user.username.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        (user.msisdn && user.msisdn.includes(query))
      );
    }
    
    setFilteredUsers(filtered);
  };

  const handleUserTypeFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setUserTypeFilter(e.target.value);
  };

  const handleOrganizationFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setOrganizationFilter(e.target.value);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleAddUser = () => {
    setEditingUser(null);
    setFormData({
      username: '',
      email: '',
      msisdn: '',
      userType: 'public',
      organization: '',
      isActive: true
    });
    setFormError(null);
    setShowModal(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      msisdn: user.msisdn || '',
      userType: user.userType,
      organization: user.organization || '',
      isActive: user.isActive
    });
    setFormError(null);
    setShowModal(true);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const validateForm = () => {
    if (!formData.username.trim()) {
      setFormError('Username is required');
      return false;
    }
    
    if (!formData.email.trim()) {
      setFormError('Email is required');
      return false;
    }
    
    if (formData.userType === 'public' && !formData.msisdn.trim()) {
      setFormError('MSISDN is required for public users');
      return false;
    }
    
    if (formData.userType === 'staff' && !formData.organization.trim()) {
      setFormError('Organization is required for staff users');
      return false;
    }
    
    return true;
  };

  const handleSubmitForm = async () => {
    if (!validateForm()) return;
    
    setProcessing(true);
    setFormError(null);
    
    try {
      // In a real implementation, this would call an API endpoint
      // For now, we'll simulate a response
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (editingUser) {
        // Update existing user
        const updatedUsers = users.map(user => 
          user.id === editingUser.id 
            ? { 
                ...user, 
                username: formData.username,
                email: formData.email,
                msisdn: formData.userType === 'public' ? formData.msisdn : undefined,
                userType: formData.userType as 'staff' | 'public' | 'admin',
                organization: formData.userType === 'staff' ? formData.organization as 'Bridgetunes' | 'MTN' : null,
                isActive: formData.isActive
              } 
            : user
        );
        setUsers(updatedUsers);
        setMessage({ type: 'success', text: 'User updated successfully!' });
      } else {
        // Create new user
        const newUser: User = {
          id: Math.random().toString(36).substring(2, 9),
          username: formData.username,
          email: formData.email,
          msisdn: formData.userType === 'public' ? formData.msisdn : undefined,
          userType: formData.userType as 'staff' | 'public' | 'admin',
          organization: formData.userType === 'staff' ? formData.organization as 'Bridgetunes' | 'MTN' : null,
          isActive: formData.isActive,
          createdAt: new Date().toISOString()
        };
        setUsers([...users, newUser]);
        setMessage({ type: 'success', text: 'User created successfully!' });
      }
      
      setShowModal(false);
    } catch (error) {
      console.error('Error saving user:', error);
      setFormError('Failed to save user. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const handleToggleUserStatus = async (user: User) => {
    try {
      // In a real implementation, this would call an API endpoint
      // For now, we'll simulate a response
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updatedUsers = users.map(u => 
        u.id === user.id 
          ? { ...u, isActive: !u.isActive } 
          : u
      );
      setUsers(updatedUsers);
      
      setMessage({ 
        type: 'success', 
        text: `User ${user.username} ${!user.isActive ? 'activated' : 'deactivated'} successfully!` 
      });
    } catch (error) {
      console.error('Error toggling user status:', error);
      setMessage({ type: 'danger', text: 'Failed to update user status. Please try again.' });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      <Card>
        <CardTitle>User Management</CardTitle>
        
        {message && (
          <Alert variant={message.type} style={{ marginBottom: '1rem' }}>
            {message.text}
          </Alert>
        )}
        
        <Flex justify="space-between" align="center" style={{ marginBottom: '1.5rem' }}>
          <h3>Users</h3>
          <Button variant="primary" onClick={handleAddUser}>
            <FaUserEdit style={{ marginRight: '0.5rem' }} />
            Add User
          </Button>
        </Flex>
        
        <FilterContainer>
          <div>
            <label htmlFor="userTypeFilter">User Type:</label>
            <FilterSelect id="userTypeFilter" value={userTypeFilter} onChange={handleUserTypeFilterChange}>
              <option value="all">All Types</option>
              <option value="admin">Admin</option>
              <option value="staff">Staff</option>
              <option value="public">Public</option>
            </FilterSelect>
          </div>
          
          <div>
            <label htmlFor="organizationFilter">Organization:</label>
            <FilterSelect id="organizationFilter" value={organizationFilter} onChange={handleOrganizationFilterChange}>
              <option value="all">All Organizations</option>
              <option value="Bridgetunes">Bridgetunes</option>
              <option value="MTN">MTN</option>
              <option value="none">None</option>
            </FilterSelect>
          </div>
          
          <div style={{ flexGrow: 1 }}>
            <label htmlFor="searchQuery">Search:</label>
            <SearchInput
              id="searchQuery"
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search by username, email, or MSISDN..."
            />
          </div>
          
          <Button variant="secondary" onClick={fetchUsers} style={{ alignSelf: 'flex-end' }}>
            <FaFilter style={{ marginRight: '0.5rem' }} />
            Refresh
          </Button>
        </FilterContainer>
        
        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <Spinner />
            <p>Loading users...</p>
          </div>
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : filteredUsers.length === 0 ? (
          <NoUsersMessage>
            <FaUsers size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
            <p>No users found matching the selected filters.</p>
          </NoUsersMessage>
        ) : (
          <TableContainer>
            <Table>
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Email</th>
                  <th>MSISDN</th>
                  <th>User Type</th>
                  <th>Organization</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Last Login</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{user.msisdn || '-'}</td>
                    <td>
                      <UserTypeTag userType={user.userType}>
                        {user.userType === 'admin' ? 'Admin' : 
                         user.userType === 'staff' ? 'Staff' : 'Public'}
                      </UserTypeTag>
                    </td>
                    <td>
                      {user.organization ? (
                        <OrganizationTag organization={user.organization}>
                          {user.organization}
                        </OrganizationTag>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td>
                      <Badge variant={user.isActive ? 'success' : 'danger'}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td>{formatDate(user.createdAt)}</td>
                    <td>{user.lastLogin ? formatDate(user.lastLogin) : 'Never'}</td>
                    <td>
                      <ActionButton
                        variant="primary"
                        onClick={() => handleEditUser(user)}
                        title="Edit User"
                      >
                        <FaUserEdit />
                      </ActionButton>
                      <ActionButton
                        variant={user.isActive ? 'danger' : 'success'}
                        onClick={() => handleToggleUserStatus(user)}
                        title={user.isActive ? 'Deactivate User' : 'Activate User'}
                      >
                        {user.isActive ? <FaTimes /> : <FaCheck />}
                      </ActionButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </TableContainer>
        )}
      </Card>
      
      {/* User Form Modal */}
      {showModal && (
        <ModalOverlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => !processing && setShowModal(false)}
        >
          <ModalContent
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <ModalTitle>{editingUser ? 'Edit User' : 'Add User'}</ModalTitle>
            
            {formError && (
              <Alert variant="danger" style={{ marginBottom: '1rem' }}>
                {formError}
              </Alert>
            )}
            
            <FormGroup>
              <FormLabel htmlFor="username">Username</FormLabel>
              <FormInput
                id="username"
                name="username"
                value={formData.username}
                onChange={handleFormChange}
                disabled={processing}
              />
            </FormGroup>
            
            <FormGroup>
              <FormLabel htmlFor="email">Email</FormLabel>
              <FormInput
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleFormChange}
                disabled={processing}
              />
            </FormGroup>
            
            <FormGroup>
              <FormLabel htmlFor="userType">User Type</FormLabel>
              <FormSelect
                id="userType"
                name="userType"
                value={formData.userType}
                onChange={handleFormChange}
                disabled={processing}
              >
                <option value="public">Public</option>
                <option value="staff">Staff</option>
                <option value="admin">Admin</option>
              </FormSelect>
            </FormGroup>
            
            {formData.userType === 'public' && (
              <FormGroup>
                <FormLabel htmlFor="msisdn">MSISDN</FormLabel>
                <FormInput
                  id="msisdn"
                  name="msisdn"
                  value={formData.msisdn}
                  onChange={handleFormChange}
                  placeholder="+234..."
                  disabled={processing}
                />
              </FormGroup>
            )}
            
            {formData.userType === 'staff' && (
              <FormGroup>
                <FormLabel htmlFor="organization">Organization</FormLabel>
                <FormSelect
                  id="organization"
                  name="organization"
                  value={formData.organization}
                  onChange={handleFormChange}
                  disabled={processing}
                >
                  <option value="">Select Organization</option>
                  <option value="Bridgetunes">Bridgetunes</option>
                  <option value="MTN">MTN</option>
                </FormSelect>
              </FormGroup>
            )}
            
            <FormGroup>
              <FormLabel style={{ display: 'flex', alignItems: 'center' }}>
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                  style={{ marginRight: '0.5rem' }}
                  disabled={processing}
                />
                Active
              </FormLabel>
            </FormGroup>
            
            <ModalActions>
              <Button
                variant="secondary"
                onClick={() => !processing && setShowModal(false)}
                disabled={processing}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleSubmitForm}
                disabled={processing}
              >
                {processing ? <Spinner /> : (editingUser ? 'Update' : 'Create')}
              </Button>
            </ModalActions>
          </ModalContent>
        </ModalOverlay>
      )}
    </>
  );
};

export default UserManagement;
