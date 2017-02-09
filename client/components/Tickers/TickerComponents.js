/* eslint-disable global-require */
import React from 'react';
import cx from 'classnames';
import s from './TickerComponents.scss';
import { itemIDToName } from '../../market';
import { formatNumber, formatPercent, formatNumberUnit } from '../../utilities';

import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';

import Arrow from 'material-ui/svg-icons/av/play-arrow';
import Equal from 'material-ui/svg-icons/editor/drag-handle';

export default class TickerComponents extends React.Component {

  constructor(props) {
    super(props);
     
    this.state = {
    };
  }

  render() {

    return (
      <div className={s.root}>
        <Table selectable={false} style={{backgroundColor: "rgb(40, 46, 51)"}}>
          <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
            {
              <TableRow selectable={false}>
                <TableHeaderColumn>Name</TableHeaderColumn>
                <TableHeaderColumn>Price</TableHeaderColumn>
                <TableHeaderColumn>Change</TableHeaderColumn>
                <TableHeaderColumn>Volume Traded</TableHeaderColumn>
                <TableHeaderColumn>Volume Available</TableHeaderColumn>
                <TableHeaderColumn>Market Cap</TableHeaderColumn>
              </TableRow>
            }
          </TableHeader>
          <TableBody displayRowCheckbox={false}>
            {
              this.props.components.sort((el1, el2) => el2.marketCap - el1.marketCap).map(el => {

                const changeType = el.priceChange > 0 ? 1 : el.priceChange < 0 ? -1 : 0;

                return (
                  <TableRow key={el.typeID}>
                    <TableRowColumn><div className={s.name}>{itemIDToName(el.typeID)}</div></TableRowColumn>
                    <TableRowColumn>
                      <div className={cx(s.arrow, {[s.positive]:changeType===1, [s.negative]:changeType===-1})}>
                      {
                        changeType === 1 || changeType === -1 ? <Arrow /> : <Equal />
                      }
                      </div>
                      <div className={s.price}>
                      {formatNumber(el.price)}
                      </div>
                    </TableRowColumn>
                    <TableRowColumn>
                      <div className={cx(s.change, {[s.positive]:changeType===1, [s.negative]:changeType===-1})}>
                      {el.priceChange>0?"+":""}{formatNumber(el.priceChange)}
                      </div>
                      <div className={cx(s.change, {[s.positive]:changeType===1, [s.negative]:changeType===-1})}>
                      {el.priceChange>0?"+":""}{formatPercent(el.priceChangePercent)}%
                      </div>
                    </TableRowColumn>
                    <TableRowColumn>{formatNumberUnit(el.tradeVolume)}</TableRowColumn>
                    <TableRowColumn>{formatNumberUnit(el.volume)}</TableRowColumn>
                    <TableRowColumn>{formatNumberUnit(el.marketCap)}</TableRowColumn>
                  </TableRow>
                )
              })
            }
          </TableBody>
        </Table>
      </div>
    );
  }
}