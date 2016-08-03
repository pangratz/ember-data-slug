# ember-data-slug

Slug support for `store.findRecord`.

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

Install via:

```
ember install ember-data-slug
```

# Development

## Installation

* `git clone` this repository
* `npm install`
* `bower install`

## Running

* `ember serve`
* Visit your app at http://localhost:4200.

## Running Tests

* `npm test` (Runs `ember try:testall` to test your addon against multiple Ember versions)
* `ember test`
* `ember test --server`

## Building

* `ember build`

For more information on using ember-cli, visit [http://ember-cli.com/](http://ember-cli.com/).
