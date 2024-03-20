import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';
import { Outlet, useNavigate } from 'react-router-dom';

export default function PrivateRouteAdmin() {
    const [isAdmin, setIsAdmin] = useState(false);
    const navigate = useNavigate(); // Utilisation de useNavigate pour la navigation
    const cookies = new Cookies();
    
    useEffect(() => {

        async function verifyIsAdmin() {
          try {
            const response = await axios.get(`${process.env.REACT_APP_BASE_URL_LOCALHOST}/api/users/verifyIdentify`, {
              headers: {
                token: `Bearer ${cookies.get('token')}`
              }
            });
    
            if (response.data === "isAdmin") {
                setIsAdmin(true);
            } else if(response.data === "isNotAdmin"){
                setIsAdmin(false);

              // Rediriger vers /login si l'utilisateur n'est pas connecté
              navigate('/');
            }else{
                console.log('Interdiction')
                navigate('/');
            }
          } catch (error) {
            navigate('/');
            console.log(error);
            // Gérer les erreurs, par exemple, rediriger vers une page d'erreur
          }
        }
    
        verifyIsAdmin();
      }, [navigate, cookies]); // Utiliser navigate comme dépendance
      return isAdmin ? <Outlet /> : null; // Rendre Outlet seulement si l'utilisateur est connecté
}
