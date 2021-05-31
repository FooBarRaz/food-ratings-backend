import * as AWS from 'aws-sdk';
export const TABLE_NAME = 'foodRatings';

export type Key = {
    partitionKey: 'places' | 'menu' | 'dishes';
    sortKey: string;
}

// Set the region 
AWS.config.update({ region: 'us-east-1' });

// Create DynamoDB document client
var docClient = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });

export const put = <T>(item: T, key: Key) => {
    const params = {
        TableName: TABLE_NAME,
        Item: {
            ...key,
            data: item
        }
    };

    return docClient.put(params)
        .promise();
}

export const getById = <T>(key: Key): Promise<T> => {
    const params = {
        TableName: TABLE_NAME,
        Key: key
    };

    return docClient.get(params)
        .promise()
        .then((result) => result.Item?.data)
}

export const query = (key: Key): Promise<unknown> => {
    const params = {
        TableName: TABLE_NAME,
        KeyConditionExpression: "#pKey = :partitionKey and begins_with(#sKey,:sortKey)",
        ExpressionAttributeNames: {
            "#pKey": "partitionKey",
            "#sKey": "sortKey"
        },
        ExpressionAttributeValues: {
            ":partitionKey": key.partitionKey,
            ":sortKey": key.sortKey
        }
    };

    return docClient.query(params)
        .promise()
        .then((result) => {
            console.log('found results for query: ', result)
            return result.Items
        }
        )
}
