import React, { useEffect, useState } from 'react'
import { data, useParams } from 'react-router-dom';
import {Swiper, SwiperSlide} from "swiper/react";
import SwiperCore from "swiper";
import {Navigation} from "swiper/modules"; 
import "swiper/css/bundle";
import {
    FaMapMarkerAlt,
    FaBed,
    FaBath,
    FaParking,
    FaChair,
    FaShare
} from "react-icons/fa" 
import { useSelector } from 'react-redux';
import Contact from '../Components/Contact';

export default function Listing() {

    SwiperCore.use(Navigation);
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const params = useParams();
    const [copied, setCopied] = useState(false);
    const {currentUser} = useSelector(state => state.user);
    const [contact, setContact] = useState(false);

    useEffect(() => {
        const fetchListing = async () => {

            try {
                setLoading(true);
                const res = await fetch(`/api/listing/get/${params.listingId}`);
                const data = await res.json();

                if(data.success === false){
                    setError(true);
                    setLoading(false);
                    return;
                }

                setListing(data);
                setLoading(false)
                setError(false);
            } catch (error) {
                setError(true);
                setLoading(false);
            }
        }

        fetchListing();
    }, [params.listingId])
    
    return (
        <main>
            {loading && <p className='text-center my-7 text-2xl'>Loading...</p>}

            {error && <p className='text-center my-7 text-2xl'>Something went wrong!</p>}

            {listing && !loading && !error 
            
            &&
            
            (
                <div>
                    <Swiper navigation>
                        {listing.imageUrls.map((url) => (
                            <SwiperSlide key={url}>
                                <div className='h-[520px]' style={{background: `url(${url}) center no-repeat`, backgroundSize: 'cover'}}></div>
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    <div className='fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer'>
                        <FaShare 
                        onClick={() => {
                            navigator.clipboard.writeText(window.location.href);
                            setCopied(true);
                            setTimeout(() =>{
                                setCopied(false);
                            }, 2000);
                        }}
                        className='text-sla-500'/>
                    </div>

                    {
                    copied 
                     && 
                    <p className='fixed top-[23%] right-[5%] z-10 rounded-md bg-[#d3fbd8] p-2'>
                        Lien Copié !
                    </p>
                    }

                    <div className='flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4'>
                        <p className='text-2xl font-semibold first-letter:uppercase text-[#d3fbd8]'>
                            {listing.name} - ${" "} {listing.offer 
                            ? listing.discountPrice.toLocaleString("en-US")
                            : listing.regularPrice.toLocaleString("en-US")
                        }

                        {listing.type === "rent" && " / month"}
                        </p>

                        <p className='flex items-center mt-6 gap-2 text-[#d3fbd8] text-sm'>
                            <FaMapMarkerAlt className ="text-[#d3fbd8]"/>
                            <span className='first-letter:uppercase'> {listing.address} </span>
                        </p>

                        <div className='flex gap-4'>
                            <p className='bg-[#3d1e1c] w-full max-w-[200px] text-[#d3fbd8] text-center p-1 rounded-md'>
                                {listing.type === "rent" ? "Location" :
                                "En Vente"}
                            </p>

                            {
                                listing.offer
                                    &&
                                (
                                    <p className='bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
                                        ${+listing.regularPrice - +listing.discountPrice} OFF
                                    </p>
                                )
                            }
                        </div>

                        <p className='text-[#faf8ff]'>
                            <span className='font-semibold text-[#faf8ff]'>
                                Description - </span> 

                            {listing.description}
                        </p>
                        <ul className='text-[#00ac7c] font-semibold text-sm flex felx-wrap items-center gap-4 sm:gap-6'>

                            <li 
                            className="flex items-center gap-1 whitespace-nowrap">
                                <FaBed className='text-lg'/>
                                {listing.bedrooms > 1 ?
                                `${listing.bedrooms} beds`
                            :    `${listing.bedrooms} bed`
                            }
                            </li>

                            <li 
                            className="flex items-center gap-1 whitespace-nowrap">
                                <FaBath className='text-lg'/>
                                {listing.bathrooms > 1 ?
                                `${listing.bathrooms} baths`
                            :    `${listing.bathrooms} bath`
                            }
                            </li>

                            <li 
                            className="flex items-center gap-1 whitespace-nowrap">
                                <FaParking className='text-lg'/>
                                {listing.parking ?
                                `Parking spot`
                            :    `No Parking`
                            }
                            </li>

                            <li 
                            className="flex items-center gap-1 whitespace-nowrap">
                                <FaChair className='text-lg'/>
                                {listing.furnished ?
                                `Furnished`
                            :    `Not Furnished`
                            }
                            </li>
  
                        </ul>

                        {
                            currentUser && listing.userRef !== currentUser._id
                            && !contact

                            &&
                            
                            (<button 
                            onClick = {() => setContact(true)}
                            className='bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 p-3'>
                            Contacter le Propriétaire
                        </button>)
                        }

                        {contact &&
                         <Contact listing={listing}/>
                        }
                        
                        
                    </div>


                </div>
            )
            }
        </main>
    )
}
