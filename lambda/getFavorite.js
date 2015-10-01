console.log('Loading function');

var AWS = require('aws-sdk');
var dynamo = new AWS.DynamoDB({region: 'us-west-2'});

exports.handler = function(event, context) {
    var url = event.url;
    var q = dynamo.getItem(
        {
            TableName: 'favorites',
            Key: { Url: { S: url }},
        }, 
        function (err, data) {
            console.log(JSON.stringify(data));
            if (err) {
                context.done(err, { message: { error: 'failed' }});
            } else {
                context.done(null, { message: { url: url, count: parseInt(data.Item.count.N) }});
            }
        }
    );
};