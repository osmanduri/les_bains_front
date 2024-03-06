const userModel = require('../Model/userModel')
const adminModel = require('../Model/adminModel')
const ObjectID = require('mongoose').Types.ObjectId
const moment = require('moment')
moment.locale('fr')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const verifyConnected = async (req, res) => {
    res.send('connected!')
}

const addAdmin = async (req, res) => {
    try{
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(req.body.password, salt)

        const newAdmin = new adminModel({
            email:req.body.email,
            password: hashedPass,
            isAdmin:req.body.isAdmin
        })

        const savedUser = await newAdmin.save()

        res.status(200).send(savedUser);
    }catch(err){
        res.status(400).send(err)
    }
}

const getAdminById = async (req, res) => {
    if (!ObjectID.isValid(req.params.id))
    return res.status(400).send('Utilisateur inconnu ' + req.params.id)
    try{
        const user = await adminModel.findById(req.params.id).select("-password")

        res.send(user)
    }catch(err){
        res.status(400).send(err)
    }
}

const getAllClient = async (req, res) => {
    try{
        const AllUser = await userModel.find()

        res.status(200).send(AllUser);
    }catch(err){
        res.status(400).send(err)
    }
}

const getAllClientParPage = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const pageSize = 8;

    try {
        let query = {};  // Initialisez la requête avec un objet vide

        // Vérifiez si le paramètre de recherche par nom est présent dans la requête

        switch(req.body.filterOption){
            case 'nom':{
                query = { nom: { $regex: new RegExp(req.body.value, 'i') } };
                break;
            }
            case 'prenom':{
                query = { prenom: { $regex: new RegExp(req.body.value, 'i') } };
                break;
            }
            case 'phone':{
                query = { telephone: { $regex: new RegExp(req.body.value, 'i') } };
                break;
            }
            case 'point':{
                query = { point_fidelite: parseInt(req.body.value)};
                if(!req.body.value){
                    query = {}
                }
                break;
            }
        }
        

        const totalCount = await userModel.countDocuments(query);
        const totalPages = Math.ceil(totalCount / pageSize);

        const users = await userModel
            .find(query)
            .sort({ derniere_entree: -1 })
            .skip((page - 1) * pageSize)
            .limit(pageSize);

        res.status(200).json({
            users,
            totalPages,
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs :', error);
        res.status(500).json({ message: 'Erreur serveur lors de la récupération des utilisateurs.' });
    }
}

const getAllClientById = async (req, res) => {
    if (!ObjectID.isValid(req.params.id))
    return res.status(404).send('Utilisateur inconnu ' + req.params.id)
    try{
        const userById = await userModel.findById(req.params.id)

        res.status(200).send(userById);
    }catch(err){
        err.status(400).send(err)
    }
}

const addClient = async (req, res) => {

    try{        
        const newUser = new userModel({
            nom: req.body.nom,
            prenom:req.body.prenom,
            telephone:req.body.telephone,
            email:req.body.email,
            date_naissance:req.body.date_naissance,
            point_fidelite:req.body.point_fidelite,
        })

        const savedUser = await newUser.save()

        res.status(200).send(savedUser);
    }catch(err){
        console.log(err)
        res.status(400).send(err)
    }
}

const updateClient = async (req, res) => {
    if (!ObjectID.isValid(req.params.id))
    return res.status(400).send('Utilisateur inconnu ' + req.params.id)
    try {
        const id = req.params.id;

        console.log(req.body.point_fidelite)

        // Utilisez uniquement les champs présents dans le corps de la requête pour la mise à jour
        const updateFields = {
            ...(req.body.nom && { nom: req.body.nom }),
            ...(req.body.prenom && { prenom: req.body.prenom }),
            ...(req.body.telephone && { telephone: req.body.telephone }),
            ...(req.body.email && { email: req.body.email }),
            ...(req.body.date_naissance && { date_naissance: req.body.date_naissance }),
            ...({ point_fidelite: req.body.point_fidelite }),
        };

        console.log(updateFields)
        const utilisateurMisAJour = await userModel.findOneAndUpdate(
            { _id: id },
            { $set: updateFields },
            { new: true }
        );

        if (!utilisateurMisAJour) {
            return res.status(404).send("Utilisateur non trouvé");
        }

        res.status(200).send({message:"Le client a été mis à jour!", client:utilisateurMisAJour});
    } catch (err) {
        res.status(400).send(err.message);
    }
};

const deleteClientById = async (req, res) => {
    if (!ObjectID.isValid(req.params.id))
    return res.status(400).send('Utilisateur inconnu ' + req.params.id)
    const clientId = req.params.id; // Récupérer l'ID du client depuis les paramètres de la requête

    try {
        // Vérifier si l'ID est valide

        // Essayer de trouver le client par son ID et le supprimer
        const deletedUser = await userModel.findByIdAndDelete(clientId);

        // Vérifier si le client a été trouvé et supprimé avec succès
        if (!deletedUser) {
            return res.status(404).json({ message: 'Client non trouvé.' });
        }

        res.status(200).json({ message: 'Client supprimé avec succès.', deletedUser });
    } catch (error) {
        console.error('Erreur lors de la suppression du client :', error);
        res.status(500).json({ message: 'Erreur serveur lors de la suppression du client.' });
    }
};



const login = async (req, res) => {
    try {
        const user = await adminModel.findOne({email: req.body.email});

        if (!user) {
            return res.json({message: "Utilisateur inconnue !"});
        }

        const decryptPassword = await bcrypt.compare(req.body.password, user.password);

        if (!decryptPassword) {
            return res.json({message: "Mot de passe incorrect !"});
        }

        // Génération du token d'accès
        const token = jwt.sign(
            { id: user._id, isAdmin: user.isAdmin },
            process.env.JWT_SEC,
            { expiresIn: "1y" }
        );

        // Génération du refresh token
        const refreshToken = jwt.sign(
            { id: user._id, isAdmin: user.isAdmin },
            process.env.REFRESH_TOKEN_SECRET, // Assurez-vous d'avoir cette clé secrète dans vos variables d'environnement
            { expiresIn: "1y" } // Vous pouvez ajuster la durée selon vos besoins
        );

        // Stocker le refresh token dans la base de données ou dans un stockage sécurisé côté serveur
        // Par exemple, ajouter le refresh token à l'utilisateur dans la base de données
        // Cela dépend de votre modèle de données et de votre implémentation
        // user.refreshToken = refreshToken;
        // await user.save();

        const cookieOptions = {
            httpOnly: true,
            maxAge: 3600000,
            secure: false, // Assurez-vous que secure est false en développement
            sameSite: 'Lax', // Ou 'None' si vous utilisez HTTPS en développement
            path: '/',
        };
        
    
        // Définir le cookie
        res.cookie('tokenTest', 'Bearer 123', cookieOptions);

        const { password, ...others } = user._doc; // Assurez-vous que cela ne renvoie pas le refresh token ou d'autres données sensibles

        // Envoyer le token et le refresh token à l'utilisateur
        res.status(200).send({ ...others, token, refreshToken });
    } catch (err) {
        res.status(400).send(err);
    }
};

const rechercheParNumeroDeTel = async (req, res) => {
    console.log(req.body.tel)
    try{
        const users = await userModel.find()
        const filteredNumber = [];
        users.forEach(e => {
            if(e.telephone.includes(req.body.tel)){
                filteredNumber.push(e)
            }
        })
        res.status(200).send(filteredNumber)
    }catch(err){
        res.status(400).send(err)
    }

}

const entrance = async (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send('Utilisateur inconnu ' + req.params.id);

    const pointsOfferts = 100;
    const pointsJusOrange = 70;

    try {
        const user = await userModel.findById(req.params.id);

        if (verifyEntrance(user.derniere_entree)) {
            console.log('Utilisateur autorisé à entrer');

            const newPointsFidelite = user.point_fidelite + 10;

            let message = "Bienvenue ! Vous avez gagné 10 points de fidélité, et vous avez actuellement (" + newPointsFidelite + ") points de fidélité au total !";

            if (newPointsFidelite >= pointsOfferts) {
                // Remettre les points à 0 et envoyer un message pour une entrée offerte
                message = "Félicitations ! Vous avez atteint les 100 points de fidélité, vous pouvez désormais bénéficier d'une entrée gratuite. (Hors Gommage)";
                const updatedUser = await userModel.findByIdAndUpdate(req.params.id, {
                    $set: { derniere_entree: new Date(), point_fidelite: 0, entree_total: user.entree_total + 1 }
                }, { new: true });
                return res.status(200).json({ message, user: updatedUser, offre:"entree_gratuite" });
            } else if (newPointsFidelite === pointsJusOrange) {
                // Envoyer un message pour un jus d'orange gratuit
                message = "Félicitations ! Vous avez atteint les 70 points de fidélité, vous pouvez désormais bénéficier d'un jus d'orange offert.";
                const updatedUser = await userModel.findByIdAndUpdate(req.params.id, {
                    $set: { derniere_entree: new Date(), point_fidelite: newPointsFidelite, entree_total: user.entree_total + 1 }
                }, { new: true });
                return res.status(200).json({ message, user: updatedUser, offre:"jus_gratuite" });
            } else {
                // Mise à jour normale sans récompense spéciale
                const updatedUser = await userModel.findByIdAndUpdate(req.params.id, {
                    $set: { derniere_entree: new Date(), point_fidelite: newPointsFidelite, entree_total: user.entree_total + 1 }
                }, { new: true });
                return res.status(200).json({ message, user: updatedUser, offre:"pas_offre" });
            }
        } else {
            console.log('Utilisateur non autorisé à entrer')
            return res.status(201).send("Une période d'intervalle de plus de 12 heures est requise pour accéder à nos services avec élégance.");
        }
    } catch (err) {
        console.error(err);
        return res.status(500).send("Une erreur s'est produite lors du traitement de la demande.");
    }
};


function verifyEntrance(lastEntrance){
    // Supposons que lastEntrance soit la dernière date d'entrée du client
    //const lastEntrance = new Date('2024-02-29T02:00:00'); // Remplacez ceci par la vraie date de la dernière entrée
    if(lastEntrance === null){
        return true;
    }
    // Obtenez la date actuelle
    const dateActuelle = new Date();

    // Configurez la zone horaire à Paris (Europe/Paris)
    const options = { timeZone: 'Europe/Paris' };
    const dateActuelleParis = dateActuelle.toLocaleString('en-US', options);
    const lastEntranceParis = lastEntrance.toLocaleString('en-US', options);

    // Calculer la différence en millisecondes entre les deux dates
    const differenceEnMillisecondes = new Date(dateActuelleParis) - new Date(lastEntranceParis);

    // Convertir la différence en heures
    const differenceEnHeures = differenceEnMillisecondes / (1000 * 60 * 60);

    // Autoriser l'entrée si la différence est supérieure à 12 heures
    if (differenceEnHeures > 12) {
        return true;
    } else {
        return false;
    }
}

const verifyIsUserOrAdmin = (req, res) => {
    if(req.user.isAdmin === true){
        return res.send("isAdmin")
    }else if(req.user.isAdmin === false){
        return res.send("isNotAdmin")
    }else{
        return res.send("unknown")
    }
    
}

const setCookies = (req, res) => {
    // Exemple de configuration de cookie
    const cookieOptions = {
        httpOnly: true,
        maxAge: 3600000,
        secure: false, // Assurez-vous que secure est false en développement
        sameSite: 'Lax', // Ou 'None' si vous utilisez HTTPS en développement
        path: '/',
    };
    

    // Définir le cookie
    res.cookie('tokenTest', 'Bearer 123', cookieOptions);

    // Vous pouvez également définir plusieurs cookies en appelant plusieurs fois res.cookie
    // res.cookie('autreCookie', 'valeurAutreCookie', autreOptions);

    // Autre logique de la route ici...

    // Envoyer la réponse
    res.send('Cookies définis avec succès !');
};

module.exports = { setCookies, verifyConnected, addAdmin, getAdminById, getAllClient, getAllClientParPage, getAllClientById, addClient, updateClient, deleteClientById, login, rechercheParNumeroDeTel, entrance, verifyIsUserOrAdmin }