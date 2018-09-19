'use strict';

module.exports = {
  name: require('./package').name,
  options: {
    babel: {
      plugins: ['transform-object-rest-spread']
    }
  }
};
