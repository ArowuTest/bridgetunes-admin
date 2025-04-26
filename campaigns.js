// Campaigns Module for Notification Management System
// This file implements the Campaigns functionality for creating and managing notification campaigns

class CampaignsModule {
  constructor(userSegmentsModule, notificationTemplatesModule) {
    this.campaigns = [];
    this.userSegmentsModule = userSegmentsModule;
    this.notificationTemplatesModule = notificationTemplatesModule;
    this.campaignTypes = [
      { id: 'oneTime', label: 'One-time Campaign', description: 'Send a single notification to a target segment' },
      { id: 'recurring', label: 'Recurring Campaign', description: 'Send notifications on a regular schedule' },
      { id: 'triggered', label: 'Triggered Campaign', description: 'Send notifications based on user actions or events' },
      { id: 'multiStep', label: 'Multi-step Campaign', description: 'Send a sequence of notifications over time' },
      { id: 'abTest', label: 'A/B Test Campaign', description: 'Test different templates with a target segment' }
    ];
    this.scheduleTypes = [
      { id: 'immediate', label: 'Immediate', description: 'Send as soon as campaign is activated' },
      { id: 'scheduled', label: 'Scheduled', description: 'Send at a specific date and time' },
      { id: 'recurring', label: 'Recurring', description: 'Send on a regular schedule (daily, weekly, monthly)' }
    ];
    this.recurringPatterns = [
      { id: 'daily', label: 'Daily', description: 'Send every day' },
      { id: 'weekly', label: 'Weekly', description: 'Send on specific days of the week' },
      { id: 'monthly', label: 'Monthly', description: 'Send on specific days of the month' }
    ];
    this.triggerTypes = [
      { id: 'topup', label: 'Topup', description: 'Triggered by user topup' },
      { id: 'optIn', label: 'Opt-in', description: 'Triggered by user opt-in' },
      { id: 'drawEligibility', label: 'Draw Eligibility', description: 'Triggered by draw eligibility status change' },
      { id: 'winnerSelection', label: 'Winner Selection', description: 'Triggered when user is selected as winner' },
      { id: 'inactivity', label: 'Inactivity', description: 'Triggered after period of inactivity' }
    ];
  }

  // Create a new campaign
  createCampaign(name, description, segmentId, templateId, type, schedule, options = {}) {
    const campaignId = this.generateUniqueId();
    
    // Validate segment and template
    const segment = this.userSegmentsModule.getSegmentById(segmentId);
    if (!segment) {
      throw new Error(`Segment with ID ${segmentId} not found`);
    }
    
    const template = this.notificationTemplatesModule.getTemplateById(templateId);
    if (!template) {
      throw new Error(`Template with ID ${templateId} not found`);
    }
    
    // Create campaign object
    const newCampaign = {
      id: campaignId,
      name,
      description,
      segment: {
        id: segment.id,
        name: segment.name,
        estimatedSize: segment.estimatedSize
      },
      template: {
        id: template.id,
        name: template.name,
        type: template.type
      },
      type,
      schedule,
      options,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      metrics: {
        sent: 0,
        delivered: 0,
        failed: 0,
        responses: 0,
        conversions: 0
      }
    };
    
    // Add type-specific properties
    switch (type) {
      case 'recurring':
        newCampaign.recurringPattern = options.recurringPattern || 'weekly';
        newCampaign.recurringDays = options.recurringDays || [1]; // Monday by default
        newCampaign.recurringTime = options.recurringTime || '09:00';
        break;
        
      case 'triggered':
        newCampaign.triggerType = options.triggerType || 'topup';
        newCampaign.triggerConditions = options.triggerConditions || {};
        break;
        
      case 'multiStep':
        newCampaign.steps = options.steps || [];
        break;
        
      case 'abTest':
        newCampaign.variants = options.variants || [];
        newCampaign.testDuration = options.testDuration || 7; // 7 days by default
        newCampaign.winnerCriteria = options.winnerCriteria || 'response';
        break;
    }
    
    this.campaigns.push(newCampaign);
    return newCampaign;
  }

  // Update an existing campaign
  updateCampaign(campaignId, updates) {
    const campaignIndex = this.campaigns.findIndex(c => c.id === campaignId);
    if (campaignIndex === -1) {
      throw new Error(`Campaign with ID ${campaignId} not found`);
    }
    
    // Don't allow updating certain properties directly
    const protectedProps = ['id', 'createdAt', 'metrics'];
    const filteredUpdates = Object.keys(updates)
      .filter(key => !protectedProps.includes(key))
      .reduce((obj, key) => {
        obj[key] = updates[key];
        return obj;
      }, {});
    
    // Update segment reference if segmentId is provided
    if (updates.segmentId) {
      const segment = this.userSegmentsModule.getSegmentById(updates.segmentId);
      if (!segment) {
        throw new Error(`Segment with ID ${updates.segmentId} not found`);
      }
      filteredUpdates.segment = {
        id: segment.id,
        name: segment.name,
        estimatedSize: segment.estimatedSize
      };
      delete filteredUpdates.segmentId;
    }
    
    // Update template reference if templateId is provided
    if (updates.templateId) {
      const template = this.notificationTemplatesModule.getTemplateById(updates.templateId);
      if (!template) {
        throw new Error(`Template with ID ${updates.templateId} not found`);
      }
      filteredUpdates.template = {
        id: template.id,
        name: template.name,
        type: template.type
      };
      delete filteredUpdates.templateId;
    }
    
    // Update the campaign
    const updatedCampaign = {
      ...this.campaigns[campaignIndex],
      ...filteredUpdates,
      updatedAt: new Date().toISOString()
    };
    
    this.campaigns[campaignIndex] = updatedCampaign;
    return updatedCampaign;
  }

