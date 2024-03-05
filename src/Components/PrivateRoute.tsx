import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'universal-cookie';
import { Outlet, useNavigate } from 'react-router-dom';

const PrivateRoute = () => {
  const [connected, setConnected] = useState(false);
  const navigate = useNavigate(); // Utilisation de useNavigate pour la navigation
  const cookies = new Cookies();

  useEffect(() => {
    

    async function verifyIsConnected() {
      try {
        const response = await axios.get('http://localhost:5001/api/users/verifyConnected/', {
          headers: {
            token: `Bearer ${cookies.get('token')}`
          }
        });

        console.log(response.data);

        if (response.data === "connected!") {
          setConnected(true);
        } else {
          setConnected(false);
          // Rediriger vers /login si l'utilisateur n'est pas connecté
          navigate('/login');
        }
      } catch (error) {
        console.log(error);
        navigate('/login');
        // Gérer les erreurs, par exemple, rediriger vers une page d'erreur
      }
    }

    verifyIsConnected();
  }, [navigate, cookies]); // Utiliser navigate comme dépendance

  return connected ? <Outlet /> : null; // Rendre Outlet seulement si l'utilisateur est connecté
};

export default PrivateRoute;
