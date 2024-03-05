import React from 'react'
import { CiCirclePlus } from "react-icons/ci";
import { CiCircleMinus } from "react-icons/ci";

interface FideliteInputProps{
  pointFidelite:number;
  setPointFidelite: React.Dispatch<React.SetStateAction<number>>;
}

export default function FideliteInput({pointFidelite, setPointFidelite}:FideliteInputProps) {
    
    function handleFidelityPoint(choix:string){

        if(choix === "plus"){
          if(pointFidelite < 100)
          setPointFidelite((prevValeur) => prevValeur + 10)
        }else if(choix === "minus"){
          if(pointFidelite > 0)
          setPointFidelite((prevValeur) => prevValeur - 10)
        }else{
          console.log('Error !')
        }
      }
  return (
    <div className="mb-4">
    <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-600 text-left">
      Point de fidélité :
    </label>
    <div className='relative'>
      <input id="fidelite" name="fidelite" className="mt-1 py-2 px-6 w-full border rounded-md outline-none placeholder:text-sm" placeholder="Entrez les points de fidelite" onChange={(e) => setPointFidelite(parseInt(e.target.value))} value={pointFidelite} readOnly required/>
      <div className='absolute top-4 right-2 gap-2 flex '>
        <div onClick={() => handleFidelityPoint('minus')} className='cursor-pointer'><CiCircleMinus size={20}/></div>
        <div onClick={() => handleFidelityPoint('plus')} className='cursor-pointer'><CiCirclePlus size={20}/></div>
      </div>
    </div>
    </div>
  )
}
