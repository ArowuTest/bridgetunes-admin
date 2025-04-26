// Jackpot Prize Logic Implementation for Bridgetunes MTN Promotion
// This module handles the draw eligibility rules, prize structure, rollover mechanism, and winner validation

class JackpotPrizeLogic {
  constructor() {
    // Initialize prize structure with correct values
    this.prizeStructure = {
      daily: [
        { type: 'cash', amount: 1000000, count: 1, label: '₦1,000,000 Jackpot (1st Prize)' },
        { type: 'cash', amount: 350000, count: 1, label: '₦350,000 2nd Prize' },
        { type: 'cash', amount: 150000, count: 1, label: '₦150,000 3rd Prize' },
        { type: 'cash', amount: 75000, count: 7, label: '₦75,000 Concession Prize' }
      ],
      saturday: [
        { type: 'cash', amount: 3000000, count: 1, label: '₦3,000,000 Jackpot (1st Prize)' },
        { type: 'cash', amount: 1000000, count: 1, label: '₦1,000,000 2nd Prize' },
        { type: 'cash', amount: 500000, count: 1, label: '₦500,000 3rd Prize' },
        { type: 'cash', amount: 100000, count: 7, label: '₦100,000 Concession Prize' }
      ]
    };
    
    // Initialize rollover amounts
    this.rolloverAmounts = {
      daily: 0,
      saturday: 0
    };
    
    // Initialize draw history
    this.drawHistory = [];
    
    // Initialize MSISDN digit mapping for days
    this.digitMapping = {
      monday: ['0', '1'],
      tuesday: ['2', '3'],
      wednesday: ['4', '5'],
      thursday: ['6', '7'],
      friday: ['8', '9'],
      saturday: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'] // All digits eligible on Saturday
    };
    
    // Initialize KYC requirements based on prize amount
    this.kycRequirements = [
      { threshold: 50000, requirements: ['phone_verification'] },
      { threshold: 500000, requirements: ['phone_verification', 'id_verification'] },
      { threshold: 1000000, requirements: ['phone_verification', 'id_verification', 'bank_verification'] }
    ];
  }
  
  // Check if a user is eligible for a specific draw type
  checkEligibility(user, drawType) {
    // Check if user has opted in
    if (!user.optedIn) {
      return {
        eligible: false,
        reason: 'User has not opted in to the promotion'
      };
    }
    
    // Check if user is blacklisted
    if (user.blacklisted) {
      return {
        eligible: false,
        reason: 'User is blacklisted'
      };
    }
    
    // Check if user has qualifying topups
    if (!user.topups || user.topups.length === 0) {
      return {
        eligible: false,
        reason: 'No topups found for user'
      };
    }
    
    // Check if user has topups within the qualifying period
    const now = new Date();
    const qualifyingPeriod = this.getQualifyingPeriod(drawType);
    const qualifyingTopups = user.topups.filter(topup => {
      const topupDate = new Date(topup.date);
      return (now - topupDate) <= qualifyingPeriod;
    });
    
    if (qualifyingTopups.length === 0) {
      return {
        eligible: false,
        reason: 'No qualifying topups within the required period'
      };
    }
    
    // Check if user's MSISDN ends with the correct digits for the day
    const today = this.getDayOfWeek();
    const lastDigit = user.msisdn.slice(-1);
    
    if (drawType === 'daily') {
      const eligibleDigits = this.digitMapping[today.toLowerCase()];
      if (!eligibleDigits.includes(lastDigit)) {
        return {
          eligible: false,
          reason: `MSISDN ending in ${lastDigit} is not eligible for ${today}'s draw`
        };
      }
    }
    
    // If all checks pass, user is eligible
    return {
      eligible: true,
      qualifyingTopup: qualifyingTopups[0] // Return the first qualifying topup
    };
  }
  
  // Get the qualifying period for a specific draw type
  getQualifyingPeriod(drawType) {
    switch (drawType) {
      case 'daily':
        return 24 * 60 * 60 * 1000; // 24 hours in milliseconds
      case 'saturday':
        return 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
      default:
        return 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds
    }
  }
  
  // Get the current day of the week
  getDayOfWeek() {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const now = new Date();
    return days[now.getDay()];
  }
  
  // Conduct a draw for a specific draw type
  conductDraw(drawType, eligibleUsers) {
    if (!eligibleUsers || eligibleUsers.length === 0) {
      return {
        success: false,
        message: 'No eligible users for the draw'
      };
    }
    
    // Get the prize structure for the draw type
    const prizes = this.getPrizes(drawType);
    if (!prizes) {
      return {
        success: false,
        message: `Invalid draw type: ${drawType}`
      };
    }
    
    // Shuffle the eligible users to randomize the draw
    const shuffledUsers = this.shuffleArray([...eligibleUsers]);
    
    // Select winners based on prize count
    const winners = [];
    let userIndex = 0;
    
    for (const prize of prizes) {
      for (let i = 0; i < prize.count; i++) {
        if (userIndex < shuffledUsers.length) {
          const winner = shuffledUsers[userIndex];
          winners.push({
            user: winner,
            prize: prize,
            drawType: drawType,
            drawDate: new Date(),
            validated: false
          });
          userIndex++;
        }
      }
    }
    
    // Check if we have enough winners
    if (winners.length === 0) {
      return {
        success: false,
        message: 'Not enough eligible users for the draw'
      };
    }
    
    // Add the draw to history
    this.drawHistory.push({
      drawType: drawType,
      drawDate: new Date(),
      winners: winners
    });
    
    return {
      success: true,
      winners: winners
    };
  }
  
