'use strict';

// external imports

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.entityCollectionSaga = entityCollectionSaga;

var _ramda = require('ramda');

var _effects = require('redux-saga/effects');

var _fetch_helpers = require('@webfuturistics/design_components/lib/helpers/web_api/fetch_helpers');

var _request_response_helpers = require('@webfuturistics/design_components/lib/helpers/hapi/request_response_helpers');

var _authentication_token_selector = require('@webfuturistics/frontend_authentication/lib/selectors/authentication_token_selector');

var _entity_collection_saga_helpers = require('./../helpers/entity_collection_saga_helpers');

var _entity_collection_constants = require('./../constants/entity_collection_constants');

// sagas implementation
function* loadEntityCollectionChunk(destinationURN, headers, successLoadChunkEntityCollectionActionName) {
    // send request to receive page of the entity collection
    var _ref = yield (0, _effects.call)(_fetch_helpers.sendGetRequestToHapiAPICors, destinationURN, headers, null),
        data = _ref.data;

    // if data field is missing in response - return error object


    if ((0, _ramda.isNil)(data)) {
        var error = new Error('"Data" field is missing in response');
        throw (0, _request_response_helpers.makeHapiBoomError)(error);
    }

    // notify reducer that chunk of the collection have been loaded
    yield (0, _effects.put)({ type: successLoadChunkEntityCollectionActionName, payload: data });

    // return data
    return data;
}

// local imports


function* loadChunkedEntityCollection(collectionURN, headers, successLoadChunkEntityCollectionActionName) {
    // prepare collection URN (first page)
    var destinationURN = collectionURN + '/' + _entity_collection_constants.WF_MAX_ITEMS_PER_PAGE + '/1';

    // send request to receive first page of the entity collection

    var _ref2 = yield (0, _effects.call)(loadEntityCollectionChunk, destinationURN, headers, successLoadChunkEntityCollectionActionName),
        meta = _ref2.meta;

    // get total item count and current items count


    var _transformEntityColle = (0, _entity_collection_saga_helpers.transformEntityCollectionMeta)(meta),
        totalItemCount = _transformEntityColle.totalItemCount,
        itemsCount = _transformEntityColle.itemsCount;

    // stop if there no items at all or all items have been loaded


    if (totalItemCount === 0 || itemsCount >= totalItemCount) {
        return;
    }

    // determine number of pages to load
    var itemsToLoad = totalItemCount - itemsCount;
    var divisionReminder = itemsToLoad % _entity_collection_constants.WF_MAX_ITEMS_PER_PAGE > 0 ? 1 : 0;
    var numberOfPages = parseInt(itemsToLoad / _entity_collection_constants.WF_MAX_ITEMS_PER_PAGE) + divisionReminder;

    // prepare variables before load
    var forkDescriptorsList = [];
    var pageShift = 2;

    // init parallel load of all collection chunks
    for (var pageCounter = 0; pageCounter < numberOfPages; pageCounter++) {
        // prepare URN
        var _destinationURN = collectionURN + '/' + _entity_collection_constants.WF_MAX_ITEMS_PER_PAGE + '/' + (pageCounter + pageShift);
        var forkDescriptor = yield (0, _effects.fork)(loadEntityCollectionChunk, _destinationURN, headers, successLoadChunkEntityCollectionActionName);

        forkDescriptorsList.push(forkDescriptor);
    }

    yield (0, _effects.all)(forkDescriptorsList);
}

function* loadAllEntityCollection(action) {
    if ((0, _ramda.isNil)(action.payload) || action.payload === undefined) {
        return;
    }

    var _action$payload = action.payload,
        requestFetchEntityCollectionActionName = _action$payload.requestFetchEntityCollectionActionName,
        finishFetchEntityCollectionActionName = _action$payload.finishFetchEntityCollectionActionName,
        successLoadEntityCollectionActionName = _action$payload.successLoadEntityCollectionActionName,
        errorLoadEntityCollectionActionName = _action$payload.errorLoadEntityCollectionActionName,
        entityListURN = _action$payload.entityListURN;


    yield (0, _effects.put)({ type: requestFetchEntityCollectionActionName });
    var authenticationToken = yield (0, _effects.select)(_authentication_token_selector.authenticationTokenSelector);

    try {
        var _ref3 = yield (0, _effects.call)(_entity_collection_saga_helpers.loadEntityCollection, entityListURN, [{ 'Authorization': authenticationToken }]),
            data = _ref3.data;

        yield (0, _effects.put)({ type: successLoadEntityCollectionActionName, payload: data });
    } catch (error) {
        yield (0, _effects.put)({ type: errorLoadEntityCollectionActionName, payload: error });
    }

    yield (0, _effects.put)({ type: finishFetchEntityCollectionActionName });
}

function* loadChunkedAllEntityCollection(action) {
    if ((0, _ramda.isNil)(action.payload) || action.payload === undefined) {
        return;
    }

    var _action$payload2 = action.payload,
        requestFetchEntityCollectionActionName = _action$payload2.requestFetchEntityCollectionActionName,
        finishFetchEntityCollectionActionName = _action$payload2.finishFetchEntityCollectionActionName,
        successLoadChunkEntityCollectionActionName = _action$payload2.successLoadChunkEntityCollectionActionName,
        errorLoadChunkEntityCollectionActionName = _action$payload2.errorLoadChunkEntityCollectionActionName,
        entityListURN = _action$payload2.entityListURN;


    yield (0, _effects.put)({ type: requestFetchEntityCollectionActionName });

    var authenticationToken = yield (0, _effects.select)(_authentication_token_selector.authenticationTokenSelector);

    try {
        yield (0, _effects.call)(loadChunkedEntityCollection, entityListURN, [{ 'Authorization': authenticationToken }], successLoadChunkEntityCollectionActionName);
    } catch (error) {
        yield (0, _effects.put)({ type: errorLoadChunkEntityCollectionActionName, payload: error });
    }

    yield (0, _effects.put)({ type: finishFetchEntityCollectionActionName });
}

function* entityCollectionSaga() {
    yield (0, _effects.takeEvery)(_entity_collection_constants.WF_LOAD_ENTITY_COLLECTION, loadAllEntityCollection);
    yield (0, _effects.takeEvery)(_entity_collection_constants.WF_LOAD_CHUNKED_ENTITY_COLLECTION, loadChunkedAllEntityCollection);
}