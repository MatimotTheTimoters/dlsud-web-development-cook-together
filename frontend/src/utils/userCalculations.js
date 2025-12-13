/**
 * User calculations utility - MUST MATCH backend/classes/UserCalculations.php
 * Ensures consistent calculations between frontend and backend
 */

/**
 * Calculate maximum rewards a user can give for recipes
 * Based on user level and stats
 * MUST MATCH backend calculateMaxRewards()
 * 
 * @param {Object} userData User data including level and stats
 * @returns {Object} Maximum reward values
 */
export const calculateMaxRewards = (userData) => {
  const level = userData?.level || 1;
  const recipes_created = userData?.recipes_created || 0;
  const recipes_cooked = userData?.recipes_cooked || 0;

  const base_exp = 100;
  const base_gold = 50;
  const base_gems = 5;

  const level_multiplier = 1 + ((level - 1) * 0.1);

  const total_recipes = recipes_created + recipes_cooked;
  const activity_bonus = 1 + Math.min((total_recipes / 100), 1.0);

  let max_exp_reward = Math.round(base_exp * level_multiplier * activity_bonus);
  let max_gold_reward = Math.round(base_gold * level_multiplier * activity_bonus);
  let max_gem_reward = Math.round(base_gems * (level_multiplier * 0.5) * activity_bonus);

  max_exp_reward = Math.max(50, Math.min(max_exp_reward, 500));
  max_gold_reward = Math.max(25, Math.min(max_gold_reward, 250));
  max_gem_reward = Math.max(1, Math.min(max_gem_reward, 25));

  return {
    max_exp_reward: parseInt(max_exp_reward),
    max_gold_reward: parseInt(max_gold_reward),
    max_gem_reward: parseInt(max_gem_reward)
  };
};

/**
 * Calculate maximum prices a user can set for recipes
 * Based on user level and sales history
 * MUST MATCH backend calculateMaxPrices()
 * 
 * @param {Object} userData User data including level and stats
 * @returns {Object} Maximum price values
 */
export const calculateMaxPrices = (userData) => {
  const level = userData?.level || 1;
  const recipes_sold = userData?.recipes_sold || 0;

  const base_gold_price = 100;
  const base_gem_price = 10;

  const level_multiplier = 1 + ((level - 1) * 0.15);

  const sales_bonus = 1 + Math.min((recipes_sold / 50), 2.0);

  let max_gold_price = Math.round(base_gold_price * level_multiplier * sales_bonus);
  let max_gem_price = Math.round(base_gem_price * (level_multiplier * 0.8) * sales_bonus);

  max_gold_price = Math.max(50, Math.min(max_gold_price, 1000));
  max_gem_price = Math.max(5, Math.min(max_gem_price, 100));

  return {
    max_gold_price: parseInt(max_gold_price),
    max_gem_price: parseInt(max_gem_price)
  };
};

/**
 * Calculate all user limits (rewards and prices)
 * MUST MATCH backend calculateAllUserLimits()
 * 
 * @param {Object} userData User data including level and stats
 * @returns {Object} All limit values
 */
export const calculateAllUserLimits = (userData) => {
  const max_rewards = calculateMaxRewards(userData);
  const max_prices = calculateMaxPrices(userData);

  return {
    ...max_rewards,
    ...max_prices,
    last_limit_update: new Date().toISOString().slice(0, 19).replace('T', ' ')
  };
};

/**
 * Calculate level up requirements
 * MUST MATCH backend calculateLevelUpRequirements()
 * 
 * @param {number} current_level Current user level
 * @param {number} current_exp Current experience points
 * @returns {Object} Level up requirements and progress
 */
export const calculateLevelUpRequirements = (current_level, current_exp) => {
  const current_level_exp = calculateExpForLevel(current_level);
  const next_level_exp = calculateExpForLevel(current_level + 1);

  const exp_for_current_level = current_exp - current_level_exp;
  const exp_needed_for_next = next_level_exp - current_level_exp;
  const progress_percentage = exp_needed_for_next > 0
    ? Math.min(100, parseFloat(((exp_for_current_level / exp_needed_for_next) * 100).toFixed(2)))
    : 100;

  const level_title = getLevelTitle(current_level);
  const next_level_title = getLevelTitle(current_level + 1);

  return {
    current_level: current_level,
    current_exp: current_exp,
    exp_for_current_level: exp_for_current_level,
    exp_needed_for_next: exp_needed_for_next,
    next_level_exp: next_level_exp,
    progress_percentage: progress_percentage,
    level_title: level_title,
    next_level_title: next_level_title,
    can_level_up: current_exp >= next_level_exp
  };
};

