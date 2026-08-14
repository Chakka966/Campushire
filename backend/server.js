require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("./db");

const app = express();
app.use(cors());
app.use(express.json());


// =====================================================
// HOME
// =====================================================

app.get("/", (req, res) => {
    res.send("CampusHire Backend is running!");
});

// =====================================================
// AUTHENTICATION
// =====================================================

// Login
app.post("/api/login", (req, res) => {

    const { username, password } = req.body;

    const sql = `
        SELECT *
        FROM User
        WHERE username = ?
    `;

    db.query(sql, [username], async (err, results) => {

        if (err) {
            console.error("MySQL Error:", err);

            return res.status(500).json({
                error: err.message
            });
        }

        if (results.length === 0) {
            return res.status(401).json({
                error: "Invalid username or password"
            });
        }

        const user = results[0];

        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                error: "Invalid username or password"
            });
        }

        const token = jwt.sign(
            {
                user_id: user.user_id,
                username: user.username,
                role: user.role,
                student_id: user.student_id
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "2h"
            }
        );

        res.json({
            message: "Login successful",
            token: token,
            user: {
                user_id: user.user_id,
                username: user.username,
                role: user.role,
                student_id: user.student_id
            }
        });
    });
});
// =====================================================
// AUTHENTICATION MIDDLEWARE
// =====================================================

function authenticateToken(req, res, next) {

    const authHeader = req.headers["authorization"];

    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            error: "Access token required"
        });
    }

    jwt.verify(
        token,
        process.env.JWT_SECRET,
        (err, user) => {

            if (err) {
                return res.status(403).json({
                    error: "Invalid or expired token"
                });
            }

            req.user = user;

            next();
        }
    );
}
// =====================================================
// ADMIN ONLY MIDDLEWARE
// =====================================================

function requireAdmin(req, res, next) {

    if (req.user.role !== "admin") {

        return res.status(403).json({
            error: "Admin access required"
        });
    }

    next();
}
// ===============================
// VERIFY JWT TOKEN
// ===============================

const verifyToken = (req, res, next) => {

    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            error: "Access token required"
        });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            error: "Invalid token format"
        });
    }

    try {

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = decoded;

        next();

    } catch (error) {

        console.error("Token verification error:", error);

        return res.status(401).json({
            error: "Invalid or expired token"
        });
    }
};
// =====================================================
// STUDENTS
// =====================================================

// Get all students
app.get("/api/students", (req, res) => {

    const sql = "SELECT * FROM Student";

    db.query(sql, (err, results) => {

        if (err) {
            console.error("MySQL Error:", err);
            return res.status(500).json({
                error: "Database error"
            });
        }

        res.json(results);
    });
});


// Add student
app.post("/api/students", (req, res) => {

    const { name, department, cgpa } = req.body;

    const sql = `
        INSERT INTO Student (name, department, cgpa)
        VALUES (?, ?, ?)
    `;

    db.query(
        sql,
        [name, department, cgpa],
        (err, result) => {

            if (err) {
                console.error("MySQL Error:", err);

                return res.status(500).json({
                    error: err.message
                });
            }

            res.status(201).json({
                message: "Student added successfully",
                student_id: result.insertId
            });
        }
    );
});


// Search students
app.get("/api/students/search", (req, res) => {

    const { department, minCgpa } = req.query;

    let sql = `
        SELECT student_id, name, department, cgpa
        FROM Student
        WHERE 1 = 1
    `;

    const values = [];

    if (department) {
        sql += ` AND department = ?`;
        values.push(department);
    }

    if (minCgpa) {
        sql += ` AND cgpa >= ?`;
        values.push(minCgpa);
    }

    sql += ` ORDER BY cgpa DESC`;

    db.query(sql, values, (err, results) => {

        if (err) {
            console.error("MySQL Error:", err);

            return res.status(500).json({
                error: err.message
            });
        }

        res.json(results);
    });
});
// UPDATE STUDENT
app.put("/api/students/:id", (req, res) => {
    const studentId = req.params.id;
    const { name, department, cgpa } = req.body;

    const sql = `
        UPDATE Student
        SET name = ?, department = ?, cgpa = ?
        WHERE student_id = ?
    `;

    db.query(
        sql,
        [name, department, cgpa, studentId],
        (err, result) => {
            if (err) {
                console.error("MySQL Error:", err);
                return res.status(500).json({
                    error: err.message
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    error: "Student not found"
                });
            }

            res.json({
                message: "Student updated successfully"
            });
        }
    );
});


