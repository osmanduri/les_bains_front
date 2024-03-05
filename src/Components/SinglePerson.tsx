import React, {useState} from 'react'
import { Link } from 'react-router-dom';
import profile_pic from '/images/profile/unknown_user.png'
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin6Fill } from "react-icons/ri";
import DeleteUser from './Modal/DeleteUser';
import moment from 'moment-timezone'
interface Props {
    element: {
      prenom: string;
      nom: string;
      point_fidelite: number;
      telephone: string;
      date_creation_user: string;
      _id:string;
      derniere_entree: Date;
    };
    setUpdateListeClient:React.Dispatch<React.SetStateAction<boolean>>;
  }

export default function SinglePerson({element, setUpdateListeClient}:Props) {
    const [modalIsOpen, setIsOpen] = useState<boolean>(false);


    return (
        <>
        <DeleteUser modalIsOpen={modalIsOpen} setIsOpen={setIsOpen} nom={element.nom} prenom={element.prenom} userId={element._id} setUpdateListeClient={setUpdateListeClient}/>
        <tr className="text-gray-700">
            <td className="px-4 py-3 border">
            <div className="flex items-center text-sm">
            <Link to={`/client/${element._id}`}><div className="relative w-8 h-8 mr-3 rounded-full">
                <img className="object-cover w-full h-full rounded-full" src={profile_pic} alt="" loading="lazy" />
                <div className="absolute inset-0 rounded-full shadow-inner" aria-hidden="true"></div>
                </div></Link>
                <div>
                <p className="font-semibold capitalize">{element.prenom}</p>
                <p className="text-gray-600 capitalize">{element.nom}</p>
                </div>
            </div>
            </td>
            <td className="px-4 py-3 text-md font-semibold border">{element.point_fidelite}</td>
            <td className="px-2 py-3 text-sm border">
            <span className="px-2 py-1">{element.telephone}</span>
            </td>
            <td className="px-4 py-3 text-sm border flex justify-between items-center h-[65px]">
                <div>
                { element.derniere_entree ? moment(element.derniere_entree).tz("Europe/Paris").format('DD/MM/YYYY - HH:mm').toString() : <p>----</p>} 
                </div>
                <div className='flex gap-4 max-sm:flex-col'>
                    <Link to={`/client/${element._id}`}>
                        <FaEdit size={20} style={{cursor:"pointer"}}/>
                    </Link>
                    <RiDeleteBin6Fill size={20} style={{cursor:"pointer"}} onClick={() => setIsOpen(true)}/>
                </div>
            </td>
        </tr>
        </>
      )
}
