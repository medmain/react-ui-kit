import React from 'react';
import PropTypes from 'prop-types';
import {format, formatDistanceToNow} from 'date-fns';

// Format a date displaying the time from now: "1 hour ago", "1 month ago"...
// see https://date-fns.org/v2.0.1/docs/formatDistanceToNow
export const TimeAgo = ({date, ...otherProps}) => {
  const formattedDate = formatTimeAgo(date);

  return <span {...otherProps}>{formattedDate}</span>;
};
TimeAgo.propTypes = {
  date: PropTypes.object.isRequired
};

export function formatTimeAgo(date) {
  let formattedDate = formatDistanceToNow(date, {addSuffix: true});
  formattedDate = removePrefix(formattedDate);
  return formattedDate;
}

function removePrefix(formattedDate) {
  return formattedDate.replace(/about |almost /, ''); // remove `about` and `almost` prefixes
}

export const DateTime = ({date, mask, ...otherProps}) => {
  const formattedDate = formatDateTime(date, {mask});

  return <span {...otherProps}>{formattedDate}</span>;
};
DateTime.propTypes = {
  date: PropTypes.object.isRequired
};

export function formatDateTime(date, {mask = `MMMM dd, yyyy 'at' HH:MM`} = {}) {
  return format(date, mask);
}
