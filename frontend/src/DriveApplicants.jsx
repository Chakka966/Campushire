import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import "./App.css";

function DriveApplicants() {

    const { drive_id } = useParams();

    const [applicants, setApplicants] = useState([]);

    const fetchApplicants = () => {

        axios
            .get(`http://localhost:5000/api/drives/${drive_id}/applications`)
            .then((response) => {
                setApplicants(response.data);
            })
            .catch((error) => {
                console.error("Error fetching applicants:", error);
            });

    };

    useEffect(() => {
        fetchApplicants();
    }, [drive_id]);


    // Update application status
    const updateStatus = (applicationId, status) => {

        axios
            .put(
                `http://localhost:5000/api/applications/${applicationId}/status`,
                { status: status }
            )
            .then(() => {

                // Refresh applicants
                fetchApplicants();

            })
            .catch((error) => {
                console.error("Error updating status:", error);
            });

    };


    return (

        <div>

            <h1>Applicants</h1>

            <Link to="/drives">
                ← Back to Job Drives
            </Link>


            {applicants.length === 0 ? (

                <p>No students have applied for this drive yet.</p>

            ) : (

                <div className="student-list">

                    {applicants.map((student) => (

                        <div
                            className="student-card"
                            key={student.application_id}
                        >

                            <h3>
                                {student.name}
                            </h3>

                            <p>
                                <strong>Department:</strong>{" "}
                                {student.department}
                            </p>

                            <p>
                                <strong>CGPA:</strong>{" "}
                                {student.cgpa}
                            </p>


                            <p>
                                <strong>Status:</strong>
                            </p>

                            <select
                                value={student.status}
                                onChange={(e) =>
                                    updateStatus(
                                        student.application_id,
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

                        </div>

                    ))}

                </div>

            )}

        </div>
    );
}

export default DriveApplicants;