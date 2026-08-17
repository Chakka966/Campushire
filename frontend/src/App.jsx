import { useEffect, useState } from "react";
import axios from "axios";
import {
    BrowserRouter,
    Routes,
    Route,
    Link,
    Navigate,
    useNavigate
} from "react-router-dom";

import "./App.css";
import Login from "./Login";
import Students from "./Students";
import Companies from "./Companies";
import Drives from "./Drives";
import Applications from "./Applications";
import Applicants from "./Applicants";
import EligibleStudents from "./EligibleStudents";

// ===============================
// GET LOGGED-IN USER
// ===============================

function getUser() {
    const user = localStorage.getItem("user");

    if (!user) {
        return null;
    }

    try {
        return JSON.parse(user);
    } catch (error) {
        return null;
    }
}


// ===============================
// DASHBOARD
// ===============================

function Dashboard({ user }) {

    const [students, setStudents] = useState([]);

    const [stats, setStats] = useState({
        students: 0,
        companies: 0,
        drives: 0,
        applications: 0,
        applied: 0,
        shortlisted: 0,
        selected: 0,
        rejected: 0
    });


    // ===============================
    // FETCH DASHBOARD DATA
    // ===============================

    useEffect(() => {

        // Students are needed only for admin dashboard
        if (user?.role === "admin") {

            axios
                .get("https://campushire-production-8aad.up.railway.app /api/students")
                .then((response) => {
                    setStudents(response.data);
                })
                .catch((error) => {
                    console.error(
                        "Error fetching students:",
                        error
                    );
                });
        }


        // Dashboard statistics
        const token = localStorage.getItem("token");

        axios
            .get(
                "https://campushire-production-8aad.up.railway.app /api/dashboard/stats",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )
            .then((response) => {
                setStats(response.data);
            })
            .catch((error) => {
                console.error(
                    "Error fetching dashboard stats:",
                    error
                );
            });

    }, [user]);


    // ===============================
    // STUDENT DASHBOARD
    // ===============================

    if (user?.role === "student") {

        return (
            <>

                <div className="dashboard-welcome">

                    <div>
                        <h1>
                            Welcome back, {user.username} 👋
                        </h1>

                        <p>
                            Track your placement applications
                            and job opportunities.
                        </p>
                    </div>

                </div>


                {/* ===============================
                    STUDENT STATISTICS
                =============================== */}

                <h2>My Application Overview</h2>

                <div className="stats-container">

                    <div className="stat-card">
                        <h3>📝 Applied</h3>
                        <p>{stats.applied}</p>
                        <span>Applications</span>
                    </div>


                    <div className="stat-card">
                        <h3>🔎 Shortlisted</h3>
                        <p>{stats.shortlisted}</p>
                        <span>Applications</span>
                    </div>


                    <div className="stat-card">
                        <h3>🎉 Selected</h3>
                        <p>{stats.selected}</p>
                        <span>Applications</span>
                    </div>


                    <div className="stat-card">
                        <h3>❌ Rejected</h3>
                        <p>{stats.rejected}</p>
                        <span>Applications</span>
                    </div>

                </div>


                {/* ===============================
                    STUDENT INFO
                =============================== */}

                <div className="dashboard-info-card">

                    <h2>Placement Journey</h2>

                    <p>
                        Explore available job drives and apply
                        for opportunities that match your
                        eligibility.
                    </p>

                </div>

            </>
        );
    }


    // ===============================
    // ADMIN DASHBOARD
    // ===============================

    return (
        <>

            <div className="dashboard-welcome">

                <div>
                    <h1>
                        Welcome back, Admin 👋
                    </h1>

                    <p>
                        Manage students, companies, job drives
                        and placement applications.
                    </p>
                </div>

            </div>


            {/* ===============================
                MAIN STATISTICS
            =============================== */}

            <h2>Placement Overview</h2>

            <div className="stats-container">

                <div className="stat-card">

                    <h3>👨‍🎓 Students</h3>

                    <p>
                        {stats.students}
                    </p>

                    <span>
                        Registered Students
                    </span>

                </div>


                <div className="stat-card">

                    <h3>🏢 Companies</h3>

                    <p>
                        {stats.companies}
                    </p>

                    <span>
                        Recruiting Companies
                    </span>

                </div>


                <div className="stat-card">

                    <h3>💼 Job Drives</h3>

                    <p>
                        {stats.drives}
                    </p>

                    <span>
                        Active Opportunities
                    </span>

                </div>


                <div className="stat-card">

                    <h3>📋 Applications</h3>

                    <p>
                        {stats.applications}
                    </p>

                    <span>
                        Total Applications
                    </span>

                </div>

            </div>


            {/* ===============================
                APPLICATION STATUS
            =============================== */}

            <h2>Application Status</h2>

            <div className="stats-container">

                <div className="stat-card">

                    <h3>📝 Applied</h3>

                    <p>
                        {stats.applied}
                    </p>

                    <span>
                        Applications
                    </span>

                </div>


                <div className="stat-card">

                    <h3>🔎 Shortlisted</h3>

                    <p>
                        {stats.shortlisted}
                    </p>

                    <span>
                        Applications
                    </span>

                </div>


                <div className="stat-card">

                    <h3>🎉 Selected</h3>

                    <p>
                        {stats.selected}
                    </p>

                    <span>
                        Successful Candidates
                    </span>

                </div>


                <div className="stat-card">

                    <h3>❌ Rejected</h3>

                    <p>
                        {stats.rejected}
                    </p>

                    <span>
                        Applications
                    </span>

                </div>

            </div>


            {/* ===============================
                STUDENTS
            =============================== */}

            <h2>Recent Students</h2>

            <div className="student-list">

                {students.length === 0 ? (

                    <p>
                        No students found.
                    </p>

                ) : (

                    students.slice(0, 6).map((student) => (

                        <div
                            className="student-card"
                            key={student.student_id}
                        >

                            <h3>
                                {student.name}
                            </h3>


                            <p>
                                <strong>
                                    Department:
                                </strong>{" "}
                                {student.department}
                            </p>


                            <p>
                                <strong>
                                    CGPA:
                                </strong>{" "}
                                {student.cgpa}
                            </p>

                        </div>

                    ))

                )}

            </div>

        </>
    );
}

