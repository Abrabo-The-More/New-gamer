/**
 * Industrial School Management System
 * Node.js Server with SQLite Database
 * Similar to Microsoft Access but faster and more reliable
 */

const express = require('express');
const Database = require('better-sqlite3');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..')));

// Initialize SQLite Database
const db = new Database('school.db');

// Create Tables
db.exec(`
    -- Users Table
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        code TEXT UNIQUE NOT NULL,
        role TEXT NOT NULL,
        name TEXT NOT NULL,
        email TEXT,
        studentId INTEGER,
        parentId INTEGER
    );

    -- Students Table
    CREATE TABLE IF NOT EXISTS students (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        admissionNo TEXT UNIQUE,
        firstName TEXT NOT NULL,
        lastName TEXT NOT NULL,
        gender TEXT,
        dateOfBirth TEXT,
        classId INTEGER,
        stream TEXT,
        section TEXT,
        phone TEXT,
        email TEXT,
        parentId INTEGER,
        address TEXT,
        status TEXT DEFAULT 'Active',
        admissionDate TEXT,
        bloodGroup TEXT,
        allergies TEXT,
        emergencyContact TEXT
    );

    -- Teachers Table
    CREATE TABLE IF NOT EXISTS teachers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        firstName TEXT NOT NULL,
        lastName TEXT NOT NULL,
        gender TEXT,
        dateOfBirth TEXT,
        phone TEXT,
        email TEXT,
        department TEXT,
        qualification TEXT,
        salary REAL,
        address TEXT,
        status TEXT DEFAULT 'Active',
        hireDate TEXT
    );

    -- Parents Table
    CREATE TABLE IF NOT EXISTS parents (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        firstName TEXT NOT NULL,
        lastName TEXT NOT NULL,
        gender TEXT,
        phone TEXT,
        email TEXT,
        occupation TEXT,
        address TEXT,
        relationship TEXT
    );

    -- Non-Teaching Staff Table
    CREATE TABLE IF NOT EXISTS nonteaching (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        firstName TEXT NOT NULL,
        lastName TEXT NOT NULL,
        role TEXT NOT NULL,
        gender TEXT,
        phone TEXT,
        email TEXT,
        department TEXT,
        salary REAL,
        address TEXT,
        status TEXT DEFAULT 'Active',
        hireDate TEXT
    );

    -- Programs/Courses Table
    CREATE TABLE IF NOT EXISTS programs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        code TEXT UNIQUE,
        category TEXT,
        description TEXT,
        duration TEXT,
        capacity INTEGER,
        status TEXT DEFAULT 'Active'
    );

    -- Classes Table
    CREATE TABLE IF NOT EXISTS classes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        stream TEXT,
        programId INTEGER,
        section TEXT,
        capacity INTEGER,
        classTeacherId INTEGER,
        room TEXT
    );

    -- Subjects Table
    CREATE TABLE IF NOT EXISTS subjects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        code TEXT UNIQUE,
        category TEXT,
        department TEXT,
        programId INTEGER,
        teacherId INTEGER,
        credits INTEGER
    );

    -- Departments Table
    CREATE TABLE IF NOT EXISTS departments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        headId INTEGER,
        code TEXT UNIQUE,
        description TEXT
    );

    -- Committees Table
    CREATE TABLE IF NOT EXISTS committees (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        type TEXT,
        description TEXT,
        members TEXT,
        meetingDay TEXT,
        status TEXT DEFAULT 'Active'
    );

    -- Committee Members Table
    CREATE TABLE IF NOT EXISTS committee_members (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        committeeId INTEGER,
        memberName TEXT,
        role TEXT,
        position TEXT
    );

    -- SRC Executive Table
    CREATE TABLE IF NOT EXISTS src_executive (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        position TEXT,
        class TEXT,
        phone TEXT,
        email TEXT,
        status TEXT DEFAULT 'Active'
    );

    -- Fees Table
    CREATE TABLE IF NOT EXISTS fees (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        studentId INTEGER,
        academicYear TEXT,
        term TEXT,
        amount REAL,
        paid REAL DEFAULT 0,
        status TEXT DEFAULT 'Unpaid',
        dueDate TEXT
    );

    -- Grades Table
    CREATE TABLE IF NOT EXISTS grades (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        studentId INTEGER,
        subjectId INTEGER,
        academicYear TEXT,
        term TEXT,
        score REAL,
        grade TEXT,
        remarks TEXT
    );

    -- Attendance Table
    CREATE TABLE IF NOT EXISTS attendance (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        studentId INTEGER,
        date TEXT,
        status TEXT,
        remarks TEXT
    );

    -- Visitors Table
    CREATE TABLE IF NOT EXISTS visitors (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        phone TEXT,
        reason TEXT,
        personToSee TEXT,
        date TEXT,
        timeIn TEXT,
        timeOut TEXT,
        status TEXT DEFAULT 'Checked In'
    );

    -- Announcements Table
    CREATE TABLE IF NOT EXISTS announcements (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        category TEXT,
        priority TEXT,
        postedBy TEXT,
        date TEXT,
        status TEXT DEFAULT 'Active'
    );

    -- Settings Table
    CREATE TABLE IF NOT EXISTS settings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        key TEXT UNIQUE,
        value TEXT
    );
`);

