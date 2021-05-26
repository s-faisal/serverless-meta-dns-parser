const AWS = require('aws-sdk');
//loads the configuration of AWS from your local system's aws file
//Comment the line if you want to use default profile
AWS.config.credentials = new AWS.SharedIniFileCredentials({profile: 'AWS_PROFILE_NAME'});
//updates aws-sdk config to connect dynamodb with local instance
AWS.config.update({
    "region": "local",
    "endpoint": "http://localhost:8000"
})
const dynamoDB = new AWS.DynamoDB.DocumentClient()

/**
* @author Fasil Shaikh
*/

module.exports = { 
    /**
    * @param {(object|string)} body
    * @param {object} extraAPIInfo
    * @param {callback} callback
    * @param {Number} [statusCode=200]
    * @description Central function that can generate the response for sending the response
    */
    createResponse: async (body, extraAPIInfo, callback, statusCode=200) => {

        if(extraAPIInfo.event.headers && extraAPIInfo.event.headers.mocha_test){
            callback(null, {
                "statusCode": statusCode,
                "isBase64Encoded": false,
                "body": JSON.stringify(body),
            })
        }else{
            // Generates the put information for dynamodb
            var params = {
                TableName: "api_logs",
                Item: {
                    api_log_id: extraAPIInfo.context.awsRequestId,
                    path: extraAPIInfo.event.path,
                    request: extraAPIInfo.event.body,
                    response: body,
                    created_at: (new Date()).toISOString()
                }
            }
    
            //Send a request the dynamodb to enter the data into the DB
            dynamoDB.put(params,(err, succ)=>{
                if(err){
                    callback(null, {
                        "statusCode": 500,
                        "isBase64Encoded": false,
                        "body": "Something went wrong!",
                    })
                }else{
                    callback(null, {
                        "statusCode": statusCode,
                        "isBase64Encoded": false,
                        "body": JSON.stringify(body),
                    })
                }
            })
        }
    }
}