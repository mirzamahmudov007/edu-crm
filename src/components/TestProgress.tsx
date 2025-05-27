import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { testService, testResultService } from '../services/api';
import { CircularProgress, Typography, Box, Button, Alert } from '@mui/material';

interface Test {
    id: number;
    title: string;
    description: string;
    startTime: string;
    endTime: string;
    totalQuestions: number;
}

interface Question {
    id: number;
    text: string;
    options: string[];
    correctOption: number;
}

const TestProgress: React.FC = () => {
    const { testAccessId } = useParams<{ testAccessId: string }>();
    const navigate = useNavigate();
    const [test, setTest] = useState<Test | null>(null);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState<number[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [timeLeft, setTimeLeft] = useState<number>(0);

    useEffect(() => {
        const fetchTest = async () => {
            try {
                const response = await testService.getTestByAccessId(testAccessId!);
                setTest(response.data);
                setQuestions(response.data.questions);
                setAnswers(new Array(response.data.questions.length).fill(-1));
                
                // Calculate time left
                const endTime = new Date(response.data.endTime).getTime();
                const now = new Date().getTime();
                setTimeLeft(Math.max(0, Math.floor((endTime - now) / 1000)));
            } catch (err) {
                setError('Failed to load test. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchTest();
    }, [testAccessId]);

    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        handleSubmit();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [timeLeft]);

    const handleAnswer = (optionIndex: number) => {
        const newAnswers = [...answers];
        newAnswers[currentQuestion] = optionIndex;
        setAnswers(newAnswers);
    };

    const handleNext = () => {
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        }
    };

    const handlePrevious = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1);
        }
    };

    const handleSubmit = async () => {
        try {
            await testResultService.submitTest(testAccessId!, answers);
            navigate(`/test-results/${testAccessId}`);
        } catch (err) {
            setError('Failed to submit test. Please try again.');
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box p={3}>
                <Alert severity="error">{error}</Alert>
            </Box>
        );
    }

    if (!test || questions.length === 0) {
        return (
            <Box p={3}>
                <Alert severity="warning">No test found.</Alert>
            </Box>
        );
    }

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    return (
        <Box p={3}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h5">{test.title}</Typography>
                <Typography variant="h6" color="error">
                    Time Left: {formatTime(timeLeft)}
                </Typography>
            </Box>

            <Box mb={3}>
                <Typography variant="body1">
                    Question {currentQuestion + 1} of {questions.length}
                </Typography>
                <Typography variant="h6" mt={2}>
                    {questions[currentQuestion].text}
                </Typography>
            </Box>

            <Box mb={3}>
                {questions[currentQuestion].options.map((option, index) => (
                    <Button
                        key={index}
                        variant={answers[currentQuestion] === index ? 'contained' : 'outlined'}
                        fullWidth
                        onClick={() => handleAnswer(index)}
                        sx={{ mb: 1, justifyContent: 'flex-start' }}
                    >
                        {option}
                    </Button>
                ))}
            </Box>

            <Box display="flex" justifyContent="space-between">
                <Button
                    variant="contained"
                    onClick={handlePrevious}
                    disabled={currentQuestion === 0}
                >
                    Previous
                </Button>
                {currentQuestion === questions.length - 1 ? (
                    <Button variant="contained" color="primary" onClick={handleSubmit}>
                        Submit
                    </Button>
                ) : (
                    <Button variant="contained" onClick={handleNext}>
                        Next
                    </Button>
                )}
            </Box>
        </Box>
    );
};

export default TestProgress; 