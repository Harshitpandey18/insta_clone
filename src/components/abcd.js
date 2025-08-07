import React, { useContext, useRef, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../App';
import M from 'materialize-css';
import '../App.css';

const NavBar = () => {
  const searchModal = useRef(null);
  const [search, setSearch] = useState('');
  const [userDetails, setUserDetails] = useState([]);
  const { state, dispatch } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    M.Modal.init(searchModal.current);
    M.Tooltip.init(document.querySelectorAll('.tooltipped'));
  }, []);

  const fetchUsers = (query) => {
    setSearch(query);
    fetch('/search-users', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
    })
      .then(res => res.json())
      .then(results => setUserDetails(results.user || []));
  };

  const renderList = () => {
    if (state) {
      return (
        <>
          <li><i data-target="modal1" className="material-icons modal-trigger tooltipped nav-icon" data-tooltip="Search">search</i></li>
          <li><Link to="/" className="tooltipped" data-tooltip="Home"><i className="material-icons nav-icon">home</i></Link></li>
          <li><Link to="/create" className="tooltipped" data-tooltip="Add Post"><i className="material-icons nav-icon">add_circle_outline</i></Link></li>
          <li><Link to="/myfollowingpost" className="tooltipped" data-tooltip="Explore"><i className="material-icons nav-icon">explore</i></Link></li>
          <li><Link to="/profile" className="tooltipped" data-tooltip="Profile"><i className="material-icons nav-icon">account_circle</i></Link></li>
          <li><div onClick={() => {
            localStorage.clear();
            dispatch({ type: 'CLEAR' });
            navigate('/signin');
          }} className="tooltipped" data-tooltip="Logout" style={{ cursor: 'pointer' }}>
            <i className="material-icons nav-icon">exit_to_app</i>
          </div></li>
        </>
      );
    } else {
      return (
        <>
          <li><Link to="/signin">Signin</Link></li>
          <li><Link to="/signup">Signup</Link></li>
        </>
      );
    }
  };

  return (
    <>
      <nav className="navbar-container">
        <div className="navbar-inner">
          <Link to={state ? '/' : '/signin'} className="brand-logo">Instagram</Link>
          <ul className="nav-icons">
            {renderList()}
          </ul>
        </div>
      </nav>

      {/* Search Modal */}
      {state && (
        <div id="modal1" className="modal" ref={searchModal}>
          <div className="modal-content">
            <input type="text" placeholder="Search users" value={search} onChange={(e) => fetchUsers(e.target.value)} />
            <ul className="collection">
              {userDetails.map(user => {
                const profileLink = user._id === state._id ? '/profile' : `/profile/${user._id}`;
                return (
                  <Link to={profileLink} key={user._id} onClick={() => {
                    M.Modal.getInstance(searchModal.current).close();
                    setSearch('');
                  }}>
                    <li className="collection-item">{user.email}</li>
                  </Link>
                );
              })}
            </ul>
          </div>
        </div>
      )}
    </>
  );
};

export default NavBar;