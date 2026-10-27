import api from './api';

export const courseService = {
  getCourses: async (params = {}) => {
    const res = await api.get('/courses', { params });
    return res.data;
  },
  getCourseById: async (id) => {
    const res = await api.get(`/courses/${id}`);
    return res.data;
  },
  createCourse: async (courseData) => {
    const res = await api.post('/courses', courseData);
    return res.data;
  },
  updateCourse: async (id, courseData) => {
    const res = await api.put(`/courses/${id}`, courseData);
    return res.data;
  },
  deleteCourse: async (id) => {
    const res = await api.delete(`/courses/${id}`);
    return res.data;
  },
  enroll: async (id) => {
    const res = await api.post(`/courses/${id}/enroll`);
    return res.data;
  },
  drop: async (id) => {
    const res = await api.post(`/courses/${id}/drop`);
    return res.data;
  },
  getCourseStudents: async (id) => {
    const res = await api.get(`/courses/${id}/students`);
    return res.data;
  }
};

export const assignmentService = {
  getByCourse: async (courseId) => {
    const res = await api.get(`/assignments/course/${courseId}`);
    return res.data;
  },
  getById: async (id) => {
    const res = await api.get(`/assignments/${id}`);
    return res.data;
  },
  create: async (data) => {
    const res = await api.post('/assignments', data);
    return res.data;
  },
  update: async (id, data) => {
    const res = await api.put(`/assignments/${id}`, data);
    return res.data;
  },
  delete: async (id) => {
    const res = await api.delete(`/assignments/${id}`);
    return res.data;
  },
  submit: async (submissionData) => {
    const res = await api.post('/submissions', submissionData);
    return res.data;
  },
  getSubmissions: async (assignmentId) => {
    const res = await api.get(`/submissions/assignment/${assignmentId}`);
    return res.data;
  },
  gradeSubmission: async (id, gradeData) => {
    const res = await api.put(`/submissions/${id}/grade`, gradeData);
    return res.data;
  }
};

export const quizService = {
  getByCourse: async (courseId) => {
    const res = await api.get(`/quizzes/course/${courseId}`);
    return res.data;
  },
  getById: async (id) => {
    const res = await api.get(`/quizzes/${id}`);
    return res.data;
  },
  create: async (data) => {
    const res = await api.post('/quizzes', data);
    return res.data;
  },
  submitAttempt: async (id, attemptData) => {
    const res = await api.post(`/quizzes/${id}/submit`, attemptData);
    return res.data;
  },
  getResults: async (id) => {
    const res = await api.get(`/quizzes/${id}/results`);
    return res.data;
  }
};

export const attendanceService = {
  getCourseAttendance: async (courseId) => {
    const res = await api.get(`/attendance/course/${courseId}`);
    return res.data;
  },
  saveSession: async (data) => {
    const res = await api.post('/attendance/session', data);
    return res.data;
  },
  getMySummary: async () => {
    const res = await api.get('/attendance/my-summary');
    return res.data;
  }
};

export const discussionService = {
  getTopics: async (params = {}) => {
    const res = await api.get('/discussions', { params });
    return res.data;
  },
  getById: async (id) => {
    const res = await api.get(`/discussions/${id}`);
    return res.data;
  },
  createTopic: async (data) => {
    const res = await api.post('/discussions', data);
    return res.data;
  },
  reply: async (id, data) => {
    const res = await api.post(`/discussions/${id}/reply`, data);
    return res.data;
  },
  endorseReply: async (id, replyId) => {
    const res = await api.put(`/discussions/${id}/endorse/${replyId}`);
    return res.data;
  },
  upvote: async (id) => {
    const res = await api.post(`/discussions/${id}/upvote`);
    return res.data;
  }
};

export const notificationService = {
  getMyNotifications: async () => {
    const res = await api.get('/notifications');
    return res.data;
  },
  markRead: async (id) => {
    const res = await api.put(`/notifications/${id}/read`);
    return res.data;
  },
  markAllRead: async () => {
    const res = await api.put('/notifications/read-all');
    return res.data;
  },
  delete: async (id) => {
    const res = await api.delete(`/notifications/${id}`);
    return res.data;
  }
};

export const analyticsService = {
  getStudentAnalytics: async () => {
    const res = await api.get('/analytics/student');
    return res.data;
  },
  getFacultyAnalytics: async () => {
    const res = await api.get('/analytics/faculty');
    return res.data;
  },
  getAdminAnalytics: async () => {
    const res = await api.get('/analytics/admin');
    return res.data;
  }
};

export const userService = {
  getUsers: async (params = {}) => {
    const res = await api.get('/users', { params });
    return res.data;
  },
  getFacultyList: async () => {
    const res = await api.get('/users/faculty-list');
    return res.data;
  },
  createUser: async (data) => {
    const res = await api.post('/users', data);
    return res.data;
  },
  updateUser: async (id, data) => {
    const res = await api.put(`/users/${id}`, data);
    return res.data;
  },
  deleteUser: async (id) => {
    const res = await api.delete(`/users/${id}`);
    return res.data;
  }
};
