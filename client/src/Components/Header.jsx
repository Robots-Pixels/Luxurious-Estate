import {FaSearch} from 'react-icons/fa';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

export default function Header() {
    const {currentUser} = useSelector(state => state.user)
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate()
    const location = useLocation()

    const handleSubmit = (e) => {
         e.preventDefault();
         const urlParams = new URLSearchParams(window.location.search);

         urlParams.set("searchTerm", searchTerm);
         const searchQuery = urlParams.toString();
         navigate(`/search?${searchQuery}`);
    }

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const searchTermFromUrl = urlParams.get('searchTerm');
        if(searchTermFromUrl){
            setSearchTerm(searchTermFromUrl);
        }
    }, [location.search])

  return (
    <header className='bg-[#000] shadow-md sticky top-0 left-0 w-full z-20'>
        <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
            <Link to='/'>
            <h1 className='font-bold text-sm sm:text-xl flex felx-wrap'>
                <span className='text-[#faf8ff]'>Luxurious</span>
                <span className='text-[#8685ef]' >Estate</span>
            </h1>
            </Link>

            <form 
            onSubmit={handleSubmit}
            className='bg-[#faf8ff] p-3 rounded-lg flex items-center'>
                <input 
                onChange={(e) => setSearchTerm(e.target.value)}
                value={searchTerm}
                type="text" placeholder='Search...' className='bg-transparent focus:outline-none w-24 sm:w-64 placeholder:text-black'/>
                <button>
                <FaSearch className='text-slate-600'/>
                </button>
            </form>

            <ul className='flex gap-4 items-center'>
                <Link to="/">
                    <li className='hidden sm:inline text-[#faf8ff] hover:underline'>Accueil</li>
                </Link>
                <Link to="/about">
                    <li className='hidden sm:inline text-[#faf8ff] hover:underline'>À propos</li>
                </Link>

                <Link to="/profile">
                {currentUser ? (
                    <img className='rounded-full h-7 w-7 object-cover' src={currentUser.avatar} alt="profile" />
                )
                :  
                <li> <button className='p-2 rounded-md bg-[#d3fbd8] sm:inline hover:bg-opacity-85'>Inscription</button></li>
                }
                
                </Link>

            </ul>
        </div>
       
    </header>
  )
}
