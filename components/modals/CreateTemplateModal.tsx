import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaTimes, FaInfoCircle } from 'react-icons/fa';
import { notificationService } from '../../services/notification.service';

// Styled components for the modal
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
  min-height: 150px;
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

const VariablesInfo = styled.div`
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: #666;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const PreviewContainer = styled.div`
  margin-top: 1.5rem;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 1rem;
  background-color: #f9f9f9;
`;

const PreviewTitle = styled.h3`
  margin-top: 0;
  margin-bottom: 1rem;
  font-size: 1rem;
  color: #333;
`;

const PreviewContent = styled.div`
  font-family: 'Courier New', monospace;
  white-space: pre-wrap;
  word-break: break-word;
`;

const ErrorMessage = styled.div`
  color: #d32f2f;
  font-size: 0.875rem;
  margin-top: 0.5rem;
`;

interface CreateTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTemplateCreated: (template: any) => void;
}

const CreateTemplateModal: React.FC<CreateTemplateModalProps> = ({ isOpen, onClose, onTemplateCreated }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState('SMS');
  const [content, setContent] = useState('');
  const [previewContent, setPreviewContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setName('');
      setType('SMS');
      setContent('');
      setPreviewContent('');
      setError(null);
    }
  }, [isOpen]);
  
  // Generate preview content
  useEffect(() => {
    // Simple preview - in a real app, this would handle variable substitution with sample values
    let preview = content;
    
    // Replace variables with sample values
    preview = preview.replace(/{{amount}}/g, '500');
    preview = preview.replace(/{{points}}/g, '50');
    preview = preview.replace(/{{prize}}/g, 'N10,000');
    preview = preview.replace(/{{msisdn}}/g, '08012345678');
    preview = preview.replace(/{{name}}/g, 'John Doe');
    
    setPreviewContent(preview);
  }, [content]);
  
  const handleSubmit = async () => {
    // Validate form
    if (!name.trim()) {
      setError('Template name is required');
      return;
    }
    
    if (!content.trim()) {
      setError('Template content is required');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Call service to create template
      const newTemplate = await notificationService.createTemplate({
        name,
        type: type as 'SMS' | 'EMAIL' | 'IN_APP',
        content,
      });
      
      onTemplateCreated(newTemplate);
      onClose();
    } catch (err) {
      console.error('Error creating template:', err);
      setError('Failed to create template. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <ModalOverlay onClick={e => e.target === e.currentTarget && onClose()}>
      <ModalContainer>
        <ModalHeader>
          <ModalTitle>Create Template</ModalTitle>
          <CloseButton onClick={onClose}>
            <FaTimes />
          </CloseButton>
        </ModalHeader>
        
        <ModalBody>
          <FormGroup>
            <Label htmlFor="template-name">Template Name</Label>
            <Input
              id="template-name"
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Enter template name"
            />
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="template-type">Template Type</Label>
            <Select
              id="template-type"
              value={type}
              onChange={e => setType(e.target.value)}
            >
              <option value="SMS">SMS</option>
              <option value="EMAIL">Email</option>
              <option value="IN_APP">In-App</option>
            </Select>
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="template-content">Template Content</Label>
            <TextArea
              id="template-content"
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Enter template content. Use {{variable}} for dynamic content."
            />
            <VariablesInfo>
              <FaInfoCircle />
              Available variables: amount, points, prize, msisdn, name
            </VariablesInfo>
          </FormGroup>
          
          <PreviewContainer>
            <PreviewTitle>Preview</PreviewTitle>
            <PreviewContent>{previewContent || 'Template preview will appear here'}</PreviewContent>
          </PreviewContainer>
          
          {error && <ErrorMessage>{error}</ErrorMessage>}
        </ModalBody>
        
        <ModalFooter>
          <Button onClick={onClose}>Cancel</Button>
          <Button 
            variant="primary" 
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating...' : 'Create Template'}
          </Button>
        </ModalFooter>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default CreateTemplateModal;
