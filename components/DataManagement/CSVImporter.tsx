import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaUpload, FaFile, FaCheck, FaTimes, FaSpinner } from 'react-icons/fa';
import { Card, CardTitle, Button, Alert, Flex } from '../common/styles';

interface CSVImporterProps {
  onImportSuccess: (data: {
    totalRecords: number;
    validRecords: number;
    invalidRecords: number;
    dataSource: string;
  }) => void;
  onImportError: (error: string) => void;
}

const UploadContainer = styled.div`
  border: 2px dashed ${({ theme }) => theme.colors.light};
  border-radius: ${({ theme }) => theme.borderRadius?.medium || '0.375rem'};
  padding: 2rem;
  text-align: center;
  margin-bottom: 1.5rem;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const FileInput = styled.input`
  display: none;
`;

const UploadIcon = styled(FaUpload)`
  font-size: 3rem;
  color: ${({ theme }) => theme.colors.gray};
  margin-bottom: 1rem;
`;

const UploadText = styled.p`
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.colors.gray};
`;

const SelectedFile = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background-color: ${({ theme }) => theme.colors.light};
  border-radius: ${({ theme }) => theme.borderRadius?.medium || '0.375rem'};
  margin-bottom: 1.5rem;
`;

const FileName = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const FileIcon = styled(FaFile)`
  color: ${({ theme }) => theme.colors.primary};
`;

const ProgressContainer = styled.div`
  margin-bottom: 1.5rem;
`;

const ProgressBar = styled.div<{ progress: number }>`
  height: 0.5rem;
  background-color: ${({ theme }) => theme.colors.light};
  border-radius: ${({ theme }) => theme.borderRadius?.small || '0.25rem'};
  overflow: hidden;
  margin-bottom: 0.5rem;
`;

const ProgressFill = styled.div<{ progress: number }>`
  height: 100%;
  width: ${({ progress }) => `${progress}%`};
  background-color: ${({ theme }) => theme.colors.primary};
  transition: width 0.3s ease;
`;

const ProgressText = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.gray};
`;

const ValidationResults = styled(motion.div)`
  margin-bottom: 1.5rem;
`;

const ValidationItem = styled.div<{ isValid: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  
  svg {
    color: ${({ theme, isValid }) => isValid ? theme.colors.success : theme.colors.danger};
  }
`;

