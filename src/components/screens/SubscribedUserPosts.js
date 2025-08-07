import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../App';
import { Link } from 'react-router-dom';

const SubscribedUserPosts = () => {
  const [data, setData] = useState([]);
  const { state } = useContext(UserContext);

  useEffect(() => {
    fetch('/getsubpost', {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('jwt'),
      },
    })
      .then(res => res.json())
      .then(result => {
        setData(result.posts);
      })
      .catch(err => console.log(err));
  }, []);

  const likePost = (id) => {
    fetch('/like', {
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('jwt'),
      },
      body: JSON.stringify({ postId: id }),
    })
      .then(res => res.json())
      .then(result => {
        const newData = data.map(post => post._id === result._id ? result : post);
        setData(newData);
      });
  };

  const unlikePost = (id) => {
    fetch('/unlike', {
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('jwt'),
      },
      body: JSON.stringify({ postId: id }),
    })
      .then(res => res.json())
      .then(result => {
        const newData = data.map(post => post._id === result._id ? result : post);
        setData(newData);
      });
  };

  const makeComment = (text, postId) => {
    fetch('/comment', {
      method: 'put',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('jwt'),
      },
      body: JSON.stringify({ postId, text }),
    })
      .then(res => res.json())
      .then(result => {
        const newData = data.map(post => post._id === result._id ? result : post);
        setData(newData);
      });
  };

  return (
    <div className="home">
      {data.length > 0 ? (
        data.map(item => (
          <div className="card home-card" key={item._id}>
            <h5 style={{ padding: '5px' }}>
              <Link
                to={
                  item.postedBy._id !== state?._id
                    ? '/profile/' + item.postedBy._id
                    : '/profile'
                }
              >
                {item.postedBy.name}
              </Link>
            </h5>
            <div className="card-image">
              <img src={item.photo} alt="post" />
            </div>
            <div className="card-content">
              {item.likes.includes(state?._id) ? (
                <i
                  className="material-icons"
                  style={{ color: 'red' }}
                  onClick={() => unlikePost(item._id)}
                >
                  favorite
                </i>
              ) : (
                <i
                  className="material-icons"
                  onClick={() => likePost(item._id)}
                >
                  favorite_border
                </i>
              )}
              <h6>{item.likes.length} likes</h6>
              <h6>{item.title}</h6>
              <p>{item.body}</p>

              {item.comments.map((comment, idx) => (
                <h6 key={idx}>
                  <span style={{ fontWeight: '500' }}>
                    {comment.postedBy.name}
                  </span>{' '}
                  {comment.text}
                </h6>
              ))}

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  makeComment(e.target[0].value, item._id);
                  e.target[0].value = '';
                }}
              >
                <input type="text" placeholder="Add a comment" />
              </form>
            </div>
          </div>
        ))
      ) : (
        <h4 style={{ textAlign: 'center' }}>No posts available</h4>
      )}
    </div>
  );
};

export default SubscribedUserPosts;


