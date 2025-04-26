import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaExchangeAlt, FaFilter, FaCheck, FaTimes, FaDownload, FaSearch, FaBullhorn } from 'react-icons/fa';
import { Card, CardTitle, Button, Table, Badge, Spinner, Alert, Flex } from '../common/styles';
import { transactionAPI } from '../../services/api';

interface Transaction {
  id: string;
  msisdn: string;
  amount: number;
  date: string;
  isOptedIn: boolean;
  transactionType: 'topup' | 'bonus' | 'withdrawal';
  status: 'completed' | 'pending' | 'failed';
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

const NoTransactionsMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: ${({ theme }) => theme.colors.gray};
`;

const OptInStatus = styled(Badge)<{ isOptedIn: boolean }>`
  background-color: ${({ theme, isOptedIn }) => isOptedIn ? theme.colors.success : theme.colors.light};
  color: ${({ theme, isOptedIn }) => isOptedIn ? 'white' : theme.colors.dark};
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  
  &:hover {
    transform: scale(1.05);
    background-color: ${({ theme, isOptedIn }) => isOptedIn ? theme.colors.success : theme.colors.secondary};
  }
`;

const TransactionTypeTag = styled(Badge)<{ transactionType: 'topup' | 'bonus' | 'withdrawal' }>`
  background-color: ${({ theme, transactionType }) => 
    transactionType === 'topup' ? theme.colors.primary :
    transactionType === 'bonus' ? theme.colors.success :
    theme.colors.warning};
`;

const StatusTag = styled(Badge)<{ status: 'completed' | 'pending' | 'failed' }>`
  background-color: ${({ theme, status }) => 
    status === 'completed' ? theme.colors.success :
    status === 'pending' ? theme.colors.warning :
    theme.colors.danger};
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

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
`;

const TransactionManagement: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [optInFilter, setOptInFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [selectedMSISDNs, setSelectedMSISDNs] = useState<string[]>([]);
  const [campaignName, setCampaignName] = useState('');
  const [campaignMessage, setCampaignMessage] = useState('');
  const [processing, setProcessing] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'danger' | 'warning'; text: string } | null>(null);
  const [stats, setStats] = useState({
    totalTransactions: 0,
    totalAmount: 0,
    optedInCount: 0,
    optedInPercentage: 0
  });

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    filterTransactions();
    calculateStats();
  }, [transactions, optInFilter, typeFilter, statusFilter, searchQuery]);

  const fetchTransactions = async () => {
    setLoading(true);
    setError(null);
    try {
      // In a real implementation, this would call an API endpoint
      // For now, we'll simulate a response
      setTimeout(() => {
        const mockTransactions: Transaction[] = Array.from({ length: 50 }, (_, i) => ({
          id: `tx-${i + 1}`,
          msisdn: `+234${Math.floor(Math.random() * 9000000000 + 1000000000)}`,
          amount: Math.floor(Math.random() * 10000) + 100,
          date: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
          isOptedIn: Math.random() > 0.3,
          transactionType: ['topup', 'bonus', 'withdrawal'][Math.floor(Math.random() * 3)] as 'topup' | 'bonus' | 'withdrawal',
          status: ['completed', 'pending', 'failed'][Math.floor(Math.random() * 3)] as 'completed' | 'pending' | 'failed'
        }));
        setTransactions(mockTransactions);
        setFilteredTransactions(mockTransactions);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setError('Failed to fetch transactions. Please try again.');
      setLoading(false);
    }
  };

  const filterTransactions = () => {
    let filtered = [...transactions];
    
    // Filter by opt-in status
    if (optInFilter !== 'all') {
      const isOptedIn = optInFilter === 'opted-in';
      filtered = filtered.filter(transaction => transaction.isOptedIn === isOptedIn);
    }
    
    // Filter by transaction type
    if (typeFilter !== 'all') {
      filtered = filtered.filter(transaction => transaction.transactionType === typeFilter);
    }
    
    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(transaction => transaction.status === statusFilter);
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(transaction => 
        transaction.msisdn.includes(query) ||
        transaction.id.toLowerCase().includes(query)
      );
    }
    
    setFilteredTransactions(filtered);
  };

  const calculateStats = () => {
    const totalTransactions = transactions.length;
    const totalAmount = transactions.reduce((sum, tx) => sum + tx.amount, 0);
    const optedInCount = transactions.filter(tx => tx.isOptedIn).length;
    const optedInPercentage = totalTransactions > 0 ? (optedInCount / totalTransactions) * 100 : 0;
    
    setStats({
      totalTransactions,
      totalAmount,
      optedInCount,
      optedInPercentage
    });
  };

  const handleOptInFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setOptInFilter(e.target.value);
  };

  const handleTypeFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTypeFilter(e.target.value);
  };

  const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleToggleOptIn = async (transaction: Transaction) => {
    try {
      // In a real implementation, this would call an API endpoint
      // For now, we'll simulate a response
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updatedTransactions = transactions.map(tx => 
        tx.id === transaction.id 
          ? { ...tx, isOptedIn: !tx.isOptedIn } 
          : tx
      );
      setTransactions(updatedTransactions);
      
      setMessage({ 
        type: 'success', 
        text: `MSISDN ${transaction.msisdn} ${!transaction.isOptedIn ? 'opted in' : 'opted out'} successfully!` 
      });
    } catch (error) {
      console.error('Error toggling opt-in status:', error);
      setMessage({ type: 'danger', text: 'Failed to update opt-in status. Please try again.' });
    }
  };

  const handleExportData = () => {
    setMessage({ type: 'success', text: 'Transaction export initiated. The file will be downloaded shortly.' });
    // In a real implementation, this would trigger a file download
  };

  const handleCreateCampaign = () => {
    // Only allow creating campaigns for opted-in users
    const optedInTransactions = filteredTransactions.filter(tx => tx.isOptedIn);
    if (optedInTransactions.length === 0) {
      setMessage({ type: 'warning', text: 'No opted-in users found in the current filter selection.' });
      return;
    }
    
    // Get unique MSISDNs from the filtered transactions
    const uniqueMSISDNs = Array.from(new Set(optedInTransactions.map(tx => tx.msisdn)));
    setSelectedMSISDNs(uniqueMSISDNs);
    setCampaignName('');
    setCampaignMessage('');
    setShowCampaignModal(true);
  };

  const handleSubmitCampaign = async () => {
    if (!campaignName.trim()) {
      setMessage({ type: 'warning', text: 'Please enter a campaign name.' });
      return;
    }
    
    if (!campaignMessage.trim()) {
      setMessage({ type: 'warning', text: 'Please enter a campaign message.' });
      return;
    }
    
    setProcessing(true);
    
    try {
      // In a real implementation, this would call an API endpoint
      // For now, we'll simulate a response
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setShowCampaignModal(false);
      setMessage({ 
        type: 'success', 
        text: `Campaign "${campaignName}" created successfully for ${selectedMSISDNs.length} recipients!` 
      });
    } catch (error) {
      console.error('Error creating campaign:', error);
      setMessage({ type: 'danger', text: 'Failed to create campaign. Please try again.' });
    } finally {
      setProcessing(false);
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

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Mask MSISDN for privacy in the UI
  const maskMSISDN = (msisdn: string): string => {
    if (!msisdn || msisdn.length < 8) return msisdn;
    return msisdn.substring(0, 4) + '****' + msisdn.substring(msisdn.length - 3);
  };

  return (
    <>
      <Card>
        <CardTitle>Transaction Management</CardTitle>
        
        {message && (
          <Alert variant={message.type} style={{ marginBottom: '1rem' }}>
            {message.text}
          </Alert>
        )}
        
        <StatsContainer>
          <StatCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <StatValue>{stats.totalTransactions.toLocaleString()}</StatValue>
            <StatLabel>Total Transactions</StatLabel>
          </StatCard>
          
          <StatCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <StatValue>{formatAmount(stats.totalAmount)}</StatValue>
            <StatLabel>Total Amount</StatLabel>
          </StatCard>
          
          <StatCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <StatValue>{stats.optedInCount.toLocaleString()}</StatValue>
            <StatLabel>Opted-In Users</StatLabel>
          </StatCard>
          
          <StatCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <StatValue>{stats.optedInPercentage.toFixed(1)}%</StatValue>
            <StatLabel>Opt-In Rate</StatLabel>
          </StatCard>
        </StatsContainer>
        
        <Flex justify="space-between" align="center" style={{ marginBottom: '1.5rem' }}>
          <h3>Transactions</h3>
          <Flex gap="0.5rem">
            <Button variant="secondary" onClick={handleExportData}>
              <FaDownload style={{ marginRight: '0.5rem' }} />
              Export
            </Button>
            <Button variant="primary" onClick={handleCreateCampaign}>
              <FaBullhorn style={{ marginRight: '0.5rem' }} />
              Create Campaign
            </Button>
          </Flex>
        </Flex>
        
        <FilterContainer>
          <div>
            <label htmlFor="optInFilter">Opt-In Status:</label>
            <FilterSelect id="optInFilter" value={optInFilter} onChange={handleOptInFilterChange}>
              <option value="all">All Statuses</option>
              <option value="opted-in">Opted In</option>
              <option value="not-opted-in">Not Opted In</option>
            </FilterSelect>
          </div>
          
          <div>
            <label htmlFor="typeFilter">Transaction Type:</label>
            <FilterSelect id="typeFilter" value={typeFilter} onChange={handleTypeFilterChange}>
              <option value="all">All Types</option>
              <option value="topup">Top-up</option>
              <option value="bonus">Bonus</option>
              <option value="withdrawal">Withdrawal</option>
            </FilterSelect>
          </div>
          
          <div>
            <label htmlFor="statusFilter">Status:</label>
            <FilterSelect id="statusFilter" value={statusFilter} onChange={handleStatusFilterChange}>
              <option value="all">All Statuses</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </FilterSelect>
          </div>
          
          <div style={{ flexGrow: 1 }}>
            <label htmlFor="searchQuery">Search:</label>
            <SearchInput
              id="searchQuery"
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search by MSISDN or transaction ID..."
            />
          </div>
          
          <Button variant="secondary" onClick={fetchTransactions} style={{ alignSelf: 'flex-end' }}>
            <FaFilter style={{ marginRight: '0.5rem' }} />
            Refresh
          </Button>
        </FilterContainer>
        
        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <Spinner />
            <p>Loading transactions...</p>
          </div>
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : filteredTransactions.length === 0 ? (
          <NoTransactionsMessage>
            <FaExchangeAlt size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
            <p>No transactions found matching the selected filters.</p>
          </NoTransactionsMessage>
        ) : (
          <TableContainer>
            <Table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>MSISDN</th>
                  <th>Amount</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Opt-In Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td>{transaction.id}</td>
                    <td>{maskMSISDN(transaction.msisdn)}</td>
                    <td>{formatAmount(transaction.amount)}</td>
                    <td>
                      <TransactionTypeTag transactionType={transaction.transactionType}>
                        {transaction.transactionType === 'topup' ? 'Top-up' : 
                         transaction.transactionType === 'bonus' ? 'Bonus' : 'Withdrawal'}
                      </TransactionTypeTag>
                    </td>
                    <td>
                      <StatusTag status={transaction.status}>
                        {transaction.status === 'completed' ? 'Completed' : 
                         transaction.status === 'pending' ? 'Pending' : 'Failed'}
                      </StatusTag>
                    </td>
                    <td>{formatDate(transaction.date)}</td>
                    <td>
                      <OptInStatus 
                        isOptedIn={transaction.isOptedIn}
                        onClick={() => handleToggleOptIn(transaction)}
                      >
                        {transaction.isOptedIn ? (
                          <>
                            <FaCheck style={{ marginRight: '0.25rem' }} />
                            Opted In
                          </>
                        ) : (
                          <>
                            <FaTimes style={{ marginRight: '0.25rem' }} />
                            Not Opted In
                          </>
                        )}
                      </OptInStatus>
                    </td>
                    <td>
                      <ActionButton
                        variant="primary"
                        onClick={() => {
                          // View transaction details (would be implemented in a real application)
                          setMessage({ type: 'info', text: `Viewing details for transaction ${transaction.id}` });
                        }}
                        title="View Details"
                      >
                        <FaSearch />
                      </ActionButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </TableContainer>
        )}
      </Card>
      
      {/* Campaign Creation Modal */}
      {showCampaignModal && (
        <ModalOverlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => !processing && setShowCampaignModal(false)}
        >
          <ModalContent
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <ModalTitle>Create Campaign</ModalTitle>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <p>
                <strong>Recipients:</strong> {selectedMSISDNs.length} opted-in users
              </p>
            </div>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <label htmlFor="campaignName" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                Campaign Name
              </label>
              <input
                id="campaignName"
                type="text"
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
                placeholder="Enter campaign name"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #e2e8f0',
                  borderRadius: '0.375rem',
                  fontSize: '1rem'
                }}
                disabled={processing}
              />
            </div>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <label htmlFor="campaignMessage" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>
                Message
              </label>
              <textarea
                id="campaignMessage"
                value={campaignMessage}
                onChange={(e) => setCampaignMessage(e.target.value)}
                placeholder="Enter campaign message"
                rows={4}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #e2e8f0',
                  borderRadius: '0.375rem',
                  fontSize: '1rem',
                  resize: 'vertical'
                }}
                disabled={processing}
              />
            </div>
            
            <ModalActions>
              <Button
                variant="secondary"
                onClick={() => !processing && setShowCampaignModal(false)}
                disabled={processing}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleSubmitCampaign}
                disabled={processing}
              >
                {processing ? <Spinner /> : 'Create Campaign'}
              </Button>
            </ModalActions>
          </ModalContent>
        </ModalOverlay>
      )}
    </>
  );
};

export default TransactionManagement;
