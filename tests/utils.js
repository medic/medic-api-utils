
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

exports['setTaskState sets state value'] = function(test) {
  var msg = {
    state: 'orig'
  };
  utils.setTaskState(msg, 'new');
  test.equal(msg.state, 'new');
  test.done();
};

exports['setTaskState sets state history'] = function(test) {
  var msg = {
    state: 'orig'
  };
  utils.setTaskState(msg, 'new');
  test.equal(msg.state_history[0].state, 'new');
  test.ok(msg.state_history[0].timestamp);
  test.done();
};

exports['getTask handles falsey params quietly'] = function(test) {
  test.equals(utils.getTask(), void 0);
  test.equals(utils.getTask(''), void 0);
  test.equals(utils.getTask('', {}), void 0);
  test.equals(utils.getTask('foo', {}), void 0);
  test.done();
};

exports['getTask finds a task by id'] = function(test) {
  var doc = {
    tasks: [{
      messages: [{
        message: 'smell the roses',
        uuid: '0158bd30'
      }]
    }, {
      messages: [{
        message: 'breathe',
        uuid: 'c1d24d0a'
      }]
    }]
  };
  var msg = utils.getTask('0158bd30', doc);
  test.same(msg, {
    messages: [{
      message: 'smell the roses',
      uuid: '0158bd30'
    }]
  });
  test.done();
};

exports['getTask finds a scheduled task by id'] = function(test) {
  var doc = {
    scheduled_tasks: [{
      messages: [{
        message: 'smell the roses',
        when: 'tomorrow',
        uuid: '0158bd30'
      }]
    }, {
      messages: [{
        message: 'breathe',
        when: '10 secs',
        uuid: 'c1d24d0a'
      }]
    }]
  };
  var msg = utils.getTask('0158bd30', doc);
  test.same(msg, {
    messages: [{
      message: 'smell the roses',
      when: 'tomorrow',
      uuid: '0158bd30'
    }]
  });
  test.done();
};

exports['getLocale returns en by default'] = function(test) {
  test.equals('en', utils.getLocale());
  test.done();
};

exports['getLocale returns locale if passed in'] = function(test) {
  test.equals('sw', utils.getLocale({}, 'sw'));
  test.done();
};

exports['getLocale returns locale if found on the record'] = function(test) {
  test.equals('sw', utils.getLocale({locale: 'sw'}, 'jp'));
  test.equals('sw', utils.getLocale({sms_message: {locale: 'sw'}}, 'jp'));
  test.equals('sw', utils.getLocale({fields: {locale: 'sw'}}, 'jp'));
  test.done();
};
