# FCoder Compiler System

Hệ thống compiler của FCoder sử dụng Docker containers để chạy và biên dịch code một cách an toàn và cô lập.

## Kiến trúc

### Compiler Factory Pattern

- `CompilerFactory`: Factory class quản lý tất cả các compiler
- `BaseCompiler`: Abstract class định nghĩa interface chung cho tất cả compiler
- Các implementation cụ thể cho từng ngôn ngữ lập trình

### Ngôn ngữ được hỗ trợ

| Ngôn ngữ   | Docker Image       | Compiler/Interpreter |
| ---------- | ------------------ | -------------------- |
| Java       | openjdk:17-alpine  | javac + java         |
| C++        | gcc:latest         | g++                  |
| C          | gcc:latest         | gcc                  |
| Python     | python:3.11-alpine | python               |
| JavaScript | node:18-alpine     | node                 |

## Cài đặt Docker Images

Để sử dụng hệ thống compiler, bạn cần pull các Docker images cần thiết:

```bash
# Java
docker pull openjdk:17-alpine

# C/C++
docker pull gcc:latest

# Python
docker pull python:3.11-alpine

# JavaScript/Node.js
docker pull node:18-alpine
```

## Tính năng bảo mật

### Docker Security Features

- `--network=none`: Không có kết nối mạng
- `--memory=512m`: Giới hạn RAM 512MB
- `--cpus=1`: Giới hạn 1 CPU core
- `--rm`: Tự động xóa container sau khi chạy
- Volume mounting chỉ thư mục workspace cần thiết

### Timeout và Resource Limits

- Compile timeout: 30 giây
- Execution timeout: Có thể cấu hình theo test case
- Memory limit: 512MB
- CPU limit: 1 core

## Cách thức hoạt động

### 1. Compilation Process

1. Tạo workspace tạm thời
2. Viết source code vào file
3. Mount workspace vào Docker container
4. Chạy lệnh compilation trong container
5. Trả về kết quả compilation

### 2. Execution Process

1. Chạy executable trong Docker container
2. Provide input từ test case
3. Capture output và so sánh với expected output
4. Trả về kết quả test case

## API Usage

### Compile Code

```java
CompilerFactory factory = new CompilerFactory();
BaseCompiler compiler = factory.getCompiler(ProgrammingLanguage.JAVA);
CompilationResult result = compiler.compile(sourceCode, workspace);
```

### Execute Test Case

```java
CodeExecutionService service = new CodeExecutionServiceImpl(compilerFactory);
ExecutionResult result = service.executeCode(
    sourceCode,
    language,
    testCases,
    timeLimit,
    memoryLimit
);
```

## Configuration

### Docker Requirements

- Docker Engine phải được cài đặt và chạy
- User cần quyền truy cập Docker commands
- Đủ dung lượng disk cho Docker images

### System Requirements

- Minimum 2GB RAM (khuyến nghị 4GB)
- Minimum 5GB disk space cho Docker images
- Linux/Windows/macOS với Docker support

## Troubleshooting

### Common Issues

1. **Docker not found**

   ```
   Solution: Cài đặt Docker và đảm bảo service đang chạy
   ```

2. **Permission denied**

   ```
   Solution: Thêm user vào docker group hoặc chạy với sudo
   ```

3. **Out of memory**

   ```
   Solution: Tăng memory limit hoặc optimize code
   ```

4. **Compilation timeout**
   ```
   Solution: Kiểm tra code complexity và tăng timeout nếu cần
   ```

### Debug Commands

```bash
# Kiểm tra Docker
docker --version

# Kiểm tra images
docker images

# Test compile Java
docker run --rm -v $(pwd):/workspace -w /workspace openjdk:17-alpine javac Main.java

# Test run Java
docker run --rm -v $(pwd):/workspace -w /workspace openjdk:17-alpine java Main
```

## Performance Considerations

- Container startup overhead: ~100-500ms per execution
- Volume mounting overhead: Minimal with local filesystem
- Memory usage: Base container + compilation/execution memory
- Concurrent executions: Limited by system resources

## Security Best Practices

1. **Network Isolation**: Containers không có internet access
2. **Resource Limits**: Giới hạn CPU và memory
3. **Filesystem Isolation**: Chỉ mount thư mục workspace cần thiết
4. **User Privileges**: Container chạy với non-root user khi có thể
5. **Timeout Protection**: Giới hạn thời gian execution
