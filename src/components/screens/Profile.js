import React, { useEffect, useState, useContext, useCallback, useMemo } from 'react';
import { UserContext } from '../../App';

const Profile = () => {
  const userContext = useContext(UserContext);

  // ✅ Memoize to avoid changing refs on every render
  const state = useMemo(() => userContext?.state || {}, [userContext?.state]);
  const dispatch = useMemo(() => userContext?.dispatch || (() => {}), [userContext?.dispatch]);

  const [mypics, setPics] = useState([]);
  const [image, setImage] = useState("");

  const fetchMyPosts = useCallback(() => {
    fetch('/mypost', {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('jwt'),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setPics(result.mypost || []);
      })
      .catch((err) => console.error('Fetch posts error:', err));
  }, []);

  useEffect(() => {
    fetchMyPosts();
  }, [fetchMyPosts]);

  const uploadImage = useCallback(async () => {
    const data = new FormData();
    data.append('file', image);
    data.append('upload_preset', 'insta-clone');
    data.append('cloud_name', 'dibxatfaj');

    try {
      const res = await fetch(
        'https://api.cloudinary.com/v1_1/dibxatfaj/image/upload',
        {
          method: 'POST',
          body: data,
        }
      );
      const uploaded = await res.json();

      const updateRes = await fetch('/updatepic', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('jwt'),
        },
        body: JSON.stringify({
          pic: uploaded.url,
        }),
      });

      const result = await updateRes.json();

      localStorage.setItem(
        'user',
        JSON.stringify({ ...state, pic: result.pic })
      );
      dispatch({ type: 'UPDATEPIC', payload: result.pic });
    } catch (err) {
      console.error('Upload error:', err);
    }
  }, [image, dispatch, state]);

  useEffect(() => {
    if (image) {
      uploadImage();
    }
  }, [image, uploadImage]);

  const updatePhoto = (file) => {
    setImage(file);
  };

  if (!state || !state.email) {
    return <div style={{ textAlign: "center", marginTop: "50px" }}>Loading Profile...</div>;
  }

  return (
    <div style={{ maxWidth: '550px', margin: '0px auto' }}>
      <div style={{ margin: '18px 0px', borderBottom: '1px solid grey' }}>
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          <div>
            <img
              style={{ width: '160px', height: '160px', borderRadius: '80px' }}
              src={state?.pic || 'https://via.placeholder.com/160'}
              alt="profile"
            />
          </div>
          <div>
            <h4>{state?.email || 'Loading'}</h4>
            <div style={{ display: 'flex', justifyContent: 'space-evenly', width: '108%' }}>
              <h6>{mypics.length} posts</h6>
              <h6>{state?.followers?.length || 0} followers</h6>
              <h6>{state?.following?.length || 0} following</h6>
            </div>
            <h6 style={{ fontWeight: '500' }}>{state?.name || 'Loading'}</h6>
            <h6>{state?.bio || ''}</h6>
          </div>
        </div>
      </div>

      <div className="file-field input-field" style={{ margin: '10px' }}>
        <div className="btn #64b5f6 blue darken-1">
          <span>Update pic</span>
          <input type="file" onChange={(e) => updatePhoto(e.target.files[0])} />
        </div>
        <div className="file-path-wrapper">
          <input className="file-path validate" type="text" />
        </div>
      </div>

      <div className="gallery">
        {mypics.map((item) => (
          <img key={item._id} className="item" src={item.photo} alt={item.title} />
        ))}
      </div>
    </div>
  );
};

export default Profile;
