import React, {useState, useEffect} from 'react'
import { useParams, useNavigate  } from 'react-router-dom'
import CarteFidelite from '../Components/CarteFidelite'
import UpdateProfile from '../Components/UpdateProfile'
import axios from 'axios'
import Cookies from 'universal-cookie';

export default function UtilisateurId() {
    let params   = useParams();
    const navigate = useNavigate();
    const cookies = new Cookies();

    const [nom, setNom] = useState<string>('')
    const [prenom, setPrenom] = useState<string>('')
    const [telephone, setTelephone] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [dateNaissance, setDateNaissance] = useState<string>('')
    const [pointFidelite, setPointFidelite] = useState<number>(0)
    const [successfulRequest, setSuccessfulRequest] = useState<boolean>(false)

    useEffect(() => {
        setSuccessfulRequest(false)
        async function fetchUserId(){
            try{
                const res = await axios.get(`${process.env.REACT_APP_BASE_URL_LOCALHOST}/api/users/getUserById/${params.id}`,{
                    headers:{
                        token: `Bearer ${cookies.get('token')}`
                    }
                })
                setNom(res.data.nom)
                setPrenom(res.data.prenom)
                setTelephone(res.data.telephone)
                setEmail(res.data.email)
                setDateNaissance(res.data.date_naissance)
                setPointFidelite(res.data.point_fidelite)
                setSuccessfulRequest(true)

            }catch(err:any){
                console.log(err)
                if(err.response.status === 404){
                    navigate('/not_found')
                }
            }
        }
        fetchUserId();
    }, [params, navigate])
  return (
    <>
    
    { successfulRequest &&
    <section className="container mx-auto mt-4 font-mono">
    <UpdateProfile nom={nom} prenom={prenom} telephone={telephone} email={email} dateNaissance={dateNaissance} pointFidelite={pointFidelite} setNom={setNom} setPrenom={setPrenom} setTelephone={setTelephone} setEmail={setEmail} setDateNaissance={setDateNaissance} setPointFidelite={setPointFidelite}/>
    <CarteFidelite pointFidelite={pointFidelite} nom={nom} prenom={prenom} telephone={telephone}/>
    </section>
    }

    </>
  )
}
