import EmberObject from '@ember/object';
import AdapterSlugSupportMixin from 'ember-data-slug/mixins/adapter-slug-support';
import { module, test } from 'qunit';

module('Unit | Mixin | adapter slug support', function() {
  test('urlForQueryRecord calls urlForFindRecord', function(assert) {
    let AdapterSlugSupportObject = EmberObject.extend(AdapterSlugSupportMixin);
    let subject = AdapterSlugSupportObject.create({
      urlForFindRecord(id, modelName) {
        assert.equal(id, 'the-slug');
        assert.equal(modelName, 'my-model');
      }
    });

    let query = {
      __ember_data_slug: 'the-slug'
    };

    subject.urlForQueryRecord(query, 'my-model');
  });

  test('urlForQueryRecord calls _super when not invoked for ember-data-slug', function(assert) {
    let AdapterSlugSupportObject = EmberObject.extend({
      urlForQueryRecord(query, modelName) {
        assert.deepEqual(query, {
          slug: 'the-slug'
        });
        assert.equal(modelName, 'my-model');
      }
    }).extend(AdapterSlugSupportMixin);

    let subject = AdapterSlugSupportObject.create();

    let query = {
      slug: 'the-slug'
    };

    subject.urlForQueryRecord(query, 'my-model');
  });

  test('sortQueryParams removes properties when invoked for ember-data-slug', function(assert) {
    let AdapterSlugSupportObject = EmberObject.extend(AdapterSlugSupportMixin);
    let subject = AdapterSlugSupportObject.create();

    let queryParams = {
      __ember_data_slug: '123',
      other: true
    };

    subject.sortQueryParams(queryParams);

    assert.deepEqual(queryParams, { other: true });
  });

  test('sortQueryParams ignores properties if not invoked for ember-data-slug', function(assert) {
    let AdapterSlugSupportObject = EmberObject.extend(AdapterSlugSupportMixin);
    let subject = AdapterSlugSupportObject.create();

    let queryParams = {
      slug: 'the-slug'
    };

    subject.sortQueryParams(queryParams);

    assert.deepEqual(queryParams, { slug: 'the-slug' });
  });
});
