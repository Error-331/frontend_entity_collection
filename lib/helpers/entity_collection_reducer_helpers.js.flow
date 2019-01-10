'use strict';

// @flow

// external imports
import {reduce, mapObjIndexed} from 'ramda';

// local imports
import type {
    EntityCollectionStateType,
    EntityCollectionItemsStateType,
    EntityCollectionResponseType,
    EntityCollectionItemStateType
} from './../types/general';

import type {HashKeyValPreProcessorCallbackType} from './../types/helpers';

import {transformEntityCollectionMeta} from './../helpers/entity_collection_saga_helpers';

// helpers implementation
export const handleRequestLoadCollection = (state: EntityCollectionStateType): EntityCollectionStateType => state.set('isFetching', true);
export const handleFinishLoadCollection = (state: EntityCollectionStateType): EntityCollectionStateType => state.set('isFetching', false);
export const handleSuccessLoadCollection = (
    state: EntityCollectionStateType,
    itemStateRecord: EntityCollectionStateType,
    {meta, data}: EntityCollectionResponseType,
    idKeyName: string = '_id'
): EntityCollectionItemStateType => {

    let clientItems: EntityCollectionItemsStateType = state.get('items');

    const newItemsObj: EntityCollectionItemStateType = reduce((
            mapObj: EntityCollectionItemStateType,
            serverItem:  EntityCollectionItemStateType
        ) => {
            mapObj[serverItem[idKeyName]] = itemStateRecord(serverItem);
            return mapObj;
    }, {}, data);

    clientItems = clientItems.merge(newItemsObj);
    const {totalItemCount} = transformEntityCollectionMeta(meta);

    return state.merge({
        totalItemCount: totalItemCount,
        items: clientItems
    });
};

export const handleSuccessLoadHashCollection = (
    state: EntityCollectionStateType,
    itemStateRecord: EntityCollectionStateType,
    {meta, data}: EntityCollectionResponseType,
    hashKeyValPreProcessorCallback: HashKeyValPreProcessorCallbackType
): EntityCollectionItemStateType => {

    let clientItems: EntityCollectionItemsStateType = state.get('items');

    const newItemsObj: EntityCollectionItemStateType = mapObjIndexed((dataValue) => {
        const separatedHashValue: string = dataValue.split(';');
        return reduce((mapObj: EntityCollectionItemStateType, hashValuePart: string) => {
            const [hashKey, hashValue] = hashValuePart.split(':');

            mapObj[hashKey] = hashKeyValPreProcessorCallback(hashKey, hashValue);
            return mapObj;
        }, {}, separatedHashValue);
    }, data);

    clientItems = clientItems.merge(newItemsObj);

    return state.merge({
        totalItemCount: meta.totalItemCount,
        items: clientItems
    });
};

export const handleSuccessLoadArrayCollection = (
    state: EntityCollectionStateType,
    {meta, data}: EntityCollectionResponseType
): EntityCollectionItemStateType => {
    let clientItems: EntityCollectionItemsStateType = state.get('items');
    clientItems = clientItems.concat(data);

    return state.merge({
        totalItemCount: meta.totalItemCount,
        items: clientItems
    });
};
