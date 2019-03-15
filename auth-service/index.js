/** Express JS */
const express = require('express')
/** Service dependency */
const authService   =   require('./library/authService')
const tokenService  =   require('./library/tokenService')
/** Body parser */
const bodyParser    =   require('body-parser')
/** Configuration dependency */
const _config       =   require('./library/config')


/** Intantiating express APP */
let webServer = express()

/** Static page */
webServer.use( express.static('./public') )

/** Body parser */
webServer.use( bodyParser.json())

/** GENERATE TOKEN
    Required: 2 Params the Payload object and Signature obj
    Sample payload obj:
	{
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
*/
webServer.post( '/api/v1/generate', (req, res) =>{
    let params = req.body
    // Check if payload and signature was received
    let payloadObj      = typeof(params.data) == 'object'  ? params.data : false;
    let signatureObj    = typeof(params.signature) == 'object' ? params.signature : false;
    if(payloadObj && signatureObj){
        /**
         * Check if required keys in signatured are present on obj
         */
        if( typeof(signatureObj.issuer) !== 'undefined' &&
            typeof(signatureObj.subject) !== 'undefined' &&
            typeof(signatureObj.audience) !== 'undefined' ){
            let tokenGenerated = tokenService.sign(payloadObj,signatureObj)
            res.json({'error': 'false', message: tokenGenerated})
        }else{
            res.json({'error': 'true', message: 'Missing required keys on signature object. should have keys of issuer, subject and audience'})
        }
    }else{
        res.json({'error': 'true', message: params})
    }
}) 

/** Verify token */
webServer.post( '/api/v1/verify/token', (req, res)=>{
    let token = req.body.token
    let tokenResult = authService.checkToken( token )
    res.send(tokenResult)
})

/** Handles the 404 request */
webServer.use((req,res, next)=>{
    res.status(404).send(_config.message[404])
})

/** Handles the 404 request */
webServer.use((req,res, next)=>{
    res.status(500).send(_config.message[500])
})


webServer.listen( _config.port, (req, res) => {
    console.log('Web Server is running on server port:', _config.port)
})

