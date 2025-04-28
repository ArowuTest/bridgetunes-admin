import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaTimes, FaCalendarAlt } from 'react-icons/fa';
import { notificationService } from '../../services/notification.service';

// Reuse styled components from other modals
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

// Define types for Segment and Template (should ideally be imported)
interface Segment {
  id: string;
  name: string;
  userCount?: number;
}

interface Template {
  id: string;
  name: string;
  type: string;
}

interface CreateCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCampaignCreated: (campaign: any) => void;
}

const CreateCampaignModal: React.FC<CreateCampaignModalProps> = ({ isOpen, onClose, onCampaignCreated }) => {
  const [name, setName] = useState('');
  const [segmentId, setSegmentId] = useState('');
  const [templateId, setTemplateId] = useState('');
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [recurrence, setRecurrence] = useState('ONE_TIME'); // Matches CampaignType
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [availableSegments, setAvailableSegments] = useState<Segment[]>([]);
  const [availableTemplates, setAvailableTemplates] = useState<Template[]>([]);
  
  // Fetch segments and templates when modal opens
  useEffect(() => {
    if (isOpen) {
      // Reset form
      setName('');
      setSegmentId('');
      setTemplateId('');
      setScheduleDate('');
      setScheduleTime('');
      setRecurrence('ONE_TIME');
      setError(null);
      
      // Fetch data for dropdowns
      const fetchData = async () => {
        try {
          const [segmentsData, templatesData] = await Promise.all([
            notificationService.getSegments(),
            notificationService.getAllTemplates()
          ]);
          setAvailableSegments(segmentsData);
          setAvailableTemplates(templatesData);
          // Set default selection if data exists
          if (segmentsData.length > 0) setSegmentId(segmentsData[0].id);
          if (templatesData.length > 0) setTemplateId(templatesData[0].id);
        } catch (err) {
          console.error('Error fetching segments/templates for modal:', err);
          setError('Could not load segments or templates.');
        }
      };
      fetchData();
    }
  }, [isOpen]);
  
  const handleSubmit = async () => {
    // Validate form
    if (!name.trim()) {
      setError('Campaign name is required');
      return;
    }
    if (!segmentId) {
      setError('Please select a user segment');
      return;
    }
    if (!templateId) {
      setError('Please select a notification template');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Build campaign data object
      const campaignData: any = {
        name,
        segmentId,
        templateId,
        type: recurrence as any, // Assuming recurrence maps directly to type for now
        // Add schedule details based on recurrence type
      };
      
      if (recurrence === 'ONE_TIME' || recurrence === 'SCHEDULED') { // Assuming SCHEDULED type exists
        if (scheduleDate && scheduleTime) {
          campaignData.schedule = {
            type: 'SCHEDULED',
            scheduledTime: `${scheduleDate}T${scheduleTime}:00`, // Combine date and time
            // timeZone: 'Africa/Lagos', // Add timezone if needed
          };
          campaignData.type = 'SCHEDULED'; // Set type explicitly if scheduled
        } else {
           campaignData.schedule = { type: 'IMMEDIATE' };
           campaignData.type = 'ONE_TIME'; // Default to immediate one-time if no date/time
        }
      } else if (recurrence === 'RECURRING') {
         // Basic recurring setup - needs cron expression input in a real app
         campaignData.schedule = {
            type: 'RECURRING',
            // cronExpression: '0 10 * * *', // Example: Daily at 10 AM
            // timeZone: 'Africa/Lagos',
         };
      }
      
      // Call service to create campaign
      const newCampaign = await notificationService.createCampaign(campaignData);
      
      onCampaignCreated(newCampaign);
      onClose();
    } catch (err) {
      console.error('Error creating campaign:', err);
      setError('Failed to create campaign. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <ModalOverlay onClick={e => e.target === e.currentTarget && onClose()}>
      <ModalContainer>
        <ModalHeader>
          <ModalTitle>Create Campaign</ModalTitle>
          <CloseButton onClick={onClose}>
            <FaTimes />
          </CloseButton>
        </ModalHeader>
        
        <ModalBody>
          <FormGroup>
            <Label htmlFor="campaign-name">Campaign Name</Label>
            <Input
              id="campaign-name"
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Enter campaign name"
            />
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="campaign-segment">User Segment</Label>
            <Select
              id="campaign-segment"
              value={segmentId}
              onChange={e => setSegmentId(e.target.value)}
              disabled={availableSegments.length === 0}
            >
              {availableSegments.length === 0 && <option>Loading segments...</option>}
              {availableSegments.map(segment => (
                <option key={segment.id} value={segment.id}>
                  {segment.name} ({segment.userCount ?? 'N/A'} users)
                </option>
              ))}
            </Select>
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="campaign-template">Notification Template</Label>
            <Select
              id="campaign-template"
              value={templateId}
              onChange={e => setTemplateId(e.target.value)}
              disabled={availableTemplates.length === 0}
            >
              {availableTemplates.length === 0 && <option>Loading templates...</option>}
              {availableTemplates.map(template => (
                <option key={template.id} value={template.id}>
                  {template.name} ({template.type})
                </option>
              ))}
            </Select>
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="campaign-recurrence">Recurrence</Label>
            <Select
              id="campaign-recurrence"
              value={recurrence}
              onChange={e => setRecurrence(e.target.value)}
            >
              <option value="ONE_TIME">One-time</option>
              <option value="SCHEDULED">Scheduled</option> {/* Added Scheduled explicitly */}
              <option value="RECURRING">Recurring</option>
              <option value="TRIGGERED">Triggered</option> {/* Add if applicable */}
              {/* <option value="MULTI_STEP">Multi-step</option> */}
              {/* <option value="AB_TEST">A/B Test</option> */}
            </Select>
          </FormGroup>
          
          {(recurrence === 'ONE_TIME' || recurrence === 'SCHEDULED') && (
            <FormGroup>
              <Label>Schedule (Optional - leave blank for immediate)</Label>
              <FormRow>
                <FormColumn>
                  <DatePickerWrapper>
                    <Input
                      type="date"
                      value={scheduleDate}
                      onChange={e => setScheduleDate(e.target.value)}
                    />
                    <FaCalendarAlt />
                  </DatePickerWrapper>
                </FormColumn>
                <FormColumn>
                  <Input
                    type="time"
                    value={scheduleTime}
                    onChange={e => setScheduleTime(e.target.value)}
                  />
                </FormColumn>
              </FormRow>
            </FormGroup>
          )}
          
          {/* Add inputs for RECURRING (e.g., cron expression) or TRIGGERED (e.g., trigger event) if needed */}
          
          {error && <ErrorMessage>{error}</ErrorMessage>}
        </ModalBody>
        
        <ModalFooter>
          <Button onClick={onClose}>Cancel</Button>
          <Button 
            variant="primary" 
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating...' : 'Create Campaign'}
          </Button>
        </ModalFooter>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default CreateCampaignModal;
