const router = require('express').Router()
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);
const cron = require('node-cron')
const userModel = require('../Model/userModel')
const PhoneNumber = require('libphonenumber-js');

module.exports.send = (req, res) => {
    client.messages
    .create({
        body: req.body.msg,
        from: "LES BAINS",
        to: '+33627024424'
    })
    .then(message => console.log(message))
    .catch(err => {
        console.log(err)
    })

    res.send('sms sent !')
}

function convertToInternationalFormat(phoneNumber) {
    try {
      const parsedNumber = PhoneNumber.parse(phoneNumber, 'FR'); // 'FR' pour la France, ajustez si nécessaire
      const internationalFormat = PhoneNumber.format(parsedNumber, 'INTERNATIONAL');
      return internationalFormat;
    } catch (error) {
      console.error('Erreur lors de la conversion du numéro de téléphone :', error.message);
      return null; // Gestion de l'erreur
    }
  }

  module.exports.sendSmsBirthday15Days = () => {
    cron.schedule('53 18 * * *', async () => {
        console.log('Lancement de cron schedule à :', new Date());
        const users = await this.filterDataBaseBirthday15Days();

        if (users.length > 0) {
            console.log("Anniversaire prévu dans 15 jours pour :", users.length, "utilisateurs.");
            Promise.all(users.map(user => {
                const internationalPhoneNumber = convertToInternationalFormat(user.telephone);
                if (internationalPhoneNumber) {
                  let messageToSend = "Bonjour " +user.prenom+", votre anniv approche et Les Bains d'Aulnay vous offrent une promo spéciale. Profitez-en!";
                  console.log(messageToSend) 

                    return client.messages.create({
                        body: messageToSend,
                        from: "LES BAINS", // Assurez-vous que c'est le bon ID si supporté.
                        to: internationalPhoneNumber
                    });
                } else {
                    console.log('Problème avec le numéro de téléphone de', user.prenom);
                }
            })).then(results => console.log("Messages envoyés avec succès :", results))
              .catch(err => console.error("Erreur lors de l'envoi des messages :", err));
        } else {
            console.log("Pas d'anniversaire prévu dans 15 jours.");
        }
    }, {
        scheduled: true,
        timezone: "Europe/Paris"
    });
};

module.exports.filterDataBaseBirthday15Days = async () => {

    let query =
    [
        {
          '$addFields': {
            'birthdate': {
              '$dateFromString': {
                'dateString': '$date_naissance'
              }
            }, 
            'date15': {
              '$dateAdd': {
                'startDate': new Date(), 
                'unit': 'day', 
                'amount': 15
              }
            }
          }
        }, {
          '$addFields': {
            'birthdateString': {
              '$dateToString': {
                'date': '$birthdate', 
                'format': '%m-%d'
              }
            }, 
            'date15String': {
              '$dateToString': {
                'date': '$date15', 
                'format': '%m-%d'
              }
            }
          }
        }, {
          '$match': {
            '$expr': {
              '$eq': [
                '$birthdateString', '$date15String'
              ]
            }
          }
        }, {
          '$group': {
            '_id': '$_id', 
            'total': {
              '$sum': 1
            }, 
            'prenom': {
              '$first': '$prenom'
            }, 
            'nom': {
              '$first': '$nom'
            }, 
            'telephone': {
              '$first': '$telephone'
            }
          }
        }, {
          '$project': {
            'prenom': 1, 
            'nom': 1, 
            'telephone': 1, 
            '_id': 0, 
            'user_id': {
              '$toString': '$_id'
            }
          }
        }
      ]

      const userBirthday15 = await userModel.aggregate(query)

      return userBirthday15     
}