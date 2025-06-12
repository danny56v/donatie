import React, { useEffect, useState } from 'react'
import { ProductQuickView } from './ProductQuickView'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../redux/store';
import axios from 'axios';

export const Donations = () => {
    

// const user = useSelector((state: RootState) => state.user.currentUser);
// const isAuthenticated = useSelector((state: RootState) => state.user.isAuthenticated);
// const navigate = useNavigate();
const [donations,setDonations] = useState([])

useEffect(() => {
    const fetchDonations = async () => {
        try {
            const res = await axios.get("/api/products/donations");
            const donations = res.data;
            console.log(donations);
            setDonations(donations);
        } catch (error) {
            const errorMessage =
            axios.isAxiosError(error) && error.response
              ? error.response.data.message || "A apărut o eroare la rezervarea produsului."
              : "A apărut o eroare neprevăzută.";
        //   setError(errorMessage);
        console.log(errorMessage);
        }
    }
        fetchDonations()

}, []);


  return (

<>
{donations.length === 0 ? (
    <div className='flex justify-center items-center h-screen'>

        <h1 className='text-2xl font-bold'>Nu ai donatii</h1>
    </div>
)
:(
    <div className='flex flex-col gap-4'>
        {donations.map((donation) => (
            <div key={donation._id} className='flex flex-col gap-4'>
                {/* <h1 className='text-2xl font-bold'>{donation.product.title}</h1> */}
                <ProductQuickView product={donation.product}/>
            </div>
        ))}
    </div>
)}

</>
  )
}
