import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { testResultService } from '../services/api';
import {
    Box,
    Typography,
    CircularProgress,
    Alert,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
} from '@mui/material';
import { Download as DownloadIcon } from '@mui/icons-material';

interface TestResult {
    id: number;
    test: {
        id: number;
        title: string;
        description: string;
    };
    student: {
        id: number;
        username: string;
        fullName: string;
    };
    score: number;
    totalQuestions: number;
    submissionTime: string;
    answers: {
        questionId: number;
        questionText: string;
        selectedOption: number;
        correctOption: number;
        options: string[];
    }[];
}

const TestResultDetails: React.FC = () => {
    const { testAccessId } = useParams<{ testAccessId: string }>();
    const [result, setResult] = useState<TestResult | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchResult = async () => {
            try {
                const response = await testResultService.getTestResult(testAccessId!);
                setResult(response.data);
            } catch (err) {
                setError('Failed to load test result. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchResult();
    }, [testAccessId]);

    const handleDownload = async () => {
        try {
            const response = await testResultService.exportStudentTestToWord(testAccessId!);
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `test_result_${testAccessId}.docx`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            setError('Failed to download test result. Please try again.');
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

    if (!result) {
        return (
            <Box p={3}>
                <Alert severity="warning">No test result found.</Alert>
            </Box>
        );
    }

    const score = (result.score / result.totalQuestions) * 100;

    return (
        <Box p={3}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h5">{result.test.title}</Typography>
                <Button
                    variant="contained"
                    startIcon={<DownloadIcon />}
                    onClick={handleDownload}
                >
                    Download Result
                </Button>
            </Box>

            <Box mb={3}>
                <Typography variant="body1" gutterBottom>
                    Student: {result.student.fullName}
                </Typography>
                <Typography variant="body1" gutterBottom>
                    Submission Time: {new Date(result.submissionTime).toLocaleString()}
                </Typography>
                <Typography variant="h6" color={score >= 60 ? 'success.main' : 'error.main'}>
                    Score: {score.toFixed(1)}%
                </Typography>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Question</TableCell>
                            <TableCell>Your Answer</TableCell>
                            <TableCell>Correct Answer</TableCell>
                            <TableCell>Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {result.answers.map((answer) => (
                            <TableRow key={answer.questionId}>
                                <TableCell>{answer.questionText}</TableCell>
                                <TableCell>{answer.options[answer.selectedOption]}</TableCell>
                                <TableCell>{answer.options[answer.correctOption]}</TableCell>
                                <TableCell>
                                    <Typography
                                        color={
                                            answer.selectedOption === answer.correctOption
                                                ? 'success.main'
                                                : 'error.main'
                                        }
                                    >
                                        {answer.selectedOption === answer.correctOption
                                            ? 'Correct'
                                            : 'Incorrect'}
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default TestResultDetails; 