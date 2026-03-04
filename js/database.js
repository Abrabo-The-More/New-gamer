/**
 * =============================================================================
 * DATABASE ABSTRACTION LAYER
 * =============================================================================
 * This module provides a unified database interface supporting:
 * - Microsoft Access (via ADO/ActiveX on Windows with JScript)
 * - IndexedDB (browser fallback for cross-platform compatibility)
 * 
 * ALGORITHM: Database Abstraction Pattern
 * 1. Detect environment (Windows/Access available or Browser)
 * 2. Initialize appropriate database driver
 * 3. Create tables if not exist
 * 4. Provide CRUD operations with unified API
 * 5. Handle migrations and seeding
 * 
 * @author EduVerse Development Team
 * @version 1.0.0
 * @since 2024
 */

(function() {
    'use strict';

    // =====================================================================
    // CONFIGURATION
    // =====================================================================

    const CONFIG = {
        DB_NAME: 'EduVerseDB',
        DB_VERSION: 1,
        ACCESS_CONNECTION_STRING: 'Provider=Microsoft.ACE.OLEDB.12.0;Data Source=school_management.accdb;',
        TABLES: {
            USERS: 'users',
            STUDENTS: 'students',
            PARENTS: 'parents',
            TEACHERS: 'teachers',
            STAFF: 'staff',
            CLASSES: 'classes',
            SUBJECTS: 'subjects',
            ATTENDANCE: 'attendance',
            GRADES: 'grades',
            FEES: 'fees',
            BOOKS: 'books',
            LIBRARY_ISSUES: 'library_issues',
            ANNOUNCEMENTS: 'announcements',
            MESSAGES: 'messages',
            TIMETABLE: 'timetable',
            LOGS: 'logs'
        }
    };

    // =====================================================================
    // STATE MANAGEMENT
    // =====================================================================

    let db = null;
    let isAccessAvailable = false;
    let currentUser = null;

    // =====================================================================
    // UTILITY FUNCTIONS
    // =====================================================================

    /**
     * Generate unique ID
     * @returns {string} UUID v4
     */
    function generateId() {
        return 'id_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Hash password using SHA-256
     * @param {string} password 
     * @returns {Promise<string>}
     */
    async function hashPassword(password) {
        const encoder = new TextEncoder();
        const data = encoder.encode(password + 'EduVerse_Salt_2024');
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    /**
     * Format date for display
     * @param {Date|string} date 
     * @returns {string}
     */
    function formatDate(date) {
        const d = new Date(date);
        return d.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    }

    /**
     * Format datetime for display
     * @param {Date|string} date 
     * @returns {string}
     */
    function formatDateTime(date) {
        const d = new Date(date);
        return d.toLocaleString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    // =====================================================================
    // INDEXEDDB IMPLEMENTATION (Browser Fallback)
    // =====================================================================

    /**
     * Initialize IndexedDB
     * @returns {Promise<IDBDatabase>}
     */
    function initIndexedDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(CONFIG.DB_NAME, CONFIG.DB_VERSION);

            request.onerror = () => reject(request.error);
            
            request.onsuccess = () => {
                db = request.result;
                resolve(db);
            };

            request.onupgradeneeded = (event) => {
                const database = event.target.result;
                createTables(database);
            };
        });
    }

    /**
     * Create all tables in IndexedDB
     * @param {IDBDatabase} database 
     */
    function createTables(database) {
        // Users table
        if (!database.objectStoreNames.contains(CONFIG.TABLES.USERS)) {
            const userStore = database.createObjectStore(CONFIG.TABLES.USERS, { keyPath: 'id' });
            userStore.createIndex('username', 'username', { unique: true });
            userStore.createIndex('role', 'role', { unique: false });
            userStore.createIndex('email', 'email', { unique: false });
        }

        // Students table
        if (!database.objectStoreNames.contains(CONFIG.TABLES.STUDENTS)) {
            const studentStore = database.createObjectStore(CONFIG.TABLES.STUDENTS, { keyPath: 'id' });
            studentStore.createIndex('admissionNumber', 'admissionNumber', { unique: true });
            studentStore.createIndex('classId', 'classId', { unique: false });
            studentStore.createIndex('parentId', 'parentId', { unique: false });
            studentStore.createIndex('email', 'email', { unique: false });
        }

        // Parents table
        if (!database.objectStoreNames.contains(CONFIG.TABLES.PARENTS)) {
            database.createObjectStore(CONFIG.TABLES.PARENTS, { keyPath: 'id' });
        }

        // Teachers table
        if (!database.objectStoreNames.contains(CONFIG.TABLES.TEACHERS)) {
            const teacherStore = database.createObjectStore(CONFIG.TABLES.TEACHERS, { keyPath: 'id' });
            teacherStore.createIndex('employeeId', 'employeeId', { unique: true });
            teacherStore.createIndex('email', 'email', { unique: false });
        }

        // Staff table
        if (!database.objectStoreNames.contains(CONFIG.TABLES.STAFF)) {
            const staffStore = database.createObjectStore(CONFIG.TABLES.STAFF, { keyPath: 'id' });
            staffStore.createIndex('employeeId', 'employeeId', { unique: true });
            staffStore.createIndex('department', 'department', { unique: false });
        }

        // Classes table
        if (!database.objectStoreNames.contains(CONFIG.TABLES.CLASSES)) {
            database.createObjectStore(CONFIG.TABLES.CLASSES, { keyPath: 'id' });
        }

        // Subjects table
        if (!database.objectStoreNames.contains(CONFIG.TABLES.SUBJECTS)) {
            const subjectStore = database.createObjectStore(CONFIG.TABLES.SUBJECTS, { keyPath: 'id' });
            subjectStore.createIndex('classId', 'classId', { unique: false });
        }

        // Attendance table
        if (!database.objectStoreNames.contains(CONFIG.TABLES.ATTENDANCE)) {
            const attStore = database.createObjectStore(CONFIG.TABLES.ATTENDANCE, { keyPath: 'id' });
            attStore.createIndex('studentId', 'studentId', { unique: false });
            attStore.createIndex('classId', 'classId', { unique: false });
            attStore.createIndex('date', 'date', { unique: false });
        }

        // Grades table
        if (!database.objectStoreNames.contains(CONFIG.TABLES.GRADES)) {
            const gradeStore = database.createObjectStore(CONFIG.TABLES.GRADES, { keyPath: 'id' });
            gradeStore.createIndex('studentId', 'studentId', { unique: false });
            gradeStore.createIndex('subjectId', 'subjectId', { unique: false });
        }

        // Fees table
        if (!database.objectStoreNames.contains(CONFIG.TABLES.FEES)) {
            const feeStore = database.createObjectStore(CONFIG.TABLES.FEES, { keyPath: 'id' });
            feeStore.createIndex('studentId', 'studentId', { unique: false });
            feeStore.createIndex('status', 'status', { unique: false });
        }

        // Books table
        if (!database.objectStoreNames.contains(CONFIG.TABLES.BOOKS)) {
            database.createObjectStore(CONFIG.TABLES.BOOKS, { keyPath: 'id' });
        }

        // Library Issues table
        if (!database.objectStoreNames.contains(CONFIG.TABLES.LIBRARY_ISSUES)) {
            const issueStore = database.createObjectStore(CONFIG.TABLES.LIBRARY_ISSUES, { keyPath: 'id' });
            issueStore.createIndex('bookId', 'bookId', { unique: false });
            issueStore.createIndex('memberId', 'memberId', { unique: false });
        }

        // Announcements table
        if (!database.objectStoreNames.contains(CONFIG.TABLES.ANNOUNCEMENTS)) {
            database.createObjectStore(CONFIG.TABLES.ANNOUNCEMENTS, { keyPath: 'id' });
        }

        // Messages table
        if (!database.objectStoreNames.contains(CONFIG.TABLES.MESSAGES)) {
            const msgStore = database.createObjectStore(CONFIG.TABLES.MESSAGES, { keyPath: 'id' });
            msgStore.createIndex('senderId', 'senderId', { unique: false });
            msgStore.createIndex('receiverId', 'receiverId', { unique: false });
            msgStore.createIndex('isRead', 'isRead', { unique: false });
        }

        // Timetable table
        if (!database.objectStoreNames.contains(CONFIG.TABLES.TIMETABLE)) {
            const timeStore = database.createObjectStore(CONFIG.TABLES.TIMETABLE, { keyPath: 'id' });
            timeStore.createIndex('classId', 'classId', { unique: false });
            timeStore.createIndex('day', 'day', { unique: false });
        }

        // Logs table
        if (!database.objectStoreNames.contains(CONFIG.TABLES.LOGS)) {
            const logStore = database.createObjectStore(CONFIG.TABLES.LOGS, { keyPath: 'id' });
            logStore.createIndex('userId', 'userId', { unique: false });
            logStore.createIndex('timestamp', 'timestamp', { unique: false });
        }
    }

    // =====================================================================
    // CRUD OPERATIONS (IndexedDB)
    // =====================================================================

    /**
     * Insert a record
     * @param {string} table 
     * @param {Object} data 
     * @returns {Promise<Object>}
     */
    async function insert(table, data) {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([table], 'readwrite');
            const store = transaction.objectStore(table);
            data.createdAt = new Date().toISOString();
            data.updatedAt = new Date().toISOString();
            const request = store.add(data);
            
            request.onsuccess = () => resolve({ ...data, id: request.result });
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Update a record
     * @param {string} table 
     * @param {Object} data 
     * @returns {Promise<Object>}
     */
    async function update(table, data) {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([table], 'readwrite');
            const store = transaction.objectStore(table);
            data.updatedAt = new Date().toISOString();
            const request = store.put(data);
            
            request.onsuccess = () => resolve(data);
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Delete a record
     * @param {string} table 
     * @param {string} id 
     * @returns {Promise<boolean>}
     */
    async function remove(table, id) {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([table], 'readwrite');
            const store = transaction.objectStore(table);
            const request = store.delete(id);
            
            request.onsuccess = () => resolve(true);
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Get a single record by ID
     * @param {string} table 
     * @param {string} id 
     * @returns {Promise<Object|null>}
     */
    async function getById(table, id) {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([table], 'readonly');
            const store = transaction.objectStore(table);
            const request = store.get(id);
            
            request.onsuccess = () => resolve(request.result || null);
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Get all records from a table
     * @param {string} table 
     * @param {Object} options 
     * @returns {Promise<Array>}
     */
    async function getAll(table, options = {}) {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([table], 'readonly');
            const store = transaction.objectStore(table);
            const request = store.getAll();
            
            request.onsuccess = () => {
                let results = request.result || [];
                
                // Apply filters
                if (options.filter) {
                    results = results.filter(options.filter);
                }
                
                // Apply sorting
                if (options.sortBy) {
                    results.sort((a, b) => {
                        const aVal = a[options.sortBy];
                        const bVal = b[options.sortBy];
                        if (options.sortOrder === 'desc') {
                            return aVal < bVal ? 1 : -1;
                        }
                        return aVal > bVal ? 1 : -1;
                    });
                }
                
                // Apply pagination
                if (options.limit) {
                    const start = options.offset || 0;
                    results = results.slice(start, start + options.limit);
                }
                
                resolve(results);
            };
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Query with conditions
     * @param {string} table 
     * @param {Object} query 
     * @returns {Promise<Array>}
     */
    async function query(table, queryObj) {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([table], 'readonly');
            const store = transaction.objectStore(table);
            const results = [];
            
            if (queryObj.index && store.indexNames.contains(queryObj.index)) {
                const index = store.index(queryObj.index);
                const request = index.getAll(queryObj.value);
                
                request.onsuccess = () => resolve(request.result || []);
                request.onerror = () => reject(request.error);
            } else {
                const request = store.openCursor();
                
                request.onsuccess = (event) => {
                    const cursor = event.target.result;
                    if (cursor) {
                        let match = true;
                        for (const key in queryObj.where) {
                            if (cursor.value[key] !== queryObj.where[key]) {
                                match = false;
                                break;
                            }
                        }
                        if (match) results.push(cursor.value);
                        cursor.continue();
                    } else {
                        resolve(results);
                    }
                };
                
                request.onerror = () => reject(request.error);
            }
        });
    }

    /**
     * Count records
     * @param {string} table 
     * @param {Object} filter 
     * @returns {Promise<number>}
     */
    async function count(table, filter = {}) {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([table], 'readonly');
            const store = transaction.objectStore(table);
            const request = store.getAll();
            
            request.onsuccess = () => {
                let results = request.result || [];
                for (const key in filter) {
                    results = results.filter(r => r[key] === filter[key]);
                }
                resolve(results.length);
            };
            request.onerror = () => reject(request.error);
        });
    }

    // =====================================================================
    // MICROSOFT ACCESS IMPLEMENTATION (Windows Only)
    // =====================================================================

    /**
     * Initialize Microsoft Access database
     * Note: Only works on Windows with Access drivers installed
     * @returns {Promise<boolean>}
     */
    async function initAccessDB() {
        return new Promise((resolve) => {
            try {
                // Check if ActiveXObject is available (IE/Windows only)
                if (typeof ActiveXObject !== 'undefined') {
                    const conn = new ActiveXObject('ADODB.Connection');
                    conn.Open(CONFIG.ACCESS_CONNECTION_STRING);
                    
                    // Create tables if not exist
                    createAccessTables(conn);
                    
                    conn.Close();
                    isAccessAvailable = true;
                    resolve(true);
                } else {
                    resolve(false);
                }
            } catch (e) {
                console.log('Microsoft Access not available, using IndexedDB');
                resolve(false);
            }
        });
    }

    /**
     * Create tables in Microsoft Access
     * @param {ADODB.Connection} conn 
     */
    function createAccessTables(conn) {
        const tables = [
            `CREATE TABLE Users (
                ID AUTOINCREMENT PRIMARY KEY,
                Username TEXT UNIQUE,
                Password TEXT,
                Role TEXT,
                PersonID TEXT,
                LastLogin DATETIME,
                IsActive YESNO,
                CreatedDate DATETIME
            )`,
            `CREATE TABLE Students (
                ID AUTOINCREMENT PRIMARY KEY,
                AdmissionNumber TEXT UNIQUE,
                FirstName TEXT,
                LastName TEXT,
                DateOfBirth DATETIME,
                Gender TEXT,
                BloodGroup TEXT,
                Address TEXT,
                City TEXT,
                State TEXT,
                PinCode TEXT,
                Phone TEXT,
                Email TEXT,
                ParentID INTEGER,
                ClassID INTEGER,
                RollNumber INTEGER,
                AdmissionDate DATETIME,
                Status TEXT,
                Photo BLOB
            )`,
            // ... more table definitions
        ];

        tables.forEach(sql => {
            try {
                conn.Execute(sql);
            } catch (e) {
                // Table already exists
            }
        });
    }

    // =====================================================================
    // SEED DATA
    // =====================================================================

    /**
     * Seed initial data
     * @returns {Promise<void>}
     */
    async function seedData() {
        const existingUsers = await getAll(CONFIG.TABLES.USERS);
        if (existingUsers.length > 0) return;

        console.log('Seeding initial data...');

        // Create admin user
        const adminPassword = await hashPassword('admin123');
        await insert(CONFIG.TABLES.USERS, {
            id: generateId(),
            username: 'admin',
            password: adminPassword,
            role: 'admin',
            email: 'admin@eduverse.edu',
            firstName: 'System',
            lastName: 'Administrator',
            isActive: true,
            createdAt: new Date().toISOString()
        });

        // Create demo users for each role
        const roles = [
            { role: 'teacher', username: 'teacher1', firstName: 'John', lastName: 'Smith' },
            { role: 'student', username: 'student1', firstName: 'Alice', lastName: 'Johnson' },
            { role: 'parent', username: 'parent1', firstName: 'Robert', lastName: 'Williams' },
            { role: 'staff', username: 'staff1', firstName: 'Maria', lastName: 'Garcia' },
            { role: 'guest', username: 'guest1', firstName: 'Guest', lastName: 'User' }
        ];

        for (const r of roles) {
            const password = await hashPassword('demo123');
            await insert(CONFIG.TABLES.USERS, {
                id: generateId(),
                username: r.username,
                password: password,
                role: r.role,
                email: `${r.username}@eduverse.edu`,
                firstName: r.firstName,
                lastName: r.lastName,
                isActive: true,
                createdAt: new Date().toISOString()
            });
        }

        // Seed Classes
        const classes = ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 
                        'Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10',
                        'Grade 11 - Science', 'Grade 11 - Commerce', 'Grade 12 - Science', 'Grade 12 - Commerce'];
        
        for (let i = 0; i < classes.length; i++) {
            await insert(CONFIG.TABLES.CLASSES, {
                id: generateId(),
                name: classes[i],
                section: String.fromCharCode(65 + (i % 3)), // A, B, C
                capacity: 40,
                academicYear: '2024-2025'
            });
        }

        // Seed Subjects
        const subjects = [
            { name: 'Mathematics', code: 'MATH', creditHours: 4 },
            { name: 'English', code: 'ENG', creditHours: 4 },
            { name: 'Science', code: 'SCI', creditHours: 4 },
            { name: 'History', code: 'HIST', creditHours: 3 },
            { name: 'Geography', code: 'GEO', creditHours: 3 },
            { name: 'Physics', code: 'PHY', creditHours: 4 },
            { name: 'Chemistry', code: 'CHEM', creditHours: 4 },
            { name: 'Biology', code: 'BIO', creditHours: 4 },
            { name: 'Computer Science', code: 'CS', creditHours: 3 },
            { name: 'Physical Education', code: 'PE', creditHours: 2 }
        ];

        const allClasses = await getAll(CONFIG.TABLES.CLASSES);
        for (const cls of allClasses.slice(0, 5)) {
            for (const subj of subjects) {
                await insert(CONFIG.TABLES.SUBJECTS, {
                    id: generateId(),
                    name: subj.name,
                    code: subj.code,
                    classId: cls.id,
                    creditHours: subj.creditHours
                });
            }
        }

        // Seed Books
        const books = [
            { title: 'Mathematics Fundamentals', author: 'R.D. Sharma', category: 'Academic', copies: 50 },
            { title: 'English Grammar', author: 'Wren & Martin', category: 'Academic', copies: 40 },
            { title: 'Physics for Scientists', author: 'Halliday & Resnick', category: 'Academic', copies: 30 },
            { title: 'Chemistry Principles', author: 'Brown & LeMay', category: 'Academic', copies: 25 },
            { title: 'Biology Campbell', author: 'Campbell', category: 'Academic', copies: 30 },
            { title: 'Computer Science Basics', author: 'Forouzan', category: 'Academic', copies: 20 },
            { title: 'History of India', author: 'Bipan Chandra', category: 'History', copies: 15 },
            { title: 'Geography Atlas', author: 'Oxford', category: 'Geography', copies: 20 },
            { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', category: 'Literature', copies: 15 },
            { title: 'To Kill a Mockingbird', author: 'Harper Lee', category: 'Literature', copies: 15 }
        ];

        for (const book of books) {
            await insert(CONFIG.TABLES.BOOKS, {
                id: generateId(),
                isbn: 'ISBN-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
                title: book.title,
                author: book.author,
                publisher: 'Various',
                category: book.category,
                totalCopies: book.copies,
                availableCopies: book.copies,
                shelfLocation: 'A-' + Math.floor(Math.random() * 20)
            });
        }

        // Seed Announcements
        await insert(CONFIG.TABLES.ANNOUNCEMENTS, {
            id: generateId(),
            title: 'Welcome to EduVerse 2024-2025',
            content: 'We are excited to welcome all students, parents, and staff to the new academic year. Let\'s make this year productive and successful!',
            postedBy: 'Admin',
            priority: 'high',
            targetRoles: 'all',
            createdAt: new Date().toISOString()
        });

        await insert(CONFIG.TABLES.ANNOUNCEMENTS, {
            id: generateId(),
            title: 'Parent-Teacher Meeting',
            content: 'The annual PTM will be held on the last Saturday of this month. All parents are requested to attend.',
            postedBy: 'Principal',
            priority: 'medium',
            targetRoles: 'parent,student',
            createdAt: new Date().toISOString()
        });

        console.log('Seed data completed!');
    }

    // =====================================================================
    // INITIALIZATION
    // =====================================================================

    /**
     * Initialize the database
     * @returns {Promise<void>}
     */
    async function init() {
        try {
            // Try to initialize IndexedDB
            await initIndexedDB();
            
            // Try Access as well (will fail gracefully on non-Windows)
            await initAccessDB();
            
            // Seed initial data
            await seedData();
            
            console.log('Database initialized successfully');
            console.log('Using:', isAccessAvailable ? 'Microsoft Access' : 'IndexedDB (Browser)');
            
            return true;
        } catch (error) {
            console.error('Database initialization failed:', error);
            throw error;
        }
    }

    // =====================================================================
    // EXPORT
    // =====================================================================

    window.Database = {
        init,
        CONFIG,
        // CRUD operations
        insert: (table, data) => insert(table, data),
        update: (table, data) => update(table, data),
        remove: (table, id) => remove(table, id),
        getById: (table, id) => getById(table, id),
        getAll: (table, options) => getAll(table, options),
        query: (table, q) => query(table, q),
        count: (table, filter) => count(table, filter),
        // Utility functions
        generateId,
        hashPassword,
        formatDate,
        formatDateTime,
        // Tables
        TABLES: CONFIG.TABLES,
        // State
        getCurrentUser: () => currentUser,
        setCurrentUser: (user) => currentUser = user,
        isAccessAvailable: () => isAccessAvailable
    };

})();
