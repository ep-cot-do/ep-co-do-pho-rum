package com.fcoder.Fcoder.service;

import com.fcoder.Fcoder.model.entity.SubmissionEntity;
import com.fcoder.Fcoder.model.entity.TestCaseEntity;
import com.fcoder.Fcoder.model.other.CompilationResult;
import com.fcoder.Fcoder.model.other.ExecutionResult;
import com.fcoder.Fcoder.model.other.TestCaseResult;

import java.util.List;

public interface CodeExecutionService {

    ExecutionResult executeCode(String sourceCode,
            SubmissionEntity.ProgrammingLanguage language,
            List<TestCaseEntity> testCases,
            int timeLimit,
            int memoryLimit);

    CompilationResult compileCode(String sourceCode, SubmissionEntity.ProgrammingLanguage language);

    TestCaseResult runTestCase(String executablePath,
            TestCaseEntity testCase,
            int timeLimit,
            int memoryLimit);
    void cleanup(String workingDirectory);
}
