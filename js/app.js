/**
 * Industrial School Management System
 * Main Application JavaScript
 */

// Initialize app
document.addEventListener('DOMContentLoaded', async function() {
    // Check authentication
    if (!checkAuth()) {
        return;
    }
    
    // Initialize database
    await SchoolDB.open();
    
    // Initialize role-based dashboard
    initDashboard();
    
    // Setup navigation click handlers
    setupNavigation();
    
    // Load all tables
    loadAllTables();
});

// Role-based Navigation
const RoleNavigation = {
    getNavigation(role) {
        const navs = {
            admin: [
                { section: 'Main', items: [
                    { page: 'dashboard', icon: 'fa-home', label: 'Dashboard' },
                    { page: 'profile', icon: 'fa-user', label: 'My Profile' }
                ]},
                { section: 'People', items: [
                    { page: 'students', icon: 'fa-user-graduate', label: 'Students' },
                    { page: 'teachers', icon: 'fa-chalkboard-teacher', label: 'Teaching Staff' },
                    { page: 'parents', icon: 'fa-users', label: 'Parents' }
                ]},
                { section: 'Academic', items: [
                    { page: 'programs', icon: 'fa-graduation-cap', label: 'Programs' },
                    { page: 'classes', icon: 'fa-door-open', label: 'Classes' }
                ]},
                { section: 'Committees', items: [
                    { page: 'committees', icon: 'fa-users-cog', label: 'Committees' },
                    { page: 'src', icon: 'fa-user-graduate', label: 'SRC' }
                ]},
                { section: 'Communication', items: [
                    { page: 'announcements', icon: 'fa-bullhorn', label: 'Announcements' }
                ]}
            ],
            student: [
                { section: 'Main', items: [
                    { page: 'dashboard', icon: 'fa-home', label: 'Dashboard' },
                    { page: 'profile', icon: 'fa-user', label: 'My Profile' }
                ]},
                { section: 'My Academic', items: [
                    { page: 'myresults', icon: 'fa-graduation-cap', label: 'My Results' },
                    { page: 'myattendance', icon: 'fa-clipboard-check', label: 'My Attendance' },
                    { page: 'myfees', icon: 'fa-money-bill-wave', label: 'My Fees' }
                ]}
            ],
            parent: [
                { section: 'Main', items: [
                    { page: 'dashboard', icon: 'fa-home', label: 'Dashboard' },
                    { page: 'profile', icon: 'fa-user', label: 'My Profile' }
                ]},
                { section: 'My Child', items: [
                    { page: 'childprofile', icon: 'fa-user-graduate', label: "Child's Profile" },
                    { page: 'childresults', icon: 'fa-graduation-cap', label: "Child's Results" }
                ]}
            ],
            teacher: [
                { section: 'Main', items: [
                    { page: 'dashboard', icon: 'fa-home', label: 'Dashboard' },
                    { page: 'profile', icon: 'fa-user', label: 'My Profile' }
                ]},
                { section: 'Teaching', items: [
                    { page: 'students', icon: 'fa-user-graduate', label: 'Students' },
                    { page: 'attendance', icon: 'fa-clipboard-check', label: 'Attendance' }
                ]}
            ],
            default: [
                { section: 'Main', items: [
                    { page: 'dashboard', icon: 'fa-home', label: 'Dashboard' },
                    { page: 'profile', icon: 'fa-user', label: 'My Profile' }
                ]}
            ]
        };
        return navs[role] || navs.default;
    },
    buildNavigation(role) {
        const nav = this.getNavigation(role);
        let html = '';
        nav.forEach(s => {
            html += '<div class="nav-section"><div class="nav-section-title">' + s.section + '</div>';
            s.items.forEach(i => {
                html += '<a href="#" class="nav-item" data-page="' + i.page + '"><i class="fas ' + i.icon + '"></i><span>' + i.label + '</span></a>';
            });
            html += '</div>';
        });
        return html;
    }
};

function getCurrentRole() {
    const urlParams = new URLSearchParams(window.location.search);
    const roleFromUrl = urlParams.get('role');
    if (roleFromUrl) {
        sessionStorage.setItem('userRole', roleFromUrl);
        return roleFromUrl;
    }
    return sessionStorage.getItem('userRole') || 'admin';
}

