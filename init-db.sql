CREATE DATABASE IF NOT EXISTS time_tracker;
CREATE DATABASE IF NOT EXISTS keycloak;


-- Create users and grant privileges
CREATE USER IF NOT EXISTS 'time_tracker'@'%' IDENTIFIED BY 'changeThis';
CREATE USER IF NOT EXISTS 'keycloak'@'%' IDENTIFIED BY 'changeThis';

GRANT ALL PRIVILEGES ON time_tracker.* TO 'time_tracker'@'%';
GRANT ALL PRIVILEGES ON keycloak.* TO 'time_tracker'@'%';
GRANT ALL PRIVILEGES ON keycloak.* TO 'keycloak'@'%';

FLUSH PRIVILEGES;