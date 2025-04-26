// Campaign Templates for Notification Management System
// This file provides pre-configured campaign templates for different scenarios

class CampaignTemplates {
  constructor(campaignsModule, userSegmentsModule, notificationTemplatesModule) {
    this.campaignsModule = campaignsModule;
    this.userSegmentsModule = userSegmentsModule;
    this.notificationTemplatesModule = notificationTemplatesModule;
    this.templates = [];
    this.initializeTemplates();
  }

  // Initialize all campaign templates
  initializeTemplates() {
    this.templates = [
      this.createWelcomeTemplate(),
      this.createJackpotUpdateTemplate(),
      this.createDrawReminderTemplate(),
      this.createWinnerNotificationTemplate(),
      this.createReengagementTemplate(),
      this.createTopupConfirmationTemplate(),
      this.createOptInConfirmationTemplate(),
      this.createMultiStepOnboardingTemplate(),
      this.createABTestMarketingTemplate(),
      this.createSpecialPromotionTemplate()
    ];
  }

  // Get all campaign templates
  getAllTemplates() {
    return this.templates;
  }

  // Get a specific template by ID
  getTemplateById(templateId) {
    return this.templates.find(t => t.id === templateId);
  }

  // Get templates by category
  getTemplatesByCategory(category) {
    return this.templates.filter(t => t.category === category);
  }

  // Create a campaign from a template
  createCampaignFromTemplate(templateId, name, segmentId, templateId, options = {}) {
    const template = this.getTemplateById(templateId);
    if (!template) {
      throw new Error(`Template with ID ${templateId} not found`);
    }
    
    // Create campaign using the template configuration
    return this.campaignsModule.createCampaign(
      name || template.name,
      template.description,
      segmentId || template.defaultSegmentId,
      templateId || template.defaultTemplateId,
      template.type,
      template.schedule,
      { ...template.options, ...options }
    );
  }

  // Welcome Campaign Template
  createWelcomeTemplate() {
    return {
      id: 'template_welcome',
      name: 'Welcome Campaign',
      description: 'Welcome new users to the MyNumba Don Win promotion',
      category: 'onboarding',
      type: 'oneTime',
      schedule: { type: 'immediate' },
      defaultSegmentId: 'segment_new_users',
      defaultTemplateId: 'template_welcome_message',
      options: {},
      configuration: {
        content: 'Welcome to MTN MyNumba Don Win! You are now eligible to win amazing prizes with every topup. Stay tuned for our weekly draws!',
        bestPractices: [
          'Send immediately after opt-in',
          'Keep message concise and clear',
          'Include key program benefits',
          'Mention next steps or expectations'
        ],
        exampleVariations: [
          'Welcome to MTN MyNumba Don Win! You\'re now in the running to win big prizes with every topup. Our next draw is on Friday!',
          'Congratulations! You\'ve joined MTN MyNumba Don Win. Topup now to increase your chances of winning in our next draw!'
        ]
      }
    };
  }

  // Jackpot Update Template
  createJackpotUpdateTemplate() {
    return {
      id: 'template_jackpot_update',
      name: 'Jackpot Update Campaign',
      description: 'Send regular updates about the current jackpot amount',
      category: 'marketing',
      type: 'recurring',
      schedule: { type: 'recurring' },
      defaultSegmentId: 'segment_all_users',
      defaultTemplateId: 'template_jackpot_update',
      options: {
        recurringPattern: 'weekly',
        recurringDays: [1], // Monday
        recurringTime: '09:00'
      },
      configuration: {
        content: 'MTN MyNumba Don Win Jackpot update: This week\'s jackpot is now ₦{{draw.jackpotAmount}}! Topup now to qualify for Friday\'s draw.',
        bestPractices: [
          'Send at the beginning of the week',
          'Include current jackpot amount',
          'Create urgency with a clear call to action',
          'Mention draw date'
        ],
        exampleVariations: [
          'JACKPOT ALERT! This week\'s MTN MyNumba Don Win prize pool has reached ₦{{draw.jackpotAmount}}! Don\'t miss your chance to win big this Friday.',
          'The MTN MyNumba Don Win jackpot is now at ₦{{draw.jackpotAmount}}! Topup today to secure your spot in Friday\'s draw.'
        ]
      }
    };
  }

  // Draw Reminder Template
  createDrawReminderTemplate() {
    return {
      id: 'template_draw_reminder',
      name: 'Draw Reminder Campaign',
      description: 'Send reminders about upcoming draws',
      category: 'marketing',
      type: 'recurring',
      schedule: { type: 'recurring' },
      defaultSegmentId: 'segment_eligible_users',
      defaultTemplateId: 'template_draw_reminder',
      options: {
        recurringPattern: 'weekly',
        recurringDays: [5], // Friday
        recurringTime: '10:00'
      },
      configuration: {
        content: 'REMINDER: The MTN MyNumba Don Win draw is happening TODAY at 7PM! Make sure you\'ve topped up to qualify. Good luck!',
        bestPractices: [
          'Send on the morning of the draw day',
          'Create urgency with countdown language',
          'Include qualification requirements',
          'Add a personal touch with well-wishes'
        ],
        exampleVariations: [
          'Don\'t forget! MTN MyNumba Don Win draw is just hours away at 7PM today. Last chance to topup and qualify!',
          'TODAY\'S THE DAY! The MTN MyNumba Don Win draw happens at 7PM. Are you in? Topup now if you haven\'t already!'
        ]
      }
    };
  }

