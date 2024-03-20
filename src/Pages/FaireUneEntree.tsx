import React, {useState} from 'react'
import axios from 'axios'
import { FaCircleArrowLeft } from "react-icons/fa6";
import { Link } from 'react-router-dom';
import CarteFidelite from '../Components/CarteFidelite';
import jus_orange from '/images/jus_orange/jus_orange.jpg'
import gift from '/images/jus_orange/gift.png'
import spa from '/images/jus_orange/spa.png'
import Phone from '../svg/Phone';
import loading from '/images/loading/loading1.gif'
import Cookies from 'universal-cookie';
import { FaSearch } from "react-icons/fa";


interface UserType {
    _id:string;
    nom: string;
    prenom: string;
    telephone: string;
    point_fidelite: number;
  }
  
  interface singleUserType extends UserType {
    point_fidelite: number;
  }

  interface responseMsgType{
    offre:string;
    msg:string;
    color:string
  }

export default function FaireUneEntree() {
    const cookies = new Cookies();
    const [phoneInput, setPhoneInput] = useState<string>()
    const [listUserByPhone, setListUserByPhone] = useState([])
    const [singleUser, setSingleUser] = useState<singleUserType | undefined>()
    const [startLoadingEntrance, setStartLoadingEntrance] = useState<boolean>(false)
    const [numIntrouvable, setNumIntrouvable] = useState<string>('')
    const [responseMsg, setResponseMsg] = useState<responseMsgType>({offre:"",msg:"",color:""})
    const handleSearchByPhoneNumber = async () => {
        setNumIntrouvable('')
        try{
            const res = await axios.post(`${process.env.REACT_APP_BASE_URL_LOCALHOST}/api/users/searchByPhoneNumber`, {tel:phoneInput}, {
                headers:{
                    token: `Bearer ${cookies.get('token')}`
                }
            })
            setListUserByPhone(res.data)
        }catch(err:any){
            setSingleUser(undefined)
            setListUserByPhone([]);
            setNumIntrouvable(err.response.data.message)
        }

        if (!phoneInput) {
            setListUserByPhone([]);
            setSingleUser(undefined)
          }
    }

    const handleSetSingleUser = (element: any) => {
        setListUserByPhone([]);
        setResponseMsg({offre:"",msg:"",color:""})
        const input_tel = document.getElementById('input_tel') as HTMLInputElement | null;
    
        if (input_tel) {
            input_tel.value = element.prenom + ' ' + element.nom;
            setSingleUser(element);
            setListUserByPhone([]);
        } else {
            console.error("L'élément avec l'ID 'input_tel' n'a pas été trouvé dans le DOM.");
        }
    };
    
    

    const handleSubmit =  (e:any) => {
        e.preventDefault()
        console.log('lancement handlesubmit')
        setStartLoadingEntrance(true)
        setResponseMsg({
            offre:"",
            msg:'',
            color:""
        })

        async function fetchEntrance(){
            try{
                const res = await axios.get(`${process.env.REACT_APP_BASE_URL_LOCALHOST}/api/users/entrance/${singleUser?._id}`, {
                    headers:{
                        token: `Bearer ${cookies.get('token')}`
                    }
                })
                if(res.status === 200){
                    setSingleUser(res.data.user)
                    setResponseMsg({
                        offre:res.data.offre,
                        msg:res.data.message,
                        color:"green"
                    })
                }else if(res.status === 201){
                    setResponseMsg({
                        offre:"",
                        msg:res.data,
                        color:"red"
                    })
                }
            }catch(err){
                setResponseMsg({
                    offre:"",
                    msg:"",
                    color:""
                })
                console.log(err)
            }
        }

        setTimeout(() => {
            fetchEntrance();
            setStartLoadingEntrance(false)
        }, 1500)
    }

  return (
    <>
    <div className='max-w-[576px] mx-auto'>
    <Link to="/"><div className='mb-4 mt-4'><FaCircleArrowLeft size={40}/></div></Link>
        <form onSubmit={handleSubmit} className="w-full mb-8 overflow-hidden rounded-lg shadow-lg p-12 bg-white h-[auto]">
            <h1 className='text-center uppercase text-2xl'>Effectuer une entrée</h1>
            <label className="block mb-2 text-sm text-gray-900 dark:text-white mt-12 text-base font-bold">Entrez votre numéto de téléphone :</label>
            <div className="flex">
                <span className="w-[42px] h-[42px] inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border rounded-e-0 border-gray-300 rounded-s-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
                <Phone/>
                </span>
                <div className='relative w-full'>
                <input type="text" id="input_tel" className="relative rounded-none rounded-e-lg bg-gray-50 border text-gray-900 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5 outline-none" placeholder="Numeto de tel" onChange={(e) => setPhoneInput(e.target.value)}/>
                <div onClick={handleSearchByPhoneNumber} className='absolute top-3 right-5 cursor-pointer'><FaSearch size={17}/></div>
                {numIntrouvable}
                </div>
                
            </div>
            { 
                    <div className="overflow-y-auto max-h-[350px]">
                    {listUserByPhone.map((e: UserType, index: number) => (
                        <div onClick={() => handleSetSingleUser(e)} className="border border-1 border-black p-2 cursor-pointer hover:bg-black hover:text-white" key={index}>
                            <div className='flex justify-between'>
                                <div>{e.prenom} {e.nom}</div>
                                <div>{e.telephone}</div>
                            </div>
                        </div>
                    ))}
                    </div>
                
            }
            <div className='mt-12 flex justify-end items-center'>
                 <button disabled={responseMsg.msg || startLoadingEntrance || !singleUser ? true : false} className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800">
                    <span className={singleUser ? "w-[170px] relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0":"w-[170px] relative px-5 py-2.5 transition-all ease-in duration-75 bg-[#EBEBE4] rounded-md text-black cursor-not-allowed"}>
                    { startLoadingEntrance ? <p>Entrée en cours...</p> : <p>Effectuer une entrée</p>} 
                    </span>
                </button>
            </div>

        </form>
        {responseMsg.msg && 
        <div className='border border-black border-3 p-4 text-center bg-white mb-4 text-base flex flex-col items-center'>
        <p style={{color:responseMsg.color}} className=''>{responseMsg.msg}</p>
            { responseMsg.offre === "jus_gratuite" && <img className="w-[100px] mt-4" src={jus_orange} alt="jus orange offert"/> }
            { responseMsg.offre === "entree_gratuite" && <img className="w-[100px] mt-4" src={gift} alt="entree gratuite"/> }
            { responseMsg.offre === "pas_offre" && <img className="w-[100px] mt-4" src={spa} alt="pas d'offert"/> }
        </div>
        }

        { startLoadingEntrance && <div className='flex justify-center mb-8'><img className="w-[100px] mt-4" src={loading} alt="chargement"/></div> }
        {
            singleUser &&
            <CarteFidelite
            nom={singleUser?.nom ?? ''}
            prenom={singleUser?.prenom ?? ''}
            telephone={singleUser?.telephone ?? ''}
            pointFidelite={singleUser?.point_fidelite ?? ''}
            />
        }


    </div>
    </>
  )
}
