// ========================================
// SUHUM SENIOR TECHNICAL SCHOOL
// School Management System - JavaScript
// ========================================

// Wait for page to load
document.addEventListener("DOMContentLoaded", function() {
    
    // Initialize the application
    console.log("Suhum STS - School Management System Loaded");
    
    // Set up menu toggle for mobile
    setupMenuToggle();
    
    // Check URL params for modals
    checkUrlParams();
    
    // Set up form validations
    setupFormValidation();
    
    // Set up table search
    setupTableSearch();
    
});

// ========================================
// MENU TOGGLE FUNCTIONS
// ========================================

function setupMenuToggle() {
    var menuToggle = document.getElementById("menuToggle");
    
    if (menuToggle) {
        menuToggle.addEventListener("click", function() {
            var sidebar = document.querySelector(".sidebar");
            var mainContent = document.querySelector(".main-content");
            
            if (sidebar.style.marginLeft === "-260px") {
                sidebar.style.marginLeft = "0";
            } else {
                sidebar.style.marginLeft = "-260px";
            }
        });
    }
}

// ========================================
// MODAL FUNCTIONS
// ========================================

// Show add modal
function showAddModal(type) {
    var modal = document.getElementById(type + "Modal");
    if (modal) {
        modal.classList.add("active");
        
        // Reset form if it exists
        var form = modal.querySelector("form");
        if (form) {
            form.reset();
        }
        
        // Update modal title
        var title = document.getElementById(type + "ModalTitle");
        if (title) {
            title.textContent = "Add New " + capitalizeFirst(type);
        }
    }
}

// Close modal
function closeModal(type) {
    var modal = document.getElementById(type + "Modal");
    if (modal) {
        modal.classList.remove("active");
    }
}

// Close modal when clicking outside
window.addEventListener("click", function(event) {
    var modals = document.querySelectorAll(".modal");
    modals.forEach(function(modal) {
        if (event.target === modal) {
            modal.classList.remove("active");
        }
    });
});

// Capitalize first letter
function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// ========================================
// URL PARAMETERS
// ========================================

function checkUrlParams() {
    var params = new URLSearchParams(window.location.search);
    
    // Check if we need to show add modal
    if (params.get("action") === "add") {
        // Get the page type from URL
        var path = window.location.pathname;
        var page = path.split("/")[1];
        
        if (page) {
            showAddModal(page.replace("s", "")); // students -> student
        }
    }
    
    // Check if we need to mark attendance
    if (params.get("action") === "mark") {
        showAddModal("attendance");
    }
    
    // Check if we need to enter grades
    if (params.get("action") === "entry") {
        showAddModal("grade");
    }
    
    // Check if we need to generate report
    if (params.get("action") === "generate") {
        generateReport();
    }
    
    // Check if we need to view timetable
    if (params.get("action") === "view") {
        // Already on timetable page
    }
}

// ========================================
// FORM VALIDATION
// ========================================

function setupFormValidation() {
    var forms = document.querySelectorAll("form");
    
    forms.forEach(function(form) {
        form.addEventListener("submit", function(event) {
            // Basic validation
            var requiredFields = form.querySelectorAll("[required]");
            var isValid = true;
            
            requiredFields.forEach(function(field) {
                if (!field.value.trim()) {
                    isValid = false;
                    field.style.borderColor = "red";
                } else {
                    field.style.borderColor = "";
                }
            });
            
            if (!isValid) {
                event.preventDefault();
                alert("Please fill in all required fields");
            }
        });
    });
    
    // Remove red border on input
    var inputs = document.querySelectorAll("input");
    inputs.forEach(function(input) {
        input.addEventListener("input", function() {
            this.style.borderColor = "";
        });
    });
}

// ========================================
// TABLE SEARCH
// ========================================

function setupTableSearch() {
    var searchInput = document.getElementById("searchInput");
    
    if (searchInput) {
        searchInput.addEventListener("keyup", searchTable);
    }
}

