-- Master initialization
CREATE DATABASE IF NOT EXISTS shopdb;
CREATE USER IF NOT EXISTS 'shopuser'@'%' IDENTIFIED BY 'shoppassword';
GRANT ALL PRIVILEGES ON shopdb.* TO 'shopuser'@'%';
FLUSH PRIVILEGES;

-- Replication user
CREATE USER IF NOT EXISTS 'repl'@'%' IDENTIFIED BY 'replpassword';
GRANT REPLICATION SLAVE ON *.* TO 'repl'@'%';
FLUSH PRIVILEGES;

-- Binlog settings (server_id จะต้องตั้งใน deployment env)
