import React, {useState,useEffect} from 'react'
import carte_fidelite from '/images/carte_fidelite/carte_fidelite.jpg'

interface CarteFideliteProps{
    nom:string;
    prenom:string;
    telephone:string;
    pointFidelite:number;
}


export default function CarteFidelite({ nom, prenom, telephone, pointFidelite }:CarteFideliteProps) {
    
    const [tab, setTab] = useState(initTabFidelity())
    useEffect(() => {
        initTabFidelity();
    }, [])

    function initTabFidelity(){
        var monTableau = new Array(10);
        for (var i = 0; i < monTableau.length; i++) {
            monTableau[i] = "Valeur " + (i + 1);
        }
        return monTableau;
    }

  return (
    <article className="relative isolate flex flex-col justify-end overflow-hidden rounded-2xl max-w-xl mx-auto p-6 mb-12">
        <div className='z-10 text-white text-center'>
            <h1 className='uppercase font-extrabold '>Les bains d'aulnay</h1>
            <h2 className='font-normal'>Vous récompense de votre fidélité</h2>
        </div>
        <div className='z-10 text-white mt-4'>
            <div className='flex justify-between'>
            <div>
                <p className='uppercase'>Nom: <span className='font-normal'>{nom}</span></p>
                <p className='uppercase'>Prenom: <span className='font-normal'>{prenom}</span></p>
            </div>
            <div>
                <p className='uppercase'>Tel: <span className='font-normal'>{telephone}</span></p>
                <p className='uppercase'>Points: <span className='font-normal'>{pointFidelite}</span></p>
            </div>
            </div>



        </div>
        <div className='z-10 flex justify-center mt-6'>
            <div className='z-10 text-white mt-1 flex flex-wrap justify-center gap-12 w-[350px]'>
                {
                    tab.map((e, index) => {
                        return (
                            <div key={index} className='p-1 border border-white border-3 flex justify-center items-center w-[30px] h-[25px]'>
                                <div style={(pointFidelite / 10) > index ? {background:"white", width:"20px", height:"15px"} : {}}></div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
        <img src={carte_fidelite} alt="University of Southern California" className="absolute inset-0 h-full w-full object-cover brightness-75"/>
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40"></div>
    </article>
  )
}
