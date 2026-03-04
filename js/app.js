/**
 * =============================================================================
 * EDUVERSE - MAIN APPLICATION
 * =============================================================================
 * Core application logic, routing, UI components, and page rendering
 * 
 * ALGORITHM: Application Flow
 * 1. Initialize database on page load
 * 2. Check for existing session
 * 3. If logged in, load dashboard
 * 4. If not, show login page
 * 5. Handle navigation and routing
 * 6. Render dynamic content based on page
 * 7. Handle user interactions
 * 
 * @author EduVerse Development Team
 * @version 1.0.0
 * @since 2024
 */

// =====================================================================
// GLOBAL STATE
// =====================================================================

const App = {
    currentPage: 'dashboard',
    sidebarCollapsed: false,
    charts: {}
};

// =====================================================================
// NAVIGATION CONFIGURATION
// =====================================================================

const NAV_MENU = {
    main: {
        title: 'Main',
        items: [
            { id: 'dashboard', icon: 'fa-home', label: 'Dashboard', permission: null },
            { id: 'announcements', icon: 'fa-bullhorn', label: 'Announcements', permission: null },
            { id: 'messages', icon: 'fa-envelope', label: 'Messages', permission: null }
        ]
    },
    academic: {
        title: 'Academic',
        items: [
            { id: 'students', icon: 'fa-user-graduate', label: 'Students', permission: 'students.view' },
            { id: 'teachers', icon: 'fa-chalkboard-teacher', label: 'Teachers', permission: 'teachers.view' },
            { id: 'staff', icon: 'fa-users', label: 'Staff', permission: 'staff.view' },
            { id: 'parents', icon: 'fa-users', label: 'Parents', permission: 'parents.view' },
            { id: 'academics', icon: 'fa-book-open', label: 'Academics', permission: 'academics.subjects' }
        ]
    },
    operations: {
        title: 'Operations',
        items: [
            { id: 'fees', icon: 'fa-dollar-sign', label: 'Fees & Finance', permission: 'fees.view' },
            { id: 'library', icon: 'fa-book', label: 'Library', permission: 'library.view' },
            { id: 'hostel', icon: 'fa-bed', label: 'Hostel', permission: null },
            { id: 'attendance', icon: 'fa-calendar-check', label: 'Attendance', permission: 'academics.attendance' }
        ]
    },
    system: {
        title: 'System',
        items: [
            { id: 'reports', icon: 'fa-chart-bar', label: 'Reports', permission: 'reports.view' },
            { id: 'settings', icon: 'fa-cog', label: 'Settings', permission: null },
            { id: 'admin', icon: 'fa-shield-alt', label: 'Admin Panel', permission: 'admin.users' }
        ]
    }
};

// =====================================================================
// INITIALIZATION
// =====================================================================

/**
 * Initialize the application
 */
async function initApp() {
    try {
        // Initialize database
        await Database.init();
        
        // Create floating particles
        createParticles();
        
        // Setup event listeners
        setupEventListeners();
        
        // Clear any stale session data
        localStorage.removeItem('eduverse_session');
        
        // Show login page
        showLogin();
        
    } catch (error) {
        console.error('Failed to initialize app:', error);
        showToast('error', 'Initialization Error', 'Failed to initialize the application');
    }
}

/**
 * Setup global event listeners
 */
function setupEventListeners() {
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Role tabs
    const roleTabs = document.querySelectorAll('.role-tab');
    roleTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            roleTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
        });
    });
    
    // Close dropdowns on outside click
    document.addEventListener('click', (e) => {
        const userDropdown = document.getElementById('userDropdown');
        if (userDropdown && !userDropdown.contains(e.target)) {
            userDropdown.classList.remove('open');
        }
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Ctrl+K for search
        if (e.ctrlKey && e.key === 'k') {
            e.preventDefault();
            document.querySelector('.search-input')?.focus();
        }
        
        // Escape to close modal
        if (e.key === 'Escape') {
            closeModal();
        }
    });
}

// =====================================================================
// AUTHENTICATION
// =====================================================================

/**
 * Handle login form submission
 */
