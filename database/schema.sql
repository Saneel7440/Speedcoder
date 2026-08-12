CREATE DATABASE IF NOT EXISTS demodb;
USE demodb;

CREATE TABLE IF NOT EXISTS typing_results (
    id INT PRIMARY KEY AUTO_INCREMENT,
    language_name VARCHAR(50) NOT NULL,
    wpm DECIMAL(8,2) NOT NULL,
    accuracy DECIMAL(8,2) NOT NULL,
    mistakes INT NOT NULL,
    total_characters INT NOT NULL,
    duration_seconds INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_typing_results_created_at
ON typing_results(created_at);
