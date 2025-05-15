"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { getTestByAccessId, getTestQuestions, submitTest } from "../services/tests.service"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle, XCircle, ArrowLeft, Check, Clock, AlertTriangle } from "lucide-react"

interface QuestionResult {
  questionId: number
  questionText: string
  studentAnswer: string
  correctAnswer: string
  isCorrect: boolean
}

interface TestResult {
  id: number
  test: {
    title: string
    description: string
  }
  score: number
  submissionTime: string
}

interface TestSubmissionResponse {
  testResult: TestResult
  questionResults: QuestionResult[]
}

interface Question {
  id: number
  text: string
  options: string[]
  correctAnswer: string
}

interface TestProgressProps {
  currentQuestion: number
  totalQuestions: number
  remainingTime: number
  onTimeUp: () => void
  isCorrect: boolean
}

const TestProgress: React.FC<TestProgressProps> = ({ currentQuestion, totalQuestions, remainingTime, onTimeUp }) => {
  const minutes = Math.floor(remainingTime / 60)
  const seconds = remainingTime % 60
  const progress = (currentQuestion / totalQuestions) * 100

  // Calculate time percentage for color change
  const timePercentage = (remainingTime / (totalQuestions * 120)) * 100
  const getTimeColor = () => {
    if (timePercentage > 50) return 'text-green-600'
    if (timePercentage > 25) return 'text-orange-500'
    return 'text-red-600'
  }

  useEffect(() => {
    if (remainingTime <= 0) {
      onTimeUp()
    }
  }, [remainingTime, onTimeUp])

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
      <div className="flex flex-col space-y-4">
        {/* Progress Section */}
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-gray-700">
              Savol {currentQuestion} / {totalQuestions}
            </span>
            <div className="flex-1 h-2 w-32 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300 ease-in-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Timer Section */}
        <div className="flex items-center justify-center">
          <div className={`flex items-center gap-2 ${getTimeColor()} transition-colors duration-300`}>
            <Clock className={`w-5 h-5 ${remainingTime < 60 ? 'animate-pulse' : ''}`} />
            <div className="font-mono text-2xl font-bold tracking-wider">
              {minutes.toString().padStart(2, "0")}
              <span className={`mx-1 ${remainingTime < 60 ? 'animate-pulse' : ''}`}>:</span>
              {seconds.toString().padStart(2, "0")}
            </div>
          </div>
        </div>

        {/* Warning Message */}
        {remainingTime < 60 && (
          <div className="flex items-center justify-center gap-2 text-red-500 animate-pulse">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-sm font-medium">Vaqt tugashiga oz qoldi!</span>
          </div>
        )}

        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ease-in-out ${
              timePercentage > 50 ? 'bg-green-500' :
              timePercentage > 25 ? 'bg-orange-500' : 'bg-red-500'
            }`}
            style={{ width: `${timePercentage}%` }}
          />
        </div>
      </div>
    </div>
  )
}

const Test: React.FC = () => {
  const { testAccessId } = useParams<{ testAccessId: string }>()
  const navigate = useNavigate()
  const [test, setTest] = useState<any>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [testResults, setTestResults] = useState<TestSubmissionResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [remainingTime, setRemainingTime] = useState<number>(120) // 2 minutes in seconds
  const [isCorrect, setIsCorrect] = useState<boolean>(false)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0)
  const [timeUp, setTimeUp] = useState<boolean>(false)

  useEffect(() => {
    if (testAccessId && testAccessId !== "undefined") {
      fetchTest()
    } else {
      setError("Invalid test identifier")
      setLoading(false)
    }
  }, [testAccessId])

  useEffect(() => {
    if (timeUp) {
      handleSubmit()
    }
  }, [timeUp])

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          setTimeUp(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const showToast = (message: string, type: "success" | "error" | "warning") => {
    const toast = document.createElement("div")
    toast.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
      type === "success" ? "bg-green-500" : type === "error" ? "bg-red-500" : "bg-yellow-500"
    } text-white`
    toast.textContent = message
    document.body.appendChild(toast)
    setTimeout(() => {
      toast.classList.add("opacity-0", "transition-opacity", "duration-500")
      setTimeout(() => document.body.removeChild(toast), 500)
    }, 3000)
  }

  const fetchTest = async () => {
    try {
      setLoading(true)
      setError(null)

      const testResponse = await getTestByAccessId(testAccessId!)

      if (!testResponse) {
        throw new Error("Test not found")
      }

      setTest(testResponse)

      if (testResponse && testResponse.id) {
        const questionsResponse = await getTestQuestions(testResponse.id)
        setQuestions(questionsResponse)
        // Set initial time based on number of questions (2 minutes per question)
        setRemainingTime(questionsResponse.length * 120)
      } else {
        throw new Error("Test identifier not found")
      }
    } catch (error: any) {
      console.error("Error fetching test:", error)

      if (error.response) {
        if (error.response.status === 403) {
          setError("You do not have permission to view this test. Please contact your teacher.")
        } else if (error.response.status === 404) {
          setError("Test not found. The test identifier may be incorrect or the test may have been deleted.")
        } else {
          setError(`Server error: ${error.response.status}. ${error.response.data?.message || "No information"}`)
        }
      } else if (error.request) {
        setError("Error connecting to server. Please check your internet connection.")
      } else {
        setError(`Error: ${error.message}`)
      }

      showToast("Error fetching test", "error")
    } finally {
      setLoading(false)
    }
  }

  const handleAnswerChange = (questionId: number, answer: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }))

    const currentQuestion = questions[currentQuestionIndex]
    setIsCorrect(currentQuestion?.correctAnswer === answer)

    // Move to next question if available
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((currentIndex) => currentIndex + 1)
    }
  }

  const handleSubmit = async () => {
    if (timeUp || submitting) return

    try {
      setSubmitting(true)
      setError(null)

      // Fill unanswered questions with empty strings
      const allAnswers = { ...answers }
      questions.forEach((question) => {
        if (!allAnswers[question.id]) {
          allAnswers[question.id] = ""
        }
      })

      const response = await submitTest(testAccessId!, allAnswers)
      setTestResults(response)
      showToast("Test submitted successfully", "success")
    } catch (error: any) {
      console.error("Error submitting test:", error)

      if (error.response) {
        if (error.response.status === 403) {
          setError("You do not have permission to submit this test.")
        } else if (error.response.status === 404) {
          setError("Test not found. The test identifier may be incorrect or the test may have been deleted.")
        } else {
          setError(`Server error: ${error.response.status}. ${error.response.data?.message || "No information"}`)
        }
      } else if (error.request) {
        setError("Error connecting to server. Please check your internet connection.")
      } else {
        setError(`Error: ${error.message}`)
      }

      showToast("Error submitting test", "error")
    } finally {
      setSubmitting(false)
    }
  }

  const handleTimeUp = () => {
    setTimeUp(true)
    showToast("Time is up! Test will be automatically submitted.", "warning")
  }

  const getProgress = () => {
    const answered = Object.keys(answers).length
    return Math.round((answered / questions.length) * 100)
  }

  const handleViewAllResults = () => {
    navigate("/student/results")
  }

  if (loading) {
    return (
      <div className="p-2 sm:p-3 max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 animate-pulse">
          <div className="h-6 sm:h-8 bg-gray-200 rounded-md w-3/4 mb-3"></div>
          <div className="h-3 sm:h-4 bg-gray-200 rounded-md w-1/2 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-10 sm:h-12 bg-gray-200 rounded-md"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-2 sm:p-3 max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4">
          <div className="flex items-center gap-2 text-red-500 mb-3">
            <AlertTriangle className="w-5 h-5" />
            <h2 className="text-lg font-semibold">Error</h2>
          </div>
          <p className="text-gray-700 mb-4">{error}</p>
          <button
            onClick={() => navigate("/student/tests")}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to tests list
          </button>
        </div>
      </div>
    )
  }

  if (!test) {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-start gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg mb-6">
            <AlertTriangle className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-yellow-700">Test Not Found</h3>
              <p className="text-yellow-600">The test you are looking for was not found.</p>
            </div>
          </div>
          <div className="flex justify-center mt-6">
            <button
              onClick={() => navigate("/student/tests")}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-full shadow-md hover:shadow-lg transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Tests
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (testResults) {
    const { testResult, questionResults } = testResults
    const correctAnswers = questionResults.filter((q) => q.isCorrect).length
    const totalQuestions = questionResults.length
    const scorePercentage = Math.round((correctAnswers / totalQuestions) * 100)

    return (
      <div className="p-6 max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border-t-4 border-purple-500">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">{testResult.test.title}</h1>
          <p className="text-gray-600 mb-4">{testResult.test.description}</p>
          <div className="h-px bg-gray-200 my-4"></div>
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
              <div className="text-lg font-bold text-center text-purple-700">{scorePercentage}%</div>
              <div className="text-sm text-center text-gray-600">
                {correctAnswers} / {totalQuestions} correct
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm font-medium text-gray-700">Submission Time:</div>
              <div className="text-sm text-gray-600">{new Date(testResult.submissionTime).toLocaleString()}</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4">
            <h2 className="text-xl font-bold text-white">Question Results</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {questionResults.map((item, index) => (
              <div key={index} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-700 font-bold text-sm">
                    {index + 1}
                  </div>
                  {item.isCorrect ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Correct
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      <XCircle className="w-3 h-3 mr-1" />
                      Incorrect
                    </span>
                  )}
                </div>
                <p className="text-gray-800 mb-3 font-medium">{item.questionText}</p>
                <div className="ml-4 space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="font-medium text-sm text-gray-700">Your answer:</span>
                    <span className={item.isCorrect ? "text-green-600" : "text-red-600"}>
                      {item.studentAnswer || "No answer provided"}
                    </span>
                  </div>
                  {!item.isCorrect && (
                    <div className="flex items-start gap-2">
                      <span className="font-medium text-sm text-gray-700">Correct answer:</span>
                      <span className="text-green-600">{item.correctAnswer}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={handleViewAllResults}
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-full shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
          >
            <Check className="w-5 h-5" />
            View All My Results
          </button>
        </div>
      </div>
    )
  }

  if (test && (!questions || questions.length === 0)) {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">{test.title}</h1>
          <p className="text-gray-600 mb-6">{test.description}</p>
          <div className="flex flex-col items-center justify-center py-8">
            <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-700 mb-4">Loading questions...</p>
          </div>
        </div>
      </div>
    )
  }

  // Check if we have the current question
  const currentQuestion = questions[currentQuestionIndex]

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <TestProgress
        currentQuestion={currentQuestionIndex + 1}
        totalQuestions={questions.length || 0}
        remainingTime={remainingTime}
        onTimeUp={handleTimeUp}
        isCorrect={isCorrect}
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestionIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border-t-4 border-purple-500">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">{test?.title}</h1>
            <p className="text-gray-600 mb-4">{test?.description}</p>
            <div className="mt-4">
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-500"
                  style={{ width: `${getProgress()}%` }}
                ></div>
              </div>
              <div className="text-right text-xs text-gray-500 mt-1">
                {Object.keys(answers).length}/{questions.length} questions answered
              </div>
            </div>
          </div>

          {questions && questions.length > 0 && currentQuestion && (
            <div className="space-y-6">
              <div key={currentQuestion.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white text-purple-600 font-bold text-sm">
                      {currentQuestionIndex + 1}
                    </span>
                    {currentQuestion.text}
                  </h2>
                </div>
                <div className="p-4">
                  {currentQuestion.options && currentQuestion.options.length > 0 ? (
                    <div className="grid gap-3">
                      {currentQuestion.options.map((option: string, optIndex: number) => {
                        const colors = [
                          "from-red-500 to-red-400",
                          "from-blue-500 to-blue-400",
                          "from-yellow-500 to-yellow-400",
                          "from-green-500 to-green-400",
                          "from-purple-500 to-purple-400",
                          "from-pink-500 to-pink-400",
                        ]
                        const colorClass = colors[optIndex % colors.length]

                        return (
                          <label
                            key={optIndex}
                            className={`
                              relative block p-4 rounded-lg cursor-pointer transition-all
                              ${
                                answers[currentQuestion.id] === option
                                  ? `bg-gradient-to-r ${colorClass} text-white shadow-md`
                                  : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                              }
                            `}
                          >
                            <input
                              type="radio"
                              name={`question-${currentQuestion.id}`}
                              value={option}
                              checked={answers[currentQuestion.id] === option}
                              onChange={() => handleAnswerChange(currentQuestion.id, option)}
                              className="sr-only"
                            />
                            <div className="flex items-center gap-3">
                              <div
                                className={`
                                flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold
                                ${
                                  answers[currentQuestion.id] === option
                                    ? "bg-white text-gray-800"
                                    : "bg-white text-gray-600 border border-gray-300"
                                }
                              `}
                              >
                                {String.fromCharCode(65 + optIndex)}
                              </div>
                              <span className="font-medium">{option}</span>
                            </div>
                          </label>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="flex justify-center items-center py-8">
                      <div className="text-center text-gray-500">
                        <p>No options available for this question.</p>
                        <p className="text-sm mt-2">Please contact your teacher.</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 flex justify-between">
            {currentQuestionIndex > 0 && (
              <button
                onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
                className="flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 font-medium rounded-full shadow-md hover:shadow-lg transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                Previous Question
              </button>
            )}

            <div className="flex-grow"></div>

            <button
              onClick={handleSubmit}
              disabled={submitting}
              className={`
                inline-flex items-center gap-2 px-8 py-3 font-medium rounded-full shadow-lg 
                transition-all transform hover:-translate-y-1
                ${
                  submitting
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-xl"
                }
              `}
            >
              {submitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <Check className="w-5 h-5" />
                  Submit Test
                </>
              )}
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default Test
