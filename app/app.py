# ========================================
# SUHUM SENIOR TECHNICAL SCHOOL
# School Management System - Flask Backend
# Database: SQLite (with Microsoft Access support on Windows)
# ========================================

from flask import Flask, render_template, request, redirect, url_for, session, flash
from datetime import datetime
import os
import sqlite3

# Import user configuration
from config import (
    ADMIN_USERNAME, ADMIN_PASSWORD, ADMIN_SECRET_CODE,
    TEACHER_USERNAME, TEACHER_PASSWORD, TEACHER_SECRET_CODE,
    STUDENT_USERNAME, STUDENT_PASSWORD, STUDENT_SECRET_CODE,
    PARENT_USERNAME, PARENT_PASSWORD, PARENT_SECRET_CODE,
    ACCOUNTANT_USERNAME, ACCOUNTANT_PASSWORD, ACCOUNTANT_SECRET_CODE,
    REGISTRAR_USERNAME, REGISTRAR_PASSWORD, REGISTRAR_SECRET_CODE,
    STAFF_USERNAME, STAFF_PASSWORD, STAFF_SECRET_CODE,
    ACCESS_LEVELS, SCHOOL_NAME
)

# Create Flask app
app = Flask(__name__)
app.secret_key = 'suhum_sts_secret_key_2026'

# ========================================
# DATABASE CONFIGURATION
# ========================================
# Choose your database:
# - USE_SQLITE = True  -> SQLite (works on all platforms)
# - USE_ACCESS = True  -> Microsoft Access (Windows only)
# ========================================

USE_SQLITE = True        # Set to True for testing (Linux/Mac)
USE_ACCESS = False       # Set to True for Microsoft Access (Windows only)
ACCESS_DB = 'suhum_sts.accdb'

# Get database path (SQLite file will be created in app folder)
DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'suhum_sts.db')

def get_db_connection():
    """Get database connection"""
    try:
        if USE_ACCESS:
            # Microsoft Access connection (Windows only with pyodbc)
            import pyodbc
            conn_str = (
                r'DRIVER={Microsoft Access Driver (*.mdb, *.accdb)};'
                r'DBQ=' + os.path.abspath(ACCESS_DB) + ';'
            )
            conn = pyodbc.connect(conn_str)
            return conn
        else:
            # SQLite connection (works on all platforms)
            conn = sqlite3.connect(DB_PATH)
            conn.row_factory = sqlite3.Row
            return conn
    except Exception as e:
        print(f"Database connection error: {e}")
        return None

