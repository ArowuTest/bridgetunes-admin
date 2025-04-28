import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaTimes, FaCalendarAlt } from 'react-icons/fa';
import { notificationService } from '../../services/notification.service';

// Reuse styled components from CreateTemplateModal
const ModalOverlay = styled.div`
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
`;

const ModalContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 0;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e0e0e0;
`;

const ModalTitle = styled.h2`
  margin: 0;
  font-size: 1.5rem;
  color: #333;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
  color: #666;
  
  &:hover {
    color: #333;
  }
`;

const ModalBody = styled.div`
  padding: 1.5rem;
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1rem 1.5rem;
  border-top: 1px solid #e0e0e0;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #333;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #0066cc;
    box-shadow: 0 0 0 2px rgba(0, 102, 204, 0.2);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
  background-color: white;
  
  &:focus {
    outline: none;
    border-color: #0066cc;
    box-shadow: 0 0 0 2px rgba(0, 102, 204, 0.2);
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: #0066cc;
    box-shadow: 0 0 0 2px rgba(0, 102, 204, 0.2);
  }
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  
  background-color: ${props => props.variant === 'primary' ? '#0066cc' : '#f0f0f0'};
  color: ${props => props.variant === 'primary' ? 'white' : '#333'};
  
  &:hover {
    background-color: ${props => props.variant === 'primary' ? '#0052a3' : '#e0e0e0'};
  }
  
  &:disabled {
    background-color: ${props => props.variant === 'primary' ? '#99c2ff' : '#f0f0f0'};
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #d32f2f;
  font-size: 0.875rem;
  margin-top: 0.5rem;
`;

const SectionTitle = styled.h3`
  margin-top: 1.5rem;
  margin-bottom: 1rem;
  font-size: 1.1rem;
  color: #333;
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 0.5rem;
`;

const FormRow = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.5rem;
  }
`;

const FormColumn = styled.div`
  flex: 1;
`;

const DatePickerWrapper = styled.div`
  position: relative;
  
  svg {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    color: #666;
    pointer-events: none;
  }
`;

interface CreateSegmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSegmentCreated: (segment: any) => void;
}

