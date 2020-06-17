const moment = require('moment');

function formatMessage(username, text, user_id = '') {
    return {
        username,
        text,
        user_id,
        time: moment().format('HH:mm'),
        id: user_id + moment(),
    }
}

module.exports = formatMessage;
