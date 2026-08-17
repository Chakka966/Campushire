import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import "./App.css";

function EligibleStudents() {

    const { id } = useParams();

    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        axios
            .get(
                `https://campushire-production-8aad.up.railway.app/api/drives/${id}/eligible-students`
            )
            .then((response) => {

                console.log("Eligible students:", response.data);

                setStudents(response.data);
                setLoading(false);

            })
            .catch((error) => {

                console.error(
                    "Error fetching eligible students:",
                    error
                );

                setLoading(false);

            });

    }, [id]);


    if (loading) {
        return <h2>Loading eligible students...</h2>;
    }


    return (
        <>

            <div className="page-header">

                <h1>
                    Eligible Students
                </h1>

                <Link
                    to="/drives"
                    className="add-button"
                >
                    ← Back to Drives
                </Link>

            </div>


            {students.length === 0 ? (

                <div className="form-container">

                    <h2>
                        No Eligible Students
                    </h2>

                    <p>
                        No students meet the eligibility criteria
                        for this drive.
                    </p>

                </div>

            ) : (

                <div className="student-list">

                    {students.map((student) => (

                        <div
                            className="student-card"
                            key={student.student_id}
                        >

                            <h3>
                                {student.name}
                            </h3>

                            <p>
                                <strong>
                                    Student ID:
                                </strong>{" "}
                                {student.student_id}
                            </p>

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

                    ))}

                </div>

            )}

        </>
    );
}

export default EligibleStudents;