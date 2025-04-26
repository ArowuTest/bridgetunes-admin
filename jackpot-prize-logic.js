// Jackpot Prize Logic Implementation
// This file implements the draw eligibility rules, rollover mechanism, and winner validation

class JackpotPrizeLogic {
  constructor() {
    this.prizeStructure = {
      daily: [
        { type: 'cash', amount: 5000, count: 5, label: '₦5,000 Cash Prize' },
        { type: 'cash', amount: 10000, count: 3, label: '₦10,000 Cash Prize' },
        { type: 'cash', amount: 20000, count: 1, label: '₦20,000 Cash Prize' }
      ],
      weekly: [
        { type: 'cash', amount: 50000, count: 3, label: '₦50,000 Cash Prize' },
        { type: 'cash', amount: 100000, count: 1, label: '₦100,000 Cash Prize' }
      ],
      monthly: [
        { type: 'cash', amount: 500000, count: 1, label: '₦500,000 Cash Prize' }
      ],
      jackpot: [
        { type: 'jackpot', amount: 5000000, count: 1, label: '₦5,000,000 Jackpot Prize' }
      ]
    };
    
    this.eligibilityRules = {
      daily: {
        minTopup: 100, // Minimum topup amount for daily draw
        daysSinceTopup: 1, // Topup must be within 1 day
        optInRequired: true,
        blacklistExcluded: true,
        endDigitMapping: {
          0: 'Monday',
          1: 'Monday',
          2: 'Tuesday',
          3: 'Tuesday',
          4: 'Wednesday',
          5: 'Wednesday',
          6: 'Thursday',
          7: 'Thursday',
          8: 'Friday',
          9: 'Friday'
        }
      },
      weekly: {
        minTopup: 200, // Minimum topup amount for weekly draw
        daysSinceTopup: 7, // Topup must be within 7 days
        optInRequired: true,
        blacklistExcluded: true
      },
      monthly: {
        minTopup: 500, // Minimum topup amount for monthly draw
        daysSinceTopup: 30, // Topup must be within 30 days
        optInRequired: true,
        blacklistExcluded: true
      },
      jackpot: {
        minTopup: 1000, // Minimum topup amount for jackpot draw
        daysSinceTopup: 30, // Topup must be within 30 days
        optInRequired: true,
        blacklistExcluded: true,
        consecutiveWeeks: 4 // Must have eligible topups for 4 consecutive weeks
      }
    };
    
    this.rolloverRules = {
      daily: {
        rolloverEnabled: true,
        maxRolloverCount: 3, // Roll over up to 3 times
        rolloverDestination: 'weekly' // Roll over to weekly prize pool
      },
      weekly: {
        rolloverEnabled: true,
        maxRolloverCount: 2, // Roll over up to 2 times
        rolloverDestination: 'monthly' // Roll over to monthly prize pool
      },
      monthly: {
        rolloverEnabled: true,
        maxRolloverCount: 1, // Roll over up to 1 time
        rolloverDestination: 'jackpot' // Roll over to jackpot prize pool
      },
      jackpot: {
        rolloverEnabled: true,
        maxRolloverCount: 0, // No rollover for jackpot
        rolloverDestination: null
      }
    };
    
    this.drawSchedule = {
      daily: {
        frequency: 'daily',
        time: '19:00',
        daysOfWeek: [1, 2, 3, 4, 5], // Monday to Friday
        excludeHolidays: true
      },
      weekly: {
        frequency: 'weekly',
        dayOfWeek: 5, // Friday
        time: '20:00',
        excludeHolidays: false
      },
      monthly: {
        frequency: 'monthly',
        dayOfMonth: 'last', // Last day of month
        time: '20:00',
        excludeHolidays: false
      },
      jackpot: {
        frequency: 'custom',
        dates: [], // Custom dates for jackpot draws
        time: '20:00',
        excludeHolidays: false
      }
    };
    
    // Current prize pools with rollover tracking
    this.prizePools = {
      daily: {
        currentAmount: 0,
        baseAmount: 100000, // ₦100,000 base daily prize pool
        rolloverCount: 0,
        lastWinDate: null
      },
      weekly: {
        currentAmount: 0,
        baseAmount: 500000, // ₦500,000 base weekly prize pool
        rolloverCount: 0,
        lastWinDate: null
      },
      monthly: {
        currentAmount: 0,
        baseAmount: 2000000, // ₦2,000,000 base monthly prize pool
        rolloverCount: 0,
        lastWinDate: null
      },
      jackpot: {
        currentAmount: 0,
        baseAmount: 5000000, // ₦5,000,000 base jackpot prize pool
        rolloverCount: 0,
        lastWinDate: null
      }
    };
    
    // Initialize prize pools
    this.initializePrizePools();
  }
  
