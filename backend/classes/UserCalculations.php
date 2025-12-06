<?php

/**
 * UserCalculations Class
 * Handles gamification calculations for user levels, rewards, and limits
 */

class UserCalculations {
    
    /**
     * Calculate maximum rewards a user can give for recipes
     * Based on user level and stats
     * 
     * @param array $user_data User data including level and stats
     * @return array Maximum reward values
     */
    public static function calculateMaxRewards($user_data) {
        $level = $user_data['level'] ?? 1;
        $recipes_created = $user_data['recipes_created'] ?? 0;
        $recipes_cooked = $user_data['recipes_cooked'] ?? 0;
        
        // Base rewards increase with level
        $base_exp = 100;
        $base_gold = 50;
        $base_gems = 5;
        
        // Level multiplier (increases rewards by 10% per level)
        $level_multiplier = 1 + (($level - 1) * 0.1);
        
        // Activity bonus (more recipes = higher rewards)
        $total_recipes = $recipes_created + $recipes_cooked;
        $activity_bonus = 1 + min(($total_recipes / 100), 1.0); // Up to 100% bonus
        
        // Calculate max rewards
        $max_exp_reward = round($base_exp * $level_multiplier * $activity_bonus);
        $max_gold_reward = round($base_gold * $level_multiplier * $activity_bonus);
        $max_gem_reward = round($base_gems * ($level_multiplier * 0.5) * $activity_bonus); // Gems increase slower
        
        // Apply minimum and maximum caps
        $max_exp_reward = max(50, min($max_exp_reward, 500));
        $max_gold_reward = max(25, min($max_gold_reward, 250));
        $max_gem_reward = max(1, min($max_gem_reward, 25));
        
        return [
            'max_exp_reward' => (int)$max_exp_reward,
            'max_gold_reward' => (int)$max_gold_reward,
            'max_gem_reward' => (int)$max_gem_reward
        ];
    }
    
    /**
     * Calculate maximum prices a user can set for recipes
     * Based on user level and sales history
     * 
     * @param array $user_data User data including level and stats
     * @return array Maximum price values
     */
    public static function calculateMaxPrices($user_data) {
        $level = $user_data['level'] ?? 1;
        $recipes_sold = $user_data['recipes_sold'] ?? 0;
        
        // Base prices increase with level
        $base_gold_price = 100;
        $base_gem_price = 10;
        
        // Level multiplier (increases prices by 15% per level)
        $level_multiplier = 1 + (($level - 1) * 0.15);
        
        // Sales reputation bonus (more sales = higher prices)
        $sales_bonus = 1 + min(($recipes_sold / 50), 2.0); // Up to 200% bonus
        
        // Calculate max prices
        $max_gold_price = round($base_gold_price * $level_multiplier * $sales_bonus);
        $max_gem_price = round($base_gem_price * ($level_multiplier * 0.8) * $sales_bonus); // Gems increase slower
        
        // Apply minimum and maximum caps
        $max_gold_price = max(50, min($max_gold_price, 1000));
        $max_gem_price = max(5, min($max_gem_price, 100));
        
        return [
            'max_gold_price' => (int)$max_gold_price,
            'max_gem_price' => (int)$max_gem_price
        ];
    }
    
    /**
     * Calculate all user limits (rewards and prices)
     * 
     * @param array $user_data User data including level and stats
     * @return array All limit values
     */
    public static function calculateAllUserLimits($user_data) {
        $max_rewards = self::calculateMaxRewards($user_data);
        $max_prices = self::calculateMaxPrices($user_data);
        
        return array_merge($max_rewards, $max_prices, [
            'last_limit_update' => date('Y-m-d H:i:s')
        ]);
    }
    
    /**
     * Calculate level up requirements
     * 
     * @param int $current_level Current user level
     * @param int $current_exp Current experience points
     * @return array Level up requirements and progress
     */
    public static function calculateLevelUpRequirements($current_level, $current_exp) {
        // Exponential level progression formula
        // Each level requires more EXP than the previous one
        $base_exp = 100;
        $growth_factor = 1.5;
        
        // Calculate EXP needed for current level and next level
        $current_level_exp = self::calculateExpForLevel($current_level);
        $next_level_exp = self::calculateExpForLevel($current_level + 1);
        
        // Calculate progress
        $exp_for_current_level = $current_exp - $current_level_exp;
        $exp_needed_for_next = $next_level_exp - $current_level_exp;
        $progress_percentage = $exp_needed_for_next > 0 
            ? min(100, round(($exp_for_current_level / $exp_needed_for_next) * 100, 2))
            : 100;
        
        // Determine level title based on level
        $level_title = self::getLevelTitle($current_level);
        $next_level_title = self::getLevelTitle($current_level + 1);
        
        return [
            'current_level' => $current_level,
            'current_exp' => $current_exp,
            'exp_for_current_level' => $exp_for_current_level,
            'exp_needed_for_next' => $exp_needed_for_next,
            'next_level_exp' => $next_level_exp,
            'progress_percentage' => $progress_percentage,
            'level_title' => $level_title,
            'next_level_title' => $next_level_title,
            'can_level_up' => $current_exp >= $next_level_exp
        ];
    }
    
    /**
     * Calculate total EXP needed for a specific level
     * 
     * @param int $level Target level
     * @return int Total EXP needed to reach that level
     */
    private static function calculateExpForLevel($level) {
        if ($level <= 1) return 0;
        
        // Exponential growth formula: EXP = 100 * (level - 1)^1.5
        $base_exp = 100;
        $growth_factor = 1.5;
        
        $total_exp = 0;
        for ($i = 1; $i < $level; $i++) {
            $total_exp += round($base_exp * pow($i, $growth_factor));
        }
        
        return $total_exp;
    }
    
