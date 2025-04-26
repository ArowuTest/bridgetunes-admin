// Notification Templates Module for Notification Management System
// This file implements the Templates functionality for creating reusable message templates

class NotificationTemplatesModule {
  constructor() {
    this.templates = [];
    this.templateTypes = [
      { id: 'sms', label: 'SMS', maxLength: 160, multipart: true },
      { id: 'email', label: 'Email', supportHtml: true },
      { id: 'inApp', label: 'In-App Notification', supportMedia: true }
    ];
    this.templateCategories = [
      { id: 'transactional', label: 'Transactional' },
      { id: 'marketing', label: 'Marketing' },
      { id: 'service', label: 'Service' }
    ];
    this.personalizationTokens = {
      user: [
        { id: 'user.msisdn', label: 'Phone Number', example: '2348012345678' },
        { id: 'user.firstName', label: 'First Name', example: 'John' },
        { id: 'user.lastName', label: 'Last Name', example: 'Doe' },
        { id: 'user.optInDate', label: 'Opt-in Date', example: '2025-01-15' }
      ],
      transaction: [
        { id: 'transaction.amount', label: 'Topup Amount', example: '1000' },
        { id: 'transaction.points', label: 'Points Earned', example: '50' },
        { id: 'transaction.date', label: 'Transaction Date', example: '2025-04-25' },
        { id: 'transaction.channel', label: 'Transaction Channel', example: 'USSD' }
      ],
      draw: [
        { id: 'draw.date', label: 'Draw Date', example: '2025-04-30' },
        { id: 'draw.time', label: 'Draw Time', example: '15:00' },
        { id: 'draw.eligibility', label: 'Eligibility Status', example: 'Eligible' },
        { id: 'draw.jackpotAmount', label: 'Jackpot Amount', example: '5000000' }
      ],
      prize: [
        { id: 'prize.amount', label: 'Prize Amount', example: '10000' },
        { id: 'prize.type', label: 'Prize Type', example: 'Cash' },
        { id: 'prize.claimInstructions', label: 'Claim Instructions', example: 'Visit nearest MTN office' },
        { id: 'prize.expiryDate', label: 'Expiry Date', example: '2025-05-30' }
      ],
      custom: [
        { id: 'custom.field1', label: 'Custom Field 1', example: 'Value 1' },
        { id: 'custom.field2', label: 'Custom Field 2', example: 'Value 2' }
      ]
    };
  }

  // Create a new template
  createTemplate(name, description, type, category, content, metadata = {}) {
    const templateId = this.generateUniqueId();
    const newTemplate = {
      id: templateId,
      name,
      description,
      type,
      category,
      content,
      metadata,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: 1,
      isActive: true,
      tokens: this.extractTokensFromContent(content)
    };

    // Validate template
    const validation = this.validateTemplate(newTemplate);
    if (!validation.isValid) {
      throw new Error(`Template validation failed: ${validation.errors.join(', ')}`);
    }

    this.templates.push(newTemplate);
    return newTemplate;
  }

  // Update an existing template
  updateTemplate(templateId, updates) {
    const templateIndex = this.templates.findIndex(t => t.id === templateId);
    if (templateIndex === -1) {
      throw new Error(`Template with ID ${templateId} not found`);
    }

    // Create a new version of the template
    const currentTemplate = this.templates[templateIndex];
    const updatedTemplate = {
      ...currentTemplate,
      ...updates,
      version: currentTemplate.version + 1,
      updatedAt: new Date().toISOString()
    };

    // Re-extract tokens if content changed
    if (updates.content) {
      updatedTemplate.tokens = this.extractTokensFromContent(updates.content);
    }

    // Validate template
    const validation = this.validateTemplate(updatedTemplate);
    if (!validation.isValid) {
      throw new Error(`Template validation failed: ${validation.errors.join(', ')}`);
    }

    this.templates[templateIndex] = updatedTemplate;
    return updatedTemplate;
  }

  // Clone an existing template
  cloneTemplate(templateId, newName) {
    const sourceTemplate = this.templates.find(t => t.id === templateId);
    if (!sourceTemplate) {
      throw new Error(`Template with ID ${templateId} not found`);
    }

    return this.createTemplate(
      newName || `Copy of ${sourceTemplate.name}`,
      sourceTemplate.description,
      sourceTemplate.type,
      sourceTemplate.category,
      sourceTemplate.content,
      JSON.parse(JSON.stringify(sourceTemplate.metadata))
    );
  }

