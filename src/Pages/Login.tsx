import React, {useState} from 'react'
import logo from '/images/logo.webp'
import login_img from '/images/login/hamam1.png'
import { BsEyeFill } from "react-icons/bs";
import { BsEyeSlashFill } from "react-icons/bs";
import Hero from '../Components/Hero'
import axios from 'axios'
import Cookies from 'universal-cookie'
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const cookies = new Cookies();
    const [visiblePassword, setVisiblePassword] = useState<string>("password")
    const [email, setEmail] = useState<string>()
    const [password, setPassword] = useState<string>()
    const [responseMsg, setResponseMsg] = useState({
        msg:"",
        color:""
    })
    const navigate = useNavigate();

    const handleSubmit = (e:any) => {
        e.preventDefault();
        const payload = {
            email,
            password
        }

        axios.post(`${process.env.REACT_APP_BASE_URL_LOCALHOST}/api/users/login`, payload)
        .then((res) => {
            if(res.data.message === "Mot de passe incorrect !"){
                setResponseMsg({
                    msg:res.data.message,
                    color:"red"
                })
            }else if(res.data.message === "Utilisateur inconnue !"){
                setResponseMsg({
                    msg:res.data.message,
                    color:"red"
                })
            }else{
                cookies.set('token', res.data.token, { path: '/' });
                navigate('/')
            }
        })
        .catch(err => {
            setResponseMsg({
                msg:"Error catch !",
                color:"red"
            })
        })
    }

  return (
    <>
    <Hero/>
    <div className='max-sm:p-0 max-md:p-8 max-lg:p-8'>
        <div className='flex justify-center mt-20 pb-20 max-sm:w-[90%] max-sm:mx-auto '>
            <img src={login_img} alt="hammam_aulnay_login_image" className='w-[350px] h-[522px] rounded-tl-xl rounded-bl-xl max-sm:w-[150px] max-sm:h-[350px]'/>
            <form onSubmit={handleSubmit} className='p-16 w-[600px] h-[522px]  rounded-tr-xl rounded-br-xl shadow-2xl max-sm:p-0 max-sm:w-[100%] max-sm:h-[350px] max-sm:pl-4' style={{background:"white"}}>
            <h1 className='text-4xl mb-12 max-sm:text-lg max-sm:text-center'>Connexion</h1>
                <div className='mt-2 '>
                <label className=' capitalize max-sm:text-sm'>Email</label>
                <input type="text" className=" mt-1 outline-none bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 max-sm:w-[80%] max-sm:h-[35px]" placeholder="Entrez votre email" onChange={e => setEmail(e.target.value)} required />
                </div>
                <div className='mt-2 capitalize relative '>
                    <label className='max-sm:text-sm'>Mot de passe</label>
                    <input type={visiblePassword} className="  mt-1 outline-none bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 max-sm:w-[80%] max-sm:h-[35px]" placeholder="Mot de passe" onChange={e => setPassword(e.target.value)} required />
                    { visiblePassword === "password" ? <div className='absolute right-4 top-10 cursor-pointer ' onClick={() => setVisiblePassword('text')}><BsEyeFill size="20px"/></div> : <div className='absolute right-4 top-10 cursor-pointer' onClick={() => setVisiblePassword('password')}><BsEyeSlashFill size="20px"/></div> }
                </div>
                <div className='flex justify-between mt-4 '>
                    <p className=' cursor-pointer max-sm:text-sm'>Mot de passe oublié ?</p>
                </div>
                <div className='mt-4 '>
                    <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 max-sm:px-3 py-2 max-sm:mt-2">Connexion</button>
                    <p className='text-black text-center mt-6' style={{color:responseMsg.color}}>{responseMsg.msg}</p>
                </div>
            </form>
            
        </div>
        
    </div>
    </>

  )
}
