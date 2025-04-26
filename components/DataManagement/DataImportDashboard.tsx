import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaUpload, FaDatabase, FaCheck, FaExclamationTriangle, FaSearch, FaDownload } from 'react-icons/fa';
import { Card, CardTitle, Button, Table, Badge, Spinner, Alert, Grid, Col, Flex } from '../common/styles';
import { userAPI } from '../../services/api';

interface DataImportStats {
  totalRecords: number;
  validRecords: number;
  invalidRecords: number;
  importDate: string;
  dataSource: string;
  status: 'success' | 'partial' | 'failed';
}

interface SampleRecord {
  msisdn: string;
  isOptedIn: boolean;
  topupAmount: number;
  topupDate: string;
}

const StatsGrid = styled(Grid)`
  margin-bottom: 1.5rem;
`;

const StatCard = styled(motion.div)`
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius?.medium || '0.375rem'};
  padding: 1.5rem;
  box-shadow: ${({ theme }) => theme.shadows?.small || '0 2px 4px rgba(0, 0, 0, 0.1)'};
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: ${({ theme }) => theme.colors.primary};
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.gray};
`;

const ImportInfo = styled.div`
  margin-bottom: 1.5rem;
  padding: 1rem;
  background-color: ${({ theme }) => theme.colors.light};
  border-radius: ${({ theme }) => theme.borderRadius?.medium || '0.375rem'};
`;

const InfoItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const InfoLabel = styled.span`
  font-weight: 600;
`;

const InfoValue = styled.span`
  color: ${({ theme }) => theme.colors.dark};
`;

const SearchContainer = styled.div`
  margin-bottom: 1.5rem;
`;

const SearchInput = styled.input`
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

const TableContainer = styled.div`
  overflow-x: auto;
  margin-top: 1rem;
`;

const NoDataMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: ${({ theme }) => theme.colors.gray};
`;

