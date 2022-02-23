CREATE DATABASE org_tool CHARACTER SET 'utf8' COLLATE = 'utf8_general_ci';
CREATE USER 'org_root'@localhost IDENTIFIED BY '123456';
GRANT ALL PRIVILEGES ON org_tool.* TO org_root@localhost;
