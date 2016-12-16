/* eslint-disable global-require */
import React from 'react';
import { connect } from 'react-redux';
import { prettyDate } from '../../utilities';
import PaginatedTable from '../UI/PaginatedTable';

import { TableRow, TableRowColumn, TableHeaderColumn } from 'material-ui/Table';

class Changelog extends React.Component {

  render() {
    return (
      <div style={{display: "flex", height: "100%"}}>
        <PaginatedTable
          headers={[
            <TableHeaderColumn key={0} style={{textAlign: "left"}}>Message</TableHeaderColumn>,
            <TableHeaderColumn key={1} style={{textAlign: "left", "width": "200px"}}>When</TableHeaderColumn>,
            <TableHeaderColumn key={2} style={{textAlign: "left", "width": "200px"}}>Posted By</TableHeaderColumn>,
          ]}
          items={this.props.changelog.map((el, i) => {
            return (
             <TableRow key={i} selectable={false}>
                <TableRowColumn style={{textAlign: "left"}}>{el.message}</TableRowColumn>
                <TableRowColumn style={{textAlign: "left", "width": "200px"}}>{prettyDate(el.time)}</TableRowColumn>
                <TableRowColumn style={{textAlign: "left", "width": "200px"}}>{el.poster}</TableRowColumn>
              </TableRow>
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