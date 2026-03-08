# Suhum Senior Technical School - School Management System

A modern, professional, and industrial-based school management system for **Suhum Senior Technical School**, located in Suhum, Eastern Region, Ghana.

## 📋 Overview

This is a full-featured school management system with:
- **Frontend**: HTML (90%), CSS, JavaScript
- **Backend**: Python with Flask
- **Database**: Microsoft Access
- **Target Users**: Administrators, Teachers, Students

## 🏫 School Information

- **Name**: Suhum Senior Technical School
- **Location**: Suhum, Eastern Region, Ghana
- **Type**: Senior Technical School

## 📁 Project Structure

```
suhum_sts/
├── app/
│   └── app.py              # Flask backend application
├── templates/
│   ├── base.html           # Base HTML template (login + main layout)
│   ├── dashboard.html      # Dashboard page
│   ├── students.html       # Students management
│   ├── teachers.html       # Teachers management
│   ├── classes.html       # Classes management
│   ├── subjects.html      # Subjects management
│   ├── attendance.html    # Attendance management
│   ├── grades.html        # Grades management
│   ├── timetable.html     # Timetable page
│   ├── reports.html       # Reports & analytics
│   └── settings.html      # System settings
├── static/
│   ├── css/
│   │   └── style.css      # Main stylesheet
│   └── js/
│       └── main.js        # JavaScript functionality
├── suhum_sts.accdb        # Microsoft Access database (created automatically)
├── requirements.txt      # Python dependencies
└── README.md              # This file
```

## 🚀 Features

### Dashboard
- Quick statistics (students, teachers, classes, subjects)
- Quick action buttons
- Announcements and events
- Class distribution overview

### Student Management
- Add, edit, view, delete students
- Search and filter functionality
- Student details (contact, parent info, status)

### Teacher Management
- Add, edit, view, delete teachers
- Subject assignment
- Contact information

### Classes Management
- Class creation and assignment
- Class teacher assignment
- Student capacity tracking

### Subjects Management
- Subject creation with codes
- Teacher assignment
- Credit hours

### Attendance
- Daily attendance marking
- Attendance by class
- Present/Absent/Late tracking

### Grades
- CA (30%) and Exam (70%) scoring
- Automatic grade calculation
- Grade scale reference

### Timetable
- Weekly class schedule
- Subject legend
- Printable format

### Reports
- Student reports
- Attendance reports
- Grades reports
- Export to PDF/Excel/CSV

### Settings
- School information
- Academic settings
- User management
- System information

## 🔐 Default Login Credentials

| Role | Username | Password |
|------|----------|----------|
| Administrator | admin | admin123 |
| Teacher | teacher | teacher123 |
| Student | student | student123 |
| Parent | parent | parent123 |
| Accountant | accountant | accountant123 |
| Registrar | registrar | registrar123 |

**To change passwords:**
1. Open `app/config.py`
2. Edit the passwords
3. Save and restart the app

## 🏫 Features

### Core Modules
- Dashboard - Overview and quick stats
- Students - Student records management
- Teachers - Teacher information
- Classes - Class management
- Subjects - Subject/Course management
- Attendance - Daily attendance tracking
- Grades - Student performance & marks
- Timetable - Class schedules

### New Modules (Recently Added)
- Admissions - New student applications & registration
- Parents - Parent/Guardian information
- Staff - Non-teaching staff management
- Meetings - Schedule & minutes of meetings
- Alumni - Old students database
- Fees - Fee management & payments
- Events - School events & activities
- Reports - Generate various reports
- Settings - System configuration

## 🛠️ Installation & Setup

### Prerequisites
- **WinPython** (no installation needed!)
- Microsoft Windows
- Web Browser

### Option 1: Using WinPython (Recommended - No Installation)

1. **Download WinPython**:
   - Go to: https://github.com/winpython/winpython/releases
   - Download `Winpython64bit-3.12.x.exe`

2. **Extract** WinPython to a folder named `WinPython`

3. **Copy** the `suhum_sts` folder next to WinPython:
   ```
   C:\School\
   ├── WinPython\
   └── suhum_sts\
   ```

4. **Run**:
   - Double-click `suhum_sts\setup\Run (Place next to WinPython).bat`

5. **Open browser**: http://localhost:5000

### Option 2: Using Installed Python

```bash
cd suhum_sts
pip install -r requirements.txt
cd app
python app.py
```

---

### Default Login

| Username | Password | Role |
|----------|----------|------|
| admin | admin123 | Administrator |
| teacher | teacher123 | Teacher |
| student | student123 | Student |

## 💻 Usage

1. Open your browser and go to `http://localhost:5000`
2. Login with default credentials (admin/admin123)
3. Navigate through the sidebar to access different modules
4. Use quick actions for common tasks

## 🔧 Customization

### Adding More Users

Run this SQL command:
```sql
INSERT INTO users (username, password, role) 
VALUES ('newuser', 'password', 'teacher');
```

### Adding More Data

Use the web interface or insert directly into the database:
```sql
INSERT INTO students (first_name, last_name, gender, class_id, parent_name, parent_contact) 
VALUES ('FirstName', 'LastName', 'Male', 1, 'ParentName', '+233 XXX XXX XXX');
```

## 📊 Code Structure

### Frontend Ratio
- **HTML**: ~90% (9 templates)
- **CSS**: ~7% (style.css)
- **JavaScript**: ~3% (main.js)

### Backend Structure
- Single Flask application file
- Route-based architecture
- Demo data mode when database unavailable

## 🐛 Troubleshooting

### Database Connection Error
- Make sure PostgreSQL is running
- Check DATABASE_URL in app.py
- Verify database user has proper permissions

### Port Already in Use
- Change the port in app.py: `app.run(port=5001)`
- Or stop the other application using port 5000

### Template Errors
- Ensure all templates are in the `templates/` folder
- Check that Flask can find the templates folder

## 📝 License

This project is created for educational purposes.

## 👨‍💻 Author

Created for Suhum Senior Technical School

---

**Note**: This is a beginner-friendly implementation. For production use, consider:
- Using environment variables for secrets
- Implementing password hashing
- Adding input validation
- Implementing proper authentication
- Adding error handling
- Regular backups
