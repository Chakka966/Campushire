import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login({ setUser }) {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const handleLogin = async (e) => {

        e.preventDefault();

        try {

            const response = await axios.post(
                "http://localhost:5000/api/login",
                {
                    username,
                    password
                }
            );

            // Store token
            localStorage.setItem(
                "token",
                response.data.token
            );

            // Store user information
            localStorage.setItem(
                "user",
                JSON.stringify(response.data.user)
            );
            setUser(response.data.user);
            alert("Login successful!");

            navigate("/dashboard");

        } catch (error) {

            console.error("Login error:", error);

            alert(
                error.response?.data?.error ||
                "Invalid username or password"
            );
        }
    };

    return (
        <div className="login-page">

            <div className="login-box">

                <h1>CampusHire</h1>

                <h2>Login</h2>

                <form onSubmit={handleLogin}>

                    <label>Username</label>

                    <input
                        type="text"
                        value={username}
                        onChange={(e) =>
                            setUsername(e.target.value)
                        }
                        placeholder="Enter username"
                        required
                    />

                    <label>Password</label>

                    <input
                        type="password"
                        value={password}
                        onChange={(e) =>
                            setPassword(e.target.value)
                        }
                        placeholder="Enter password"
                        required
                    />

                    <button
                        type="submit"
                        className="submit-button"
                    >
                        Login
                    </button>

                </form>

            </div>

        </div>
    );
}

export default Login;