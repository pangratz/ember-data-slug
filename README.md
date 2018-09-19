# ember-data-slug [![Build Status](https://travis-ci.org/pangratz/ember-data-slug.svg?branch=master)](https://travis-ci.org/pangratz/ember-data-slug) [![Ember Observer Score](https://emberobserver.com/badges/ember-data-slug.svg)](https://emberobserver.com/addons/ember-data-slug)

Slug support for `store.findRecord`.

Usage
------------------------------------------------------------------------------

If your API supports to reference a model via slug additionally to the id, then
this addon allows you to use `findRecord` with both the slug or id:

```js
// GET /videos/best-dance-ever
let findViaSlug = store.findRecord("video", "best-dance-ever");

// GET /videos/1
let findViaId = store.findRecord("video", "1");

// both requests return the same response
// {
//   id: "1",
//   slug: "best-dancing-ever",
//   url: "https://www.youtube.com/watch?v=1TphEh0Qgv0"
// }
```

This addon ensures that the same records are referenced within Ember Data:

```js
Ember.RSVP.all([ findViaSlug, findViaId ]).then(function([ foundViaSlug, foundViaId ]) {
  // true
  foundViaSlug === foundViaId;
});
```

Installation
------------------------------------------------------------------------------

Install via:

```
ember install ember-data-slug
```

Contributing
------------------------------------------------------------------------------

### Installation

* `git clone <repository-url>`
* `cd my-addon`
* `npm install`

### Linting

* `npm run lint:hbs`
* `npm run lint:js`
* `npm run lint:js -- --fix`

### Running tests

* `ember test` – Runs the test suite on the current Ember version
* `ember test --server` – Runs the test suite in "watch mode"
* `ember try:each` – Runs the test suite against multiple Ember versions

### Running the dummy application

* `ember serve`
* Visit the dummy application at [http://localhost:4200](http://localhost:4200).

For more information on using ember-cli, visit [https://ember-cli.com/](https://ember-cli.com/).

License
------------------------------------------------------------------------------

This project is licensed under the [MIT License](LICENSE.md).
