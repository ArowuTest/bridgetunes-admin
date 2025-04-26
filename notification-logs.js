// Notification Logs Module for Notification Management System
// This file implements the Logs functionality for tracking notification delivery and performance

class NotificationLogsModule {
  constructor() {
    this.logs = [];
    this.statusTypes = [
      { id: 'sent', label: 'Sent', description: 'Notification has been sent to the gateway' },
      { id: 'delivered', label: 'Delivered', description: 'Notification has been delivered to the recipient' },
      { id: 'failed', label: 'Failed', description: 'Notification failed to deliver' },
      { id: 'pending', label: 'Pending', description: 'Notification is queued for delivery' },
      { id: 'rejected', label: 'Rejected', description: 'Notification was rejected by the gateway' }
    ];
    this.failureReasons = [
      { id: 'invalidNumber', label: 'Invalid Number', description: 'The recipient number is invalid' },
      { id: 'networkError', label: 'Network Error', description: 'Network error during delivery' },
      { id: 'gatewayError', label: 'Gateway Error', description: 'Error from the SMS gateway' },
      { id: 'blacklisted', label: 'Blacklisted', description: 'Recipient is blacklisted' },
      { id: 'optedOut', label: 'Opted Out', description: 'Recipient has opted out of notifications' },
      { id: 'quotaExceeded', label: 'Quota Exceeded', description: 'Sending quota has been exceeded' }
    ];
    this.responseTypes = [
      { id: 'none', label: 'None', description: 'No response received' },
      { id: 'reply', label: 'Reply', description: 'Recipient replied to the notification' },
      { id: 'click', label: 'Click', description: 'Recipient clicked a link in the notification' },
      { id: 'conversion', label: 'Conversion', description: 'Recipient completed a conversion action' }
    ];
  }

  // Log a new notification
  logNotification(campaignId, templateId, msisdn, content, metadata = {}) {
    const logId = this.generateUniqueId();
    const newLog = {
      id: logId,
      campaignId,
      templateId,
      msisdn,
      content,
      metadata,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      sentAt: null,
      deliveredAt: null,
      failedAt: null,
      failureReason: null,
      responseType: 'none',
      responseAt: null,
      responseContent: null
    };
    
    this.logs.push(newLog);
    return newLog;
  }

  // Update a log entry with sent status
  updateSentStatus(logId, gatewayResponse = {}) {
    const logIndex = this.logs.findIndex(l => l.id === logId);
    if (logIndex === -1) {
      throw new Error(`Log with ID ${logId} not found`);
    }
    
    this.logs[logIndex].status = 'sent';
    this.logs[logIndex].sentAt = new Date().toISOString();
    this.logs[logIndex].updatedAt = new Date().toISOString();
    this.logs[logIndex].gatewayMessageId = gatewayResponse.messageId || null;
    this.logs[logIndex].gatewaySentResponse = gatewayResponse;
    
    return this.logs[logIndex];
  }

  // Update a log entry with delivered status
  updateDeliveredStatus(logId, deliveryReceipt = {}) {
    const logIndex = this.logs.findIndex(l => l.id === logId);
    if (logIndex === -1) {
      throw new Error(`Log with ID ${logId} not found`);
    }
    
    this.logs[logIndex].status = 'delivered';
    this.logs[logIndex].deliveredAt = new Date().toISOString();
    this.logs[logIndex].updatedAt = new Date().toISOString();
    this.logs[logIndex].deliveryReceipt = deliveryReceipt;
    
    return this.logs[logIndex];
  }

  // Update a log entry with failed status
  updateFailedStatus(logId, failureReason, errorDetails = {}) {
    const logIndex = this.logs.findIndex(l => l.id === logId);
    if (logIndex === -1) {
      throw new Error(`Log with ID ${logId} not found`);
    }
    
    this.logs[logIndex].status = 'failed';
    this.logs[logIndex].failedAt = new Date().toISOString();
    this.logs[logIndex].updatedAt = new Date().toISOString();
    this.logs[logIndex].failureReason = failureReason;
    this.logs[logIndex].errorDetails = errorDetails;
    
    return this.logs[logIndex];
  }

  // Update a log entry with response information
  updateResponseStatus(logId, responseType, responseContent = null) {
    const logIndex = this.logs.findIndex(l => l.id === logId);
    if (logIndex === -1) {
      throw new Error(`Log with ID ${logId} not found`);
    }
    
    this.logs[logIndex].responseType = responseType;
    this.logs[logIndex].responseAt = new Date().toISOString();
    this.logs[logIndex].responseContent = responseContent;
    this.logs[logIndex].updatedAt = new Date().toISOString();
    
    return this.logs[logIndex];
  }

