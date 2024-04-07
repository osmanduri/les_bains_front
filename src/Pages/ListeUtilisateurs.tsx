import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SearchUsers from '../Components/SearchUsers';
import AddUser from '../Components/Modal/AddUser';
import SinglePerson from '../Components/SinglePerson';
import { FaCircleArrowLeft } from "react-icons/fa6";
import { Link } from 'react-router-dom';
import Cookies from 'universal-cookie';
import { MdLogout } from "react-icons/md";
import Hero from '../Components/Hero';

export default function ListeUtilisateurs() {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [modalIsOpen, setIsOpen] = useState<boolean>(false);
  const [updateListeClient, setUpdateListeClient] = useState<boolean>(false)
  const [choixFiltre, setChoixFiltre] = useState<string>('')
  const [inputSearchFilter, setInputSearchFilter] = useState<string>('')
  const cookies = new Cookies();

  useEffect(() => {
    fetchUsers();
  }, [currentPage, updateListeClient]); // Rerender le composant lors du changement de page

  const fetchUsers = async () => {
    const payload = {
      filterOption:choixFiltre,
      value: inputSearchFilter
    }
    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL_PROD}/api/users/getAllFilter?page=${currentPage}`, payload,{
        headers:{
          token: `Bearer ${cookies.get('token')}`
        }
      });
      setUsers(response.data.users);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
    }
  };

  const handlePageChange = (newPage:number) => {
    setCurrentPage(newPage);
  };

  function handleDisconnect(){
    const cookies = new Cookies();
    // Supprimer le cookie "token"
    cookies.remove('token');

    // Naviguer vers la page "/login"
    setTimeout(() => {
      window.location.href = '/'
    }, 500)
    
  }


  return (
    <>
    <Hero/>
      <div className="mt-8" />
      <SearchUsers choixFiltre={choixFiltre} setChoixFiltre={setChoixFiltre} setInputSearchFilter={setInputSearchFilter} fetchUsers={fetchUsers}/>
      <div className="w-full">
        <AddUser modalIsOpen={modalIsOpen} setIsOpen={setIsOpen} setUpdateListeClient={setUpdateListeClient}/>
      </div>
      <div className='container mx-auto text-right flex justify-end items-center p-4 gap-2'><p>Déconnexion</p><MdLogout size={40} style={{cursor:"pointer"}} onClick={handleDisconnect}/></div>
      <div className="container mx-auto p-6 font-mono flex justify-end">
        <div
          className="px-4 py-3 bg-blue-700 text-white rounded cursor-pointer text-sm"
          onClick={() => setIsOpen(true)}
        >
          Ajouter un client
        </div>
      </div>
      <section className="container mx-auto p-6 font-mono">
      <Link to="/"><div className='mb-4'><FaCircleArrowLeft size={40}/></div></Link>
        <div className="w-full mb-8 overflow-hidden rounded-lg shadow-lg">
          <div className="w-full overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-md font-semibold tracking-wide text-left text-gray-900 bg-gray-100 uppercase border-b border-gray-600">
                  <th className="px-4 py-3 bg-black text-white border-white border-r-[1px] w-[300px] max-lg:w-[150px]">Client</th>
                  <th className="px-4 py-3 bg-black text-white border-white border-r-[1px]">Points</th>
                  <th className="px-4 py-3 bg-black text-white border-white border-r-[1px]">Téléphone</th>
                  <th className="px-4 py-3 bg-black text-white ">Derniere entrée</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {
                  users?.map((e, index) => (
                  <SinglePerson key={index} element={e} setUpdateListeClient={setUpdateListeClient}/>
                ))
                }
              </tbody>
            </table>
          </div>
        </div>
        {users.length === 0 && <p className='uppercase border border-black p-2'>Aucun Clients</p>}
      </section>

      <div className="container mx-auto p-6 font-mono flex justify-end space-x-2">
        {[...Array(totalPages).keys()].map((pageNumber) => (
          <button
            key={pageNumber + 1}
            onClick={() => handlePageChange(pageNumber + 1)}
            className={`px-4 py-2 bg-blue-500 text-white rounded cursor-pointer ${
              pageNumber + 1 === currentPage ? 'bg-opacity-70' : ''
            }`}
          >
            {pageNumber + 1}
          </button>
        ))}
      </div>
    </>
  );
}
