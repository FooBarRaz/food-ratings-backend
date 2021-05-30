// import { v4 } from 'uuid';
// import { getById, Key, put } from "./dynamoDb";

// export abstract class CrudRepository<T, K extends Key> {
//     constructor(private partitionKey: string, sortKeyTemplate: string) {

//     }

//     buildPutKey(id: string) {
//         return {
//             keyBuildArgs,

//         }
//     };

//     insert(item: T): Promise<string> {
//         return put(item, key);
//     }

//     getById(id: K): Promise<T> {
//         return getById(id);
//     }
// }