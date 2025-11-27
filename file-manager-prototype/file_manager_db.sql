CREATE DATABASE file_manager_db;

USE file_manager_db;

CREATE TABLE files (
  id INT AUTO_INCREMENT PRIMARY KEY,
  original_name VARCHAR(255) NOT NULL,
  stored_name   VARCHAR(255) NOT NULL,
  mime_type     VARCHAR(100) NOT NULL,
  size          BIGINT NOT NULL,
  path          VARCHAR(500) NOT NULL,
  uploaded_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