def init_db():
    """Initialize database tables"""
    conn = get_db_connection()
    if conn is None:
        print("Warning: Could not connect to database. Using demo mode.")
        return False
    
    cursor = conn.cursor()
    
    # Check if using Microsoft Access
    if USE_ACCESS:
        # Microsoft Access SQL syntax
        # Create users table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id COUNTER PRIMARY KEY,
                username TEXT(50) UNIQUE NOT NULL,
                password TEXT(255) NOT NULL,
                role TEXT(20) NOT NULL,
                created_at DATETIME DEFAULT NOW()
            )
        """)
        
        # Create students table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS students (
                id COUNTER PRIMARY KEY,
                first_name TEXT(50) NOT NULL,
                last_name TEXT(50) NOT NULL,
                gender TEXT(10),
                date_of_birth DATETIME,
                class_id INTEGER,
                parent_name TEXT(100),
                parent_contact TEXT(20),
                address MEMO,
                admission_date DATETIME,
                status TEXT(20) DEFAULT 'Active',
                created_at DATETIME DEFAULT NOW()
            )
        """)
        
        # Create teachers table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS teachers (
                id COUNTER PRIMARY KEY,
                first_name TEXT(50) NOT NULL,
                last_name TEXT(50) NOT NULL,
                gender TEXT(10),
                date_of_birth DATETIME,
                email TEXT(100),
                phone TEXT(20),
                address MEMO,
                qualification TEXT(100),
                subject_id INTEGER,
                status TEXT(20) DEFAULT 'Active',
                created_at DATETIME DEFAULT NOW()
            )
        """)
        
        # Create classes table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS classes (
                id COUNTER PRIMARY KEY,
                name TEXT(50) NOT NULL,
                teacher_id INTEGER,
                capacity INTEGER DEFAULT 40,
                description MEMO,
                created_at DATETIME DEFAULT NOW()
            )
        """)
        
        # Create subjects table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS subjects (
                id COUNTER PRIMARY KEY,
                name TEXT(100) NOT NULL,
                code TEXT(20) UNIQUE NOT NULL,
                teacher_id INTEGER,
                class_id INTEGER,
                credits INTEGER DEFAULT 3,
                created_at DATETIME DEFAULT NOW()
            )
        """)
        
        # Create attendance table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS attendance (
                id COUNTER PRIMARY KEY,
                student_id INTEGER NOT NULL,
                date_ DATE NOT NULL,
                status TEXT(20) NOT NULL,
                description MEMO,
                created_at DATETIME DEFAULT NOW()
            )
        """)
        
        # Create grades table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS grades (
                id COUNTER PRIMARY KEY,
                student_id INTEGER NOT NULL,
                subject_id INTEGER NOT NULL,
                term INTEGER NOT NULL,
                ca_score DOUBLE,
                exam_score DOUBLE,
                total DOUBLE,
                grade TEXT(5),
                created_at DATETIME DEFAULT NOW()
            )
        """)
        
        # Create timetable table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS timetable (
                id COUNTER PRIMARY KEY,
                class_id INTEGER NOT NULL,
                day_of_week TEXT(20) NOT NULL,
                start_time TEXT(20) NOT NULL,
                end_time TEXT(20) NOT NULL,
                subject_id INTEGER NOT NULL,
                created_at DATETIME DEFAULT NOW()
            )
        """)
        
        # ========================================
        # NEW TABLES - Parents, Admissions, Meetings, Alumni
        # ========================================
        
        # Parents table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS parents (
                id COUNTER PRIMARY KEY,
                first_name TEXT(50) NOT NULL,
                last_name TEXT(50) NOT NULL,
                gender TEXT(10),
                phone TEXT(20),
                email TEXT(100),
                occupation TEXT(100),
                address MEMO,
                student_id INTEGER,
                relationship TEXT(50),
                status TEXT(20) DEFAULT 'Active',
                created_at DATETIME DEFAULT NOW()
            )
        """)
        
        # Individuals (Non-teaching staff)
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS individuals (
                id COUNTER PRIMARY KEY,
                first_name TEXT(50) NOT NULL,
                last_name TEXT(50) NOT NULL,
                gender TEXT(10),
                date_of_birth DATETIME,
                phone TEXT(20),
                email TEXT(100),
                position TEXT(100),
                department TEXT(100),
                address MEMO,
                salary DOUBLE,
                status TEXT(20) DEFAULT 'Active',
                created_at DATETIME DEFAULT NOW()
            )
        """)
        
        # Staff Activities table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS staff_activities (
                id COUNTER PRIMARY KEY,
                staff_id INTEGER NOT NULL,
                activity_name TEXT(200) NOT NULL,
                description MEMO,
                activity_date DATETIME,
                status TEXT(20) DEFAULT 'Pending',
                created_at DATETIME DEFAULT NOW()
            )
        """)
        
        # Staff Attendance table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS staff_attendance (
                id COUNTER PRIMARY KEY,
                staff_id INTEGER NOT NULL,
                date_ DATE NOT NULL,
                clock_in DATETIME,
                clock_out DATETIME,
                status TEXT(20) NOT NULL,
                remarks MEMO,
                created_at DATETIME DEFAULT NOW()
            )
        """)
        
        # Admissions table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS admissions (
                id COUNTER PRIMARY KEY,
                first_name TEXT(50) NOT NULL,
                last_name TEXT(50) NOT NULL,
                gender TEXT(10),
                date_of_birth DATETIME,
                previous_school TEXT(100),
                parent_name TEXT(100),
                parent_phone TEXT(20),
                applied_class TEXT(20),
                application_date DATETIME,
                status TEXT(20) DEFAULT 'Pending',
                remarks MEMO,
                created_at DATETIME DEFAULT NOW()
            )
        """)
        
        # Meetings table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS meetings (
                id COUNTER PRIMARY KEY,
                title TEXT(100) NOT NULL,
                meeting_type TEXT(50),
                meeting_date DATETIME,
                venue TEXT(100),
                agenda MEMO,
                minutes MEMO,
                attendees TEXT(500),
                status TEXT(20) DEFAULT 'Scheduled',
                created_at DATETIME DEFAULT NOW()
            )
        """)
        
        # Alumni (Old Students) table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS alumni (
                id COUNTER PRIMARY KEY,
                first_name TEXT(50) NOT NULL,
                last_name TEXT(50) NOT NULL,
                gender TEXT(10),
                admission_year INTEGER,
                graduation_year INTEGER,
                class_left TEXT(20),
                phone TEXT(20),
                email TEXT(100),
                occupation TEXT(100),
                address MEMO,
                current_employer TEXT(100),
                status TEXT(20) DEFAULT 'Active',
                created_at DATETIME DEFAULT NOW()
            )
        """)
        
        # Fees table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS fees (
                id COUNTER PRIMARY KEY,
                student_id INTEGER NOT NULL,
                fee_type TEXT(50),
                amount DOUBLE,
                due_date DATE,
                paid_date DATE,
                payment_status TEXT(20) DEFAULT 'Unpaid',
                payment_method TEXT(50),
                receipt_number TEXT(50),
                created_at DATETIME DEFAULT NOW()
            )
        """)
        
        # Events table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS events (
                id COUNTER PRIMARY KEY,
                title TEXT(100) NOT NULL,
                event_type TEXT(50),
                event_date DATETIME,
                venue TEXT(100),
                description MEMO,
                status TEXT(20) DEFAULT 'Upcoming',
                created_at DATETIME DEFAULT NOW()
            )
        """)
        
        # Announcements table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS announcements (
                id COUNTER PRIMARY KEY,
                title TEXT(200) NOT NULL,
                content MEMO NOT NULL,
                category TEXT(50),
                priority TEXT(20) DEFAULT 'Normal',
                posted_by TEXT(100),
                start_date DATETIME,
                end_date DATETIME,
                status TEXT(20) DEFAULT 'Active',
                created_at DATETIME DEFAULT NOW()
            )
        """)
        
        # Insert default users
        try:
            cursor.execute(f"INSERT INTO users (username, password, role) VALUES ('{ADMIN_USERNAME}', '{ADMIN_PASSWORD}', 'admin')")
            cursor.execute(f"INSERT INTO users (username, password, role) VALUES ('{TEACHER_USERNAME}', '{TEACHER_PASSWORD}', 'teacher')")
            cursor.execute(f"INSERT INTO users (username, password, role) VALUES ('{STUDENT_USERNAME}', '{STUDENT_PASSWORD}', 'student')")
            cursor.execute(f"INSERT INTO users (username, password, role) VALUES ('{PARENT_USERNAME}', '{PARENT_PASSWORD}', 'parent')")
            cursor.execute(f"INSERT INTO users (username, password, role) VALUES ('{ACCOUNTANT_USERNAME}', '{ACCOUNTANT_PASSWORD}', 'accountant')")
            cursor.execute(f"INSERT INTO users (username, password, role) VALUES ('{REGISTRAR_USERNAME}', '{REGISTRAR_PASSWORD}', 'registrar')")
            cursor.execute(f"INSERT INTO users (username, password, role) VALUES ('{STAFF_USERNAME}', '{STAFF_PASSWORD}', 'staff')")
        except:
            pass  # Users may already exist
        
    else:
        # SQLite syntax (fallback)
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                role TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Create students table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS students (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                first_name TEXT NOT NULL,
                last_name TEXT NOT NULL,
                gender TEXT,
                date_of_birth DATE,
                class_id INTEGER,
                parent_name TEXT,
                parent_contact TEXT,
                address TEXT,
                admission_date DATE,
                status TEXT DEFAULT 'Active',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Create teachers table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS teachers (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                first_name TEXT NOT NULL,
                last_name TEXT NOT NULL,
                gender TEXT,
                date_of_birth DATE,
                email TEXT,
                phone TEXT,
                address TEXT,
                qualification TEXT,
                subject_id INTEGER,
                status TEXT DEFAULT 'Active',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Create classes table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS classes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                teacher_id INTEGER,
                capacity INTEGER DEFAULT 40,
                description TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Create subjects table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS subjects (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                code TEXT UNIQUE NOT NULL,
                teacher_id INTEGER,
                class_id INTEGER,
                credits INTEGER DEFAULT 3,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Create attendance table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS attendance (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                student_id INTEGER NOT NULL,
                date DATE NOT NULL,
                status TEXT NOT NULL,
                remarks TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Create grades table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS grades (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                student_id INTEGER NOT NULL,
                subject_id INTEGER NOT NULL,
                term INTEGER NOT NULL,
                ca_score REAL,
                exam_score REAL,
                total REAL,
                grade TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Create timetable table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS timetable (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                class_id INTEGER NOT NULL,
                day_of_week TEXT NOT NULL,
                start_time TEXT NOT NULL,
                end_time TEXT NOT NULL,
                subject_id INTEGER NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # ========================================
        # NEW TABLES - Parents, Admissions, Meetings, Alumni
        # ========================================
        
        # Parents table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS parents (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                first_name TEXT NOT NULL,
                last_name TEXT NOT NULL,
                gender TEXT,
                phone TEXT,
                email TEXT,
                occupation TEXT,
                address TEXT,
                student_id INTEGER,
                relationship TEXT,
                status TEXT DEFAULT 'Active',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Individuals (Non-teaching staff)
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS individuals (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                first_name TEXT NOT NULL,
                last_name TEXT NOT NULL,
                gender TEXT,
                date_of_birth DATE,
                phone TEXT,
                email TEXT,
                position TEXT,
                department TEXT,
                address TEXT,
                salary REAL,
                status TEXT DEFAULT 'Active',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Staff Activities table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS staff_activities (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                staff_id INTEGER NOT NULL,
                activity_name TEXT NOT NULL,
                description TEXT,
                activity_date DATETIME,
                status TEXT DEFAULT 'Pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Staff Attendance table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS staff_attendance (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                staff_id INTEGER NOT NULL,
                date DATE NOT NULL,
                clock_in DATETIME,
                clock_out DATETIME,
                status TEXT NOT NULL,
                remarks TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Admissions table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS admissions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                first_name TEXT NOT NULL,
                last_name TEXT NOT NULL,
                gender TEXT,
                date_of_birth DATE,
                previous_school TEXT,
                parent_name TEXT,
                parent_phone TEXT,
                applied_class TEXT,
                application_date DATE,
                status TEXT DEFAULT 'Pending',
                remarks TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Meetings table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS meetings (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                meeting_type TEXT,
                meeting_date DATETIME,
                venue TEXT,
                agenda TEXT,
                minutes TEXT,
                attendees TEXT,
                status TEXT DEFAULT 'Scheduled',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Alumni (Old Students) table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS alumni (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                first_name TEXT NOT NULL,
                last_name TEXT NOT NULL,
                gender TEXT,
                admission_year INTEGER,
                graduation_year INTEGER,
                class_left TEXT,
                phone TEXT,
                email TEXT,
                occupation TEXT,
                address TEXT,
                current_employer TEXT,
                status TEXT DEFAULT 'Active',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Fees table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS fees (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                student_id INTEGER NOT NULL,
                fee_type TEXT,
                amount REAL,
                due_date DATE,
                paid_date DATE,
                payment_status TEXT DEFAULT 'Unpaid',
                payment_method TEXT,
                receipt_number TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Events table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS events (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                event_type TEXT,
                event_date DATETIME,
                venue TEXT,
                description TEXT,
                status TEXT DEFAULT 'Upcoming',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Announcements table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS announcements (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                content TEXT NOT NULL,
                category TEXT,
                priority TEXT DEFAULT 'Normal',
                posted_by TEXT,
                start_date DATETIME,
                end_date DATETIME,
                status TEXT DEFAULT 'Active',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        
        # Create default users
        cursor.execute(f"INSERT OR IGNORE INTO users (username, password, role) VALUES ('{ADMIN_USERNAME}', '{ADMIN_PASSWORD}', 'admin')")
        cursor.execute(f"INSERT OR IGNORE INTO users (username, password, role) VALUES ('{TEACHER_USERNAME}', '{TEACHER_PASSWORD}', 'teacher')")
        cursor.execute(f"INSERT OR IGNORE INTO users (username, password, role) VALUES ('{STUDENT_USERNAME}', '{STUDENT_PASSWORD}', 'student')")
        cursor.execute(f"INSERT OR IGNORE INTO users (username, password, role) VALUES ('{PARENT_USERNAME}', '{PARENT_PASSWORD}', 'parent')")
        cursor.execute(f"INSERT OR IGNORE INTO users (username, password, role) VALUES ('{ACCOUNTANT_USERNAME}', '{ACCOUNTANT_PASSWORD}', 'accountant')")
        cursor.execute(f"INSERT OR IGNORE INTO users (username, password, role) VALUES ('{REGISTRAR_USERNAME}', '{REGISTRAR_PASSWORD}', 'registrar')")
        cursor.execute(f"INSERT OR IGNORE INTO users (username, password, role) VALUES ('{STAFF_USERNAME}', '{STAFF_PASSWORD}', 'staff')")
    
    conn.commit()
    cursor.close()
    conn.close()
    
    db_type = "Microsoft Access" if USE_ACCESS else "SQLite"
    print(f"Database initialized successfully! ({db_type})")
    return True

# ========================================
# HELPER FUNCTIONS
# ========================================

def calculate_grade(score):
    """Calculate letter grade from score"""
    if score >= 80:
        return 'A'
    elif score >= 70:
        return 'B'
    elif score >= 60:
        return 'C'
    elif score >= 50:
        return 'D'
    else:
        return 'F'

def get_demo_data():
    """Return demo data for when database is not available"""
    return {
        'students': [
            {'id': 1, 'first_name': 'John', 'last_name': 'Doe', 'gender': 'Male', 'date_of_birth': '2010-05-15', 'class_name': 'Form 1', 'parent_contact': '+233 123 456 789', 'status': 'Active'},
            {'id': 2, 'first_name': 'Jane', 'last_name': 'Smith', 'gender': 'Female', 'date_of_birth': '2010-08-20', 'class_name': 'Form 1', 'parent_contact': '+233 234 567 890', 'status': 'Active'},
            {'id': 3, 'first_name': 'Michael', 'last_name': 'Osei', 'gender': 'Male', 'date_of_birth': '2009-03-10', 'class_name': 'Form 2', 'parent_contact': '+233 345 678 901', 'status': 'Active'},
            {'id': 4, 'first_name': 'Grace', 'last_name': 'Ama', 'gender': 'Female', 'date_of_birth': '2009-11-25', 'class_name': 'Form 2', 'parent_contact': '+233 456 789 012', 'status': 'Active'},
            {'id': 5, 'first_name': 'David', 'last_name': 'Kofi', 'gender': 'Male', 'date_of_birth': '2008-07-08', 'class_name': 'Form 3', 'parent_contact': '+233 567 890 123', 'status': 'Active'},
        ],
        'teachers': [
            {'id': 1, 'first_name': 'Mr.', 'last_name': 'Anderson', 'gender': 'Male', 'email': 'anderson@suhumsts.edu.gh', 'phone': '+233 111 222 333', 'subject': 'Mathematics', 'status': 'Active'},
            {'id': 2, 'first_name': 'Mrs.', 'last_name': 'Thompson', 'gender': 'Female', 'email': 'thompson@suhumsts.edu.gh', 'phone': '+233 222 333 444', 'subject': 'English', 'status': 'Active'},
            {'id': 3, 'first_name': 'Mr.', 'last_name': 'Williams', 'gender': 'Male', 'email': 'williams@suhumsts.edu.gh', 'phone': '+233 333 444 555', 'subject': 'Science', 'status': 'Active'},
            {'id': 4, 'first_name': 'Mrs.', 'last_name': 'Brown', 'gender': 'Female', 'email': 'brown@suhumsts.edu.gh', 'phone': '+233 444 555 666', 'subject': 'Technical', 'status': 'Active'},
        ],
        'classes': [
            {'id': 1, 'name': 'Form 1', 'teacher_name': 'Mr. Anderson', 'student_count': 45, 'capacity': 40},
            {'id': 2, 'name': 'Form 2', 'teacher_name': 'Mrs. Thompson', 'student_count': 38, 'capacity': 40},
            {'id': 3, 'name': 'Form 3', 'teacher_name': 'Mr. Williams', 'student_count': 35, 'capacity': 40},
        ],
        'subjects': [
            {'id': 1, 'name': 'Mathematics', 'code': 'MATH101', 'teacher_name': 'Mr. Anderson', 'class_name': 'Form 1', 'credits': 4},
            {'id': 2, 'name': 'English', 'code': 'ENG101', 'teacher_name': 'Mrs. Thompson', 'class_name': 'Form 1', 'credits': 4},
            {'id': 3, 'name': 'Science', 'code': 'SCI101', 'teacher_name': 'Mr. Williams', 'class_name': 'Form 1', 'credits': 4},
            {'id': 4, 'name': 'Technical', 'code': 'TECH101', 'teacher_name': 'Mrs. Brown', 'class_name': 'Form 1', 'credits': 3},
        ],
        'grades': [
            {'id': 1, 'student_id': 1, 'student_name': 'John Doe', 'subject_name': 'Mathematics', 'ca_score': 25, 'exam_score': 65, 'total': 90, 'grade': 'A'},
            {'id': 2, 'student_id': 1, 'student_name': 'John Doe', 'subject_name': 'English', 'ca_score': 20, 'exam_score': 55, 'total': 75, 'grade': 'B'},
            {'id': 3, 'student_id': 2, 'student_name': 'Jane Smith', 'subject_name': 'Mathematics', 'ca_score': 28, 'exam_score': 70, 'total': 98, 'grade': 'A'},
        ]
    }

# ========================================
# ROUTES
# ========================================

@app.route('/')
def index():
    """Home page - redirect to login or dashboard"""
    if session.get('logged_in'):
        return redirect(url_for('dashboard'))
    return redirect(url_for('login'))

@app.route('/login', methods=['GET', 'POST'])
def login():
    """Login page"""
    error = None
    
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        secret_code = request.form.get('secret_code', '')
        role = request.form.get('role')
        
        # Authentication using config with secret code
        if username == ADMIN_USERNAME and password == ADMIN_PASSWORD and secret_code == ADMIN_SECRET_CODE:
            session['logged_in'] = True
            session['user_id'] = 1
            session['user_name'] = 'Administrator'
            session['user_role'] = 'admin'
            session['access_level'] = 1
            return redirect(url_for('dashboard'))
        elif username == TEACHER_USERNAME and password == TEACHER_PASSWORD and secret_code == TEACHER_SECRET_CODE:
            session['logged_in'] = True
            session['user_id'] = 1
            session['user_name'] = 'Mr. Anderson'
            session['user_role'] = 'teacher'
            session['access_level'] = 2
            return redirect(url_for('dashboard'))
        elif username == STUDENT_USERNAME and password == STUDENT_PASSWORD and secret_code == STUDENT_SECRET_CODE:
            session['logged_in'] = True
            session['user_id'] = 1
            session['user_name'] = 'John Doe'
            session['user_role'] = 'student'
            session['access_level'] = 3
            return redirect(url_for('dashboard'))
        elif username == PARENT_USERNAME and password == PARENT_PASSWORD and secret_code == PARENT_SECRET_CODE:
            session['logged_in'] = True
            session['user_id'] = 1
            session['user_name'] = 'Parent'
            session['user_role'] = 'parent'
            session['access_level'] = 4
            return redirect(url_for('dashboard'))
        elif username == ACCOUNTANT_USERNAME and password == ACCOUNTANT_PASSWORD and secret_code == ACCOUNTANT_SECRET_CODE:
            session['logged_in'] = True
            session['user_id'] = 1
            session['user_name'] = 'Accountant'
            session['user_role'] = 'accountant'
            session['access_level'] = 5
            return redirect(url_for('dashboard'))
        elif username == REGISTRAR_USERNAME and password == REGISTRAR_PASSWORD and secret_code == REGISTRAR_SECRET_CODE:
            session['logged_in'] = True
            session['user_id'] = 1
            session['user_name'] = 'Registrar'
            session['user_role'] = 'registrar'
            session['access_level'] = 6
            return redirect(url_for('dashboard'))
        elif username == STAFF_USERNAME and password == STAFF_PASSWORD and secret_code == STAFF_SECRET_CODE:
            session['logged_in'] = True
            session['user_id'] = 1
            session['user_name'] = 'Staff Member'
            session['user_role'] = 'staff'
            session['access_level'] = 7
            return redirect(url_for('dashboard'))
        else:
            error = 'Invalid username, password, or secret code'
    
    return render_template('base.html', error=error)

@app.route('/logout')
def logout():
    """Logout"""
    session.clear()
    return redirect(url_for('login'))

@app.route('/dashboard')
def dashboard():
    """Dashboard page"""
    if not session.get('logged_in'):
        return redirect(url_for('login'))
    
    # Get demo data
    data = get_demo_data()
    
    return render_template('dashboard.html', 
        active_page='dashboard',
        student_count=len(data['students']),
        teacher_count=len(data['teachers']),
        class_count=len(data['classes']),
        subject_count=len(data['subjects']),
        classes=data['classes'],
        admission_count=2,
        parent_count=2,
        staff_count=2,
        alumni_count=2)

@app.route('/students')
def students():
    """Students page"""
    if not session.get('logged_in'):
        return redirect(url_for('login'))
    
    data = get_demo_data()
    return render_template('students.html', 
        active_page='students',
        students=data['students'])

@app.route('/teachers')
def teachers():
    """Teachers page"""
    if not session.get('logged_in'):
        return redirect(url_for('login'))
    
    data = get_demo_data()
    return render_template('teachers.html', 
        active_page='teachers',
        teachers=data['teachers'])

@app.route('/classes')
def classes():
    """Classes page"""
    if not session.get('logged_in'):
        return redirect(url_for('login'))
    
    data = get_demo_data()
    return render_template('classes.html', 
        active_page='classes',
        classes=data['classes'],
        teachers=data['teachers'])

@app.route('/subjects')
def subjects():
    """Subjects page"""
    if not session.get('logged_in'):
        return redirect(url_for('login'))
    
    data = get_demo_data()
    return render_template('subjects.html', 
        active_page='subjects',
        subjects=data['subjects'],
        teachers=data['teachers'],
        classes=data['classes'])

@app.route('/attendance')
def attendance():
    """Attendance page"""
    if not session.get('logged_in'):
        return redirect(url_for('login'))
    
    data = get_demo_data()
    today = datetime.now().strftime('%Y-%m-%d')
    
    return render_template('attendance.html', 
        active_page='attendance',
        classes=data['classes'],
        today=today)

@app.route('/grades')
def grades():
    """Grades page"""
    if not session.get('logged_in'):
        return redirect(url_for('login'))
    
    data = get_demo_data()
    
    return render_template('grades.html', 
        active_page='grades',
        grades=data['grades'],
        students=data['students'],
        subjects=data['subjects'],
        classes=data['classes'])

@app.route('/timetable')
def timetable():
    """Timetable page"""
    if not session.get('logged_in'):
        return redirect(url_for('login'))
    
    data = get_demo_data()
    
    return render_template('timetable.html', 
        active_page='timetable',
        classes=data['classes'])

@app.route('/reports')
def reports():
    """Reports page"""
    if not session.get('logged_in'):
        return redirect(url_for('login'))
    
    data = get_demo_data()
    
    return render_template('reports.html', 
        active_page='reports',
        student_count=len(data['students']),
        teacher_count=len(data['teachers']),
        attendance_rate=92,
        pass_rate=85,
        classes=data['classes'])

@app.route('/settings')
def settings():
    """Settings page"""
    if not session.get('logged_in'):
        return redirect(url_for('login'))
    
    return render_template('settings.html', 
        active_page='settings')

# ========================================
# NEW PAGES - Admissions, Parents, Staff, Meetings, Alumni, Fees, Events
# ========================================

@app.route('/admissions')
def admissions():
    """Admissions page"""
    if not session.get('logged_in'):
        return redirect(url_for('login'))
    
    # Demo data - in production, fetch from database
    admissions_list = [
        {'id': 1, 'first_name': 'John', 'last_name': 'Doe', 'gender': 'Male', 'date_of_birth': '2010-05-15', 'previous_school': 'St. Peters Primary', 'applied_class': 'Form 1', 'parent_phone': '0244123456', 'status': 'Pending'},
        {'id': 2, 'first_name': 'Mary', 'last_name': 'Smith', 'gender': 'Female', 'date_of_birth': '2010-08-20', 'previous_school': 'Grace Academy', 'applied_class': 'Form 1', 'parent_phone': '0245789012', 'status': 'Approved'},
    ]
    
    return render_template('admissions.html', 
        active_page='admissions',
        admissions=admissions_list)

@app.route('/parents')
def parents():
    """Parents page"""
    if not session.get('logged_in'):
        return redirect(url_for('login'))
    
    # Demo data
    parents_list = [
        {'id': 1, 'first_name': 'Robert', 'last_name': 'Doe', 'gender': 'Male', 'phone': '0244123456', 'email': 'robert@example.com', 'occupation': 'Business', 'student_name': 'John Doe', 'relationship': 'Father'},
        {'id': 2, 'first_name': 'Grace', 'last_name': 'Smith', 'gender': 'Female', 'phone': '0245789012', 'email': 'grace@example.com', 'occupation': 'Teacher', 'student_name': 'Mary Smith', 'relationship': 'Mother'},
    ]
    
    return render_template('parents.html', 
        active_page='parents',
        parents=parents_list)

@app.route('/individuals')
def individuals():
    """Non-teaching staff page"""
    if not session.get('logged_in'):
        return redirect(url_for('login'))
    
    # Demo data - Staff
    staff_list = [
        {'id': 1, 'first_name': 'James', 'last_name': 'Wilson', 'gender': 'Male', 'position': 'Head Accountant', 'department': 'Finance', 'phone': '0245123456', 'email': 'james@example.com', 'salary': 2500, 'status': 'Active'},
        {'id': 2, 'first_name': 'Sarah', 'last_name': 'Brown', 'gender': 'Female', 'position': 'Secretary', 'department': 'Administration', 'phone': '0245789012', 'email': 'sarah@example.com', 'salary': 1500, 'status': 'Active'},
        {'id': 3, 'first_name': 'Michael', 'last_name': 'Osei', 'gender': 'Male', 'position': 'Security Officer', 'department': 'Security', 'phone': '0245345678', 'email': 'michael@example.com', 'salary': 800, 'status': 'Active'},
        {'id': 4, 'first_name': 'Grace', 'last_name': 'Adom', 'gender': 'Female', 'position': 'Caterer', 'department': 'Catering', 'phone': '0245567890', 'email': 'grace@example.com', 'salary': 900, 'status': 'Active'},
        {'id': 5, 'first_name': 'David', 'last_name': 'Kofi', 'gender': 'Male', 'position': 'Cleaner', 'department': 'Catering', 'phone': '0245789011', 'email': 'david@example.com', 'salary': 700, 'status': 'Active'},
        {'id': 6, 'first_name': 'Mary', 'last_name': 'Akosua', 'gender': 'Female', 'position': 'Storekeeper', 'department': 'Administration', 'phone': '0245123457', 'email': 'mary@example.com', 'salary': 1200, 'status': 'Active'},
        {'id': 7, 'first_name': 'Robert', 'last_name': 'Mensah', 'gender': 'Male', 'position': 'Security Captain', 'department': 'Security', 'phone': '0245345679', 'email': 'robert@example.com', 'salary': 1000, 'status': 'Active'},
        {'id': 8, 'first_name': 'Elizabeth', 'last_name': 'Serwaa', 'gender': 'Female', 'position': 'Assistant Caterer', 'department': 'Catering', 'phone': '0245567891', 'email': 'elizabeth@example.com', 'salary': 750, 'status': 'On Leave'},
    ]
    
    # Demo data - Staff Activities
    activities_list = [
        {'id': 1, 'staff_name': 'James Wilson', 'activity_name': 'Prepared monthly financial report', 'department': 'Finance', 'activity_date': '2026-03-07', 'status': 'Completed'},
        {'id': 2, 'staff_name': 'Sarah Brown', 'activity_name': 'Processed student admission forms', 'department': 'Administration', 'activity_date': '2026-03-07', 'status': 'Completed'},
        {'id': 3, 'staff_name': 'Michael Osei', 'activity_name': 'Night patrol duty', 'department': 'Security', 'activity_date': '2026-03-07', 'status': 'Completed'},
        {'id': 4, 'staff_name': 'Grace Adom', 'activity_name': 'Prepared lunch for 450 students', 'department': 'Catering', 'activity_date': '2026-03-07', 'status': 'Completed'},
        {'id': 5, 'staff_name': 'David Kofi', 'activity_name': 'Cleaned classrooms', 'department': 'Catering', 'activity_date': '2026-03-07', 'status': 'In Progress'},
        {'id': 6, 'staff_name': 'Mary Akosua', 'activity_name': 'Inventory check', 'department': 'Administration', 'activity_date': '2026-03-07', 'status': 'Completed'},
    ]
    
    return render_template('individuals.html', 
        active_page='individuals',
        individuals=staff_list,
        activities=activities_list,
        staff_count=len(staff_list),
        active_count=7,
        leave_count=1,
        activity_count=len(activities_list))

@app.route('/meetings')
def meetings():
    """Meetings page"""
    if not session.get('logged_in'):
        return redirect(url_for('login'))
    
    # Demo data
    meetings_list = [
        {'id': 1, 'title': 'Staff Meeting', 'meeting_type': 'Staff', 'meeting_date': '2026-03-10 14:00', 'venue': 'Staff Room', 'status': 'Scheduled'},
        {'id': 2, 'title': 'PTA Meeting', 'meeting_type': 'Parents', 'meeting_date': '2026-03-15 10:00', 'venue': 'Assembly Hall', 'status': 'Scheduled'},
    ]
    
    return render_template('meetings.html', 
        active_page='meetings',
        meetings=meetings_list)

@app.route('/alumni')
def alumni():
    """Alumni page"""
    if not session.get('logged_in'):
        return redirect(url_for('login'))
    
    # Demo data
    alumni_list = [
        {'id': 1, 'first_name': 'Michael', 'last_name': 'Osei', 'gender': 'Male', 'graduation_year': 2020, 'class_left': 'Form 3', 'phone': '0245123456', 'email': 'michael@example.com', 'occupation': 'Engineer'},
        {'id': 2, 'first_name': 'Anna', 'last_name': 'Mensah', 'gender': 'Female', 'graduation_year': 2019, 'class_left': 'Form 3', 'phone': '0245789012', 'email': 'anna@example.com', 'occupation': 'Doctor'},
    ]
    
    return render_template('alumni.html', 
        active_page='alumni',
        alumni=alumni_list)

@app.route('/fees')
def fees():
    """Fees page"""
    if not session.get('logged_in'):
        return redirect(url_for('login'))
    
    # Demo data
    fees_list = [
        {'id': 1, 'student_name': 'John Doe', 'fee_type': 'Tuition', 'amount': 500, 'due_date': '2026-03-31', 'paid_date': '2026-02-15', 'payment_status': 'Paid', 'receipt_number': 'RCP001'},
        {'id': 2, 'student_name': 'Mary Smith', 'fee_type': 'Tuition', 'amount': 500, 'due_date': '2026-03-31', 'paid_date': None, 'payment_status': 'Unpaid', 'receipt_number': None},
    ]
    
    return render_template('fees.html', 
        active_page='fees',
        fees=fees_list)

@app.route('/events')
def events():
    """Events page"""
    if not session.get('logged_in'):
        return redirect(url_for('login'))
    
    # Demo data
    events_list = [
        {'id': 1, 'title': 'Sports Day', 'event_type': 'Sports', 'event_date': '2026-03-20', 'venue': 'School Field', 'description': 'Annual sports competition', 'status': 'Upcoming'},
        {'id': 2, 'title': 'Career Day', 'event_type': 'Academic', 'event_date': '2026-04-05', 'venue': 'Assembly Hall', 'description': 'Guest speakers from various professions', 'status': 'Upcoming'},
    ]
    
    return render_template('events.html', 
        active_page='events',
        events=events_list)

@app.route('/announcements')
def announcements():
    """Announcements page"""
    if not session.get('logged_in'):
        return redirect(url_for('login'))
    
    # Demo data
    announcements_list = [
        {'id': 1, 'title': 'Mid-Term Examinations', 'content': 'Mid-term examinations will be held from March 15-20, 2026. All students are required to prepare accordingly.', 'category': 'Academic', 'priority': 'High', 'posted_by': 'Headmaster', 'status': 'Active', 'created_at': '2026-03-07', 'start_date': '2026-03-15', 'end_date': '2026-03-20'},
        {'id': 2, 'title': 'PTA Meeting', 'content': 'Parent-Teacher Association meeting scheduled for this Friday at 2:00 PM in the Assembly Hall.', 'category': 'Events', 'priority': 'Normal', 'posted_by': 'Administrator', 'status': 'Active', 'created_at': '2026-03-06', 'start_date': '2026-03-10', 'end_date': None},
        {'id': 3, 'title': 'School Fees Reminder', 'content': 'Parents are reminded to pay school fees by end of this month to avoid late charges.', 'category': 'General', 'priority': 'High', 'posted_by': 'Accountant', 'status': 'Active', 'created_at': '2026-03-05', 'start_date': None, 'end_date': '2026-03-31'},
        {'id': 4, 'title': 'Sports Day Announcement', 'content': 'Annual Sports Day will be held on March 20th. All students must participate.', 'category': 'Events', 'priority': 'Normal', 'posted_by': 'Sports Master', 'status': 'Active', 'created_at': '2026-03-04', 'start_date': '2026-03-20', 'end_date': None},
        {'id': 5, 'title': 'Library Closure', 'content': 'The school library will be closed for renovation from March 1-15.', 'category': 'General', 'priority': 'Low', 'posted_by': 'Librarian', 'status': 'Active', 'created_at': '2026-02-28', 'start_date': '2026-03-01', 'end_date': '2026-03-15'},
    ]
    
    return render_template('announcements.html', 
        active_page='announcements',
        announcements=announcements_list)

# ========================================
# FORM HANDLERS
# ========================================

@app.route('/students/save', methods=['POST'])
def save_student():
    """Save student data"""
    if not session.get('logged_in'):
        return redirect(url_for('login'))
    
    # In production, save to database
    flash('Student saved successfully!', 'success')
    return redirect(url_for('students'))

@app.route('/teachers/save', methods=['POST'])
def save_teacher():
    """Save teacher data"""
    if not session.get('logged_in'):
        return redirect(url_for('login'))
    
    flash('Teacher saved successfully!', 'success')
    return redirect(url_for('teachers'))

@app.route('/classes/save', methods=['POST'])
def save_class():
    """Save class data"""
    if not session.get('logged_in'):
        return redirect(url_for('login'))
    
    flash('Class saved successfully!', 'success')
    return redirect(url_for('classes'))

@app.route('/subjects/save', methods=['POST'])
def save_subject():
    """Save subject data"""
    if not session.get('logged_in'):
        return redirect(url_for('login'))
    
    flash('Subject saved successfully!', 'success')
    return redirect(url_for('subjects'))

@app.route('/grades/save', methods=['POST'])
def save_grade():
    """Save grade data"""
    if not session.get('logged_in'):
        return redirect(url_for('login'))
    
    # Calculate total and grade
    ca_score = float(request.form.get('ca_score', 0))
    exam_score = float(request.form.get('exam_score', 0))
    total = ca_score + exam_score
    grade = calculate_grade(total)
    
    flash(f'Grade saved successfully! Total: {total}, Grade: {grade}', 'success')
    return redirect(url_for('grades'))

@app.route('/settings/save', methods=['POST'])
def save_settings():
    """Save settings"""
    if not session.get('logged_in'):
        return redirect(url_for('login'))
    
    flash('Settings saved successfully!', 'success')
    return redirect(url_for('settings'))

# ========================================
# MAIN
# ========================================

if __name__ == '__main__':
    # Initialize database
    init_db()
    
    # Run the app
    app.run(debug=True, host='0.0.0.0', port=5000)