  // Initialize prize pools with base amounts
  initializePrizePools() {
    Object.keys(this.prizePools).forEach(poolType => {
      this.prizePools[poolType].currentAmount = this.prizePools[poolType].baseAmount;
    });
  }
  
  // Check if a user is eligible for a specific draw type
  checkEligibility(user, drawType) {
    if (!user || !drawType || !this.eligibilityRules[drawType]) {
      return { eligible: false, reason: 'Invalid user or draw type' };
    }
    
    const rules = this.eligibilityRules[drawType];
    
    // Check if user has opted in
    if (rules.optInRequired && !user.optedIn) {
      return { eligible: false, reason: 'User has not opted in' };
    }
    
    // Check if user is blacklisted
    if (rules.blacklistExcluded && user.blacklisted) {
      return { eligible: false, reason: 'User is blacklisted' };
    }
    
    // Check if user has made a qualifying topup
    const qualifyingTopup = this.findQualifyingTopup(user.topups, rules.minTopup, rules.daysSinceTopup);
    if (!qualifyingTopup) {
      return { eligible: false, reason: `No qualifying topup of ₦${rules.minTopup} or more within the last ${rules.daysSinceTopup} days` };
    }
    
    // For daily draws, check if the MSISDN's last digit matches the day's allocation
    if (drawType === 'daily') {
      const lastDigit = parseInt(user.msisdn.slice(-1));
      const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
      
      if (rules.endDigitMapping[lastDigit] !== today) {
        return { 
          eligible: false, 
          reason: `MSISDN ending in ${lastDigit} is eligible for ${rules.endDigitMapping[lastDigit]} draws, not ${today}` 
        };
      }
    }
    
    // For jackpot draws, check consecutive weeks requirement
    if (drawType === 'jackpot' && rules.consecutiveWeeks > 0) {
      const hasConsecutiveTopups = this.checkConsecutiveWeeklyTopups(user.topups, rules.minTopup, rules.consecutiveWeeks);
      if (!hasConsecutiveTopups) {
        return { 
          eligible: false, 
          reason: `User does not have qualifying topups for ${rules.consecutiveWeeks} consecutive weeks` 
        };
      }
    }
    
    return { 
      eligible: true, 
      qualifyingTopup 
    };
  }
  
  // Find a qualifying topup based on amount and recency
  findQualifyingTopup(topups, minAmount, maxDaysSince) {
    if (!topups || !Array.isArray(topups) || topups.length === 0) {
      return null;
    }
    
    const now = new Date();
    const cutoffDate = new Date(now);
    cutoffDate.setDate(cutoffDate.getDate() - maxDaysSince);
    
    // Sort topups by date descending (most recent first)
    const sortedTopups = [...topups].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Find the first topup that meets the criteria
    return sortedTopups.find(topup => {
      const topupDate = new Date(topup.date);
      return topup.amount >= minAmount && topupDate >= cutoffDate;
    });
  }
  
