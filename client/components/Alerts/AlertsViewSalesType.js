import React from 'react';
import store from '../../store';
import cx from 'classnames';
import s from './AlertsViewSingle.scss';

const salesTypeVerb = (type) => {

  if (type === 0) {
    return 'items are purchased';
  } else if (type === 1) {
    return 'items are sold';
  } else if (type === 2) {
    return 'an order is fulfilled';
  }

  return '';
};

const entityIDToName = (id) => {
  const profiles = store.getState().settings.profiles;

  let profileIndex = profiles.findIndex(el => el.corporation_id === id);

  if (profileIndex === -1) {
    profileIndex = profiles.findIndex(el => el.character_id === id);
  } else {
    return profiles[profileIndex].corporation_name;
  }

  if (profileIndex === -1) {
    return 'unknown profile';
  }

  return profiles[profileIndex].character_name;
};

const AlertsViewSalesType = ({ salesAlertType, salesAlertProfile }) =>
  <div>
  When
    <span className={s.spacer}>
    {salesTypeVerb(salesAlertType)}
    </span>
    by
    <span className={cx(s.spacer, s.gold)}>
    {salesAlertProfile === 0 ? 'any profile ' : entityIDToName(salesAlertProfile)}
    </span>
  </div>;

AlertsViewSalesType.propTypes = {
  salesAlertType: React.PropTypes.number,
  salesAlertProfile: React.PropTypes.number
};

export default AlertsViewSalesType;
