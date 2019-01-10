'use strict';

// external imports

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.handleSuccessLoadArrayCollection = exports.handleSuccessLoadHashCollection = exports.handleSuccessLoadCollection = exports.handleFinishLoadCollection = exports.handleRequestLoadCollection = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

// local imports


var _ramda = require('ramda');

var _entity_collection_saga_helpers = require('./../helpers/entity_collection_saga_helpers');

// helpers implementation
var handleRequestLoadCollection = exports.handleRequestLoadCollection = function handleRequestLoadCollection(state) {
    return state.set('isFetching', true);
};
var handleFinishLoadCollection = exports.handleFinishLoadCollection = function handleFinishLoadCollection(state) {
    return state.set('isFetching', false);
};
var handleSuccessLoadCollection = exports.handleSuccessLoadCollection = function handleSuccessLoadCollection(state, itemStateRecord, _ref) {
    var meta = _ref.meta,
        data = _ref.data;
    var idKeyName = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '_id';


    var clientItems = state.get('items');

    var newItemsObj = (0, _ramda.reduce)(function (mapObj, serverItem) {
        mapObj[serverItem[idKeyName]] = itemStateRecord(serverItem);
        return mapObj;
    }, {}, data);

    clientItems = clientItems.merge(newItemsObj);

    var _transformEntityColle = (0, _entity_collection_saga_helpers.transformEntityCollectionMeta)(meta),
        totalItemCount = _transformEntityColle.totalItemCount;

    return state.merge({
        totalItemCount: totalItemCount,
        items: clientItems
    });
};

var handleSuccessLoadHashCollection = exports.handleSuccessLoadHashCollection = function handleSuccessLoadHashCollection(state, itemStateRecord, _ref2, hashKeyValPreProcessorCallback) {
    var meta = _ref2.meta,
        data = _ref2.data;


    var clientItems = state.get('items');

    var newItemsObj = (0, _ramda.mapObjIndexed)(function (dataValue) {
        var separatedHashValue = dataValue.split(';');
        return (0, _ramda.reduce)(function (mapObj, hashValuePart) {
            var _hashValuePart$split = hashValuePart.split(':'),
                _hashValuePart$split2 = _slicedToArray(_hashValuePart$split, 2),
                hashKey = _hashValuePart$split2[0],
                hashValue = _hashValuePart$split2[1];

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

var handleSuccessLoadArrayCollection = exports.handleSuccessLoadArrayCollection = function handleSuccessLoadArrayCollection(state, _ref3) {
    var meta = _ref3.meta,
        data = _ref3.data;

    var clientItems = state.get('items');
    clientItems = clientItems.concat(data);

    return state.merge({
        totalItemCount: meta.totalItemCount,
        items: clientItems
    });
};