  // Winner Notification Template
  createWinnerNotificationTemplate() {
    return {
      id: 'template_winner_notification',
      name: 'Winner Notification Campaign',
      description: 'Automatically notify winners after each draw',
      category: 'transactional',
      type: 'triggered',
      schedule: { type: 'immediate' },
      defaultSegmentId: 'segment_all_users',
      defaultTemplateId: 'template_winner_notification',
      options: {
        triggerType: 'winnerSelection'
      },
      configuration: {
        content: 'CONGRATULATIONS! Your number {{user.msisdn}} has won ₦{{prize.amount}} in the MTN MyNumba Don Win draw! {{prize.claimInstructions}}',
        bestPractices: [
          'Send immediately after draw completion',
          'Clearly state the winning amount',
          'Include the winning phone number for confirmation',
          'Provide clear instructions for prize claiming',
          'Add a time limit or expiration date if applicable'
        ],
        exampleVariations: [
          'WINNER ALERT! You\'ve won ₦{{prize.amount}} in today\'s MTN MyNumba Don Win draw! To claim your prize, {{prize.claimInstructions}}',
          'Great news! Your number {{user.msisdn}} is a WINNER in today\'s draw. You\'ve won ₦{{prize.amount}}! {{prize.claimInstructions}}'
        ]
      }
    };
  }

  // Reengagement Template
  createReengagementTemplate() {
    return {
      id: 'template_reengagement',
      name: 'Reengagement Campaign',
      description: 'Re-engage inactive users with special promotions',
      category: 'marketing',
      type: 'oneTime',
      schedule: { type: 'scheduled' },
      defaultSegmentId: 'segment_inactive_users',
      defaultTemplateId: 'template_reengagement',
      options: {},
      configuration: {
        content: 'We miss you! It\'s been a while since you participated in MTN MyNumba Don Win. Topup now and get DOUBLE chances to win in this week\'s draw!',
        bestPractices: [
          'Target users inactive for at least 30 days',
          'Offer a special incentive for returning',
          'Create a sense of being missed or valued',
          'Include a strong, clear call to action',
          'Consider scheduling for payday periods'
        ],
        exampleVariations: [
          'SPECIAL OFFER just for you! We noticed you haven\'t participated in MTN MyNumba Don Win lately. Topup this week for 2X chances to win!',
          'COMEBACK BONUS: We\'ve reserved DOUBLE entry chances for you in this week\'s MTN MyNumba Don Win draw. Topup now to activate!'
        ]
      }
    };
  }

  // Topup Confirmation Template
  createTopupConfirmationTemplate() {
    return {
      id: 'template_topup_confirmation',
      name: 'Topup Confirmation Campaign',
      description: 'Send confirmation messages after each topup',
      category: 'transactional',
      type: 'triggered',
      schedule: { type: 'immediate' },
      defaultSegmentId: 'segment_all_users',
      defaultTemplateId: 'template_topup_confirmation',
      options: {
        triggerType: 'topup',
        triggerConditions: {
          minAmount: 100 // Minimum topup amount to trigger notification
        }
      },
      configuration: {
        content: 'Thank you for your ₦{{transaction.amount}} topup! You\'ve earned {{transaction.points}} points and are now eligible for the next MTN MyNumba Don Win draw on {{draw.date}}.',
        bestPractices: [
          'Send immediately after successful topup',
          'Confirm the topup amount',
          'Mention points earned if applicable',
          'Reinforce draw eligibility',
          'Include next draw date'
        ],
        exampleVariations: [
          'Topup successful! Your ₦{{transaction.amount}} topup has qualified you for the MTN MyNumba Don Win draw on {{draw.date}}. Good luck!',
          'Your account has been credited with ₦{{transaction.amount}}. You\'re now in the running to win big in our {{draw.date}} draw!'
        ]
      }
    };
  }

  // Opt-in Confirmation Template
  createOptInConfirmationTemplate() {
    return {
      id: 'template_optin_confirmation',
      name: 'Opt-in Confirmation Campaign',
      description: 'Confirm user opt-in to the promotion',
      category: 'transactional',
      type: 'triggered',
      schedule: { type: 'immediate' },
      defaultSegmentId: 'segment_all_users',
      defaultTemplateId: 'template_optin_confirmation',
      options: {
        triggerType: 'optIn'
      },
      configuration: {
        content: 'You\'ve successfully opted in to MTN MyNumba Don Win! Topup now to qualify for our next draw on {{draw.date}}. Reply HELP for assistance or STOP to opt out.',
        bestPractices: [
          'Send immediately after opt-in',
          'Confirm successful enrollment',
          'Provide clear next steps',
          'Include opt-out instructions',
          'Mention support options'
        ],
        exampleVariations: [
          'Welcome to MTN MyNumba Don Win! You\'re now enrolled in our weekly draws. Topup to qualify for our next draw on {{draw.date}}. Text STOP to opt out.',
          'You\'re in! Your number is now registered for MTN MyNumba Don Win. Make a topup to qualify for Friday\'s draw. Need help? Reply HELP.'
        ]
      }
    };
  }