const CSVImporter: React.FC<CSVImporterProps> = ({ onImportSuccess, onImportError }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [validationResults, setValidationResults] = useState<{
    hasHeaders: boolean;
    hasMSISDN: boolean;
    hasTopupAmount: boolean;
    hasTopupDate: boolean;
  } | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'danger' | 'warning'; text: string } | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      
      // Check if file is CSV
      if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
        setMessage({ type: 'danger', text: 'Please select a valid CSV file.' });
        return;
      }
      
      setSelectedFile(file);
      setMessage(null);
      validateCSV(file);
    }
  };
  
  const validateCSV = (file: File) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (!content) {
        setMessage({ type: 'danger', text: 'Failed to read file content.' });
        return;
      }
      
      const lines = content.split('\n');
      if (lines.length < 2) {
        setMessage({ type: 'danger', text: 'CSV file must contain at least a header row and one data row.' });
        return;
      }
      
      const headers = lines[0].toLowerCase().split(',');
      
      const validation = {
        hasHeaders: lines.length > 1,
        hasMSISDN: headers.some(h => h.includes('msisdn') || h.includes('phone') || h.includes('mobile')),
        hasTopupAmount: headers.some(h => h.includes('amount') || h.includes('topup') || h.includes('value')),
        hasTopupDate: headers.some(h => h.includes('date') || h.includes('time')),
      };
      
      setValidationResults(validation);
      
      if (!validation.hasMSISDN || !validation.hasTopupAmount || !validation.hasTopupDate) {
        setMessage({ 
          type: 'warning', 
          text: 'CSV file is missing required columns. Please ensure it contains MSISDN, topup amount, and date columns.' 
        });
      }
    };
    
    reader.onerror = () => {
      setMessage({ type: 'danger', text: 'Failed to read file. Please try again.' });
    };
    
    reader.readAsText(file);
  };
  
  const handleUpload = () => {
    if (!selectedFile) {
      setMessage({ type: 'warning', text: 'Please select a file to upload.' });
      return;
    }
    
    if (validationResults && (!validationResults.hasMSISDN || !validationResults.hasTopupAmount || !validationResults.hasTopupDate)) {
      setMessage({ 
        type: 'warning', 
        text: 'CSV file is missing required columns. Please select a valid file.' 
      });
      return;
    }
    
    setUploading(true);
    setUploadProgress(0);
    setMessage(null);
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        const newProgress = prev + Math.random() * 10;
        return newProgress >= 100 ? 100 : newProgress;
      });
    }, 300);
    
    // Simulate upload completion
    setTimeout(() => {
      clearInterval(interval);
      setUploadProgress(100);
      
      // Simulate processing delay
      setTimeout(() => {
        setUploading(false);
        
        // Generate random stats for demo
        const totalRecords = 5000;
        const validRecords = totalRecords - Math.floor(Math.random() * 20);
        
        onImportSuccess({
          totalRecords,
          validRecords,
          invalidRecords: totalRecords - validRecords,
          dataSource: selectedFile.name
        });
        
        setMessage({ type: 'success', text: 'File uploaded and processed successfully!' });
        
        // Reset state after success
        setSelectedFile(null);
        setValidationResults(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }, 1000);
    }, 3000);
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      
      // Check if file is CSV
      if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
        setMessage({ type: 'danger', text: 'Please select a valid CSV file.' });
        return;
      }
      
      setSelectedFile(file);
      setMessage(null);
      validateCSV(file);
    }
  };
  
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  return (
    <Card>
      <CardTitle>Import MSISDN Data</CardTitle>
      
      {message && (
        <Alert variant={message.type} style={{ marginBottom: '1rem' }}>
          {message.text}
        </Alert>
      )}
      
      <FileInput
        type="file"
        accept=".csv"
        ref={fileInputRef}
        onChange={handleFileSelect}
      />
      
      {!selectedFile ? (
        <UploadContainer
          onClick={triggerFileInput}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <UploadIcon />
          <UploadText>
            Drag and drop a CSV file here, or click to select a file
          </UploadText>
          <Button variant="primary">
            <FaUpload style={{ marginRight: '0.5rem' }} />
            Select CSV File
          </Button>
        </UploadContainer>
      ) : (
        <>
          <SelectedFile>
            <FileName>
              <FileIcon />
              <span>{selectedFile.name}</span>
            </FileName>
            <Button
              variant="danger"
              onClick={() => {
                setSelectedFile(null);
                setValidationResults(null);
                if (fileInputRef.current) {
                  fileInputRef.current.value = '';
                }
              }}
              disabled={uploading}
            >
              <FaTimes />
            </Button>
          </SelectedFile>
          
          {validationResults && (
            <ValidationResults
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3 }}
            >
              <h4>File Validation</h4>
              <ValidationItem isValid={validationResults.hasHeaders}>
                {validationResults.hasHeaders ? <FaCheck /> : <FaTimes />}
                <span>Contains header row</span>
              </ValidationItem>
              <ValidationItem isValid={validationResults.hasMSISDN}>
                {validationResults.hasMSISDN ? <FaCheck /> : <FaTimes />}
                <span>Contains MSISDN column</span>
              </ValidationItem>
              <ValidationItem isValid={validationResults.hasTopupAmount}>
                {validationResults.hasTopupAmount ? <FaCheck /> : <FaTimes />}
                <span>Contains topup amount column</span>
              </ValidationItem>
              <ValidationItem isValid={validationResults.hasTopupDate}>
                {validationResults.hasTopupDate ? <FaCheck /> : <FaTimes />}
                <span>Contains date column</span>
              </ValidationItem>
            </ValidationResults>
          )}
          
          {uploading && (
            <ProgressContainer>
              <ProgressBar progress={uploadProgress}>
                <ProgressFill progress={uploadProgress} />
              </ProgressBar>
              <ProgressText>
                <span>Uploading...</span>
                <span>{Math.round(uploadProgress)}%</span>
              </ProgressText>
            </ProgressContainer>
          )}
          
          <Flex justify="center">
            <Button
              variant="primary"
              onClick={handleUpload}
              disabled={uploading}
              style={{ width: '100%' }}
            >
              {uploading ? (
                <>
                  <FaSpinner style={{ marginRight: '0.5rem', animation: 'spin 1s linear infinite' }} />
                  Uploading...
                </>
              ) : (
                <>
                  <FaUpload style={{ marginRight: '0.5rem' }} />
                  Upload and Process
                </>
              )}
            </Button>
          </Flex>
        </>
      )}
    </Card>
  );
};

export default CSVImporter;
