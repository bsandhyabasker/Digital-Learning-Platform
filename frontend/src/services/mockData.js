// Interactive Mock Dataset & API Simulator for EduPulse Digital Learning Platform
// Enables seamless live demonstration on static hosts (GitHub Pages) and offline environments.

const defaultUsers = [
  {
    _id: 'usr_student_1',
    name: 'Liam Bennett',
    email: 'student@edupulse.edu',
    role: 'student',
    department: 'Computer Science',
    bio: 'Final year CS major focused on distributed systems and reactive cloud architectures.',
    studentId: 'STU-8821',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=256&q=80',
    phone: '+1 (555) 678-9012'
  },
  {
    _id: 'usr_faculty_1',
    name: 'Prof. Alexander Vance',
    email: 'faculty@edupulse.edu',
    role: 'faculty',
    department: 'Computer Science',
    bio: 'Distinguished Professor in Distributed Computing, Microservices, and Large-Scale Systems.',
    employeeId: 'FAC-3012',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80',
    phone: '+1 (555) 345-6789'
  },
  {
    _id: 'usr_faculty_2',
    name: 'Dr. Elena Rostova',
    email: 'elena.rostova@edupulse.edu',
    role: 'faculty',
    department: 'Software Engineering',
    bio: 'Lead Instructor for Advanced Full-Stack Systems, React Ecosystems, and Cloud Architecture.',
    employeeId: 'FAC-3045',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=256&q=80',
    phone: '+1 (555) 456-7890'
  },
  {
    _id: 'usr_admin_1',
    name: 'Dr. Sarah Jenkins',
    email: 'admin@edupulse.edu',
    role: 'admin',
    department: 'Office of Academic Affairs',
    bio: 'Chief Academic Technology Officer overseeing institutional quality and digital curricula.',
    employeeId: 'ADM-1001',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80',
    phone: '+1 (555) 234-5670'
  },
  {
    _id: 'usr_student_2',
    name: 'Maya Patel',
    email: 'maya.patel@edupulse.edu',
    role: 'student',
    department: 'Software Engineering',
    bio: 'Software engineer in training, passionate about UI design systems and state engines.',
    studentId: 'STU-8834',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=256&q=80',
    phone: '+1 (555) 789-0123'
  },
  {
    _id: 'usr_student_3',
    name: 'David Kim',
    email: 'david.kim@edupulse.edu',
    role: 'student',
    department: 'Computer Science',
    bio: 'Junior undergraduate exploring full stack development and cloud infrastructure.',
    studentId: 'STU-8847',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
    phone: '+1 (555) 890-1234'
  }
];