function searchTable() {
    var input = document.getElementById("searchInput");
    var filter = input.value.toLowerCase();
    var table = document.querySelector(".data-table");
    
    if (table) {
        var rows = table.getElementsByTagName("tbody")[0].getElementsByTagName("tr");
        
        for (var i = 0; i < rows.length; i++) {
            var text = rows[i].textContent.toLowerCase();
            
            if (text.indexOf(filter) > -1) {
                rows[i].style.display = "";
            } else {
                rows[i].style.display = "none";
            }
        }
    }
}

// ========================================
// TABLE FILTER
// ========================================

function filterTable() {
    var classFilter = document.getElementById("filterClass");
    var statusFilter = document.getElementById("filterStatus");
    var table = document.querySelector(".data-table");
    
    if (table) {
        var rows = table.getElementsByTagName("tbody")[0].getElementsByTagName("tr");
        var classValue = classFilter ? classFilter.value.toLowerCase() : "";
        var statusValue = statusFilter ? statusFilter.value.toLowerCase() : "";
        
        for (var i = 0; i < rows.length; i++) {
            var rowText = rows[i].textContent.toLowerCase();
            var showRow = true;
            
            if (classValue && rowText.indexOf(classValue) === -1) {
                showRow = false;
            }
            
            if (statusValue && rowText.indexOf(statusValue) === -1) {
                showRow = false;
            }
            
            rows[i].style.display = showRow ? "" : "none";
        }
    }
}

// ========================================
// STUDENT FUNCTIONS
// ========================================

function viewStudent(id) {
    // Redirect to view student page
    window.location.href = "/students/view/" + id;
}

function editStudent(id) {
    var modal = document.getElementById("studentModal");
    var title = document.getElementById("modalTitle");
    
    if (modal && title) {
        modal.classList.add("active");
        title.textContent = "Edit Student";
        
        // In a real app, you would fetch student data here
        // For now, we'll just show the modal
        console.log("Edit student with ID: " + id);
    }
}

function deleteStudent(id) {
    if (confirm("Are you sure you want to delete this student?")) {
        // Send delete request
        var form = document.createElement("form");
        form.method = "POST";
        form.action = "/students/delete/" + id;
        
        document.body.appendChild(form);
        form.submit();
    }
}

// ========================================
// TEACHER FUNCTIONS
// ========================================

function viewTeacher(id) {
    window.location.href = "/teachers/view/" + id;
}

function editTeacher(id) {
    var modal = document.getElementById("teacherModal");
    var title = document.getElementById("teacherModalTitle");
    
    if (modal && title) {
        modal.classList.add("active");
        title.textContent = "Edit Teacher";
        console.log("Edit teacher with ID: " + id);
    }
}

function deleteTeacher(id) {
    if (confirm("Are you sure you want to delete this teacher?")) {
        var form = document.createElement("form");
        form.method = "POST";
        form.action = "/teachers/delete/" + id;
        
        document.body.appendChild(form);
        form.submit();
    }
}

// ========================================
// CLASS FUNCTIONS
// ========================================

function viewClass(id) {
    window.location.href = "/classes/view/" + id;
}

function editClass(id) {
    var modal = document.getElementById("classModal");
    
    if (modal) {
        modal.classList.add("active");
        console.log("Edit class with ID: " + id);
    }
}

// ========================================
// SUBJECT FUNCTIONS
// ========================================

function editSubject(id) {
    var modal = document.getElementById("subjectModal");
    
    if (modal) {
        modal.classList.add("active");
        console.log("Edit subject with ID: " + id);
    }
}

function deleteSubject(id) {
    if (confirm("Are you sure you want to delete this subject?")) {
        var form = document.createElement("form");
        form.method = "POST";
        form.action = "/subjects/delete/" + id;
        
        document.body.appendChild(form);
        form.submit();
    }
}

// ========================================
// ATTENDANCE FUNCTIONS
// ========================================

function markAttendance() {
    var classSelect = document.getElementById("attendanceClass");
    
    if (!classSelect || !classSelect.value) {
        alert("Please select a class first");
        return;
    }
    
    // Load students for attendance
    loadAttendance();
}

