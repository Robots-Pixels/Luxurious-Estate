import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ListingItem from '../Components/ListingItem';

export default function Search() {

    const [sidebarData, setSiebarData] = useState({
        searchTerm: "",
        type: "all",
        parking: false,
        offer: false,
        furnished: false,
        sort: "createdAt",
        order: "desc",
    })
    const [loading, setLoading] = useState(false);
    const [listings, setListings] = useState([]);

    const navigate = useNavigate();
    const location = useLocation();
    const [showMore, setShowMore] = useState(false);

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get("searchTerm");
        const typeFromUrl = urlParams.get("type");
        const parkingFromUrl = urlParams.get("parking");
        const furnishedFromUrl = urlParams.get("furnished");
        const offerFromUrl = urlParams.get("offer");
        const sortFromUrl = urlParams.get("sort");
        const orderFromUrl = urlParams.get("order");

        if(
            searchTermFromUrl ||
            typeFromUrl ||
            parkingFromUrl ||
            furnishedFromUrl ||
            offerFromUrl ||
            sortFromUrl ||
            orderFromUrl
        ){
            setSiebarData({
                searchTerm: searchTermFromUrl || "",
                type: typeFromUrl || "all",
                parking: parkingFromUrl === "true"? true : false,
                furnished: furnishedFromUrl === "true"? true : false,
                offer: offerFromUrl === "true"? true : false,
                sort: sortFromUrl || "createdAt",
                order: orderFromUrl || "desc",
            });
        }

        const fetchListings = async () => {
            setLoading(true);
            setShowMore(false);
            const searchQuery = urlParams.toString();
            const res = await fetch(`/api/listing/get?${searchQuery}`);
            const data = await res.json();
            if(data.length > 8){
                setShowMore(true);
            }else{
                setShowMore(false);
            }

            if(data.length > 8){
                setShowMore(true);
            }

            setListings(data);

            setLoading(false);
        }

        fetchListings();

    }, [location.search]);

    const handleChange = (e) => {
        if(e.target.id === "all" || e.target.id === "rent" || e.target.id === "sale"){
            setSiebarData({
                ...sidebarData, 
                type: e.target.id
            })
         }

        if (e.target.id === "searchTerm"){
            setSiebarData(
                {
                    ...sidebarData,
                    searchTerm: e.target.value
                }
            )
        }

        if(e.target.id === "parking" || e.target.id === "furnished" || e.target.id === "offer"){
            setSiebarData({
                ...sidebarData, 
                [e.target.id]: e.target.checked || e.target.checked === "true" ? true : false
            })
         }

         if (e.target.id === "sort_order"){
            const sort = e.target.value.split("_")[0] || "createdAt";

            const order =  e.target.value.split("_")[1] || "desc";

            setSiebarData({
                ...sidebarData,
                sort,
                order
            })
         }
    };

    const hanldeSubmit = (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams();
        urlParams.set("searchTerm", sidebarData.searchTerm);
        urlParams.set("type", sidebarData.type);
        urlParams.set("parking", sidebarData.parking);
        urlParams.set("furnished", sidebarData.furnished);
        urlParams.set("offer", sidebarData.offer);
        urlParams.set("sort", sidebarData.sort);
        urlParams.set("order", sidebarData.order);

        const searchQuery = urlParams.toString();
        navigate(`/search/?${searchQuery}`);
    }

    const onShowMoreClick = async () => {

        setLoading(true);

        const numberOfListings = listings.length;
        const urlParams = new URLSearchParams(location.search);
        const startIndex = numberOfListings;
        urlParams.set("startIndex", startIndex);
        const searchQuery = urlParams.toString();
        const res = await fetch(`/api/listing/get?${searchQuery}`);
        const data = await res.json();
        if (data.length < 9){
            setShowMore(false);
        }

        setListings([...listings, ...data]);
        setLoading(false);

    }

  return (
    <div className='flex flex-col md:flex-row'>
      <div className='p-7 border-b-2 md:border-r-2 md:min-h-screen text-white'>
        <form 
        onSubmit={hanldeSubmit}
        className='flex flex-col gap-8'>
          <div className='flex items-center gap-2'>
            <label className='whitespace-nowrap font-semibold'>Terme de Recherche:</label>
            <input
            value={sidebarData.searchTerm}
            onChange={handleChange}
              type='text'
              id='searchTerm'
              placeholder='Rechercher...'
              className='border rounded-lg p-3 w-full text-black placeholder:text-black'
            />
          </div>
          
          <div className='flex gap-2 flex-wrap items-center'>
            <label className='font-semibold'>Type:</label>

            <div className='flex gap-2'>
              <input type='checkbox' id='all' className='w-5' 
              onChange={handleChange}
              checked={sidebarData.type === "all"}/>
              <span>Location & Vente</span>
            </div>

            <div className='flex gap-2'>
              <input type='checkbox' id='rent' className='w-5' 
              onChange={handleChange}
              checked={sidebarData.type === "rent"}/>
              <span>Location</span>
            </div>

            <div className='flex gap-2'>
              <input type='checkbox' id='sale' className='w-5' 
              onChange={handleChange}
              checked={sidebarData.type === "sale"}/>
              <span>Vente</span>
            </div>

            <div className='flex gap-2'>
              <input type='checkbox' id='offer' className='w-5' 
              onChange={handleChange}
              checked={sidebarData.offer}/>
              <span>Avec Réduction</span>
            </div>
          </div>

          <div className='flex gap-2 flex-wrap items-center'>
            <label className='font-semibold'>Équipements
            :</label>
            <div className='flex gap-2'>
              <input type='checkbox' id='parking' className='w-5' 
              onChange={handleChange}
              checked={sidebarData.parking}/>
              <span>Parking</span>
            </div>
            <div className='flex gap-2'>
              <input type='checkbox' id='furnished' className='w-5' 
                onChange={handleChange}
                checked={sidebarData.furnished}/>
              <span>Meublé</span>
            </div>
          </div>
          <div className='flex items-center gap-2'>
            <label className='font-semibold'>Filtrer par:</label>
            <select 
            onChange={handleChange}
            defaultValue={"createdAt_desc"}
            id='sort_order' className='border rounded-lg p-3 text-black'>
              <option value="regularPrice_desc">Pris decroissant</option>
              <option value="regularPrice_asc">Price croissant</option>
              <option value="createdAt_desc">Plus récent</option>
              <option value="createdAt_asc">Plus vieux</option>
            </select>
          </div>
          <button className='bg-[#8685ef] text-white p-3 rounded-lg uppercase hover:opacity-95'>
            Rechercher
          </button>
        </form>
      </div>

      <div className='flex-1'>
        <h1 className='text-3xl font-semibold border-b p-3 text-[#faf8ff] mt-5'>Résultat:</h1>

        <div className="p-7 flex flex-wrap gap-4">
            {!loading && listings.length === 0
                &&
            <p className='text-xl text-white'>Aucun résultat trouvé!</p>
            }

            {loading 
            
                &&
            <p className='text-xl text-[#faf8ff] text-center w-full'>Chargement...</p>
            }

            {!loading && listings
            &&

            (
              <div className='grid grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))] w-full gap-4'>
                {
                         listings.map((listing) => (
                          <ListingItem key={listing._id} listing={listing}/>
                      ))     
                }
              </div>
            )
            }

            {showMore && !loading
            &&
                <button
                className='text-[#00ac7c] hover:underline p-7 text-center w-full'
                onClick={
                    onShowMoreClick
                }
                >
                 Show More   

                </button>
            }
        </div> 
      </div>
    </div>
  );
}