import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function Companies() {
    const [companies, setCompanies] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingCompany, setEditingCompany] = useState(null);

    const [formData, setFormData] = useState({
        company_name: "",
        package_lpa: ""
    });

    // =========================
    // FETCH COMPANIES
    // =========================

    const fetchCompanies = () => {
        axios
            .get("https://campushire-production-8aad.up.railway.app/api/companies")
            .then((response) => {
    console.log("COMPANIES API RESPONSE:", response.data);
    console.log("IS ARRAY:", Array.isArray(response.data));
    setCompanies(response.data);
})
            .catch((error) => {
                console.error("Error fetching companies:", error);
            });
    };

    useEffect(() => {
        fetchCompanies();
    }, []);

    // =========================
    // HANDLE INPUT
    // =========================

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // =========================
    // ADD / UPDATE COMPANY
    // =========================

    const handleSubmit = (e) => {
        e.preventDefault();

        // UPDATE
        if (editingCompany) {
            axios
                .put(
                    `https://campushire-production-8aad.up.railway.app/api/companies/${editingCompany.company_id}`,
                    formData
                )
                .then(() => {
                    alert("Company updated successfully!");

                    setFormData({
                        company_name: "",
                        package_lpa: ""
                    });

                    setEditingCompany(null);
                    setShowForm(false);

                    fetchCompanies();
                })
                .catch((error) => {
                    console.error(
                        "Error updating company:",
                        error
                    );

                    alert(
                        "Failed to update company: " +
                        (error.response?.data?.error ||
                            "Unknown error")
                    );
                });
        }

        // ADD
        else {
            axios
                .post(
                    "https://campushire-production-8aad.up.railway.app/api/companies",
                    formData
                )
                .then(() => {
                    alert("Company added successfully!");

                    setFormData({
                        company_name: "",
                        package_lpa: ""
                    });

                    setShowForm(false);

                    fetchCompanies();
                })
                .catch((error) => {
                    console.error(
                        "Error adding company:",
                        error
                    );

                    alert(
                        "Failed to add company: " +
                        (error.response?.data?.error ||
                            "Unknown error")
                    );
                });
        }
    };

    // =========================
    // EDIT COMPANY
    // =========================

    const handleEdit = (company) => {
        console.log("EDIT CLICKED:", company);

        setEditingCompany(company);

        setFormData({
            company_name: company.company_name,
            package_lpa: company.package_lpa
        });

        setShowForm(true);
    };

    // =========================
    // DELETE COMPANY
    // =========================

    const handleDelete = (companyId) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this company?"
        );

        if (!confirmDelete) {
            return;
        }

        axios
            .delete(
                `https://campushire-production-8aad.up.railway.app/api/companies/${companyId}`
            )
            .then(() => {
                alert("Company deleted successfully!");

                fetchCompanies();
            })
            .catch((error) => {
                console.error(
                    "Error deleting company:",
                    error
                );

                alert(
                    "Failed to delete company: " +
                    (error.response?.data?.error ||
                        "Unknown error")
                );
            });
    };

    // =========================
    // CLOSE FORM
    // =========================

    const closeForm = () => {
        setShowForm(false);
        setEditingCompany(null);

        setFormData({
            company_name: "",
            package_lpa: ""
        });
    };

    // =========================
    // UI
    // =========================

    return (
        <>
            {/* PAGE HEADER */}

            <div className="page-header">

                <h1>Companies</h1>

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
                    {showForm
                        ? "✖ Close"
                        : "+ Add Company"}
                </button>

            </div>


            {/* ADD / EDIT FORM */}

            {showForm && (

                <div className="form-container">

                    <h2>
                        {editingCompany
                            ? "Edit Company"
                            : "Add Company"}
                    </h2>

                    <form onSubmit={handleSubmit}>

                        <label>
                            Company Name
                        </label>

                        <input
                            type="text"
                            name="company_name"
                            placeholder="e.g. Zoho"
                            value={formData.company_name}
                            onChange={handleChange}
                            required
                        />

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

                        <button
                            type="submit"
                            className="submit-button"
                        >
                            {editingCompany
                                ? "Update Company"
                                : "Add Company"}
                        </button>

                    </form>

                </div>
            )}


            {/* COMPANY LIST */}

            <div className="student-list">

                {companies.length === 0 ? (

                    <p>No companies found.</p>

                ) : (

                    companies.map((company) => (

                        <div
                            className="student-card"
                            key={company.company_id}
                        >

                            <h3>
                                {company.company_name}
                            </h3>

                            <p>
                                <strong>
                                    Package:
                                </strong>{" "}
                                {company.package_lpa} LPA
                            </p>


                            {/* EDIT / DELETE */}

                            <div className="company-actions">

                                <button
                                    type="button"
                                    className="edit-button"
                                    onClick={() =>
                                        handleEdit(company)
                                    }
                                >
                                    ✏️ Edit
                                </button>

                                <button
                                    type="button"
                                    className="delete-button"
                                    onClick={() =>
                                        handleDelete(
                                            company.company_id
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

export default Companies;