  // Archive a template (soft delete)
  archiveTemplate(templateId) {
    const templateIndex = this.templates.findIndex(t => t.id === templateId);
    if (templateIndex === -1) {
      throw new Error(`Template with ID ${templateId} not found`);
    }

    this.templates[templateIndex].isActive = false;
    this.templates[templateIndex].updatedAt = new Date().toISOString();
    return this.templates[templateIndex];
  }

  // Get all templates
  getAllTemplates(includeArchived = false) {
    if (includeArchived) {
      return this.templates;
    }
    return this.templates.filter(t => t.isActive);
  }

  // Get templates by category
  getTemplatesByCategory(category, includeArchived = false) {
    return this.getAllTemplates(includeArchived).filter(t => t.category === category);
  }

  // Get templates by type
  getTemplatesByType(type, includeArchived = false) {
    return this.getAllTemplates(includeArchived).filter(t => t.type === type);
  }

  // Get a specific template by ID
  getTemplateById(templateId) {
    return this.templates.find(t => t.id === templateId);
  }

  // Get template version history
  getTemplateVersionHistory(templateId) {
    // In a real implementation, this would fetch from a version history table
    // For this demo, we'll return a mock history
    const template = this.getTemplateById(templateId);
    if (!template) {
      throw new Error(`Template with ID ${templateId} not found`);
    }

    const history = [];
    for (let i = 1; i <= template.version; i++) {
      history.push({
        version: i,
        timestamp: new Date(Date.now() - (template.version - i) * 86400000).toISOString(),
        changedBy: 'admin@bridgetunes.com'
      });
    }
    return history;
  }

  // Preview a template with sample data
  previewTemplate(templateId, customData = {}) {
    const template = this.getTemplateById(templateId);
    if (!template) {
      throw new Error(`Template with ID ${templateId} not found`);
    }

    // Merge default sample data with custom data
    const sampleData = this.getSampleData();
    const mergedData = this.mergeObjects(sampleData, customData);

    // Replace tokens in content
    return this.renderTemplate(template.content, mergedData);
  }

  // Test a template by sending to test recipients
  testTemplate(templateId, recipients, customData = {}) {
    const template = this.getTemplateById(templateId);
    if (!template) {
      throw new Error(`Template with ID ${templateId} not found`);
    }

    // In a real implementation, this would send actual test messages
    // For this demo, we'll return a mock result
    return {
      templateId,
      recipients,
      sentAt: new Date().toISOString(),
      deliveryRate: 0.98,
      content: this.previewTemplate(templateId, customData)
    };
  }