const defaultCourses = [
  {
    _id: 'crs_1',
    courseCode: 'CS-501',
    title: 'Distributed Systems & Cloud Microservices',
    description: 'Deep dive into consensus protocols, event-driven architectures, RPC mechanisms, fault tolerance, and scalable cloud microservice orchestrations.',
    category: 'Computer Science',
    facultyId: {
      _id: 'usr_faculty_1',
      name: 'Prof. Alexander Vance',
      email: 'faculty@edupulse.edu',
      department: 'Computer Science',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80'
    },
    thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
    capacity: 45,
    enrolledCount: 38,
    credits: 4,
    semester: 'Fall 2026',
    level: 'Advanced',
    status: 'published',
    syllabus: [
      { week: 1, topic: 'Introduction to Distributed Models & CAP Theorem', summary: 'Network partitions, consistency vs availability tradeoffs.' },
      { week: 2, topic: 'Consensus Protocols (Paxos & Raft)', summary: 'Leader election, log replication, and state machine replication.' },
      { week: 3, topic: 'gRPC, Protobuf & High-Throughput Messaging', summary: 'Binary serialization and streaming communication.' },
      { week: 4, topic: 'Distributed Transactions & 2PC / Sagas', summary: 'Compensating transactions in microservices.' }
    ],
    modules: [
      {
        title: 'Module 1: Foundations of Fault-Tolerant Systems',
        description: 'Core models of failure, synchrony assumptions, and clock drift synchronization.',
        order: 1,
        resources: [
          { title: 'Lecture 1: Distributed Architectures Deck', url: 'https://edupulse.edu/materials/cs501_mod1.pdf', type: 'pdf', duration: '45 mins' },
          { title: 'Lamport Timestamps & Vector Clocks Video', url: 'https://youtube.com/watch?v=sample1', type: 'video', duration: '32 mins' },
          { title: 'Sample Go Distributed Node Repository', url: 'https://github.com/edupulse/raft-node-starter', type: 'code', duration: '20 mins' }
        ]
      },
      {
        title: 'Module 2: Raft Consensus In-Depth',
        description: 'Practical leader election state machine and log compaction techniques.',
        order: 2,
        resources: [
          { title: 'Raft Paper Annotated Edition', url: 'https://edupulse.edu/materials/raft_annotated.pdf', type: 'pdf', duration: '50 mins' },
          { title: 'Interactive Raft Consensus Visualizer', url: 'https://raft.github.io', type: 'link', duration: '15 mins' }
        ]
      }
    ]
  },
  {
    _id: 'crs_2',
    courseCode: 'CS-402',
    title: 'Modern Full-Stack Web Engineering & React',
    description: 'Mastery of the modern full-stack web stack: React 19 architecture, asynchronous state engines, high-speed Express APIs, MongoDB aggregations, and enterprise JWT security.',
    category: 'Software Engineering',
    facultyId: {
      _id: 'usr_faculty_2',
      name: 'Dr. Elena Rostova',
      email: 'elena.rostova@edupulse.edu',
      department: 'Software Engineering',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=256&q=80'
    },
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=800&q=80',
    capacity: 60,
    enrolledCount: 54,
    credits: 4,
    semester: 'Fall 2026',
    level: 'Intermediate',
    status: 'published',
    syllabus: [
      { week: 1, topic: 'Modern JavaScript (ESNext) & React Core', summary: 'Virtual DOM, reconciler, hooks, and clean components.' },
      { week: 2, topic: 'State Architecture & Context API', summary: 'Global state management patterns, reducers, and custom hooks.' },
      { week: 3, topic: 'RESTful API Engineering with Express & Node', summary: 'Routing, middleware pipelines, error controllers, and validation.' },
      { week: 4, topic: 'NoSQL Data Modeling with MongoDB & Mongoose', summary: 'Indexes, aggregation pipelines, schema validation, and transactions.' }
    ],
    modules: [
      {
        title: 'Module 1: Component Composition & State Engines',
        description: 'Designing resilient frontend architecture with TypeScript and React hooks.',
        order: 1,
        resources: [
          { title: 'React Performance Guide 2026', url: 'https://edupulse.edu/materials/react_perf.pdf', type: 'pdf', duration: '40 mins' },
          { title: 'Building Custom State Hook Masterclass', url: 'https://youtube.com/watch?v=sample2', type: 'video', duration: '28 mins' }
        ]
      }
    ]
  },
  {
    _id: 'crs_3',
    courseCode: 'SEC-601',
    title: 'Enterprise Cyber Defense & Zero-Trust Architecture',
    description: 'Comprehensive study of modern perimeter-less cybersecurity, identity assertion, token signatures, and API penetration defenses.',
    category: 'Cybersecurity',
    facultyId: {
      _id: 'usr_faculty_1',
      name: 'Prof. Alexander Vance',
      email: 'faculty@edupulse.edu',
      department: 'Computer Science',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80'
    },
    thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80',
    capacity: 40,
    enrolledCount: 31,
    credits: 3,
    semester: 'Fall 2026',
    level: 'Advanced',
    status: 'published',
    syllabus: [
      { week: 1, topic: 'Zero Trust Network Principles & OAuth2 / OIDC', summary: 'Identity assertion and token introspection.' },
      { week: 2, topic: 'Cryptographic Primitives & TLS 1.3 Internals', summary: 'Cipher suites, handshake acceleration, and forward secrecy.' }
    ],
    modules: []
  }
];

