import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { signInStart, signInSucces, signInFailure } from '../redux/user/userSlice';
import OAuth from '../Components/OAuth';

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      dispatch(signInStart());
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (data.success === false) {
        dispatch(signInFailure(data.message));
        return;
      }

      dispatch(signInSucces(data));
      navigate('/');
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7 text-white'>
        Connexion
      </h1>

      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        <input
          type='email'
          placeholder='Email'
          className='border p-3 rounded-lg'
          id='email'
          onChange={handleChange}
        />

        <input
          type='password'
          placeholder='Mot de passe'
          className='border p-3 rounded-lg'
          id='password'
          onChange={handleChange}
        />

        <button
          disabled={loading}
          className='bg-[#8685ef] text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'
        >
          {loading ? 'Chargement...' : 'Se connecter'}
        </button>

        <OAuth />
      </form>

      <div className='flex gap-2 mt-5 text-white'>
        <p>Vous n'avez pas encore de compte ?</p>
        <Link to={'/sign-up'}>
          <span className='text-[#8685ef]'>Créer un compte</span>
        </Link>
      </div>

      {error && <p className='text-red-500 mt-5'>{error}</p>}
    </div>
  );
}
