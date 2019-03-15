/** Express */
const express = require('express')
const app = express()
/** Axios and circular-json*/
const axios = require('axios')
const circularJSON = require('circular-json')

/** Body parser */
const bodyParser = require('body-parser')
app.use(bodyParser.json())

/** Middleware for token */
const _tokenVerifyer = require('./lib/middleware/tokenVerifyer')

/** Lib dependencies */
let _conf = require('./lib/conf')

//** */ Static page
app.use(express.static('./public/'))

/** LOGIN */
app.post( '/login', (req, res) =>{

    // Validate username and password once successful proceed on providing token

    let userPayload = {
        "data": {
			"uid": 1,
			"email": "user1@gmail.com"
        },
    
        "signature": {
            "issuer": "JayveeGerero",
            "subject": "client@myapp.com",
            "audience": "myapp.com"
        }
    }

    axios.post(`${_conf.services.auth}/api/v1/generate`, userPayload)
    .then( (response) => {
        let strResponse = circularJSON.stringify(response.data)
        let jsonResponse = JSON.parse(strResponse)
        res.json(jsonResponse)
    })
    .catch((err) => {
        res.json({error: true, message: "Error on getting generated token from auth"})
    })
})

/** DASHBOARD */
app.get('/dashboard',  _tokenVerifyer.checkToken, (req, res)=>{
    res.json( {error: false, message: ' WELCOME TO DASHBOARD!'})
})

/** Application start at port */
app.listen( _conf.port, () => console.log(`Accounts service is running at PORT `, _conf.port) )