  // Multi-step Onboarding Template
  createMultiStepOnboardingTemplate() {
    return {
      id: 'template_multistep_onboarding',
      name: 'Multi-step Onboarding Campaign',
      description: 'Guide new users through the onboarding process with a series of messages',
      category: 'onboarding',
      type: 'multiStep',
      schedule: { type: 'triggered' },
      defaultSegmentId: 'segment_new_users',
      defaultTemplateId: 'template_welcome_message',
      options: {
        triggerType: 'optIn',
        steps: [
          { 
            templateId: 'template_welcome_message', 
            name: 'Welcome Message', 
            delay: 0, // Send immediately
            condition: null
          },
          { 
            templateId: 'template_jackpot_info', 
            name: 'Jackpot Information', 
            delay: 24, // Send after 24 hours
            condition: null
          },
          { 
            templateId: 'template_topup_reminder', 
            name: 'Topup Reminder', 
            delay: 72, // Send after 72 hours
            condition: { type: 'noTopup', duration: 72 } // Only if no topup in 72 hours
          }
        ]
      },
      configuration: {
        content: {
          step1: 'Welcome to MTN MyNumba Don Win! You\'re now eligible to win amazing prizes with every topup. Stay tuned for our weekly draws!',
          step2: 'Did you know? MTN MyNumba Don Win has a current jackpot of ₦{{draw.jackpotAmount}}! Topup now to qualify for our next draw.',
          step3: 'Don\'t miss out! You haven\'t topped up yet to qualify for the MTN MyNumba Don Win draw. Topup now to get your chance to win!'
        },
        bestPractices: [
          'Space messages appropriately (24-72 hours apart)',
          'Each message should have a distinct purpose',
          'Gradually introduce program features',
          'Include conditional logic based on user actions',
          'End with a strong call to action'
        ]
      }
    };
  }

  // A/B Test Marketing Template
  createABTestMarketingTemplate() {
    return {
      id: 'template_abtest_marketing',
      name: 'A/B Test Marketing Campaign',
      description: 'Test different marketing messages to find the most effective one',
      category: 'marketing',
      type: 'abTest',
      schedule: { type: 'scheduled' },
      defaultSegmentId: 'segment_high_value',
      defaultTemplateId: 'template_marketing_a',
      options: {
        variants: [
          { templateId: 'template_marketing_a', name: 'Variant A - Jackpot Focus', weight: 50 },
          { templateId: 'template_marketing_b', name: 'Variant B - Urgency Focus', weight: 50 }
        ],
        testDuration: 7,
        winnerCriteria: 'response'
      },
      configuration: {
        content: {
          variantA: 'JACKPOT ALERT! This week\'s MTN MyNumba Don Win prize pool has reached ₦{{draw.jackpotAmount}}! Topup now to qualify.',
          variantB: 'LAST CHANCE! Only 24 hours left to qualify for this week\'s MTN MyNumba Don Win draw. Don\'t miss your chance to win big!'
        },
        bestPractices: [
          'Test only one variable at a time (e.g., subject line, call to action, etc.)',
          'Ensure sample sizes are large enough for statistical significance',
          'Define clear success metrics before starting',
          'Plan follow-up campaigns using the winning variant',
          'Document learnings for future campaigns'
        ]
      }
    };
  }

  // Special Promotion Template
  createSpecialPromotionTemplate() {
    return {
      id: 'template_special_promotion',
      name: 'Special Promotion Campaign',
      description: 'Promote special limited-time offers',
      category: 'marketing',
      type: 'oneTime',
      schedule: { type: 'scheduled' },
      defaultSegmentId: 'segment_all_users',
      defaultTemplateId: 'template_special_promotion',
      options: {},
      configuration: {
        content: 'SPECIAL OFFER: Topup with ₦500 or more before midnight tonight and get 3X chances to win in tomorrow\'s MTN MyNumba Don Win draw! Don\'t miss out!',
        bestPractices: [
          'Create a sense of urgency with time limits',
          'Clearly state the special offer or bonus',
          'Use attention-grabbing language',
          'Specify exact requirements to qualify',
          'Schedule for optimal engagement times (evenings, weekends)'
        ],
        exampleVariations: [
          '24-HOUR FLASH PROMO: Get TRIPLE chances to win in tomorrow\'s draw when you topup ₦500+. Offer ends midnight tonight!',
          'WEEKEND SPECIAL: Topup ₦500 or more by Sunday night for 3X entries in Monday\'s MTN MyNumba Don Win draw!'
        ]
      }
    };
  }
}

// Export the module
module.exports = CampaignTemplates;