  // Check if user has qualifying topups for consecutive weeks
  checkConsecutiveWeeklyTopups(topups, minAmount, consecutiveWeeks) {
    if (!topups || !Array.isArray(topups) || topups.length === 0) {
      return false;
    }
    
    const now = new Date();
    const weeks = [];
    
    // Initialize array to track each of the past N weeks
    for (let i = 0; i < consecutiveWeeks; i++) {
      const weekStart = new Date(now);
      weekStart.setDate(weekStart.getDate() - (7 * i + 7)); // Start from last complete week
      
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      
      weeks.push({
        start: weekStart,
        end: weekEnd,
        hasQualifyingTopup: false
      });
    }
    
    // Check each topup against each week
    topups.forEach(topup => {
      const topupDate = new Date(topup.date);
      
      weeks.forEach(week => {
        if (topupDate >= week.start && topupDate <= week.end && topup.amount >= minAmount) {
          week.hasQualifyingTopup = true;
        }
      });
    });
    
    // Check if all weeks have qualifying topups
    return weeks.every(week => week.hasQualifyingTopup);
  }
  
  // Conduct a draw for a specific draw type
  conductDraw(drawType, eligibleUsers) {
    if (!drawType || !this.prizeStructure[drawType]) {
      throw new Error(`Invalid draw type: ${drawType}`);
    }
    
    if (!eligibleUsers || !Array.isArray(eligibleUsers) || eligibleUsers.length === 0) {
      return this.handleNoEligibleUsers(drawType);
    }
    
    const prizes = this.prizeStructure[drawType];
    const results = {
      drawType,
      drawDate: new Date().toISOString(),
      prizePool: this.prizePools[drawType].currentAmount,
      winners: [],
      rollovers: []
    };
    
    // Shuffle eligible users to ensure randomness
    const shuffledUsers = this.shuffleArray([...eligibleUsers]);
    
    // Assign prizes to winners
    prizes.forEach(prize => {
      for (let i = 0; i < prize.count; i++) {
        if (shuffledUsers.length > 0) {
          const winner = shuffledUsers.shift(); // Take the next user from the shuffled array
          
          results.winners.push({
            msisdn: winner.msisdn,
            prize: {
              type: prize.type,
              amount: prize.amount,
              label: prize.label
            },
            qualifyingTopup: winner.qualifyingTopup
          });
          
          // If this is a jackpot prize, reset the jackpot pool
          if (prize.type === 'jackpot') {
            this.prizePools.jackpot.lastWinDate = new Date().toISOString();
            this.prizePools.jackpot.currentAmount = this.prizePools.jackpot.baseAmount;
            this.prizePools.jackpot.rolloverCount = 0;
          }
        } else {
          // Not enough eligible users for all prizes, handle rollover
          const rollover = this.handlePrizeRollover(drawType, prize);
          if (rollover) {
            results.rollovers.push(rollover);
          }
        }
      }
    });
    
    return results;
  }
  
  // Handle case when there are no eligible users for a draw
  handleNoEligibleUsers(drawType) {
    const results = {
      drawType,
      drawDate: new Date().toISOString(),
      prizePool: this.prizePools[drawType].currentAmount,
      winners: [],
      rollovers: []
    };
    
    // Roll over all prizes
    this.prizeStructure[drawType].forEach(prize => {
      for (let i = 0; i < prize.count; i++) {
        const rollover = this.handlePrizeRollover(drawType, prize);
        if (rollover) {
          results.rollovers.push(rollover);
        }
      }
    });
    
    return results;
  }
  
  // Handle prize rollover logic
  handlePrizeRollover(drawType, prize) {
    const rolloverRules = this.rolloverRules[drawType];
    
    if (!rolloverRules.rolloverEnabled || rolloverRules.maxRolloverCount <= 0) {
      return null; // Rollover not enabled for this draw type
    }
    
    const prizePool = this.prizePools[drawType];
    
    if (prizePool.rolloverCount >= rolloverRules.maxRolloverCount) {
      // Maximum rollover count reached, donate to charity instead
      return {
        from: drawType,
        to: 'charity',
        amount: prize.amount,
        reason: `Maximum rollover count (${rolloverRules.maxRolloverCount}) reached`
      };
    }
    
    const destinationPool = rolloverRules.rolloverDestination;
    
    if (!destinationPool || !this.prizePools[destinationPool]) {
      return null; // No valid destination for rollover
    }
    
    // Add prize amount to destination pool
    this.prizePools[destinationPool].currentAmount += prize.amount;
    
    // Increment rollover count
    prizePool.rolloverCount++;
    
    return {
      from: drawType,
      to: destinationPool,
      amount: prize.amount,
      reason: 'No eligible winner'
    };
  }
  