function initDashboard() {
    const role = getCurrentRole();
    const navContainer = document.querySelector('.sidebar-nav');
    if (navContainer) {
        navContainer.innerHTML = RoleNavigation.buildNavigation(role);
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                const page = this.getAttribute('data-page');
                navigateTo(page);
            });
        });
    }
    const user = getCurrentUser();
    if (document.getElementById('userName')) document.getElementById('userName').textContent = user.name;
    if (document.getElementById('userRole')) document.getElementById('userRole').textContent = user.role.charAt(0).toUpperCase() + user.role.slice(1);
    loadRoleDashboard(role);
}

function loadRoleDashboard(role) {
    const userId = parseInt(sessionStorage.getItem('userId'));
    const studentId = parseInt(sessionStorage.getItem('studentId'));
    let welcomeMsg = '', statsHtml = '', quickActions = '';
    
    if (role === 'student') {
        welcomeMsg = 'Welcome back, ' + sessionStorage.getItem('userName') + '!';
        statsHtml = '<div class="stat-card primary"><div class="stat-icon"><i class="fas fa-user-graduate"></i></div><div class="stat-content"><h3>My Profile</h3><p>Student</p></div></div>';
        quickActions = '<div class="quick-action-btn" onclick="navigateTo(\'myresults\')"><i class="fas fa-graduation-cap"></i><span>My Results</span></div><div class="quick-action-btn" onclick="navigateTo(\'myattendance\')"><i class="fas fa-clipboard-check"></i><span>My Attendance</span></div>';
    } else if (role === 'parent') {
        welcomeMsg = 'Welcome, Parent!';
        statsHtml = '<div class="stat-card primary"><div class="stat-icon"><i class="fas fa-users"></i></div><div class="stat-content"><h3>Your Child</h3><p>View Profile</p></div></div>';
        quickActions = '<div class="quick-action-btn" onclick="navigateTo(\'childprofile\')"><i class="fas fa-user-graduate"></i><span>Child\'s Profile</span></div><div class="quick-action-btn" onclick="navigateTo(\'childresults\')"><i class="fas fa-graduation-cap"></i><span>Child\'s Results</span></div>';
    } else if (role === 'teacher') {
        welcomeMsg = 'Welcome, Teacher!';
        statsHtml = '<div class="stat-card primary"><div class="stat-icon"><i class="fas fa-chalkboard-teacher"></i></div><div class="stat-content"><h3>Teaching</h3><p>View Classes</p></div></div>';
        quickActions = '<div class="quick-action-btn" onclick="navigateTo(\'students\')"><i class="fas fa-user-graduate"></i><span>Students</span></div><div class="quick-action-btn" onclick="navigateTo(\'attendance\')"><i class="fas fa-clipboard-check"></i><span>Attendance</span></div>';
    } else {
        welcomeMsg = 'Welcome, ' + sessionStorage.getItem('userName') + '!';
        statsHtml = '<div class="stat-card primary"><div class="stat-icon"><i class="fas fa-user-graduate"></i></div><div class="stat-content"><h3>Dashboard</h3><p>Overview</p></div></div>';
        quickActions = '<div class="quick-action-btn" onclick="navigateTo(\'students\')"><i class="fas fa-user-graduate"></i><span>Students</span></div><div class="quick-action-btn" onclick="navigateTo(\'teachers\')"><i class="fas fa-chalkboard-teacher"></i><span>Teachers</span></div>';
    }
    
    if (document.getElementById('welcomeMessage')) document.getElementById('welcomeMessage').textContent = welcomeMsg;
    const statsGrid = document.querySelector('.stats-grid');
    if (statsGrid) statsGrid.innerHTML = statsHtml;
    if (document.getElementById('quickActions')) document.getElementById('quickActions').innerHTML = quickActions;
}

// Navigate to page
function navigateTo(page) {
    const pages = ['dashboardPage', 'studentsPage', 'teachersPage', 'parentsPage', 'programsPage', 'committeesPage', 'srcPage', 'announcementsPage', 'defaultPage'];
    
    pages.forEach(p => {
        const el = document.getElementById(p);
        if (el) el.style.display = 'none';
    });
    
    const pageEl = document.getElementById(page + 'Page');
    if (pageEl) {
        pageEl.style.display = 'block';
    } else {
        document.getElementById('defaultPage').style.display = 'block';
    }
}

// Setup navigation
function setupNavigation() {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.getAttribute('data-page');
            navigateTo(page);
        });
    });
}