// Seed Initial Data
const seedData = () => {
    // Check if data exists
    const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get();
    if (userCount.count > 0) return;

    // Insert Users
    const insertUser = db.prepare('INSERT INTO users (username, password, code, role, name, email, studentId, parentId) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
    
    const users = [
        ['admin', 'admin123', 'ADMIN001', 'admin', 'Administrator', 'admin@school.edu', null, null],
        ['principal', 'principal123', 'PRIN001', 'principal', 'Dr. John Smith', 'principal@school.edu', null, null],
        ['teacher', 'teacher123', 'TEAC001', 'teacher', 'Mr. David Mensah', 'teacher@school.edu', null, null],
        ['david.mensah', 'david123', 'TEAC002', 'teacher', 'Mr. David Mensah', 'david.mensah@school.edu', null, null],
        ['grace.osei', 'grace123', 'TEAC003', 'teacher', 'Mrs. Grace Osei', 'grace.osei@school.edu', null, null],
        ['accountant', 'accountant123', 'ACCT001', 'accountant', 'Mrs. Sarah Osei', 'accountant@school.edu', null, null],
        ['registrar', 'registrar123', 'REGI001', 'registrar', 'Mr. James Kofi', 'registrar@school.edu', null, null],
        ['librarian', 'librarian123', 'LIB001', 'librarian', 'Mrs. Mary Akosua', 'librarian@school.edu', null, null],
        ['storekeeper', 'storekeeper123', 'STOR001', 'storekeeper', 'Mr. Robert Doe', 'storekeeper@school.edu', null, null],
        ['security', 'security123', 'SECU001', 'security', 'Mr. Michael Tetteh', 'security@school.edu', null, null],
        ['caterer', 'caterer123', 'CATE001', 'caterer', 'Mrs. Grace Adom', 'caterer@school.edu', null, null],
        ['nurse', 'nurse123', 'NURS001', 'nurse', 'Mrs. Mary Akosua', 'nurse@school.edu', null, null],
        ['secretary', 'secretary123', 'SECR001', 'secretary', 'Mrs. Anna Mensah', 'secretary@school.edu', null, null],
        ['parent', 'parent123', 'PAR001', 'parent', 'Mr. John Asante', 'parent@school.edu', null, 1],
        ['j.asante', 'asante123', 'PAR002', 'parent', 'Mr. John Asante', 'john.asante@email.com', null, 1],
        ['p.mensah', 'mensah123', 'PAR003', 'parent', 'Mr. Paul Mensah', 'paul.mensah@email.com', null, 2],
        ['student', 'student123', 'STUD001', 'student', 'John Doe', 'student@school.edu', 1, null],
        ['kwame.asante', 'kwame123', 'STUD002', 'student', 'Kwame Asante', 'kwame.asante@student.edu', 1, null],
        ['akua.mensah', 'akua123', 'STUD003', 'student', 'Akua Mensah', 'akua.mensah@student.edu', 2, null],
        ['kofi.osei', 'kofi123', 'STUD004', 'student', 'Kofi Osei', 'kofi.osei@student.edu', 3, null],
        ['abena.serwaa', 'abena123', 'STUD005', 'student', 'Abena Serwaa', 'abena.serwaa@student.edu', 4, null]
    ];
    
    users.forEach(u => insertUser.run(...u));

    // Insert Students
    const insertStudent = db.prepare('INSERT INTO students (admissionNo, firstName, lastName, gender, dateOfBirth, classId, stream, section, phone, email, parentId, address, status, admissionDate, bloodGroup) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
    const students = [
        ['STJ/2024/001', 'Kwame', 'Asante', 'Male', '2010-05-15', 1, 'A', 'General Science', '0244123456', 'kwame.asante@student.edu', 1, 'Accra', 'Active', '2024-01-15', 'O+'],
        ['STJ/2024/002', 'Akua', 'Mensah', 'Female', '2010-08-20', 2, 'B', 'General Arts', '0244789012', 'akua.mensah@student.edu', 1, 'Kumasi', 'Active', '2024-01-15', 'A+'],
        ['STJ/2024/003', 'Kofi', 'Osei', 'Male', '2010-03-10', 3, 'A', 'Business', '0245345678', 'kofi.osei@student.edu', 2, 'Takoradi', 'Active', '2024-01-15', 'B+'],
        ['STJ/2024/004', 'Abena', 'Serwaa', 'Female', '2010-11-25', 4, 'A', 'Visual Arts', '0245567890', 'abena.serwaa@student.edu', 2, 'Cape Coast', 'Active', '2024-01-15', 'O-']
    ];
    students.forEach(s => insertStudent.run(...s));

    // Insert Teachers
    const insertTeacher = db.prepare('INSERT INTO teachers (firstName, lastName, gender, phone, email, department, qualification, salary, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
    const teachers = [
        ['David', 'Mensah', 'Male', '0245123456', 'david.mensah@school.edu', 'Science', 'MSc', 5000, 'Active'],
        ['Grace', 'Osei', 'Female', '0245234567', 'grace.osei@school.edu', 'Arts', 'BA, MA', 4500, 'Active'],
        ['James', 'Kofi', 'Male', '0245345678', 'james.kofi@school.edu', 'Business', 'MBA', 4800, 'Active']
    ];
    teachers.forEach(t => insertTeacher.run(...t));

    // Insert Parents
    const insertParent = db.prepare('INSERT INTO parents (firstName, lastName, gender, phone, email, occupation, address) VALUES (?, ?, ?, ?, ?, ?, ?)');
    const parents = [
        ['John', 'Asante', 'Male', '0246123456', 'john.asante@email.com', 'Businessman', 'Accra'],
        ['Paul', 'Mensah', 'Male', '0246234567', 'paul.mensah@email.com', 'Teacher', 'Kumasi']
    ];
    parents.forEach(p => insertParent.run(...p));

    // Insert Programs
    const insertProgram = db.prepare('INSERT INTO programs (name, code, category, description, duration, capacity, status) VALUES (?, ?, ?, ?, ?, ?, ?)');
    const programs = [
        ['General Science', 'GENSCI', 'Science', 'Science students with Biology, Chemistry, Physics', '3 years', 150, 'Active'],
        ['General Arts', 'GENART', 'Arts', 'Arts students with Literature, History, Economics', '3 years', 120, 'Active'],
        ['Visual Arts', 'VISART', 'Arts', 'Art students with Painting, Sculpture, Graphic Design', '3 years', 80, 'Active'],
        ['Business', 'BUS', 'Business', 'Business students with Accounting, Economics, Management', '3 years', 100, 'Active'],
        ['Technical', 'TECH', 'Technical', 'Technical students with Electrical, Mechanical, Building', '3 years', 120, 'Active']
    ];
    programs.forEach(p => insertProgram.run(...p));

    // Insert Committees
    const insertCommittee = db.prepare('INSERT INTO committees (name, type, description, members, meetingDay, status) VALUES (?, ?, ?, ?, ?, ?)');
    const committees = [
        ['Disciplinary Committee', 'Disciplinary', 'Handles student discipline and behavioral issues', 'Principal, Housemasters, Senior Teachers', 'Monday', 'Active'],
        ['Parent-Teacher Association (PTA)', 'PTA', 'Bridge between parents and school management', 'Parents, Teachers, Principal', 'Friday', 'Active'],
        ['Administration Council', 'Administration', 'Top management decision making body', 'Principal, Vice Principals, Headmasters', 'Wednesday', 'Active'],
        ['SRC (Student Representative Council)', 'Student', 'Student leadership body', 'President, Vice President, Class Representatives', 'Tuesday', 'Active']
    ];
    committees.forEach(c => insertCommittee.run(...c));

    // Insert SRC
    const insertSRC = db.prepare('INSERT INTO src_executive (name, position, class, phone, email, status) VALUES (?, ?, ?, ?, ?, ?)');
    const src = [
        ['Kwame Asante', 'President', 'Form 3 Technical', '0244123456', 'kwame@student.edu', 'Active'],
        ['Akua Mensah', 'Vice President', 'Form 3 General Science', '0245789012', 'akua@student.edu', 'Active'],
        ['Kofi Osei', 'Secretary', 'Form 3 Business', '0245345678', 'kofi@student.edu', 'Active']
    ];
    src.forEach(s => insertSRC.run(...s));

    // Insert Settings
    const insertSetting = db.prepare('INSERT INTO settings (key, value) VALUES (?, ?)');
    insertSetting.run('schoolName', 'Suhum Senior High Technical School');
    insertSetting.run('schoolAddress', 'Suhum, Eastern Region');
    insertSetting.run('academicYear', '2025-2026');
    insertSetting.run('term', 'Term 2');

    console.log('Database seeded successfully!');
};

// Initialize database
seedData();

// ==================== API ROUTES ====================

// Login API
app.post('/api/login', (req, res) => {
    const { username, password, code, role } = req.body;
    
    const user = db.prepare(`
        SELECT * FROM users 
        WHERE username = ? AND password = ? AND code = ? AND role = ?
    `).get(username, password, code, role);
    
    if (user) {
        res.json({ success: true, user: { ...user, password: undefined } });
    } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
});

// Get Students API
app.get('/api/students', (req, res) => {
    const students = db.prepare('SELECT * FROM students').all();
    res.json(students);
});

// Get Student by ID
app.get('/api/students/:id', (req, res) => {
    const student = db.prepare('SELECT * FROM students WHERE id = ?').get(req.params.id);
    res.json(student);
});

// Get Grades for Student
app.get('/api/grades/:studentId', (req, res) => {
    const grades = db.prepare(`
        SELECT g.*, s.name as subjectName, s.code as subjectCode 
        FROM grades g 
        LEFT JOIN subjects s ON g.subjectId = s.id 
        WHERE g.studentId = ?
    `).all(req.params.studentId);
    res.json(grades);
});

// Get Attendance for Student
app.get('/api/attendance/:studentId', (req, res) => {
    const attendance = db.prepare('SELECT * FROM attendance WHERE studentId = ?').all(req.params.studentId);
    res.json(attendance);
});

// Get Fees for Student
app.get('/api/fees/:studentId', (req, res) => {
    const fees = db.prepare('SELECT * FROM fees WHERE studentId = ?').all(req.params.studentId);
    res.json(fees);
});

// Get Teachers
app.get('/api/teachers', (req, res) => {
    const teachers = db.prepare('SELECT * FROM teachers').all();
    res.json(teachers);
});

// Get Parents
app.get('/api/parents', (req, res) => {
    const parents = db.prepare('SELECT * FROM parents').all();
    res.json(parents);
});

// Get Non-Teaching Staff
app.get('/api/nonteaching', (req, res) => {
    const staff = db.prepare('SELECT * FROM nonteaching').all();
    res.json(staff);
});

// Get Programs
app.get('/api/programs', (req, res) => {
    const programs = db.prepare('SELECT * FROM programs').all();
    res.json(programs);
});

// Get Classes
app.get('/api/classes', (req, res) => {
    const classes = db.prepare('SELECT * FROM classes').all();
    res.json(classes);
});

// Get Subjects
app.get('/api/subjects', (req, res) => {
    const subjects = db.prepare('SELECT * FROM subjects').all();
    res.json(subjects);
});

// Get Departments
app.get('/api/departments', (req, res) => {
    const departments = db.prepare('SELECT * FROM departments').all();
    res.json(departments);
});

// Get Committees
app.get('/api/committees', (req, res) => {
    const committees = db.prepare('SELECT * FROM committees').all();
    res.json(committees);
});

// Get SRC
app.get('/api/src', (req, res) => {
    const src = db.prepare('SELECT * FROM src_executive').all();
    res.json(src);
});

// Get Announcements
app.get('/api/announcements', (req, res) => {
    const announcements = db.prepare('SELECT * FROM announcements ORDER BY id DESC').all();
    res.json(announcements);
});

// Get Visitors
app.get('/api/visitors', (req, res) => {
    const visitors = db.prepare('SELECT * FROM visitors ORDER BY id DESC').all();
    res.json(visitors);
});

// Get Fees (All)
app.get('/api/fees', (req, res) => {
    const fees = db.prepare('SELECT * FROM fees').all();
    res.json(fees);
});

// Get Settings
app.get('/api/settings', (req, res) => {
    const settings = db.prepare('SELECT * FROM settings').all();
    const settingsObj = {};
    settings.forEach(s => settingsObj[s.key] = s.value);
    res.json(settingsObj);
});

// Get Dashboard Stats
app.get('/api/stats', (req, res) => {
    const totalStudents = db.prepare('SELECT COUNT(*) as count FROM students').get().count;
    const totalTeachers = db.prepare('SELECT COUNT(*) as count FROM teachers').get().count;
    const totalClasses = db.prepare('SELECT COUNT(*) as count FROM classes').get().count;
    const unpaidFees = db.prepare("SELECT COUNT(*) as count FROM fees WHERE status = 'Unpaid'").get().count;
    const paidFees = db.prepare("SELECT COUNT(*) as count FROM fees WHERE status = 'Paid'").get().count;
    
    res.json({ totalStudents, totalTeachers, totalClasses, unpaidFees, paidFees });
});

// Start Server
app.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════════════════════════╗
║   School Management System Server                        ║
║   Database: SQLite (Microsoft Access Alternative)       ║
║   Server running at: http://localhost:${PORT}              ║
╚═══════════════════════════════════════════════════════════╝
    `);
});
