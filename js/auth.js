/**
 * =============================================================================
 * AUTHENTICATION MODULE
 * =============================================================================
 * Handles user authentication, session management, and role-based access control.
 * 
 * ALGORITHM: Authentication Flow
 * 1. User submits credentials (username/password)
 * 2. Hash password and compare with stored hash
 * 3. If valid, generate session token
 * 4. Store session in localStorage/sessionStorage
 * 5. Load user profile data based on role
 * 6. Apply role-based menu and access permissions
 * 
 * ALGORITHM: Access Control
 * 1. Define role-permission matrix
 * 2. Check user role before accessing resources
 * 3. Filter UI elements based on permissions
 * 4. Validate server-side operations
 * 
 * @author EduVerse Development Team
 * @version 1.0.0
 * @since 2024
 */

(function() {
    'use strict';

    // =====================================================================
    // ROLE PERMISSIONS MATRIX
    // =====================================================================

    const PERMISSIONS = {
        // Page access permissions
        PAGES: {
            dashboard: ['admin', 'teacher', 'student', 'parent', 'staff', 'guest'],
            students: ['admin', 'teacher', 'student', 'parent'],
            teachers: ['admin'],
            staff: ['admin', 'staff'],
            parents: ['admin', 'teacher', 'student'],
            academics: ['admin', 'teacher', 'student', 'parent'],
            fees: ['admin', 'parent', 'staff'],
            library: ['admin', 'teacher', 'student', 'parent', 'staff', 'guest'],
            hostel: ['admin', 'student', 'staff'],
            reports: ['admin', 'teacher'],
            messages: ['admin', 'teacher', 'student', 'parent', 'staff'],
            settings: ['admin', 'teacher', 'student', 'parent', 'staff', 'guest'],
            admin: ['admin']
        },
        
        // Feature permissions
        FEATURES: {
            // Students
            'students.create': ['admin'],
            'students.edit': ['admin', 'teacher'],
            'students.delete': ['admin'],
            'students.view': ['admin', 'teacher', 'parent'],
            
            // Teachers
            'teachers.create': ['admin'],
            'teachers.edit': ['admin'],
            'teachers.delete': ['admin'],
            'teachers.view': ['admin'],
            
            // Staff
            'staff.create': ['admin'],
            'staff.edit': ['admin'],
            'staff.delete': ['admin'],
            'staff.view': ['admin', 'staff'],
            
            // Parents
            'parents.create': ['admin', 'student'],
            'parents.edit': ['admin', 'parent'],
            'parents.delete': ['admin'],
            'parents.view': ['admin', 'teacher', 'student'],
            
            // Academics
            'academics.attendance': ['admin', 'teacher'],
            'academics.grades': ['admin', 'teacher'],
            'academics.timetable': ['admin', 'teacher', 'student'],
            'academics.subjects': ['admin', 'teacher'],
            
            // Fees
            'fees.create': ['admin', 'staff'],
            'fees.view': ['admin', 'parent', 'staff'],
            'fees.payment': ['admin', 'parent'],
            
            // Library
            'library.issue': ['admin', 'teacher', 'staff'],
            'library.return': ['admin', 'teacher', 'staff'],
            'library.view': ['all'],
            
            // Messages
            'messages.send': ['admin', 'teacher', 'student', 'parent', 'staff'],
            'messages.receive': ['admin', 'teacher', 'student', 'parent', 'staff'],
            
            // Reports
            'reports.generate': ['admin', 'teacher'],
            'reports.view': ['admin', 'teacher'],
            
            // Admin
            'admin.users': ['admin'],
            'admin.settings': ['admin'],
            'admin.backup': ['admin']
        }
    };

    // =====================================================================
    // AUTHENTICATION STATE
    // =====================================================================

    let currentUser = null;
    let sessionToken = null;

    // =====================================================================
    // UTILITY FUNCTIONS
    // =====================================================================

    /**
     * Generate session token
     * @returns {string}
     */
    function generateToken() {
        return 'tok_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 16);
    }

    /**
     * Store session data
     * @param {Object} user 
     * @param {string} token 
     */
    function storeSession(user, token) {
        const sessionData = {
            user: {
                id: user.id,
                username: user.username,
                role: user.role,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName
            },
            token: token,
            expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
        };
        
        localStorage.setItem('eduverse_session', JSON.stringify(sessionData));
        sessionToken = token;
        currentUser = user;
        Database.setCurrentUser(user);
    }

    /**
     * Restore session from storage
     * @returns {Object|null}
     */
    function restoreSession() {
        try {
            const sessionData = JSON.parse(localStorage.getItem('eduverse_session'));
            
            if (!sessionData) return null;
            
            // Check expiration
            if (Date.now() > sessionData.expiresAt) {
                clearSession();
                return null;
            }
            
            sessionToken = sessionData.token;
            currentUser = sessionData.user;
            Database.setCurrentUser(currentUser);
            
            return currentUser;
        } catch (e) {
            return null;
        }
    }

    /**
     * Clear session
     */
    function clearSession() {
        localStorage.removeItem('eduverse_session');
        sessionToken = null;
        currentUser = null;
        Database.setCurrentUser(null);
    }

    // =====================================================================
    // AUTHENTICATION METHODS
    // =====================================================================

    /**
     * Login user
     * @param {string} username 
     * @param {string} password 
     * @returns {Promise<Object>}
     */
    async function login(username, password) {
        try {
            // Find user by username
            const users = await Database.query(Database.TABLES.USERS, {
                where: { username: username.toLowerCase() }
            });
            
            if (users.length === 0) {
                throw new Error('User not found');
            }
            
            const user = users[0];
            
            // Check if user is active
            if (user.isActive === false) {
                throw new Error('Account is deactivated. Contact administrator.');
            }
            
            // Hash password and compare
            const hashedPassword = await Database.hashPassword(password);
            
            if (user.password !== hashedPassword) {
                throw new Error('Invalid password');
            }
            
            // Generate session token
            const token = generateToken();
            
            // Update last login
            await Database.update(Database.TABLES.USERS, {
                ...user,
                lastLogin: new Date().toISOString()
            });
            
            // Store session
            storeSession(user, token);
            
            // Log the login action
            await logAction('LOGIN', 'User logged in');
            
            // Return user without password
            const { password: _, ...userWithoutPassword } = user;
            return {
                success: true,
                user: userWithoutPassword,
                token: token
            };
            
        } catch (error) {
            console.error('Login failed:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Register new user
     * @param {Object} userData 
     * @returns {Promise<Object>}
     */
    async function register(userData) {
        try {
            const { username, password, email, role, firstName, lastName } = userData;
            
            // Check if username exists
            const existingUsers = await Database.query(Database.TABLES.USERS, {
                where: { username: username.toLowerCase() }
            });
            
            if (existingUsers.length > 0) {
                throw new Error('Username already exists');
            }
            
            // Hash password
            const hashedPassword = await Database.hashPassword(password);
            
            // Create user
            const newUser = {
                id: Database.generateId(),
                username: username.toLowerCase(),
                password: hashedPassword,
                email: email.toLowerCase(),
                role: role || 'guest',
                firstName: firstName,
                lastName: lastName,
                isActive: true,
                createdAt: new Date().toISOString()
            };
            
            await Database.insert(Database.TABLES.USERS, newUser);
            
            // Log registration
            await logAction('REGISTER', `New ${role} user registered`);
            
            return {
                success: true,
                message: 'Registration successful! You can now login.'
            };
            
        } catch (error) {
            console.error('Registration failed:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Logout user
     * @returns {Promise<void>}
     */
    async function logout() {
        await logAction('LOGOUT', 'User logged out');
        clearSession();
        
        // Redirect to login
        window.location.hash = '#login';
        window.location.reload();
    }

    /**
     * Change password
     * @param {string} oldPassword 
     * @param {string} newPassword 
     * @returns {Promise<Object>}
     */
    async function changePassword(oldPassword, newPassword) {
        try {
            if (!currentUser) {
                throw new Error('Not logged in');
            }
            
            // Get current user data
            const user = await Database.getById(Database.TABLES.USERS, currentUser.id);
            
            // Verify old password
            const hashedOld = await Database.hashPassword(oldPassword);
            if (user.password !== hashedOld) {
                throw new Error('Current password is incorrect');
            }
            
            // Update password
            const hashedNew = await Database.hashPassword(newPassword);
            await Database.update(Database.TABLES.USERS, {
                ...user,
                password: hashedNew
            });
            
            await logAction('PASSWORD_CHANGE', 'Password changed successfully');
            
            return {
                success: true,
                message: 'Password changed successfully'
            };
            
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    // =====================================================================
    // ACCESS CONTROL
    // =====================================================================

    /**
     * Check if user has permission for a feature
     * @param {string} feature 
     * @returns {boolean}
     */
    function hasPermission(feature) {
        if (!currentUser) return false;
        
        const allowedRoles = PERMISSIONS.FEATURES[feature];
        
        if (!allowedRoles) return false;
        if (allowedRoles.includes('all')) return true;
        if (allowedRoles.includes(currentUser.role)) return true;
        
        return false;
    }

    /**
     * Check if user can access a page
     * @param {string} page 
     * @returns {boolean}
     */
    function canAccessPage(page) {
        if (!currentUser) return false;
        
        const allowedRoles = PERMISSIONS.PAGES[page];
        
        if (!allowedRoles) return false;
        if (allowedRoles.includes(currentUser.role)) return true;
        
        return false;
    }

    /**
     * Get accessible pages for current user
     * @returns {Array<string>}
     */
    function getAccessiblePages() {
        if (!currentUser) return [];
        
        const accessible = [];
        
        for (const [page, roles] of Object.entries(PERMISSIONS.PAGES)) {
            if (roles.includes(currentUser.role)) {
                accessible.push(page);
            }
        }
        
        return accessible;
    }

    /**
     * Filter menu items by permissions
     * @param {Array} menuItems 
     * @returns {Array}
     */
    function filterMenuItems(menuItems) {
        return menuItems.filter(item => {
            if (!item.permission) return true;
            return hasPermission(item.permission);
        });
    }

    // =====================================================================
    // LOGGING
    // =====================================================================

    /**
     * Log user action
     * @param {string} action 
     * @param {string} details 
     */
    async function logAction(action, details) {
        try {
            await Database.insert(Database.TABLES.LOGS, {
                id: Database.generateId(),
                userId: currentUser?.id || 'system',
                action: action,
                details: details,
                timestamp: new Date().toISOString(),
                ipAddress: '127.0.0.1'
            });
        } catch (e) {
            console.error('Failed to log action:', e);
        }
    }

    // =====================================================================
    // EXPORT
    // =====================================================================

    window.Auth = {
        // Authentication
        login,
        register,
        logout,
        changePassword,
        
        // Session
        restoreSession,
        getCurrentUser: () => currentUser,
        isAuthenticated: () => !!currentUser,
        
        // Access Control
        hasPermission,
        canAccessPage,
        getAccessiblePages,
        filterMenuItems,
        
        // Permissions
        PERMISSIONS,
        
        // Logging
        logAction
    };

})();
