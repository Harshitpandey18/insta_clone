import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../../App';
import M from 'materialize-css';

const SignIn = () => {
  const { dispatch } = useContext(UserContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const PostData = () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return M.toast({ html: "Invalid email", classes: "#c62828 red darken-3" });
    }

    setLoading(true);
    fetch("/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    })
      .then(async res => {
        setLoading(false);

        const contentType = res.headers.get("content-type");

        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(errorText || "Login failed");
        }

        if (contentType && contentType.includes("application/json")) {
          return res.json();
        } else {
          throw new Error("Unexpected response format (not JSON)");
        }
      })
      .then(data => {
        if (data.error) {
          M.toast({ html: data.error, classes: "#c62828 red darken-3" });
        } else {
          localStorage.setItem("jwt", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          dispatch({ type: "USER", payload: data.user });
          M.toast({ html: "Signed in successfully", classes: "#43a047 green darken-1" });
          navigate("/");
        }
      })
      .catch(err => {
        console.error("Login error:", err.message);
        M.toast({ html: err.message || "Something went wrong!", classes: "#c62828 red darken-3" });
      });
  };

  return (
    <div className="mycard">
      <div className="card auth-card input-field">
        <h2>Instagram</h2>
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="btn waves-effect waves-light #64b5f6 blue darken-1"
          onClick={PostData}
          disabled={loading}
        >
          {loading ? "Signing In..." : "Sign In"}
        </button>
        <h5>
          <Link to="/signup">Don't have an account?</Link>
        </h5>
        <p style={{ textAlign: 'center' }}>
          <Link to="/reset">Forgot your password?</Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
