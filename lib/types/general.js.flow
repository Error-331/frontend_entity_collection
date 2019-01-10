'use strict';

// @flow

// external imports
import type {Map, Record} from 'immutable';

// local imports

// types definition
export type EntityCollectionMetaType = {itemsCount: number, totalItemCount: number, [string]: any};
export type EntityCollectionDataType = {[string]: any};

export type EntityCollectionResponseType = {
    meta: EntityCollectionMetaType,
    data: EntityCollectionDataType,
}

export type LoadCollectionActionPayloadType = {
    entityListURN: string,
    requestFetchEntityCollectionActionName: string,
    finishFetchEntityCollectionActionName: string,
    successLoadEntityCollectionActionName: string,
    errorLoadEntityCollectionActionName: string
};

export type LoadChunkedCollectionPayloadType = {
    entityListURN: string,
    requestFetchEntityCollectionActionName: string,
    finishFetchEntityCollectionActionName: string,
    successLoadChunkEntityCollectionActionName: string,
    errorLoadChunkEntityCollectionActionName: string
};

export type EntityCollectionStateType = Record<{[string]: any}>;
export type EntityCollectionItemsStateType = Map<string, any>;
export type EntityCollectionItemStateType = {[string]: any};

export type ForkDescriptorType = {[string]: any};