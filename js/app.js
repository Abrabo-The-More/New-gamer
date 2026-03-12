/**
 * Industrial School Management System
 * Main Application JavaScript
 */

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    if (!checkAuth()) {
        return;
    }
    
    // Load user info
    updateUserInfo();
    
    // Load dashboard data
    loadDashboardData();
    
    // Setup navigation
    setupNavigation();
    
    // Load all tables
    loadAllTables();
});

// Load dashboard statistics
function loadDashboardData() {
    const stats = Database.getStats();
    
    document.getElementById('totalStudents').textContent = stats.totalStudents;
    document.getElementById('totalTeachers').textContent = stats.totalTeachers;
    document.getElementById('totalClasses').textContent = stats.totalClasses;
    document.getElementById('unpaidFees').textContent = stats.unpaidFees;
    document.getElementById('paidFees').textContent = stats.paidFees;
    document.getElementById('feesUnpaid').textContent = stats.unpaidFees;
    
    // Load announcements
    loadAnnouncements();
}

// Load all data tables
function loadAllTables() {
    loadStudentsTable();
    loadTeachersTable();
    loadFeesTable();
    loadStaffTable();
    loadAnnouncementsFull();
}

// Load students table
function loadStudentsTable() {
    const students = Database.getTable('students');
    const tbody = document.getElementById('studentsTable');
    
    if (!tbody) return;
    
    tbody.innerHTML = students.map(student => `
        <tr>
            <td>${student.admissionNo}</td>
            <td>${student.firstName} ${student.lastName}</td>
            <td>${student.gender}</td>
            <td>${student.class}</td>
            <td>${student.section}</td>
            <td>${student.parentPhone}</td>
            <td><span class="badge badge-success">${student.status}</span></td>
            <td class="actions">
                <button class="btn-icon" title="View"><i class="fas fa-eye"></i></button>
                <button class="btn-icon" title="Edit"><i class="fas fa-edit"></i></button>
                <button class="btn-icon danger" title="Delete"><i class="fas fa-trash"></i></button>
            </td>
        </tr>
    `).join('');
}

// Load teachers table
function loadTeachersTable() {
    const teachers = Database.getTable('teachers');
    const tbody = document.getElementById('teachersTable');
    
    if (!tbody) return;
    
    tbody.innerHTML = teachers.map(teacher => `
        <tr>
            <td>${teacher.staffNo}</td>
            <td>${teacher.firstName} ${teacher.lastName}</td>
            <td>${teacher.qualification}</td>
            <td>${teacher.subject}</td>
            <td>${teacher.phone}</td>
            <td>${teacher.hireDate}</td>
            <td><span class="badge badge-success">${teacher.status}</span></td>
            <td class="actions">
                <button class="btn-icon"><i class="fas fa-eye"></i></button>
                <button class="btn-icon"><i class="fas fa-edit"></i></button>
                <button class="btn-icon danger"><i class="fas fa-trash"></i></button>
            </td>
        </tr>
    `).join('');
}

// Load fees table
function loadFeesTable() {
    const fees = Database.getTable('fees');
    const students = Database.getTable('students');
    const tbody = document.getElementById('feesTable');
    
    if (!tbody) return;
    
    tbody.innerHTML = fees.map(fee => {
        const student = students.find(s => s.id === fee.studentId);
        const statusClass = fee.status === 'Paid' ? 'success' : 'danger';
        
        return `
            <tr>
                <td>${student ? student.firstName + ' ' + student.lastName : 'N/A'}</td>
                <td>${fee.feeType}</td>
                <td>GH₵ ${fee.amount}</td>
                <td>${fee.dueDate}</td>
                <td>${fee.paidDate || '-'}</td>
                <td>${fee.receiptNo || '-'}</td>
                <td><span class="badge badge-${statusClass}">${fee.status}</span></td>
                <td class="actions">
                    <button class="btn-icon"><i class="fas fa-eye"></i></button>
                    <button class="btn-icon"><i class="fas fa-edit"></i></button>
                </td>
            </tr>
        `;
    }).join('');
}

