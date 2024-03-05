import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './Pages/Login'
import ListeUtilisateurs from './Pages/ListeUtilisateurs'
import UtilisateurId from './Pages/UtilisateurId'
import PrivateRoute from './Components/PrivateRoute'
import PrivateRouteAdmin from './Components/PrivateRouteAdmin'
import Cookies from 'universal-cookie';
import Menu from './Pages/Menu'
import FaireUneEntree from './Pages/FaireUneEntree'
import Hero from './Components/Hero'
import NotFound from './Pages/NotFound'
import AjouterClient from './Components/AjouterClient'

function App() {

  const cookies = new Cookies();


    // Fonction de vérification d'authentification
    const isAuthenticated = () => {
      // Vérifiez la présence du token dans les cookies ou utilisez votre logique d'authentification
      const token = cookies.get('token'); // Remplacez 'votre_token' par la clé utilisée pour stocker le token
  
      return !!token; // Renvoie true si le token est présent, sinon false
    };

  return (
    <div className='bg-[#F5F5F4]'>
      
      <BrowserRouter>
          <Routes>
          <Route path="/login" element={isAuthenticated() ? <Navigate to="/" /> : <Login/>}/>
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<Menu/>}/>
            
            <Route element={<PrivateRouteAdmin/>}>
              <Route path="/client" element={<ListeUtilisateurs/>}/>
              <Route path="/client/:id" element={<UtilisateurId/>}/>
            </Route>

            <Route path="/faire_une_entree" element={<FaireUneEntree/>}/>
            <Route path="/ajouter_client" element={<AjouterClient/>}/>
            <Route path="/not_found" element={<NotFound/>}/>
            <Route path="*" element={<Navigate to="/" replace={true} />} />
          </Route>

          </Routes>
      </BrowserRouter>
    </div>
)
}
export default App
