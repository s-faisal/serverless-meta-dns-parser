const {createResponse} = require("../lib/create_response")
const cheerio = require('cheerio');
const request = require('request');
const URL = require('url');

/**
* @author Fasil Shaikh
*/
module.exports = {
    /**
    * @param {object} event
    * @param {object} context
    * @param {callback} callback
    * @description A handler function that validates the params and fetch the given metatag from the given URL
    */
    handler : (event, context, callback) => {
        try {
            //Accumulates the data that will be needed to log the request/reponse
            var infoAPI = {
                event,
                context
            }
            event.body = JSON.parse(event.body)
            
            //Validates the URL that was passed by user
            let parsed_url = URL.parse(event.body.url).href
            if(parsed_url && event.body.metatag){

                //Set the URL passed by the user in option and pass to the module for parsing
                const options = { url: parsed_url}    
                request(options, "GET", (err, res, body)=>{
                    if(err){
                        //Logs the request and send the custom error to the user
                        createResponse({error_message: "Something went wrong"}, infoAPI, callback, 500);
                    }else{
                        //Get the HTML content of the URL and pass it to cheerio to fetch the metatag
                        const $ = cheerio.load(body);
                        let response = {}
                        if($(`meta[property="${event.body.metatag}"]`).length){
                            //Validates the metatag as an actual metatag and sets the necessary value and suitable message
                            response = {
                                metatag_content: $(`meta[property="${event.body.metatag}"]`).attr('content'),
                                success_message: `Kindly find the Metatag(${event.body.metatag}) content for given URL(${event.body.url})!`
                            }
                        }else if($(`meta[name="${event.body.metatag}"]`).length){
                            //Validates the metatag as an custom metatag and sets the necessary value and suitable message
                            response = {
                                metatag_content: $(`meta[name="${event.body.metatag}"]`).attr('content'),
                                success_message: `Kindly find the Metatag(${event.body.metatag}) content for given URL(${event.body.url})!`
                            }
                        }else{
                            //Geneates and empty response for metatag and a suitable message for the response
                            response = {
                                metatag_content: "",
                                success_message: `Metatag(${event.body.metatag}) is not present in the given URL(${event.body.url})!`
                            }
                        }
                        //Logs the request and send the information to the user
                        createResponse(response, infoAPI, callback);
                    }
                })
            }else{
                //Logs the request and send error regarding the invalid parameters
                createResponse({error_message: "Invalid parameter"}, infoAPI, callback, 400);
            }
        } catch (e) {
            console.log(e)
            //Logs the request and send the custom error to the user
            createResponse({error_message: "Something went wrong"}, infoAPI, callback, 500);
        }
    }
}