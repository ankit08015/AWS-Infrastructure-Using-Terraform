const AWS = require('aws-sdk')
var ses = new AWS.SES({
   region: 'us-east-1'
});

const docClient = new AWS.DynamoDB.DocumentClient({region:'us-east-1'});
exports.handler = (event,context,callback) => {
  var params ={
    Item:{
    id:event.Records[0].Sns.MessageId,
    message:event.Records[0].Sns.Message
  },
    TableName:'csye'
  };
  docClient.put(params,function(err, data){
    if(err) {
      callback(err,null)
    } else {
      callback(null,data);
    }
  });
  console.log("Incoming: ", event);
   // var output = querystring.parse(event);

    var eParams = {
        Destination: {
            ToAddresses: ["goel.aj@northeastern.edu"]
        },
        Message: {
            Body: {
                Text: {
                    Data: "Hey! What is up?"
                }
            },
            Subject: {
                Data: "Email Subject!!!"
            }
        },
        Source: "goel.aj@northeastern.edu"
    };

    console.log('===SENDING EMAIL===');
    var email = ses.sendEmail(eParams, function(err, data){
        if(err) console.log(err);
        else {
            console.log("===EMAIL SENT===");
            console.log(data);


            console.log("EMAIL CODE END");
            console.log('EMAIL: ', email);
            context.succeed(event);

        }
    });
}
