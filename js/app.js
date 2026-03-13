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
    document.getElementById('totalNonTeaching').textContent = stats.totalNonTeachingStaff;
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
    loadParentsTable();
    loadNonTeachingTable();
    loadVisitorsTable();
    loadProgramsTable();
    loadDepartmentsTable();
    loadCommitteesTable();
    loadDisciplinaryTable();
    loadPTATable();
    loadAdminCouncilTable();
    loadSRCTable();
    loadAcademicBoardTable();
    loadAnnouncementsFull();
}

// Load Programs Table
function loadProgramsTable() {
    const programs = Database.getTable('programs');
    const tbody = document.getElementById('programsTable');
    if (!tbody) return;
    
    tbody.innerHTML = programs.map(p => `
        <tr>
            <td><strong>${p.code}</strong></td>
            <td>${p.name}</td>
            <td><span class="badge badge-info">${p.category}</span></td>
            <td>${p.description}</td>
            <td>${p.duration}</td>
            <td>${p.capacity}</td>
            <td><span class="badge badge-success">${p.status}</span></td>
            <td class="actions">
                <button class="btn-icon"><i class="fas fa-eye"></i></button>
                <button class="btn-icon"><i class="fas fa-edit"></i></button>
                <button class="btn-icon danger"><i class="fas fa-trash"></i></button>
            </td>
        </tr>
    `).join('');
    
    document.getElementById('totalPrograms').textContent = programs.length;
}

// Load Departments Table
function loadDepartmentsTable() {
    const departments = Database.getTable('departments');
    const teachers = Database.getTable('teachers');
    const tbody = document.getElementById('departmentsTable');
    if (!tbody) return;
    
    tbody.innerHTML = departments.map(d => {
        const head = teachers.find(t => t.id === d.headId);
        return `
            <tr>
                <td><strong>${d.code}</strong></td>
                <td>${d.name}</td>
                <td>${head ? head.firstName + ' ' + head.lastName : 'N/A'}</td>
                <td>${d.description}</td>
                <td class="actions">
                    <button class="btn-icon"><i class="fas fa-eye"></i></button>
                    <button class="btn-icon"><i class="fas fa-edit"></i></button>
                    <button class="btn-icon danger"><i class="fas fa-trash"></i></button>
                </td>
            </tr>
        `;
    }).join('');
}

// Load Committees Table
function loadCommitteesTable() {
    const committees = Database.getTable('committees');
    const tbody = document.getElementById('committeesTable');
    if (!tbody) return;
    
    tbody.innerHTML = committees.map(c => `
        <tr>
            <td><strong>${c.name}</strong></td>
            <td><span class="badge badge-info">${c.type}</span></td>
            <td>${c.description}</td>
            <td>${c.members}</td>
            <td>${c.meetingDay}</td>
            <td><span class="badge badge-success">${c.status}</span></td>
            <td class="actions">
                <button class="btn-icon"><i class="fas fa-eye"></i></button>
                <button class="btn-icon"><i class="fas fa-edit"></i></button>
                <button class="btn-icon danger"><i class="fas fa-trash"></i></button>
            </td>
        </tr>
    `).join('');
}

// Load Disciplinary Committee
function loadDisciplinaryTable() {
    const members = Database.getTable('committeeMembers').filter(m => m.committeeId === 1);
    const tbody = document.getElementById('disciplinaryTable');
    if (!tbody) return;
    
    tbody.innerHTML = members.map(m => `
        <tr>
            <td>${m.memberName}</td>
            <td>${m.role}</td>
            <td>${m.position}</td>
        </tr>
    `).join('');
}

// Load PTA
function loadPTATable() {
    const members = Database.getTable('committeeMembers').filter(m => m.committeeId === 2);
    const tbody = document.getElementById('ptaTable');
    if (!tbody) return;
    
    tbody.innerHTML = members.map(m => `
        <tr>
            <td>${m.memberName}</td>
            <td>${m.role}</td>
            <td>${m.position}</td>
        </tr>
    `).join('');
}

// Load Admin Council
function loadAdminCouncilTable() {
    const members = Database.getTable('committeeMembers').filter(m => m.committeeId === 3);
    const tbody = document.getElementById('adminCouncilTable');
    if (!tbody) return;
    
    tbody.innerHTML = members.map(m => `
        <tr>
            <td>${m.memberName}</td>
            <td>${m.role}</td>
            <td>${m.position}</td>
        </tr>
    `).join('');
}

// Load SRC
function loadSRCTable() {
    const src = Database.getTable('srcExecutive');
    const tbody = document.getElementById('srcTable');
    if (!tbody) return;
    
    tbody.innerHTML = src.map(s => `
        <tr>
            <td>${s.name}</td>
            <td><span class="badge badge-primary">${s.position}</span></td>
            <td>${s.class}</td>
            <td>${s.phone}</td>
            <td>${s.email}</td>
            <td><span class="badge badge-success">${s.status}</span></td>
        </tr>
    `).join('');
}

