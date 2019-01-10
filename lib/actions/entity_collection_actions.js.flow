'use strict';

// @flow

// external imports
import type {GenericReduxActionType} from '@webfuturistics/design_components/lib/types/redux';

// local imports
import type {LoadCollectionActionPayloadType, LoadChunkedCollectionPayloadType} from './../types/general';

import {
    WF_LOAD_ENTITY_COLLECTION,
    WF_LOAD_CHUNKED_ENTITY_COLLECTION
} from './../constants/entity_collection_constants';

// actions implementation
export const loadCollection = (
    entityListURN: string,
    requestFetchEntityCollectionActionName: string,
    finishFetchEntityCollectionActionName: string,
    successLoadEntityCollectionActionName: string,
    errorLoadEntityCollectionActionName: string
): GenericReduxActionType<LoadCollectionActionPayloadType> => ({
    type: WF_LOAD_ENTITY_COLLECTION,
    payload: {
        entityListURN,
        requestFetchEntityCollectionActionName,
        finishFetchEntityCollectionActionName,
        successLoadEntityCollectionActionName,
        errorLoadEntityCollectionActionName
    }
});

export const loadChunkedCollection = (
    entityListURN: string,
    requestFetchEntityCollectionActionName: string,
    finishFetchEntityCollectionActionName: string,
    successLoadChunkEntityCollectionActionName: string,
    errorLoadChunkEntityCollectionActionName: string
): GenericReduxActionType<LoadChunkedCollectionPayloadType> => ({
    type: WF_LOAD_CHUNKED_ENTITY_COLLECTION,
    payload: {
        entityListURN,
        requestFetchEntityCollectionActionName,
        finishFetchEntityCollectionActionName,
        successLoadChunkEntityCollectionActionName,
        errorLoadChunkEntityCollectionActionName
    }
});