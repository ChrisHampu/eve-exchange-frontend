/* eslint-disable global-require */
import React from 'react';
import { connect } from 'react-redux';
import { prettyDate } from '../../utilities';
import PaginatedTable from '../UI/PaginatedTable';
import s from './NotificationsComponent.scss';
import cx from 'classnames';

import { TableHeaderColumn } from 'material-ui/Table';

class Changelog extends React.Component {

  render() {
    return (
      <div className={s.root}>
        <PaginatedTable
          headers={[
            <TableHeaderColumn key={0} style={{textAlign: "left"}}>Message</TableHeaderColumn>,
            <TableHeaderColumn key={1} style={{textAlign: "left", "width": "200px"}}>When</TableHeaderColumn>,
            <TableHeaderColumn key={2} style={{textAlign: "left", "width": "200px"}}>Posted By</TableHeaderColumn>,
          ]}
          items={this.props.changelog.map((el, i) => {
            return (
             <tr key={i} className={s.row}>
                <td className={cx(s.column, s.padded)}>{el.message}</td>
                <td className={s.column} width="200px">{prettyDate(el.time)}</td>
                <td className={s.column} width="200px">{el.poster}</td>
              </tr>
            )
          })}
        />
      </div>
    );
  }
}

const mapStateToProps = function(store) {
  return { changelog: store.feeds.changelog };
}

export default connect(mapStateToProps)(Changelog);