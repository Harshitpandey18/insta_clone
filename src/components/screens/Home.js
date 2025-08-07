import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../App';
import { Link } from 'react-router-dom';

const Home = () => {
    const [data, setData] = useState([]);
    const { state } = useContext(UserContext);

    useEffect(() => {
        fetch('/allpost', {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        })
            .then(res => res.json())
            .then(result => {
                setData(result.posts);
            });
    }, []);

    const likePost = (id) => {
        fetch('/like', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({ postId: id })
        })
            .then(res => res.json())
            .then(result => {
                const newData = data.map(item => item._id === result._id ? result : item);
                setData(newData);
            });
    };

    const unlikePost = (id) => {
        fetch('/unlike', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({ postId: id })
        })
            .then(res => res.json())
            .then(result => {
                const newData = data.map(item => item._id === result._id ? result : item);
                setData(newData);
            });
    };

    const makeComment = (text, postId) => {
        fetch('/comment', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({ postId, text })
        })
            .then(res => res.json())
            .then(result => {
                const newData = data.map(item => item._id === result._id ? result : item);
                setData(newData);
            });
    };

    const deletePost = (postid) => {
        fetch(`/deletepost/${postid}`, {
            method: "delete",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        })
            .then(res => res.json())
            .then(result => {
                if (result.error) {
                    console.error("Delete error:", result.error);
                    return;
                }
                const newData = data.filter(item => item._id !== result._id);
                setData(newData);
            })
            .catch(err => console.log("Delete fetch failed:", err));
    };

    return (
        <div className="home">
            {data.length > 0 ? (
                data.map(item => {
                    const isMyPost = state?._id === item.postedBy._id;
                    const hasLiked = state && item.likes.includes(state._id);

                    return (
                        <div className="card home-card" key={item._id}>
                            <h5 className="post-username" style={{ padding: "15px 15px" }}>
                                <Link to={`/profile/${item.postedBy._id}`}>
                                    {item.postedBy.name}
                                </Link>
                                {isMyPost &&
                                    <i
                                        className="material-icons"
                                        style={{ float: "right", paddingRight: "15px", cursor: "pointer" }}
                                        onClick={() => deletePost(item._id)}
                                    >
                                        delete
                                    </i>
                                }
                            </h5>
                            <div className="card-image">
                                <img src={item.photo} alt="card-pic" />
                            </div>
                            <div className="card-content">
                                {hasLiked ? (
                                    <i
                                        className="material-icons"
                                        style={{ color: "red", cursor: "pointer" }}
                                        onClick={() => unlikePost(item._id)}
                                    >
                                        favorite
                                    </i>
                                ) : (
                                    <i
                                        className="material-icons"
                                        style={{ cursor: "pointer" }}
                                        onClick={() => likePost(item._id)}
                                    >
                                        favorite_border
                                    </i>
                                )}
                                &nbsp;&nbsp;
                                <i
                                    className="material-icons"
                                    style={{ cursor: "pointer" }}
                                    onClick={() => {
                                        const cid = "comment" + item._id;
                                        const commentBox = document.getElementById(cid);
                                        if (commentBox) {
                                            commentBox.style.display = commentBox.style.display === "block" ? "none" : "block";
                                        }
                                    }}
                                >
                                    comment
                                </i>

                                <h6>{item.likes.length} likes, {item.comments.length} Comments</h6>
                                <p><span style={{ fontWeight: "500" }}>{item.postedBy.name}</span> {item.body}</p>

                                <div id={"comment" + item._id} style={{ display: "none" }}>
                                    {item.comments.map(record => (
                                        <h6 key={record._id}>
                                            <span style={{ fontWeight: "500" }}>{record.postedBy.name}</span> {record.text}
                                        </h6>
                                    ))}
                                </div>

                                <hr />
                                <form
                                    className="comment"
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        if (!state) return alert("You must be logged in to comment.");
                                        makeComment(e.target[0].value, item._id);
                                        e.target[0].value = "";
                                    }}
                                >
                                    <input type="text" placeholder="Add a comment..." />
                                </form>
                            </div>
                        </div>
                    );
                })
            ) : (
                <h2>Loading...</h2>
            )}
        </div>
    );
};

export default Home;
