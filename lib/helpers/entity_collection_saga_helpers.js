'use strict';

// external imports

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.loadEntityCollection = exports.transformEntityCollectionMeta = undefined;

var _ramda = require('ramda');

var _general_register = require('@webfuturistics/design_components/lib/registers/general_register');

var _fetch_helpers = require('@webfuturistics/design_components/lib/helpers/web_api/fetch_helpers');

// helpers implementation


// local imports
var transformEntityCollectionMeta = exports.transformEntityCollectionMeta = function transformEntityCollectionMeta(meta) {
    meta.itemsCount = meta[(0, _ramda.ifElse)(_general_register.hasKey, _general_register.getValue, (0, _ramda.always)('itemsCount'))('entityCollectionItemsCountFieldName')];
    meta.totalItemCount = meta[(0, _ramda.ifElse)(_general_register.hasKey, _general_register.getValue, (0, _ramda.always)('totalItemCount'))('entityCollectionTotalItemCountFieldName')];

    return meta;
};

var loadEntityCollection = exports.loadEntityCollection = function loadEntityCollection(collectionURN) {
    return (0, _fetch_helpers.sendGetRequestToHapiAPICors)(collectionURN, _ramda.__, {});
};