  // Get all logs
  getAllLogs(limit = 1000, offset = 0) {
    return this.logs.slice(offset, offset + limit);
  }

  // Get logs by campaign ID
  getLogsByCampaign(campaignId, limit = 1000, offset = 0) {
    return this.logs
      .filter(l => l.campaignId === campaignId)
      .slice(offset, offset + limit);
  }

  // Get logs by MSISDN
  getLogsByMsisdn(msisdn, limit = 1000, offset = 0) {
    return this.logs
      .filter(l => l.msisdn === msisdn)
      .slice(offset, offset + limit);
  }

  // Get logs by status
  getLogsByStatus(status, limit = 1000, offset = 0) {
    return this.logs
      .filter(l => l.status === status)
      .slice(offset, offset + limit);
  }

  // Get logs by date range
  getLogsByDateRange(startDate, endDate, limit = 1000, offset = 0) {
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    
    return this.logs
      .filter(l => {
        const createdTime = new Date(l.createdAt).getTime();
        return createdTime >= start && createdTime <= end;
      })
      .slice(offset, offset + limit);
  }

  // Get a specific log by ID
  getLogById(logId) {
    return this.logs.find(l => l.id === logId);
  }

  // Get campaign performance metrics
  getCampaignMetrics(campaignId) {
    const campaignLogs = this.getLogsByCampaign(campaignId);
    
    const total = campaignLogs.length;
    const delivered = campaignLogs.filter(l => l.status === 'delivered').length;
    const failed = campaignLogs.filter(l => l.status === 'failed').length;
    const pending = campaignLogs.filter(l => l.status === 'pending').length;
    const responses = campaignLogs.filter(l => l.responseType !== 'none').length;
    const conversions = campaignLogs.filter(l => l.responseType === 'conversion').length;
    
    return {
      total,
      delivered,
      failed,
      pending,
      responses,
      conversions,
      deliveryRate: total > 0 ? delivered / total : 0,
      failureRate: total > 0 ? failed / total : 0,
      responseRate: delivered > 0 ? responses / delivered : 0,
      conversionRate: responses > 0 ? conversions / responses : 0
    };
  }

  // Get daily metrics for a date range
  getDailyMetrics(startDate, endDate, campaignId = null) {
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    
    const startTime = start.getTime();
    const endTime = end.getTime();
    
    // Filter logs by date range and campaign if specified
    let filteredLogs = this.logs.filter(l => {
      const createdTime = new Date(l.createdAt).getTime();
      return createdTime >= startTime && createdTime <= endTime;
    });
    
    if (campaignId) {
      filteredLogs = filteredLogs.filter(l => l.campaignId === campaignId);
    }
    
    // Group logs by day
    const dailyMetrics = {};
    
    filteredLogs.forEach(log => {
      const date = new Date(log.createdAt);
      date.setHours(0, 0, 0, 0);
      const dateStr = date.toISOString().split('T')[0];
      
      if (!dailyMetrics[dateStr]) {
        dailyMetrics[dateStr] = {
          date: dateStr,
          total: 0,
          delivered: 0,
          failed: 0,
          responses: 0,
          conversions: 0
        };
      }
      
      dailyMetrics[dateStr].total++;
      
      if (log.status === 'delivered') {
        dailyMetrics[dateStr].delivered++;
      }
      
      if (log.status === 'failed') {
        dailyMetrics[dateStr].failed++;
      }
      
      if (log.responseType !== 'none') {
        dailyMetrics[dateStr].responses++;
      }
      
      if (log.responseType === 'conversion') {
        dailyMetrics[dateStr].conversions++;
      }
    });
    
    // Convert to array and sort by date
    return Object.values(dailyMetrics).sort((a, b) => a.date.localeCompare(b.date));
  }

  // Get failure reasons breakdown
  getFailureReasons(campaignId = null) {
    let failedLogs = this.logs.filter(l => l.status === 'failed');
    
    if (campaignId) {
      failedLogs = failedLogs.filter(l => l.campaignId === campaignId);
    }
    
    const reasonCounts = {};
    
    failedLogs.forEach(log => {
      const reason = log.failureReason || 'unknown';
      reasonCounts[reason] = (reasonCounts[reason] || 0) + 1;
    });
    
    return Object.entries(reasonCounts).map(([reason, count]) => ({
      reason,
      count,
      percentage: failedLogs.length > 0 ? count / failedLogs.length : 0
    }));
  }

