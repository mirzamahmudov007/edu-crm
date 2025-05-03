// This file re-exports everything from tests.service.ts to maintain backward compatibility
// and fix the import error in the browser

import * as testsService from './tests.service';

export const {
  getTeacherTests,
  getGroupTests,
  getStudentTests,
  getTestByAccessId,
  createTest,
  deleteTest,
  addQuestion,
  getTestQuestions,
  submitTest,
  getTestResults,
  getStudentResults,
  getDetailedTestResult,
} = testsService;

export default testsService.default; 