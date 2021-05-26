# serverless-meta-dns-parser

This serverless project that has 2 endpoints, one to validate if a metatag is present in a site and another one to validate if a dns txt record is present in a domain and store the api logs in the dynamodb(locally).

## Modules Used

##### Dependencies
- aws-sdk
- cheerio

##### Dev Dependencies
- serverless-mocha-plugin
- serverless-offline


## Installation / Setup

##### Dependencies and Dev Dependencies
```bash
npm install
```

##### DynamoDB (locally)

AWS gives you 3 ways to install dynamodb locally.
- Download .jar executable
- Download docker executable
- Using Apache Maven

We will be using .jar executable to setup our dynamodb instance on local system. Below are the ways via which you download the .jar executable on your local system. 
- Click on any of the download link present on  [AWS website](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DynamoDBLocal.DownloadingAndRunning.html) 
- Click here [Download](https://s3.ap-south-1.amazonaws.com/dynamodb-local-mumbai/dynamodb_local_latest.zip)
- Execute given command on your terminal. \
`
curl https://s3.ap-south-1.amazonaws.com/dynamodb-local-mumbai/dynamodb_local_latest.zip
`

Go to the respective directory where it was downloaded and run the below set of commands which will firstly unzip the zip file and then will start the dynamodb instance. 
##### Note: Bydefault dynamodb uses port 8000, so you need to make sure the same is not occupied or you can change the default by passing port no as a parameter
```
unzip dynamodb_local_latest.zip
java -Djava.library.path=./DynamoDBLocal_lib -jar DynamoDBLocal.jar -sharedDb
## 1st parameter specify the path of the unzipped folder
## 2nd parameter specify the file name that needs to be executed
## 3rd parameter will mention that it will be a shared instance that is going to getting used
## if you want to change the port number use this command instead of above one
java -Djava.library.path=./DynamoDBLocal_lib -jar DynamoDBLocal.jar -sharedDb -port 9000

## if you are using Windows PowerShell, use below command
java -D"java.library.path=./DynamoDBLocal_lib -jar DynamoDBLocal.jar" -sharedDb -port 9000

```
Before accessing the dynamodb, you will have to configure your credentials in AWS CLI. You can use `aws configure` for the same. Since we are using setting it up on local you can pass any random value in `AWS Access Key ID`  and `AWS Secret Access Key`.

##### Note: In all the below dynamodb queries, if you are want to use different AWS CLI profile other than the default one than add --profile {{PROFILE_NAME}}. Replace {{PROFILE_NAME}} with your aws profile name. Also, endpoint-url will have the port no that was used while starting the dynamodb. It is important to pass endpoint-url, if the same is not passed then your AWS CLI command will communicate with the AWS online service.
Once this is done use below command to **create a dynamodb table** which will log the request / response of our endpoints.
```
create-table
aws dynamodb create-table --attribute-definitions AttributeName=api_log_id,AttributeType=S --table-name api_logs --key-schema AttributeName=api_log_id,KeyType=HASH  --provisioned-throughput ReadCapacityUnits=1,WriteCapacityUnits=1 --region us-east-1 --output json --endpoint-url http://localhost:8000
```

You can use below command to **get the content of your table**
```
aws dynamodb scan --table-name api_logs --endpoint-url http://localhost:8000 --region us-east-1
```

You can use below command to **describe your table**(schema of the table)
```
aws --profile=via dynamodb describe-table --table-name=api_logs --endpoint-url http://localhost:8000 --region us-east-1
```

You can use below command to **delete your table**
```
aws dynamodb delete-table --table-name api_logs --endpoint-url http://localhost:8000 --region us-east-1
```

## Usage of Endpoints

Run the serverless project locally.

```bash
serverless offline
```
OR
```bash
sls offline
```

It will generate 2 **POST URL** for you. Something like this.
#### Fetching Metatags 
```bash
http://localhost:3000/dev/fetchMetadata 
```

You can use below request to test the API.
```bash
{
    url: "https://npmjs.com/package/str2bin",
    metatag: "og:title"
}
```

Output
```bash
{
    "metatag_content": "str2bin",
    "success_message": "Kindly find the Metatag(og:title) content for given URL(https://npmjs.com/package/str2bin)!"
}
```

#### Fetching DNS Txt record 
```bash
http://localhost:3000/dev/fetchDNSRecord
```
You can use below request to test the API.
```bash
{
    url: "http://example.org/",
}
```

Output
```bash
{
    "dns_txt_content": [
        [
            "v=spf1 -all"
        ]
    ],
    "success_message": "Kindly find DNS Txt Record value for the given URL(http://example.org/)!"
}
```
