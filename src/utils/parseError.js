import _ from 'lodash';

export default function parseError(err) {
  if (err) {
    const errorMessage = _.get(err, 'message');
    if (errorMessage.includes('is required')) {
      return 'Field is missing, ' + errorMessage;
    }
    return errorMessage;
  } else {
    return 'INTERNAL SERVER ERROR';
  }
}
