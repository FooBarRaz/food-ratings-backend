import schema from './schema';
import { handlerPath } from '@libs/handlerResolver';
import { httpAuthorization } from '@libs/apiGateway';

const create = {
  handler: `${handlerPath(__dirname)}/handler.createPlace`,
  events: [
    {
      http: {
        method: 'post',
        path: 'places',
        request: {
          schema: {
            'application/json': schema
          }
        },
        ...httpAuthorization
      }
    }
  ]
}

const getById = {
  handler: `${handlerPath(__dirname)}/handler.getPlaceById`,
  events: [
    {
      http: {
        method: 'get',
        path: 'places/id/{placeId}',
      }
    }
  ]
}

const getAll = {
  handler: `${handlerPath(__dirname)}/handler.getAllPlaces`,
  events: [
    {
      http: {
        method: 'get',
        path: 'places',
      }
    }
  ]
}

export default { create, getById, getAll }
