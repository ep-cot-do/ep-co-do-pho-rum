# Online Judge System - FCoder

## Mô tả

Hệ thống Online Judge cho phép người dùng giải quyết các bài toán lập trình với nhiều ngôn ngữ khác nhau. Hệ thống hỗ trợ việc tạo bài toán, submit code và tự động chấm điểm.

## Tính năng chính

### 1. Quản lý bài toán (Problems)

- ✅ Tạo, sửa, xóa bài toán
- ✅ Phân loại theo độ khó (Easy, Medium, Hard)
- ✅ Tìm kiếm bài toán theo từ khóa, category, tags
- ✅ Quản lý test cases (sample và hidden)
- ✅ Thiết lập giới hạn thời gian và bộ nhớ

### 2. Submit và chấm bài

- ✅ Hỗ trợ nhiều ngôn ngữ: Java, C/C++, Python, Go, JavaScript, C#
- ✅ Tự động compile và chạy code
- ✅ Kiểm tra giới hạn thời gian và bộ nhớ
- ✅ Hiển thị kết quả chi tiết (Accepted, Wrong Answer, TLE, MLE, etc.)

### 3. Thống kê và theo dõi

- ✅ Lịch sử submit của user
- ✅ Thống kê số bài đã giải
- ✅ Leaderboard (có thể mở rộng)

## Cấu trúc database

### Problems Table

```sql
- id: Primary key
- title: Tiêu đề bài toán
- description: Mô tả chi tiết
- input_format: Định dạng input
- output_format: Định dạng output
- constraints: Ràng buộc
- time_limit: Giới hạn thời gian (ms)
- memory_limit: Giới hạn bộ nhớ (MB)
- difficulty: Độ khó (EASY/MEDIUM/HARD)
- category: Chủ đề
- tags: Các tag (JSON)
- is_active: Trạng thái active
- created_by: Người tạo
```

### Test Cases Table

```sql
- id: Primary key
- problem_id: Foreign key to problems
- input: Dữ liệu đầu vào
- expected_output: Kết quả mong đợi
- is_sample: Test case mẫu hay hidden
- test_order: Thứ tự test
- points: Điểm số
```

### Submissions Table

```sql
- id: Primary key
- problem_id: Foreign key to problems
- user_id: Foreign key to accounts
- source_code: Mã nguồn
- language: Ngôn ngữ lập trình
- status: Trạng thái (PENDING/ACCEPTED/WRONG_ANSWER/...)
- execution_time: Thời gian chạy
- memory_used: Bộ nhớ sử dụng
- passed_tests: Số test passed
- total_tests: Tổng số test
- score: Điểm số
```

## API Endpoints

### Problems API

```
GET    /api/problems              - Lấy danh sách bài toán
GET    /api/problems/{id}         - Lấy chi tiết bài toán
POST   /api/problems              - Tạo bài toán mới
PUT    /api/problems/{id}         - Cập nhật bài toán
DELETE /api/problems/{id}         - Xóa bài toán
GET    /api/problems/search       - Tìm kiếm bài toán
GET    /api/problems/difficulty/{difficulty} - Lọc theo độ khó
GET    /api/problems/category/{category}     - Lọc theo category
GET    /api/problems/tag/{tag}               - Lọc theo tag
```

### Submissions API

```
POST   /api/submissions           - Submit code
GET    /api/submissions/{id}      - Lấy chi tiết submission
GET    /api/submissions/user/{userId}        - Lịch sử submit của user
GET    /api/submissions/problem/{problemId}  - Submissions của bài toán
GET    /api/submissions/user/{userId}/stats  - Thống kê user
```

## Ngôn ngữ hỗ trợ

| Ngôn ngữ   | Compiler/Runtime | Extension |
| ---------- | ---------------- | --------- |
| Java       | javac            | .java     |
| C++        | g++              | .cpp      |
| C          | gcc              | .c        |
| Python     | python           | .py       |
| Go         | go               | .go       |
| JavaScript | node             | .js       |
| C#         | csc              | .cs       |

## Trạng thái Submission

- **PENDING**: Đang chờ xử lý
- **COMPILING**: Đang compile
- **RUNNING**: Đang chạy test
- **ACCEPTED**: Chấp nhận (100% test đúng)
- **WRONG_ANSWER**: Sai kết quả
- **TIME_LIMIT_EXCEEDED**: Quá thời gian
- **MEMORY_LIMIT_EXCEEDED**: Quá bộ nhớ
- **RUNTIME_ERROR**: Lỗi runtime
- **COMPILE_ERROR**: Lỗi compile
- **PRESENTATION_ERROR**: Lỗi format output
- **SYSTEM_ERROR**: Lỗi hệ thống

## Cách sử dụng

### 1. Tạo bài toán

```json
POST /api/problems
{
  "title": "Two Sum",
  "description": "Given an array of integers...",
  "inputFormat": "First line contains n...",
  "outputFormat": "Two integers...",
  "constraints": "2 <= n <= 10^4",
  "timeLimit": 1000,
  "memoryLimit": 256,
  "difficulty": "EASY",
  "category": "Array",
  "tags": ["array", "hash-table"],
  "testCases": [
    {
      "input": "4\n2 7 11 15\n9",
      "expectedOutput": "0 1",
      "isSample": true,
      "testOrder": 1,
      "points": 1
    }
  ]
}
```

### 2. Submit code

```json
POST /api/submissions
{
  "problemId": 1,
  "sourceCode": "public class Solution { ... }",
  "language": "JAVA"
}
```

### 3. Xem kết quả

```json
GET /api/submissions/{submissionId}
{
  "id": 1,
  "problemId": 1,
  "problemTitle": "Two Sum",
  "username": "user@example.com",
  "language": "JAVA",
  "status": "ACCEPTED",
  "executionTime": 45,
  "memoryUsed": 1024,
  "passedTests": 5,
  "totalTests": 5,
  "score": 100.0,
  "submittedAt": "2025-01-01T10:00:00"
}
```

## Cài đặt và triển khai

### 1. Cấu hình database

Chạy script migration để tạo tables:

```sql
-- File: V1_0_0__online_judge_schema.sql
-- Tự động chạy khi start application
```

### 2. Cấu hình compiler environments

Đảm bảo các compiler/runtime đã được cài đặt:

- Java JDK
- GCC (cho C/C++)
- Python
- Go
- Node.js
- .NET SDK (cho C#)

### 3. Security

- Sandbox environment cho code execution
- Giới hạn quyền truy cập file system
- Timeout protection
- Memory limit enforcement

## Mở rộng trong tương lai

### 1. Contest System

- Tạo và quản lý contest
- Realtime leaderboard
- Team participation

### 2. Interactive Problems

- Bài toán tương tác
- Custom judge

### 3. Advanced Features

- Code plagiarism detection
- Detailed performance analytics
- Multiple test case groups
- Partial scoring

### 4. UI/UX Improvements

- Code editor with syntax highlighting
- Submission history visualization
- Problem difficulty ratings
- Discussion forums

## Bảo mật

### Code Execution Security

- Sử dụng Docker containers để cách ly
- Giới hạn system calls
- Timeout và resource limits
- Cleanup temporary files

### API Security

- JWT authentication
- Rate limiting
- Input validation
- SQL injection prevention

## Monitoring

### Performance Metrics

- Submission processing time
- System resource usage
- Error rates
- User activity

### Logging

- All submission attempts
- Compilation errors
- Runtime errors
- Security violations
