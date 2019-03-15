/**
 * Primary module for authenticating request using Token passes thru header
 */

/** token Service provider dependency */
const tokenService = require('./tokenService')
module.exports = {
    checkToken: (token) =>{    
        if( token ){

            if( token.startsWith('Bearer ')){
                token = token.slice(7, token.length);
            }
            
            let decryptedToken = tokenService.decode( token )

            if( decryptedToken ) {
                
                let isValidToken = tokenService.verify(token, decryptedToken.payload)

                if(!isValidToken){
                    return {
                        error: false,
                        message: 'Auth token supplied is not valid'
                    };
                }else{
                    return{
                        error: false,
                        message: isValidToken
                    }; 
                }

            }else{
                return{
                    error: true,
                    message: 'Auth token supplied is not valid'
                };  
            }

        }else{
            return {
                error: false,
                message: 'Auth token is not supplied'
            };
        }
    }
}