async function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    if (!username || !password) {
        showLoginAlert('Please enter username and password', 'danger');
        return;
    }
    
    // Show loading state
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing in...';
    submitBtn.disabled = true;
    
    try {
        const result = await Auth.login(username, password);
        
        if (result.success) {
            showLoginAlert('Login successful! Redirecting...', 'success');
            setTimeout(() => {
                showApp(result.user);
            }, 1000);
        } else {
            showLoginAlert(result.error, 'danger');
        }
    } catch (error) {
        showLoginAlert('An error occurred. Please try again.', 'danger');
    } finally {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

/**
 * Show login alert message
 */
function showLoginAlert(message, type) {
    const alert = document.getElementById('loginAlert');
    alert.className = `alert alert-${type} show`;
    alert.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i> ${message}`;
    
    setTimeout(() => {
        alert.classList.remove('show');
    }, 5000);
}

/**
 * Logout user
 */
async function logout() {
    await Auth.logout();
    showLogin();
}

/**
 * Toggle password visibility
 */
function togglePassword() {
    const passwordInput = document.getElementById('loginPassword');
    const icon = document.getElementById('passwordIcon');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

// =====================================================================
// UI MANAGEMENT
// =====================================================================

/**
 * Show login page
 */
function showLogin() {
    document.getElementById('loginPage').style.display = 'flex';
    document.getElementById('appContainer').style.display = 'none';
}

/**
 * Show main application
 */
function showApp(user) {
    document.getElementById('loginPage').style.display = 'none';
    document.getElementById('appContainer').style.display = 'flex';
    
    // Update user info in UI
    updateUserInfo(user);
    
    // Build navigation based on permissions
    buildNavigation();
    
    // Load dashboard
    navigateTo('dashboard');
}

/**
 * Update user information in UI
 */
function updateUserInfo(user) {
    const initials = (user.firstName?.[0] || '') + (user.lastName?.[0] || '');
    const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username;
    
    // Sidebar
    document.getElementById('sidebarAvatar').textContent = initials;
    document.getElementById('sidebarUserName').textContent = fullName;
    document.getElementById('sidebarUserRole').textContent = user.role;
    
    // Navbar
    document.getElementById('navAvatar').textContent = initials;
    document.getElementById('navUserName').textContent = fullName;
    
    // Dropdown
    document.getElementById('dropdownUserName').textContent = fullName;
    document.getElementById('dropdownUserEmail').textContent = user.email || '';
}

/**
 * Build navigation menu based on permissions
 */
function buildNavigation() {
    const navContainer = document.getElementById('sidebarNav');
    navContainer.innerHTML = '';
    
    const user = Auth.getCurrentUser();
    
    for (const [sectionKey, section] of Object.entries(NAV_MENU)) {
        // Create section
        const sectionDiv = document.createElement('div');
        sectionDiv.className = 'nav-section';
        
        // Section title
        const titleDiv = document.createElement('div');
        titleDiv.className = 'nav-section-title';
        titleDiv.textContent = section.title;
        sectionDiv.appendChild(titleDiv);
        
        // Filter items by permission
        const allowedItems = section.items.filter(item => {
            if (!item.permission) return true;
            return Auth.hasPermission(item.permission);
        });
        
        // Add nav items
        allowedItems.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'nav-item';
            itemDiv.dataset.page = item.id;
            itemDiv.innerHTML = `
                <i class="nav-icon fas ${item.icon}"></i>
                <span class="nav-label">${item.label}</span>
            `;
            itemDiv.addEventListener('click', () => navigateTo(item.id));
            sectionDiv.appendChild(itemDiv);
        });
        
        navContainer.appendChild(sectionDiv);
    }
}

/**
 * Navigate to a page
 */
function navigateTo(pageId) {
    // Close dropdowns
    document.getElementById('userDropdown')?.classList.remove('open');
    
    // Update active nav item
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.page === pageId) {
            item.classList.add('active');
        }
    });
    
    // Update page title
    const pageTitle = document.getElementById('pageTitle');
    const navItem = findNavItem(pageId);
    if (navItem) {
        pageTitle.textContent = navItem.label;
    }
    
    // Render page content
    renderPage(pageId);
    
    // Close sidebar on mobile
    if (window.innerWidth < 1024) {
        document.getElementById('sidebar').classList.remove('show');
    }
}

/**
 * Find nav item by ID
 */
function findNavItem(id) {
    for (const section of Object.values(NAV_MENU)) {
        const item = section.items.find(i => i.id === id);
        if (item) return item;
    }
    return null;
}

/**
 * Toggle sidebar
 */
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const icon = document.getElementById('sidebarToggleIcon');
    
    sidebar.classList.toggle('collapsed');
    App.sidebarCollapsed = sidebar.classList.contains('collapsed');
    
    if (App.sidebarCollapsed) {
        icon.classList.remove('fa-chevron-left');
        icon.classList.add('fa-chevron-right');
    } else {
        icon.classList.remove('fa-chevron-right');
        icon.classList.add('fa-chevron-left');
    }
}

/**
 * Toggle user dropdown
 */
function toggleUserDropdown() {
    const dropdown = document.getElementById('userDropdown');
    dropdown.classList.toggle('open');
}

// =====================================================================
// PAGE RENDERING
// =====================================================================

/**
 * Render page content
 */
async function renderPage(pageId) {
    const content = document.getElementById('pageContent');
    content.innerHTML = '';
    content.className = 'page-content page-enter';
    
    // Route to appropriate page renderer
    switch (pageId) {
        case 'dashboard':
            await renderDashboard(content);
            break;
        case 'students':
            await renderStudents(content);
            break;
        case 'teachers':
            await renderTeachers(content);
            break;
        case 'staff':
            await renderStaff(content);
            break;
        case 'parents':
            await renderParents(content);
            break;
        case 'academics':
            await renderAcademics(content);
            break;
        case 'fees':
            await renderFees(content);
            break;
        case 'library':
            await renderLibrary(content);
            break;
        case 'hostel':
            await renderHostel(content);
            break;
        case 'attendance':
            await renderAttendance(content);
            break;
        case 'reports':
            await renderReports(content);
            break;
        case 'messages':
            await renderMessages(content);
            break;
        case 'announcements':
            await renderAnnouncements(content);
            break;
        case 'settings':
            await renderSettings(content);
            break;
        case 'admin':
            await renderAdmin(content);
            break;
        default:
            content.innerHTML = '<p>Page not found</p>';
    }
}

// =====================================================================
// DASHBOARD PAGE
// =====================================================================

/**
 * Render dashboard page
 */
async function renderDashboard(container) {
    const user = Auth.getCurrentUser();
    const role = user?.role || 'guest';
    
    // Get statistics
    const stats = await getDashboardStats();
    
    let html = `
        <div class="page-header">
            <div class="page-header-top">
                <div>
                    <h1 class="page-heading">Welcome back, ${user?.firstName || 'User'}!</h1>
                    <p class="text-secondary">Here's what's happening at EduVerse today.</p>
                </div>
            </div>
        </div>
        
        <!-- Stats Grid -->
        <div class="stats-grid">
            <div class="stat-card stat-card-primary">
                <div class="stat-header">
                    <div class="stat-icon stat-icon-primary">
                        <i class="fas fa-user-graduate"></i>
                    </div>
                    <span class="stat-trend up">+12%</span>
                </div>
                <div class="stat-value">${stats.students}</div>
                <div class="stat-label">Total Students</div>
            </div>
            
            <div class="stat-card stat-card-success">
                <div class="stat-header">
                    <div class="stat-icon stat-icon-success">
                        <i class="fas fa-chalkboard-teacher"></i>
                    </div>
                    <span class="stat-trend up">+5%</span>
                </div>
                <div class="stat-value">${stats.teachers}</div>
                <div class="stat-label">Teachers</div>
            </div>
            
            <div class="stat-card stat-card-warning">
                <div class="stat-header">
                    <div class="stat-icon stat-icon-warning">
                        <i class="fas fa-book"></i>
                    </div>
                </div>
                <div class="stat-value">${stats.books}</div>
                <div class="stat-label">Library Books</div>
            </div>
            
            <div class="stat-card stat-card-info">
                <div class="stat-header">
                    <div class="stat-icon stat-icon-info">
                        <i class="fas fa-dollar-sign"></i>
                    </div>
                </div>
                <div class="stat-value">$${stats.feesCollected.toLocaleString()}</div>
                <div class="stat-label">Fees Collected</div>
            </div>
        </div>
        
        <!-- Charts Row -->
        <div class="d-grid" style="grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: var(--spacing-lg); margin-bottom: var(--spacing-xl);">
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">Attendance Overview</h3>
                </div>
                <div class="card-body">
                    <canvas id="attendanceChart" height="250"></canvas>
                </div>
            </div>
            
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">Fee Collection</h3>
                </div>
                <div class="card-body">
                    <canvas id="feeChart" height="250"></canvas>
                </div>
            </div>
        </div>
        
        <!-- Recent Activity & Announcements -->
        <div class="d-grid" style="grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: var(--spacing-lg);">
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">Recent Announcements</h3>
                    <button class="btn btn-sm btn-secondary" onclick="navigateTo('announcements')">View All</button>
                </div>
                <div class="card-body" style="padding: 0;">
                    <div id="announcementsList">
                        <!-- Announcements will be loaded here -->
                    </div>
                </div>
            </div>
            
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">Quick Actions</h3>
                </div>
                <div class="card-body">
                    <div class="d-grid" style="gap: var(--spacing-md);">
                        ${getQuickActions(role)}
                    </div>
                </div>
            </div>
        </div>
    `;
    
    container.innerHTML = html;
    
    // Render charts
    renderDashboardCharts();
    
    // Load announcements
    loadAnnouncementsList();
}

/**
 * Get dashboard statistics
 */
async function getDashboardStats() {
    const students = await Database.count(Database.TABLES.STUDENTS);
    const teachers = await Database.count(Database.TABLES.TEACHERS);
    const books = await Database.count(Database.TABLES.BOOKS);
    
    // Calculate fees collected
    const fees = await Database.getAll(Database.TABLES.FEES);
    const feesCollected = fees
        .filter(f => f.status === 'paid')
        .reduce((sum, f) => sum + (f.paidAmount || 0), 0);
    
    return {
        students,
        teachers,
        books,
        feesCollected,
        classes: await Database.count(Database.TABLES.CLASSES),
        staff: await Database.count(Database.TABLES.STAFF)
    };
}

/**
 * Get quick actions based on role
 */
function getQuickActions(role) {
    const actions = {
        admin: [
            { icon: 'fa-user-plus', label: 'Add Student', page: 'students' },
            { icon: 'fa-user-tie', label: 'Add Teacher', page: 'teachers' },
            { icon: 'fa-dollar-sign', label: 'Collect Fee', page: 'fees' },
            { icon: 'fa-book', label: 'Library Books', page: 'library' }
        ],
        teacher: [
            { icon: 'fa-clipboard-check', label: 'Mark Attendance', page: 'attendance' },
            { icon: 'fa-pen', label: 'Enter Grades', page: 'academics' },
            { icon: 'fa-envelope', label: 'Send Message', page: 'messages' }
        ],
        student: [
            { icon: 'fa-book', label: 'Library', page: 'library' },
            { icon: 'fa-clipboard-list', label: 'My Grades', page: 'academics' },
            { icon: 'fa-calendar', label: 'Timetable', page: 'academics' }
        ],
        parent: [
            { icon: 'fa-eye', label: 'View Progress', page: 'academics' },
            { icon: 'fa-dollar-sign', label: 'Pay Fees', page: 'fees' },
            { icon: 'fa-envelope', label: 'Contact Teacher', page: 'messages' }
        ],
        staff: [
            { icon: 'fa-bed', label: 'Hostel', page: 'hostel' },
            { icon: 'fa-dollar-sign', label: 'Finance', page: 'fees' }
        ],
        guest: [
            { icon: 'fa-info-circle', label: 'About Us', page: 'announcements' },
            { icon: 'fa-book', label: 'Library', page: 'library' }
        ]
    };
    
    const userActions = actions[role] || actions.guest;
    
    return userActions.map(action => `
        <button class="btn btn-secondary d-flex align-center gap-md" style="justify-content: flex-start;" onclick="navigateTo('${action.page}')">
            <i class="fas ${action.icon} text-gold"></i>
            ${action.label}
        </button>
    `).join('');
}

/**
 * Render dashboard charts
 */
function renderDashboardCharts() {
    // Attendance Chart
    const attendanceCtx = document.getElementById('attendanceChart');
    if (attendanceCtx) {
        new Chart(attendanceCtx, {
            type: 'doughnut',
            data: {
                labels: ['Present', 'Absent', 'Late'],
                datasets: [{
                    data: [85, 10, 5],
                    backgroundColor: ['#238636', '#DA3633', '#D29922'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { color: '#8B949E' }
                    }
                }
            }
        });
    }
    
    // Fee Chart
    const feeCtx = document.getElementById('feeChart');
    if (feeCtx) {
        new Chart(feeCtx, {
            type: 'bar',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Collection',
                    data: [45000, 52000, 48000, 61000, 55000, 67000],
                    backgroundColor: '#D4AF37',
                    borderRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    x: {
                        ticks: { color: '#8B949E' },
                        grid: { color: 'rgba(139, 148, 158, 0.1)' }
                    },
                    y: {
                        ticks: { color: '#8B949E' },
                        grid: { color: 'rgba(139, 148, 158, 0.1)' }
                    }
                }
            }
        });
    }
}

/**
 * Load announcements list
 */
async function loadAnnouncementsList() {
    const announcements = await Database.getAll(Database.TABLES.ANNOUNCEMENTS, {
        sortBy: 'createdAt',
        sortOrder: 'desc',
        limit: 5
    });
    
    const container = document.getElementById('announcementsList');
    
    if (announcements.length === 0) {
        container.innerHTML = '<div class="p-lg text-center text-muted">No announcements yet</div>';
        return;
    }
    
    container.innerHTML = announcements.map(a => `
        <div style="padding: var(--spacing-md) var(--spacing-lg); border-bottom: 1px solid var(--border-subtle);">
            <div class="d-flex justify-between align-center mb-sm">
                <span class="status-badge ${getPriorityClass(a.priority)}">${a.priority}</span>
                <span class="text-muted" style="font-size: 0.75rem;">${Database.formatDate(a.createdAt)}</span>
            </div>
            <h4 style="font-size: 0.9rem; margin-bottom: var(--spacing-xs);">${a.title}</h4>
            <p class="text-muted" style="font-size: 0.8rem;">${a.content.substring(0, 100)}...</p>
        </div>
    `).join('');
}

/**
 * Get priority class
 */
function getPriorityClass(priority) {
    const classes = {
        high: 'danger',
        medium: 'warning',
        low: 'active'
    };
    return classes[priority] || 'active';
}

// =====================================================================
// STUDENTS PAGE
// =====================================================================

/**
 * Render students page
 */
async function renderStudents(container) {
    const students = await Database.getAll(Database.TABLES.STUDENTS, {
        sortBy: 'createdAt',
        sortOrder: 'desc'
    });
    
    const classes = await Database.getAll(Database.TABLES.CLASSES);
    
    let html = `
        <div class="page-header">
            <div class="page-header-top">
                <div>
                    <h1 class="page-heading">Students</h1>
                    <p class="text-secondary">Manage student records and information</p>
                </div>
                <button class="btn btn-primary" onclick="openStudentModal()">
                    <i class="fas fa-plus"></i> Add Student
                </button>
            </div>
        </div>
        
        <div class="card">
            <div class="card-header">
                <div class="d-flex gap-md align-center">
                    <input type="text" class="form-input" placeholder="Search students..." style="width: 250px;" id="studentSearch" oninput="filterStudents()">
                    <select class="form-input" style="width: 150px;" id="classFilter" onchange="filterStudents()">
                        <option value="">All Classes</option>
                        ${classes.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
                    </select>
                </div>
            </div>
            <div class="table-container">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Admission No.</th>
                            <th>Name</th>
                            <th>Class</th>
                            <th>Roll No.</th>
                            <th>Gender</th>
                            <th>Phone</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody id="studentsTableBody">
                        ${students.length === 0 ? '<tr><td colspan="8" class="text-center text-muted">No students found</td></tr>' : ''}
                        ${students.map(s => `
                            <tr>
                                <td><span class="font-mono">${s.admissionNumber || 'N/A'}</span></td>
                                <td>${s.firstName} ${s.lastName}</td>
                                <td>${getClassName(s.classId, classes)}</td>
                                <td>${s.rollNumber || '-'}</td>
                                <td>${s.gender || '-'}</td>
                                <td>${s.phone || '-'}</td>
                                <td><span class="status-badge ${s.status === 'active' ? 'active' : 'inactive'}">${s.status || 'active'}</span></td>
                                <td>
                                    <div class="table-actions">
                                        <button class="table-action-btn" title="View" onclick="viewStudent('${s.id}')">
                                            <i class="fas fa-eye"></i>
                                        </button>
                                        <button class="table-action-btn" title="Edit" onclick="editStudent('${s.id}')">
                                            <i class="fas fa-edit"></i>
                                        </button>
                                        <button class="table-action-btn danger" title="Delete" onclick="deleteStudent('${s.id}')">
                                            <i class="fas fa-trash"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
    
    container.innerHTML = html;
}

/**
 * Get class name from ID
 */
function getClassName(classId, classes) {
    const cls = classes.find(c => c.id === classId);
    return cls ? cls.name : '-';
}

// =====================================================================
// TEACHERS PAGE
// =====================================================================

/**
 * Render teachers page
 */
async function renderTeachers(container) {
    const teachers = await Database.getAll(Database.TABLES.TEACHERS, {
        sortBy: 'createdAt',
        sortOrder: 'desc'
    });
    
    let html = `
        <div class="page-header">
            <div class="page-header-top">
                <div>
                    <h1 class="page-heading">Teachers</h1>
                    <p class="text-secondary">Manage teaching staff records</p>
                </div>
                <button class="btn btn-primary" onclick="openTeacherModal()">
                    <i class="fas fa-plus"></i> Add Teacher
                </button>
            </div>
        </div>
        
        <div class="card">
            <div class="card-header">
                <input type="text" class="form-input" placeholder="Search teachers..." style="width: 250px;">
            </div>
            <div class="table-container">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Employee ID</th>
                            <th>Name</th>
                            <th>Qualification</th>
                            <th>Experience</th>
                            <th>Phone</th>
                            <th>Email</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${teachers.length === 0 ? '<tr><td colspan="8" class="text-center text-muted">No teachers found</td></tr>' : ''}
                        ${teachers.map(t => `
                            <tr>
                                <td><span class="font-mono">${t.employeeId || 'N/A'}</span></td>
                                <td>${t.firstName} ${t.lastName}</td>
                                <td>${t.qualification || '-'}</td>
                                <td>${t.experience || 0} years</td>
                                <td>${t.phone || '-'}</td>
                                <td>${t.email || '-'}</td>
                                <td><span class="status-badge ${t.status === 'active' ? 'active' : 'inactive'}">${t.status || 'active'}</span></td>
                                <td>
                                    <div class="table-actions">
                                        <button class="table-action-btn" title="Edit"><i class="fas fa-edit"></i></button>
                                        <button class="table-action-btn danger" title="Delete"><i class="fas fa-trash"></i></button>
                                    </div>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
    
    container.innerHTML = html;
}

// =====================================================================
// STAFF PAGE
// =====================================================================

/**
 * Render staff page
 */
async function renderStaff(container) {
    const staff = await Database.getAll(Database.TABLES.STAFF, {
        sortBy: 'createdAt',
        sortOrder: 'desc'
    });
    
    let html = `
        <div class="page-header">
            <div class="page-header-top">
                <div>
                    <h1 class="page-heading">Staff</h1>
                    <p class="text-secondary">Manage non-teaching staff</p>
                </div>
                <button class="btn btn-primary" onclick="openStaffModal()">
                    <i class="fas fa-plus"></i> Add Staff
                </button>
            </div>
        </div>
        
        <div class="card">
            <div class="table-container">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Employee ID</th>
                            <th>Name</th>
                            <th>Department</th>
                            <th>Designation</th>
                            <th>Phone</th>
                            <th>Join Date</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${staff.length === 0 ? '<tr><td colspan="8" class="text-center text-muted">No staff found</td></tr>' : ''}
                        ${staff.map(s => `
                            <tr>
                                <td><span class="font-mono">${s.employeeId || 'N/A'}</span></td>
                                <td>${s.firstName} ${s.lastName}</td>
                                <td>${s.department || '-'}</td>
                                <td>${s.designation || '-'}</td>
                                <td>${s.phone || '-'}</td>
                                <td>${Database.formatDate(s.joinDate)}</td>
                                <td><span class="status-badge ${s.status === 'active' ? 'active' : 'inactive'}">${s.status || 'active'}</span></td>
                                <td>
                                    <div class="table-actions">
                                        <button class="table-action-btn"><i class="fas fa-edit"></i></button>
                                        <button class="table-action-btn danger"><i class="fas fa-trash"></i></button>
                                    </div>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
    
    container.innerHTML = html;
}

// =====================================================================
// PARENTS PAGE
// =====================================================================

/**
 * Render parents page
 */
async function renderParents(container) {
    const parents = await Database.getAll(Database.TABLES.PARENTS, {
        sortBy: 'createdAt',
        sortOrder: 'desc'
    });
    
    let html = `
        <div class="page-header">
            <div class="page-header-top">
                <div>
                    <h1 class="page-heading">Parents</h1>
                    <p class="text-secondary">Manage parent/guardian information</p>
                </div>
            </div>
        </div>
        
        <div class="card">
            <div class="table-container">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Father Name</th>
                            <th>Mother Name</th>
                            <th>Father Phone</th>
                            <th>Mother Phone</th>
                            <th>Emergency Contact</th>
                            <th>Email</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${parents.length === 0 ? '<tr><td colspan="7" class="text-center text-muted">No parents found</td></tr>' : ''}
                        ${parents.map(p => `
                            <tr>
                                <td>${p.fatherName || '-'}</td>
                                <td>${p.motherName || '-'}</td>
                                <td>${p.fatherPhone || '-'}</td>
                                <td>${p.motherPhone || '-'}</td>
                                <td>${p.emergencyContact || '-'}</td>
                                <td>${p.email || '-'}</td>
                                <td>
                                    <div class="table-actions">
                                        <button class="table-action-btn"><i class="fas fa-edit"></i></button>
                                        <button class="table-action-btn danger"><i class="fas fa-trash"></i></button>
                                    </div>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
    
    container.innerHTML = html;
}

// =====================================================================
// ACADEMICS PAGE
// =====================================================================

/**
 * Render academics page
 */
async function renderAcademics(container) {
    const classes = await Database.getAll(Database.TABLES.CLASSES);
    const subjects = await Database.getAll(Database.TABLES.SUBJECTS);
    
    let html = `
        <div class="page-header">
            <div class="page-header-top">
                <div>
                    <h1 class="page-heading">Academics</h1>
                    <p class="text-secondary">Manage classes, subjects, and academic records</p>
                </div>
            </div>
        </div>
        
        <!-- Classes Section -->
        <div class="mb-xl">
            <h3 style="margin-bottom: var(--spacing-md);">Classes</h3>
            <div class="stats-grid">
                ${classes.slice(0, 4).map(c => `
                    <div class="card" style="padding: var(--spacing-lg);">
                        <div class="d-flex justify-between align-center">
                            <div>
                                <h4>${c.name}</h4>
                                <p class="text-muted">Section ${c.section}</p>
                            </div>
                            <div class="stat-icon stat-icon-primary" style="width: 40px; height: 40px; font-size: 1rem;">
                                <i class="fas fa-users"></i>
                            </div>
                        </div>
                        <div class="mt-md text-muted" style="font-size: 0.875rem;">
                            <i class="fas fa-user-graduate"></i> ${c.capacity || 0} students
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
        
        <!-- Subjects Section -->
        <div>
            <h3 style="margin-bottom: var(--spacing-md);">Subjects</h3>
            <div class="card">
                <div class="table-container">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Subject Code</th>
                                <th>Subject Name</th>
                                <th>Class</th>
                                <th>Credit Hours</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${subjects.length === 0 ? '<tr><td colspan="4" class="text-center text-muted">No subjects found</td></tr>' : ''}
                            ${subjects.slice(0, 10).map(s => `
                                <tr>
                                    <td><span class="font-mono">${s.code}</span></td>
                                    <td>${s.name}</td>
                                    <td>${getClassName(s.classId, classes)}</td>
                                    <td>${s.creditHours}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
    
    container.innerHTML = html;
}

// =====================================================================
// FEES PAGE
// =====================================================================

/**
 * Render fees page
 */
async function renderFees(container) {
    const fees = await Database.getAll(Database.TABLES.FEES, {
        sortBy: 'createdAt',
        sortOrder: 'desc'
    });
    
    const totalFees = fees.reduce((sum, f) => sum + (f.amount || 0), 0);
    const paidFees = fees.filter(f => f.status === 'paid').reduce((sum, f) => sum + (f.paidAmount || 0), 0);
    const pendingFees = totalFees - paidFees;
    
    let html = `
        <div class="page-header">
            <div class="page-header-top">
                <div>
                    <h1 class="page-heading">Fees & Finance</h1>
                    <p class="text-secondary">Manage fee collection and financial records</p>
                </div>
            </div>
        </div>
        
        <!-- Fee Stats -->
        <div class="stats-grid mb-xl">
            <div class="stat-card stat-card-success">
                <div class="stat-header">
                    <div class="stat-icon stat-icon-success"><i class="fas fa-check-circle"></i></div>
                </div>
                <div class="stat-value">$${paidFees.toLocaleString()}</div>
                <div class="stat-label">Total Collected</div>
            </div>
            
            <div class="stat-card stat-card-warning">
                <div class="stat-header">
                    <div class="stat-icon stat-icon-warning"><i class="fas fa-clock"></i></div>
                </div>
                <div class="stat-value">$${pendingFees.toLocaleString()}</div>
                <div class="stat-label">Pending</div>
            </div>
            
            <div class="stat-card stat-card-primary">
                <div class="stat-header">
                    <div class="stat-icon stat-icon-primary"><i class="fas fa-dollar-sign"></i></div>
                </div>
                <div class="stat-value">$${totalFees.toLocaleString()}</div>
                <div class="stat-label">Total Fees</div>
            </div>
        </div>
        
        <!-- Fees Table -->
        <div class="card">
            <div class="card-header">
                <h3 class="card-title">Fee Records</h3>
            </div>
            <div class="table-container">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Fee Type</th>
                            <th>Amount</th>
                            <th>Paid Amount</th>
                            <th>Due Date</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${fees.length === 0 ? '<tr><td colspan="6" class="text-center text-muted">No fee records found</td></tr>' : ''}
                        ${fees.map(f => `
                            <tr>
                                <td>${f.feeType || '-'}</td>
                                <td>$${(f.amount || 0).toLocaleString()}</td>
                                <td>$${(f.paidAmount || 0).toLocaleString()}</td>
                                <td>${Database.formatDate(f.dueDate)}</td>
                                <td><span class="status-badge ${f.status || 'unpaid'}">${f.status || 'unpaid'}</span></td>
                                <td>
                                    <div class="table-actions">
                                        <button class="table-action-btn"><i class="fas fa-eye"></i></button>
                                        <button class="table-action-btn"><i class="fas fa-edit"></i></button>
                                    </div>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
    
    container.innerHTML = html;
}

// =====================================================================
// LIBRARY PAGE
// =====================================================================

/**
 * Render library page
 */
async function renderLibrary(container) {
    const books = await Database.getAll(Database.TABLES.BOOKS);
    const issues = await Database.getAll(Database.TABLES.LIBRARY_ISSUES);
    
    const totalBooks = books.reduce((sum, b) => sum + (b.totalCopies || 0), 0);
    const availableBooks = books.reduce((sum, b) => sum + (b.availableCopies || 0), 0);
    const issuedBooks = issues.filter(i => !i.returnDate).length;
    
    let html = `
        <div class="page-header">
            <div class="page-header-top">
                <div>
                    <h1 class="page-heading">Library</h1>
                    <p class="text-secondary">Manage books and library operations</p>
                </div>
                <button class="btn btn-primary">
                    <i class="fas fa-plus"></i> Add Book
                </button>
            </div>
        </div>
        
        <!-- Library Stats -->
        <div class="stats-grid mb-xl">
            <div class="stat-card stat-card-primary">
                <div class="stat-header">
                    <div class="stat-icon stat-icon-primary"><i class="fas fa-book"></i></div>
                </div>
                <div class="stat-value">${totalBooks}</div>
                <div class="stat-label">Total Books</div>
            </div>
            
            <div class="stat-card stat-card-success">
                <div class="stat-header">
                    <div class="stat-icon stat-icon-success"><i class="fas fa-check"></i></div>
                </div>
                <div class="stat-value">${availableBooks}</div>
                <div class="stat-label">Available</div>
            </div>
            
            <div class="stat-card stat-card-warning">
                <div class="stat-header">
                    <div class="stat-icon stat-icon-warning"><i class="fas fa-exchange-alt"></i></div>
                </div>
                <div class="stat-value">${issuedBooks}</div>
                <div class="stat-label">Issued</div>
            </div>
        </div>
        
        <!-- Books Table -->
        <div class="card">
            <div class="card-header">
                <h3 class="card-title">Book Catalog</h3>
            </div>
            <div class="table-container">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>ISBN</th>
                            <th>Title</th>
                            <th>Author</th>
                            <th>Category</th>
                            <th>Available</th>
                            <th>Total</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${books.length === 0 ? '<tr><td colspan="7" class="text-center text-muted">No books found</td></tr>' : ''}
                        ${books.map(b => `
                            <tr>
                                <td><span class="font-mono">${b.isbn || '-'}</span></td>
                                <td>${b.title}</td>
                                <td>${b.author}</td>
                                <td>${b.category}</td>
                                <td><span class="text-success">${b.availableCopies}</span></td>
                                <td>${b.totalCopies}</td>
                                <td>
                                    <div class="table-actions">
                                        <button class="table-action-btn"><i class="fas fa-book-open"></i></button>
                                        <button class="table-action-btn"><i class="fas fa-edit"></i></button>
                                    </div>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
    
    container.innerHTML = html;
}

// =====================================================================
// HOSTEL PAGE
// =====================================================================

/**
 * Render hostel page
 */
async function renderHostel(container) {
    let html = `
        <div class="page-header">
            <div class="page-header-top">
                <div>
                    <h1 class="page-heading">Hostel</h1>
                    <p class="text-secondary">Manage hostel facilities and accommodation</p>
                </div>
            </div>
        </div>
        
        <div class="stats-grid mb-xl">
            <div class="stat-card stat-card-primary">
                <div class="stat-header">
                    <div class="stat-icon stat-icon-primary"><i class="fas fa-bed"></i></div>
                </div>
                <div class="stat-value">120</div>
                <div class="stat-label">Total Beds</div>
            </div>
            
            <div class="stat-card stat-card-success">
                <div class="stat-header">
                    <div class="stat-icon stat-icon-success"><i class="fas fa-check"></i></div>
                </div>
                <div class="stat-value">98</div>
                <div class="stat-label">Occupied</div>
            </div>
            
            <div class="stat-card stat-card-warning">
                <div class="stat-header">
                    <div class="stat-icon stat-icon-warning"><i class="fas fa-user-clock"></i></div>
                </div>
                <div class="stat-value">22</div>
                <div class="stat-label">Available</div>
            </div>
        </div>
        
        <div class="card">
            <div class="card-header">
                <h3 class="card-title">Hostel Blocks</h3>
            </div>
            <div class="card-body">
                <div class="d-grid" style="grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: var(--spacing-lg);">
                    <div class="card" style="background: var(--bg-glass);">
                        <div class="card-body">
                            <h4>Block A - Boys Hostel</h4>
                            <p class="text-muted mt-sm">Capacity: 60 | Occupied: 52</p>
                            <div class="mt-md">
                                <div style="background: var(--bg-dark); height: 8px; border-radius: 4px; overflow: hidden;">
                                    <div style="background: var(--status-success); height: 100%; width: 87%;"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="card" style="background: var(--bg-glass);">
                        <div class="card-body">
                            <h4>Block B - Girls Hostel</h4>
                            <p class="text-muted mt-sm">Capacity: 60 | Occupied: 46</p>
                            <div class="mt-md">
                                <div style="background: var(--bg-dark); height: 8px; border-radius: 4px; overflow: hidden;">
                                    <div style="background: var(--status-warning); height: 100%; width: 77%;"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    container.innerHTML = html;
}

// =====================================================================
// ATTENDANCE PAGE
// =====================================================================

/**
 * Render attendance page
 */
async function renderAttendance(container) {
    let html = `
        <div class="page-header">
            <div class="page-header-top">
                <div>
                    <h1 class="page-heading">Attendance</h1>
                    <p class="text-secondary">Track and manage student attendance</p>
                </div>
            </div>
        </div>
        
        <div class="card mb-xl">
            <div class="card-header">
                <h3 class="card-title">Mark Attendance</h3>
            </div>
            <div class="card-body">
                <div class="d-flex gap-lg align-center mb-lg">
                    <div class="form-group" style="margin-bottom: 0; flex: 1;">
                        <label class="form-label">Class</label>
                        <select class="form-input">
                            <option>Select Class</option>
                            <option>Grade 1</option>
                            <option>Grade 2</option>
                            <option>Grade 3</option>
                        </select>
                    </div>
                    <div class="form-group" style="margin-bottom: 0; flex: 1;">
                        <label class="form-label">Date</label>
                        <input type="date" class="form-input">
                    </div>
                    <button class="btn btn-primary" style="margin-top: 20px;">
                        <i class="fas fa-search"></i> Load Students
                    </button>
                </div>
            </div>
        </div>
        
        <div class="card">
            <div class="card-header">
                <h3 class="card-title">Today's Summary</h3>
            </div>
            <div class="card-body">
                <div class="d-flex gap-xl justify-center">
                    <div class="text-center">
                        <div class="stat-value text-success">85%</div>
                        <div class="text-muted">Present</div>
                    </div>
                    <div class="text-center">
                        <div class="stat-value text-danger">10%</div>
                        <div class="text-muted">Absent</div>
                    </div>
                    <div class="text-center">
                        <div class="stat-value text-warning">5%</div>
                        <div class="text-muted">Late</div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    container.innerHTML = html;
}

// =====================================================================
// REPORTS PAGE
// =====================================================================

/**
 * Render reports page
 */
async function renderReports(container) {
    let html = `
        <div class="page-header">
            <div class="page-header-top">
                <div>
                    <h1 class="page-heading">Reports</h1>
                    <p class="text-secondary">Generate and view academic reports</p>
                </div>
            </div>
        </div>
        
        <div class="d-grid" style="grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: var(--spacing-lg);">
            <div class="card">
                <div class="card-body text-center" style="padding: var(--spacing-2xl);">
                    <div class="stat-icon stat-icon-primary" style="width: 64px; height: 64px; margin: 0 auto var(--spacing-lg); font-size: 1.5rem;">
                        <i class="fas fa-chart-pie"></i>
                    </div>
                    <h4>Academic Report</h4>
                    <p class="text-muted mt-sm">Student performance and grades</p>
                    <button class="btn btn-primary mt-lg">
                        <i class="fas fa-download"></i> Generate
                    </button>
                </div>
            </div>
            
            <div class="card">
                <div class="card-body text-center" style="padding: var(--spacing-2xl);">
                    <div class="stat-icon stat-icon-success" style="width: 64px; height: 64px; margin: 0 auto var(--spacing-lg); font-size: 1.5rem;">
                        <i class="fas fa-users"></i>
                    </div>
                    <h4>Attendance Report</h4>
                    <p class="text-muted mt-sm">Daily and monthly attendance</p>
                    <button class="btn btn-primary mt-lg">
                        <i class="fas fa-download"></i> Generate
                    </button>
                </div>
            </div>
            
            <div class="card">
                <div class="card-body text-center" style="padding: var(--spacing-2xl);">
                    <div class="stat-icon stat-icon-warning" style="width: 64px; height: 64px; margin: 0 auto var(--spacing-lg); font-size: 1.5rem;">
                        <i class="fas fa-dollar-sign"></i>
                    </div>
                    <h4>Financial Report</h4>
                    <p class="text-muted mt-sm">Fee collection and expenses</p>
                    <button class="btn btn-primary mt-lg">
                        <i class="fas fa-download"></i> Generate
                    </button>
                </div>
            </div>
            
            <div class="card">
                <div class="card-body text-center" style="padding: var(--spacing-2xl);">
                    <div class="stat-icon stat-icon-info" style="width: 64px; height: 64px; margin: 0 auto var(--spacing-lg); font-size: 1.5rem;">
                        <i class="fas fa-book"></i>
                    </div>
                    <h4>Library Report</h4>
                    <p class="text-muted mt-sm">Book issue and return statistics</p>
                    <button class="btn btn-primary mt-lg">
                        <i class="fas fa-download"></i> Generate
                    </button>
                </div>
            </div>
        </div>
    `;
    
    container.innerHTML = html;
}

// =====================================================================
// MESSAGES PAGE
// =====================================================================

/**
 * Render messages page
 */
async function renderMessages(container) {
    const messages = await Database.getAll(Database.TABLES.MESSAGES, {
        sortBy: 'createdAt',
        sortOrder: 'desc',
        limit: 20
    });
    
    let html = `
        <div class="page-header">
            <div class="page-header-top">
                <div>
                    <h1 class="page-heading">Messages</h1>
                    <p class="text-secondary">Internal messaging system</p>
                </div>
                <button class="btn btn-primary" onclick="openMessageModal()">
                    <i class="fas fa-plus"></i> New Message
                </button>
            </div>
        </div>
        
        <div class="card">
            <div class="table-container">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>From</th>
                            <th>Subject</th>
                            <th>Message</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${messages.length === 0 ? '<tr><td colspan="6" class="text-center text-muted">No messages yet</td></tr>' : ''}
                        ${messages.map(m => `
                            <tr>
                                <td>${m.senderId || '-'}</td>
                                <td>${m.subject || '-'}</td>
                                <td>${(m.content || '').substring(0, 50)}...</td>
                                <td>${Database.formatDateTime(m.createdAt)}</td>
                                <td><span class="status-badge ${m.isRead === 'yes' ? 'active' : 'pending'}">${m.isRead === 'yes' ? 'Read' : 'Unread'}</span></td>
                                <td>
                                    <div class="table-actions">
                                        <button class="table-action-btn"><i class="fas fa-eye"></i></button>
                                        <button class="table-action-btn danger"><i class="fas fa-trash"></i></button>
                                    </div>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
    
    container.innerHTML = html;
}

// =====================================================================
// ANNOUNCEMENTS PAGE
// =====================================================================

/**
 * Render announcements page
 */
async function renderAnnouncements(container) {
    const announcements = await Database.getAll(Database.TABLES.ANNOUNCEMENTS, {
        sortBy: 'createdAt',
        sortOrder: 'desc'
    });
    
    let html = `
        <div class="page-header">
            <div class="page-header-top">
                <div>
                    <h1 class="page-heading">Announcements</h1>
                    <p class="text-secondary">School announcements and notices</p>
                </div>
                ${Auth.hasPermission('admin.users') ? `
                <button class="btn btn-primary" onclick="openAnnouncementModal()">
                    <i class="fas fa-plus"></i> New Announcement
                </button>
                ` : ''}
            </div>
        </div>
        
        <div class="d-grid" style="gap: var(--spacing-lg);">
            ${announcements.length === 0 ? '<p class="text-muted">No announcements yet</p>' : ''}
            ${announcements.map(a => `
                <div class="card">
                    <div class="card-header">
                        <div>
                            <div class="d-flex gap-md align-center">
                                <h3 class="card-title">${a.title}</h3>
                                <span class="status-badge ${getPriorityClass(a.priority)}">${a.priority}</span>
                            </div>
                        </div>
                        <span class="text-muted">${Database.formatDateTime(a.createdAt)}</span>
                    </div>
                    <div class="card-body">
                        <p>${a.content}</p>
                    </div>
                    <div class="card-footer">
                        <span class="text-muted">
                            <i class="fas fa-user"></i> Posted by ${a.postedBy || 'Admin'}
                        </span>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
    
    container.innerHTML = html;
}

// =====================================================================
// SETTINGS PAGE
// =====================================================================

/**
 * Render settings page
 */
async function renderSettings(container) {
    const user = Auth.getCurrentUser();
    
    let html = `
        <div class="page-header">
            <div class="page-header-top">
                <div>
                    <h1 class="page-heading">Settings</h1>
                    <p class="text-secondary">Manage your account settings</p>
                </div>
            </div>
        </div>
        
        <div class="d-grid" style="grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: var(--spacing-lg);">
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">Profile Information</h3>
                </div>
                <div class="card-body">
                    <form id="profileForm">
                        <div class="form-grid">
                            <div class="form-group">
                                <label class="form-label">First Name</label>
                                <input type="text" class="form-input" value="${user?.firstName || ''}">
                            </div>
                            <div class="form-group">
                                <label class="form-label">Last Name</label>
                                <input type="text" class="form-input" value="${user?.lastName || ''}">
                            </div>
                            <div class="form-group full-width">
                                <label class="form-label">Email</label>
                                <input type="email" class="form-input" value="${user?.email || ''}">
                            </div>
                            <div class="form-group full-width">
                                <button type="submit" class="btn btn-primary">Save Changes</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">Change Password</h3>
                </div>
                <div class="card-body">
                    <form id="passwordForm">
                        <div class="form-group">
                            <label class="form-label">Current Password</label>
                            <input type="password" class="form-input" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">New Password</label>
                            <input type="password" class="form-input" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Confirm New Password</label>
                            <input type="password" class="form-input" required>
                        </div>
                        <button type="submit" class="btn btn-primary">Update Password</button>
                    </form>
                </div>
            </div>
        </div>
    `;
    
    container.innerHTML = html;
}

// =====================================================================
// ADMIN PAGE
// =====================================================================

/**
 * Render admin page
 */
async function renderAdmin(container) {
    const users = await Database.getAll(Database.TABLES.USERS);
    const logs = await Database.getAll(Database.TABLES.LOGS, {
        sortBy: 'timestamp',
        sortOrder: 'desc',
        limit: 50
    });
    
    let html = `
        <div class="page-header">
            <div class="page-header-top">
                <div>
                    <h1 class="page-heading">Admin Panel</h1>
                    <p class="text-secondary">System administration and management</p>
                </div>
            </div>
        </div>
        
        <!-- Admin Stats -->
        <div class="stats-grid mb-xl">
            <div class="stat-card stat-card-primary">
                <div class="stat-header">
                    <div class="stat-icon stat-icon-primary"><i class="fas fa-users"></i></div>
                </div>
                <div class="stat-value">${users.length}</div>
                <div class="stat-label">Total Users</div>
            </div>
            
            <div class="stat-card stat-card-success">
                <div class="stat-header">
                    <div class="stat-icon stat-icon-success"><i class="fas fa-user-shield"></i></div>
                </div>
                <div class="stat-value">${users.filter(u => u.role === 'admin').length}</div>
                <div class="stat-label">Admins</div>
            </div>
            
            <div class="stat-card stat-card-warning">
                <div class="stat-header">
                    <div class="stat-icon stat-icon-warning"><i class="fas fa-history"></i></div>
                </div>
                <div class="stat-value">${logs.length}</div>
                <div class="stat-label">Recent Logs</div>
            </div>
        </div>
        
        <!-- Users Table -->
        <div class="card mb-xl">
            <div class="card-header">
                <h3 class="card-title">User Management</h3>
            </div>
            <div class="table-container">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>Name</th>
                            <th>Role</th>
                            <th>Email</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${users.map(u => `
                            <tr>
                                <td><span class="font-mono">${u.username}</span></td>
                                <td>${u.firstName || ''} ${u.lastName || ''}</td>
                                <td><span class="status-badge ${u.role === 'admin' ? 'active' : ''}">${u.role}</span></td>
                                <td>${u.email || '-'}</td>
                                <td><span class="status-badge ${u.isActive ? 'active' : 'inactive'}">${u.isActive ? 'Active' : 'Inactive'}</span></td>
                                <td>
                                    <div class="table-actions">
                                        <button class="table-action-btn"><i class="fas fa-edit"></i></button>
                                        <button class="table-action-btn danger"><i class="fas fa-trash"></i></button>
                                    </div>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
        
        <!-- System Logs -->
        <div class="card">
            <div class="card-header">
                <h3 class="card-title">System Logs</h3>
            </div>
            <div class="table-container">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Timestamp</th>
                            <th>User</th>
                            <th>Action</th>
                            <th>Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${logs.map(l => `
                            <tr>
                                <td><span class="font-mono" style="font-size: 0.75rem;">${Database.formatDateTime(l.timestamp)}</span></td>
                                <td>${l.userId}</td>
                                <td>${l.action}</td>
                                <td>${l.details || '-'}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
    
    container.innerHTML = html;
}

// =====================================================================
// MODAL FUNCTIONS
// =====================================================================

/**
 * Open modal
 */
function openModal(title, content, footer = null) {
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalBody').innerHTML = content;
    
    if (footer) {
        document.getElementById('modalFooter').innerHTML = footer;
    }
    
    const overlay = document.getElementById('modalOverlay');
    overlay.style.display = 'flex';
    // Force reflow
    void overlay.offsetWidth;
    overlay.classList.add('show');
}

/**
 * Close modal
 */
function closeModal(e) {
    if (e && e.target !== e.currentTarget) return;
    const overlay = document.getElementById('modalOverlay');
    overlay.classList.remove('show');
    setTimeout(() => {
        overlay.style.display = 'none';
    }, 300);
}

/**
 * Open student modal
 */
function openStudentModal() {
    const content = `
        <form id="studentForm">
            <div class="form-grid">
                <div class="form-group">
                    <label class="form-label">First Name</label>
                    <input type="text" class="form-input" name="firstName" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Last Name</label>
                    <input type="text" class="form-input" name="lastName" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Admission Number</label>
                    <input type="text" class="form-input" name="admissionNumber">
                </div>
                <div class="form-group">
                    <label class="form-label">Roll Number</label>
                    <input type="number" class="form-input" name="rollNumber">
                </div>
                <div class="form-group">
                    <label class="form-label">Date of Birth</label>
                    <input type="date" class="form-input" name="dateOfBirth">
                </div>
                <div class="form-group">
                    <label class="form-label">Gender</label>
                    <select class="form-input" name="gender">
                        <option value="">Select</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">Phone</label>
                    <input type="tel" class="form-input" name="phone">
                </div>
                <div class="form-group">
                    <label class="form-label">Email</label>
                    <input type="email" class="form-input" name="email">
                </div>
                <div class="form-group full-width">
                    <label class="form-label">Address</label>
                    <textarea class="form-input" name="address" rows="2"></textarea>
                </div>
            </div>
        </form>
    `;
    
    const footer = `
        <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
        <button class="btn btn-primary" onclick="saveStudent()">Save Student</button>
    `;
    
    openModal('Add Student', content, footer);
}

/**
 * Open message modal
 */
function openMessageModal() {
    const users = Database.getAll(Database.TABLES.USERS);
    
    const content = `
        <form id="messageForm">
            <div class="form-group">
                <label class="form-label">To</label>
                <select class="form-input" name="receiverId">
                    <option value="">Select recipient</option>
                </select>
            </div>
            <div class="form-group">
                <label class="form-label">Subject</label>
                <input type="text" class="form-input" name="subject" required>
            </div>
            <div class="form-group">
                <label class="form-label">Message</label>
                <textarea class="form-input" name="content" rows="5" required></textarea>
            </div>
        </form>
    `;
    
    const footer = `
        <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
        <button class="btn btn-primary" onclick="sendMessage()">Send</button>
    `;
    
    openModal('New Message', content, footer);
}

/**
 * Save student
 */
async function saveStudent() {
    const form = document.getElementById('studentForm');
    if (!form) return;
    
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    try {
        await Database.insert(Database.TABLES.STUDENTS, {
            id: Database.generateId(),
            ...data,
            status: 'active',
            admissionNumber: data.admissionNumber || 'STU-' + Date.now()
        });
        
        showToast('success', 'Success', 'Student added successfully');
        closeModal();
        renderPage('students');
    } catch (error) {
        showToast('error', 'Error', 'Failed to add student');
    }
}

/**
 * Send message
 */
async function sendMessage() {
    const user = Auth.getCurrentUser();
    const form = document.getElementById('messageForm');
    if (!form) return;
    
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    try {
        await Database.insert(Database.TABLES.MESSAGES, {
            id: Database.generateId(),
            senderId: user?.id,
            receiverId: data.receiverId,
            subject: data.subject,
            content: data.content,
            isRead: 'no',
            createdAt: new Date().toISOString()
        });
        
        showToast('success', 'Success', 'Message sent successfully');
        closeModal();
        renderPage('messages');
    } catch (error) {
        showToast('error', 'Error', 'Failed to send message');
    }
}

// =====================================================================
// TOAST NOTIFICATIONS
// =====================================================================

/**
 * Show toast notification
 */
function showToast(type, title, message) {
    const container = document.getElementById('toastContainer');
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <div class="toast-icon">
            <i class="fas fa-${type === 'success' ? 'check' : type === 'error' ? 'times' : type === 'warning' ? 'exclamation' : 'info'}-circle"></i>
        </div>
        <div class="toast-content">
            <div class="toast-title">${title}</div>
            <div class="toast-message">${message}</div>
        </div>
        <button class="toast-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    container.appendChild(toast);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        toast.classList.add('removing');
        setTimeout(() => toast.remove(), 300);
    }, 5000);
}

// =====================================================================
// PARTICLE EFFECTS
// =====================================================================

/**
 * Create floating particles for login background
 */
function createParticles() {
    const container = document.getElementById('particleContainer');
    if (!container) return;
    
    const icons = ['fa-graduation-cap', 'fa-book', 'fa-pencil', 'fa-university', 'fa-users', 'fa-star', 'fa-award', 'fa-certificate'];
    
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.innerHTML = `<i class="fas ${icons[Math.floor(Math.random() * icons.length)]}"></i>`;
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 20 + 's';
        particle.style.fontSize = (Math.random() * 1.5 + 1) + 'rem';
        container.appendChild(particle);
    }
}

// =====================================================================
// INITIALIZE APP
// =====================================================================

// Start the application when DOM is ready
document.addEventListener('DOMContentLoaded', initApp);
