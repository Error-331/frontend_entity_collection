'use strict';

// external imports

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.loadChunkedCollection = exports.loadCollection = undefined;

var _entity_collection_constants = require('./../constants/entity_collection_constants');

// actions implementation


// local imports
var loadCollection = exports.loadCollection = function loadCollection(entityListURN, requestFetchEntityCollectionActionName, finishFetchEntityCollectionActionName, successLoadEntityCollectionActionName, errorLoadEntityCollectionActionName) {
    return {
        type: _entity_collection_constants.WF_LOAD_ENTITY_COLLECTION,
        payload: {
            entityListURN: entityListURN,
            requestFetchEntityCollectionActionName: requestFetchEntityCollectionActionName,
            finishFetchEntityCollectionActionName: finishFetchEntityCollectionActionName,
            successLoadEntityCollectionActionName: successLoadEntityCollectionActionName,
            errorLoadEntityCollectionActionName: errorLoadEntityCollectionActionName
        }
    };
};var loadChunkedCollection = exports.loadChunkedCollection = function loadChunkedCollection(entityListURN, requestFetchEntityCollectionActionName, finishFetchEntityCollectionActionName, successLoadChunkEntityCollectionActionName, errorLoadChunkEntityCollectionActionName) {
    return {
        type: _entity_collection_constants.WF_LOAD_CHUNKED_ENTITY_COLLECTION,
        payload: {
            entityListURN: entityListURN,
            requestFetchEntityCollectionActionName: requestFetchEntityCollectionActionName,
            finishFetchEntityCollectionActionName: finishFetchEntityCollectionActionName,
            successLoadChunkEntityCollectionActionName: successLoadChunkEntityCollectionActionName,
            errorLoadChunkEntityCollectionActionName: errorLoadChunkEntityCollectionActionName
        }
    };
};