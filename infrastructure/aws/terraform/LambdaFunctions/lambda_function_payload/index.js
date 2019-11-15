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
            message: event.Records[0].Sns.Message,
            ttl: (Math.floor(Date.now() / 1000) + 10).toString()
        },
        TableName: 'csye'
    };

    function putCheck() {
        return new Promise(function (resolve, reject) {
            docClient.put(params, function (err, data) {
                if (err) {
                    reject(new Error('Ooops, something broke!'));
                } else {
                    resolve(data);
                }
            });
        });
    }


    const params2 = {
        TableName: 'csye',
        KeyConditionExpression: 'id = :i',
        ExpressionAttributeValues: {
            ':i': event.Records[0].Sns.MessageId
        }
    };


    function getRecord() {
        console.log("HERE")
        return new Promise(function (resolve, reject) {
            docClient.query(params2, function (err, data) {
                if (err) {
                    reject(new Error('Ooops, something broke!'));
                } else {
                    resolve(data);
                }
            });
        });
    }
    //let number;
    async function mainFunction() {
        let number;
        number = await getRecord();
        if (number.Items.length == 0) {
            let number2;
            number2 = await putCheck();
            console.log("=================EMAIL SENT FIRST TIME================");
            //await sendEmail(event.Records[0].Sns.Message);
            await sendEmail("goel.aj@northeastern.edu");

        } else {

            if ((number.Items[0].ttl) < (Math.floor(Date.now() / 1000)).toString()) {
                let number2;
                number2 = await putCheck();
                console.log("=================EMAIL SENT SECOND TIME================");
                await sendEmail("goel.aj@northeastern.edu");
                await sendEmail(event.Records[0].Sns.Me);
            } else {
                console.log((number.Items[0].ttl) < (Math.floor(Date.now() / 1000)).toString() + "------IN ELSE")
                console.log("=================EMAIL NOT SENT--WITHIN EXPIRATION TIME================");
            }
        }

    }
    mainFunction();
    console.log('after async call');


    function sendEmail(to_email) {
        var sender = "goel.aj@northeastern.edu";
        var email_subject = 'Recipe Links for ' + to_email;
        
        var links = "";
            for (var i = 0; i < event.Records[0].Sns.Message.length; i++) {
                links = links + "<a href=\"https://localhost:3000/v1/recipie/" + event.Records[0].Sns.Message[i]+"\">" + 
                "https://localhost:3000/v1/recipie/" + event.Records[0].Sns.Message[i]+"</a>";
                links = links+ "<br><br>"
                //console.log(links);
            }
            console.log(links);
            
            
        return new Promise(function (resolve, reject) {
            var eParams = {
                Destination: {
                    ToAddresses: [to_email]
                },
                Message: {
                    Body: {
                        Html: {
                            //Data: links
                            Data: '<html><head>'
                            + '<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />'
                            + '<title>' + email_subject + '</title>'
                            + '</head><body>'
                            + 'Links for your recipes are as follows:'
                            + '<br><br>'
                            + links
                            + '</body></html>'
                        }
                    },
                    Subject: {
                        Data: email_subject
                    }
                },
                Source: sender
            };
            ses.sendEmail(eParams, function (err, data2) {
                if (err) {
                    reject(new Error(err));
                } else {
                    context.succeed(event);
                    resolve(data2);
                }
            });
        });
    }
}