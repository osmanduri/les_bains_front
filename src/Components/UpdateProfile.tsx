import React, {useState} from 'react'
import FideliteInput from './FideliteInput'
import axios from 'axios'
import { useParams } from 'react-router-dom';
import loading from '/images/loading/loading.gif'
import { FaCircleArrowLeft } from "react-icons/fa6";
import { Link } from 'react-router-dom';
import Cookies from 'universal-cookie';

interface UpdateProfileProps {
    nom: string;
    prenom: string;
    telephone: string;
    email: string;
    dateNaissance: string;
    pointFidelite: number;
    setNom: React.Dispatch<React.SetStateAction<string>>;
    setPrenom: React.Dispatch<React.SetStateAction<string>>;
    setTelephone: React.Dispatch<React.SetStateAction<string>>;
    setEmail: React.Dispatch<React.SetStateAction<string>>;
    setDateNaissance: React.Dispatch<React.SetStateAction<string>>;
    setPointFidelite: React.Dispatch<React.SetStateAction<number>>;
  }

export default function UpdateProfile({nom, prenom, telephone, email, dateNaissance, pointFidelite, setNom, setPrenom, setTelephone, setEmail, setDateNaissance, setPointFidelite}: UpdateProfileProps) {
    let params = useParams()
    const cookies = new Cookies();

    const [startLoading, setStartLoading] = useState<boolean>(false)
    const [responseMsg, setResponseMsg] = useState({
        msg:"",
        color:""
    })
    function handleSubmit(e:any){
        e.preventDefault()
        setStartLoading(true)
        setResponseMsg({
            msg:'',
            color:""
        })

        const payload = {
            nom,
            prenom,
            telephone,
            email,
            date_naissance:dateNaissance,
            point_fidelite:pointFidelite
        }

        async function updateUser(){
            try{
                const res = await axios.put(`${process.env.REACT_APP_BASE_URL_LOCALHOST}/api/users/updateClient/${params.id}`, payload, {
                    headers:{
                        token: `Bearer ${cookies.get('token')}`
                    }
                })

                if(res.status === 200){
                    setResponseMsg({
                        msg:res.data.message,
                        color:"green"
                    })
                }else{
                    setResponseMsg({
                        msg:"Erreur somewhere",
                        color:"red"
                    })
                }
                setStartLoading(false)
            }catch(err){
                console.log(err)
                setStartLoading(false)
                setResponseMsg({
                    msg:'erreur catch',
                    color:"red"
                })
            }   
        }
        setTimeout(() => {
            updateUser();
        }, 1500) 
    }

  return (
    
    <section className="max-w-[768px] mx-auto font-mono">
    <div className='relative'>
    <h1 className='text-center uppercase mb-4 text-2xl'>Profil du client</h1>
    <Link to="/client" className='absolute top-0 left-0'><div className='mb-4'><FaCircleArrowLeft size={40}/></div></Link>
    </div>

    <div className="w-full mb-8 overflow-hidden rounded-lg shadow-lg py-8 px-12 bg-white">
        <form onSubmit={handleSubmit}>
            <div className="mb-5 flex items-baseline justify-between">
                    <div>
                        <label  className="mb-1 block text-base font-medium text-[#07074D]">Nom<span className='italic text-sm'> (obligatoire)</span></label>
                        <input value={nom} onChange={e=> setNom(e.target.value)} type="text" name="name" id="name" placeholder="Full Name" className="w-full rounded-md border border-[#e0e0e0] bg-white py-2 px-6 text-base font-bold text-black outline-none focus:shadow-md capitalize" required/>
                    </div>
                    <div>
                        <label  className="mb-1 block text-base font-medium text-[#07074D] mt-2">Prenom<span className='italic text-sm'> (obligatoire)</span></label>
                        <input value={prenom} onChange={e=> setPrenom(e.target.value)} type="text" name="name" id="name" placeholder="Full Name" className="w-full rounded-md border border-[#e0e0e0] bg-white py-2 px-6 text-base font-bold text-black outline-none focus:shadow-md capitalize" required/>
                    </div>
            </div>
            <div className='flex items-baseline justify-between'>
                <div className="mb-5">
                    <label  className="mb-1 block text-base font-medium text-[#07074D]">
                        Téléphone<span className='italic text-sm'> (obligatoire)</span>
                    </label>
                    <input value={telephone} onChange={e=> setTelephone(e.target.value)} type="text" name="phone" id="phone" placeholder="Enter your phone number"
                        className="w-full rounded-md border border-[#e0e0e0] bg-white py-2 px-6 text-base font-bold text-black outline-none focus:border-[#6A64F1] focus:shadow-md" required/>
                </div>
                <div className="mb-5">
                    <label  className="mb-1 block text-base font-medium text-[#07074D]">
                        Email
                    </label>
                    <input value={email} onChange={e=> setEmail(e.target.value)} type="email" name="email" id="email" placeholder="Enter your email"
                        className="w-full rounded-md border border-[#e0e0e0] bg-white py-2 px-6 text-base font-bold text-black outline-none focus:border-[#6A64F1] focus:shadow-md" />
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
                <FideliteInput pointFidelite={pointFidelite} setPointFidelite={setPointFidelite}/>
            </div>
            {
                startLoading ? <div className='flex justify-center'><img className='w-[50px]' src={loading} alt="loading"/></div> : <button className="hover:shadow-form w-full rounded-md bg-[#6A64F1] py-3 px-8 text-center text-base font-semibold text-white outline-none">Mettre à jour les informations du client</button>
            }
        </form>
        <p style={{color:responseMsg.color, textAlign:"center", marginTop:"10px"}}>{responseMsg.msg}</p>
    </div>
    </section>
  )
}