/**
 * Calculate total EXP needed for a specific level
 * MUST MATCH backend calculateExpForLevel()
 * 
 * @param {number} level Target level
 * @returns {number} Total EXP needed to reach that level
 */
const calculateExpForLevel = (level) => {
  if (level <= 1) return 0;

  const base_exp = 100;
  const growth_factor = 1.5;

  let total_exp = 0;
  for (let i = 1; i < level; i++) {
    total_exp += Math.round(base_exp * Math.pow(i, growth_factor));
  }

  return total_exp;
};

/**
 * Get title for a level
 * MUST MATCH backend getLevelTitle()
 * 
 * @param {number} level User level
 * @returns {string} Level title
 */
const getLevelTitle = (level) => {
  const titles = {
    1: 'Novice Cook',
    2: 'Kitchen Helper',
    3: 'Home Chef',
    5: 'Sous Chef',
    10: 'Head Chef',
    15: 'Master Chef',
    20: 'Culinary Artist',
    25: 'Kitchen Wizard',
    30: 'Recipe Sage',
    40: 'Culinary Master',
    50: 'Grandmaster Chef'
  };

  let applicable_title = 'Novice Cook';
  Object.keys(titles).forEach(title_level => {
    if (level >= parseInt(title_level)) {
      applicable_title = titles[title_level];
    }
  });

  return applicable_title;
};

/**
 * Calculate rewards for completing a recipe based on difficulty
 * MUST MATCH backend calculateRecipeRewards()
 * 
 * @param {string} difficulty Recipe difficulty (easy, medium, hard)
 * @param {Object} user_limits User's maximum reward limits
 * @returns {Object} Reward amounts
 */
export const calculateRecipeRewards = (difficulty, user_limits) => {
  const difficulty_multipliers = {
    'easy': 0.5,
    'medium': 1.0,
    'hard': 1.5
  };

  const multiplier = difficulty_multipliers[difficulty] || 1.0;

  return {
    exp_reward: parseInt(Math.round(user_limits.max_exp_reward * multiplier * 0.7)),
    gold_reward: parseInt(Math.round(user_limits.max_gold_reward * multiplier * 0.7)),
    gem_reward: parseInt(Math.round(user_limits.max_gem_reward * multiplier * 0.5))
  };
};

/**
 * Calculate step completion rewards
 * MUST MATCH backend calculateStepRewards()
 * 
 * @param {number} step_index Step number (1-based)
 * @param {number} total_steps Total steps in recipe
 * @param {Object} recipe_rewards Total recipe rewards
 * @returns {Object} Step rewards
 */
export const calculateStepRewards = (step_index, total_steps, recipe_rewards) => {
  if (total_steps <= 0) {
    return { exp_reward: 0, gold_reward: 0, gem_reward: 0 };
  }

  let step_multiplier = 1.0;
  if (step_index === 1) {
    step_multiplier = 1.5;
  } else if (step_index === total_steps) {
    step_multiplier = 2.0;
  } else if (step_index > 0 && step_index < total_steps) {
    step_multiplier = 0.8 + (0.4 * (step_index / total_steps));
  }

  const base_exp_per_step = recipe_rewards.exp_reward / total_steps;
  const base_gold_per_step = recipe_rewards.gold_reward / total_steps;
  const base_gems_per_step = recipe_rewards.gem_reward / Math.max(1, total_steps / 2);

  const gems_for_this_step = (step_index % 2 === 0) ? base_gems_per_step : 0;

  return {
    exp_reward: parseInt(Math.round(base_exp_per_step * step_multiplier)),
    gold_reward: parseInt(Math.round(base_gold_per_step * step_multiplier)),
    gem_reward: parseInt(Math.round(gems_for_this_step * step_multiplier))
  };
};

