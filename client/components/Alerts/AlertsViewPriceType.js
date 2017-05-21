import React from 'react';
import { itemIDToName } from '../../market';
import { formatNumberUnit, formatPercent } from '../../utilities';
import cx from 'classnames';
import s from './AlertsViewSingle.scss';

const priceTypeVerb = (type) => {

  if (type === 0) {
    return 'buy price';
  } else if (type === 1) {
    return 'sell price';
  } else if (type === 2) {
    return 'spread';
  }

  return '';
};

const priceComparatorVerb = (type) => {

  if (type === 0) {
    return 'exceeds';
  } else if (type === 1) {
    return 'is less than';
  } else if (type === 2) {
    return 'equals';
  }

  return '';
};

const AlertsViewPriceType = ({ priceAlertAmount, priceAlertItemID, priceAlertComparator, priceAlertPriceType }) =>
  <div>
  When
    <span className={cx(s.spacer, s.gold)}>
    {itemIDToName(priceAlertItemID)}
    </span>
    <span className={s.spacer}>
    {priceTypeVerb(priceAlertPriceType)}
    </span>
    <span className={s.spacer}>
    {priceComparatorVerb(priceAlertComparator)}
    </span>
    <span className={s.spacer}>
    {priceAlertPriceType === 2 ? <span>{formatPercent(priceAlertAmount)}%</span> : formatNumberUnit(priceAlertAmount)}
    </span>
  </div>;

AlertsViewPriceType.propTypes = {
  priceAlertAmount: React.PropTypes.number,
  priceAlertItemID: React.PropTypes.number,
  priceAlertComparator: React.PropTypes.number,
  priceAlertPriceType: React.PropTypes.number
};

export default AlertsViewPriceType;
