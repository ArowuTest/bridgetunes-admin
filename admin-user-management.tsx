import React from 'react';
import Head from 'next/head';
import AdminUserManagement from '../components/UserManagement/AdminUserManagement';
import styled from 'styled-components';

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

const AdminUserManagementPage: React.FC = () => {
  return (
    <>
      <Head>
        <title>Admin User Management | Bridgetunes Admin</title>
        <meta name="description" content="Manage admin users for Bridgetunes MTN promotion" />
      </Head>
      
      <PageContainer>
        <PageTitle>Admin User Management</PageTitle>
        <AdminUserManagement />
      </PageContainer>
    </>
  );
};

export default AdminUserManagementPage;
