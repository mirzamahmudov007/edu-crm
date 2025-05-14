import api from "./api"
import type { Test, Question, TestResult } from "../types"

export interface TestFilters {
  groupId?: number
  teacherId?: number
  status?: "ACTIVE" | "COMPLETED" | "UPCOMING"
}

export const getAllTests = async (filters?: TestFilters) => {
  const params = new URLSearchParams()
  if (filters?.groupId) params.append("groupId", filters.groupId.toString())
  if (filters?.teacherId) params.append("teacherId", filters.teacherId.toString())
  if (filters?.status) params.append("status", filters.status)

  const response = await api.get<Test[]>(`/tests/admin?${params.toString()}`)
  return response.data
}

export const getTeacherTests = async () => {
  const response = await api.get<Test[]>("/tests/teacher")
  return response.data
}

export const getGroupTests = async (groupId: number) => {
  const response = await api.get<Test[]>(`/tests/group/${groupId}`)
  return response.data
}

export const getStudentTests = async () => {
  const response = await api.get<TestResult[]>("/tests/student")
  return response.data
}

export const getTestByAccessId = async (testAccessId: string) => {
  const response = await api.get<Test>(`/tests/${testAccessId}`)
  return response.data
}

export const createTest = async (data: {
  groupId: number
  title: string
  description: string
  startTime: string
  endTime: string
}) => {
  const response = await api.post("/tests", data)
  return response.data
}

export const deleteTest = async (testId: number) => {
  const response = await api.delete(`/tests/${testId}`)
  return response.data
}

// Updated to match new API structure - only sends text and correctAnswer
export const addQuestion = async (
  testId: number,
  data: {
    text: string
    correctAnswer: string
  },
) => {
  const response = await api.post(`/questions/${testId}`, data)
  return response.data
}

// New function to add options to a question one by one
export const addQuestionOption = async (
  questionId: number,
  data: {
    optionText: string
  },
) => {
  const response = await api.post(`/questions/${questionId}/options`, data)
  return response.data
}

// New function to get options for a specific question
export const getQuestionOptions = async (questionId: number) => {
  const response = await api.get<string[]>(`/questions/${questionId}/options`)
  return response.data
}

export const getTestQuestions = async (testId: number) => {
  const response = await api.get<Question[]>(`/questions/${testId}`)
  return response.data
}

export const submitTest = async (testAccessId: string, answers: Record<string, string>) => {
  const response = await api.post(`/test-results/submit/${testAccessId}`, answers)
  return response.data
}

export const getTestResults = async () => {
  const response = await api.get("/test-results")
  return response.data
}

export const getTestResultDetails = async (resultId: string) => {
  const response = await api.get(`/test-results/${resultId}`)
  return response.data
}

export const getStudentResults = async () => {
  const response = await api.get<TestResult[]>("/test-results/student")
  return response.data
}

export const getDetailedTestResult = async (testResultId: number) => {
  const response = await api.get<{
    testResult: TestResult
    questionResults: {
      questionId: number
      questionText: string
      studentAnswer: string
      correctAnswer: string
      isCorrect: boolean
    }[]
  }>(`/test-results/${testResultId}/details`)
  return response.data
}

// Also export as default object for backward compatibility
export const testsService = {
  getAllTests,
  getTeacherTests,
  getGroupTests,
  getStudentTests,
  getTestByAccessId,
  createTest,
  deleteTest,
  addQuestion,
  addQuestionOption, // Added new function
  getQuestionOptions, // Added new function
  getTestQuestions,
  submitTest,
  getTestResults,
  getStudentResults,
  getDetailedTestResult,
  getTestResultDetails,
}

export default testsService