// DELETE STUDENT
app.delete("/api/students/:id", (req, res) => {
    const studentId = req.params.id;

    const sql = `
        DELETE FROM Student
        WHERE student_id = ?
    `;

    db.query(sql, [studentId], (err, result) => {
        if (err) {
            console.error("MySQL Error:", err);

            return res.status(500).json({
                error: err.message
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                error: "Student not found"
            });
        }

        res.json({
            message: "Student deleted successfully"
        });
    });
});

// =====================================================
// COMPANIES
// =====================================================

// Get all companies
app.get("/api/companies", (req, res) => {

    const sql = "SELECT * FROM Company";

    db.query(sql, (err, results) => {

        if (err) {
            console.error("MySQL Error:", err);

            return res.status(500).json({
                error: "Database error"
            });
        }

        res.json(results);
    });
});


// Add company
app.post(
    "/api/companies",
    authenticateToken,
    requireAdmin,
    (req, res) => {

    const { company_name, package_lpa } = req.body;

    const sql = `
        INSERT INTO Company (company_name, package_lpa)
        VALUES (?, ?)
    `;

    db.query(
        sql,
        [company_name, package_lpa],
        (err, result) => {

            if (err) {
                console.error("MySQL Error:", err);

                return res.status(500).json({
                    error: err.message
                });
            }

            res.status(201).json({
                message: "Company added successfully",
                company_id: result.insertId
            });
        }
    );
});

// UPDATE COMPANY
app.put(
    "/api/companies/:id",
    authenticateToken,
    requireAdmin,
    (req, res) => {

    const companyId = req.params.id;

    const { company_name, package_lpa } = req.body;

    const sql = `
        UPDATE Company
        SET company_name = ?, package_lpa = ?
        WHERE company_id = ?
    `;

    db.query(
        sql,
        [company_name, package_lpa, companyId],
        (err, result) => {

            if (err) {
                console.error("MySQL Error:", err);

                return res.status(500).json({
                    error: err.message
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    error: "Company not found"
                });
            }

            res.json({
                message: "Company updated successfully"
            });
        }
    );
});
// DELETE COMPANY
app.delete(
    "/api/companies/:id",
    authenticateToken,
    requireAdmin,
    (req, res) => {

    const companyId = req.params.id;

    const sql = `
        DELETE FROM Company
        WHERE company_id = ?
    `;

    db.query(sql, [companyId], (err, result) => {

        if (err) {
            console.error("MySQL Error:", err);

            return res.status(500).json({
                error: err.message
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                error: "Company not found"
            });
        }

        res.json({
            message: "Company deleted successfully"
        });
    });
});
// =====================================================
// JOB DRIVES
// =====================================================

// Get all job drives
app.get("/api/drives", (req, res) => {

    const sql = `
        SELECT
            j.drive_id,
            j.company_id,
            c.company_name,
            j.role,
            j.package_lpa,
            j.eligibility_cgpa,
            j.deadline
        FROM Job_Drive j
        JOIN Company c
            ON j.company_id = c.company_id
    `;

    db.query(sql, (err, results) => {

        if (err) {
            console.error("MySQL Error:", err);

            return res.status(500).json({
                error: "Database error"
            });
        }

        res.json(results);
    });
});


