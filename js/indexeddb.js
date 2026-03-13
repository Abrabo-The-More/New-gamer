/**
 * Industrial School Management System
 * IndexedDB Database - Works like Microsoft Access but in browser
 */

const SchoolDB = {
    dbName: 'SuhumSchoolDB',
    dbVersion: 1,
    db: null,

    // Open database
    async open() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.dbVersion);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.db = request.result;
                resolve(this.db);
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;

                // Users Store
                if (!db.objectStoreNames.contains('users')) {
                    const userStore = db.createObjectStore('users', { keyPath: 'id', autoIncrement: true });
                    userStore.createIndex('username', 'username', { unique: true });
                    userStore.createIndex('code', 'code', { unique: true });
                    this.seedUsers(userStore);
                }

                // Students Store
                if (!db.objectStoreNames.contains('students')) {
                    const studentStore = db.createObjectStore('students', { keyPath: 'id', autoIncrement: true });
                    studentStore.createIndex('admissionNo', 'admissionNo', { unique: true });
                    this.seedStudents(studentStore);
                }

                // Teachers Store
                if (!db.objectStoreNames.contains('teachers')) {
                    const teacherStore = db.createObjectStore('teachers', { keyPath: 'id', autoIncrement: true });
                    this.seedTeachers(teacherStore);
                }

                // Parents Store
                if (!db.objectStoreNames.contains('parents')) {
                    const parentStore = db.createObjectStore('parents', { keyPath: 'id', autoIncrement: true });
                    this.seedParents(parentStore);
                }

                // Non-Teaching Staff Store
                if (!db.objectStoreNames.contains('nonteaching')) {
                    const staffStore = db.createObjectStore('nonteaching', { keyPath: 'id', autoIncrement: true });
                    this.seedNonTeaching(staffStore);
                }

                // Programs Store
                if (!db.objectStoreNames.contains('programs')) {
                    const programStore = db.createObjectStore('programs', { keyPath: 'id', autoIncrement: true });
                    programStore.createIndex('code', 'code', { unique: true });
                    this.seedPrograms(programStore);
                }

                // Classes Store
                if (!db.objectStoreNames.contains('classes')) {
                    const classStore = db.createObjectStore('classes', { keyPath: 'id', autoIncrement: true });
                    this.seedClasses(classStore);
                }

                // Subjects Store
                if (!db.objectStoreNames.contains('subjects')) {
                    const subjectStore = db.createObjectStore('subjects', { keyPath: 'id', autoIncrement: true });
                    this.seedSubjects(subjectStore);
                }

                // Committees Store
                if (!db.objectStoreNames.contains('committees')) {
                    const committeeStore = db.createObjectStore('committees', { keyPath: 'id', autoIncrement: true });
                    this.seedCommittees(committeeStore);
                }

                // SRC Store
                if (!db.objectStoreNames.contains('src')) {
                    const srcStore = db.createObjectStore('src', { keyPath: 'id', autoIncrement: true });
                    this.seedSRC(srcStore);
                }

                // Grades Store
                if (!db.objectStoreNames.contains('grades')) {
                    const gradeStore = db.createObjectStore('grades', { keyPath: 'id', autoIncrement: true });
                    this.seedGrades(gradeStore);
                }

                // Fees Store
                if (!db.objectStoreNames.contains('fees')) {
                    const feeStore = db.createObjectStore('fees', { keyPath: 'id', autoIncrement: true });
                    this.seedFees(feeStore);
                }

                // Attendance Store
                if (!db.objectStoreNames.contains('attendance')) {
                    const attStore = db.createObjectStore('attendance', { keyPath: 'id', autoIncrement: true });
                    this.seedAttendance(attStore);
                }

                // Announcements Store
                if (!db.objectStoreNames.contains('announcements')) {
                    const annStore = db.createObjectStore('announcements', { keyPath: 'id', autoIncrement: true });
                    this.seedAnnouncements(annStore);
                }

                // Visitors Store
                if (!db.objectStoreNames.contains('visitors')) {
                    const visStore = db.createObjectStore('visitors', { keyPath: 'id', autoIncrement: true });
                    this.seedVisitors(visStore);
                }

                // Settings Store
                if (!db.objectStoreNames.contains('settings')) {
                    const setStore = db.createObjectStore('settings', { keyPath: 'id', autoIncrement: true });
                    this.seedSettings(setStore);
                }
            };
        });
    },

    // Seed Users
    seedUsers(store) {
        const users = [
            { username: 'admin', password: 'admin123', code: 'ADMIN001', role: 'admin', name: 'Administrator', email: 'admin@school.edu' },
            { username: 'principal', password: 'principal123', code: 'PRIN001', role: 'principal', name: 'Dr. John Smith', email: 'principal@school.edu' },
            { username: 'teacher', password: 'teacher123', code: 'TEAC001', role: 'teacher', name: 'Mr. David Mensah', email: 'teacher@school.edu' },
            { username: 'david.mensah', password: 'david123', code: 'TEAC002', role: 'teacher', name: 'Mr. David Mensah', email: 'david.mensah@school.edu' },
            { username: 'grace.osei', password: 'grace123', code: 'TEAC003', role: 'teacher', name: 'Mrs. Grace Osei', email: 'grace.osei@school.edu' },
            { username: 'accountant', password: 'accountant123', code: 'ACCT001', role: 'accountant', name: 'Mrs. Sarah Osei', email: 'accountant@school.edu' },
            { username: 'registrar', password: 'registrar123', code: 'REGI001', role: 'registrar', name: 'Mr. James Kofi', email: 'registrar@school.edu' },
            { username: 'librarian', password: 'librarian123', code: 'LIB001', role: 'librarian', name: 'Mrs. Mary Akosua', email: 'librarian@school.edu' },
            { username: 'storekeeper', password: 'storekeeper123', code: 'STOR001', role: 'storekeeper', name: 'Mr. Robert Doe', email: 'storekeeper@school.edu' },
            { username: 'security', password: 'security123', code: 'SECU001', role: 'security', name: 'Mr. Michael Tetteh', email: 'security@school.edu' },
            { username: 'caterer', password: 'caterer123', code: 'CATE001', role: 'caterer', name: 'Mrs. Grace Adom', email: 'caterer@school.edu' },
            { username: 'nurse', password: 'nurse123', code: 'NURS001', role: 'nurse', name: 'Mrs. Mary Akosua', email: 'nurse@school.edu' },
            { username: 'secretary', password: 'secretary123', code: 'SECR001', role: 'secretary', name: 'Mrs. Anna Mensah', email: 'secretary@school.edu' },
            { username: 'parent', password: 'parent123', code: 'PAR001', role: 'parent', name: 'Mr. John Asante', email: 'parent@school.edu', parentId: 1 },
            { username: 'j.asante', password: 'asante123', code: 'PAR002', role: 'parent', name: 'Mr. John Asante', email: 'john.asante@email.com', parentId: 1 },
            { username: 'p.mensah', password: 'mensah123', code: 'PAR003', role: 'parent', name: 'Mr. Paul Mensah', email: 'paul.mensah@email.com', parentId: 2 },
            { username: 'student', password: 'student123', code: 'STUD001', role: 'student', name: 'John Doe', email: 'student@school.edu', studentId: 1 },
            { username: 'kwame.asante', password: 'kwame123', code: 'STUD002', role: 'student', name: 'Kwame Asante', email: 'kwame.asante@student.edu', studentId: 1 },
            { username: 'akua.mensah', password: 'akua123', code: 'STUD003', role: 'student', name: 'Akua Mensah', email: 'akua.mensah@student.edu', studentId: 2 },
            { username: 'kofi.osei', password: 'kofi123', code: 'STUD004', role: 'student', name: 'Kofi Osei', email: 'kofi.osei@student.edu', studentId: 3 },
            { username: 'abena.serwaa', password: 'abena123', code: 'STUD005', role: 'student', name: 'Abena Serwaa', email: 'abena.serwaa@student.edu', studentId: 4 }
        ];
        users.forEach(u => store.add(u));
    },

    seedStudents(store) {
        const students = [
            { admissionNo: 'STJ/2024/001', firstName: 'Kwame', lastName: 'Asante', gender: 'Male', dateOfBirth: '2010-05-15', classId: 1, stream: 'A', section: 'General Science', phone: '0244123456', email: 'kwame.asante@student.edu', parentId: 1, address: 'Accra', status: 'Active', admissionDate: '2024-01-15', bloodGroup: 'O+' },
            { admissionNo: 'STJ/2024/002', firstName: 'Akua', lastName: 'Mensah', gender: 'Female', dateOfBirth: '2010-08-20', classId: 2, stream: 'B', section: 'General Arts', phone: '0244789012', email: 'akua.mensah@student.edu', parentId: 1, address: 'Kumasi', status: 'Active', admissionDate: '2024-01-15', bloodGroup: 'A+' },
            { admissionNo: 'STJ/2024/003', firstName: 'Kofi', lastName: 'Osei', gender: 'Male', dateOfBirth: '2010-03-10', classId: 3, stream: 'A', section: 'Business', phone: '0245345678', email: 'kofi.osei@student.edu', parentId: 2, address: 'Takoradi', status: 'Active', admissionDate: '2024-01-15', bloodGroup: 'B+' },
            { admissionNo: 'STJ/2024/004', firstName: 'Abena', lastName: 'Serwaa', gender: 'Female', dateOfBirth: '2010-11-25', classId: 4, stream: 'A', section: 'Visual Arts', phone: '0245567890', email: 'abena.serwaa@student.edu', parentId: 2, address: 'Cape Coast', status: 'Active', admissionDate: '2024-01-15', bloodGroup: 'O-' }
        ];
        students.forEach(s => store.add(s));
    },

    seedTeachers(store) {
        const teachers = [
            { firstName: 'David', lastName: 'Mensah', gender: 'Male', phone: '0245123456', email: 'david.mensah@school.edu', department: 'Science', qualification: 'MSc', salary: 5000, status: 'Active' },
            { firstName: 'Grace', lastName: 'Osei', gender: 'Female', phone: '0245234567', email: 'grace.osei@school.edu', department: 'Arts', qualification: 'BA, MA', salary: 4500, status: 'Active' },
            { firstName: 'James', lastName: 'Kofi', gender: 'Male', phone: '0245345678', email: 'james.kofi@school.edu', department: 'Business', qualification: 'MBA', salary: 4800, status: 'Active' }
        ];
        teachers.forEach(t => store.add(t));
    },

    seedParents(store) {
        const parents = [
            { firstName: 'John', lastName: 'Asante', gender: 'Male', phone: '0246123456', email: 'john.asante@email.com', occupation: 'Businessman', address: 'Accra' },
            { firstName: 'Paul', lastName: 'Mensah', gender: 'Male', phone: '0246234567', email: 'paul.mensah@email.com', occupation: 'Teacher', address: 'Kumasi' }
        ];
        parents.forEach(p => store.add(p));
    },

    seedNonTeaching(store) {
        const staff = [
            { firstName: 'Sarah', lastName: 'Osei', role: 'Accountant', gender: 'Female', phone: '0247123456', email: 'sarah@school.edu', department: 'Finance', salary: 4000, status: 'Active' },
            { firstName: 'Mary', lastName: 'Akosua', role: 'Librarian', gender: 'Female', phone: '0247234567', email: 'mary@school.edu', department: 'Library', salary: 3500, status: 'Active' }
        ];
        staff.forEach(s => store.add(s));
    },

    seedPrograms(store) {
        const programs = [
            { name: 'General Science', code: 'GENSCI', category: 'Science', description: 'Science students with Biology, Chemistry, Physics', duration: '3 years', capacity: 150, status: 'Active' },
            { name: 'General Arts', code: 'GENART', category: 'Arts', description: 'Arts students with Literature, History, Economics', duration: '3 years', capacity: 120, status: 'Active' },
            { name: 'Visual Arts', code: 'VISART', category: 'Arts', description: 'Art students with Painting, Sculpture, Graphic Design', duration: '3 years', capacity: 80, status: 'Active' },
            { name: 'Business', code: 'BUS', category: 'Business', description: 'Business students with Accounting, Economics, Management', duration: '3 years', capacity: 100, status: 'Active' },
            { name: 'Technical', code: 'TECH', category: 'Technical', description: 'Technical students with Electrical, Mechanical, Building', duration: '3 years', capacity: 120, status: 'Active' }
        ];
        programs.forEach(p => store.add(p));
    },

    seedClasses(store) {
        const classes = [
            { name: 'Form 1', stream: 'A', programId: 1, section: 'General Science', capacity: 40, room: 'Lab 1' },
            { name: 'Form 1', stream: 'B', programId: 2, section: 'General Arts', capacity: 40, room: 'Rm 101' },
            { name: 'Form 2', stream: 'A', programId: 1, section: 'General Science', capacity: 40, room: 'Lab 2' },
            { name: 'Form 3', stream: 'A', programId: 3, section: 'Business', capacity: 35, room: 'Rm 301' }
        ];
        classes.forEach(c => store.add(c));
    },

    seedSubjects(store) {
        const subjects = [
            { name: 'Mathematics', code: 'MTH001', category: 'Core', department: 'Science', credits: 4 },
            { name: 'English', code: 'ENG001', category: 'Core', department: 'Languages', credits: 4 },
            { name: 'Physics', code: 'PHY001', category: 'Science', department: 'Science', credits: 4 },
            { name: 'Chemistry', code: 'CHEM001', category: 'Science', department: 'Science', credits: 4 },
            { name: 'Biology', code: 'BIO001', category: 'Science', department: 'Science', credits: 4 },
            { name: 'Literature', code: 'LIT001', category: 'Arts', department: 'Arts', credits: 4 },
            { name: 'Accounting', code: 'ACC001', category: 'Business', department: 'Business', credits: 4 }
        ];
        subjects.forEach(s => store.add(s));
    },

    seedCommittees(store) {
        const committees = [
            { name: 'Disciplinary Committee', type: 'Disciplinary', description: 'Handles student discipline', members: 'Principal, Housemasters', meetingDay: 'Monday', status: 'Active' },
            { name: 'PTA', type: 'PTA', description: 'Parent-Teacher Association', members: 'Parents, Teachers', meetingDay: 'Friday', status: 'Active' },
            { name: 'Admin Council', type: 'Administration', description: 'Top management body', members: 'Principal, Vice Principals', meetingDay: 'Wednesday', status: 'Active' },
            { name: 'SRC', type: 'Student', description: 'Student Representative Council', members: 'Student Leaders', meetingDay: 'Tuesday', status: 'Active' }
        ];
        committees.forEach(c => store.add(c));
    },

    seedSRC(store) {
        const src = [
            { name: 'Kwame Asante', position: 'President', class: 'Form 3 Technical', phone: '0244123456', email: 'kwame@student.edu', status: 'Active' },
            { name: 'Akua Mensah', position: 'Vice President', class: 'Form 3 General Science', phone: '0245789012', email: 'akua@student.edu', status: 'Active' },
            { name: 'Kofi Osei', position: 'Secretary', class: 'Form 3 Business', phone: '0245345678', email: 'kofi@student.edu', status: 'Active' }
        ];
        src.forEach(s => store.add(s));
    },

    seedGrades(store) {
        const grades = [
            { studentId: 1, subjectId: 1, academicYear: '2025-2026', term: 'Term 1', score: 85, grade: 'A', remarks: 'Excellent' },
            { studentId: 1, subjectId: 3, academicYear: '2025-2026', term: 'Term 1', score: 78, grade: 'B+', remarks: 'Good' },
            { studentId: 1, subjectId: 4, academicYear: '2025-2026', term: 'Term 1', score: 82, grade: 'A-', remarks: 'Very Good' },
            { studentId: 2, subjectId: 6, academicYear: '2025-2026', term: 'Term 1', score: 88, grade: 'A', remarks: 'Excellent' },
            { studentId: 3, subjectId: 7, academicYear: '2025-2026', term: 'Term 1', score: 75, grade: 'B', remarks: 'Good' }
        ];
        grades.forEach(g => store.add(g));
    },

    seedFees(store) {
        const fees = [
            { studentId: 1, academicYear: '2025-2026', term: 'Term 1', amount: 1500, paid: 1500, status: 'Paid', dueDate: '2025-02-01' },
            { studentId: 2, academicYear: '2025-2026', term: 'Term 1', amount: 1500, paid: 1000, status: 'Partial', dueDate: '2025-02-01' },
            { studentId: 3, academicYear: '2025-2026', term: 'Term 1', amount: 1500, paid: 0, status: 'Unpaid', dueDate: '2025-02-01' },
            { studentId: 4, academicYear: '2025-2026', term: 'Term 1', amount: 1500, paid: 1500, status: 'Paid', dueDate: '2025-02-01' }
        ];
        fees.forEach(f => store.add(f));
    },

    seedAttendance(store) {
        const attendance = [
            { studentId: 1, date: '2026-03-01', status: 'Present', remarks: '' },
            { studentId: 1, date: '2026-03-02', status: 'Present', remarks: '' },
            { studentId: 1, date: '2026-03-03', status: 'Absent', remarks: 'Sick' },
            { studentId: 2, date: '2026-03-01', status: 'Present', remarks: '' },
            { studentId: 2, date: '2026-03-02', status: 'Present', remarks: '' }
        ];
        attendance.forEach(a => store.add(a));
    },

    seedAnnouncements(store) {
        const announcements = [
            { title: 'Mid-Term Exams', category: 'Academic', priority: 'High', postedBy: 'Principal', date: '2026-03-01', status: 'Active' },
            { title: 'PTA Meeting', category: 'Event', priority: 'Medium', postedBy: 'Admin', date: '2026-02-28', status: 'Active' },
            { title: 'Sports Day', category: 'Event', priority: 'Low', postedBy: 'PE Teacher', date: '2026-02-25', status: 'Active' }
        ];
        announcements.forEach(a => store.add(a));
    },

    seedVisitors(store) {
        const visitors = [
            { name: 'Mr. Henry Ford', phone: '0245123456', reason: 'Parent Visit', personToSee: 'Principal', date: '2026-03-01', timeIn: '09:00', timeOut: '10:30', status: 'Checked Out' },
            { name: 'Mrs. Grace Adom', phone: '0245234567', reason: 'Catering Business', personToSee: 'Caterer', date: '2026-03-02', timeIn: '08:00', timeOut: '', status: 'Checked In' }
        ];
        visitors.forEach(v => store.add(v));
    },

    seedSettings(store) {
        const settings = [
            { key: 'schoolName', value: 'Suhum Senior High Technical School' },
            { key: 'schoolAddress', value: 'Suhum, Eastern Region' },
            { key: 'academicYear', value: '2025-2026' },
            { key: 'term', value: 'Term 2' }
        ];
        settings.forEach(s => store.add(s));
    },

    // Helper methods
    async getAll(storeName) {
        return new Promise((resolve, reject) => {
            const tx = this.db.transaction(storeName, 'readonly');
            const store = tx.objectStore(storeName);
            const request = store.getAll();
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    },

    async getByIndex(storeName, indexName, value) {
        return new Promise((resolve, reject) => {
            const tx = this.db.transaction(storeName, 'readonly');
            const store = tx.objectStore(storeName);
            const index = store.index(indexName);
            const request = index.get(value);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    },

    async login(username, password, code, role) {
        const users = await this.getAll('users');
        const user = users.find(u => 
            u.username === username && 
            u.password === password && 
            u.code === code && 
            u.role === role
        );
        return user;
    }
};

// Initialize database on load
let Database;
(async () => {
    await SchoolDB.open();
    console.log('Database initialized successfully!');
    // Make Database globally available
    window.Database = SchoolDB;
})();
