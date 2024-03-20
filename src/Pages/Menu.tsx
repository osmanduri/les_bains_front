import React, {useState, useEffect} from 'react'
import CardsMenu from '../Components/Menu/CardsMenu'
import { Link } from 'react-router-dom'
import axios from 'axios'
import Cookies from 'universal-cookie';
import Hero from '../Components/Hero';

export default function Menu() {
  const cookies = new Cookies();
  const [identity, setIdentity] = useState<string>('')
  useEffect(() => {
    async function fetchVerifyIdentity(){
  

      try{
        const res = await axios.get(`${process.env.REACT_APP_BASE_URL_LOCALHOST}/api/users/verifyIdentify`, {
          headers:{
            token: `Bearer ${cookies.get('token')}`
          }
        })
        setIdentity(res.data)
      }catch(err){
        console.log(err)
      }
      
    }
    fetchVerifyIdentity();
  }, [])

  if(!identity){
    return null
  }
  return (
    <>
    <Hero/>
    {
      
          <div className='container mx-auto'>
            <div className='max-w-[576px] mx-auto'>
                <div className='text-center uppercase text-2xl mt-4'>Menu</div>
                {
                             identity === "isAdmin" ? 
                              <div className='flex justify-between mt-12 cursor-pointer max-sm:justify-around'>
                                  <Link to="faire_une_entree"><CardsMenu titre1="Effectuer" titre2="une entrée" link="faire_une_entree"/></Link>
                                  <Link to="client"><CardsMenu titre1="Liste" titre2="clients" link="client"/></Link>
                              </div>
                              :
                              <div className='flex justify-between mt-12 cursor-pointer max-sm:justify-around'>
                                  <Link to="faire_une_entree"><CardsMenu titre1="Déjà Client ?" titre2="" link="faire_une_entree"/></Link>
                                  <Link to="ajouter_client"><CardsMenu titre1="Inscription." titre2="" link="ajouter_client"/></Link>
                              </div>
                }

    
            </div>
          </div>

    }

    </>
  )
}
