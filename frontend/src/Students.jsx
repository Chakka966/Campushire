import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function Students() {
    const [students, setStudents] = useState([]);

    const [showForm, setShowForm] = useState(false);

    const [editingStudent, setEditingStudent] = useState(null);

    const [formData, setFormData] = useState({
        name: "",
        department: "",
        cgpa: ""
    });


    // Fetch students
    const fetchStudents = () => {
        axios
            .get("https://campushire-production-8aad.up.railway.app/api/students")
            .then((response) => {
                setStudents(response.data);
            })
            .catch((error) => {
                console.error("Error fetching students:", error);
            });
    };


    useEffect(() => {
        fetchStudents();
    }, []);


    // Handle input
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };


    // Add / Update student
    const handleSubmit = (e) => {
        e.preventDefault();

        if (editingStudent) {

            // UPDATE
            axios
                .put(
                    `https://campushire-production-8aad.up.railway.app/api/students/${editingStudent.student_id}`,
                    formData
                )
                .then(() => {
                    alert("Student updated successfully!");

                    setFormData({
                        name: "",
                        department: "",
                        cgpa: ""
                    });

                    setEditingStudent(null);
                    setShowForm(false);

                    fetchStudents();
                })
                .catch((error) => {
                    console.error("Error updating student:", error);

                    alert(
                        "Failed to update student: " +
                        (error.response?.data?.error || "Unknown error")
                    );
                });

        } else {

            // ADD
            axios
                .post(
                    "https://campushire-production-8aad.up.railway.app/api/students",
                    formData
                )
                .then(() => {
                    alert("Student added successfully!");

                    setFormData({
                        name: "",
                        department: "",
                        cgpa: ""
                    });

                    setShowForm(false);

                    fetchStudents();
                })
                .catch((error) => {
                    console.error("Error adding student:", error);

                    alert(
                        "Failed to add student: " +
                        (error.response?.data?.error || "Unknown error")
                    );
                });
        }
    };


    // Edit button
    const handleEdit = (student) => {

        setEditingStudent(student);

        setFormData({
            name: student.name,
            department: student.department,
            cgpa: student.cgpa
        });

        setShowForm(true);
    };


    // Delete button
    const handleDelete = (studentId) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this student?"
        );

        if (!confirmDelete) {
            return;
        }

        axios
            .delete(
                `https://campushire-production-8aad.up.railway.app/api/students/${studentId}`
            )
            .then(() => {

                alert("Student deleted successfully!");

                fetchStudents();
            })
            .catch((error) => {

                console.error("Error deleting student:", error);

                alert(
                    "Failed to delete student: " +
                    (error.response?.data?.error || "Unknown error")
                );
            });
    };


    // Close form
    const closeForm = () => {

        setShowForm(false);

        setEditingStudent(null);

        setFormData({
            name: "",
            department: "",
            cgpa: ""
        });
    };


    return (
        <>

            <div className="page-header">

                <h1>Students</h1>

                <button
                    className="add-button"
                    onClick={() => {
                        if (showForm) {
                            closeForm();
                        } else {
                            setShowForm(true);
                        }
                    }}
                >
                    {showForm ? "✖ Close" : "+ Add Student"}
                </button>

            </div>


            {/* Add / Edit Form */}

            {showForm && (

                <div className="form-container">

                    <h2>
                        {editingStudent
                            ? "Edit Student"
                            : "Add Student"}
                    </h2>


                    <form onSubmit={handleSubmit}>

                        <label>Name</label>

                        <input
                            type="text"
                            name="name"
                            placeholder="Enter student name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />


                        <label>Department</label>

                        <input
                            type="text"
                            name="department"
                            placeholder="e.g. IT"
                            value={formData.department}
                            onChange={handleChange}
                            required
                        />


                        <label>CGPA</label>

                        <input
                            type="number"
                            step="0.01"
                            name="cgpa"
                            placeholder="e.g. 8.7"
                            value={formData.cgpa}
                            onChange={handleChange}
                            required
                        />


                        <button
                            type="submit"
                            className="submit-button"
                        >
                            {editingStudent
                                ? "Update Student"
                                : "Add Student"}
                        </button>

                    </form>

                </div>
            )}


            {/* Student Cards */}

            <div className="student-list">

                {students.length === 0 ? (

                    <p>No students found.</p>

                ) : (

                    students.map((student) => (

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


                            <div className="card-actions">

                                <button
                                    className="edit-button"
                                    onClick={() =>
                                        handleEdit(student)
                                    }
                                >
                                    ✏️ Edit
                                </button>


                                <button
                                    className="delete-button"
                                    onClick={() =>
                                        handleDelete(
                                            student.student_id
                                        )
                                    }
                                >
                                    🗑️ Delete
                                </button>

                            </div>

                        </div>

                    ))

                )}

            </div>

        </>
    );
}

export default Students;