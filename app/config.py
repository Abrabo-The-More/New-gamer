# ========================================
# SUHUM SENIOR TECHNICAL SCHOOL
# User Configuration
# ========================================
# Edit the passwords below to change login credentials

# Admin User (Administrator)
ADMIN_USERNAME = "admin"
ADMIN_PASSWORD = "admin123"
ADMIN_SECRET_CODE = "admin2026"

# Teacher User
TEACHER_USERNAME = "teacher"
TEACHER_PASSWORD = "teacher123"
TEACHER_SECRET_CODE = "teacher2026"

# Student User
STUDENT_USERNAME = "student"
STUDENT_PASSWORD = "student123"
STUDENT_SECRET_CODE = "student2026"

# Parent User
PARENT_USERNAME = "parent"
PARENT_PASSWORD = "parent123"
PARENT_SECRET_CODE = "parent2026"

# Accountant User
ACCOUNTANT_USERNAME = "accountant"
ACCOUNTANT_PASSWORD = "accountant123"
ACCOUNTANT_SECRET_CODE = "account2026"

# Registrar User
REGISTRAR_USERNAME = "registrar"
REGISTRAR_PASSWORD = "registrar123"
REGISTRAR_SECRET_CODE = "registrar2026"

# Non-Teaching Staff User (NEW)
STAFF_USERNAME = "staff"
STAFF_PASSWORD = "staff123"
STAFF_SECRET_CODE = "staff2026"

# ========================================
# ACCESS LEVELS
# ========================================
# 1 = Full Access (Admin)
# 2 = Teacher Access
# 3 = Student Access
# 4 = Parent Access
# 5 = Accountant Access
# 6 = Registrar Access
# 7 = Staff Access
# 8 = Public/Guest Access

ACCESS_LEVELS = {
    'admin': 1,
    'teacher': 2,
    'student': 3,
    'parent': 4,
    'accountant': 5,
    'registrar': 6,
    'staff': 7
}

# ========================================
# SCHOOL INFORMATION
# ========================================
SCHOOL_NAME = "Suhum Senior Technical School"
SCHOOL_LOCATION = "Suhum, Eastern Region, Ghana"
SCHOOL_PHONE = "0244-123-456"
SCHOOL_EMAIL = "info@suhumsts.edu.gh"
