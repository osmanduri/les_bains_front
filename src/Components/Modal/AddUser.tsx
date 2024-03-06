import React, { useState } from 'react'
// @ts-ignore
import Modal from 'react-modal';
import axios from 'axios'
import loading from '/images/loading/loading.gif'
import FideliteInput from '../FideliteInput';
import Cookies from 'universal-cookie';

interface ModalStripeProps {
    modalIsOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setUpdateListeClient:React.Dispatch<React.SetStateAction<boolean>>;
  }

interface msgApi {
    msg: string;
    color: string
}
  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      boxShadow: '0px 1px 3px #000',
      overflow: 'none',
      zIndex: 9999,
      width: '90%', // Ajustez la largeur selon vos besoins, par exemple 90%
      maxWidth: '600px', // Ajustez la largeur maximale selon vos besoins
    },
    overlay: {
      backgroundColor: 'rgb(0,0,0, 0.2)',
      zIndex: 9998,
    },
  };
  
  export default function AddUser({ modalIsOpen, setIsOpen, setUpdateListeClient }: ModalStripeProps) {

    const cookies = new Cookies();
    const [nom, setNom] = useState<string>('')
    const [prenom, setPrenom] = useState<string>('')
    const [dateNaissance, setDateNaissance] = useState<string>('')
    const [telephone, setTelephone] = useState<string>('')
    const [pointFidelite, setPointFidelite] = useState<number>(0)
    const [startLoading, setStartLoading] = useState<boolean>(false)

    const [msgResponse, setMsgResponse] = useState<msgApi>({
      msg:"",
      color:""
    })

    function initState(){
      setNom('')
      setPrenom('')
      setTelephone('')
      setDateNaissance('')
      setPointFidelite(0)
    }

    Modal.setAppElement('#root');
  
    let subtitle: any;
  
    function afterOpenModal() {
      // references are now sync'd and can be accessed.
      // subtitle.style.color = '#f00';
    }
  
    function closeModal() {
      setIsOpen(false);
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
        point_fidelite:pointFidelite
      }
      setTimeout(() => {
      axios.post('http://localhost:5001/api/users/addUser', payload, {
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
          setUpdateListeClient(prev => !prev)
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
      <div>
        <Modal
          isOpen={modalIsOpen}
          onAfterOpen={afterOpenModal}
          onRequestClose={closeModal}
          style={customStyles}
          contentLabel="Payment Modal"
        >
          <h2 ref={(_subtitle) => (subtitle = _subtitle)}>Ajouter un utilisateur</h2>
          <form onSubmit={handleSubmit} className="mt-4">
          <div className="mb-4">
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-600">
                Nom :
              </label>
              <input type="text" id="lastName" name="lastName" className="mt-1 p-2 w-full border rounded-md outline-none placeholder:text-sm" placeholder="Entrez votre nom" onChange={(e) => setNom(e.target.value)} value={nom} required/>
            </div>

            <div className="mb-4">
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-600">
                Prénom :
              </label>
              <input type="text" className="mt-1 p-2 w-full border rounded-md outline-none placeholder:text-sm" placeholder="Entrez votre prénom" onChange={(e) => setPrenom(e.target.value)} value={prenom} required/>
            </div>
  
            <div className="mb-4">
              <label htmlFor="dob" className="block text-sm font-medium text-gray-600">
                Date de naissance :
              </label>
              <input type="date" className="mt-1 p-2 w-full border rounded-md outline-none placeholder:text-sm" onChange={(e) => setDateNaissance(e.target.value)} value={dateNaissance} required/>
            </div>
  
            <div className="mb-4">
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-600">
                Numéro de téléphone :
              </label>
              <input type="tel" className="mt-1 p-2 w-full border rounded-md outline-none placeholder:text-sm" placeholder="Entrez le numéro de téléphone" onChange={(e) => setTelephone(e.target.value)} value={telephone} required
              />
            </div>
            <FideliteInput pointFidelite={pointFidelite} setPointFidelite={setPointFidelite}/>
  
            <div className="mt-4 text-center flex justify-center">
              {
                startLoading ? <img className='w-[50px]' src={loading} alt="loading"/> : <button type="submit" className="px-4 py-2 bg-blue-700 text-white rounded-md hover:bg-blue-800 focus:outline-none focus:ring focus:border-blue-300">Ajouter un client</button>
              }
            </div>
            <p style={{color:msgResponse.color, textAlign:"center", marginTop:"10px"}}>{msgResponse.msg}</p>
          </form>
        </Modal>
      </div>
    );
  }
