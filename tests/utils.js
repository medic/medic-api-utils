
var utils = require('../utils');

exports['hasRole returns false with falsey args'] = function(test) {
  test.equal(utils.hasRole(), false);
  test.equal(utils.hasRole(''), false);
  test.equal(utils.hasRole([]), false);
  test.equal(utils.hasRole(null), false);
  test.equal(utils.hasRole({}), false);
  test.equal(utils.hasRole({ roles: [] }), false);
  test.equal(utils.hasRole({ roles: null }), false);
  test.equal(utils.hasRole({ roles: '' }), false);
  test.done();
};

exports['hasRole returns true when user has role'] = function(test) {
  var user = { roles: ['foo'] };
  test.equal(utils.hasRole(user, 'foo'), true);
  test.done();
};

exports['hasRole returns false when user is missing role'] = function(test) {
  var user = { roles: ['foo'] };
  test.equal(utils.hasRole(user, 'bar'), false);
  test.done();
};
