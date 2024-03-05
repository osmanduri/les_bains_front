import React from 'react'
// @ts-ignore
import Modal from 'react-modal';
import axios from 'axios'
import Cookies from 'universal-cookie';

interface ModalStripeProps {
    modalIsOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    nom: string;
    prenom:string;
    userId:string;
    setUpdateListeClient:React.Dispatch<React.SetStateAction<boolean>>;
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

export default function DeleteUser({ modalIsOpen, setIsOpen, nom, prenom, userId, setUpdateListeClient }:ModalStripeProps) {
    const cookies = new Cookies();
    async function handleDeleteUser(e:any){
        e.preventDefault()
    
        try{
            const response = await axios.delete(`http://localhost:5001/api/users/deleteClient/${userId}`, {
              headers:{
                token: `Bearer ${cookies.get('token')}`
            }
            })

            if(response.status === 200){
                setIsOpen(false)
                setUpdateListeClient(prev => !prev)
            }

            console.log(response.data)
        }catch(err){
            console.log(err)
        }
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


  return (
    <Modal
    isOpen={modalIsOpen}
    onAfterOpen={afterOpenModal}
    onRequestClose={closeModal}
    style={customStyles}
    contentLabel="Payment Modal"
    >
        <div>
            <form onSubmit={handleDeleteUser}>
                <p className='text-center'>Etes vous sur de vouloir supprimer: <strong className='uppercase'>{nom} {prenom}</strong> ?</p>
                <div className='flex justify-evenly mt-8'>
                    <button type="submit" className='px-4 py-2 bg-blue-700 text-white rounded-md hover:bg-blue-800 focus:outline-none focus:ring focus:border-blue-300'>Oui</button>
                    <div onClick={() => setIsOpen(false)} className='px-4 py-2 bg-red-700 text-white rounded-md hover:bg-red-900 focus:outline-none focus:ring focus:border-blue-300 cursor-pointer'>Non</div>
                </div>

            </form>
        </div>
    </Modal>
    
  )
}
