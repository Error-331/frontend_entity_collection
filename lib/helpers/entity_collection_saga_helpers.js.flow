'use strict';

// @flow

// external imports
import type {RequestHeadersType} from '@webfuturistics/design_components/lib/types/request_response';

import {__, always, curry, ifElse} from 'ramda';

import {hasKey, getValue} from '@webfuturistics/design_components/lib/registers/general_register';
import {sendGetRequestToHapiAPICors} from '@webfuturistics/design_components/lib/helpers/web_api/fetch_helpers';

// local imports
import type {EntityCollectionMetaType} from './../types/general';

// helpers implementation
export const transformEntityCollectionMeta = (meta: EntityCollectionMetaType): EntityCollectionMetaType => {
    meta.itemsCount = meta[ifElse(hasKey, getValue, always('itemsCount'))('entityCollectionItemsCountFieldName')];
    meta.totalItemCount =  meta[ifElse(hasKey, getValue, always('totalItemCount'))('entityCollectionTotalItemCountFieldName')];

    return meta;
};

export const loadEntityCollection = (collectionURN: string): curry<RequestHeadersType> => sendGetRequestToHapiAPICors(collectionURN, __, {});