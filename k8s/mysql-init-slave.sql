-- Slave initialization
-- server_id จะตั้งผ่าน env ใน deployment
CHANGE MASTER TO
    MASTER_HOST='mysql-rayong.production.svc.cluster.local',
    MASTER_USER='repl',
    MASTER_PASSWORD='replpassword',
    MASTER_PORT=3306,
    MASTER_CONNECT_RETRY=10;

START SLAVE;
