var update = require("react-addons-update");
var QueryBuilders_1 = require("./QueryBuilders");
var _ = require("lodash");
var Utils_1 = require("../support/Utils");
var ImmutableQuery = (function () {
    function ImmutableQuery(query, index) {
        if (query === void 0) { query = ImmutableQuery.defaultQuery; }
        if (index === void 0) { index = ImmutableQuery.defaultIndex; }
        this.index = index;
        this.query = query;
    }
    ImmutableQuery.prototype.hasFilters = function () {
        return !_.isEmpty(this.index.filters);
    };
    ImmutableQuery.prototype.hasFiltersOrQuery = function () {
        return (this.query.query.$array.length +
            this.query.filter.$array.length) > 0 || !!this.query.sort;
    };
    ImmutableQuery.prototype.addQuery = function (query) {
        if (query) {
            return this.update({
                query: QueryBuilders_1.BoolMust({ $push: [query] })
            });
        }
        return this;
    };
    ImmutableQuery.prototype.addHiddenFilter = function (bool) {
        return this.addFilter(Utils_1.Utils.guid(), bool);
    };
    ImmutableQuery.prototype.addFilter = function (key, bool) {
        console.log(arguments);
        var newIndex = update(this.index, {
            filters: {
                $merge: (_a = {}, _a[key] = bool, _a)
            },
            filtersArray: {
                $push: bool.$array
            }
        });
        return this.update({
            filter: QueryBuilders_1.BoolMust({ $push: [bool] })
        }, newIndex);
        var _a;
    };
    ImmutableQuery.prototype.getFiltersArray = function () {
        return this.index.filtersArray || [];
    };
    ImmutableQuery.prototype.setAggs = function (aggs) {
        // console.log(aggs)
        var existingAggs = this.query.aggs || {};
        var newAggs = _.extend({}, existingAggs, aggs);
        return this.update({ $merge: { aggs: newAggs } });
    };
    ImmutableQuery.prototype.getFilters = function (key) {
        if (key === void 0) { key = undefined; }
        if (!_.isArray(key)) {
            key = [key];
        }
        var filters = _.values(_.omit(this.index.filters || {}, key));
        return QueryBuilders_1.BoolMust(filters);
    };
    ImmutableQuery.prototype.setSize = function (size) {
        return this.update({ $merge: { size: size } });
    };
    ImmutableQuery.prototype.setSort = function (sort) {
        return this.update({ $merge: { sort: sort } });
    };
    ImmutableQuery.prototype.getSize = function () {
        return this.query.size;
    };
    ImmutableQuery.prototype.setFrom = function (from) {
        return this.update({ $merge: { from: from } });
    };
    ImmutableQuery.prototype.getFrom = function () {
        return this.query.from;
    };
    ImmutableQuery.prototype.update = function (updateDef, newIndex) {
        if (newIndex === void 0) { newIndex = this.index; }
        return new ImmutableQuery(update(this.query, updateDef), newIndex);
    };
    ImmutableQuery.areQueriesDifferent = function (queryA, queryB) {
        if (!queryA || !queryB) {
            return true;
        }
        return !_.isEqual(queryA, queryB);
    };
    ImmutableQuery.prototype.getJSON = function () {
        var replacer = function (key, value) {
            if (/^\$/.test(key)) {
                return undefined;
            }
            else {
                return value;
            }
        };
        return JSON.parse(JSON.stringify(this.query, replacer));
    };
    ImmutableQuery.defaultQuery = {
        filter: QueryBuilders_1.BoolMust([]),
        query: QueryBuilders_1.BoolMust([]),
        size: 0
    };
    ImmutableQuery.defaultIndex = {
        filters: {},
        filtersArray: []
    };
    return ImmutableQuery;
})();
exports.ImmutableQuery = ImmutableQuery;
//# sourceMappingURL=ImmutableQuery.js.map