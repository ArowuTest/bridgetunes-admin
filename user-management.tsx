import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Card, CardTitle } from '../common/styles';
import UserManagement from '../UserManagement/UserManagement';

const PageContainer = styled.div`
  padding: 2rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints?.mobile || '576px'}) {
    padding: 1rem;
  }
`;

const PageTitle = styled.h1`
  margin-bottom: 2rem;
  font-size: 2rem;
  color: ${({ theme }) => theme.colors.dark};
`;

const UserManagementPage: React.FC = () => {
  return (
    <PageContainer>
      <PageTitle>User Management</PageTitle>
      <UserManagement />
    </PageContainer>
  );
};

export default UserManagementPage;
