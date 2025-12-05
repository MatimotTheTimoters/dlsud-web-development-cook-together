<?php
/**
 * Environment Configuration
 * Handles environment-specific settings and database configuration
 */

class EnvironmentConfig {
    private static $environment = 'dev'; // 'dev' or 'prod'
    private static $configs = [
        'dev' => [
            'database' => [
                'host' => 'localhost',
                'dbname' => 'cooktogether',
                'username' => 'root',
                'password' => '',
                'charset' => 'utf8mb4'
            ],
            'api' => [
                'base_url' => 'http://localhost/backend/api/',
                'jwt_secret' => 'your_jwt_secret_key_for_development_change_this_in_production',
                'jwt_expire' => 3600 // 1 hour
            ]
        ],
        'prod' => [
            'database' => [
                'host' => 'localhost',
                'dbname' => 'cooktogether',
                'username' => 'your_prod_username',
                'password' => 'your_prod_password',
                'charset' => 'utf8mb4'
            ],
            'api' => [
                'base_url' => 'https://yourdomain.com/api/',
                'jwt_secret' => 'your_secure_jwt_secret_production_key',
                'jwt_expire' => 86400 // 24 hours
            ]
        ]
    ];

    /**
     * Returns current environment (dev/prod)
     * @return string
     */
    public static function getEnvironment() {
        return self::$environment;
    }

    /**
     * Returns database connection parameters
     * @return array
     */
    public static function getDatabaseConfig() {
        return self::$configs[self::$environment]['database'];
    }

    /**
     * Returns API configuration settings
     * @return array
     */
    public static function getApiConfig() {
        return self::$configs[self::$environment]['api'];
    }

    /**
     * Set environment (optional, can be used to override)
     * @param string $env
     */
    public static function setEnvironment($env) {
        if (in_array($env, ['dev', 'prod'])) {
            self::$environment = $env;
        }
    }
}
?>