  // Clone an existing campaign
  cloneCampaign(campaignId, newName) {
    const sourceCampaign = this.campaigns.find(c => c.id === campaignId);
    if (!sourceCampaign) {
      throw new Error(`Campaign with ID ${campaignId} not found`);
    }
    
    // Create a new campaign based on the source
    const clonedCampaign = {
      ...JSON.parse(JSON.stringify(sourceCampaign)),
      id: this.generateUniqueId(),
      name: newName || `Copy of ${sourceCampaign.name}`,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      metrics: {
        sent: 0,
        delivered: 0,
        failed: 0,
        responses: 0,
        conversions: 0
      }
    };
    
    this.campaigns.push(clonedCampaign);
    return clonedCampaign;
  }

  // Archive a campaign (soft delete)
  archiveCampaign(campaignId) {
    const campaignIndex = this.campaigns.findIndex(c => c.id === campaignId);
    if (campaignIndex === -1) {
      throw new Error(`Campaign with ID ${campaignId} not found`);
    }
    
    // Update status to archived
    this.campaigns[campaignIndex].status = 'archived';
    this.campaigns[campaignIndex].updatedAt = new Date().toISOString();
    
    return this.campaigns[campaignIndex];
  }

  // Get all campaigns
  getAllCampaigns(includeArchived = false) {
    if (includeArchived) {
      return this.campaigns;
    }
    return this.campaigns.filter(c => c.status !== 'archived');
  }

  // Get campaigns by status
  getCampaignsByStatus(status) {
    return this.campaigns.filter(c => c.status === status);
  }

  // Get campaigns by type
  getCampaignsByType(type) {
    return this.campaigns.filter(c => c.type === type);
  }

  // Get a specific campaign by ID
  getCampaignById(campaignId) {
    return this.campaigns.find(c => c.id === campaignId);
  }

  // Activate a campaign
  activateCampaign(campaignId) {
    const campaign = this.getCampaignById(campaignId);
    if (!campaign) {
      throw new Error(`Campaign with ID ${campaignId} not found`);
    }
    
    // Validate campaign before activation
    const validation = this.validateCampaign(campaign);
    if (!validation.isValid) {
      throw new Error(`Campaign validation failed: ${validation.errors.join(', ')}`);
    }
    
    // Update status based on schedule
    if (campaign.schedule.type === 'immediate') {
      campaign.status = 'active';
      campaign.executionStartedAt = new Date().toISOString();
      
      // In a real implementation, this would trigger the actual sending process
      // For this demo, we'll just update the status
      setTimeout(() => {
        campaign.status = 'completed';
        campaign.executionCompletedAt = new Date().toISOString();
        campaign.metrics.sent = campaign.segment.estimatedSize;
        campaign.metrics.delivered = Math.floor(campaign.segment.estimatedSize * 0.98);
        campaign.metrics.failed = campaign.segment.estimatedSize - campaign.metrics.delivered;
        campaign.metrics.responses = Math.floor(campaign.metrics.delivered * 0.15);
        campaign.metrics.conversions = Math.floor(campaign.metrics.responses * 0.3);
      }, 5000);
    } else if (campaign.schedule.type === 'scheduled') {
      campaign.status = 'scheduled';
      
      // In a real implementation, this would schedule the campaign for future execution
      // For this demo, we'll just update the status
      const scheduledTime = new Date(campaign.schedule.datetime).getTime();
      const currentTime = new Date().getTime();
      const timeUntilExecution = scheduledTime - currentTime;
      
      if (timeUntilExecution <= 0) {
        // If scheduled time is in the past, execute immediately
        campaign.status = 'active';
        campaign.executionStartedAt = new Date().toISOString();
        
        setTimeout(() => {
          campaign.status = 'completed';
          campaign.executionCompletedAt = new Date().toISOString();
          campaign.metrics.sent = campaign.segment.estimatedSize;
          campaign.metrics.delivered = Math.floor(campaign.segment.estimatedSize * 0.98);
          campaign.metrics.failed = campaign.segment.estimatedSize - campaign.metrics.delivered;
          campaign.metrics.responses = Math.floor(campaign.metrics.delivered * 0.15);
          campaign.metrics.conversions = Math.floor(campaign.metrics.responses * 0.3);
        }, 5000);
      }
    } else if (campaign.schedule.type === 'recurring') {
      campaign.status = 'active';
      
      // In a real implementation, this would set up recurring execution
      // For this demo, we'll just update the status
    }
    
    campaign.updatedAt = new Date().toISOString();
    return campaign;
  }

