const {createResponse} = require("../lib/create_response")
const DNS = require('dns');
const URL = require('url');

/**
* @author Fasil Shaikh
*/
module.exports = {
    /**
    * @param {object} event
    * @param {object} context
    * @param {callback} callback
    * @description Below function is responsible for searching the dnx txt record of the given URL
    */
    handler : (event, context, callback) => {
        try {
            //Accumulates the data that will be needed to log the request/reponse
            var infoAPI = {
                event,
                context
            }
            event.body = JSON.parse(event.body)

            //validates the URL and converts the URL to the hostname since the DNS function to validate the DNS record require the hostname
            let parsed_hostname = URL.parse(event.body.url).hostname
            if(parsed_hostname){

                //Pass the hostname as an option for fetching the DNS Txt record
                DNS.resolveTxt(parsed_hostname, (err,  addresses) => {
                    if(err){
                        //Logs the request and send the custom error to the user
                        createResponse({error_message: "Somethings went wrong"}, infoAPI, callback, 500);
                    }else{
                        let response = {}
                        //Validates the address and set the appropriate message
                        if(addresses && addresses.length > 0){
                            response = {
                                dns_txt_content: addresses,
                                success_message: `Kindly find DNS Txt Record value for the given URL(${event.body.url})!`
                            }
                        }else{
                            response = {
                                dns_txt_content: [],
                                success_message: `DNS Txt record for URL(${event.body.url}) not found!`
                            }
                        }
                        //Logs the request and send the information to the user
                        createResponse(response, infoAPI, callback);
                    }
                });
            }else{
                //Logs the request and send error regarding the invalid URL
                createResponse({error_message: "Invalid URL"}, infoAPI, callback, 400);
            }
        } catch (e) {
            console.log(e)
            //Logs the request and send the custom error to the user
            createResponse({error_message: "Something went wrong"}, infoAPI, callback, 500);
        }
    }
}