/**
 * Industrial School Management System
 * Database Module - JavaScript Backend
 * Uses localStorage to simulate Microsoft Access database
 */

const Database = {
    // Initialize database with sample data
    init() {
        if (!localStorage.getItem('schoolDB')) {
            const initialData = {
                users: [
                    { id: 1, username: 'admin', password: 'admin123', code: 'admin2026', role: 'admin', name: 'Administrator', email: 'admin@school.edu' },
                    { id: 2, username: 'principal', password: 'principal123', code: 'principal2026', role: 'principal', name: 'Dr. John Smith', email: 'principal@school.edu' },
                    { id: 3, username: 'teacher', password: 'teacher123', code: 'teacher2026', role: 'teacher', name: 'Mr. David Mensah', email: 'teacher@school.edu' },
                    { id: 4, username: 'accountant', password: 'accountant123', code: 'account2026', role: 'accountant', name: 'Mrs. Sarah Osei', email: 'accountant@school.edu' },
                    { id: 5, username: 'registrar', password: 'registrar123', code: 'registrar2026', role: 'registrar', name: 'Mr. James Kofi', email: 'registrar@school.edu' },
                    { id: 6, username: 'librarian', password: 'librarian123', code: 'librarian2026', role: 'librarian', name: 'Mrs. Mary Akosua', email: 'librarian@school.edu' },
                    { id: 7, username: 'storekeeper', password: 'storekeeper123', code: 'store2026', role: 'storekeeper', name: 'Mr. Robert Doe', email: 'storekeeper@school.edu' },
                    { id: 8, username: 'parent', password: 'parent123', code: 'parent2026', role: 'parent', name: 'Mr. Albert Wiredu', email: 'parent@school.edu' },
                    { id: 9, username: 'student', password: 'student123', code: 'student2026', role: 'student', name: 'John Doe', email: 'student@school.edu' }
                ],
                students: [
                    { id: 1, admissionNo: 'STJ/2024/001', firstName: 'Kwame', lastName: 'Asante', gender: 'Male', dateOfBirth: '2010-05-15', class: 'Form 1', stream: 'A', section: 'General', phone: '0244123456', parentName: 'Mr. John Asante', parentPhone: '0244123457', address: 'Accra', status: 'Active' },
                    { id: 2, admissionNo: 'STJ/2024/002', firstName: 'Akua', lastName: 'Mensah', gender: 'Female', dateOfBirth: '2010-08-20', class: 'Form 1', stream: 'B', section: 'General', phone: '0245789012', parentName: 'Mrs. Grace Mensah', parentPhone: '0245789013', address: 'Tema', status: 'Active' },
                    { id: 3, admissionNo: 'STJ/2024/003', firstName: 'Kofi', lastName: 'Osei', gender: 'Male', dateOfBirth: '2010-03-10', class: 'Form 2', stream: 'A', section: 'Technical', phone: '0245345678', parentName: 'Mr. David Osei', parentPhone: '0245345679', address: 'Kumasi', status: 'Active' },
                    { id: 4, admissionNo: 'STJ/2024/004', firstName: 'Abena', lastName: 'Serwaa', gender: 'Female', dateOfBirth: '2010-11-25', class: 'Form 2', stream: 'A', section: 'Vocational', phone: '0245567890', parentName: 'Mrs. Comfort Serwaa', parentPhone: '0245567891', address: 'Cape Coast', status: 'Active' },
                    { id: 5, admissionNo: 'STJ/2023/005', firstName: 'Yaw', lastName: ' Boateng', gender: 'Male', dateOfBirth: '2009-07-08', class: 'Form 3', stream: 'A', section: 'Technical', phone: '0245789014', parentName: 'Mr. Paul Boateng', parentPhone: '0245789015', address: 'Takoradi', status: 'Active' }
                ],
                teachers: [
                    { id: 1, staffNo: 'STJ/T/001', firstName: 'David', lastName: 'Mensah', gender: 'Male', qualification: 'M.Ed', subject: 'Mathematics', phone: '0244123458', email: 'david.mensah@school.edu', hireDate: '2015-01-15', status: 'Active' },
                    { id: 2, staffNo: 'STJ/T/002', firstName: 'Grace', lastName: 'Osei', gender: 'Female', qualification: 'B.Sc', subject: 'Science', phone: '0244123459', email: 'grace.osei@school.edu', hireDate: '2016-03-20', status: 'Active' },
                    { id: 3, staffNo: 'STJ/T/003', firstName: 'James', lastName: 'Kofi', gender: 'Male', qualification: 'M.Sc', subject: 'Technical Drawing', phone: '0244123460', email: 'james.kofi@school.edu', hireDate: '2017-06-10', status: 'Active' },
                    { id: 4, staffNo: 'STJ/T/004', firstName: 'Mary', lastName: 'Adomako', gender: 'Female', qualification: 'B.A', subject: 'English', phone: '0244123461', email: 'mary.adomako@school.edu', hireDate: '2018-09-01', status: 'Active' },
                    { id: 5, staffNo: 'STJ/T/005', firstName: 'Robert', lastName: 'Tetteh', gender: 'Male', qualification: 'HND', subject: 'Automotive', phone: '0244123462', email: 'robert.tetteh@school.edu', hireDate: '2019-02-15', status: 'Active' }
                ],
                classes: [
                    { id: 1, name: 'Form 1', stream: 'A', section: 'General', capacity: 40, students: 35, classTeacher: 'Mr. David Mensah', room: 'Rm 101' },
                    { id: 2, name: 'Form 1', stream: 'B', section: 'General', capacity: 40, students: 32, classTeacher: 'Mrs. Grace Osei', room: 'Rm 102' },
                    { id: 3, name: 'Form 2', stream: 'A', section: 'Technical', capacity: 35, students: 28, classTeacher: 'Mr. James Kofi', room: 'Tech 1' },
                    { id: 4, name: 'Form 2', stream: 'A', section: 'Vocational', capacity: 30, students: 25, classTeacher: 'Mrs. Mary Adomako', room: 'Voc 1' },
                    { id: 5, name: 'Form 3', stream: 'A', section: 'Technical', capacity: 35, students: 30, classTeacher: 'Mr. Robert Tetteh', room: 'Tech 2' }
                ],
                subjects: [
                    { id: 1, name: 'Mathematics', code: 'MTH001', category: 'Core', department: 'Science', teacher: 'Mr. David Mensah', credits: 4 },
                    { id: 2, name: 'English', code: 'ENG001', category: 'Core', department: 'Languages', teacher: 'Mrs. Mary Adomako', credits: 4 },
                    { id: 3, name: 'Science', code: 'SCI001', category: 'Core', department: 'Science', teacher: 'Mrs. Grace Osei', credits: 4 },
                    { id: 4, name: 'Technical Drawing', code: 'TD001', category: 'Technical', department: 'Technical', teacher: 'Mr. James Kofi', credits: 3 },
                    { id: 5, name: 'Automotive', code: 'AUT001', category: 'Vocational', department: 'Vocational', teacher: 'Mr. Robert Tetteh', credits: 3 },
                    { id: 6, name: 'Information Technology', code: 'IT001', category: 'Technical', department: 'Technical', teacher: 'Mrs. Grace Osei', credits: 3 }
                ],
                attendance: [
                    { id: 1, studentId: 1, date: '2026-03-07', status: 'Present', remarks: '' },
                    { id: 2, studentId: 2, date: '2026-03-07', status: 'Present', remarks: '' },
                    { id: 3, studentId: 3, date: '2026-03-07', status: 'Present', remarks: '' },
                    { id: 4, studentId: 4, date: '2026-03-07', status: 'Absent', remarks: 'Sick' },
                    { id: 5, studentId: 5, date: '2026-03-07', status: 'Present', remarks: '' }
                ],
                grades: [
                    { id: 1, studentId: 1, subjectId: 1, caScore: 85, examScore: 78, total: 163, grade: 'A', term: 'Term 1', year: 2026 },
                    { id: 2, studentId: 1, subjectId: 2, caScore: 72, examScore: 65, total: 137, grade: 'B', term: 'Term 1', year: 2026 },
                    { id: 3, studentId: 2, subjectId: 1, caScore: 90, examScore: 88, total: 178, grade: 'A+', term: 'Term 1', year: 2026 },
                    { id: 4, studentId: 3, subjectId: 4, caScore: 78, examScore: 82, total: 160, grade: 'A', term: 'Term 1', year: 2026 }
                ],
                fees: [
                    { id: 1, studentId: 1, feeType: 'Tuition', amount: 1500, dueDate: '2026-03-31', paidDate: '2026-02-15', status: 'Paid', receiptNo: 'RCP001' },
                    { id: 2, studentId: 2, feeType: 'Tuition', amount: 1500, dueDate: '2026-03-31', paidDate: '2026-02-20', status: 'Paid', receiptNo: 'RCP002' },
                    { id: 3, studentId: 3, feeType: 'Tuition', amount: 1800, dueDate: '2026-03-31', paidDate: null, status: 'Unpaid', receiptNo: null },
                    { id: 4, studentId: 4, feeType: 'Tuition', amount: 1600, dueDate: '2026-03-31', paidDate: '2026-03-01', status: 'Paid', receiptNo: 'RCP003' },
                    { id: 5, studentId: 5, feeType: 'Tuition', amount: 1800, dueDate: '2026-03-31', paidDate: null, status: 'Unpaid', receiptNo: null }
                ],
                staff: [
                    { id: 1, staffNo: 'STJ/S/001', firstName: 'Sarah', lastName: 'Osei', gender: 'Female', position: 'Accountant', department: 'Finance', phone: '0245123456', salary: 3500, status: 'Active' },
                    { id: 2, staffNo: 'STJ/S/002', firstName: 'Michael', lastName: 'Tetteh', gender: 'Male', position: 'Security', department: 'Security', phone: '0245123457', salary: 1200, status: 'Active' },
                    { id: 3, staffNo: 'STJ/S/003', firstName: 'Grace', lastName: 'Adom', gender: 'Female', position: 'Caterer', department: 'Catering', phone: '0245123458', salary: 1500, status: 'Active' },
                    { id: 4, staffNo: 'STJ/S/004', firstName: 'John', lastName: 'Kofi', gender: 'Male', position: 'Storekeeper', department: 'Store', phone: '0245123459', salary: 1800, status: 'Active' }
                ],
                announcements: [
                    { id: 1, title: 'Mid-Term Examinations', content: 'Mid-term examinations will be held from March 15-20, 2026. All students must prepare accordingly.', category: 'Academic', priority: 'High', postedBy: 'Principal', date: '2026-03-07', status: 'Active' },
                    { id: 2, title: 'PTA Meeting', content: 'Parent-Teacher Association meeting scheduled for Friday at 2:00 PM.', category: 'General', priority: 'Normal', postedBy: 'Administrator', date: '2026-03-06', status: 'Active' },
                    { id: 3, title: 'Sports Day', content: 'Annual Sports Day will be held on March 25th. All students must participate.', category: 'Events', priority: 'Normal', postedBy: 'Sports Master', date: '2026-03-05', status: 'Active' }
                ],
                library: [
                    { id: 1, bookNo: 'LIB/001', title: 'Advanced Mathematics', author: 'J. Smith', category: 'Academic', quantity: 10, available: 8, status: 'Available' },
                    { id: 2, bookNo: 'LIB/002', title: 'Technical Drawing Basics', author: 'K. Johnson', category: 'Technical', quantity: 5, available: 4, status: 'Available' },
                    { id: 3, bookNo: 'LIB/003', title: 'Automotive Mechanics', author: 'R. Williams', category: 'Vocational', quantity: 8, available: 8, status: 'Available' }
                ],
                inventory: [
                    { id: 1, itemCode: 'INV/001', itemName: 'Whiteboard Markers', category: 'Stationery', quantity: 50, unit: 'Pieces', reorderLevel: 20 },
                    { id: 2, itemCode: 'INV/002', itemName: 'A4 Paper', category: 'Stationery', quantity: 100, unit: 'Reams', reorderLevel: 30 },
                    { id: 3, itemCode: 'INV/003', itemName: 'Chalk', category: 'Stationery', quantity: 200, unit: 'Boxes', reorderLevel: 50 }
                ],
                timetable: [
                    { id: 1, day: 'Monday', period: 1, class: 'Form 1A', subject: 'Mathematics', teacher: 'Mr. David Mensah', room: 'Rm 101', time: '07:30-08:15' },
                    { id: 2, day: 'Monday', period: 2, class: 'Form 1A', subject: 'English', teacher: 'Mrs. Mary Adomako', room: 'Rm 101', time: '08:15-09:00' },
                    { id: 3, day: 'Monday', period: 3, class: 'Form 2A', subject: 'Technical Drawing', teacher: 'Mr. James Kofi', room: 'Tech 1', time: '09:00-09:45' }
                ],
                settings: {
                    schoolName: "St. John's Technical Institute",
                    schoolAddress: 'Industrial Zone, Ghana',
                    schoolPhone: '0302-123-456',
                    schoolEmail: 'info@stjohnstech.edu.gh',
                    academicYear: '2025-2026',
                    term: 'Term 2'
                }
            };
            localStorage.setItem('schoolDB', JSON.stringify(initialData));
        }
    },

    // Get database
    getDB() {
        return JSON.parse(localStorage.getItem('schoolDB'));
    },

    // Save database
    saveDB(data) {
        localStorage.setItem('schoolDB', JSON.stringify(data));
    },

    // Get table data
    getTable(tableName) {
        const db = this.getDB();
        return db[tableName] || [];
    },

    // Add record
    addRecord(tableName, record) {
        const db = this.getDB();
        if (!db[tableName]) db[tableName] = [];
        record.id = db[tableName].length + 1;
        db[tableName].push(record);
        this.saveDB(db);
        return record;
    },

    // Update record
    updateRecord(tableName, id, updates) {
        const db = this.getDB();
        const index = db[tableName].findIndex(r => r.id === id);
        if (index !== -1) {
            db[tableName][index] = { ...db[tableName][index], ...updates };
            this.saveDB(db);
            return db[tableName][index];
        }
        return null;
    },

    // Delete record
    deleteRecord(tableName, id) {
        const db = this.getDB();
        db[tableName] = db[tableName].filter(r => r.id !== id);
        this.saveDB(db);
    },

    // Get statistics
    getStats() {
        const db = this.getDB();
        return {
            totalStudents: db.students?.length || 0,
            totalTeachers: db.teachers?.length || 0,
            totalStaff: db.staff?.length || 0,
            totalClasses: db.classes?.length || 0,
            totalSubjects: db.subjects?.length || 0,
            totalFees: db.fees?.length || 0,
            paidFees: db.fees?.filter(f => f.status === 'Paid').length || 0,
            unpaidFees: db.fees?.filter(f => f.status === 'Unpaid').length || 0,
            totalBooks: db.library?.length || 0,
            announcements: db.announcements?.length || 0
        };
    },

    // Search records
    search(tableName, query) {
        const data = this.getTable(tableName);
        const lowerQuery = query.toLowerCase();
        return data.filter(record => {
            return Object.values(record).some(value => 
                String(value).toLowerCase().includes(lowerQuery)
            );
        });
    }
};

// Initialize database on load
Database.init();
