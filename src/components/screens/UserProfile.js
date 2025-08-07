import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { UserContext } from '../../App';

const UserProfile = () => {
  const [userProfile, setUserProfile] = useState(null);
  const { state, dispatch } = useContext(UserContext);
  const { userid } = useParams();
  const [showFollow, setShowFollow] = useState(true);

  // Update showFollow when state or userid changes
  useEffect(() => {
    if (state && state.following) {
      setShowFollow(!state.following.includes(userid));
    }
  }, [state, userid]);

  // Fetch user profile
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await fetch(`/user/${userid}`, {
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('jwt'),
          },
        });
        const data = await res.json();
        setUserProfile(data);
      } catch (error) {
        console.error('Error loading profile:', error);
      }
    };

    fetchUserProfile();
  }, [userid]);

  const followUser = async () => {
    try {
      const res = await fetch('/follow', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('jwt'),
        },
        body: JSON.stringify({ followId: userid }),
      });
      const data = await res.json();

      dispatch({
        type: 'UPDATE',
        payload: { following: data.following, followers: data.followers },
      });
      localStorage.setItem('user', JSON.stringify(data));

      setUserProfile(prev => ({
        ...prev,
        user: {
          ...prev.user,
          followers: [...prev.user.followers, data._id],
        },
      }));
      setShowFollow(false);
    } catch (error) {
      console.error('Follow error:', error);
    }
  };

  const unfollowUser = async () => {
    try {
      const res = await fetch('/unfollow', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('jwt'),
        },
        body: JSON.stringify({ unfollowId: userid }),
      });
      const data = await res.json();

      dispatch({
        type: 'UPDATE',
        payload: { following: data.following, followers: data.followers },
      });
      localStorage.setItem('user', JSON.stringify(data));

      setUserProfile(prev => ({
        ...prev,
        user: {
          ...prev.user,
          followers: prev.user.followers.filter(id => id !== data._id),
        },
      }));
      setShowFollow(true);
    } catch (error) {
      console.error('Unfollow error:', error);
    }
  };

  if (!userProfile) {
    return <h2 style={{ textAlign: 'center', marginTop: '50px' }}>Loading...</h2>;
  }

  return (
    <div style={{ maxWidth: '550px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-around', margin: '18px 0', borderBottom: '1px solid grey' }}>
        <div>
          <img
            style={{ width: '160px', height: '160px', borderRadius: '80px' }}
            src={userProfile.user.pic}
            alt="profile"
          />
        </div>
        <div>
          <h5 style={{ fontWeight: '500' }}>{userProfile.user.email}</h5>
          <div style={{ display: 'flex', justifyContent: 'space-evenly', width: '100%' }}>
            <h6>{userProfile.posts.length} posts</h6>
            <h6>{userProfile.user.followers.length} followers</h6>
            <h6>{userProfile.user.following.length} following</h6>
          </div>
          <h6 style={{ fontWeight: '500' }}>{userProfile.user.name}</h6>
          <p className="bio">{userProfile.user.bio}</p>
          {userid !== state?._id && (
            showFollow ? (
              <button
                style={{ margin: '10px' }}
                className="btn waves-effect waves-light #64b5f6 blue darken-1"
                onClick={followUser}
              >
                Follow
              </button>
            ) : (
              <button
                style={{ margin: '10px' }}
                className="btn waves-effect waves-light #64b5f6 blue darken-1"
                onClick={unfollowUser}
              >
                Unfollow
              </button>
            )
          )}
        </div>
      </div>

      <div className="gallery">
        {userProfile.posts.map(post => (
          <img key={post._id} className="item" src={post.photo} alt={post.title} />
        ))}
      </div>
    </div>
  );
};

export default UserProfile;