const defaultAssignments = [
  {
    _id: 'asg_1',
    title: 'Raft Consensus State Machine Implementation',
    description: 'Construct a multi-node Raft consensus cluster in Go or Node.js supporting leader election, heartbeats, and safe log replication under simulated network partitions.',
    courseId: defaultCourses[0],
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    totalPoints: 100,
    rubric: [
      { criteria: 'Leader Election State Machine', points: 30 },
      { criteria: 'Log Replication & Consistency Check', points: 40 },
      { criteria: 'Network Partition Resiliency Tests', points: 30 }
    ],
    status: 'published',
    submission: {
      _id: 'sub_1',
      studentId: 'usr_student_1',
      content: 'Cluster implementation with 5 virtual nodes passing all partition and log compaction stress tests.',
      fileUrl: 'https://github.com/liambennett/raft-consensus-lab',
      status: 'graded',
      grade: 96,
      feedback: 'Outstanding implementation! Clean timer resets and election timeout jitter.',
      submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    }
  },
  {
    _id: 'asg_2',
    title: 'Full-Stack MERN Architecture with JWT Authentication',
    description: 'Build a production-ready application featuring role-based access control, reactive data visualization, secure cookie/bearer tokens, and MongoDB aggregation.',
    courseId: defaultCourses[1],
    dueDate: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000).toISOString(),
    totalPoints: 100,
    rubric: [
      { criteria: 'Backend REST API & Middleware Pipeline', points: 40 },
      { criteria: 'Responsive Modern React UI', points: 35 },
      { criteria: 'Security & Token Validation', points: 25 }
    ],
    status: 'published',
    submission: {
      _id: 'sub_2',
      studentId: 'usr_student_1',
      content: 'Deployed learning platform interface with full role management.',
      fileUrl: 'https://github.com/liambennett/mern-edu-platform',
      status: 'submitted',
      submittedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
    }
  }
];

const defaultQuizzes = [
  {
    _id: 'qz_1',
    title: 'Distributed Systems & Consensus Midterm',
    courseId: defaultCourses[0],
    timeLimitMinutes: 30,
    passingScore: 70,
    status: 'published',
    questions: [
      {
        _id: 'q1',
        prompt: 'In the Raft consensus algorithm, what prevents split votes during leader election?',
        options: ['Randomized election timeouts', 'Synchronized hardware clocks', 'Token ring circulation', 'Centralized coordinator arbitration'],
        correctIndex: 0,
        explanation: 'Randomized election timeouts disperse election starts across candidates, preventing split votes.'
      },
      {
        _id: 'q2',
        prompt: 'Which condition in the CAP theorem asserts that every non-failing node returns a non-error response for every request?',
        options: ['Consistency', 'Availability', 'Partition Tolerance', 'Serializability'],
        correctIndex: 1,
        explanation: 'Availability requires that every non-failing node must return a response (without guarantee of having latest write).'
      },
      {
        _id: 'q3',
        prompt: 'What serialization format does gRPC utilize by default to achieve high throughput and low latency?',
        options: ['JSON Schema', 'Protocol Buffers (Protobuf)', 'MessagePack', 'XML-RPC'],
        correctIndex: 1,
        explanation: 'Protocol Buffers provide compact binary wire format and typed schemas.'
      }
    ],
    lastAttempt: {
      score: 100,
      totalQuestions: 3,
      percentage: 100,
      passed: true,
      completedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
    }
  },
  {
    _id: 'qz_2',
    title: 'React 19 & Concurrent Rendering Assessment',
    courseId: defaultCourses[1],
    timeLimitMinutes: 20,
    passingScore: 70,
    status: 'published',
    questions: [
      {
        _id: 'q2_1',
        prompt: 'What does React Suspense allow components to do during asynchronous operations?',
        options: ['Render a fallback UI while data or components load', 'Bypass the virtual DOM reconciliation', 'Run background service workers', 'Block main thread until network returns'],
        correctIndex: 0,
        explanation: 'Suspense allows declarative fallbacks while lazy components or data promises resolve.'
      },
      {
        _id: 'q2_2',
        prompt: 'Which hook is recommended for handling side effects that synchronize with external systems?',
        options: ['useEffect', 'useMemo', 'useRef', 'useCallback'],
        correctIndex: 0,
        explanation: 'useEffect synchronizes state with external network, DOM, or subscription systems.'
      }
    ],
    lastAttempt: null
  }
];

