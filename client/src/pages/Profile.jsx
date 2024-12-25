import { useSelector, useDispatch } from 'react-redux';
import { useRef, useState, useEffect } from 'react';
import {
   UpdateUserStart, 
   UpdateUserSuccess, 
   UpdateUserFailure,
   deleteUserStart,
   deleteUserSuccess,
   deleteUserFailure,
   signOutUserStart,
   signOutUserFailure,
   signOutUserSuccess
 } from '../redux/user/userSlice';


import axios from 'axios';
import { Link } from 'react-router-dom';

export default function Profile() {
  const fileRef = useRef(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const dispatch = useDispatch();
  const [updateSuccess, setUpdateSuccess] = useState(null);
  const [showListingsError, setShowListingsError] = useState(null);
  const [userListings, setUserListings] = useState([]);

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = async (file) => {
    const formDataObject = new FormData();
    formDataObject.append('file', file);
    formDataObject.append('upload_preset', "mern_estate");
    formDataObject.append('cloud_name', 'diievnipd');

    try {
      const res = await axios.post("https://api.cloudinary.com/v1_1/diievnipd/image/upload", 
        formDataObject,
        {
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(progressEvent.loaded * 100 / progressEvent.total);
            setFilePerc(progress);
          }
        }
      );
      setFormData({ ...formData, avatar: res.data.secure_url });
      setFileUploadError(false);
    } catch (error) {
      setFileUploadError(true);
    }
  };

  const handleChange = (e) => {
    setFormData({...formData, [e.target.id]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(UpdateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success === false) {
        dispatch(UpdateUserFailure(data.message));
        return;
      }

      dispatch(UpdateUserSuccess(data));
      setUpdateSuccess(true);

    } catch (error) {
      dispatch(UpdateUserFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, { method: "DELETE" });

      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
      }

      dispatch(deleteUserSuccess());

    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch("/api/auth/signOut");
      const data = await res.json();

      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess(data));
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
    }
  };

  const handleShowListings = async () => {
    try {
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setShowListingsError(true);
        return;
      }
      setShowListingsError(false);
      setUserListings(data);
    } catch (error) {
      setShowListingsError(false);
    }
  };

  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, { method: "DELETE" });
      const data = await res.json();

      if (data.success === false) {
        console.log(data.message);
        return;
      }

      setUserListings((prev) => prev.filter((listing) => listing._id !== listingId));

    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-[#faf8ff] font-semibold text-center my-7'>Profil</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type='file'
          ref={fileRef}
          hidden
          accept='image/*'
        />
        
        <img
          onClick={() => fileRef.current.click()}
          src={formData.avatar || currentUser.avatar}
          alt='profil'
          className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2'
        />

        <p className='text-sm self-center'>
          {fileUploadError ? (
            <span className='text-red-700'>
              Erreur de téléchargement : L'image doit peser moins de 2Mb
            </span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className='text-slate-700'>{`Téléchargement ${filePerc}%`}</span>
          ) : filePerc === 100 ? (
            <span className='text-green-700'>Téléchargement réussi!</span>
          ) : (
            ''
          )}
        </p>
        <input
          type='text'
          placeholder='Nom d’utilisateur'
          defaultValue={currentUser.username}
          id='username'
          className='border p-3 rounded-lg'
          onChange={handleChange}
        />
        <input
          type='email'
          placeholder='Email'
          defaultValue={currentUser.email}
          id='email'
          className='border p-3 rounded-lg'
          onChange={handleChange}
        />
        
        <input
          type='password'
          placeholder='Mot de passe'
          id='password'
          className='border p-3 rounded-lg'
          onChange={handleChange}
        />

        <button disabled={loading} className='bg-[#8685ef] text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80'>
          {loading ? "Chargement..." : "Modifier"}
        </button>

        <Link
          className='bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95' 
          to={"/create-listing"}>
          Créer un catalogue
        </Link>
      </form>
      <div className='flex justify-between mt-5'>
        <span 
          onClick={handleDeleteUser}
          className='text-red-700 cursor-pointer'>Supprimer le compte</span>

        <span
          onClick={handleSignOut} 
          className='text-red-700 cursor-pointer'>Déconnexion</span>
      </div>

      {error && <p className="text-red-700 mt-5">{error}</p>}

      {updateSuccess && <p className='text-green-700'>Utilisateur mis à jour avec succès</p>}

      <button onClick={handleShowListings} className='text-green-700 w-full'>
        Voir les catalogues
      </button>

      {showListingsError && <p>Erreur lors de l’affichage des catalogues</p>}

      {userListings && userListings.length > 0 && (
        <div className='flex flex-col gap-4'>
          <h1 className='text-center text-white mt-7 text-2xl font-semibold'>Vos catalogues</h1>
          {userListings.map((listing) => (
            <div key={listing._id} className='flex border rounded-lg p-3 justify-between items-center gap-4 bg-[#faf8ff]'>
              <Link to={`/listing/${listing._id}`}>
                <img className='h-16 w-16 object-contain' src={listing.imageUrls[0]} alt="Image catalogue" />
              </Link>

              <Link className='flex-1 text-black font-semibold hover:underline truncate' to={`/listing/${listing._id}`}>
                <p>{listing.name}</p>
              </Link>

              <div className='flex flex-col items-center'>
                <button onClick={() => handleListingDelete(listing._id)} className='text-red-700 uppercase'>Supprimer</button>

                <Link to={`/update-listing/${listing._id}`}>
                  <button className='text-green-700 uppercase'>Modifier</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
