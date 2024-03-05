import React from 'react'
import { PiUserListFill } from "react-icons/pi";
import { GiExitDoor } from "react-icons/gi";
import { FaUserPlus } from "react-icons/fa";

interface CardsMenuProps{
    titre1:string;
    titre2:string;
    link:string;
}

export default function CardsMenu({titre1, titre2, link}:CardsMenuProps) {
  return (
    <div className="h-44 w-32 bg-gray-100 rounded-xl flex flex-col justify-center shadow duration-300 hover:bg-white hover:shadow-xl">
        { link === "faire_une_entree" && <div className='flex justify-center'><GiExitDoor size={50}/></div> }
        { link === "client" && <div className='flex justify-center'><PiUserListFill size={50}/></div> }
        { link === "ajouter_client" && <div className='flex justify-center'><FaUserPlus size={50}/></div> }
        <span className="mt-6 text-sm ?leading-5 font-semibold text-center">{titre1}<br/>{titre2}</span>
    </div>
  )
}
