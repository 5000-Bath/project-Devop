-- ใช้ environment variable ของ Master service
CHANGE MASTER TO
  MASTER_HOST='mysql-rayong',
  MASTER_USER='repl',
  MASTER_PASSWORD='replpassword',
  MASTER_AUTO_POSITION=1;
START SLAVE;
