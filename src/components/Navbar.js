import React, { useContext, useRef, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../App';
import M from 'materialize-css';

const NavBar = () => {
  const searchModal = useRef(null);
  const [search, setSearch] = useState('');
  const [userDetails, setUserDetails] = useState([]);
  const { state, dispatch } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    M.Modal.init(searchModal.current);

    // Initialize tooltips
    const tooltipElems = document.querySelectorAll('.tooltipped');
    M.Tooltip.init(tooltipElems);
  }, []);

  const fetchUsers = (query) => {
    setSearch(query);
    fetch('/search-users', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    })
      .then(res => res.json())
      .then(results => setUserDetails(results.user || []))
      .catch(err => {
        console.error('Error fetching users:', err);
        setUserDetails([]);
      });
  };

  const renderList = () => {
    if (state) {
      return [
        <li key="1">
          <i
            data-target="modal1"
            className="large material-icons modal-trigger tooltipped"
            data-position="bottom"
            data-tooltip="Search"
            style={{ color: 'black' }}
          >
            search
          </i>
        </li>,
        <li key="2">
          <Link to="/" className="tooltipped" data-position="bottom" data-tooltip="Home">
            <i className="material-icons black-text">home</i>
          </Link>
        </li>,
        <li key="3">
          <Link to="/create" className="tooltipped" data-position="bottom" data-tooltip="Create Post">
            <i className="large material-icons black-text">add_circle_outline</i>
          </Link>
        </li>,
        <li key="4">
          <Link to="/myfollowingpost" className="tooltipped" data-position="bottom" data-tooltip="Following">
            <i className="material-icons black-text">explore</i>
          </Link>
        </li>,
        <li key="5">
          <Link to="/profile" className="tooltipped" data-position="bottom" data-tooltip="My Profile">
            <i className="material-icons black-text">account_circle</i>
          </Link>
        </li>,
        <li key="6">
          <div
            onClick={() => {
              localStorage.clear();
              dispatch({ type: 'CLEAR' });
              navigate('/signin');
              setUserDetails([]);
            }}
            className="tooltipped"
            data-position="bottom"
            data-tooltip="Sign Out"
            style={{ cursor: 'pointer' }}
          >
            <i className="material-icons black-text">exit_to_app</i>
          </div>
        </li>,
      ];
    } else {
      return [
        <li key="7"><Link to="/signin">Signin</Link></li>,
        <li key="8"><Link to="/signup">Signup</Link></li>
      ];
    }
  };

  return (
    <nav>
      <div className="nav-wrapper white">
        <Link to={state ? '/' : '/signin'} className="brand-logo left" style={{ fontFamily: 'Grand Hotel, cursive' }}>
          Instagram
        </Link>
        <ul id="nav-mobile" className="right">
          {renderList()}
        </ul>
      </div>

      {state && (
        <div id="modal1" className="modal" ref={searchModal} style={{ color: 'black' }}>
          <div className="modal-content">
            <input
              type="text"
              placeholder="Search users"
              value={search}
              onChange={(e) => fetchUsers(e.target.value)}
            />
            <ul className="collection">
              {Array.isArray(userDetails) && userDetails.map(item => {
                const profileLink = item._id === state._id ? `/profile` : `/profile/${item._id}`;
                return (
                  <Link
                    to={profileLink}
                    key={item._id}
                    onClick={() => {
                      M.Modal.getInstance(searchModal.current).close();
                      setSearch('');
                    }}
                  >
                    <li className="collection-item avatar">
                      <img
                        src={item.pic}
                        alt={item.email}
                        onError={(e) => { e.target.src = 'https://placehold.co/160x160?text=User'; }}
                        className="circle"
                      />
                      <span className="title">{item.email}</span>
                    </li>
                  </Link>
                );
              })}
            </ul>
          </div>
          <div className="modal-footer">
            <button
              className="modal-close waves-effect waves-green btn-flat"
              onClick={() => setSearch('')}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;