    /**
     * Get title for a level
     * 
     * @param int $level User level
     * @return string Level title
     */
    private static function getLevelTitle($level) {
        $titles = [
            1 => 'Novice Cook',
            2 => 'Kitchen Helper',
            3 => 'Home Chef',
            5 => 'Sous Chef',
            10 => 'Head Chef',
            15 => 'Master Chef',
            20 => 'Culinary Artist',
            25 => 'Kitchen Wizard',
            30 => 'Recipe Sage',
            40 => 'Culinary Master',
            50 => 'Grandmaster Chef'
        ];
        
        // Find the highest title the user has achieved
        $applicable_title = 'Novice Cook';
        foreach ($titles as $title_level => $title) {
            if ($level >= $title_level) {
                $applicable_title = $title;
            }
        }
        
        return $applicable_title;
    }
    
    /**
     * Calculate rewards for completing a recipe based on difficulty
     * 
     * @param string $difficulty Recipe difficulty (easy, medium, hard)
     * @param array $user_limits User's maximum reward limits
     * @return array Reward amounts
     */
    public static function calculateRecipeRewards($difficulty, $user_limits) {
        $difficulty_multipliers = [
            'easy' => 0.5,
            'medium' => 1.0,
            'hard' => 1.5
        ];
        
        $multiplier = $difficulty_multipliers[$difficulty] ?? 1.0;
        
        return [
            'exp_reward' => (int)round($user_limits['max_exp_reward'] * $multiplier * 0.7), // 70% of max for normal completion
            'gold_reward' => (int)round($user_limits['max_gold_reward'] * $multiplier * 0.7),
            'gem_reward' => (int)round($user_limits['max_gem_reward'] * $multiplier * 0.5) // Gems are rarer
        ];
    }
    
    /**
     * Calculate step completion rewards
     * 
     * @param int $step_index Step number (1-based)
     * @param int $total_steps Total steps in recipe
     * @param array $recipe_rewards Total recipe rewards
     * @return array Step rewards
     */
    public static function calculateStepRewards($step_index, $total_steps, $recipe_rewards) {
        if ($total_steps <= 0) {
            return ['exp_reward' => 0, 'gold_reward' => 0, 'gem_reward' => 0];
        }
        
        // First and last steps give more rewards
        $step_multiplier = 1.0;
        if ($step_index === 1) {
            $step_multiplier = 1.5; // First step bonus
        } elseif ($step_index === $total_steps) {
            $step_multiplier = 2.0; // Final step bonus
        } elseif ($step_index > 0 && $step_index < $total_steps) {
            // Middle steps: linear distribution
            $step_multiplier = 0.8 + (0.4 * ($step_index / $total_steps));
        }
        
        // Distribute total rewards across steps
        $base_exp_per_step = $recipe_rewards['exp_reward'] / $total_steps;
        $base_gold_per_step = $recipe_rewards['gold_reward'] / $total_steps;
        $base_gems_per_step = $recipe_rewards['gem_reward'] / max(1, $total_steps / 2); // Gems on half the steps
        
        // Check if this step should give gems (every other step)
        $gems_for_this_step = ($step_index % 2 === 0) ? $base_gems_per_step : 0;
        
        return [
            'exp_reward' => (int)round($base_exp_per_step * $step_multiplier),
            'gold_reward' => (int)round($base_gold_per_step * $step_multiplier),
            'gem_reward' => (int)round($gems_for_this_step * $step_multiplier)
        ];
    }
    
    /**
     * Check if user should level up based on current EXP
     * 
     * @param int $current_level Current user level
     * @param int $current_exp Current experience points
     * @return array Level up result with new level if applicable
     */
    public static function checkLevelUp($current_level, $current_exp) {
        $next_level_exp = self::calculateExpForLevel($current_level + 1);
        
        if ($current_exp >= $next_level_exp) {
            // Calculate how many levels the user should gain
            $new_level = $current_level;
            while ($current_exp >= self::calculateExpForLevel($new_level + 1)) {
                $new_level++;
            }
            
            return [
                'should_level_up' => true,
                'old_level' => $current_level,
                'new_level' => $new_level,
                'levels_gained' => $new_level - $current_level,
                'exp_after_level_up' => $current_exp // Keep excess EXP
            ];
        }
        
        return [
            'should_level_up' => false,
            'old_level' => $current_level,
            'new_level' => $current_level
        ];
    }
    
    /**
     * Calculate daily login bonus
     * 
     * @param int $login_streak Current login streak
     * @return array Daily bonus rewards
     */
    public static function calculateDailyLoginBonus($login_streak) {
        // Base rewards
        $base_exp = 10;
        $base_gold = 5;
        
        // Streak bonus (increases every 7 days)
        $streak_bonus = 1 + floor($login_streak / 7);
        
        // Special rewards for milestone streaks
        $gem_bonus = 0;
        if ($login_streak % 7 === 0) {
            $gem_bonus = 1; // Gem every week
        }
        if ($login_streak % 30 === 0) {
            $gem_bonus = 3; // More gems for monthly streak
        }
        
        return [
            'exp_bonus' => $base_exp * $streak_bonus,
            'gold_bonus' => $base_gold * $streak_bonus,
            'gem_bonus' => $gem_bonus,
            'streak' => $login_streak,
            'next_milestone' => ceil($login_streak / 7) * 7
        ];
    }
}