  // Pause a campaign
  pauseCampaign(campaignId) {
    const campaign = this.getCampaignById(campaignId);
    if (!campaign) {
      throw new Error(`Campaign with ID ${campaignId} not found`);
    }
    
    if (campaign.status !== 'active' && campaign.status !== 'scheduled') {
      throw new Error(`Cannot pause campaign with status ${campaign.status}`);
    }
    
    campaign.status = 'paused';
    campaign.updatedAt = new Date().toISOString();
    return campaign;
  }

  // Resume a paused campaign
  resumeCampaign(campaignId) {
    const campaign = this.getCampaignById(campaignId);
    if (!campaign) {
      throw new Error(`Campaign with ID ${campaignId} not found`);
    }
    
    if (campaign.status !== 'paused') {
      throw new Error(`Cannot resume campaign with status ${campaign.status}`);
    }
    
    // Restore previous status
    if (campaign.schedule.type === 'immediate' || campaign.schedule.type === 'recurring') {
      campaign.status = 'active';
    } else if (campaign.schedule.type === 'scheduled') {
      campaign.status = 'scheduled';
    }
    
    campaign.updatedAt = new Date().toISOString();
    return campaign;
  }

  // Cancel a campaign
  cancelCampaign(campaignId) {
    const campaign = this.getCampaignById(campaignId);
    if (!campaign) {
      throw new Error(`Campaign with ID ${campaignId} not found`);
    }
    
    if (campaign.status === 'completed' || campaign.status === 'cancelled' || campaign.status === 'archived') {
      throw new Error(`Cannot cancel campaign with status ${campaign.status}`);
    }
    
    campaign.status = 'cancelled';
    campaign.updatedAt = new Date().toISOString();
    return campaign;
  }

  // Test a campaign with a small sample
  testCampaign(campaignId, testSize = 10) {
    const campaign = this.getCampaignById(campaignId);
    if (!campaign) {
      throw new Error(`Campaign with ID ${campaignId} not found`);
    }
    
    // In a real implementation, this would send actual test messages
    // For this demo, we'll return a mock result
    return {
      campaignId,
      testSize,
      sentAt: new Date().toISOString(),
      deliveryRate: 0.98,
      responseRate: 0.15,
      testRecipients: this.generateMockRecipients(testSize)
    };
  }

  // Get campaign performance metrics
  getCampaignMetrics(campaignId) {
    const campaign = this.getCampaignById(campaignId);
    if (!campaign) {
      throw new Error(`Campaign with ID ${campaignId} not found`);
    }
    
    // In a real implementation, this would calculate actual metrics
    // For this demo, we'll return the stored metrics with some additional calculated values
    const { sent, delivered, failed, responses, conversions } = campaign.metrics;
    
    return {
      ...campaign.metrics,
      deliveryRate: sent > 0 ? delivered / sent : 0,
      failureRate: sent > 0 ? failed / sent : 0,
      responseRate: delivered > 0 ? responses / delivered : 0,
      conversionRate: responses > 0 ? conversions / responses : 0,
      costPerMessage: 0.01, // Assuming ₦0.01 per message
      totalCost: sent * 0.01,
      roi: conversions * 10 - sent * 0.01 // Assuming ₦10 value per conversion
    };
  }

  // Validate a campaign before activation
  validateCampaign(campaign) {
    const errors = [];
    
    // Check required fields
    if (!campaign.name) {
      errors.push('Campaign name is required');
    }
    
    if (!campaign.segment || !campaign.segment.id) {
      errors.push('Target segment is required');
    }
    
    if (!campaign.template || !campaign.template.id) {
      errors.push('Notification template is required');
    }
    
    // Validate schedule
    if (!campaign.schedule || !campaign.schedule.type) {
      errors.push('Schedule type is required');
    } else {
      if (campaign.schedule.type === 'scheduled' && !campaign.schedule.datetime) {
        errors.push('Scheduled datetime is required for scheduled campaigns');
      }
      
      if (campaign.schedule.type === 'recurring') {
        if (!campaign.recurringPattern) {
          errors.push('Recurring pattern is required for recurring campaigns');
        }
        
        if (!campaign.recurringTime) {
          errors.push('Recurring time is required for recurring campaigns');
        }
        
        if (campaign.recurringPattern === 'weekly' && (!campaign.recurringDays || campaign.recurringDays.length === 0)) {
          errors.push('At least one day of the week must be selected for weekly recurring campaigns');
        }
        
        if (campaign.recurringPattern === 'monthly' && (!campaign.recurringDays || campaign.recurringDays.length === 0)) {
          errors.push('At least one day of the month must be selected for monthly recurring campaigns');
        }
      }
    }
    
    // Validate type-specific requirements
    if (campaign.type === 'triggered' && !campaign.triggerType) {
      errors.push('Trigger type is required for triggered campaigns');
    }
    
    if (campaign.type === 'multiStep' && (!campaign.steps || campaign.steps.length === 0)) {
      errors.push('At least one step is required for multi-step campaigns');
    }
    
    if (campaign.type === 'abTest' && (!c
(Content truncated due to size limit. Use line ranges to read in chunks)
