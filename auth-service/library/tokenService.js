/**
 * Primary module for 
 * Signing a token
 * verifying token
 * Decoding token
 */
/** Node JS Dependency */
const jwt   =  require('jsonwebtoken')
const fs    =  require('fs')
const path  = require('path')

const privateKey    = fs.readFileSync( path.join(__dirname,'./certificates/private.key'),'utf8')
const publicKey      = fs.readFileSync( path.join(__dirname, './certificates/public.key'), 'utf8')
module.exports = {
    sign: (payload, _options) => {
        /**
         sampleOptions = {
             issuer: "Authorization/Resource/this server",
             subject: "iam@user.me",
             audience: "client_app_id"
         }
         */
        // Token signing options
        let signOptions = {
            issuer:     _options.issuer,
            subject:    _options.subject,
            audience:   _options.audience,
            expiresIn:  "30d",
            algorithm: "RS256"
        }

        return jwt.sign(payload, privateKey, signOptions)
    },
    verify: ( token, _options ) => {
        // Token signing options
        let verifyOption = {
            issuer: _options.issuer,
            subject: _options.subject,
            audience: _options.audience,
            expiresIn: "30d",
            algorithm: ["RS256"]
        }

        try{
            return jwt.verify(token, publicKey, verifyOption)
        }catch(err) {
            return false
        }
    },
    decode: (token) => {
        return jwt.decode(token, {complete: true});
     }

}