const defaultAttendanceSummary = {
  overallAttendance: 94,
  totalSessions: 18,
  attendedSessions: 17,
  courses: [
    {
      courseId: defaultCourses[0]._id,
      courseCode: defaultCourses[0].courseCode,
      courseTitle: defaultCourses[0].title,
      totalSessions: 10,
      attended: 10,
      percentage: 100,
      status: 'excellent'
    },
    {
      courseId: defaultCourses[1]._id,
      courseCode: defaultCourses[1].courseCode,
      courseTitle: defaultCourses[1].title,
      totalSessions: 8,
      attended: 7,
      percentage: 88,
      status: 'good'
    }
  ]
};

const defaultDiscussions = [
  {
    _id: 'disc_1',
    title: 'Optimizing Log Compaction with Snapshots in Raft Nodes',
    content: 'When writing state machine snapshots to disk, how do you prevent blocking ongoing client write requests during memory serialization?',
    courseId: defaultCourses[0],
    author: defaultUsers[0],
    upvotes: 14,
    tags: ['Raft', 'Storage', 'Optimization'],
    createdAt: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(),
    replies: [
      {
        _id: 'rep_1',
        author: defaultUsers[1], // Prof Vance
        content: 'Great question Liam. Most production systems employ Copy-on-Write (fork-based) snapshots or immutable append-only LSM trees like RocksDB so the live engine writes uninterrupted.',
        isEndorsed: true,
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      }
    ]
  },
  {
    _id: 'disc_2',
    title: 'Comparing Server Actions vs Traditional REST Endpoints in Full Stack Apps',
    content: 'What are the main tradeoffs regarding caching, error tracing, and separation of concerns when choosing Server Actions over express routes?',
    courseId: defaultCourses[1],
    author: defaultUsers[4], // Maya Patel
    upvotes: 9,
    tags: ['React', 'FullStack', 'Architecture'],
    createdAt: new Date(Date.now() - 14 * 60 * 60 * 1000).toISOString(),
    replies: []
  }
];

const defaultNotifications = [
  {
    _id: 'notif_1',
    title: 'Assignment Graded',
    message: 'Your submission for "Raft Consensus State Machine Implementation" was graded: 96/100.',
    type: 'success',
    isRead: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: 'notif_2',
    title: 'Upcoming Assessment',
    message: 'React 19 & Concurrent Rendering Assessment closes in 3 days.',
    type: 'warning',
    isRead: false,
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: 'notif_3',
    title: 'New Syllabus Material',
    message: 'Prof. Vance uploaded "Module 2: Raft Consensus In-Depth" study slides.',
    type: 'info',
    isRead: true,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  }
];

// Helper to get or initialize state in memory
class MockDatabase {
  constructor() {
    this.users = [...defaultUsers];
    this.courses = [...defaultCourses];
    this.assignments = [...defaultAssignments];
    this.quizzes = [...defaultQuizzes];
    this.discussions = [...defaultDiscussions];
    this.notifications = [...defaultNotifications];
    this.attendance = { ...defaultAttendanceSummary };
  }

  findUserByEmail(email) {
    return this.users.find((u) => u.email.toLowerCase() === (email || '').trim().toLowerCase());
  }

