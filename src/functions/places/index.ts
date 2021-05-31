import schema from './schema';
import { handlerPath } from '@libs/handlerResolver';
import { httpAuthorization } from '@libs/apiGateway';

export const create = {
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

export const getById = {
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

export default { create, getById }
