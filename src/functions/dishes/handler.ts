import 'source-map-support/register';
import { v4 } from 'uuid';
import { formatCreateResponse, formatErrorResponse, formatJSONResponse, ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import schema from './schema';
import { getById, put, query } from '@libs/dynamoDb';

const partitionKey = 'menu';
const sortKey = (placeId: string, dishId: string): string => {
  return `places#${placeId}#dishes#${dishId}`;
}

const _create: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const { placeId } = event.pathParameters
  const { name, tags } = event.body;
  const id = v4();
  return put({ name }, { partitionKey, sortKey: sortKey(placeId, id) })
    .then(() => formatCreateResponse(id, { dishId: id, name, place: placeId, tags }))
    .catch(err => formatErrorResponse(err));
}

const _findById: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const { placeId, dishId } = event.pathParameters;

  return getById({ partitionKey, sortKey: sortKey(placeId, dishId) })
    .then((result: any) => {
      return formatJSONResponse(result)
    }).catch(err => {
      return formatErrorResponse(err);
    });
}

const _getDishInfo: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const { placeId, dishId } = event.pathParameters;

  return query({ partitionKey, sortKey: sortKey(placeId, dishId) })
    .then((result: Array<{ sortKey: string, data: any }>) => {
      // reduce all items to a single object
      return result
        .reduce((acc, curr) => {
          if (curr.sortKey.includes('#reviews')) {
            acc.reviews.push(curr.data)
          } else {
            acc.name = curr.data.name
          }
          return acc;
        }, { name: undefined, reviews: [] })
    })
    .then(formatJSONResponse)
    .catch(err => {
      return formatErrorResponse(err);
    });
}

const _reviewDish: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const { placeId, dishId } = event.pathParameters;
  const id = v4();
  const review = event.body;

  return put(review, { partitionKey, sortKey: `${sortKey(placeId, dishId)}#reviews#${id}` })
    .then(() => {
      return formatCreateResponse(id, review as any)
    }).catch(err => {
      return formatErrorResponse(err);
    });
}

export const create = middyfy(_create);
export const findById = middyfy(_findById);
export const getDishInfo = middyfy(_getDishInfo);
export const reviewDish = middyfy(_reviewDish);

