const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const User = require('../models/User');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const Assignment = require('../models/Assignment');
const Submission = require('../models/Submission');
const Quiz = require('../models/Quiz');
const QuizAttempt = require('../models/QuizAttempt');
const Attendance = require('../models/Attendance');
const DiscussionTopic = require('../models/DiscussionTopic');
const Notification = require('../models/Notification');
const Performance = require('../models/Performance');
const { users } = require('./seedData');

const seedDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/edupulse_db';
    console.log(`[Seeder] Connecting to ${mongoUri}...`);
    await mongoose.connect(mongoUri);

    console.log('[Seeder] Cleaning existing database records...');
    await Promise.all([
      User.deleteMany(),
      Course.deleteMany(),
      Enrollment.deleteMany(),
      Assignment.deleteMany(),
      Submission.deleteMany(),
      Quiz.deleteMany(),
      QuizAttempt.deleteMany(),
      Attendance.deleteMany(),
      DiscussionTopic.deleteMany(),
      Notification.deleteMany(),
      Performance.deleteMany()
    ]);

    console.log('[Seeder] Inserting Users...');
    const createdUsers = await User.insertMany(users);
    const adminUser = createdUsers.find((u) => u.email === 'admin@edupulse.edu');
    const profVance = createdUsers.find((u) => u.email === 'faculty@edupulse.edu');
    const drElena = createdUsers.find((u) => u.email === 'elena.rostova@edupulse.edu');
    const profChen = createdUsers.find((u) => u.email === 'marcus.chen@edupulse.edu');

    const liam = createdUsers.find((u) => u.email === 'student@edupulse.edu');
    const maya = createdUsers.find((u) => u.email === 'maya.patel@edupulse.edu');
    const david = createdUsers.find((u) => u.email === 'david.kim@edupulse.edu');
    const sophia = createdUsers.find((u) => u.email === 'sophia.rodriguez@edupulse.edu');

    console.log('[Seeder] Inserting Courses & Modules...');
    const coursesData = [
      {
        courseCode: 'CS-501',
        title: 'Distributed Systems & Cloud Microservices',
        description: 'Deep dive into consensus protocols, event-driven architectures, RPC mechanisms, fault tolerance, and scalable cloud microservice orchestrations.',
        category: 'Computer Science',
        facultyId: profVance._id,
        thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
        capacity: 45,
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
        courseCode: 'CS-402',
        title: 'Modern Full-Stack Web Engineering & React',
        description: 'Comprehensive mastery of the MERN ecosystem: modern React 19 architecture, asynchronous state engines, high-speed Express APIs, MongoDB aggregations, and enterprise JWT security.',
        category: 'Software Engineering',
        facultyId: drElena._id,
        thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=800&q=80',
        capacity: 60,
        credits: 4,
        semester: 'Fall 2026',
        level: 'Intermediate',
        status: 'published',
        syllabus: [
          { week: 1, topic: 'Modern React Architecture & Component Design Systems', summary: 'Component composition, hooks lifecycle, and design tokens.' },
          { week: 2, topic: 'State Management & Custom Hooks', summary: 'Context API optimization, reducer patterns, and data fetching hooks.' },
          { week: 3, topic: 'Express REST APIs & Middleware Security Pipelines', summary: 'JWT auth, role-based access control, and sanitization.' },
          { week: 4, topic: 'Advanced MongoDB Aggregations & Performance Indexing', summary: 'Facet pipelines, lookup joins, and compound indexes.' }
        ],
        modules: [
          {
            title: 'Module 1: Enterprise React Design Systems & Tokens',
            description: 'Building accessible, reusable UI component libraries from scratch.',
            order: 1,
            resources: [
              { title: 'Design Tokens & CSS Variables Masterclass', url: 'https://edupulse.edu/materials/react_design_systems.pdf', type: 'pdf', duration: '40 mins' },
              { title: 'Compound Components & Slot Patterns Video', url: 'https://youtube.com/watch?v=sample2', type: 'video', duration: '28 mins' }
            ]
          },
          {
            title: 'Module 2: Secure Backend Engineering with Express & MongoDB',
            description: 'Building hardened REST APIs with JWT authentication, bcrypt, and rate limiters.',
            order: 2,
            resources: [
              { title: 'API Security Checklist & RBAC Matrix', url: 'https://edupulse.edu/materials/api_security_matrix.pdf', type: 'pdf', duration: '25 mins' }
            ]
          }
        ]
      },
      {
        courseCode: 'SEC-305',
        title: 'Enterprise Threat Modeling & Cryptography',
        description: 'Applied modern cryptography, public-key infrastructure (PKI), OAuth 2.0 / OIDC protocol analysis, zero-trust network boundaries, and vulnerability triage.',
        category: 'Cybersecurity',
        facultyId: profChen._id,
        thumbnail: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80',
        capacity: 40,
        credits: 3,
        semester: 'Fall 2026',
        level: 'Intermediate',
        status: 'published',
        syllabus: [
          { week: 1, topic: 'Symmetric & Asymmetric Cryptographic Primitives', summary: 'AES-GCM, RSA, ECC, and digital signature algorithms.' },
          { week: 2, topic: 'Identity Protocols & Token Security', summary: 'OAuth 2.0 flows, JWT vulnerability mitigation, and refresh tokens.' },
          { week: 3, topic: 'Threat Modeling Methodologies (STRIDE)', summary: 'Asset classification, attack vectors, and mitigation matrices.' }
        ],
        modules: [
          {
            title: 'Module 1: Applied Symmetric & Asymmetric Encryption',
            description: 'Mathematical foundations of elliptic curve cryptography and Diffie-Hellman exchanges.',
            order: 1,
            resources: [
              { title: 'Crypto Primitives Cheatsheet', url: 'https://edupulse.edu/materials/crypto_cheatsheet.pdf', type: 'pdf', duration: '30 mins' }
            ]
          }
        ]
      }
    ];

    const createdCourses = await Course.insertMany(coursesData);
    const cs501 = createdCourses.find((c) => c.courseCode === 'CS-501');
    const cs402 = createdCourses.find((c) => c.courseCode === 'CS-402');
    const sec305 = createdCourses.find((c) => c.courseCode === 'SEC-305');

    console.log('[Seeder] Creating Student Enrollments...');
    const enrollmentsData = [
      { studentId: liam._id, courseId: cs501._id, progressPercent: 88, finalGrade: 94, letterGrade: 'A', status: 'active' },
      { studentId: liam._id, courseId: cs402._id, progressPercent: 92, finalGrade: 96, letterGrade: 'A', status: 'active' },
      { studentId: liam._id, courseId: sec305._id, progressPercent: 75, finalGrade: 89, letterGrade: 'B', status: 'active' },

      { studentId: maya._id, courseId: cs501._id, progressPercent: 78, finalGrade: 86, letterGrade: 'B', status: 'active' },
      { studentId: maya._id, courseId: cs402._id, progressPercent: 85, finalGrade: 91, letterGrade: 'A', status: 'active' },

      { studentId: david._id, courseId: cs501._id, progressPercent: 40, finalGrade: 58, letterGrade: 'F', status: 'active' },
      { studentId: david._id, courseId: cs402._id, progressPercent: 55, finalGrade: 68, letterGrade: 'D', status: 'active' },

      { studentId: sophia._id, courseId: sec305._id, progressPercent: 95, finalGrade: 98, letterGrade: 'A', status: 'active' },
      { studentId: sophia._id, courseId: cs402._id, progressPercent: 80, finalGrade: 88, letterGrade: 'B', status: 'active' }
    ];

    await Enrollment.insertMany(enrollmentsData);

    console.log('[Seeder] Creating Assignments...');
    const assignmentsData = [
      {
        courseId: cs501._id,
        facultyId: profVance._id,
        title: 'Project 1: Raft Consensus Protocol Implementation',
        description: 'Implement a working Raft consensus cluster in Go or Node.js with leader election, heartbeat timeouts, and basic log replication handling 3-node network splits.',
        maxScore: 100,
        weightage: 25,
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // in 5 days
        rubric: [
          { criterion: 'Leader Election & Term Increment', maxPoints: 30, description: 'Elects leader reliably within randomized 150-300ms window' },
          { criterion: 'Heartbeat & Split Brain Prevention', maxPoints: 35, description: 'Maintains quorum and handles isolated node rejoin' },
          { criterion: 'Log Replication & Consistency Verification', maxPoints: 35, description: 'Matches uncommitted index verification across peers' }
        ],
        status: 'published'
      },
      {
        courseId: cs402._id,
        facultyId: drElena._id,
        title: 'Lab 2: High-Performance Express Middleware & JWT RBAC',
        description: 'Build a production-hardened Express API pipeline featuring rate-limiting, custom JWT Bearer token parsing, role verification guards, and structured MongoDB error handling.',
        maxScore: 100,
        weightage: 20,
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        rubric: [
          { criterion: 'JWT Verification & Expiry Handling', maxPoints: 30, description: 'Correct token signature validation and structured 401 response' },
          { criterion: 'Role-Based Access Control Middleware', maxPoints: 40, description: 'Multi-role authorization with strict status checking' },
          { criterion: 'Input Validation & Error Middleware', maxPoints: 30, description: 'Mongoose schema error translation and safe payloads' }
        ],
        status: 'published'
      },
      {
        courseId: sec305._id,
        facultyId: profChen._id,
        title: 'Assignment 1: Cryptographic Key Exchange & STRIDE Modeling',
        description: 'Perform a STRIDE threat modeling analysis for a modern telehealth system and implement an authenticated Diffie-Hellman key exchange demo with HMAC integrity.',
        maxScore: 100,
        weightage: 20,
        dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // passed
        rubric: [
          { criterion: 'STRIDE Threat Assessment Matrix', maxPoints: 50, description: 'Comprehensive coverage of Spoofing, Tampering, and Elevation of Privilege' },
          { criterion: 'Key Derivation & HMAC Authentication', maxPoints: 50, description: 'Cryptographic correctness with SHA-256' }
        ],
        status: 'published'
      }
    ];

    const createdAssignments = await Assignment.insertMany(assignmentsData);
    const raftAssign = createdAssignments[0];
    const fullstackAssign = createdAssignments[1];
    const cryptoAssign = createdAssignments[2];

    console.log('[Seeder] Creating realistic student Submissions with grades...');
    const submissionsData = [
      {
        assignmentId: raftAssign._id,
        studentId: liam._id,
        courseId: cs501._id,
        submissionText: 'Implemented full 3-node Raft state machine with gRPC transport. Tested under artificial 100ms packet delay and node drop simulation.',
        repoUrl: 'https://github.com/liambennett/raft-consensus-cs501',
        submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        grade: 96,
        status: 'graded',
        facultyFeedback: 'Superb architecture! The split-brain recovery simulation passed all 12 test assertions with zero race conditions.',
        gradedBy: profVance._id,
        gradedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
        rubricScores: [
          { criterion: 'Leader Election & Term Increment', pointsAwarded: 30 },
          { criterion: 'Heartbeat & Split Brain Prevention', pointsAwarded: 33 },
          { criterion: 'Log Replication & Consistency Verification', pointsAwarded: 33 }
        ]
      },
      {
        assignmentId: fullstackAssign._id,
        studentId: liam._id,
        courseId: cs402._id,
        submissionText: 'Built the middleware pipeline with Express, JSONWebToken, and custom rate limit buckets. Added end-to-end Jest tests for role boundaries.',
        repoUrl: 'https://github.com/liambennett/jwt-rbac-middleware',
        submittedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
        grade: 98,
        status: 'graded',
        facultyFeedback: 'Exceptional test coverage and clean middleware separation. Clean error serialization.',
        gradedBy: drElena._id,
        gradedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        rubricScores: [
          { criterion: 'JWT Verification & Expiry Handling', pointsAwarded: 30 },
          { criterion: 'Role-Based Access Control Middleware', pointsAwarded: 40 },
          { criterion: 'Input Validation & Error Middleware', pointsAwarded: 28 }
        ]
      },
      {
        assignmentId: raftAssign._id,
        studentId: maya._id,
        courseId: cs501._id,
        submissionText: 'Raft consensus node implemented with Node.js events and TCP sockets.',
        repoUrl: 'https://github.com/mayapatel/raft-nodejs-demo',
        submittedAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
        status: 'submitted' // Pending grading by faculty!
      },
      {
        assignmentId: fullstackAssign._id,
        studentId: david._id,
        courseId: cs402._id,
        submissionText: 'Completed the auth middleware and user route controllers.',
        repoUrl: 'https://github.com/davidkim/auth-express-lab',
        submittedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        grade: 65,
        status: 'graded',
        facultyFeedback: 'Token verification is functional, but role checks allow unauthenticated access to admin routes if header is missing. Please review.',
        gradedBy: drElena._id,
        gradedAt: new Date(Date.now() - 30 * 60 * 1000),
        rubricScores: [
          { criterion: 'JWT Verification & Expiry Handling', pointsAwarded: 22 },
          { criterion: 'Role-Based Access Control Middleware', pointsAwarded: 23 },
          { criterion: 'Input Validation & Error Middleware', pointsAwarded: 20 }
        ]
      },
      {
        assignmentId: cryptoAssign._id,
        studentId: sophia._id,
        courseId: sec305._id,
        submissionText: 'Comprehensive STRIDE threat model with 14 mitigation countermeasures and Node.js crypto ECDH demo.',
        repoUrl: 'https://github.com/sophiarodriguez/telehealth-threat-model',
        submittedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        grade: 100,
        status: 'graded',
        facultyFeedback: 'Outstanding STRIDE breakdown. The cryptographic derivation test script was flawless.',
        gradedBy: profChen._id,
        gradedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      }
    ];

    await Submission.insertMany(submissionsData);

    console.log('[Seeder] Creating Quizzes & Attempt Logs...');
    const quizzesData = [
      {
        courseId: cs501._id,
        facultyId: profVance._id,
        title: 'Quiz 1: Distributed Systems Fundamentals & CAP',
        description: 'Test your grasp of distributed failure modes, CAP theorem tradeoffs, and consensus criteria.',
        timeLimitMinutes: 15,
        totalPoints: 30,
        passPercentage: 60,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        status: 'published',
        questions: [
          {
            questionText: 'Under network partitioning (P), what does the CAP theorem state a distributed system must choose between?',
            questionType: 'mcq',
            options: [
              'Consistency vs Availability',
              'Performance vs Security',
              'Throughput vs Latency',
              'Scalability vs Storage'
            ],
            correctOptionIndex: 0,
            points: 10,
            explanation: 'The CAP theorem states that when a network partition occurs, a system must either guarantee consistency (rejecting unsynchronizable writes) or availability (accepting writes with stale reads).'
          },
          {
            questionText: 'In the Raft consensus protocol, what happens when an election timer elapses on a follower node?',
            questionType: 'mcq',
            options: [
              'The follower shuts down immediately',
              'The follower increments its current term and transitions to Candidate state',
              'The follower sends a heartbeat to the previous leader',
              'The follower requests log compaction'
            ],
            correctOptionIndex: 1,
            points: 10,
            explanation: 'Followers increment their term, transition to candidate state, vote for themselves, and broadcast RequestVote RPCs.'
          },
          {
            questionText: 'Vector Clocks are capable of detecting concurrent (causally unrelated) events in distributed environments.',
            questionType: 'tf',
            options: ['True', 'False'],
            correctOptionIndex: 0,
            points: 10,
            explanation: 'True. Unlike Lamport timestamps which only impose a total ordering, Vector Clocks preserve causal dependencies and detect concurrency.'
          }
        ]
      },
      {
        courseId: cs402._id,
        facultyId: drElena._id,
        title: 'Quiz 2: React 19 Engine & Modern State Management',
        description: 'Evaluate your understanding of asynchronous React primitives, useActionState, context optimization, and hydration.',
        timeLimitMinutes: 20,
        totalPoints: 30,
        passPercentage: 65,
        dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
        status: 'published',
        questions: [
          {
            questionText: 'Which React hook is designed for managing form submission states and async transitions automatically?',
            questionType: 'mcq',
            options: [
              'useActionState',
              'useLayoutEffect',
              'useImperativeHandle',
              'useRef'
            ],
            correctOptionIndex: 0,
            points: 10,
            explanation: 'React 19 introduced useActionState to seamlessly handle async actions and pending submission states.'
          },
          {
            questionText: 'What is the primary benefit of compound component architecture in React design systems?',
            questionType: 'mcq',
            options: [
              'Reduces bundle size to zero',
              'Enables flexible UI composition while sharing implicit state through context without prop drilling',
              'Forces all state to be stored in Redux',
              'Compiles components directly to WebAssembly'
            ],
            correctOptionIndex: 1,
            points: 10,
            explanation: 'Compound components allow child components to share contextual state implicitly, offering high compositional flexibility.'
          },
          {
            questionText: 'MongoDB compound indexes can satisfy queries on any arbitrary permutation of the indexed fields regardless of order.',
            questionType: 'tf',
            options: ['True', 'False'],
            correctOptionIndex: 1,
            points: 10,
            explanation: 'False. Compound indexes follow the prefix rule; queries must match the leftmost prefix of the indexed fields.'
          }
        ]
      }
    ];

    const createdQuizzes = await Quiz.insertMany(quizzesData);
    const quiz1 = createdQuizzes[0];
    const quiz2 = createdQuizzes[1];

    console.log('[Seeder] Creating Quiz Attempts...');
    const quizAttemptsData = [
      {
        quizId: quiz1._id,
        studentId: liam._id,
        courseId: cs501._id,
        timeSpentSeconds: 420,
        scoreObtained: 30,
        totalPossibleScore: 30,
        percentage: 100,
        passed: true,
        answers: [
          { questionId: quiz1.questions[0]._id, selectedOption: 0, isCorrect: true, pointsAwarded: 10 },
          { questionId: quiz1.questions[1]._id, selectedOption: 1, isCorrect: true, pointsAwarded: 10 },
          { questionId: quiz1.questions[2]._id, selectedOption: 0, isCorrect: true, pointsAwarded: 10 }
        ]
      },
      {
        quizId: quiz2._id,
        studentId: liam._id,
        courseId: cs402._id,
        timeSpentSeconds: 510,
        scoreObtained: 30,
        totalPossibleScore: 30,
        percentage: 100,
        passed: true,
        answers: [
          { questionId: quiz2.questions[0]._id, selectedOption: 0, isCorrect: true, pointsAwarded: 10 },
          { questionId: quiz2.questions[1]._id, selectedOption: 1, isCorrect: true, pointsAwarded: 10 },
          { questionId: quiz2.questions[2]._id, selectedOption: 1, isCorrect: true, pointsAwarded: 10 }
        ]
      },
      {
        quizId: quiz1._id,
        studentId: david._id,
        courseId: cs501._id,
        timeSpentSeconds: 820,
        scoreObtained: 10,
        totalPossibleScore: 30,
        percentage: 33,
        passed: false,
        answers: [
          { questionId: quiz1.questions[0]._id, selectedOption: 1, isCorrect: false, pointsAwarded: 0 },
          { questionId: quiz1.questions[1]._id, selectedOption: 1, isCorrect: true, pointsAwarded: 10 },
          { questionId: quiz1.questions[2]._id, selectedOption: 1, isCorrect: false, pointsAwarded: 0 }
        ]
      }
    ];

    await QuizAttempt.insertMany(quizAttemptsData);

    console.log('[Seeder] Creating Attendance Session Logs...');
    const attendanceData = [
      {
        courseId: cs501._id,
        facultyId: profVance._id,
        sessionDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        topicCovered: 'Distributed Consensus & Raft Elections',
        durationHours: 1.5,
        records: [
          { studentId: liam._id, status: 'present', remarks: 'Active discussion contributor' },
          { studentId: maya._id, status: 'present', remarks: 'Present' },
          { studentId: david._id, status: 'absent', remarks: 'Unexcused absence' }
        ]
      },
      {
        courseId: cs501._id,
        facultyId: profVance._id,
        sessionDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        topicCovered: 'Log Replication & Safety Invariants',
        durationHours: 1.5,
        records: [
          { studentId: liam._id, status: 'present', remarks: 'Present' },
          { studentId: maya._id, status: 'late', remarks: 'Joined 15m late' },
          { studentId: david._id, status: 'absent', remarks: 'Second consecutive absence' }
        ]
      },
      {
        courseId: cs402._id,
        facultyId: drElena._id,
        sessionDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        topicCovered: 'Compound Components & Context Optimization',
        durationHours: 1.5,
        records: [
          { studentId: liam._id, status: 'present', remarks: 'Present' },
          { studentId: maya._id, status: 'present', remarks: 'Present' },
          { studentId: david._id, status: 'present', remarks: 'Present' },
          { studentId: sophia._id, status: 'present', remarks: 'Present' }
        ]
      },
      {
        courseId: cs402._id,
        facultyId: drElena._id,
        sessionDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        topicCovered: 'REST API Security Pipelines & Rate Limiting',
        durationHours: 1.5,
        records: [
          { studentId: liam._id, status: 'present', remarks: 'Present' },
          { studentId: maya._id, status: 'present', remarks: 'Present' },
          { studentId: david._id, status: 'late', remarks: 'Late arrival' },
          { studentId: sophia._id, status: 'present', remarks: 'Present' }
        ]
      }
    ];

    await Attendance.insertMany(attendanceData);

    console.log('[Seeder] Creating Discussion Topics & Forum Threads...');
    const discussionData = [
      {
        courseId: cs501._id,
        authorId: liam._id,
        title: 'Handling Candidate Split-Votes in High-Latency Cluster Simulation',
        content: 'When testing a 5-node cluster with 150ms network jitter, two candidate nodes occasionally split votes across terms repeatedly. Has anyone tuned randomized election timeout ranges beyond 150-300ms to resolve this reliably?',
        category: 'Project Help',
        tags: ['Raft', 'Distributed-Systems', 'gRPC', 'Go'],
        isPinned: true,
        upvotes: [profVance._id, maya._id, sophia._id],
        replies: [
          {
            authorId: profVance._id,
            content: 'Great observation Liam! In high-jitter simulations, widening the jitter window to 200ms - 450ms significantly reduces collision probability without compromising failure recovery speed. I endorse this solution.',
            isFacultyEndorsed: true,
            upvotes: [liam._id, maya._id],
            createdAt: new Date(Date.now() - 18 * 60 * 60 * 1000)
          },
          {
            authorId: maya._id,
            content: 'I had the exact same issue on my local Docker network! Expanding the random seed multiplier fixed it instantly.',
            isFacultyEndorsed: false,
            upvotes: [liam._id],
            createdAt: new Date(Date.now() - 14 * 60 * 60 * 1000)
          }
        ]
      },
      {
        courseId: cs402._id,
        authorId: maya._id,
        title: 'Best approach for memoizing complex data grid filters in React 19',
        content: 'Is useMemo preferred over React Compiler automatic memoization when managing multi-criteria table filtering across 500+ records?',
        category: 'Code Architecture',
        tags: ['React', 'Performance', 'Hooks'],
        isPinned: false,
        upvotes: [liam._id],
        replies: [
          {
            authorId: drElena._id,
            content: 'With React 19, the compiler handles standard recalculations automatically. However, for large in-memory collections (>1000 items), custom memoization or server-side pagination with query params is the enterprise standard.',
            isFacultyEndorsed: true,
            upvotes: [maya._id, liam._id],
            createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000)
          }
        ]
      },
      {
        courseId: null, // General Institution Wide Forum
        authorId: sophia._id,
        title: 'Upcoming University Cyber Defense Hackathon 2026',
        content: 'The collegiate Cyber Defense CTF registrations are open! We are looking for 2 more members specializing in reverse engineering and web exploitation.',
        category: 'Announcements',
        tags: ['Hackathon', 'Security', 'CTF', 'Community'],
        isPinned: true,
        upvotes: [adminUser._id, profChen._id, liam._id],
        replies: []
      }
    ];

    await DiscussionTopic.insertMany(discussionData);

    console.log('[Seeder] Creating Realistic Notifications...');
    const notificationsData = [
      {
        recipientId: liam._id,
        senderId: profVance._id,
        title: 'Assignment Graded: Raft Consensus Protocol',
        message: 'Your submission scored 96/100. Excellent split-brain recovery implementation!',
        type: 'grade',
        link: `/student/courses/${cs501._id}`,
        isRead: false
      },
      {
        recipientId: liam._id,
        senderId: drElena._id,
        title: 'Assignment Graded: High-Performance Express Middleware',
        message: 'Your submission scored 98/100. Exceptional test coverage!',
        type: 'grade',
        link: `/student/courses/${cs402._id}`,
        isRead: true
      },
      {
        recipientId: liam._id,
        title: 'Quiz Evaluated: Distributed Systems Fundamentals',
        message: 'You scored 100% (30/30 pts). Status: PASSED.',
        type: 'quiz',
        link: `/student/courses/${cs501._id}`,
        isRead: true
      },
      {
        recipientId: david._id,
        title: 'Academic Alert: Attention Needed',
        message: `Your current attendance in "Distributed Systems & Cloud Microservices" is below 75% (50%). Please review assignments and consult faculty immediately.`,
        type: 'attendance_alert',
        link: `/student/courses/${cs501._id}`,
        isRead: false
      },
      {
        recipientId: profVance._id,
        senderId: maya._id,
        title: 'New Assignment Submission Pending Grading',
        message: 'Maya Patel submitted "Project 1: Raft Consensus Protocol Implementation".',
        type: 'assignment',
        link: `/faculty/courses/${cs501._id}`,
        isRead: false
      },
      {
        recipientId: adminUser._id,
        title: 'System Milestone: Fall 2026 Curricula Online',
        message: 'All published courses have registered active student enrollments with zero anomalies.',
        type: 'announcement',
        link: '/admin',
        isRead: true
      }
    ];

    await Notification.insertMany(notificationsData);

    console.log('[Seeder] Initializing Performance Metrics...');
    const performanceRecords = [
      {
        studentId: liam._id,
        courseId: cs501._id,
        assignmentAverage: 96,
        quizAverage: 100,
        attendancePercentage: 100,
        overallScore: 98,
        riskStatus: 'good_standing'
      },
      {
        studentId: liam._id,
        courseId: cs402._id,
        assignmentAverage: 98,
        quizAverage: 100,
        attendancePercentage: 100,
        overallScore: 99,
        riskStatus: 'good_standing'
      },
      {
        studentId: liam._id,
        courseId: sec305._id,
        assignmentAverage: 88,
        quizAverage: 90,
        attendancePercentage: 92,
        overallScore: 90,
        riskStatus: 'good_standing'
      },
      {
        studentId: maya._id,
        courseId: cs501._id,
        assignmentAverage: 85,
        quizAverage: 88,
        attendancePercentage: 88,
        overallScore: 87,
        riskStatus: 'good_standing'
      },
      {
        studentId: maya._id,
        courseId: cs402._id,
        assignmentAverage: 90,
        quizAverage: 92,
        attendancePercentage: 100,
        overallScore: 93,
        riskStatus: 'good_standing'
      },
      {
        studentId: david._id,
        courseId: cs501._id,
        assignmentAverage: 45,
        quizAverage: 33,
        attendancePercentage: 0,
        overallScore: 32,
        riskStatus: 'at_risk' // Triggers faculty at-risk warning!
      },
      {
        studentId: david._id,
        courseId: cs402._id,
        assignmentAverage: 65,
        quizAverage: 60,
        attendancePercentage: 80,
        overallScore: 66,
        riskStatus: 'needs_attention'
      },
      {
        studentId: sophia._id,
        courseId: sec305._id,
        assignmentAverage: 100,
        quizAverage: 95,
        attendancePercentage: 100,
        overallScore: 99,
        riskStatus: 'good_standing'
      },
      {
        studentId: sophia._id,
        courseId: cs402._id,
        assignmentAverage: 88,
        quizAverage: 85,
        attendancePercentage: 100,
        overallScore: 89,
        riskStatus: 'good_standing'
      }
    ];

    await Performance.insertMany(performanceRecords);

    console.log('====================================================');
    console.log('✅ DATABASE SEEDING COMPLETED SUCCESSFULLY!');
    console.log('====================================================');
    console.log('DEMO ACCOUNTS READY:');
    console.log('  👑 Admin:   admin@edupulse.edu / Admin@123');
    console.log('  👨‍🏫 Faculty: faculty@edupulse.edu / Faculty@123');
    console.log('  👨‍🎓 Student: student@edupulse.edu / Student@123');
    console.log('  👨‍🎓 Student: david.kim@edupulse.edu / Student@123 (At-risk test)');
    console.log('====================================================');

    process.exit(0);
  } catch (error) {
    console.error('[Seeder Error] Failed to seed database:', error);
    process.exit(1);
  }
};

seedDB();
