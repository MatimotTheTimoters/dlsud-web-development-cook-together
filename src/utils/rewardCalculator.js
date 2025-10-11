// src/utils/rewardCalculator.js
export const calculateMaxRewards = (userData) => {
  const {
    level = 1,
    recipesCreated = 0,
    recipesCooked = 0,
    successfulCooks = 0,
    failedCooks = 0,
    loginStreak = 0
  } = userData;

  // Base values
  const BASE_EXP = 100;
  const BASE_GOLD = 50;
  const BASE_GEM = 5;
  
  // Level scaling
  const levelExp = BASE_EXP + (level * 15);
  const levelGold = BASE_GOLD + (level * 8);
  const levelGem = BASE_GEM + (level * 1);
  
  // Calculate success rate (avoid division by zero)
  const totalAttempts = successfulCooks + failedCooks;
  const successRate = totalAttempts > 0 ? successfulCooks / totalAttempts : 0.5;
  
  // Engagement bonuses
  const creationBonus = 1 + (recipesCreated * 0.03); // +3% per recipe created
  const cookingBonus = 1 + (recipesCooked * 0.015);  // +1.5% per recipe cooked
  const successBonus = 0.7 + (successRate * 0.6);    // 0.7x to 1.3x based on success
  const streakBonus = 1 + (loginStreak * 0.01);      // +1% per login streak day
  
  // Final calculation with caps
  const maxExp = Math.min(
    Math.floor(levelExp * creationBonus * successBonus * streakBonus),
    2000
  );
  
  const maxGold = Math.min(
    Math.floor(levelGold * cookingBonus * successBonus * streakBonus),
    1000
  );
  
  const maxGem = Math.min(
    Math.floor(levelGem * Math.min(creationBonus, cookingBonus) * successBonus * streakBonus),
    100
  );
  
  return {
    maxExp,
    maxGold, 
    maxGem,
    successRate: Math.round(successRate * 100) // percentage for display
  };
};

// Helper to update user's max rewards in SheetDB
export const updateUserRewardLimits = async (userId, apiLinks) => {
  try {
    // Fetch current user data
    const userRes = await fetch(`${apiLinks.users}?id=${userId}`);
    const userData = await userRes.json();
    
    if (userData.length > 0) {
      const user = userData[0];
      const newLimits = calculateMaxRewards(user);
      
      // Update user with new calculated limits
      const updateRes = await fetch(apiLinks.users, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: {
            id: userId,
            maxExpReward: newLimits.maxExp,
            maxGoldReward: newLimits.maxGold,
            maxGemReward: newLimits.maxGem
          }
        })
      });
      
      return await updateRes.json();
    }
  } catch (error) {
    console.error('Failed to update user reward limits:', error);
  }
};