import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Card, CardTitle } from '../common/styles';
import TransactionManagement from '../TransactionManagement/TransactionManagement';

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

const TransactionManagementPage: React.FC = () => {
  return (
    <PageContainer>
      <PageTitle>Transaction Management</PageTitle>
      <TransactionManagement />
    </PageContainer>
  );
};

export default TransactionManagementPage;
