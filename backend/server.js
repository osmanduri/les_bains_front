const express = require('express') ;
const bodyParser = require('body-parser');
require('dotenv').config()
require('./Model/dbConnection')
var cors = require('cors')
const cookieParser = require('cookie-parser');
var app = express()
const userRoute = require('./Routes/userRoute')
const smsRoute = require('./Routes/smsRoute')
const {sendSmsBirthday15Days} = require('./Controllers/sms'); 
const { filterDataBaseBirthday15Days } = require('./Controllers/sms')
/*const allowedOrigins = ['https://www.elegance-drive-paris.com', 'https://elegance-drive-paris.com', 'http://localhost:5173'];

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};*/



app.use(cors({
  origin: 'http://localhost:3001',  // Remplacez par l'URL de votre application React
  credentials: true,
}));

app.use(cookieParser());

// Ajoutez les middlewares body-parser pour traiter les données de la requête
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// TEST DE L'API
app.get('/healthy', (req, res) => {
  res.json({ status: 'healthy' });
});

app.use('/api/users', userRoute);
app.use('/api/sms', smsRoute)

sendSmsBirthday15Days();

//filterDataBaseBirthday15Days();

// Lancez le serveur sur le port: PORT
app.listen(process.env.PORT, () => {
  console.log('Le serveur est en cours d\'exécution sur le port ' + process.env.PORT);
});