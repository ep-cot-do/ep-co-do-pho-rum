-- Online Judge Database Schema

-- Problems table
CREATE TABLE IF NOT EXISTS problems (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    input_format TEXT,
    output_format TEXT,
    constraints TEXT,
    time_limit INTEGER NOT NULL, -- in milliseconds
    memory_limit INTEGER NOT NULL, -- in MB
    difficulty VARCHAR(20) CHECK (difficulty IN ('EASY', 'MEDIUM', 'HARD')),
    category VARCHAR(100),
    tags TEXT, -- JSON string for multiple tags
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_by BIGINT REFERENCES accounts(id),
    created_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Test cases table
CREATE TABLE IF NOT EXISTS test_cases (
    id BIGSERIAL PRIMARY KEY,
    problem_id BIGINT NOT NULL REFERENCES problems(id) ON DELETE CASCADE,
    input TEXT NOT NULL,
    expected_output TEXT NOT NULL,
    is_sample BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    test_order INTEGER,
    points INTEGER DEFAULT 1,
    created_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Submissions table
CREATE TABLE IF NOT EXISTS submissions (
    id BIGSERIAL PRIMARY KEY,
    problem_id BIGINT NOT NULL REFERENCES problems(id),
    user_id BIGINT NOT NULL REFERENCES accounts(id),
    source_code TEXT NOT NULL,
    language VARCHAR(20) NOT NULL CHECK (language IN ('JAVA', 'CPP', 'C', 'PYTHON', 'GO', 'JAVASCRIPT', 'CSHARP')),
    status VARCHAR(30) NOT NULL CHECK (status IN ('PENDING', 'COMPILING', 'RUNNING', 'ACCEPTED', 'WRONG_ANSWER', 'TIME_LIMIT_EXCEEDED', 'MEMORY_LIMIT_EXCEEDED', 'RUNTIME_ERROR', 'COMPILE_ERROR', 'PRESENTATION_ERROR', 'SYSTEM_ERROR')),
    execution_time INTEGER, -- in milliseconds
    memory_used INTEGER, -- in KB
    passed_tests INTEGER DEFAULT 0,
    total_tests INTEGER DEFAULT 0,
    score DECIMAL(5,2) DEFAULT 0.0,
    compile_error TEXT,
    runtime_error TEXT,
    judge_message TEXT,
    created_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_problems_difficulty ON problems(difficulty);
CREATE INDEX IF NOT EXISTS idx_problems_category ON problems(category);
CREATE INDEX IF NOT EXISTS idx_problems_created_by ON problems(created_by);
CREATE INDEX IF NOT EXISTS idx_problems_is_active ON problems(is_active);
CREATE INDEX IF NOT EXISTS idx_problems_created_date ON problems(created_date DESC);

CREATE INDEX IF NOT EXISTS idx_test_cases_problem_id ON test_cases(problem_id);
CREATE INDEX IF NOT EXISTS idx_test_cases_is_sample ON test_cases(is_sample);
CREATE INDEX IF NOT EXISTS idx_test_cases_test_order ON test_cases(test_order);

CREATE INDEX IF NOT EXISTS idx_submissions_problem_id ON submissions(problem_id);
CREATE INDEX IF NOT EXISTS idx_submissions_user_id ON submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_submissions_status ON submissions(status);
CREATE INDEX IF NOT EXISTS idx_submissions_language ON submissions(language);
CREATE INDEX IF NOT EXISTS idx_submissions_created_date ON submissions(created_date DESC);
CREATE INDEX IF NOT EXISTS idx_submissions_user_problem ON submissions(user_id, problem_id);

-- Sample data
INSERT INTO problems (title, description, input_format, output_format, constraints, time_limit, memory_limit, difficulty, category, tags, created_by) VALUES
('Two Sum', 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.', 'First line contains n (size of array)\nSecond line contains n integers\nThird line contains target integer', 'Two integers representing the indices', '2 <= nums.length <= 10^4\n-10^9 <= nums[i] <= 10^9\n-10^9 <= target <= 10^9', 1000, 256, 'EASY', 'Array', '["array", "hash-table"]', 1),

('Add Two Numbers', 'You are given two non-empty linked lists representing two non-negative integers. Add the two numbers and return the sum as a linked list.', 'Two lines, each containing space-separated integers representing a linked list', 'Space-separated integers representing the result linked list', '1 <= list length <= 100\n0 <= Node.val <= 9', 2000, 256, 'MEDIUM', 'Linked List', '["linked-list", "math"]', 1),

('Longest Substring Without Repeating Characters', 'Given a string s, find the length of the longest substring without repeating characters.', 'A single line containing string s', 'An integer representing the length', '0 <= s.length <= 5 * 10^4\ns consists of English letters, digits, symbols and spaces', 1500, 256, 'MEDIUM', 'String', '["string", "sliding-window"]', 1);

-- Sample test cases for Two Sum problem
INSERT INTO test_cases (problem_id, input, expected_output, is_sample, test_order, points) VALUES
(1, '4\n2 7 11 15\n9', '0 1', TRUE, 1, 1),
(1, '3\n3 2 4\n6', '1 2', TRUE, 2, 1),
(1, '2\n3 3\n6', '0 1', TRUE, 3, 1),
(1, '5\n1 2 3 4 5\n8', '2 4', FALSE, 4, 2),
(1, '6\n-1 0 1 2 -1 -4\n-2', '0 4', FALSE, 5, 2);

-- Sample test cases for Add Two Numbers problem
INSERT INTO test_cases (problem_id, input, expected_output, is_sample, test_order, points) VALUES
(2, '2 4 3\n5 6 4', '7 0 8', TRUE, 1, 1),
(2, '0\n0', '0', TRUE, 2, 1),
(2, '9 9 9 9 9 9 9\n9 9 9 9', '8 9 9 9 0 0 0 1', TRUE, 3, 1);

-- Sample test cases for Longest Substring problem
INSERT INTO test_cases (problem_id, input, expected_output, is_sample, test_order, points) VALUES
(3, 'abcabcbb', '3', TRUE, 1, 1),
(3, 'bbbbb', '1', TRUE, 2, 1),
(3, 'pwwkew', '3', TRUE, 3, 1),
(3, '', '0', FALSE, 4, 2),
(3, 'abcdefghijklmnopqrstuvwxyz', '26', FALSE, 5, 2);
