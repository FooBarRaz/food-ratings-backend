import 'source-map-support/register';
import { v4 } from 'uuid';
import { formatCreateResponse, formatErrorResponse, formatJSONResponse, ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';

import schema from './schema';
import { getById, put, query } from '@libs/dynamoDb';

const create: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const { name } = event.body;
  const id = v4();
  return put({name}, {partitionKey: 'places', sortKey: id })
    .then(() => formatCreateResponse(id, { name, id }))
    .catch(err => formatErrorResponse(err));
}

const findById: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const { placeId } = event.pathParameters;

  return getById({partitionKey: 'places', sortKey: placeId})
    .then(formatJSONResponse)
    .catch(err => {
      return formatErrorResponse(err);
    });
}

const findAll: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async () => {
  return query({partitionKey: 'places', sortKey: ''})
    .then(formatJSONResponse)
    .catch(err => {
      return formatErrorResponse(err);
    });
}

export const createPlace = middyfy(create);
export const getPlaceById = middyfy(findById);
export const getAllPlaces = middyfy(findAll);