// Load Academic Board
function loadAcademicBoardTable() {
    const members = Database.getTable('committeeMembers').filter(m => m.committeeId === 5);
    const tbody = document.getElementById('academicBoardTable');
    if (!tbody) return;
    
    tbody.innerHTML = members.map(m => `
        <tr>
            <td>${m.memberName}</td>
            <td>${m.role}</td>
            <td>${m.position}</td>
        </tr>
    `).join('');
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
            <td>Form ${student.classId}</td>
            <td>${student.section}</td>
            <td>${student.phone}</td>
            <td><span class="badge badge-success">${student.status}</span></td>
            <td class="actions">
                <button class="btn-icon" title="View"><i class="fas fa-eye"></i></button>
                <button class="btn-icon" title="Edit"><i class="fas fa-edit"></i></button>
                <button class="btn-icon danger" title="Delete"><i class="fas fa-trash"></i></button>
            </td>
        </tr>
    `).join('');
}

// Load parents table
function loadParentsTable() {
    const parents = Database.getTable('parents');
    const students = Database.getTable('students');
    const tbody = document.getElementById('parentsTable');
    
    if (!tbody) return;
    
    tbody.innerHTML = parents.map(parent => {
        const student = students.find(s => s.id === parent.studentId);
        return `
            <tr>
                <td>${parent.fatherName}</td>
                <td>${parent.motherName}</td>
                <td>${parent.phone}</td>
                <td>${parent.altPhone || '-'}</td>
                <td>${parent.email}</td>
                <td>${parent.occupation}</td>
                <td>${student ? student.firstName + ' ' + student.lastName : 'N/A'}</td>
                <td class="actions">
                    <button class="btn-icon"><i class="fas fa-eye"></i></button>
                    <button class="btn-icon"><i class="fas fa-edit"></i></button>
                    <button class="btn-icon danger"><i class="fas fa-trash"></i></button>
                </td>
            </tr>
        `;
    }).join('');
    
    // Update stats
    document.getElementById('totalParents').textContent = parents.length;
    document.getElementById('verifiedParents').textContent = parents.filter(p => p.phone).length;
}

// Load non-teaching staff table
function loadNonTeachingTable() {
    const staff = Database.getTable('nonTeachingStaff');
    const tbody = document.getElementById('nonTeachingTable');
    
    if (!tbody) return;
    
    tbody.innerHTML = staff.map(s => `
        <tr>
            <td>${s.staffNo}</td>
            <td>${s.firstName} ${s.lastName}</td>
            <td>${s.gender}</td>
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
    
    // Update stats
    document.getElementById('totalNonTeaching').textContent = staff.length;
    const totalSalary = staff.reduce((sum, s) => sum + s.salary, 0);
    document.getElementById('totalSalary').textContent = 'GH₵ ' + totalSalary.toLocaleString();
}

// Load visitors table
function loadVisitorsTable() {
    const visitors = Database.getTable('visitors');
    const tbody = document.getElementById('visitorsTable');
    
    if (!tbody) return;
    
    tbody.innerHTML = visitors.map(v => {
        const statusClass = v.status === 'Checked In' ? 'warning' : 'success';
        return `
            <tr>
                <td>${v.visitorId}</td>
                <td>${v.name}</td>
                <td>${v.phone}</td>
                <td>${v.purpose}</td>
                <td>${v.host}</td>
                <td>${v.date}</td>
                <td>${v.timeIn}</td>
                <td>${v.timeOut || '-'}</td>
                <td><span class="badge badge-${statusClass}">${v.status}</span></td>
                <td class="actions">
                    <button class="btn-icon"><i class="fas fa-eye"></i></button>
                    <button class="btn-icon"><i class="fas fa-edit"></i></button>
                    <button class="btn-icon danger"><i class="fas fa-trash"></i></button>
                </td>
            </tr>
        `;
    }).join('');
    
    // Update stats
    document.getElementById('totalVisitors').textContent = visitors.length;
    document.getElementById('checkedIn').textContent = visitors.filter(v => v.status === 'Checked In').length;
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
    const pages = ['dashboardPage', 'studentsPage', 'teachersPage', 'nonteachingPage', 'parentsPage', 'visitorsPage', 'programsPage', 'classesPage', 
                  'subjectsPage', 'departmentsPage', 'committeesPage', 'disciplinaryPage', 'ptaPage', 'admincouncilPage', 'srcPage', 'academicboardPage',
                  'attendancePage', 'gradesPage', 'feesPage', 
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
        teachers: 'Teaching Staff',
        nonteaching: 'Non-Teaching Staff',
        parents: 'Parents/Guardians',
        visitors: 'Visitors/Outsiders',
        programs: 'Programs/Courses',
        classes: 'Classes',
        subjects: 'Subjects',
        departments: 'Departments',
        committees: 'Committees',
        disciplinary: 'Disciplinary Committee',
        pta: 'PTA',
        admincouncil: 'Admin Council',
        src: 'SRC',
        academicboard: 'Academic Board',
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
