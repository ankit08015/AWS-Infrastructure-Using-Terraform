const AWS = require('aws-sdk')
var ses = new AWS.SES({
    region: 'us-east-1'
});

const docClient = new AWS.DynamoDB.DocumentClient({
    region: 'us-east-1'
});
exports.handler = (event, context, callback) => {
    var params = {
        Item: {
            id: event.Records[0].Sns.MessageId,
            //user_email: event.Records[0].Sns.user_email,
            //message: event.Records[0].Sns.Message
            message: event.Records[0].Sns.Message
        },
        TableName: 'csye'
    };
    
    function putCheck() {
        return new Promise(function(resolve, reject) {
            docClient.put(params, function(err, data) {
                if (err) {
                    reject(new Error('Ooops, something broke!'));
                } else {
                    resolve(data);
                }
            });
        });
    }
    
    // docClient.put(params, function(err, data) {
    //     if (err) {
    //         callback(err, null)
    //     } else {
    //         callback(null, data);
    //     }
    // });

    const params2 = {
        TableName: 'csye',
        KeyConditionExpression: 'id = :i',
        ExpressionAttributeValues: {
            ':i': event.Records[0].Sns.MessageId
        }
    };


    function getRandomNumber() {
        return new Promise(function(resolve, reject) {
            docClient.query(params2, function(err, data) {
                if (err) {
                    reject(new Error('Ooops, something broke!'));
                } else {
                    resolve(data);
                }
            });
        });
    }
    let number;
    async function logNumber() {
        //let number;
        number = await getRandomNumber();
        console.log('after await', number.Items.length);
        if(number.Items.length==0){
            let number2;
            number2 = await putCheck();
            console.log(number2);
            await sendEmail(event.Records[0].Sns.Message);
        }
        
    }
    logNumber();
    console.log('after async call');
    

    function sendEmail(to_email) {
        return new Promise(function(resolve, reject) {
            var eParams = {
        Destination: {
            ToAddresses: [to_email]
        },
        Message: {
            Body: {
                Text: {
                    Data: "Hey! message?"
                }
            },
            Subject: {
                Data: "Email Subject!!!"
            }
        },
        Source: "goel.aj@northeastern.edu"
    };
            ses.sendEmail(eParams, function(err, data2) {
                if (err) {
                    reject(new Error('Ooops, something broke!'));
                } else {
                    //console.log("$%$%#$%$#%"+to_email)
                    context.succeed(event);
                    resolve(data2);
                }
            });
        });
    }
}