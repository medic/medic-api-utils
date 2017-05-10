exports.isUserAdmin = function(userCtx) {
  return exports.isUserNationalAdmin(userCtx) || exports.isDbAdmin(userCtx);
};

exports.isUserNationalAdmin = function(userCtx) {
  return exports.hasRole(userCtx, 'national_admin');
};

exports.isUserDistrictAdmin = function(userCtx) {
  return exports.hasRole(userCtx, 'district_admin');
};

exports.isDbAdmin = function(userCtx) {
  return exports.hasRole(userCtx, '_admin');
};

exports.hasRole = function(userCtx, role) {
  var roles = (userCtx && userCtx.roles) || [];
  return roles.indexOf(role) >= 0;
};

/**
 * Update task/message object in-place.  Used by message update functions when
 * a message's state changes. Also adds new values to state history.
 *
 * @param {Object} task
 * @param {String} state
 * @param {Any} details (optional)
 * @api public
 */
exports.setTaskState = function(task, state, details) {
  task.state = state;
  task.state_details = details;
  task.state_history = task.state_history || [];
  task.state_history.push({
    state: state,
    state_details: details,
    timestamp: new Date().toISOString()
  });
};

/*
 * Return task object that matches message uuid or a falsey value if match
 * fails.
 *
 * todo rename to getTaskByMessage?
 *
 * @api public
 */
exports.getTask = function(uuid, doc) {
  if (!uuid || !doc) {
    return;
  }
  if (doc.tasks) {
    for (var i = 0; i < doc.tasks.length; i++) {
      for (var j = 0; j < doc.tasks[i].messages.length; j++) {
        if (uuid === doc.tasks[i].messages[j].uuid) {
          return doc.tasks[i];
        }
      }
    }
  }
  if (doc.scheduled_tasks) {
    for (var k = 0; k < doc.scheduled_tasks.length; k++) {
      for (var l = 0; l < doc.scheduled_tasks[k].messages.length; l++) {
        if (uuid === doc.scheduled_tasks[k].messages[l].uuid) {
          return doc.scheduled_tasks[k];
        }
      }
    }
  }
};

/**
 * Determine locale/language of a record based on a locale value:
 *  - Set on the document
 *  - Reported in a form field named `locale`
 *  - Configured in the gateway and set on message post
 *  - Passed into the function/i.e. the value from settings
 *  - Defaults to 'en'
 */
exports.getLocale = function(record, locale) {
  return (record && record.locale) ||
    (record && record.fields && record.fields.locale) ||
    (record && record.sms_message && record.sms_message.locale) ||
    //(settings && settings.locale) ||
    locale ||
    'en';
};
