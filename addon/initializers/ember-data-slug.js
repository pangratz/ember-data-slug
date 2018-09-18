import DS from 'ember-data';
import {
  AdapterSlugSupport,
  StoreSlugSupport
} from 'ember-data-slug';

const { Store, RESTAdapter } = DS;

export function initialize(/* application */) {
  Store.reopen(StoreSlugSupport);
  RESTAdapter.reopen(AdapterSlugSupport);
}

export default {
  name: 'ember-data-slug',
  initialize
};
