import "./LoginForm.css";
import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../App/App";

export default function LoginForm() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const { setUser, setErrorMessage } = useContext(UserContext);

    const navigate = useNavigate();

    async function handleLogin(event) {
        event.preventDefault();

        try {
            const userData = {
                username,
                password
            };

            const response = await axios.post(
                "http://localhost:3000/users/login",
                userData,
                { withCredentials: true, validateStatus: () => true }
            );

            if (response.status === 200) {
                const user = response.data?.user;

                setUser(user);

                navigate("/");
            }

            if (response.status === 401) {
                setErrorMessage(response.data.error);
            }
        } catch (error) {
            setErrorMessage(`${error.message}: Please try again later.`);
        }
    }

    return (
        <div className="login-form-container">
            <form className="login-form" onSubmit={handleLogin}>
                <h2>Log In</h2>
                <div className="form-group">
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(event) => setUsername(event.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        required
                    />
                </div>
                <button type="submit">Login</button>
                <p className="sign-up-redirect">
                    New to Stock Zone?{" "}
                    <Link to="/signup" className="link">
                        Sign Up
                    </Link>
                </p>
            </form>
        </div>
    );
}
