import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import M from 'materialize-css';

const NewPassword = () => {
  const navigate = useNavigate(); // useNavigate instead of useHistory
  const [password, setPassword] = useState('');
  const { token } = useParams();

  const handleReset = () => {
    fetch('/new-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        password,
        token,
      }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          M.toast({ html: data.error, classes: '#c62828 red darken-3' });
        } else {
          M.toast({ html: data.message, classes: '#43a047 green darken-1' });
          navigate('/signin'); // <-- useNavigate here
        }
      })
      .catch(err => {
        console.error(err);
        M.toast({ html: 'Something went wrong', classes: '#c62828 red darken-3' });
      });
  };

  return (
    <div className="mycard">
      <div className="card auth-card input-field">
        <h2>Reset Password</h2>
        <input
          type="password"
          placeholder="Enter new password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button
          className="btn waves-effect waves-light #64b5f6 blue lighten-2"
          onClick={handleReset}
        >
          Update Password
        </button>
      </div>
    </div>
  );
};

export default NewPassword;
