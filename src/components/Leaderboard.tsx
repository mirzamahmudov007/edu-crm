import React, { useState, useEffect } from 'react';
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
    Chip,
} from '@mui/material';
import { EmojiEvents as TrophyIcon } from '@mui/icons-material';

interface LeaderboardEntry {
    studentId: number;
    studentName: string;
    totalTests: number;
    averageScore: number;
    highestScore: number;
    completedTests: number;
}

const Leaderboard: React.FC = () => {
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const response = await testResultService.getStudentResults();
                const results = response.data;

                // Process results to create leaderboard entries
                const studentMap = new Map<number, LeaderboardEntry>();

                results.forEach((result: any) => {
                    const studentId = result.student.id;
                    const studentName = result.student.fullName;
                    const score = (result.score / result.totalQuestions) * 100;

                    if (!studentMap.has(studentId)) {
                        studentMap.set(studentId, {
                            studentId,
                            studentName,
                            totalTests: 1,
                            averageScore: score,
                            highestScore: score,
                            completedTests: result.submissionTime ? 1 : 0,
                        });
                    } else {
                        const entry = studentMap.get(studentId)!;
                        entry.totalTests++;
                        entry.averageScore = (entry.averageScore * (entry.totalTests - 1) + score) / entry.totalTests;
                        entry.highestScore = Math.max(entry.highestScore, score);
                        if (result.submissionTime) {
                            entry.completedTests++;
                        }
                    }
                });

                // Convert map to array and sort by average score
                const leaderboardArray = Array.from(studentMap.values()).sort(
                    (a, b) => b.averageScore - a.averageScore
                );

                setLeaderboard(leaderboardArray);
            } catch (err) {
                setError('Failed to load leaderboard. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboard();
    }, []);

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

    return (
        <Box p={3}>
            <Box display="flex" alignItems="center" mb={3}>
                <TrophyIcon sx={{ fontSize: 32, mr: 1, color: 'gold' }} />
                <Typography variant="h5">Leaderboard</Typography>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Rank</TableCell>
                            <TableCell>Student</TableCell>
                            <TableCell align="right">Average Score</TableCell>
                            <TableCell align="right">Highest Score</TableCell>
                            <TableCell align="right">Completed Tests</TableCell>
                            <TableCell align="right">Total Tests</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {leaderboard.map((entry, index) => (
                            <TableRow key={entry.studentId}>
                                <TableCell>
                                    {index < 3 ? (
                                        <Chip
                                            label={`#${index + 1}`}
                                            color={
                                                index === 0
                                                    ? 'warning'
                                                    : index === 1
                                                    ? 'default'
                                                    : 'primary'
                                            }
                                            size="small"
                                        />
                                    ) : (
                                        `#${index + 1}`
                                    )}
                                </TableCell>
                                <TableCell>{entry.studentName}</TableCell>
                                <TableCell align="right">
                                    {entry.averageScore.toFixed(1)}%
                                </TableCell>
                                <TableCell align="right">
                                    {entry.highestScore.toFixed(1)}%
                                </TableCell>
                                <TableCell align="right">{entry.completedTests}</TableCell>
                                <TableCell align="right">{entry.totalTests}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default Leaderboard; 