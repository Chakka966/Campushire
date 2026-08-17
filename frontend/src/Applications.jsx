import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function Applications() {
  const [applications, setApplications] = useState([]);
  const [students, setStudents] = useState([]);
  const [drives, setDrives] = useState([]);

  const [showForm, setShowForm] = useState(false);
  const user = JSON.parse(
    localStorage.getItem("user")
);
  const [formData, setFormData] = useState({
    student_id: "",
    drive_id: ""
  });

  // Fetch applications
  const fetchApplications = () => {

    const token = localStorage.getItem("token");

    axios
        .get("https://campushire-production-8aad.up.railway.app /api/applications", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then((response) => {

            setApplications(response.data);

        })
        .catch((error) => {

            console.error(
                "Error fetching applications:",
                error
            );

        });
};

  // Fetch students
  const fetchStudents = () => {
    axios
      .get("https://campushire-production-8aad.up.railway.app /api/students")
      .then((response) => {
        setStudents(response.data);
      })
      .catch((error) => {
        console.error("Error fetching students:", error);
      });
  };

  // Fetch job drives
  const fetchDrives = () => {
    axios
      .get("https://campushire-production-8aad.up.railway.app /api/drives")
      .then((response) => {
        setDrives(response.data);
      })
      .catch((error) => {
        console.error("Error fetching drives:", error);
      });
  };

  useEffect(() => {
    fetchApplications();
    fetchStudents();
    fetchDrives();
  }, []);

  // Handle input
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Submit application
  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post("https://campushire-production-8aad.up.railway.app /api/applications", {
        student_id: formData.student_id,
        drive_id: formData.drive_id
      })
      .then(() => {
        alert("Application submitted successfully!");

        setFormData({
          student_id: "",
          drive_id: ""
        });

        setShowForm(false);

        fetchApplications();
      })
      .catch((error) => {
        console.error("Error submitting application:", error);

        alert(
          "Failed to submit application: " +
            (error.response?.data?.error || "Unknown error")
        );
      });
  };

  // Update application status
 const updateStatus = (applicationId, status) => {

    console.log("Updating application:", applicationId);
    console.log("New status:", status);

    axios
        .put(
            `https://campushire-production-8aad.up.railway.app /api/applications/${applicationId}/status`,
            {
                status: status
            }
        )
        .then((response) => {

            console.log("Status updated:", response.data);

            alert("Status updated successfully!");

            fetchApplications();

        })
        .catch((error) => {

            console.error("STATUS UPDATE ERROR:", error);

            console.error(
                "Backend response:",
                error.response?.data
            );

            alert(
                "Failed to update status: " +
                (
                    error.response?.data?.error ||
                    error.response?.data?.message ||
                    error.message
                )
            );
        });
};

  return (
    <>
      <div className="page-header">
        <h1>Applications</h1>

        {user?.role === "admin" && (
    <button
        className="add-button"
        onClick={() => setShowForm(!showForm)}
    >
        {showForm ? "✖ Close" : "+ Add Application"}
    </button>
)}
      </div>

      {/* Add Application Form */}

      {showForm && (
        <div className="form-container">

          <h2>Submit Application</h2>

          <form onSubmit={handleSubmit}>

            <label>Student</label>

            <select
              name="student_id"
              value={formData.student_id}
              onChange={handleChange}
              required
            >
              <option value="">
                Select Student
              </option>

              {students.map((student) => (
                <option
                  key={student.student_id}
                  value={student.student_id}
                >
                  {student.name}
                </option>
              ))}
            </select>

            <label>Job Drive</label>

            <select
              name="drive_id"
              value={formData.drive_id}
              onChange={handleChange}
              required
            >
              <option value="">
                Select Job Drive
              </option>

              {drives.map((drive) => (
                <option
                  key={drive.drive_id}
                  value={drive.drive_id}
                >
                  {drive.company_name} - {drive.role}
                </option>
              ))}
            </select>

            <button
              type="submit"
              className="submit-button"
            >
              Submit Application
            </button>

          </form>
        </div>
      )}

      {/* Applications */}

      <div className="student-list">

        {applications.map((application) => (
          <div
            className="student-card"
            key={application.application_id}
          >

            <h3>
              {application.student_name}
            </h3>

            <p>
              <strong>Company:</strong>{" "}
              {application.company_name}
            </p>

            <p>
              <strong>Role:</strong>{" "}
              {application.role}
            </p>

            <p>
              <strong>Package:</strong>{" "}
              {application.package_lpa} LPA
            </p>

            <p>
              <strong>Status:</strong>{" "}
              {application.status}
            </p>

            {user?.role === "admin" && (
    <select
        value={application.status}
        onChange={(e) =>
            updateStatus(
                application.application_id,
                e.target.value
            )
        }
    >
        <option value="Applied">
            Applied
        </option>

        <option value="Shortlisted">
            Shortlisted
        </option>

        <option value="Selected">
            Selected
        </option>

        <option value="Rejected">
            Rejected
        </option>
    </select>
)}

</div>

        ))
    }

</div>

</>
);
}

export default Applications;