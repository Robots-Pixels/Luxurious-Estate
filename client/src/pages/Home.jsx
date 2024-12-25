import React, { useEffect, useState } from 'react'
import {Link} from "react-router-dom"

import {Swiper, SwiperSlide} from "swiper/react";
import SwiperCore from "swiper";
import {Navigation} from "swiper/modules"; 
import "swiper/css/bundle";
import ListingItem from '../Components/ListingItem';


export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  SwiperCore.use(Navigation);

  useEffect(() => {

    const fetchOfferListings = async () => {
      try {
        const res = await fetch(`/api/listing/get?offer=true&limit=3`);
        const data = await res.json();
        setOfferListings(data);
        fetchRentListings();
  
      } catch (error) {
        console.log(error);
      }
    }

    const fetchRentListings = async () => {
      try {
        const res = await fetch(`/api/listing/get?type=rent&limit=3`);
        const data = await res.json();
        setRentListings(data);
        fetchSaleListings();
      } catch (error) {
        console.log(error);
      }
    }

    const fetchSaleListings = async () => {
      try {
        const res = await fetch(`/api/listing/get?type=sale&limit=3`);
        const data = await res.json();
        setSaleListings(data);
      } catch (error) {
        console.log(error);
      }
    }

    fetchOfferListings();
  }, [])

  return (
    <div>
      {/* Top */}

      <div className='flex flex-col gap-6 pt-12 pb-8 px-2 sm:px-3 max-w-full sm:max-w-6xl mx-auto'>
        
        <h1 className='text-[#faf8ff] font-semibold text-4xl lg:text-7xl'>Votre havre de paix
          <br />
          se trouve ici
        </h1>

        <div className="text-gray-400 text-xs sm:text-sm">
          Luxurious Estate is the best place to find your next perfect place to live.

          <br />

          We have a wide range of properties for you to choose from.
        </div>

      </div>

      <div className='px-2 sm:px-3 gap-6 max-w-full sm:max-w-6xl mx-auto pb-8'>
      <Link
        className="bg-[#8685ef] text-[#faf8ff] px-5 py-2 inline-block rounded-lg text-xs sm:text-sm font-bold hover:bg-opacity-80"
        to={"/search"}>
          Trouvez-le maintenant
        </Link>
      </div>


      {/* Swiper */}

      <Swiper navigation
       style={{ overflow: "hidden" }}>

      {
        offerListings && offerListings.length > 0 
          &&
        offerListings.map((listing) => (
          <SwiperSlide key={listing._id}>
            <div style={{background: `url(${listing.imageUrls[0]}) center no-repeat`, backgroundSize:"cover"}} className='h-[500px]'>
            </div>
          </SwiperSlide>
        ))
      }
      </Swiper>


      {/* Listing results for offer, sale and rent */}

      <div className='max-w-full sm:max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10'>

        {offerListings && offerListings.length > 0
          && 
        (
          <div className="">
            <div className="my-3">
              <h2 className='text-2xl font-semibold text-[#faf8ff]'>Dernières annonces</h2>
              <Link className='text-sm text-[#8685ef] hover:underline' to={"/search?offer=true"}>
                Plus d'offres
              </Link>
            </div>

            <div className="grid grid-cols-[repeat(auto-fit,_minmax(200px,_1fr))] sm:grid-cols-[repeat(auto-fit,_minmax(280px,_1fr))] gap-4">

              {
                offerListings.map((listing) => (
                  <ListingItem listing={listing} key={listing._id}/>
                ))
              }
            </div>  
          </div>
        )
        }

{rentListings && rentListings.length > 0
          && 
        (
          <div className="">
            <div className="my-3">
              <h2 className='text-2xl font-semibold text-[#faf8ff]'>Dernières annonces de locations</h2>
              <Link className='text-sm text-[#8685ef] hover:underline' to={"/search?type=rent"}>
              Plus d'offres
             </Link>
            </div>

            <div className="grid grid-cols-[repeat(auto-fit,_minmax(200px,_1fr))] sm:grid-cols-[repeat(auto-fit,_minmax(280px,_1fr))] gap-4">

              {
                rentListings.map((listing) => (
                  <ListingItem listing={listing} key={listing._id}/>
                ))
              }
            </div>
          </div>
        )
        }

{saleListings && saleListings.length > 0
          && 
        (
          <div className="">
            <div className="my-3">
              <h2 className='text-2xl font-semibold text-[#faf8ff]'>Dernières annonces de vente              </h2>
              <Link className='text-sm text-[#8685ef] hover:underline' to={"/search?type=sale"}>
                Plus d'offres
              </Link>
            </div>

            <div className="grid grid-cols-[repeat(auto-fit,_minmax(200px,_1fr))] sm:grid-cols-[repeat(auto-fit,_minmax(280px,_1fr))] gap-4">

              {
                saleListings.map((listing) => (
                  <ListingItem listing={listing} key={listing._id}/>
                ))
              }
            </div>
          </div>
        )
        }
      </div>

    </div>
  )
}
