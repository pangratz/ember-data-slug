import Map from '@ember/map';
import MapWithDefault from '@ember/map/with-default';
import Mixin from '@ember/object/mixin';
import { get } from '@ember/object';

export default Mixin.create({

  init() {
    this._super(...arguments);

    this._typeSlugCache = MapWithDefault.create({
      defaultValue: function() {
        return Map.create();
      }
    });
  },

  willDestroy() {
    this._super(...arguments);

    this._typeSlugCache.clear();
    delete this._typeSlugCache;
  },

  findRecord(modelName, idOrSlug, options) {
    const slugCache = this._typeSlugCache.get(modelName);

    let coercedIdOrSlug = `${idOrSlug}`;

    let id = slugCache.get(coercedIdOrSlug);
    if (id) {
      return this._super(modelName, id, options);
    }

    // now we know we're dealing with a slug
    let slug = coercedIdOrSlug;

    // get the passed query without reload and backgroundReload, since those
    // are not supported by queryRecord and would end up as query params
    let { reload, backgroundReload, ...query } = options || {}; // eslint-disable-line no-unused-vars

    // add the slug to the query, so the adapter can use it to build the URL
    // for queryRecord
    query.__ember_data_slug = slug;

    return this.queryRecord(modelName, query).then((foundRecord) => {
      id = get(foundRecord, 'id');

      // inform cache about slug -> id mapping
      slugCache.set(slug, id);

      // setup id -> id mapping, so the original findRecord behaviour is
      // maintained: once a record found via the slug is in the store and the
      // record is requested again via store.findRecord("modelName", id) if we
      // don't setup the id -> id mapping here, then the above `if (id)` path
      // is never taken and queryRecord is always used
      slugCache.set(id, id);

      return foundRecord;
    });
  }

});