  // Validate a template against gateway requirements
  validateTemplate(template) {
    const errors = [];

    // Check if template type is valid
    const validType = this.templateTypes.find(t => t.id === template.type);
    if (!validType) {
      errors.push(`Invalid template type: ${template.type}`);
    }

    // Check if template category is valid
    const validCategory = this.templateCategories.find(c => c.id === template.category);
    if (!validCategory) {
      errors.push(`Invalid template category: ${template.category}`);
    }

    // Check content length for SMS
    if (template.type === 'sms') {
      const contentLength = template.content.length;
      if (contentLength > 160) {
        // Not an error, but add metadata about multipart SMS
        template.metadata.isMultipart = true;
        template.metadata.partCount = Math.ceil(contentLength / 153);
      }
    }

    // Check for invalid tokens
    const allValidTokens = this.getAllValidTokens();
    const invalidTokens = template.tokens.filter(token => !allValidTokens.includes(token));
    if (invalidTokens.length > 0) {
      errors.push(`Invalid tokens: ${invalidTokens.join(', ')}`);
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Extract personalization tokens from content
  extractTokensFromContent(content) {
    const tokenRegex = /\{\{([^}]+)\}\}/g;
    const matches = content.match(tokenRegex) || [];
    return matches.map(match => match.slice(2, -2).trim());
  }

  // Get all valid personalization tokens
  getAllValidTokens() {
    return Object.values(this.personalizationTokens)
      .flat()
      .map(token => token.id);
  }

  // Get sample data for template preview
  getSampleData() {
    return {
      user: {
        msisdn: '2348012345678',
        firstName: 'John',
        lastName: 'Doe',
        optInDate: '2025-01-15'
      },
      transaction: {
        amount: '1000',
        points: '50',
        date: '2025-04-25',
        channel: 'USSD'
      },
      draw: {
        date: '2025-04-30',
        time: '15:00',
        eligibility: 'Eligible',
        jackpotAmount: '5000000'
      },
      prize: {
        amount: '10000',
        type: 'Cash',
        claimInstructions: 'Visit nearest MTN office',
        expiryDate: '2025-05-30'
      },
      custom: {
        field1: 'Value 1',
        field2: 'Value 2'
      }
    };
  }

  // Render a template by replacing tokens with values
  renderTemplate(content, data) {
    let rendered = content;
    const tokens = this.extractTokensFromContent(content);

    tokens.forEach(token => {
      const value = this.getValueFromPath(data, token);
      rendered = rendered.replace(new RegExp(`\\{\\{${token}\\}\\}`, 'g'), value !== undefined ? value : '');
    });

    return rendered;
  }

  // Get a value from a nested object using a dot-notation path
  getValueFromPath(obj, path) {
    return path.split('.').reduce((prev, curr) => {
      return prev ? prev[curr] : undefined;
    }, obj);
  }

  // Helper method to generate a unique ID
  generateUniqueId() {
    return 'tmpl_' + Math.random().toString(36).substr(2, 9);
  }

  // Helper method to merge objects deeply
  mergeObjects(obj1, obj2) {
    const result = { ...obj1 };
    
    for (const key in obj2) {
      if (obj2.hasOwnProperty(key)) {
        if (typeof obj2[key] === 'object' && !Array.isArray(obj2[key]) && obj1[key]) {
          result[key] = this.mergeObjects(obj1[key], obj2[key]);
        } else {
          result[key] = obj2[key];
        }
      }
    }
    
    return result;
  }

  // Create predefined templates for common scenarios
  createPredefinedTemplates() {
    // Transactional templates
    this.createTemplate(
      'Opt-in Confirmation',
      'Sent when a user opts in to the promotion',
      'sms',
      'transactional',
      'Thank you for opting in to MTN MyNumba Don Win promotion! You are now eligible to win exciting prizes with every topup. Reply STOP to opt out at any time.'
    );

    this.createTemplate(
      'Opt-out Confirmation',
      'Sent when a user opts out of the promotion',
      'sms',
      'transactional',
      'You have successfully opted out of MTN MyNumba Don Win promotion. We hope to see you again soon!'
    );

    this.createTemplate(
      'Topup Confirmation',
      'Sent when a user completes a topup',
      'sms',
      'transactional',
      'Thank you for your topup of N{{transaction.amount}}! You have earned {{transaction.points}} points and are now eligible for the next draw on {{draw.date}} at {{draw.time}}.'
    );

    this.createTemplate(
      'Draw Eligibility',
      'Sent to notify users of their eligibility for upcoming draws',
      'sms',
      'transactional',
      'Good news! Your number {{user.msisdn}} is eligible for the upcoming draw on {{draw.date}} at {{draw.time}}. Current jackpot is N{{draw.jackpotAmount}}!'
    );

    this.createTemplate(
      'Winner Notification',
      'Sent to winners after a draw',
      'sms',
      'transactional',
      'Congratulations! Your number {{user.msisdn}} has won N{{prize.amount}} in the MTN MyNumba Don Win promotion! {{prize.claimInstructions}}. Claim by {{prize.expiryDate}}.'
    );

    // Marketing templates
    this.createTemplate(
      'Jackpot Update',
      'Sent to inform users about the current jackpot amount',
      'sms',
      'marketing',
      'MTN MyNumba Don Win jackpot is now N{{draw.jackpotAmount}}! Topup today to be eligible for the draw on {{draw.date}} at {{draw.time}}.'
    );

    this.createTemplate(
      'Reminder Message',
      'Sent to remind users to topup before a draw',
      'sms',
      'marketing',
      'Don\'t miss out! Topup your MTN line today to be eligible for tomorrow\'s draw with a jackpot of N{{draw.jackpotAmount}}!'
    );

    this.createTemplate(
      'Re-engagement Message',
      'Sent to inactive users to encourage participation',
      'sms',
      'marketing',
      'We miss you! It\'s been {{user.daysSinceLastTopup}} days since your last topup. Topup today and get a chance to win in our N{{draw.jackpotAmount}} jackpot draw!'
    );

    // Service templates
    this.createTemplate(
      'Service Update',
      'Sent to inform users about service changes',
      'sms',
      'service',
      'MTN MyNumba Don Win: We\'ve updated our service! Now with bigger prizes and more chances to win. Topup today to participate!'
    );

    this.createTemplate(
      'Help Message',
      'Sent in response to help requests',
      'sms',
      'service',
      'MTN MyNumba Don Win: For assistance, please call our customer service at 180. For more information, visit mtn.com/mynumbadontwin'
    );

    return this.templates;
  }
}

// Export the module
module.exports = NotificationTemplatesModule;