  // Validate a winner after selection
  validateWinner(winner, drawType) {
    if (!winner || !drawType) {
      return { valid: false, reason: 'Invalid winner or draw type' };
    }
    
    // Check if MSISDN is valid
    if (!winner.msisdn || !/^234\d{10}$/.test(winner.msisdn)) {
      return { valid: false, reason: 'Invalid MSISDN format' };
    }
    
    // Check if user is blacklisted (double-check even though we filtered earlier)
    if (winner.blacklisted) {
      return { valid: false, reason: 'User is blacklisted' };
    }
    
    // Check if user has opted in (double-check even though we filtered earlier)
    if (!winner.optedIn) {
      return { valid: false, reason: 'User has not opted in' };
    }
    
    // Check if user has already won in this draw cycle (daily/weekly/monthly)
    if (winner.recentWins && winner.recentWins.some(win => 
      win.drawType === drawType && 
      new Date(win.date) >= this.getDrawCycleStartDate(drawType)
    )) {
      return { valid: false, reason: `User has already won a ${drawType} prize in this cycle` };
    }
    
    // For jackpot winners, perform additional verification
    if (drawType === 'jackpot') {
      // Check KYC verification status
      if (!winner.kycVerified) {
        return { 
          valid: false, 
          reason: 'Jackpot winner must complete KYC verification',
          action: 'initiateKYC'
        };
      }
      
      // Check account age
      const accountAgeInDays = this.calculateAccountAge(winner.registrationDate);
      if (accountAgeInDays < 30) { // Require at least 30 days account age for jackpot
        return { 
          valid: false, 
          reason: 'Account must be at least 30 days old to win jackpot',
          accountAge: accountAgeInDays
        };
      }
    }
    
    return { valid: true };
  }
  
  // Get the start date of the current draw cycle
  getDrawCycleStartDate(drawType) {
    const now = new Date();
    let cycleStart = new Date(now);
    
    switch (drawType) {
      case 'daily':
        cycleStart.setHours(0, 0, 0, 0); // Start of today
        break;
      case 'weekly':
        // Start of current week (assuming week starts on Monday)
        const day = cycleStart.getDay();
        const diff = cycleStart.getDate() - day + (day === 0 ? -6 : 1);
        cycleStart.setDate(diff);
        cycleStart.setHours(0, 0, 0, 0);
        break;
      case 'monthly':
        // Start of current month
        cycleStart.setDate(1);
        cycleStart.setHours(0, 0, 0, 0);
        break;
      case 'jackpot':
        // Jackpot is a special case, use a 90-day lookback period
        cycleStart.setDate(cycleStart.getDate() - 90);
        cycleStart.setHours(0, 0, 0, 0);
        break;
      default:
        cycleStart.setHours(0, 0, 0, 0); // Default to start of today
    }
    
    return cycleStart;
  }
  
  // Calculate account age in days
  calculateAccountAge(registrationDate) {
    if (!registrationDate) return 0;
    
    const regDate = new Date(registrationDate);
    const now = new Date();
    const diffTime = Math.abs(now - regDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  }
  
  // Process prize claim
  processPrizeClaim(winner, drawType) {
    if (!winner || !drawType) {
      return { success: false, reason: 'Invalid winner or draw type' };
    }
    
    const validation = this.validateWinner(winner, drawType);
    if (!validation.valid) {
      return { success: false, reason: validation.reason, details: validation };
    }
    
    // Generate claim reference
    const claimReference = this.generateClaimReference(winner.msisdn, drawType);
    
    // Determine claim method based on prize amount
    const prizeAmount = winner.prize.amount;
    let claimMet
(Content truncated due to size limit. Use line ranges to read in chunks)
