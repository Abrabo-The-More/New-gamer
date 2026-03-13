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
                // Users for Login
                users: [
                    // Admin
                    { id: 1, username: 'admin', password: 'admin123', code: 'admin2026', role: 'admin', name: 'Administrator', email: 'admin@school.edu' },
                    // Principal
                    { id: 2, username: 'principal', password: 'principal123', code: 'principal2026', role: 'principal', name: 'Dr. John Smith', email: 'principal@school.edu' },
                    // Teaching Staff
                    { id: 3, username: 'teacher', password: 'teacher123', code: 'teacher2026', role: 'teacher', name: 'Mr. David Mensah', email: 'teacher@school.edu' },
                    { id: 4, username: 'david.mensah', password: 'david123', code: 'david2026', role: 'teacher', name: 'Mr. David Mensah', email: 'david.mensah@school.edu' },
                    { id: 5, username: 'grace.osei', password: 'grace123', code: 'grace2026', role: 'teacher', name: 'Mrs. Grace Osei', email: 'grace.osei@school.edu' },
                    // Non-Teaching Staff
                    { id: 6, username: 'accountant', password: 'accountant123', code: 'account2026', role: 'accountant', name: 'Mrs. Sarah Osei', email: 'accountant@school.edu' },
                    { id: 7, username: 'registrar', password: 'registrar123', code: 'registrar2026', role: 'registrar', name: 'Mr. James Kofi', email: 'registrar@school.edu' },
                    { id: 8, username: 'librarian', password: 'librarian123', code: 'librarian2026', role: 'librarian', name: 'Mrs. Mary Akosua', email: 'librarian@school.edu' },
                    { id: 9, username: 'storekeeper', password: 'storekeeper123', code: 'store2026', role: 'storekeeper', name: 'Mr. Robert Doe', email: 'storekeeper@school.edu' },
                    // Security
                    { id: 10, username: 'security', password: 'security123', code: 'security2026', role: 'security', name: 'Mr. Michael Tetteh', email: 'security@school.edu' },
                    // Caterer
                    { id: 11, username: 'caterer', password: 'caterer123', code: 'caterer2026', role: 'caterer', name: 'Mrs. Grace Adom', email: 'caterer@school.edu' },
                    // Nurse
                    { id: 12, username: 'nurse', password: 'nurse123', code: 'nurse2026', role: 'nurse', name: 'Mrs. Mary Akosua', email: 'nurse@school.edu' },
                    // Secretary
                    { id: 13, username: 'secretary', password: 'secretary123', code: 'secret2026', role: 'secretary', name: 'Mrs. Anna Mensah', email: 'secretary@school.edu' },
                    // Parents
                    { id: 14, username: 'parent', password: 'parent123', code: 'parent2026', role: 'parent', name: 'Mr. John Asante', email: 'parent@school.edu' },
                    { id: 15, username: 'j.asante', password: 'asante123', code: 'asante2026', role: 'parent', name: 'Mr. John Asante', email: 'john.asante@email.com' },
                    { id: 16, username: 'p.mensah', password: 'mensah123', code: 'paul2026', role: 'parent', name: 'Mr. Paul Mensah', email: 'paul.mensah@email.com' },
                    // Students
                    { id: 17, username: 'student', password: 'student123', code: 'student2026', role: 'student', name: 'John Doe', email: 'student@school.edu' },
                    { id: 18, username: 'kwame.asante', password: 'kwame123', code: 'kwame2026', role: 'student', name: 'Kwame Asante', email: 'kwame.asante@student.edu', studentId: 1 },
                    { id: 19, username: 'akua.mensah', password: 'akua123', code: 'akua2026', role: 'student', name: 'Akua Mensah', email: 'akua.mensah@student.edu', studentId: 2 },
                    { id: 20, username: 'kofi.osei', password: 'kofi123', code: 'kofi2026', role: 'student', name: 'Kofi Osei', email: 'kofi.osei@student.edu', studentId: 3 },
                    // Visitors/Outsiders
                    { id: 21, username: 'visitor', password: 'visitor123', code: 'visitor2026', role: 'visitor', name: 'Visitor Account', email: 'visitor@school.edu' },
                    { id: 22, username: 'henry.ford', password: 'henry123', code: 'henry2026', role: 'visitor', name: 'Mr. Henry Ford', email: 'henry@email.com' }
                ],

                // Students Data
                students: [
                    { id: 1, admissionNo: 'STJ/2024/001', firstName: 'Kwame', lastName: 'Asante', gender: 'Male', dateOfBirth: '2010-05-15', classId: 1, stream: 'A', section: 'General', phone: '0244123456', email: 'kwame.asante@student.edu', parentId: 1, address: 'Accra', status: 'Active', admissionDate: '2024-01-15', bloodGroup: 'O+', allergies: 'None', emergencyContact: '0244123457', photo: '' },
                    { id: 2, admissionNo: 'STJ/2024/002', firstName: 'Akua', lastName: 'Mensah', gender: 'Female', dateOfBirth: '2010-08-20', classId: 1, stream: 'B', section: 'General', phone: '0245789012', email: 'akua.mensah@student.edu', parentId: 2, address: 'Tema', status: 'Active', admissionDate: '2024-01-15', bloodGroup: 'A+', allergies: 'Peanuts', emergencyContact: '0245789013', photo: '' },
                    { id: 3, admissionNo: 'STJ/2024/003', firstName: 'Kofi', lastName: 'Osei', gender: 'Male', dateOfBirth: '2010-03-10', classId: 2, stream: 'A', section: 'Technical', phone: '0245345678', email: 'kofi.osei@student.edu', parentId: 3, address: 'Kumasi', status: 'Active', admissionDate: '2024-01-15', bloodGroup: 'B+', allergies: 'None', emergencyContact: '0245345679', photo: '' },
                    { id: 4, admissionNo: 'STJ/2024/004', firstName: 'Abena', lastName: 'Serwaa', gender: 'Female', dateOfBirth: '2010-11-25', classId: 2, stream: 'A', section: 'Vocational', phone: '0245567890', email: 'abena.serwaa@student.edu', parentId: 4, address: 'Cape Coast', status: 'Active', admissionDate: '2024-01-15', bloodGroup: 'AB+', allergies: 'Dust', emergencyContact: '0245567891', photo: '' },
                    { id: 5, admissionNo: 'STJ/2023/005', firstName: 'Yaw', lastName: 'Boateng', gender: 'Male', dateOfBirth: '2009-07-08', classId: 3, stream: 'A', section: 'Technical', phone: '0245789014', email: 'yaw.boateng@student.edu', parentId: 5, address: 'Takoradi', status: 'Active', admissionDate: '2023-01-10', bloodGroup: 'O-', allergies: 'None', emergencyContact: '0245789015', photo: '' }
                ],

                // Parents Data
                parents: [
                    { id: 1, fatherName: 'Mr. John Asante', motherName: 'Mrs. Grace Asante', phone: '0244123457', altPhone: '0244123458', email: 'john.asante@email.com', occupation: 'Engineer', address: 'Accra', city: 'Accra', region: 'Greater Accra', studentId: 1, relationship: 'Father' },
                    { id: 2, fatherName: 'Mr. Paul Mensah', motherName: 'Mrs. Mary Mensah', phone: '0245789013', altPhone: '0245789014', email: 'paul.mensah@email.com', occupation: 'Doctor', address: 'Tema', city: 'Tema', region: 'Greater Accra', studentId: 2, relationship: 'Father' },
                    { id: 3, fatherName: 'Mr. David Osei', motherName: 'Mrs. Comfort Osei', phone: '0245345679', altPhone: '0245345680', email: 'david.osei@email.com', occupation: 'Teacher', address: 'Kumasi', city: 'Kumasi', region: 'Ashanti', studentId: 3, relationship: 'Father' },
                    { id: 4, fatherName: 'Mr. James Serwaa', motherName: 'Mrs. Martha Serwaa', phone: '0245567891', altPhone: '0245567892', email: 'james.serwaa@email.com', occupation: 'Businessman', address: 'Cape Coast', city: 'Cape Coast', region: 'Central', studentId: 4, relationship: 'Father' },
                    { id: 5, fatherName: 'Mr. Robert Boateng', motherName: 'Mrs. Elizabeth Boateng', phone: '0245789015', altPhone: '0245789016', email: 'robert.boateng@email.com', occupation: 'Farmer', address: 'Takoradi', city: 'Takoradi', region: 'Western', studentId: 5, relationship: 'Father' }
                ],

                // Teaching Staff (Teachers)
                teachers: [
                    { id: 1, staffNo: 'STJ/T/001', firstName: 'David', lastName: 'Mensah', gender: 'Male', qualification: 'M.Ed', subject: 'Mathematics', phone: '0244123458', email: 'david.mensah@school.edu', hireDate: '2015-01-15', salary: 4500, status: 'Active', department: 'Science', experience: 10 },
                    { id: 2, staffNo: 'STJ/T/002', firstName: 'Grace', lastName: 'Osei', gender: 'Female', qualification: 'B.Sc', subject: 'Science', phone: '0244123459', email: 'grace.osei@school.edu', hireDate: '2016-03-20', salary: 4200, status: 'Active', department: 'Science', experience: 8 },
                    { id: 3, staffNo: 'STJ/T/003', firstName: 'James', lastName: 'Kofi', gender: 'Male', qualification: 'M.Sc', subject: 'Technical Drawing', phone: '0244123460', email: 'james.kofi@school.edu', hireDate: '2017-06-10', salary: 4000, status: 'Active', department: 'Technical', experience: 7 },
                    { id: 4, staffNo: 'STJ/T/004', firstName: 'Mary', lastName: 'Adomako', gender: 'Female', qualification: 'B.A', subject: 'English', phone: '0244123461', email: 'mary.adomako@school.edu', hireDate: '2018-09-01', salary: 3800, status: 'Active', department: 'Languages', experience: 6 },
                    { id: 5, staffNo: 'STJ/T/005', firstName: 'Robert', lastName: 'Tetteh', gender: 'Male', qualification: 'HND', subject: 'Automotive', phone: '0244123462', email: 'robert.tetteh@school.edu', hireDate: '2019-02-15', salary: 3600, status: 'Active', department: 'Vocational', experience: 5 }
                ],

                // Non-Teaching Staff
                nonTeachingStaff: [
                    { id: 1, staffNo: 'STJ/NT/001', firstName: 'Sarah', lastName: 'Osei', gender: 'Female', position: 'Accountant', department: 'Finance', phone: '0245123456', salary: 3500, hireDate: '2018-01-10', status: 'Active', duties: 'Financial management, fee collection' },
                    { id: 2, staffNo: 'STJ/NT/002', firstName: 'Michael', lastName: 'Tetteh', gender: 'Male', position: 'Security', department: 'Security', phone: '0245123457', salary: 1200, hireDate: '2019-03-15', status: 'Active', duties: 'Campus security, gate keeping' },
                    { id: 3, staffNo: 'STJ/NT/003', firstName: 'Grace', lastName: 'Adom', gender: 'Female', position: 'Caterer', department: 'Catering', phone: '0245123458', salary: 1500, hireDate: '2020-01-20', status: 'Active', duties: 'Meal preparation, cafeteria management' },
                    { id: 4, staffNo: 'STJ/NT/004', firstName: 'John', lastName: 'Kofi', gender: 'Male', position: 'Storekeeper', department: 'Store', phone: '0245123459', salary: 1800, hireDate: '2019-06-01', status: 'Active', duties: 'Inventory management, supplies' },
                    { id: 5, staffNo: 'STJ/NT/005', firstName: 'Anna', lastName: 'Mensah', gender: 'Female', position: 'Secretary', department: 'Administration', phone: '0245123460', salary: 2500, hireDate: '2017-09-01', status: 'Active', duties: 'Reception, document management' },
                    { id: 6, staffNo: 'STJ/NT/006', firstName: 'Peter', lastName: 'Owusu', gender: 'Male', position: 'Cleaner', department: 'Environment', phone: '0245123461', salary: 1000, hireDate: '2020-05-01', status: 'Active', duties: 'Cleaning, sanitation' },
                    { id: 7, staffNo: 'STJ/NT/007', firstName: 'Mary', lastName: 'Akosua', gender: 'Female', position: 'Nurse', department: 'Health', phone: '0245123462', salary: 3200, hireDate: '2021-01-10', status: 'Active', duties: 'First aid, health monitoring' }
                ],

                // Outsiders / Visitors
                visitors: [
                    { id: 1, visitorId: 'VIS/2026/001', name: 'Mr. Henry Ford', phone: '0201234567', purpose: 'Parent Meeting', host: 'Mr. David Mensah', date: '2026-03-05', timeIn: '09:00', timeOut: '10:30', status: 'Checked Out', remarks: 'Discussed student progress' },
                    { id: 2, visitorId: 'VIS/2026/002', name: 'Mrs. Linda Cole', phone: '0202345678', purpose: 'Job Interview', host: 'Principal', date: '2026-03-06', timeIn: '08:30', timeOut: '11:00', status: 'Checked Out', remarks: 'Teaching position interview' },
                    { id: 3, visitorId: 'VIS/2026/003', name: 'Mr. Samuel Doe', phone: '0203456789', purpose: 'Supplier Visit', host: 'Storekeeper', date: '2026-03-07', timeIn: '10:00', timeOut: '', status: 'Checked In', remarks: 'Delivering office supplies' },
                    { id: 4, visitorId: 'VIS/2026/004', name: 'Dr. James Wilson', phone: '0204567890', purpose: 'Health Check', host: 'Nurse', date: '2026-03-07', timeIn: '11:00', timeOut: '', status: 'Checked In', remarks: 'Annual health screening' }
                ],

                // Classes
                classes: [
                    { id: 1, name: 'Form 1', stream: 'A', section: 'General', capacity: 40, classTeacherId: 1, room: 'Rm 101' },
                    { id: 2, name: 'Form 1', stream: 'B', section: 'General', capacity: 40, classTeacherId: 2, room: 'Rm 102' },
                    { id: 3, name: 'Form 2', stream: 'A', section: 'Technical', capacity: 35, classTeacherId: 3, room: 'Tech 1' },
                    { id: 4, name: 'Form 2', stream: 'A', section: 'Vocational', capacity: 30, classTeacherId: 4, room: 'Voc 1' },
                    { id: 5, name: 'Form 3', stream: 'A', section: 'Technical', capacity: 35, classTeacherId: 5, room: 'Tech 2' }
                ],

                // Subjects
                subjects: [
                    { id: 1, name: 'Mathematics', code: 'MTH001', category: 'Core', department: 'Science', teacherId: 1, credits: 4 },
                    { id: 2, name: 'English', code: 'ENG001', category: 'Core', department: 'Languages', teacherId: 4, credits: 4 },
                    { id: 3, name: 'Science', code: 'SCI001', category: 'Core', department: 'Science', teacherId: 2, credits: 4 },
                    { id: 4, name: 'Technical Drawing', code: 'TD001', category: 'Technical', department: 'Technical', teacherId: 3, credits: 3 },
                    { id: 5, name: 'Automotive', code: 'AUT001', category: 'Vocational', department: 'Vocational', teacherId: 5, credits: 3 },
                    { id: 6, name: 'Information Technology', code: 'IT001', category: 'Technical', department: 'Technical', teacherId: 2, credits: 3 }
                ],

                // Attendance
                attendance: [
                    { id: 1, studentId: 1, date: '2026-03-07', status: 'Present', remarks: '' },
                    { id: 2, studentId: 2, date: '2026-03-07', status: 'Present', remarks: '' },
                    { id: 3, studentId: 3, date: '2026-03-07', status: 'Present', remarks: '' },
                    { id: 4, studentId: 4, date: '2026-03-07', status: 'Absent', remarks: 'Sick' },
                    { id: 5, studentId: 5, date: '2026-03-07', status: 'Present', remarks: '' }
                ],

                // Grades
                grades: [
                    { id: 1, studentId: 1, subjectId: 1, caScore: 85, examScore: 78, total: 163, grade: 'A', term: 'Term 1', year: 2026 },
                    { id: 2, studentId: 1, subjectId: 2, caScore: 72, examScore: 65, total: 137, grade: 'B', term: 'Term 1', year: 2026 },
                    { id: 3, studentId: 2, subjectId: 1, caScore: 90, examScore: 88, total: 178, grade: 'A+', term: 'Term 1', year: 2026 },
                    { id: 4, studentId: 3, subjectId: 4, caScore: 78, examScore: 82, total: 160, grade: 'A', term: 'Term 1', year: 2026 }
                ],

                // Fees
                fees: [
                    { id: 1, studentId: 1, feeType: 'Tuition', amount: 1500, dueDate: '2026-03-31', paidDate: '2026-02-15', status: 'Paid', receiptNo: 'RCP001' },
                    { id: 2, studentId: 2, feeType: 'Tuition', amount: 1500, dueDate: '2026-03-31', paidDate: '2026-02-20', status: 'Paid', receiptNo: 'RCP002' },
                    { id: 3, studentId: 3, feeType: 'Tuition', amount: 1800, dueDate: '2026-03-31', paidDate: null, status: 'Unpaid', receiptNo: null },
                    { id: 4, studentId: 4, feeType: 'Tuition', amount: 1600, dueDate: '2026-03-31', paidDate: '2026-03-01', status: 'Paid', receiptNo: 'RCP003' },
                    { id: 5, studentId: 5, feeType: 'Tuition', amount: 1800, dueDate: '2026-03-31', paidDate: null, status: 'Unpaid', receiptNo: null }
                ],

                // Library
                library: [
                    { id: 1, bookNo: 'LIB/001', title: 'Advanced Mathematics', author: 'J. Smith', category: 'Academic', quantity: 10, available: 8, status: 'Available', publisher: 'Academic Press', year: 2020 },
                    { id: 2, bookNo: 'LIB/002', title: 'Technical Drawing Basics', author: 'K. Johnson', category: 'Technical', quantity: 5, available: 4, status: 'Available', publisher: 'Tech Publishers', year: 2019 },
                    { id: 3, bookNo: 'LIB/003', title: 'Automotive Mechanics', author: 'R. Williams', category: 'Vocational', quantity: 8, available: 8, status: 'Available', publisher: 'Auto Books', year: 2021 }
                ],

                // Inventory
                inventory: [
                    { id: 1, itemCode: 'INV/001', itemName: 'Whiteboard Markers', category: 'Stationery', quantity: 50, unit: 'Pieces', reorderLevel: 20, supplier: 'Office Solutions' },
                    { id: 2, itemCode: 'INV/002', itemName: 'A4 Paper', category: 'Stationery', quantity: 100, unit: 'Reams', reorderLevel: 30, supplier: 'Paper World' },
                    { id: 3, itemCode: 'INV/003', itemName: 'Chalk', category: 'Stationery', quantity: 200, unit: 'Boxes', reorderLevel: 50, supplier: 'School Supplies' }
                ],

                // Timetable
                timetable: [
                    { id: 1, day: 'Monday', period: 1, classId: 1, subjectId: 1, teacherId: 1, room: 'Rm 101', time: '07:30-08:15' },
                    { id: 2, day: 'Monday', period: 2, classId: 1, subjectId: 2, teacherId: 4, room: 'Rm 101', time: '08:15-09:00' },
                    { id: 3, day: 'Monday', period: 3, classId: 2, subjectId: 4, teacherId: 3, room: 'Tech 1', time: '09:00-09:45' }
                ],

                // Announcements
                announcements: [
                    { id: 1, title: 'Mid-Term Examinations', content: 'Mid-term examinations will be held from March 15-20, 2026. All students must prepare accordingly.', category: 'Academic', priority: 'High', postedBy: 'Principal', date: '2026-03-07', status: 'Active' },
                    { id: 2, title: 'PTA Meeting', content: 'Parent-Teacher Association meeting scheduled for Friday at 2:00 PM.', category: 'General', priority: 'Normal', postedBy: 'Administrator', date: '2026-03-06', status: 'Active' },
                    { id: 3, title: 'Sports Day', content: 'Annual Sports Day will be held on March 25th. All students must participate.', category: 'Events', priority: 'Normal', postedBy: 'Sports Master', date: '2026-03-05', status: 'Active' }
                ],

                // Events
                events: [
                    { id: 1, title: 'Inter-Class Sports', date: '2026-03-25', venue: 'School Field', time: '08:00-16:00', organizer: 'Sports Department', status: 'Upcoming' },
                    { id: 2, title: 'Career Day', date: '2026-04-10', venue: 'Assembly Hall', time: '09:00-14:00', organizer: 'Career Guidance', status: 'Upcoming' },
                    { id: 3, title: 'Science Fair', date: '2026-04-20', venue: 'School Hall', time: '10:00-16:00', organizer: 'Science Department', status: 'Upcoming' }
                ],

                // Settings
                settings: {
                    schoolName: "Suhum Senior High Technical School",
                    schoolAddress: 'Suhum, Eastern Region',
                    town: 'Suhum',
                    region: 'Eastern Region',
                    country: 'Ghana',
                    schoolPhone: '0302-123-456',
                    schoolEmail: 'info@suhumsrhs.edu.gh',
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
            totalNonTeachingStaff: db.nonTeachingStaff?.length || 0,
            totalParents: db.parents?.length || 0,
            totalVisitors: db.visitors?.length || 0,
            totalClasses: db.classes?.length || 0,
            totalSubjects: db.subjects?.length || 0,
            totalFees: db.fees?.length || 0,
            paidFees: db.fees?.filter(f => f.status === 'Paid').length || 0,
            unpaidFees: db.fees?.filter(f => f.status === 'Unpaid').length || 0,
            totalBooks: db.library?.length || 0,
            announcements: db.announcements?.length || 0,
            events: db.events?.length || 0
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