// Load all tables
async function loadAllTables() {
    await SchoolDB.open();
    
    const students = await SchoolDB.getAll('students');
    const teachers = await SchoolDB.getAll('teachers');
    const parents = await SchoolDB.getAll('parents');
    const programs = await SchoolDB.getAll('programs');
    const committees = await SchoolDB.getAll('committees');
    const src = await SchoolDB.getAll('src');
    const announcements = await SchoolDB.getAll('announcements');
    
    // Update stats
    if (document.getElementById('totalStudents')) document.getElementById('totalStudents').textContent = students.length;
    if (document.getElementById('totalTeachers')) document.getElementById('totalTeachers').textContent = teachers.length;
    
    // Load tables
    loadStudentsTable(students);
    loadTeachersTable(teachers);
    loadProgramsTable(programs);
    loadCommitteesTable(committees);
    loadSRCTable(src);
    loadAnnouncements(announcements);
}

function loadStudentsTable(students) {
    const tbody = document.getElementById('studentsTable');
    if (!tbody || !students) return;
    
    tbody.innerHTML = students.map(s => `
        <tr>
            <td>${s.admissionNo}</td>
            <td>${s.firstName} ${s.lastName}</td>
            <td>${s.gender}</td>
            <td>${s.section}</td>
            <td><span class="badge badge-success">${s.status}</span></td>
        </tr>
    `).join('');
}

function loadTeachersTable(teachers) {
    const tbody = document.getElementById('teachersTable');
    if (!tbody || !teachers) return;
    
    tbody.innerHTML = teachers.map(t => `
        <tr>
            <td>${t.firstName} ${t.lastName}</td>
            <td>${t.department}</td>
            <td>${t.qualification}</td>
            <td>${t.phone}</td>
            <td><span class="badge badge-success">${t.status}</span></td>
        </tr>
    `).join('');
}

function loadProgramsTable(programs) {
    const tbody = document.getElementById('programsTable');
    if (!tbody || !programs) return;
    
    tbody.innerHTML = programs.map(p => `
        <tr>
            <td><strong>${p.code}</strong></td>
            <td>${p.name}</td>
            <td><span class="badge badge-info">${p.category}</span></td>
            <td>${p.duration}</td>
            <td><span class="badge badge-success">${p.status}</span></td>
        </tr>
    `).join('');
}

function loadCommitteesTable(committees) {
    const tbody = document.getElementById('committeesTable');
    if (!tbody || !committees) return;
    
    tbody.innerHTML = committees.map(c => `
        <tr>
            <td><strong>${c.name}</strong></td>
            <td><span class="badge badge-info">${c.type}</span></td>
            <td>${c.description}</td>
            <td>${c.meetingDay}</td>
        </tr>
    `).join('');
}

function loadSRCTable(src) {
    const tbody = document.getElementById('srcTable');
    if (!tbody || !src) return;
    
    tbody.innerHTML = src.map(s => `
        <tr>
            <td>${s.name}</td>
            <td><span class="badge badge-primary">${s.position}</span></td>
            <td>${s.class}</td>
        </tr>
    `).join('');
}

function loadAnnouncements(announcements) {
    const tbody = document.getElementById('announcementsTableFull');
    if (!tbody || !announcements) return;
    
    tbody.innerHTML = announcements.map(a => `
        <tr>
            <td>${a.title}</td>
            <td>${a.category}</td>
            <td><span class="badge badge-${a.priority === 'High' ? 'danger' : 'warning'}">${a.priority}</span></td>
            <td>${a.postedBy}</td>
            <td>${a.date}</td>
        </tr>
    `).join('');
}

// Check authentication
function checkAuth() {
    const loggedIn = sessionStorage.getItem('loggedIn');
    if (!loggedIn) {
        window.location.href = 'index.html';
        return false;
    }
    return true;
}

// Get current user
function getCurrentUser() {
    return {
        id: sessionStorage.getItem('userId'),
        username: sessionStorage.getItem('username'),
        name: sessionStorage.getItem('userName'),
        role: sessionStorage.getItem('userRole'),
        email: sessionStorage.getItem('userEmail')
    };
}

// Update user info
function updateUserInfo() {
    const user = getCurrentUser();
    const userNameEl = document.getElementById('userName');
    const userRoleEl = document.getElementById('userRole');
    
    if (userNameEl && user.name) {
        userNameEl.textContent = user.name;
    }
    if (userRoleEl && user.role) {
        userRoleEl.textContent = user.role.charAt(0).toUpperCase() + user.role.slice(1);
    }
}

// Logout
function logout() {
    sessionStorage.clear();
    window.location.href = 'index.html';
}

// Toggle sidebar
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('active');
}
