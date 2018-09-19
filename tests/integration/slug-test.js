import { run } from '@ember/runloop';
import DS from 'ember-data';
import Pretender from 'pretender';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
// import startApp from '../helpers/start-app';
// import destroyApp from '../helpers/destroy-app';

const { AdapterError } = DS;

function json(data) {
  return [200, {}, JSON.stringify(data)];
}

module('ember-data slug suport for findRecord', function(hooks) {
  setupTest(hooks);

  hooks.beforeEach(function() {
    // this.application = startApp();

    this.server = new Pretender();

    this.store = this.owner.lookup('service:store');

    this.findRecord = (...args) => {
      return run(this.store, 'findRecord', ...args);
    }
  });

  hooks.afterEach(function() {
    this.server.shutdown();

    // destroyApp(this.application);
  });

  test('record can be requested via slug', async function(assert) {
    this.server.get('/my-models/the-slug', function() {
      return json({
        data: {
          type: 'my-model',
          id: 'the-id'
        }
      });
    });

    let foundViaSlug = await this.findRecord('my-model', 'the-slug');
    assert.equal(foundViaSlug.get('id'), 'the-id');

    this.server.get('/my-models/the-id', function() {
      return json({
        data: {
          type: 'my-model',
          id: 'the-id'
        }
      });
    });

    let foundViaId = await this.findRecord('my-model', 'the-id', { reload: true });
    assert.equal(foundViaId.get('id'), 'the-id');

    assert.deepEqual(foundViaSlug, foundViaId);
  });

  test('no record for the slug model is created', async function(assert) {
    this.server.get('/my-models/the-slug', function() {
      return json({
        data: {
          type: 'my-model',
          id: 'the-id'
        }
      });
    });

    await this.findRecord('my-model', 'the-slug');

    let slugRecord = this.store.peekRecord('my-model', 'the-slug');
    assert.notOk(slugRecord);
  });

  test('not found slug throws AdapterError', async function(assert) {
    this.server.get('/my-models/the-slug', function() {
      return [404, {}, null];
    });

    try {
      await this.findRecord('my-model', 'the-slug');
    } catch (error) {
      assert.ok(error instanceof AdapterError);
    }
  });

  test('not found slug rejects promise', async function(assert) {
    this.server.get('/my-models/the-slug', function() {
      return [404, {}, null];
    });

    await this.findRecord('my-model', 'the-slug').then(function() {
      throw "error";
    }, function(error) {
      assert.ok(error instanceof AdapterError);
    });
  });

  test('store.findRecord(modelName, slug) calls store.queryRecord', async function(assert) {
    this.server.get('/my-models/the-slug', function() {
      return json({
        data: {
          type: 'my-model',
          id: 'the-id'
        }
      });
    });

    this.store.reopen({
      queryRecord(modelName, query) {
        assert.equal(modelName, 'my-model');
        assert.deepEqual(query, {
          __ember_data_slug: 'the-slug'
        });

        return this._super(...arguments);
      }
    });

    let foundViaSlug = await this.findRecord('my-model', 'the-slug');
    assert.ok(foundViaSlug);
  });
});
