import schema, {review} from './schema';
import { handlerPath } from '@libs/handlerResolver';

const createDish = {
  handler: `${handlerPath(__dirname)}/handler.create`,
  events: [
    {
      http: {
        method: 'post',
        path: 'places/id/{placeId}/dishes',
        request: {
          schema: {
            'application/json': schema
          }
        }
      }
    }
  ]
}

// export const findDishById = {
//   handler: `${handlerPath(__dirname)}/handler.findById`,
//   events: [
//     {
//       http: {
//         method: 'get',
//         path: 'places/id/{placeId}/dishes/id/{dishId}',
//         resp: 'http'
//       }
//     }
//   ]
// }

const getDishInfo = {
  handler: `${handlerPath(__dirname)}/handler.getDishInfo`,
  events: [
    {
      http: {
        method: 'get',
        path: 'places/id/{placeId}/dishes/id/{dishId}',
      }
    }
  ]
}

const reviewDish = {
  handler: `${handlerPath(__dirname)}/handler.reviewDish`,
  events: [
    {
      http: {
        method: 'post',
        path: 'places/id/{placeId}/dishes/id/{dishId}/reviews',
        request: {
          schema: {
            'application/json': review
          }
        }
      }
    }
  ]
}
export default { createDish, getDishInfo, reviewDish }