  // Get the prizes for a specific draw type
  getPrizes(drawType) {
    // Check if it's Saturday
    const today = this.getDayOfWeek();
    if (today === 'Saturday') {
      return this.prizeStructure.saturday;
    } else if (['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].includes(today)) {
      return this.prizeStructure.daily;
    } else {
      // No draws on Sunday
      return null;
    }
  }
  
  // Shuffle an array using Fisher-Yates algorithm
  shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
  
  // Validate a winner based on KYC requirements
  validateWinner(winner, drawType) {
    // Check if winner is valid
    if (!winner || !winner.user) {
      return {
        valid: false,
        reason: 'Invalid winner data'
      };
    }
    
    // Check if winner has opted in
    if (!winner.user.optedIn) {
      return {
        valid: false,
        reason: 'Winner has not opted in to the promotion'
      };
    }
    
    // Check if winner is blacklisted
    if (winner.user.blacklisted) {
      return {
        valid: false,
        reason: 'Winner is blacklisted'
      };
    }
    
    // Determine KYC requirements based on prize amount
    const prizeAmount = winner.prize.amount;
    const requiredKyc = this.getKycRequirements(prizeAmount);
    
    // Check if winner meets KYC requirements
    const missingKyc = requiredKyc.filter(req => !winner.user.kyc || !winner.user.kyc.includes(req));
    
    if (missingKyc.length > 0) {
      return {
        valid: true,
        pendingKyc: missingKyc,
        message: 'Winner needs to complete KYC requirements before prize can be awarded'
      };
    }
    
    // If all checks pass, winner is valid
    return {
      valid: true,
      message: 'Winner is valid and can receive prize'
    };
  }
  
  // Get KYC requirements based on prize amount
  getKycRequirements(prizeAmount) {
    let requirements = [];
    
    for (const kyc of this.kycRequirements) {
      if (prizeAmount >= kyc.threshold) {
        requirements = kyc.requirements;
      }
    }
    
    return requirements;
  }
  
  // Handle rollover for unclaimed prizes
  handleRollover(drawType, unclaimedPrizes) {
    if (!unclaimedPrizes || unclaimedPrizes.length === 0) {
      return {
        success: false,
        message: 'No unclaimed prizes to rollover'
      };
    }
    
    // Calculate total unclaimed amount
    let totalUnclaimed = 0;
    for (const prize of unclaimedPrizes) {
      totalUnclaimed += prize.amount;
    }
    
    // Add to rollover amount
    if (drawType === 'daily') {
      this.rolloverAmounts.daily += totalUnclaimed;
    } else if (drawType === 'saturday') {
      this.rolloverAmounts.saturday += totalUnclaimed;
    }
    
    return {
      success: true,
      rolloverAmount: totalUnclaimed,
      totalRollover: drawType === 'daily' ? this.rolloverAmounts.daily : this.rolloverAmounts.saturday
    };
  }
  
  // Get the current rollover amount for a specific draw type
  getRolloverAmount(drawType) {
    if (drawType === 'daily') {
      return this.rolloverAmounts.daily;
    } else if (drawType === 'saturday') {
      return this.rolloverAmounts.saturday;
    } else {
      return 0;
    }
  }
  
  // Get the draw history
  getDrawHistory() {
    return this.drawHistory;
  }
  
  // Get the total prize pool for a specific draw type
  getTotalPrizePool(drawType) {
    const prizes = this.getPrizes(drawType);
    if (!prizes) {
      return 0;
    }
    
    let total = 0;
    for (const prize of prizes) {
      total += prize.amount * prize.count;
    }
    
    // Add rollover amount
    total += this.getRolloverAmount(drawType);
    
    return total;
  }
  
  // Get the prize breakdown for display
  getPrizeBreakdown(drawType) {
    const prizes = this.getPrizes(drawType);
    if (!prizes) {
      return [];
    }
    
    return prizes.map(prize => {
      return {
        label: prize.label,
        amount: prize.amount,
        count: prize.count,
        total: prize.amount * prize.count
      };
    });
  }
}

// Export the JackpotPrizeLogic class
if (typeof module !== 'undefined' && module.exports) {
  module.exports = JackpotPrizeLogic;
}

// Initialize the JackpotPrizeLogic if in browser environment
if (typeof window !== 'undefined') {
  window.jackpotPrizeLogic = new JackpotPrizeLogic();
}

