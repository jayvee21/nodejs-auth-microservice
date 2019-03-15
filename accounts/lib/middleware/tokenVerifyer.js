const axios = require('axios')

// Lib dependency
const _conf = require('./../conf')

module.exports = {
    checkToken: async (req, res, next) => {
        let strToken = typeof(req.headers.authorization) != 'undefined' &&  typeof(req.headers.authorization) == 'string'  && req.headers.authorization.length > 0 
        ? req.headers.authorization : false
        if( strToken ){
            await axios.post(`${_conf.services.auth}/api/v1/verify/token`, {token: strToken})
            .then((response) => {
                if( !response.data.error ){
                    next()
                }else{
                    res.send({error: true, message: response.data.message})
                }
            })
            .catch((err)=> res.send(err))

        }else{
            res.send({error: true, message: 'Token does not supplied as Header authorization'})
        }
    }
}