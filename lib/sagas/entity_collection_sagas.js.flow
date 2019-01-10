'use strict';

// @flow

// external imports
import type {RequestHeadersType} from '@webfuturistics/design_components/lib/types/request_response';
import type {GenericReduxActionType} from '@webfuturistics/design_components/lib/types/redux';
import type {WFResponseType} from '@webfuturistics/design_components/lib/types/web_futuristics';

import {isNil} from 'ramda';
import {takeEvery, select, call, put, fork, all} from 'redux-saga/effects';

import {sendGetRequestToHapiAPICors} from '@webfuturistics/design_components/lib/helpers/web_api/fetch_helpers';
import {makeHapiBoomError} from '@webfuturistics/design_components/lib/helpers/hapi/request_response_helpers';

import {authenticationTokenSelector} from '@webfuturistics/frontend_authentication/lib/selectors/authentication_token_selector';

// local imports
import type {
    EntityCollectionResponseType,
    LoadCollectionActionPayloadType,
    LoadChunkedCollectionPayloadType,
    ForkDescriptorType
} from './../types/general';

import {loadEntityCollection, transformEntityCollectionMeta} from './../helpers/entity_collection_saga_helpers';

import {WF_MAX_ITEMS_PER_PAGE} from './../constants/entity_collection_constants';
import {
    WF_LOAD_ENTITY_COLLECTION,
    WF_LOAD_CHUNKED_ENTITY_COLLECTION
} from './../constants/entity_collection_constants';

// sagas implementation
function* loadEntityCollectionChunk(
    destinationURN: string,
    headers: RequestHeadersType,
    successLoadChunkEntityCollectionActionName: string
): Generator<any, any, any> {
    // send request to receive page of the entity collection
    const {data}: WFResponseType = yield call(sendGetRequestToHapiAPICors, destinationURN, headers, null);

    // if data field is missing in response - return error object
    if (isNil(data)) {
        const error: Error = new Error('"Data" field is missing in response');
        throw makeHapiBoomError(error);
    }

    // notify reducer that chunk of the collection have been loaded
    yield put({type: successLoadChunkEntityCollectionActionName, payload: data});

    // return data
    return data;
}

function* loadChunkedEntityCollection(
    collectionURN: string,
    headers: RequestHeadersType,
    successLoadChunkEntityCollectionActionName: string,
): Generator<any, any, any> {
    // prepare collection URN (first page)
    const destinationURN: string = `${collectionURN}/${WF_MAX_ITEMS_PER_PAGE}/1`;

    // send request to receive first page of the entity collection
    const {meta}: EntityCollectionResponseType = yield call(
        loadEntityCollectionChunk,
        destinationURN,
        headers,
        successLoadChunkEntityCollectionActionName
    );

    // get total item count and current items count
    const {totalItemCount, itemsCount} = transformEntityCollectionMeta(meta);

    // stop if there no items at all or all items have been loaded
    if (totalItemCount === 0 || itemsCount >= totalItemCount) {
        return;
    }

    // determine number of pages to load
    const itemsToLoad: number = totalItemCount - itemsCount;
    const divisionReminder: number = (itemsToLoad % WF_MAX_ITEMS_PER_PAGE) > 0 ? 1 : 0;
    const numberOfPages: number = (parseInt(itemsToLoad / WF_MAX_ITEMS_PER_PAGE)) + divisionReminder;

    // prepare variables before load
    const forkDescriptorsList: Array<any> = [];
    const pageShift: number = 2;

    // init parallel load of all collection chunks
    for (let pageCounter: number = 0; pageCounter < numberOfPages; pageCounter++) {
        // prepare URN
        const destinationURN: string = `${collectionURN}/${WF_MAX_ITEMS_PER_PAGE}/${pageCounter + pageShift}`;
        const forkDescriptor: ForkDescriptorType = yield fork(loadEntityCollectionChunk, destinationURN, headers, successLoadChunkEntityCollectionActionName);

        forkDescriptorsList.push(forkDescriptor);
    }

    yield all(forkDescriptorsList);
}

function* loadAllEntityCollection(action: GenericReduxActionType<LoadCollectionActionPayloadType>): Generator<any, any, any> {
    if (isNil(action.payload) || action.payload === undefined) {
        return;
    }

    const {
        requestFetchEntityCollectionActionName,
        finishFetchEntityCollectionActionName,
        successLoadEntityCollectionActionName,
        errorLoadEntityCollectionActionName,

        entityListURN
    } = action.payload;

    yield put({type: requestFetchEntityCollectionActionName});
    const authenticationToken: string = yield select(authenticationTokenSelector);

    try {
        const {data}: WFResponseType = yield call(
            loadEntityCollection,
            entityListURN,
            [{'Authorization': authenticationToken}],
        );

        yield put({type: successLoadEntityCollectionActionName, payload: data});
    } catch(error) {
        yield put({type: errorLoadEntityCollectionActionName, payload: error});
    }

    yield put({type: finishFetchEntityCollectionActionName});
}

function* loadChunkedAllEntityCollection(action: GenericReduxActionType<LoadChunkedCollectionPayloadType>): Generator<any, any, any> {
    if (isNil(action.payload) || action.payload === undefined) {
        return;
    }

    const {
        requestFetchEntityCollectionActionName,
        finishFetchEntityCollectionActionName,
        successLoadChunkEntityCollectionActionName,
        errorLoadChunkEntityCollectionActionName,

        entityListURN
    } = action.payload;

    yield put({type: requestFetchEntityCollectionActionName});

    const authenticationToken: string = yield select(authenticationTokenSelector);

    try {
        yield call(
            loadChunkedEntityCollection,
            entityListURN,
            [{'Authorization': authenticationToken}],
            successLoadChunkEntityCollectionActionName
        );
    } catch(error) {
        yield put({type: errorLoadChunkEntityCollectionActionName, payload: error});
    }

    yield put({type: finishFetchEntityCollectionActionName});
}

export function* entityCollectionSaga(): Generator<any, any, any> {
    yield takeEvery(WF_LOAD_ENTITY_COLLECTION, loadAllEntityCollection);
    yield takeEvery(WF_LOAD_CHUNKED_ENTITY_COLLECTION, loadChunkedAllEntityCollection);
}