/**
 * Check if user should level up based on current EXP
 * MUST MATCH backend checkLevelUp()
 * 
 * @param {number} current_level Current user level
 * @param {number} current_exp Current experience points
 * @returns {Object} Level up result with new level if applicable
 */
export const checkLevelUp = (current_level, current_exp) => {
  const next_level_exp = calculateExpForLevel(current_level + 1);

  if (current_exp >= next_level_exp) {
    let new_level = current_level;
    while (current_exp >= calculateExpForLevel(new_level + 1)) {
      new_level++;
    }

    return {
      should_level_up: true,
      old_level: current_level,
      new_level: new_level,
      levels_gained: new_level - current_level,
      exp_after_level_up: current_exp
    };
  }

  return {
    should_level_up: false,
    old_level: current_level,
    new_level: current_level
  };
};

/**
 * Calculate daily login bonus
 * MUST MATCH backend calculateDailyLoginBonus()
 * 
 * @param {number} login_streak Current login streak
 * @returns {Object} Daily bonus rewards
 */
export const calculateDailyLoginBonus = (login_streak) => {
  const base_exp = 10;
  const base_gold = 5;

  const streak_bonus = 1 + Math.floor(login_streak / 7);

  let gem_bonus = 0;
  if (login_streak % 7 === 0) {
    gem_bonus = 1;
  }
  if (login_streak % 30 === 0) {
    gem_bonus = 3;
  }

  return {
    exp_bonus: base_exp * streak_bonus,
    gold_bonus: base_gold * streak_bonus,
    gem_bonus: gem_bonus,
    streak: login_streak,
    next_milestone: Math.ceil(login_streak / 7) * 7
  };
};

/**
 * Apply consumable effect to user stats
 * MUST MATCH backend applyConsumableEffect()
 * 
 * @param {Object} user_stats User stats object
 * @param {string} consumable_type Type of consumable
 * @param {number} effect_value Effect magnitude
 * @returns {Object} Updated user stats
 */
export const applyConsumableEffect = (user_stats, consumable_type, effect_value) => {
  const updated_stats = { ...user_stats };

  switch (consumable_type) {
    case 'exp_boost':
      updated_stats.current_exp += effect_value;
      break;
    case 'gold_boost':
      updated_stats.gold_count += effect_value;
      break;
    case 'gem_boost':
      updated_stats.gem_count += effect_value;
      break;
    case 'recipe_quality':
      updated_stats.max_exp_reward = Math.min(500, updated_stats.max_exp_reward + effect_value);
      updated_stats.max_gold_reward = Math.min(250, updated_stats.max_gold_reward + effect_value);
      updated_stats.max_gem_reward = Math.min(25, updated_stats.max_gem_reward + effect_value);
      break;
    case 'cooking_speed':
      updated_stats.total_cooking_time = Math.max(0, updated_stats.total_cooking_time - effect_value);
      break;
  }

  return updated_stats;
};

/**
 * Calculate item affordability for shop purchases
 * 
 * @param {Object} userStats User stats (gold_count, gem_count)
 * @param {Object} item Shop item with prices
 * @returns {Object} Affordability information
 */
export const calculateItemAffordability = (userStats, item) => {
  const goldBalance = userStats?.gold_count || 0;
  const gemBalance = userStats?.gem_count || 0;

  const canAffordWithGold = item.gold_price <= goldBalance;
  const canAffordWithGems = item.gem_price <= gemBalance;
  const canAfford = canAffordWithGold || canAffordWithGems;

  const goldShortfall = Math.max(0, item.gold_price - goldBalance);
  const gemShortfall = Math.max(0, item.gem_price - gemBalance);

  return {
    can_afford: canAfford,
    can_afford_with_gold: canAffordWithGold,
    can_afford_with_gems: canAffordWithGems,
    gold_shortfall: goldShortfall,
    gem_shortfall: gemShortfall,
    gold_balance: goldBalance,
    gem_balance: gemBalance
  };
};

export default {
  calculateMaxRewards,
  calculateMaxPrices,
  calculateAllUserLimits,
  calculateLevelUpRequirements,
  calculateRecipeRewards,
  calculateStepRewards,
  checkLevelUp,
  calculateDailyLoginBonus,
  applyConsumableEffect,
  calculateItemAffordability
};