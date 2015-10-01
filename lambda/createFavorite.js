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
            if (err) {
                context.done(err, { message: { error: 'failed' }});
            } else {
                var create = false;
                if (data.Item) {
                    data.Item.count.N = (parseInt(data.Item.count.N) + 1).toString();
                } else {
                    data.Item = {
                        Url: { S: url },
                        count: { N: "1" }
                    }
                    create = true;
                }
                dynamo.putItem(
                    {
                        TableName: 'favorites',
                        Item: data.Item
                    },
                    function (err, response) {
                        if (err) {
                            context.done(err, { message: { error: 'failed' }});
                        } else {
                            context.done(null, { message: { url: url, count: parseInt(data.Item.count.N), create: create }});
                        }
                    }
                );
            }
        }
    );
};