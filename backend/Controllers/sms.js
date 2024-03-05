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
        from: '+13392204475',
        to: '+33 6 27 02 44 24'
    })
    .then(message => console.log(message.sid))
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
    cron.schedule('54 13 * * *', async () => {
       const users = await this.filterDataBaseBirthday15Days()

       if(users.length > 0){
        console.log("Anniverssaire prévu dans 15 jours !!!")
        console.log(users)
        users.forEach(e => {
            const internationalPhoneNumber = convertToInternationalFormat(e.telephone);
            if(internationalPhoneNumber){
                const messageToSend = `Bonjour ${e.prenom} !

                🎉 Dans 15 jours, c'est votre jour spécial ! 🎉
                L'équipe des bains d'aulnay souhaite que votre anniversaire soit aussi exceptionnel que vous. Nous attendons votre visite pour égayer cette journée !
                Joyeux anniversaire en avance !
                                
                Bien à vous,
                Les Bains D'Aulnay 😀`

    
                client.messages
                    .create({
                    body: messageToSend,
                    from: '+13392204475',
                    to: internationalPhoneNumber
                    })
                    .then(message => console.log(message.sid))
                    .catch(err => {
                    console.log(err)
                    })
            }else{
                console.log('Probleme avec le numéro de telephone')
            }
            console.log(internationalPhoneNumber)
        })
       }else{
        console.log("Pas d'anniverssaire de prévu dans 15 jours :(")
       }
    }, {
        scheduled: true,
        timezone: "Europe/Paris"
      })
}

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