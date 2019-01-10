'use strict';

// @flow

// external imports
import type {HapiErrorType} from '@webfuturistics/design_components/lib/types/request_response';

// local imports
import type {EntityCollectionResponseType} from './general';

// types definition
export type ChunkedEntityCollectionFetchResultType = Promise<Array<EntityCollectionResponseType> | HapiErrorType>;
export type HashKeyValPreProcessorCallbackType = (hashKey: string, hashValue: any) => any;
