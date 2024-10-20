import { database, collections } from "./config";
import { ID } from "appwrite";

const db = {};

collections.forEach((collection) => {
    db[collection.name] = {
        create: async (payload, id = ID.unique()) => {
            return await database.createDocument(collection.dbId, collection.id, id, payload);
        },
        update: async (id, payload) => {
            return await database.updateDocument(collection.dbId, collection.id, id, payload);
        },
        
        delete: async (id) => {
            return await database.deleteDocument(collection.dbId, collection.id, id);
        },
        get: async (id) => {
            return await database.getDocument(collection.dbId, collection.id, id);
        },
        list: async (queries) => {
            return await database.listDocuments(collection.dbId, collection.id, queries);
        },
    };
})

export { db };