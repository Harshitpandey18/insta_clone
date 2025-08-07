import React, { useEffect, createContext, useReducer, useContext, useState } from 'react';
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom';

import NavBar from './components/Navbar';
import './App.css';

import Home from './components/screens/Home';
import Signin from './components/screens/Signin';
import Profile from './components/screens/Profile';
import Signup from './components/screens/Signup';
import CreatePost from './components/screens/CreatePost';
import UserProfile from './components/screens/UserProfile';
import SubscribedUserPosts from './components/screens/SubscribedUserPosts';
import Reset from './components/screens/Reset';
import NewPassword from './components/screens/Newpassword';

import { reducer, initialState } from './reducers/userReducer';

// Global context for user state
export const UserContext = createContext();

// Routing component handles all routing + auth
const Routing = ({ onReady }) => {
  const navigate = useNavigate();
  const { dispatch } = useContext(UserContext);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    try {
      const user = JSON.parse(userData);
      if (user) {
        dispatch({ type: 'USER', payload: user });
      } else {
        const allowedPaths = ['/signin', '/signup', '/reset'];
        const currentPath = window.location.pathname;
        const isAllowed = allowedPaths.some(path => currentPath.startsWith(path));
        if (!isAllowed) {
          navigate('/signin');
        }
      }
    } catch (err) {
      console.error('Invalid user data in localStorage', err);
      navigate('/signin');
    } finally {
      onReady(true); // Notify App that routing check is done
    }
  }, [dispatch, navigate, onReady]);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signin" element={<Signin />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/create" element={<CreatePost />} />
      <Route path="/profile/:userid" element={<UserProfile />} />
      <Route path="/myfollowingpost" element={<SubscribedUserPosts />} />
      <Route path="/reset" element={<Reset />} />
      <Route path="/reset/:token" element={<NewPassword />} />
    </Routes>
  );
};

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [routingReady, setRoutingReady] = useState(false);

  return (
    <UserContext.Provider value={{ state, dispatch }}>
      <BrowserRouter>
        {routingReady && <NavBar />}
        <Routing onReady={setRoutingReady} />
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