// Load staff table
function loadStaffTable() {
    const staff = Database.getTable('staff');
    const tbody = document.getElementById('staffTable');
    
    if (!tbody) return;
    
    tbody.innerHTML = staff.map(s => `
        <tr>
            <td>${s.staffNo}</td>
            <td>${s.firstName} ${s.lastName}</td>
            <td>${s.position}</td>
            <td>${s.department}</td>
            <td>${s.phone}</td>
            <td>GH₵ ${s.salary}</td>
            <td><span class="badge badge-success">${s.status}</span></td>
            <td class="actions">
                <button class="btn-icon"><i class="fas fa-eye"></i></button>
                <button class="btn-icon"><i class="fas fa-edit"></i></button>
                <button class="btn-icon danger"><i class="fas fa-trash"></i></button>
            </td>
        </tr>
    `).join('');
}

// Load announcements
function loadAnnouncements() {
    const announcements = Database.getTable('announcements').slice(0, 3);
    const tbody = document.getElementById('announcementsTable');
    
    if (!tbody) return;
    
    tbody.innerHTML = announcements.map(a => {
        const priorityClass = a.priority === 'High' ? 'danger' : 'warning';
        return `
            <tr>
                <td>${a.title}</td>
                <td>${a.category}</td>
                <td>${a.postedBy}</td>
                <td>${a.date}</td>
                <td><span class="badge badge-${priorityClass}">${a.priority}</span></td>
            </tr>
        `;
    }).join('');
}

// Load announcements full
function loadAnnouncementsFull() {
    const announcements = Database.getTable('announcements');
    const tbody = document.getElementById('announcementsTableFull');
    
    if (!tbody) return;
    
    tbody.innerHTML = announcements.map(a => {
        const priorityClass = a.priority === 'High' ? 'danger' : a.priority === 'Normal' ? 'warning' : 'info';
        const statusClass = a.status === 'Active' ? 'success' : 'secondary';
        return `
            <tr>
                <td>${a.title}</td>
                <td>${a.category}</td>
                <td><span class="badge badge-${priorityClass}">${a.priority}</span></td>
                <td>${a.postedBy}</td>
                <td>${a.date}</td>
                <td><span class="badge badge-${statusClass}">${a.status}</span></td>
                <td class="actions">
                    <button class="btn-icon"><i class="fas fa-eye"></i></button>
                    <button class="btn-icon"><i class="fas fa-edit"></i></button>
                    <button class="btn-icon danger"><i class="fas fa-trash"></i></button>
                </td>
            </tr>
        `;
    }).join('');
}

// Setup navigation
function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item[data-page]');
    
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.getAttribute('data-page');
            navigateTo(page);
            
            // Update active state
            navItems.forEach(n => n.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

// Navigate to page
function navigateTo(page) {
    // Hide all pages
    const pages = ['dashboardPage', 'studentsPage', 'teachersPage', 'classesPage', 
                  'subjectsPage', 'attendancePage', 'gradesPage', 'feesPage', 
                  'admissionsPage', 'staffPage', 'libraryPage', 'inventoryPage',
                  'announcementsPage', 'messagesPage', 'reportsPage', 'settingsPage',
                  'timetablePage', 'defaultPage'];
    
    pages.forEach(p => {
        const el = document.getElementById(p);
        if (el) el.style.display = 'none';
    });
    
    // Update page title
    const pageTitles = {
        dashboard: 'Dashboard',
        students: 'Students',
        teachers: 'Teachers',
        classes: 'Classes',
        subjects: 'Subjects',
        attendance: 'Attendance',
        grades: 'Grades',
        fees: 'Fees',
        admissions: 'Admissions',
        staff: 'Staff',
        library: 'Library',
        inventory: 'Inventory',
        announcements: 'Announcements',
        messages: 'Messages',
        reports: 'Reports',
        settings: 'Settings',
        timetable: 'Timetable'
    };
    
    document.getElementById('pageTitle').textContent = pageTitles[page] || 'Dashboard';
    
    // Show requested page
    const pageEl = document.getElementById(page + 'Page');
    if (pageEl) {
        pageEl.style.display = 'block';
    } else {
        document.getElementById('defaultPage').style.display = 'block';
    }
}

// Toggle sidebar
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('active');
}

// Show add modal
function showAddModal(type) {
    alert('Add ' + type + ' modal would open here');
}

// Logout (called from header)
function logout() {
    sessionStorage.clear();
    window.location.href = 'index.html';
}
