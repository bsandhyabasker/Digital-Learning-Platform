const bcrypt = require('bcryptjs');

const getHashedPassword = (plain) => {
  return bcrypt.hashSync(plain, 10);
};

const users = [
  {
    name: 'Dr. Sarah Jenkins',
    email: 'admin@edupulse.edu',
    password: getHashedPassword('Admin@123'),
    role: 'admin',
    department: 'Office of Academic Affairs',
    bio: 'Chief Academic Technology Officer overseeing institutional quality and digital curricula.',
    employeeId: 'ADM-1001',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80',
    phone: '+1 (555) 234-5670'
  },
  {
    name: 'Prof. Alexander Vance',
    email: 'faculty@edupulse.edu',
    password: getHashedPassword('Faculty@123'),
    role: 'faculty',
    department: 'Computer Science',
    bio: 'Distinguished Professor in Distributed Computing, Microservices, and Large-Scale Systems.',
    employeeId: 'FAC-3012',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80',
    phone: '+1 (555) 345-6789'
  },
  {
    name: 'Dr. Elena Rostova',
    email: 'elena.rostova@edupulse.edu',
    password: getHashedPassword('Faculty@123'),
    role: 'faculty',
    department: 'Software Engineering',
    bio: 'Lead Instructor for Advanced Full-Stack Systems, React Ecosystems, and Cloud Architecture.',
    employeeId: 'FAC-3045',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=256&q=80',
    phone: '+1 (555) 456-7890'
  },
  {
    name: 'Prof. Marcus Chen',
    email: 'marcus.chen@edupulse.edu',
    password: getHashedPassword('Faculty@123'),
    role: 'faculty',
    department: 'Cybersecurity',
    bio: 'Researcher in Cryptographic Protocols, Zero-Trust Architecture, and Penetration Testing.',
    employeeId: 'FAC-3088',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=256&q=80',
    phone: '+1 (555) 567-8901'
  },
  {
    name: 'Liam Bennett',
    email: 'student@edupulse.edu',
    password: getHashedPassword('Student@123'),
    role: 'student',
    department: 'Computer Science',
    bio: 'Final year CS major focused on distributed backends and reactive web applications.',
    studentId: 'STU-8821',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=256&q=80',
    phone: '+1 (555) 678-9012'
  },
  {
    name: 'Maya Patel',
    email: 'maya.patel@edupulse.edu',
    password: getHashedPassword('Student@123'),
    role: 'student',
    department: 'Software Engineering',
    bio: 'Software engineer in training, passionate about UI design systems and state engines.',
    studentId: 'STU-8834',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=256&q=80',
    phone: '+1 (555) 789-0123'
  },
  {
    name: 'David Kim',
    email: 'david.kim@edupulse.edu',
    password: getHashedPassword('Student@123'),
    role: 'student',
    department: 'Computer Science',
    bio: 'Junior undergraduate exploring full stack development and cloud infrastructure.',
    studentId: 'STU-8847',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
    phone: '+1 (555) 890-1234'
  },
  {
    name: 'Sophia Rodriguez',
    email: 'sophia.rodriguez@edupulse.edu',
    password: getHashedPassword('Student@123'),
    role: 'student',
    department: 'Cybersecurity',
    bio: 'Security enthusiast, active capture-the-flag competitor and protocol analyst.',
    studentId: 'STU-8859',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=256&q=80',
    phone: '+1 (555) 901-2345'
  }
];

module.exports = { users };
