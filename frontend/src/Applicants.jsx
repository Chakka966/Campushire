import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import "./App.css";

function Applicants() {

    const { id } = useParams();

    const [applicants, setApplicants] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        axios
            .get(`https://campushire-production-8aad.up.railway.app /api/drives/${id}/applicants`)
            .then((response) => {
                setApplicants(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching applicants:", error);
                setLoading(false);
            });

    }, [id]);


    if (loading) {
        return <h2>Loading applicants...</h2>;
    }


    return (
        <div>

            <h1>Applicants</h1>

            <Link to="/drives" className="view-button">
                ← Back to Job Drives
            </Link>


            {applicants.length === 0 ? (

                <p>No students have applied for this drive.</p>

            ) : (

                <div className="student-list">

                    {applicants.map((student) => (

                        <div
                            className="student-card"
                            key={student.application_id}
                        >

                            <h3>{student.name}</h3>

                            <p>
                                <strong>Department:</strong>{" "}
                                {student.department}
                            </p>

                            <p>
                                <strong>CGPA:</strong>{" "}
                                {student.cgpa}
                            </p>

                            <p>
                                <strong>Status:</strong>{" "}
                                {student.status}
                            </p>

                        </div>

                    ))}

                </div>

            )}

        </div>
    );
}

export default Applicants;