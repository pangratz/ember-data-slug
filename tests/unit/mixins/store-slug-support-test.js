import EmberObject from '@ember/object';
import RSVP from 'rsvp';
import StoreSlugSupportMixin from 'ember-data-slug/mixins/store-slug-support';
import { module, test } from 'qunit';

let Store;
let queryRecordCalled, queryRecordModelName, queryRecordQuery;
let findRecordCalled, findRecordModelName, findRecordId, findRecordOptions;

module('Unit | Mixin | store slug support', function(hooks) {
  hooks.beforeEach(function() {
    queryRecordCalled = 0;
    findRecordCalled = 0;

    Store = EmberObject.extend({
      findRecord(modelName, id, options) {
        findRecordCalled++;
        findRecordModelName = modelName;
        findRecordId = id;
        findRecordOptions = options;

        return RSVP.resolve({
          id: '123'
        });
      },

      queryRecord(modelName, query) {
        queryRecordCalled++;
        queryRecordModelName = modelName;
        queryRecordQuery = query;

        return RSVP.resolve({
          id: '123'
        });
      }
    }).extend(StoreSlugSupportMixin);
  });

  hooks.afterEach(function() {
    Store = null;
  });

  test('makes first request via queryRecord, subsequent via findRecord', async function(assert) {
    let store = Store.create();

    await store.findRecord('my-model', 'the-slug');

    assert.equal(findRecordCalled, 0);
    assert.equal(queryRecordCalled, 1);
    assert.equal(queryRecordModelName, 'my-model');
    assert.deepEqual(queryRecordQuery, { __ember_data_slug: 'the-slug' });

    await store.findRecord('my-model', '123');

    assert.equal(queryRecordCalled, 1);
    assert.equal(findRecordCalled, 1);
    assert.equal(findRecordModelName, 'my-model');
    assert.equal(findRecordId, '123');
    assert.equal(findRecordOptions, undefined);

    await store.findRecord('my-model', '123');

    assert.equal(queryRecordCalled, 1);
    assert.equal(findRecordCalled, 2);
    assert.equal(findRecordModelName, 'my-model');
    assert.equal(findRecordId, '123');
    assert.equal(findRecordOptions, undefined);
  });

  test('coerces passed slug/id into string', async function(assert) {
    let store = Store.create();

    await store.findRecord('my-model', 999);

    assert.equal(queryRecordCalled, 1);
    assert.equal(findRecordCalled, 0);
    assert.equal(queryRecordModelName, 'my-model');

    await store.findRecord('my-model', 123);

    assert.equal(queryRecordCalled, 1);
    assert.equal(findRecordCalled, 1);
    assert.equal(findRecordId, '123');

    await store.findRecord('my-model', '123');

    assert.equal(queryRecordCalled, 1);
    assert.equal(findRecordCalled, 2);
    assert.equal(findRecordId, '123');
  });

  test('passes through the options to _super#findRecord', async function(assert) {
    let store = Store.create();

    // simulate findRecord already being invoked
    await store.findRecord('my-model', '123');

    await store.findRecord('my-model', '123', {
      myCustomOptions: true
    });

    assert.deepEqual(findRecordOptions, {
      myCustomOptions: true
    });
  });

  test('passes correct query to queryRecord', async function(assert) {
    let store = Store.create();

    await store.findRecord('my-model', 999, {
      include: 'other-model',
      otherParam: true,
      adapterOptions: {
        hello: 'world'
      }
    });

    assert.deepEqual(queryRecordQuery, {
      __ember_data_slug: '999',
      adapterOptions: {
        hello: 'world'
      },
      include: 'other-model',
      otherParam: true
    });
  });

  test('works with different models', async function(assert) {
    let store = Store.create();

    await store.findRecord('my-first-model', 1);

    assert.equal(queryRecordCalled, 1);
    assert.equal(findRecordCalled, 0);
    assert.equal(queryRecordModelName, 'my-first-model');

    await store.findRecord('my-second-model', 1);

    assert.equal(queryRecordCalled, 2);
    assert.equal(findRecordCalled, 0);
    assert.equal(queryRecordModelName, 'my-second-model');

    await store.findRecord('my-first-model', 1);

    assert.equal(queryRecordCalled, 2);
    assert.equal(findRecordCalled, 1);
    assert.equal(findRecordModelName, 'my-first-model');

    await store.findRecord('my-second-model', 1);

    assert.equal(queryRecordCalled, 2);
    assert.equal(findRecordCalled, 2);
    assert.equal(findRecordModelName, 'my-second-model');
  });
});