function loadAttendance() {
    var classSelect = document.getElementById("attendanceClass");
    var dateInput = document.getElementById("attendanceDate");
    var tableBody = document.getElementById("attendanceTable");
    
    if (!classSelect || !tableBody) {
        return;
    }
    
    var classId = classSelect.value;
    var date = dateInput ? dateInput.value : new Date().toISOString().split("T")[0];
    
    // In a real app, you would fetch data from server
    // For demo, show message
    tableBody.innerHTML = '<tr><td colspan="4" class="text-center">Loading attendance data...</td></tr>';
    
    // Simulate data loading
    setTimeout(function() {
        // This would be replaced with actual data from server
        console.log("Loading attendance for class: " + classId + " on date: " + date);
    }, 500);
}

function markPresent(studentId) {
    console.log("Mark student " + studentId + " as present");
}

function markAbsent(studentId) {
    console.log("Mark student " + studentId + " as absent");
}

// ========================================
// GRADES FUNCTIONS
// ========================================

function loadGrades() {
    var classSelect = document.getElementById("gradeClass");
    var subjectSelect = document.getElementById("gradeSubject");
    var termSelect = document.getElementById("gradeTerm");
    
    if (!classSelect || !subjectSelect || !termSelect) {
        return;
    }
    
    var classId = classSelect.value;
    var subjectId = subjectSelect.value;
    var term = termSelect.value;
    
    console.log("Loading grades for class: " + classId + ", subject: " + subjectId + ", term: " + term);
}

function editGrade(id) {
    var modal = document.getElementById("gradeModal");
    
    if (modal) {
        modal.classList.add("active");
        console.log("Edit grade with ID: " + id);
    }
}

// ========================================
// TIMETABLE FUNCTIONS
// ========================================

function loadTimetable() {
    var classSelect = document.getElementById("timetableClass");
    
    if (!classSelect) {
        return;
    }
    
    var classId = classSelect.value;
    
    console.log("Loading timetable for class: " + classId);
}

function printTimetable() {
    window.print();
}

// ========================================
// REPORTS FUNCTIONS
// ========================================

function selectReport(type) {
    // Highlight selected report type
    var reportCards = document.querySelectorAll(".report-card");
    reportCards.forEach(function(card) {
        card.classList.remove("selected");
    });
    
    event.currentTarget.classList.add("selected");
    
    console.log("Selected report type: " + type);
}

function generateReport() {
    var reportClass = document.getElementById("reportClass");
    var reportTerm = document.getElementById("reportTerm");
    var reportFormat = document.getElementById("reportFormat");
    
    var classId = reportClass ? reportClass.value : "";
    var term = reportTerm ? reportTerm.value : "1";
    var format = reportFormat ? reportFormat.value : "pdf";
    
    if (!classId) {
        alert("Please select a class");
        return;
    }
    
    // In a real app, this would generate and download the report
    alert("Generating " + format.toUpperCase() + " report for term " + term + "...\n\nThis would download the report in a real application.");
    
    console.log("Generating report: class=" + classId + ", term=" + term + ", format=" + format);
}

function printReport() {
    window.print();
}

// ========================================
// EXPORT FUNCTIONS
// ========================================

function exportData(type) {
    var format = prompt("Enter export format (csv, excel, pdf):", "csv");
    
    if (format) {
        alert("Exporting " + type + " data as " + format.toUpperCase() + "...\n\nThis would download the file in a real application.");
        console.log("Exporting " + type + " as " + format);
    }
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

// Get current date in YYYY-MM-DD format
function getCurrentDate() {
    var today = new Date();
    var year = today.getFullYear();
    var month = String(today.getMonth() + 1).padStart(2, "0");
    var day = String(today.getDate()).padStart(2, "0");
    
    return year + "-" + month + "-" + day;
}

// Format date for display
function formatDate(dateString) {
    var date = new Date(dateString);
    var options = { year: "numeric", month: "long", day: "numeric" };
    return date.toLocaleDateString("en-US", options);
}

// Calculate grade based on score
function calculateGrade(score) {
    if (score >= 80) return "A";
    if (score >= 70) return "B";
    if (score >= 60) return "C";
    if (score >= 50) return "D";
    return "F";
}

// Show notification
function showNotification(message, type) {
    var notification = document.createElement("div");
    notification.className = "notification notification-" + type;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(function() {
        notification.classList.add("show");
    }, 100);
    
    setTimeout(function() {
        notification.classList.remove("show");
        setTimeout(function() {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}