  getCurrentUser() {
    try {
      const stored = localStorage.getItem('edupulse_user');
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return this.users[0]; // Liam Bennett (Student) default
  }
}

export const mockDb = new MockDatabase();

export const isMockMode = () => {
  if (typeof window === 'undefined') return false;
  return (
    window.location.hostname.includes('github.io') ||
    window.location.hostname.includes('vercel.app') ||
    window.location.hostname.includes('netlify.app') ||
    localStorage.getItem('edupulse_mock_mode') === 'true'
  );
};

export const handleMockRequest = async (config) => {
  const url = config.url || '';
  const method = (config.method || 'GET').toUpperCase();
  const cleanUrl = url.replace(/^\/?api\/?/, '/');

  // Artificial short realistic latency
  await new Promise((r) => setTimeout(r, 60));

  // --- AUTHENTICATION ---
  if (cleanUrl.startsWith('/auth/login') && method === 'POST') {
    let body = {};
    try {
      body = typeof config.data === 'string' ? JSON.parse(config.data) : config.data || {};
    } catch (e) {}

    const email = (body.email || '').trim().toLowerCase();
    let user = mockDb.findUserByEmail(email);

    // If user typed custom credentials or demo, map sensibly
    if (!user) {
      if (email.includes('admin')) {
        user = mockDb.users.find((u) => u.role === 'admin') || mockDb.users[3];
      } else if (email.includes('fac') || email.includes('prof') || email.includes('teach')) {
        user = mockDb.users.find((u) => u.role === 'faculty') || mockDb.users[1];
      } else {
        user = mockDb.users.find((u) => u.role === 'student') || mockDb.users[0];
      }
    }

    return {
      status: 200,
      data: {
        success: true,
        token: 'mock_jwt_token_' + user._id + '_' + Date.now(),
        user
      }
    };
  }

  if (cleanUrl.startsWith('/auth/me')) {
    const user = mockDb.getCurrentUser();
    return {
      status: 200,
      data: {
        success: true,
        user
      }
    };
  }

  if (cleanUrl.startsWith('/auth/profile') && method === 'PUT') {
    let body = {};
    try {
      body = typeof config.data === 'string' ? JSON.parse(config.data) : config.data || {};
    } catch (e) {}
    const cur = mockDb.getCurrentUser();
    const updated = { ...cur, ...body };
    localStorage.setItem('edupulse_user', JSON.stringify(updated));
    return {
      status: 200,
      data: { success: true, user: updated }
    };
  }

  // --- ANALYTICS ---
  if (cleanUrl.startsWith('/analytics/student')) {
    return {
      status: 200,
      data: {
        success: true,
        summary: {
          enrolledCoursesCount: 3,
          gpa: '3.86',
          overallProgress: 78,
          overallAttendance: 94,
          assignmentAverage: 96,
          quizAverage: 92,
          totalSubmissions: 4,
          totalAssigned: 5,
          quizPassRate: 100
        },
        radarData: [
          { courseTitle: 'Distributed Systems & Cloud Microservices', courseCode: 'CS-501', assignments: 96, quizzes: 100, attendance: 100, overall: 98 },
          { courseTitle: 'Modern Full-Stack Web Engineering', courseCode: 'CS-402', assignments: 94, quizzes: 88, attendance: 88, overall: 90 },
          { courseTitle: 'Enterprise Cyber Defense & Zero-Trust', courseCode: 'SEC-601', assignments: 92, quizzes: 90, attendance: 95, overall: 92 }
        ],
        performanceByCourse: [
          {
            _id: 'perf_1',
            courseId: defaultCourses[0],
            overallScore: 98,
            riskStatus: 'good',
            quizAverage: 100,
            assignmentAverage: 96,
            attendancePercentage: 100
          },
          {
            _id: 'perf_2',
            courseId: defaultCourses[1],
            overallScore: 90,
            riskStatus: 'good',
            quizAverage: 88,
            assignmentAverage: 94,
            attendancePercentage: 88
          }
        ],
        recentSubmissions: defaultAssignments.map((a) => a.submission).filter(Boolean),
        recentQuizzes: [
          {
            _id: 'atmp_1',
            quizId: defaultQuizzes[0],
            courseId: defaultCourses[0],
            percentage: 100,
            passed: true,
            submittedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
          }
        ]
      }
    };
  }

  if (cleanUrl.startsWith('/analytics/faculty')) {
    return {
      status: 200,
      data: {
        success: true,
        summary: {
          totalCourses: mockDb.courses.length,
          totalStudents: 123,
          pendingGradingCount: 3,
          classAverage: 86,
          atRiskCount: 2
        },
        gradeDistribution: [
          { grade: 'Grade A (90-100%)', count: 48 },
          { grade: 'Grade B (80-89%)', count: 42 },
          { grade: 'Grade C (70-79%)', count: 21 },
          { grade: 'Grade D (60-69%)', count: 8 },
          { grade: 'Grade F (<60%)', count: 4 }
        ],
        atRiskStudents: [
          {
            _id: 'risk_1',
            studentId: { name: 'Jordan Bell', email: 'jordan.bell@edupulse.edu', studentId: 'STU-9011' },
            courseId: defaultCourses[0],
            overallScore: 58,
            attendancePercentage: 62,
            riskStatus: 'at_risk'
          },
          {
            _id: 'risk_2',
            studentId: { name: 'Samantha Wu', email: 'samantha.wu@edupulse.edu', studentId: 'STU-9018' },
            courseId: defaultCourses[1],
            overallScore: 64,
            attendancePercentage: 70,
            riskStatus: 'needs_attention'
          }
        ],
        pendingGradingQueue: [
          {
            _id: 'sub_pend_1',
            assignmentId: { title: 'Raft Consensus State Machine Implementation', dueDate: defaultAssignments[0].dueDate },
            studentId: { name: 'Maya Patel', email: 'maya.patel@edupulse.edu' },
            courseId: defaultCourses[0],
            submittedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
          }
        ],
        courseAnalytics: mockDb.courses.map((c) => ({
          courseId: c._id,
          courseCode: c.courseCode,
          title: c.title,
          category: c.category,
          capacity: c.capacity,
          studentCount: c.enrolledCount || 35,
          classAverage: 86,
          pendingGradingCount: 1
        }))
      }
    };
  }

  if (cleanUrl.startsWith('/analytics/admin')) {
    return {
      status: 200,
      data: {
        success: true,
        metrics: {
          totalUsers: 1420,
          studentCount: 1280,
          facultyCount: 115,
          totalCourses: 48,
          publishedCourses: 42,
          totalEnrollments: 3640,
          totalSubmissions: 8920,
          totalQuizzesTaken: 12450,
          totalDiscussions: 840,
          institutionalAverage: 86
        },
        departmentStats: [
          { _id: 'Computer Science', count: 520 },
          { _id: 'Software Engineering', count: 380 },
          { _id: 'Cybersecurity', count: 290 },
          { _id: 'Data Science & AI', count: 230 }
        ],
        topCourses: mockDb.courses.map((c) => ({
          title: c.title,
          courseCode: c.courseCode,
          category: c.category,
          capacity: c.capacity,
          enrollments: c.enrolledCount || 40
        })),
        gradeDistribution: [
          { grade: 'Grade A (90-100%)', count: 420 },
          { grade: 'Grade B (80-89%)', count: 580 },
          { grade: 'Grade C (70-79%)', count: 280 },
          { grade: 'Grade D (60-69%)', count: 95 },
          { grade: 'Grade F (<60%)', count: 45 }
        ],
        recentUsers: mockDb.users.slice(0, 5)
      }
    };
  }

  // --- COURSES ---
  if (cleanUrl === '/courses' && method === 'GET') {
    return {
      status: 200,
      data: {
        success: true,
        count: mockDb.courses.length,
        courses: mockDb.courses
      }
    };
  }

  if (cleanUrl.match(/^\/courses\/([^/]+)$/) && method === 'GET') {
    const courseId = cleanUrl.split('/')[2];
    const course = mockDb.courses.find((c) => c._id === courseId) || mockDb.courses[0];
    return {
      status: 200,
      data: { success: true, course }
    };
  }

  if (cleanUrl === '/courses' && method === 'POST') {
    let body = {};
    try {
      body = typeof config.data === 'string' ? JSON.parse(config.data) : config.data || {};
    } catch (e) {}
    const newCourse = {
      _id: 'crs_' + Date.now(),
      ...body,
      facultyId: mockDb.getCurrentUser(),
      enrolledCount: 0,
      status: 'published',
      modules: body.modules || [],
      syllabus: body.syllabus || []
    };
    mockDb.courses.unshift(newCourse);
    return { status: 201, data: { success: true, course: newCourse } };
  }

  if (cleanUrl.match(/^\/courses\/([^/]+)\/enroll$/) && method === 'POST') {
    return { status: 200, data: { success: true, message: 'Successfully enrolled in course.' } };
  }

  if (cleanUrl.match(/^\/courses\/([^/]+)\/students$/) && method === 'GET') {
    return {
      status: 200,
      data: {
        success: true,
        students: mockDb.users.filter((u) => u.role === 'student')
      }
    };
  }

  // --- ASSIGNMENTS ---
  if (cleanUrl.startsWith('/assignments') && method === 'GET') {
    return {
      status: 200,
      data: {
        success: true,
        assignments: mockDb.assignments
      }
    };
  }

  if (cleanUrl === '/assignments' && method === 'POST') {
    let body = {};
    try {
      body = typeof config.data === 'string' ? JSON.parse(config.data) : config.data || {};
    } catch (e) {}
    const newAsg = {
      _id: 'asg_' + Date.now(),
      ...body,
      courseId: mockDb.courses.find((c) => c._id === body.courseId) || mockDb.courses[0],
      status: 'published'
    };
    mockDb.assignments.push(newAsg);
    return { status: 201, data: { success: true, assignment: newAsg } };
  }

  if (cleanUrl === '/submissions' && method === 'POST') {
    return {
      status: 201,
      data: {
        success: true,
        message: 'Assignment submitted successfully for evaluation.'
      }
    };
  }

  // --- QUIZZES ---
  if (cleanUrl.startsWith('/quizzes') && method === 'GET') {
    return {
      status: 200,
      data: {
        success: true,
        quizzes: mockDb.quizzes
      }
    };
  }

  if (cleanUrl.match(/^\/quizzes\/([^/]+)\/submit$/) && method === 'POST') {
    return {
      status: 200,
      data: {
        success: true,
        score: 100,
        percentage: 100,
        passed: true,
        message: 'Quiz submitted and evaluated successfully!'
      }
    };
  }

  // --- ATTENDANCE ---
  if (cleanUrl.startsWith('/attendance/my-summary')) {
    return {
      status: 200,
      data: {
        success: true,
        summary: mockDb.attendance
      }
    };
  }

  if (cleanUrl.startsWith('/attendance') && method === 'GET') {
    return {
      status: 200,
      data: {
        success: true,
        attendance: mockDb.attendance.courses
      }
    };
  }

  if (cleanUrl.startsWith('/attendance/session') && method === 'POST') {
    return {
      status: 200,
      data: {
        success: true,
        message: 'Class attendance recorded successfully.'
      }
    };
  }

  // --- DISCUSSIONS / FORUMS ---
  if (cleanUrl.startsWith('/discussions') && method === 'GET') {
    return {
      status: 200,
      data: {
        success: true,
        topics: mockDb.discussions
      }
    };
  }

  if (cleanUrl === '/discussions' && method === 'POST') {
    let body = {};
    try {
      body = typeof config.data === 'string' ? JSON.parse(config.data) : config.data || {};
    } catch (e) {}
    const newTopic = {
      _id: 'disc_' + Date.now(),
      ...body,
      author: mockDb.getCurrentUser(),
      upvotes: 1,
      createdAt: new Date().toISOString(),
      replies: []
    };
    mockDb.discussions.unshift(newTopic);
    return { status: 201, data: { success: true, topic: newTopic } };
  }

  // --- NOTIFICATIONS ---
  if (cleanUrl.startsWith('/notifications') && method === 'GET') {
    return {
      status: 200,
      data: {
        success: true,
        notifications: mockDb.notifications,
        unreadCount: mockDb.notifications.filter((n) => !n.isRead).length
      }
    };
  }

  if (cleanUrl.startsWith('/notifications/read-all')) {
    mockDb.notifications.forEach((n) => (n.isRead = true));
    return { status: 200, data: { success: true, message: 'All notifications marked read.' } };
  }

  // --- USERS (Admin) ---
  if (cleanUrl.startsWith('/users') && method === 'GET') {
    return {
      status: 200,
      data: {
        success: true,
        users: mockDb.users,
        total: mockDb.users.length
      }
    };
  }

  // Default fallback for any other request
  return {
    status: 200,
    data: {
      success: true,
      message: 'Operation processed successfully.'
    }
  };
};