// ===============================
// PROTECTED ROUTE
// ===============================

function ProtectedRoute({ children }) {

    const token = localStorage.getItem("token");

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return children;
}


// ===============================
// ADMIN ROUTE
// ===============================

function AdminRoute({ children }) {

    const token = localStorage.getItem("token");
    const user = getUser();

    // Not logged in
    if (!token || !user) {
        return <Navigate to="/login" replace />;
    }

    // Student trying to access admin page
    if (user.role !== "admin") {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
}


// ===============================
// LOGOUT
// ===============================
function Logout({ setUser }) {

    const navigate = useNavigate();

    const handleLogout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
    };

    return (
        <button
            onClick={handleLogout}
            className="logout-button"
        >
            🚪 Logout
        </button>
    );
}


// ===============================
// MAIN APP
// ===============================
function App() {
    const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user"))
);
const role = user?.role;
    return (

        <BrowserRouter>

    <div className="app">

        {/* ===============================
            SIDEBAR
        =============================== */}

        {user && (

            <aside className="sidebar">

                <h2 className="logo">
                    CampusHire
                </h2>

                <nav>

                    {/* DASHBOARD */}
                    <Link to="/dashboard">
                        🏠 Dashboard
                    </Link>


                    {/* ===============================
                        ADMIN ONLY
                    =============================== */}

                    {user.role === "admin" && (
                        <>
                            <Link to="/students">
                                👨‍🎓 Students
                            </Link>

                            <Link to="/companies">
                                🏢 Companies
                            </Link>
                        </>
                    )}


                    {/* ===============================
                        JOB DRIVES
                        BOTH ADMIN + STUDENT
                    =============================== */}

                    <Link to="/drives">
                        💼 Job Drives
                    </Link>


                    {/* ===============================
                        ADMIN APPLICATIONS
                    =============================== */}

                    {user.role === "admin" && (
                        <Link to="/applications">
                            📋 Applications
                        </Link>
                    )}


                    {/* ===============================
                        STUDENT APPLICATIONS
                    =============================== */}

                    {user.role === "student" && (
                        <Link to="/applications">
                            📝 My Applications
                        </Link>
                    )}


                    {/* ===============================
                        LOGOUT
                    =============================== */}

                    <Logout />

                </nav>

            </aside>

        )}


        {/* ===============================
            MAIN CONTENT
        =============================== */}

        <main className="main-content">

            <Routes>

                <Route
    path="/login"
    element={<Login setUser={setUser} />}
/>


                {/* ROOT */}
                <Route
                    path="/"
                    element={
                        <Navigate
                            to={
                                user
                                    ? "/dashboard"
                                    : "/login"
                            }
                            replace
                        />
                    }
                />


                {/* DASHBOARD */}
               <Route
    path="/dashboard"
    element={
        <ProtectedRoute>
            <Dashboard user={user} />
        </ProtectedRoute>
    }
/>

                {/* STUDENTS - ADMIN ONLY */}
                <Route
                    path="/students"
                    element={
                        <AdminRoute>
                            <Students />
                        </AdminRoute>
                    }
                />


                {/* COMPANIES - ADMIN ONLY */}
                <Route
                    path="/companies"
                    element={
                        <AdminRoute>
                            <Companies />
                        </AdminRoute>
                    }
                />


                {/* JOB DRIVES - BOTH ADMIN + STUDENT */}
                <Route
                    path="/drives"
                    element={
                        <ProtectedRoute>
                            <Drives />
                        </ProtectedRoute>
                    }
                />


                {/* ELIGIBLE STUDENTS - ADMIN ONLY */}
                <Route
                    path="/drives/:id/eligible-students"
                    element={
                        <AdminRoute>
                            <EligibleStudents />
                        </AdminRoute>
                    }
                />


                {/* APPLICANTS - ADMIN ONLY */}
                <Route
                    path="/drives/:id/applicants"
                    element={
                        <AdminRoute>
                            <Applicants />
                        </AdminRoute>
                    }
                />


                {/* APPLICATIONS */}
                <Route
                    path="/applications"
                    element={
                        <ProtectedRoute>
                            <Applications />
                        </ProtectedRoute>
                    }
                />


               


                {/* UNKNOWN URL */}
                <Route
                    path="*"
                    element={
                        <Navigate
                            to="/dashboard"
                            replace
                        />
                    }
                />

            </Routes>

        </main>

    </div>

</BrowserRouter>
);
}

export default App;