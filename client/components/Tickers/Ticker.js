/* eslint-disable global-require */
import React from 'react';
import cx from 'classnames';
import s from './Ticker.scss';
import { formatNumber, formatPercent } from '../../utilities';

import Arrow from 'material-ui/svg-icons/av/play-arrow';
import Equal from 'material-ui/svg-icons/editor/drag-handle';

export default class Ticker extends React.Component {

  static propTypes = {
    region: React.PropTypes.number
  };

  render() {

    const { name, regions } = this.props;
    const { index, indexChange, indexChangePercent } = regions[this.props.region];

    const changeType = indexChange < 0 ? 1 : indexChange < 0 ? -1 : 0;

    return (
      <div className={s.root}>
        <div className={s.inner}>
          <div className={s.name}>
          {name}
          </div>
          <div className={cx(s.values, {[s.positive]:changeType===1, [s.negative]:changeType===-1})}>
            <div className={s.arrow}>
            {
              changeType === 1 || changeType === -1 ? <Arrow /> : <Equal />
            }
            </div>
            <div className={s.index}>
            {formatNumber(index)}
            </div>
            <div className={s.changes}>
              <div className={s.change}>
              {changeType===1?"+":""}{formatNumber(indexChange)}
              </div>
              <div className={s.change}>
              {changeType===1?"+":""}{formatPercent(indexChangePercent)}%
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}