// Add job drive
app.post(
    "/api/drives",
    authenticateToken,
    requireAdmin,
    (req, res) => {

    const {
        company_id,
        role,
        package_lpa,
        eligibility_cgpa,
        deadline
    } = req.body;

    const sql = `
        INSERT INTO Job_Drive
        (
            company_id,
            role,
            package_lpa,
            eligibility_cgpa,
            deadline
        )
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            company_id,
            role,
            package_lpa,
            eligibility_cgpa,
            deadline
        ],
        (err, result) => {

            if (err) {
                console.error("MySQL Error:", err);

                return res.status(500).json({
                    error: err.message
                });
            }

            res.status(201).json({
                message: "Job drive added successfully",
                drive_id: result.insertId
            });
        }
    );
});

// UPDATE JOB DRIVE

app.put(
    "/api/drives/:id",
    authenticateToken,
    requireAdmin,
    (req, res) => {

    const driveId = req.params.id;

    const {
        company_id,
        role,
        package_lpa,
        eligibility_cgpa,
        deadline
    } = req.body;

    const sql = `
        UPDATE Job_Drive
        SET
            company_id = ?,
            role = ?,
            package_lpa = ?,
            eligibility_cgpa = ?,
            deadline = ?
        WHERE drive_id = ?
    `;

    db.query(
        sql,
        [
            company_id,
            role,
            package_lpa,
            eligibility_cgpa,
            deadline,
            driveId
        ],
        (err, result) => {

            if (err) {
                console.error("MySQL Error:", err);

                return res.status(500).json({
                    error: err.message
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    error: "Job drive not found"
                });
            }

            res.json({
                message: "Job drive updated successfully"
            });
        }
    );
});

// DELETE JOB DRIVE

app.delete(
    "/api/drives/:id",
    authenticateToken,
    requireAdmin,
    (req, res) => {

    const driveId = req.params.id;

    const sql = `
        DELETE FROM Job_Drive
        WHERE drive_id = ?
    `;

    db.query(
        sql,
        [driveId],
        (err, result) => {

            if (err) {
                console.error("MySQL Error:", err);

                return res.status(500).json({
                    error: err.message
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    error: "Job drive not found"
                });
            }

            res.json({
                message: "Job drive deleted successfully"
            });
        }
    );
});
// Get applicants for a particular job drive
app.get("/api/drives/:id/applicants", (req, res) => {

    const driveId = req.params.id;

    const sql = `
        SELECT
            a.application_id,
            s.student_id,
            s.name,
            s.department,
            s.cgpa,
            a.status
        FROM Application a
        JOIN Student s
            ON a.student_id = s.student_id
        WHERE a.drive_id = ?
        ORDER BY s.name
    `;

    db.query(sql, [driveId], (err, results) => {

        if (err) {
            console.error("MySQL Error:", err);

            return res.status(500).json({
                error: err.message
            });
        }

        res.json(results);
    });
});
app.get("/api/drives/:id/eligible-students", (req, res) => {
    const driveId = req.params.id;

    const sql = `
        SELECT
            s.student_id,
            s.name,
            s.department,
            s.cgpa
        FROM Student s
        JOIN Job_Drive j
            ON s.cgpa >= j.eligibility_cgpa
        WHERE j.drive_id = ?
        ORDER BY s.cgpa DESC
    `;

    db.query(sql, [driveId], (err, results) => {

        if (err) {
            console.error("MySQL Error:", err);

            return res.status(500).json({
                error: err.message
            });
        }

        res.json(results);
    });
});

// =====================================================
// APPLICATIONS
// =====================================================

// Add application
app.post("/api/applications", (req, res) => {

    const {
        student_id,
        drive_id
    } = req.body;


    // Check duplicate application
    const checkSql = `
        SELECT application_id
        FROM Application
        WHERE student_id = ?
        AND drive_id = ?
    `;

    db.query(
        checkSql,
        [student_id, drive_id],
        (err, results) => {

            if (err) {
                console.error("MySQL Error:", err);

                return res.status(500).json({
                    error: err.message
                });
            }


            // Student already applied
            if (results.length > 0) {

                return res.status(400).json({
                    error: "Student has already applied to this job drive."
                });
            }


            // Insert application
            const sql = `
                INSERT INTO Application
                (
                    student_id,
                    drive_id,
                    status
                )
                VALUES (?, ?, 'Applied')
            `;

            db.query(
                sql,
                [student_id, drive_id],
                (err, result) => {

                    if (err) {
                        console.error("MySQL Error:", err);

                        return res.status(500).json({
                            error: err.message
                        });
                    }

                    res.status(201).json({
                        message: "Application submitted successfully",
                        application_id: result.insertId
                    });
                }
            );
        }
    );
});


// Get all applications
// =====================================================
// UPDATE APPLICATION STATUS
// =====================================================

app.put(
    "/api/applications/:id/status",
    verifyToken,
    requireAdmin,
    (req, res) => {

        const applicationId = req.params.id;
        const { status } = req.body;

        const sql = `
            UPDATE Application
            SET status = ?
            WHERE application_id = ?
        `;

        db.query(
            sql,
            [status, applicationId],
            (err, result) => {

                if (err) {
                    console.error(
                        "MySQL Error:",
                        err
                    );

                    return res.status(500).json({
                        error: err.message
                    });
                }

                if (result.affectedRows === 0) {

                    return res.status(404).json({
                        error: "Application not found"
                    });
                }

                res.json({
                    message:
                        "Application status updated successfully"
                });
            }
        );
    }
);

app.get("/api/applications", (req, res) => {

    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            error: "No token provided"
        });
    }

    jwt.verify(
        token,
        process.env.JWT_SECRET,
        (err, decoded) => {

            if (err) {
                return res.status(401).json({
                    error: "Invalid or expired token"
                });
            }

            let sql = `
                SELECT
                    a.application_id,
                    a.student_id,
                    s.name AS student_name,
                    c.company_name,
                    j.role,
                    j.package_lpa,
                    a.status
                FROM Application a
                JOIN Student s
                    ON a.student_id = s.student_id
                JOIN Job_Drive j
                    ON a.drive_id = j.drive_id
                JOIN Company c
                    ON j.company_id = c.company_id
            `;

            const values = [];

            // Student can see ONLY their applications
            if (decoded.role === "student") {

                sql += `
                    WHERE a.student_id = ?
                `;

                values.push(decoded.student_id);
            }

            sql += `
                ORDER BY a.application_id DESC
            `;

            db.query(
                sql,
                values,
                (err, results) => {

                    if (err) {
                        console.error(
                            "MySQL Error:",
                            err
                        );

                        return res.status(500).json({
                            error: err.message
                        });
                    }

                    res.json(results);
                }
            );
        }
    );
});


// =====================================================
// DASHBOARD
// =====================================================

app.get("/api/dashboard/stats", (req, res) => {

    const sql = `
        SELECT

            (SELECT COUNT(*)
             FROM Student) AS students,

            (SELECT COUNT(*)
             FROM Company) AS companies,

            (SELECT COUNT(*)
             FROM Job_Drive) AS drives,

            (SELECT COUNT(*)
             FROM Application) AS applications,

            (SELECT COUNT(*)
             FROM Application
             WHERE status = 'Applied') AS applied,

            (SELECT COUNT(*)
             FROM Application
             WHERE status = 'Shortlisted') AS shortlisted,

            (SELECT COUNT(*)
             FROM Application
             WHERE status = 'Selected') AS selected,

            (SELECT COUNT(*)
             FROM Application
             WHERE status = 'Rejected') AS rejected
    `;

    db.query(sql, (err, results) => {

        if (err) {
            console.error("MySQL Error:", err);

            return res.status(500).json({
                error: err.message
            });
        }

        res.json(results[0]);
    });
});


// =====================================================
// START SERVER
// =====================================================

app.listen(5000, () => {

    console.log("Server running on port 5000");

});