  // Get response types breakdown
  getResponseTypes(campaignId = null) {
    let responseLogs = this.logs.filter(l => l.responseType !== 'none');
    
    if (campaignId) {
      responseLogs = responseLogs.filter(l => l.campaignId === campaignId);
    }
    
    const typeCounts = {};
    
    responseLogs.forEach(log => {
      const type = log.responseType;
      typeCounts[type] = (typeCounts[type] || 0) + 1;
    });
    
    return Object.entries(typeCounts).map(([type, count]) => ({
      type,
      count,
      percentage: responseLogs.length > 0 ? count / responseLogs.length : 0
    }));
  }

  // Export logs to CSV format
  exportLogsToCSV(logs = null) {
    const dataToExport = logs || this.logs;
    
    if (dataToExport.length === 0) {
      return 'No logs to export';
    }
    
    // Define CSV headers
    const headers = [
      'ID',
      'Campaign ID',
      'Template ID',
      'MSISDN',
      'Status',
      'Created At',
      'Sent At',
      'Delivered At',
      'Failed At',
      'Failure Reason',
      'Response Type',
      'Response At'
    ];
    
    // Create CSV content
    const csvContent = [
      headers.join(','),
      ...dataToExport.map(log => [
        log.id,
        log.campaignId,
        log.templateId,
        log.msisdn,
        log.status,
        log.createdAt,
        log.sentAt || '',
        log.deliveredAt || '',
        log.failedAt || '',
        log.failureReason || '',
        log.responseType,
        log.responseAt || ''
      ].join(','))
    ].join('\n');
    
    return csvContent;
  }

  // Generate sample logs for testing
  generateSampleLogs(count = 1000, campaignIds = [], templateIds = []) {
    // Clear existing logs
    this.logs = [];
    
    // Generate random logs
    for (let i = 0; i < count; i++) {
      const campaignId = campaignIds.length > 0 
        ? campaignIds[Math.floor(Math.random() * campaignIds.length)]
        : `camp_${Math.random().toString(36).substr(2, 9)}`;
        
      const templateId = templateIds.length > 0
        ? templateIds[Math.floor(Math.random() * templateIds.length)]
        : `tmpl_${Math.random().toString(36).substr(2, 9)}`;
        
      const msisdn = `234${Math.floor(Math.random() * 10000000000)}`;
      const content = `Sample notification content #${i + 1}`;
      
      // Create log with random dates within the last 30 days
      const createdAt = new Date(Date.now() - Math.floor(Math.random() * 30) * 86400000);
      
      const log = this.logNotification(campaignId, templateId, msisdn, content);
      log.createdAt = createdAt.toISOString();
      
      // Randomly set status
      const statusRandom = Math.random();
      if (statusRandom < 0.85) {
        // 85% delivered
        this.updateSentStatus(log.id, { messageId: `msg_${Math.random().toString(36).substr(2, 9)}` });
        log.sentAt = new Date(createdAt.getTime() + Math.floor(Math.random() * 60000)).toISOString();
        
        this.updateDeliveredStatus(log.id, { deliveryTime: new Date().toISOString() });
        log.deliveredAt = new Date(new Date(log.sentAt).getTime() + Math.floor(Math.random() * 300000)).toISOString();
        
        // Randomly set response
        const responseRandom = Math.random();
        if (responseRandom < 0.15) {
          // 15% of delivered get a response
          const responseTypes = ['reply', 'click', 'conversion'];
          const responseType = responseTypes[Math.floor(Math.random() * responseTypes.length)];
          
          this.updateResponseStatus(log.id, responseType, responseType === 'reply' ? 'Sample response text' : null);
          log.responseAt = new Date(new Date(log.deliveredAt).getTime() + Math.floor(Math.random() * 3600000)).toISOString();
        }
      } else if (statusRandom < 0.95) {
        // 10% failed
        this.updateSentStatus(log.id, { messageId: `msg_${Math.random().toString(36).substr(2, 9)}` });
        log.sentAt = new Date(createdAt.getTime() + Math.floor(Math.random() * 60000)).toISOString();
        
        const failureReasons = ['invalidNumber', 'networkError', 'gatewayError', 'blacklisted', 'optedOut', 'quotaExceeded'];
        const failureReason = failureReasons[Math.floor(Math.random() * failureReasons.length)];
        
        this.updateFailedStatus(log.id, failureReason, { errorCode: `ERR${Math.floor(Math.random() * 1000)}` });
        log.failedAt = new Date(new Date(log.sentAt).getTime() + Math.floor(Math.random() * 60000)).toISOString();
      }
      // The remaining 5% stay as pending
    }
    
    return this.logs;
  }

  // Helper method to generate a unique ID
  generateUniqueId() {
    return 'log_' + Math.random().toString(36).substr(2, 9);
  }
}

// Export the module
module.exports = NotificationLogsModule;
