/*jshint node:true*/
module.exports = {
  scenarios: [
    {
      name: 'default',
      bower: {
        dependencies: { }
      }
    },
    {
      name: 'ember-data-2.x',
      npm: {
        devDpendencies: {
          'ember-data': '~2.0'
        }
      }
    },
    {
      name: 'ember-data-1.13',
      bower: {
        dependencies: {
          "ember": "~1.13",
          "ember-data": "~1.13",
          "ember-cli-shims": "0.0.6"
        },
        resolutions: {
          'ember': '~1.13',
          'ember-data': '~1.13'
        }
      },
      npm: {
        devDpendencies: {
          'ember-data': '~1.13'
        }
      }
    }
  ]
};
