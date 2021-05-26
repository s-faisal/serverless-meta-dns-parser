const {createResponse} = require("../lib/create_response")

/**
* @author Fasil Shaikh
*/
module.exports = {
    /**
    * @param {object} event
    * @param {object} context
    * @param {callback} callback
    * @description A sample hello world function (Following the protocol)
    */
    handler : (event, context, callback) => {
        try {
            //Accumulates the data that will be needed to log the request/reponse
            var infoAPI = {
                event,
                context
            }
            //Calls the generate response function for logging and sending the message to the user
            createResponse("Hello World!!", infoAPI, callback, 500);
        } catch (e) {
            console.log(e)
            //Validates the error message
            //Calls the generate response function for logging and sending the error message to the user
            createResponse({error_message: "Something went wrong"}, infoAPI, callback, 500);
        }
    }
}