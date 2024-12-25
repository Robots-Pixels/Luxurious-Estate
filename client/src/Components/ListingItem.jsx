import React from 'react'
import { Link } from 'react-router-dom'
import {MdLocationOn} from "react-icons/md"

export default function ListingItem({listing}) {

  return (
    <div className='bg-[#faf8ff] shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full'>
      <Link to={`/listing/${listing._id}`}>

        <div
          style={{ backgroundImage: `url(${listing.imageUrls[0]})`}}
          className="w-full aspect-[1.4/1] bg-cover bg-no-repeat bg-center hover:scale-105 transition-all"
        >
        </div>

        <div className="p-3 flex flex-col gap-2 w-full">
            <p className='truncate text-lg font-semibold capitalize first-letter:text-2xl'>{listing.name}</p>

            <div className='flex items-center gap-1 font-semibold'>
                <MdLocationOn className='h-4 text-[#8685ef]'/>

                <p className='text-sm text-[#8685ef] truncate w-full capitalize'>{listing.address}</p>
            </div>

                <p className='first-letter:uppercase text-sm text-gray-700 line-clamp-2'>{listing.description}</p>

                <p className=' text-gray-700 font-semibold'>
                    ${"  "}
                    {listing.offer ? listing.discountPrice.toLocaleString("en-US") : listing.regularPrice.toLocaleString("en-US")}

                    {listing.type === "rent" && " / month"}
                </p>
                
                <div className="text-slate-700 flex gap-3">
                <div className="font-bold text-xs">
                        {listing.bedrooms > 1 ? `${listing.bedrooms} beds` : `${listing.bedrooms} bed`}
                </div>

                <div className="font-bold text-xs">
                        {listing.bathrooms > 1 ? `${listing.bathrooms} baths` : `${listing.bathrooms} bath`}
                </div>

                </div>

        </div>

    </Link>
    </div>  
  )
}

