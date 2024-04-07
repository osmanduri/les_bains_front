import React, {useState} from 'react'
import Cookies from 'universal-cookie';
import axios from 'axios'
import loading from '/images/loading/loading.gif'
import { FaCircleArrowLeft } from "react-icons/fa6";
import { Link } from 'react-router-dom';
import Hero from './Hero';

interface msgApi {
    msg: string;
    color: string
}

export default function AjouterClient() {
    const cookies = new Cookies();
    const [nom, setNom] = useState<string>('')
    const [prenom, setPrenom] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [dateNaissance, setDateNaissance] = useState<string>('')
    const [telephone, setTelephone] = useState<string>('')
    const [startLoading, setStartLoading] = useState<boolean>(false)

    const [msgResponse, setMsgResponse] = useState<msgApi>({
        msg:"",
        color:""
      })
  
      function initState(){
        setNom('')
        setPrenom('')
        setTelephone('')
        setEmail('')
        setDateNaissance('')
      }
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStartLoading(true)
        setMsgResponse({
          msg:"",
          color:""
        })
  
        const payload = {
          nom,
          prenom,
          date_naissance:dateNaissance,
          telephone,
          point_fidelite:10
        }
        setTimeout(() => {
        axios.post(`${process.env.REACT_APP_BASE_URL_PROD}/api/users/addUser`, payload, {
          headers:{
            token: `Bearer ${cookies.get('token')}`
        }
        })
        .then((res) => {
          if(res.status === 200){
            setMsgResponse({
              msg:'Client ajouter avec succès !',
              color:"green"
            })
            initState();
            setStartLoading(false)
          }else{
            setMsgResponse({
              msg:"Erreur lors de l'ajout !",
              color:"red"
            })
            initState();
            setStartLoading(false)
          }
  
        })
        .catch(err => {
          console.log(err)
          setMsgResponse({
            msg:"Erreur lors de l'ajout !",
            color:"red"
          })
          initState();
          setStartLoading(false)
        })
        }, 1500)
      };
  return (
    <>
    <Hero/>
        <section className="max-w-[668px] mx-auto font-mono mt-12">
    <div className='relative'>
    <h1 className='text-center uppercase mb-4 text-2xl'>Inscription</h1>
    <Link to="/client" className='absolute top-0 left-0'><div className='mb-4'><FaCircleArrowLeft size={40}/></div></Link>
    </div>

    <div className="w-full mb-8 overflow-hidden rounded-lg shadow-lg py-8 px-12 bg-white">
        <form onSubmit={handleSubmit}>
            <div className="mb-5 flex items-baseline justify-between">
                    <div>
                        <label  className="mb-1 block text-base font-medium text-[#07074D]">Nom<span className='italic text-sm'> (obligatoire)</span></label>
                        <input value={nom} onChange={e=> setNom(e.target.value)} type="text" name="name" id="name" placeholder="Entrez votre nom" className="w-full rounded-md border border-[#e0e0e0] bg-white py-2 px-4 text-base font-bold text-black outline-none focus:shadow-md" required/>
                    </div>
                    <div>
                        <label  className="mb-1 block text-base font-medium text-[#07074D] mt-2">Prenom<span className='italic text-sm'> (obligatoire)</span></label>
                        <input value={prenom} onChange={e=> setPrenom(e.target.value)} type="text" name="name" id="name" placeholder="Entrez votre prénom" className="w-full rounded-md border border-[#e0e0e0] bg-white py-2 px-4 text-base font-bold text-black outline-none focus:shadow-md" required/>
                    </div>
            </div>
            <div className='flex items-baseline justify-between'>
                <div className="mb-5">
                    <label  className="mb-1 block text-base font-medium text-[#07074D]">
                        Téléphone<span className='italic text-sm'> (obligatoire)</span>
                    </label>
                    <input value={telephone} onChange={e=> setTelephone(e.target.value)} type="tel" name="phone" id="phone" placeholder="Téléphone"
                        className="w-full rounded-md border border-[#e0e0e0] bg-white py-2 px-4 text-base font-bold text-black outline-none focus:shadow-md" required/>
                </div>
                <div className="mb-5">
                    <label  className="mb-1 block text-base font-medium text-[#07074D]">
                        Email
                    </label>
                    <input value={email} onChange={e=> setEmail(e.target.value)} type="email" name="email" id="email" placeholder="Entrez votre adresse email"
                        className="w-full rounded-md border border-[#e0e0e0] bg-white py-2 px-4 text-base font-bold text-black outline-none focus:shadow-md" />
                </div>
            </div>
            <div className='flex items-baseline justify-between'>
                <div className="-mx-3 flex flex-wrap">
                    <div className="w-full px-3">
                        <div className="mb-5">
                            <label  className="mb-1 block text-base font-medium text-[#07074D]">
                                Date d'anniversaire<span className='italic text-sm'> (obligatoire)</span>
                            </label>
                            <input value={dateNaissance} onChange={e=> setDateNaissance(e.target.value)} type="date" name="date" id="date"
                                className="w-full rounded-md border border-[#e0e0e0] bg-white py-2 px-6 text-base font-bold text-black outline-none focus:border-[#6A64F1] focus:shadow-md" required/>
                        </div>
                    </div>
                </div>
            </div>
            {
                startLoading ? <div className='flex justify-center'><img className='w-[50px]' src={loading} alt="loading"/></div> : <button className="hover:shadow-form w-full rounded-md bg-[#6A64F1] py-3 px-8 text-center text-base font-semibold text-white outline-none">Valider mon inscription</button>
            }
        </form>
        <p style={{color:msgResponse.color, textAlign:"center", marginTop:"10px"}}>{msgResponse.msg}</p>
    </div>
    </section>
    </>
  )
}
