import Mixin from '@ember/object/mixin';

export default Mixin.create({

  urlForQueryRecord(query, modelName) {
    let { __ember_data_slug } = query;

    if (__ember_data_slug) {
      return this.urlForFindRecord(__ember_data_slug, modelName);
    }

    return this._super(...arguments);
  },

  // sortQueryParams needs to be used, as there is no other way to modify query
  // params. There will be once `ds-improved-ajax` is enabled, wich will allow
  // us to overwrite dataForRequest instead
  sortQueryParams(queryParams) {
    let { __ember_data_slug } = queryParams;

    if (__ember_data_slug) {
      delete queryParams.__ember_data_slug;
    }

    return this._super(...arguments);
  }

});
