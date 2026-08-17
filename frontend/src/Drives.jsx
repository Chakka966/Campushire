import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./App.css";

function Drives() {

    const [drives, setDrives] = useState([]);
    const [companies, setCompanies] = useState([]);

    const [showForm, setShowForm] = useState(false);
    const [editingDrive, setEditingDrive] = useState(null);

    const [formData, setFormData] = useState({
        company_id: "",
        role: "",
        package_lpa: "",
        eligibility_cgpa: "",
        deadline: ""
    });

    // =====================================================
    // GET LOGGED-IN USER
    // =====================================================

    const user = JSON.parse(
        localStorage.getItem("user")
    );

    const isAdmin = user?.role === "admin";
    const isStudent = user?.role === "student";


    // =====================================================
    // FETCH JOB DRIVES
    // =====================================================

    const fetchDrives = () => {

        axios
            .get("https://campushire-production-8aad.up.railway.app /api/drives")
            .then((response) => {

                setDrives(response.data);

            })
            .catch((error) => {

                console.error(
                    "Error fetching drives:",
                    error
                );

            });
    };


    // =====================================================
    // FETCH COMPANIES
    // =====================================================

    const fetchCompanies = () => {

        axios
            .get("https://campushire-production-8aad.up.railway.app /api/companies")
            .then((response) => {

                setCompanies(response.data);

            })
            .catch((error) => {

                console.error(
                    "Error fetching companies:",
                    error
                );

            });
    };


    // =====================================================
    // LOAD DATA
    // =====================================================

    useEffect(() => {

        fetchDrives();

        // Only admin needs company data
        if (isAdmin) {
            fetchCompanies();
        }

    }, [isAdmin]);


    // =====================================================
    // HANDLE INPUT
    // =====================================================

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

    };


    // =====================================================
    // RESET FORM
    // =====================================================

    const resetForm = () => {

        setFormData({
            company_id: "",
            role: "",
            package_lpa: "",
            eligibility_cgpa: "",
            deadline: ""
        });

        setEditingDrive(null);
        setShowForm(false);

    };


    // =====================================================
    // ADD / UPDATE JOB DRIVE
    // =====================================================

    const handleSubmit = (e) => {

        e.preventDefault();

        // -------------------------------
        // UPDATE
        // -------------------------------

        if (editingDrive) {

            axios
                .put(
                    `https://campushire-production-8aad.up.railway.app /api/drives/${editingDrive.drive_id}`,
                    formData
                )
                .then(() => {

                    alert(
                        "Job drive updated successfully!"
                    );

                    resetForm();

                    fetchDrives();

                })
                .catch((error) => {

                    console.error(
                        "Error updating job drive:",
                        error
                    );

                    alert(
                        "Failed to update job drive: " +
                        (
                            error.response?.data?.error ||
                            "Unknown error"
                        )
                    );

                });

        }

        // -------------------------------
        // ADD
        // -------------------------------

        else {

            axios
                .post(
                    "https://campushire-production-8aad.up.railway.app /api/drives",
                    formData
                )
                .then(() => {

                    alert(
                        "Job drive added successfully!"
                    );

                    resetForm();

                    fetchDrives();

                })
                .catch((error) => {

                    console.error(
                        "Error adding job drive:",
                        error
                    );

                    alert(
                        "Failed to add job drive: " +
                        (
                            error.response?.data?.error ||
                            "Unknown error"
                        )
                    );

                });

        }

    };


    // =====================================================
    // EDIT JOB DRIVE
    // =====================================================

    const handleEdit = (drive) => {

        setEditingDrive(drive);

        setFormData({
            company_id: drive.company_id,
            role: drive.role,
            package_lpa: drive.package_lpa,
            eligibility_cgpa: drive.eligibility_cgpa,
            deadline: drive.deadline
                ? new Date(drive.deadline)
                    .toISOString()
                    .slice(0, 16)
                : ""
        });

        setShowForm(true);

    };


    // =====================================================
    // DELETE JOB DRIVE
    // =====================================================

    const handleDelete = (driveId) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this job drive?"
        );

        if (!confirmDelete) {
            return;
        }

        axios
            .delete(
                `https://campushire-production-8aad.up.railway.app /api/drives/${driveId}`
            )
            .then(() => {

                alert(
                    "Job drive deleted successfully!"
                );

                fetchDrives();

            })
            .catch((error) => {

                console.error(
                    "Error deleting job drive:",
                    error
                );

                alert(
                    "Failed to delete job drive: " +
                    (
                        error.response?.data?.error ||
                        "Unknown error"
                    )
                );

            });

    };


    // =====================================================
    // APPLY FOR JOB DRIVE
    // =====================================================

    const handleApply = (driveId) => {

        if (!user?.student_id) {

            alert(
                "Student information not found. Please login again."
            );

            return;
        }

        const confirmApply = window.confirm(
            "Do you want to apply for this job drive?"
        );

        if (!confirmApply) {
            return;
        }

        axios
            .post(
                "https://campushire-production-8aad.up.railway.app /api/applications",
                {
                    student_id: user.student_id,
                    drive_id: driveId
                }
            )
            .then(() => {

                alert(
                    "Application submitted successfully!"
                );

            })
            .catch((error) => {

                console.error(
                    "Error applying for job drive:",
                    error
                );

                alert(
                    error.response?.data?.error ||
                    "Failed to apply for this job drive."
                );

            });

    };


    // =====================================================
    // UI
    // =====================================================

    return (

        <>

            {/* =================================================
                PAGE HEADER
            ================================================= */}

            <div className="page-header">

                <h1>
                    Job Drives
                </h1>


                {/* ADMIN ONLY */}

                {isAdmin && (

                    <button
                        className="add-button"
                        onClick={() => {

                            if (showForm) {
                                resetForm();
                            } else {
                                setShowForm(true);
                            }

                        }}
                    >

                        {showForm
                            ? "✖ Close"
                            : "+ Add Job Drive"}

                    </button>

                )}

            </div>


            {/* =================================================
                ADD / EDIT FORM
                ADMIN ONLY
            ================================================= */}

            {isAdmin && showForm && (

                <div className="form-container">

                    <h2>
                        {editingDrive
                            ? "Edit Job Drive"
                            : "Add Job Drive"}
                    </h2>


                    <form onSubmit={handleSubmit}>

                        {/* COMPANY */}

                        <label>
                            Company
                        </label>

                        <select
                            name="company_id"
                            value={formData.company_id}
                            onChange={handleChange}
                            required
                        >

                            <option value="">
                                Select Company
                            </option>

                            {companies.map(
                                (company) => (

                                    <option
                                        key={
                                            company.company_id
                                        }
                                        value={
                                            company.company_id
                                        }
                                    >

                                        {
                                            company.company_name
                                        }

                                    </option>

                                )
                            )}

                        </select>


                        {/* ROLE */}

                        <label>
                            Role
                        </label>

                        <input
                            type="text"
                            name="role"
                            placeholder="e.g. Software Developer"
                            value={formData.role}
                            onChange={handleChange}
                            required
                        />


                        {/* PACKAGE */}

                        <label>
                            Package (LPA)
                        </label>

                        <input
                            type="number"
                            step="0.01"
                            name="package_lpa"
                            placeholder="e.g. 8.5"
                            value={formData.package_lpa}
                            onChange={handleChange}
                            required
                        />


                        {/* ELIGIBILITY */}

                        <label>
                            Eligibility CGPA
                        </label>

                        <input
                            type="number"
                            step="0.01"
                            name="eligibility_cgpa"
                            placeholder="e.g. 7.5"
                            value={
                                formData.eligibility_cgpa
                            }
                            onChange={handleChange}
                            required
                        />


                        {/* DEADLINE */}

                        <label>
                            Deadline
                        </label>

                        <input
                            type="datetime-local"
                            name="deadline"
                            value={formData.deadline}
                            onChange={handleChange}
                            required
                        />


                        {/* SUBMIT */}

                        <button
                            type="submit"
                            className="submit-button"
                        >

                            {editingDrive
                                ? "Update Job Drive"
                                : "Add Job Drive"}

                        </button>

                    </form>

                </div>

            )}


            {/* =================================================
                JOB DRIVE CARDS
            ================================================= */}

            <div className="student-list">

                {drives.length === 0 ? (

                    <p>
                        No job drives found.
                    </p>

                ) : (

                    drives.map((drive) => (

                        <div
                            className="student-card"
                            key={drive.drive_id}
                        >

                            <h3>
                                {drive.company_name}
                            </h3>


                            <p>
                                <strong>
                                    Role:
                                </strong>{" "}
                                {drive.role}
                            </p>


                            <p>
                                <strong>
                                    Package:
                                </strong>{" "}
                                {drive.package_lpa} LPA
                            </p>


                            <p>
                                <strong>
                                    Eligibility CGPA:
                                </strong>{" "}
                                {drive.eligibility_cgpa}
                            </p>


                            <p>
                                <strong>
                                    Deadline:
                                </strong>{" "}
                                {new Date(
                                    drive.deadline
                                ).toLocaleString()}
                            </p>


                            {/* =================================================
                                ADMIN ACTIONS
                            ================================================= */}

                            {isAdmin && (

                                <div className="company-actions">

                                    {/* EDIT */}

                                    <button
                                        className="edit-button"
                                        onClick={() =>
                                            handleEdit(drive)
                                        }
                                    >
                                        ✏️ Edit
                                    </button>


                                    {/* ELIGIBLE STUDENTS */}

                                    <Link
                                        to={`/drives/${drive.drive_id}/eligible-students`}
                                        className="eligible-button"
                                    >
                                        🎓 Eligible Students
                                    </Link>


                                    {/* APPLICANTS */}

                                    <Link
                                        to={`/drives/${drive.drive_id}/applicants`}
                                        className="applicants-button"
                                    >
                                        👥 View Applicants
                                    </Link>


                                    {/* DELETE */}

                                    <button
                                        className="delete-button"
                                        onClick={() =>
                                            handleDelete(
                                                drive.drive_id
                                            )
                                        }
                                    >
                                        🗑️ Delete
                                    </button>

                                </div>

                            )}


                            {/* =================================================
                                STUDENT ACTION
                            ================================================= */}

                            {isStudent && (

                                <div className="company-actions">

                                    <button
                                        className="submit-button"
                                        onClick={() =>
                                            handleApply(
                                                drive.drive_id
                                            )
                                        }
                                    >
                                        ✅ Apply
                                    </button>

                                </div>

                            )}

                        </div>

                    ))

                )}

            </div>

        </>

    );
}

export default Drives;