const CreateSegmentModal: React.FC<CreateSegmentModalProps> = ({ isOpen, onClose, onSegmentCreated }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [minRechargeAmount, setMinRechargeAmount] = useState('');
  const [maxRechargeAmount, setMaxRechargeAmount] = useState('');
  const [lastRechargeBefore, setLastRechargeBefore] = useState('');
  const [lastRechargeAfter, setLastRechargeAfter] = useState('');
  const [optInFrom, setOptInFrom] = useState('');
  const [optInTo, setOptInTo] = useState('');
  const [optInStatus, setOptInStatus] = useState('Any');
  const [rechargePattern, setRechargePattern] = useState('Any');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setName('');
      setDescription('');
      setMinRechargeAmount('');
      setMaxRechargeAmount('');
      setLastRechargeBefore('');
      setLastRechargeAfter('');
      setOptInFrom('');
      setOptInTo('');
      setOptInStatus('Any');
      setRechargePattern('Any');
      setError(null);
    }
  }, [isOpen]);
  
  const handleSubmit = async () => {
    // Validate form
    if (!name.trim()) {
      setError('Segment name is required');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Build criteria object based on form inputs
      const criteria: Record<string, any> = {};
      
      if (minRechargeAmount || maxRechargeAmount) {
        criteria.rechargeAmount = {};
        if (minRechargeAmount) criteria.rechargeAmount.min = Number(minRechargeAmount);
        if (maxRechargeAmount) criteria.rechargeAmount.max = Number(maxRechargeAmount);
      }
      
      if (lastRechargeBefore || lastRechargeAfter) {
        criteria.lastRechargeDate = {};
        if (lastRechargeBefore) criteria.lastRechargeDate.before = lastRechargeBefore;
        if (lastRechargeAfter) criteria.lastRechargeDate.after = lastRechargeAfter;
      }
      
      if (optInFrom || optInTo) {
        criteria.optInDate = {};
        if (optInFrom) criteria.optInDate.from = optInFrom;
        if (optInTo) criteria.optInDate.to = optInTo;
      }
      
      if (optInStatus !== 'Any') {
        criteria.optInStatus = optInStatus;
      }
      
      if (rechargePattern !== 'Any') {
        criteria.rechargePattern = rechargePattern;
      }
      
      // Call service to create segment
      const newSegment = await notificationService.createSegment({
        name,
        description,
        criteria,
      });
      
      onSegmentCreated(newSegment);
      onClose();
    } catch (err) {
      console.error('Error creating segment:', err);
      setError('Failed to create segment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <ModalOverlay onClick={e => e.target === e.currentTarget && onClose()}>
      <ModalContainer>
        <ModalHeader>
          <ModalTitle>Create Segment</ModalTitle>
          <CloseButton onClick={onClose}>
            <FaTimes />
          </CloseButton>
        </ModalHeader>
        
        <ModalBody>
          <FormGroup>
            <Label htmlFor="segment-name">Segment Name</Label>
            <Input
              id="segment-name"
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Enter segment name"
            />
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="segment-description">Description</Label>
            <TextArea
              id="segment-description"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Enter segment description"
            />
          </FormGroup>
          
          <SectionTitle>Segment Criteria</SectionTitle>
          
          <FormGroup>
            <Label>Total Recharge Amount</Label>
            <FormRow>
              <FormColumn>
                <Input
                  type="number"
                  value={minRechargeAmount}
                  onChange={e => setMinRechargeAmount(e.target.value)}
                  placeholder="Min"
                  min="0"
                />
              </FormColumn>
              <FormColumn>
                <Input
                  type="number"
                  value={maxRechargeAmount}
                  onChange={e => setMaxRechargeAmount(e.target.value)}
                  placeholder="Max"
                  min="0"
                />
              </FormColumn>
            </FormRow>
          </FormGroup>
          
          <FormGroup>
            <Label>Last Recharge Date</Label>
            <FormRow>
              <FormColumn>
                <Label>Before</Label>
                <DatePickerWrapper>
                  <Input
                    type="date"
                    value={lastRechargeBefore}
                    onChange={e => setLastRechargeBefore(e.target.value)}
                  />
                  <FaCalendarAlt />
                </DatePickerWrapper>
              </FormColumn>
              <FormColumn>
                <Label>After</Label>
                <DatePickerWrapper>
                  <Input
                    type="date"
                    value={lastRechargeAfter}
                    onChange={e => setLastRechargeAfter(e.target.value)}
                  />
                  <FaCalendarAlt />
                </DatePickerWrapper>
              </FormColumn>
            </FormRow>
          </FormGroup>
          
          <FormGroup>
            <Label>Opt-in Date</Label>
            <FormRow>
              <FormColumn>
                <Label>From</Label>
                <DatePickerWrapper>
                  <Input
                    type="date"
                    value={optInFrom}
                    onChange={e => setOptInFrom(e.target.value)}
                  />
                  <FaCalendarAlt />
                </DatePickerWrapper>
              </FormColumn>
              <FormColumn>
                <Label>To</Label>
                <DatePickerWrapper>
                  <Input
                    type="date"
                    value={optInTo}
                    onChange={e => setOptInTo(e.target.value)}
                  />
                  <FaCalendarAlt />
                </DatePickerWrapper>
              </FormColumn>
            </FormRow>
          </FormGroup>
          
          <FormRow>
            <FormColumn>
              <FormGroup>
                <Label htmlFor="opt-in-status">Opt-in Status</Label>
                <Select
                  id="opt-in-status"
                  value={optInStatus}
                  onChange={e => setOptInStatus(e.target.value)}
                >
                  <option value="Any">Any</option>
                  <option value="Opted">Opted In</option>
                  <option value="Not Opted">Not Opted In</option>
                </Select>
              </FormGroup>
            </FormColumn>
            <FormColumn>
              <FormGroup>
                <Label htmlFor="recharge-pattern">Recharge Pattern</Label>
                <Select
                  id="recharge-pattern"
                  value={rechargePattern}
                  onChange={e => setRechargePattern(e.target.value)}
                >
                  <option value="Any">Any</option>
                  <option value="Weekday">Weekday</option>
                  <option value="Weekend">Weekend</option>
                  <option value="Monthly">Monthly</option>
                </Select>
              </FormGroup>
            </FormColumn>
          </FormRow>
          
          {error && <ErrorMessage>{error}</ErrorMessage>}
        </ModalBody>
        
        <ModalFooter>
          <Button onClick={onClose}>Cancel</Button>
          <Button 
            variant="primary" 
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating...' : 'Create Segment'}
          </Button>
        </ModalFooter>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default CreateSegmentModal;
