import 'source-map-support/register';
import { v4 } from 'uuid';
import * as AWS from 'aws-sdk';
import { formatCreateResponse, ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';

import schema from './schema';

// Set the region 
AWS.config.update({ region: 'us-east-1' });

// Create DynamoDB document client
var docClient = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });

const create: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const { name } = event.body;
  const id = v4();
  var params = {
    TableName: 'foodRatings',
    Item: {
      partitionKey: 'places',
      sortKey: id,
      data: { name }
    }
  };

  return docClient.put(params).promise()
    .then(result => {
      console.log(result);
      return formatCreateResponse(id, { name, id })
    }).catch(err => {
      console.error(err);
      return {
        statusCode: 500,
        body: JSON.stringify(err)
      }
    });
}

export const main = middyfy(create);
