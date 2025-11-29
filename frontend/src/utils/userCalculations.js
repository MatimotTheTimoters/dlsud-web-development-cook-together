export const calculateMaxRewards = (userData) => {
  const {
    level = 1,
    recipesCreated = 0,
    recipesCooked = 0,
    successfulCooks = 0,
    failedCooks = 0,
    loginStreak = 0,
    challengesCompleted = 0
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
  const creationBonus = 1 + (recipesCreated * 0.03);
  const cookingBonus = 1 + (recipesCooked * 0.015);
  const challengeBonus = 1 + (challengesCompleted * 0.05);
  const successBonus = 0.7 + (successRate * 0.6);
  const streakBonus = 1 + (loginStreak * 0.01);
  
  // Final calculation with caps
  const maxExp = Math.min(
    Math.floor(levelExp * creationBonus * successBonus * streakBonus),
    2000
  );
  
  const maxGold = Math.min(
    Math.floor(levelGold * cookingBonus * challengeBonus * successBonus * streakBonus),
    1000
  );
  
  const maxGem = Math.min(
    Math.floor(levelGem * Math.min(creationBonus, cookingBonus) * challengeBonus * successBonus * streakBonus),
    100
  );
  
  return {
    maxExp,
    maxGold, 
    maxGem,
    successRate: Math.round(successRate * 100)
  };
};

export const calculateMaxPrices = (userData) => {
  const {
    level = 1,
    recipesCreated = 0,
    recipesSold = 0,
    totalRevenue = 0,
    premiumSubscriber = false
  } = userData;

  // Base price limits
  const BASE_GOLD_PRICE = 100;
  const BASE_GEM_PRICE = 10;
  
  // Level scaling
  const levelGoldPrice = BASE_GOLD_PRICE + (level * 20);
  const levelGemPrice = BASE_GEM_PRICE + (level * 2);
  
  // Creator reputation bonuses
  const creationReputation = 1 + (recipesCreated * 0.02);
  const salesReputation = 1 + (recipesSold * 0.05);
  const revenueBonus = 1 + (Math.log10(totalRevenue + 1) * 0.1);
  
  // Premium subscriber gets higher limits
  const premiumBonus = premiumSubscriber ? 1.5 : 1;
  
  // Final calculation with caps
  const maxGoldPrice = Math.min(
    Math.floor(levelGoldPrice * creationReputation * salesReputation * revenueBonus * premiumBonus),
    5000
  );
  
  const maxGemPrice = Math.min(
    Math.floor(levelGemPrice * creationReputation * salesReputation * revenueBonus * premiumBonus),
    500
  );
  
  return {
    maxGoldPrice,
    maxGemPrice,
    creatorTier: getCreatorTier(recipesCreated, recipesSold)
  };
};

export const calculateAllUserLimits = (userData) => {
  const rewards = calculateMaxRewards(userData);
  const prices = calculateMaxPrices(userData);
  
  return {
    ...rewards,
    ...prices,
    overallCreatorScore: calculateCreatorScore(userData)
  };
};

export const calculateLevelUpRequirements = (currentLevel, currentEXP) => {
  const baseRequirement = 100;
  const levelMultiplier = 1.5;
  
  const expNeeded = Math.floor(baseRequirement * Math.pow(levelMultiplier, currentLevel - 1));
  const expProgress = currentEXP;
  const progressPercentage = Math.min(Math.floor((expProgress / expNeeded) * 100), 100);
  
  return {
    currentLevel,
    nextLevel: currentLevel + 1,
    expNeeded,
    expProgress,
    progressPercentage,
    expRemaining: expNeeded - expProgress
  };
};

export const calculateCookingRewards = (recipeRewards, userData, success = true) => {
  const { expReward = 0, goldReward = 0, gemReward = 0 } = recipeRewards;
  const { level = 1, loginStreak = 0 } = userData;
  
  // Base multipliers
  const levelBonus = 1 + (level * 0.02);
  const streakBonus = 1 + (loginStreak * 0.005);
  const successMultiplier = success ? 1 : 0.3;
  
  const finalExp = Math.floor(expReward * levelBonus * streakBonus * successMultiplier);
  const finalGold = Math.floor(goldReward * levelBonus * streakBonus * successMultiplier);
  const finalGem = Math.floor(gemReward * levelBonus * streakBonus * successMultiplier);
  
  return {
    exp: finalExp,
    gold: finalGold,
    gem: finalGem,
    success,
    bonuses: {
      levelBonus: Math.round((levelBonus - 1) * 100),
      streakBonus: Math.round((streakBonus - 1) * 100)
    }
  };
};

const getCreatorTier = (recipesCreated, recipesSold) => {
  const totalImpact = recipesCreated + (recipesSold * 2);
  
  if (totalImpact >= 100) return 'Master Chef';
  if (totalImpact >= 50) return 'Expert Chef';
  if (totalImpact >= 20) return 'Advanced Cook';
  if (totalImpact >= 5) return 'Developing Cook';
  return 'Novice Cook';
};

const calculateCreatorScore = (userData) => {
  const {
    level = 1,
    recipesCreated = 0,
    recipesSold = 0,
    successfulCooks = 0,
    challengesCompleted = 0,
    loginStreak = 0
  } = userData;
  
  const score = 
    (level * 10) +
    (recipesCreated * 5) +
    (recipesSold * 8) +
    (successfulCooks * 2) +
    (challengesCompleted * 15) +
    (loginStreak * 1);
  
  return Math.floor(score);
};