import schema from './schema';
import { handlerPath } from '@libs/handlerResolver';

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
        }
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
        resp: 'http'
      }
    }
  ]
}

export default { create, getById }
