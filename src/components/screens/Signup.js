import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import M from 'materialize-css';

const Signup = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [image, setImage] = useState("");
  const [url, setUrl] = useState(undefined);

  // Upload text fields to backend
  const uploadFields = useCallback(() => {
    if (!/^[\w.%+-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      M.toast({ html: "Invalid email", classes: "red darken-3" });
      return;
    }

    fetch("/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name,
        password,
        email,
        bio,
        pic: url
      })
    })
      .then(async res => {
        const text = await res.text();
        try {
          const data = text ? JSON.parse(text) : {};
          if (data.error) {
            M.toast({ html: data.error, classes: "red darken-3" });
          } else {
            M.toast({ html: data.message || "Signed up successfully", classes: "green darken-1" });
            navigate('/signin');
          }
        } catch (err) {
          console.error("Invalid JSON from server:", text);
          M.toast({ html: "Unexpected server response", classes: "red darken-3" });
        }
      })
      .catch(err => {
        console.error("Signup error:", err);
        M.toast({ html: "Network or server error", classes: "red darken-3" });
      });
  }, [name, password, email, bio, url, navigate]);

  // Handle Cloudinary upload response
  useEffect(() => {
    if (url) {
      uploadFields();
    }
  }, [url, uploadFields]);

  const uploadPic = () => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "insta-clone");
    data.append("cloud_name", "dibxatfaj");

    fetch("https://api.cloudinary.com/v1_1/dibxatfaj/image/upload", {
      method: "POST",
      body: data
    })
      .then(res => res.json())
      .then(data => setUrl(data.url))
      .catch(err => console.error("Image upload error:", err));
  };

  const PostData = () => {
    if (image) {
      uploadPic();
    } else {
      uploadFields();
    }
  };

  return (
    <div className="mycard">
      <div className="card auth-card input-field">
        <h2>My Insta</h2>

        <label htmlFor="name">Name</label>
        <input
          id="name"
          name="name"
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <label htmlFor="bio">Bio</label>
        <input
          id="bio"
          name="bio"
          type="text"
          placeholder="Enter a short bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />

        <div className="file-field input-field">
          <div className="btn blue darken-1">
            <span>Upload Pic</span>
            <input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
            />
          </div>
          <div className="file-path-wrapper">
            <input className="file-path validate" type="text" placeholder="Upload profile image (optional)" />
          </div>
        </div>

        <button
          className="btn waves-effect waves-light blue darken-1"
          onClick={PostData}
        >
          Sign Up
        </button>

        <h5>
          <Link to="/signin">Already have an account?</Link>
        </h5>
      </div>
    </div>
  );
};

export default Signup;