const DataImportDashboard: React.FC = () => {
  const [importStats, setImportStats] = useState<DataImportStats | null>(null);
  const [sampleRecords, setSampleRecords] = useState<SampleRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SampleRecord[]>([]);
  const [searching, setSearching] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'danger' | 'warning'; text: string } | null>(null);

  useEffect(() => {
    fetchImportStats();
    fetchSampleRecords();
  }, []);

  const fetchImportStats = async () => {
    setLoading(true);
    setError(null);
    try {
      // In a real implementation, this would call an API endpoint
      // For now, we'll simulate a response
      setTimeout(() => {
        setImportStats({
          totalRecords: 5000,
          validRecords: 4985,
          invalidRecords: 15,
          importDate: new Date().toISOString(),
          dataSource: 'msisdn_data.csv',
          status: 'success'
        });
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching import stats:', error);
      setError('Failed to fetch import statistics. Please try again.');
      setLoading(false);
    }
  };

  const fetchSampleRecords = async () => {
    try {
      // In a real implementation, this would call an API endpoint
      // For now, we'll simulate a response
      setTimeout(() => {
        const mockRecords: SampleRecord[] = Array.from({ length: 10 }, (_, i) => ({
          msisdn: `+234${Math.floor(Math.random() * 9000000000 + 1000000000)}`,
          isOptedIn: Math.random() > 0.3,
          topupAmount: Math.floor(Math.random() * 10000) + 100,
          topupDate: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString()
        }));
        setSampleRecords(mockRecords);
      }, 1500);
    } catch (error) {
      console.error('Error fetching sample records:', error);
      // We don't set an error here as it's not critical
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setMessage({ type: 'warning', text: 'Please enter a search query.' });
      return;
    }

    setSearching(true);
    setMessage(null);
    setSearchResults([]);

    try {
      // In a real implementation, this would call an API endpoint
      // For now, we'll simulate a response
      setTimeout(() => {
        // Simulate finding a record if the query is a number
        if (/^\d+$/.test(searchQuery)) {
          const mockRecord: SampleRecord = {
            msisdn: `+234${searchQuery.padEnd(10, '0').substring(0, 10)}`,
            isOptedIn: Math.random() > 0.3,
            topupAmount: Math.floor(Math.random() * 10000) + 100,
            topupDate: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString()
          };
          setSearchResults([mockRecord]);
        } else {
          setMessage({ type: 'warning', text: 'No records found matching your query.' });
        }
        setSearching(false);
      }, 1000);
    } catch (error) {
      console.error('Error searching records:', error);
      setMessage({ type: 'danger', text: 'Failed to search records. Please try again.' });
      setSearching(false);
    }
  };

  const handleExportData = () => {
    setMessage({ type: 'success', text: 'Data export initiated. The file will be downloaded shortly.' });
    // In a real implementation, this would trigger a file download
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

  return (
    <Card>
      <CardTitle>Data Import Dashboard</CardTitle>
      
      {message && (
        <Alert variant={message.type} style={{ marginBottom: '1rem' }}>
          {message.text}
        </Alert>
      )}
      
      {loading ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <Spinner />
          <p>Loading data import information...</p>
        </div>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : importStats ? (
        <>
          <StatsGrid columns={3} gap="1rem">
            <StatCard
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <StatValue>{importStats.totalRecords.toLocaleString()}</StatValue>
              <StatLabel>Total Records</StatLabel>
            </StatCard>
            
            <StatCard
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <StatValue>{importStats.validRecords.toLocaleString()}</StatValue>
              <StatLabel>Valid Records</StatLabel>
            </StatCard>
            
            <StatCard
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <StatValue>{importStats.invalidRecords.toLocaleString()}</StatValue>
              <StatLabel>Invalid Records</StatLabel>
            </StatCard>
          </StatsGrid>
          
          <ImportInfo>
            <InfoItem>
              <InfoLabel>Import Date:</InfoLabel>
              <InfoValue>{formatDate(importStats.importDate)}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Data Source:</InfoLabel>
              <InfoValue>{importStats.dataSource}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Status:</InfoLabel>
              <InfoValue>
                {importStats.status === 'success' && (
                  <Badge variant="success">Success</Badge>
                )}
                {importStats.status === 'partial' && (
                  <Badge variant="warning">Partial Success</Badge>
                )}
                {importStats.status === 'failed' && (
                  <Badge variant="danger">Failed</Badge>
                )}
              </InfoValue>
            </InfoItem>
          </ImportInfo>
          
          <Flex justify="space-between" align="center" style={{ marginBottom: '1rem' }}>
            <h3>Sample Records</h3>
            <Button variant="secondary" onClick={handleExportData}>
              <FaDownload style={{ marginRight: '0.5rem' }} />
              Export Data
            </Button>
          </Flex>
          
          <SearchContainer>
            <Flex gap="0.5rem">
              <SearchInput
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by MSISDN..."
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <Button variant="primary" onClick={handleSearch} disabled={searching}>
                {searching ? <Spinner /> : <FaSearch />}
              </Button>
            </Flex>
          </SearchContainer>
          
          {searchResults.length > 0 ? (
            <>
              <h4>Search Results</h4>
              <TableContainer>
                <Table>
                  <thead>
                    <tr>
                      <th>MSISDN</th>
                      <th>Opt-In Status</th>
                      <th>Top-up Amount</th>
                      <th>Top-up Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {searchResults.map((record, index) => (
                      <tr key={index}>
                        <td>{record.msisdn}</td>
                        <td>
                          {record.isOptedIn ? (
                            <Badge variant="success">Opted In</Badge>
                          ) : (
                            <Badge variant="danger">Not Opted In</Badge>
                          )}
                        </td>
                        <td>{formatAmount(record.topupAmount)}</td>
                        <td>{formatDate(record.topupDate)}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </TableContainer>
            </>
          ) : (
            <>
              <h4>Recent Records</h4>
              {sampleRecords.length > 0 ? (
                <TableContainer>
                  <Table>
                    <thead>
                      <tr>
                        <th>MSISDN</th>
                        <th>Opt-In Status</th>
                        <th>Top-up Amount</th>
                        <th>Top-up Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sampleRecords.map((record, index) => (
                        <tr key={index}>
                          <td>{record.msisdn}</td>
                          <td>
                            {record.isOptedIn ? (
                              <Badge variant="success">Opted In</Badge>
                            ) : (
                              <Badge variant="danger">Not Opted In</Badge>
                            )}
                          </td>
                          <td>{formatAmount(record.topupAmount)}</td>
                          <td>{formatDate(record.topupDate)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </TableContainer>
              ) : (
                <NoDataMessage>
                  <FaDatabase size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
                  <p>No sample records available.</p>
                </NoDataMessage>
              )}
            </>
          )}
        </>
      ) : (
        <NoDataMessage>
          <FaExclamationTriangle size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
          <p>No import data available. Please upload a CSV file to see import statistics.</p>
          <Button variant="primary" style={{ marginTop: '1rem' }}>
            <FaUpload style={{ marginRight: '0.5rem' }} />
            Upload CSV
          </Button>
        </NoDataMessage>
      )}
    </Card>
  );
};

export default DataImportDashboard;
