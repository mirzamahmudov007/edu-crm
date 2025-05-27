import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://api.lms.itechacademy.uz/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor for adding auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for handling errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const authService = {
    login: (credentials: { username: string; password: string }) =>
        api.post('/auth/login', credentials),
    register: (userData: any) => api.post('/auth/register', userData),
    logout: () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
    },
};

export const testService = {
    createTest: (testData: any) => api.post('/tests', testData),
    getTeacherTests: () => api.get('/tests/teacher'),
    getGroupTests: (groupId: number) => api.get(`/tests/group/${groupId}`),
    getStudentTests: () => api.get('/tests/student'),
    getTestByAccessId: (testAccessId: string) => api.get(`/tests/access/${testAccessId}`),
    getAllTests: (params?: { groupId?: number; teacherId?: number; status?: string }) =>
        api.get('/tests/admin', { params }),
    exportTestToWord: (testId: number) =>
        api.get(`/tests/export/${testId}/word`, { responseType: 'blob' }),
    exportStudentTestToWord: (testAccessId: string) =>
        api.get(`/tests/student/export/${testAccessId}/word`, { responseType: 'blob' }),
};

export const groupService = {
    createGroup: (groupData: any) => api.post('/groups', groupData),
    getTeacherGroups: () => api.get('/groups/teacher'),
    getGroupById: (groupId: number) => api.get(`/groups/${groupId}`),
    updateGroup: (groupId: number, groupData: any) => api.put(`/groups/${groupId}`, groupData),
    deleteGroup: (groupId: number) => api.delete(`/groups/${groupId}`),
};

export const questionService = {
    createQuestion: (questionData: any) => api.post('/questions', questionData),
    getQuestionsByTest: (testId: number) => api.get(`/questions/test/${testId}`),
    updateQuestion: (questionId: number, questionData: any) =>
        api.put(`/questions/${questionId}`, questionData),
    deleteQuestion: (questionId: number) => api.delete(`/questions/${questionId}`),
};

export const testResultService = {
    submitTest: (testAccessId: string, answers: any) =>
        api.post(`/test-results/${testAccessId}/submit`, answers),
    getTestResult: (testAccessId: string) => api.get(`/test-results/${testAccessId}`),
    getStudentResults: () => api.get('/test-results/student'),
    getTeacherResults: (testId: number) => api.get(`/test-results/test/${testId}`),
    exportStudentTestToWord: (testAccessId: string) =>
        api.get(`/tests/student/export/${testAccessId}/word`, { responseType: 'blob' }),
};

export const adminService = {
    getStats: () => api.get('/admin/stats'),
};

export default api; 