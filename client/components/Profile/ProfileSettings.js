/* eslint-disable global-require */
import React from 'react';
import { connect } from 'react-redux';
import store from '../../store';
//import s from './ProfileComponent.scss';
import cx from 'classnames';

/*
  .subscription_history_table {
    table {
      background-color: rgb(40, 46, 51) !important;
    }
  }

        <TextField
          type="number"
          hintText="Must be less than balance"
          floatingLabelText="Widthrawal Amount"
          errorText={this.checkWithdrawalValid()}
          floatingLabelStyle={{color: "#BDBDBD"}}
          underlineStyle={{borderColor: "rgba(255, 255, 255, 0.298039)"}}
          underlineFocusStyle={{borderColor: "rgb(235, 169, 27)"}}
          inputStyle={{color: "#FFF"}}
          style={{display: "block", marginBottom: ".8rem"}}
          onChange={}
        />

            <Table selectable={false}>
              <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                <TableRow selectable={false}>
                  <TableHeaderColumn>Date</TableHeaderColumn>
                  <TableHeaderColumn>Type</TableHeaderColumn>
                  <TableHeaderColumn>Amount</TableHeaderColumn>
                  <TableHeaderColumn>Description</TableHeaderColumn>
                </TableRow>
              </TableHeader>
              <TableBody displayRowCheckbox={false}>
                <TableRow selectable={false}>
                  <TableRowColumn>{(new Date()).toString()}</TableRowColumn>
                  <TableRowColumn>Widthrawal</TableRowColumn>
                  <TableRowColumn style={{color: "red"}}>-{formatNumber(125000000)} ISK</TableRowColumn>
                  <TableRowColumn>Subscription Fee</TableRowColumn>
                </TableRow>
                <TableRow selectable={false}>
                  <TableRowColumn>{(new Date()).toString()}</TableRowColumn>
                  <TableRowColumn>Deposit</TableRowColumn>
                  <TableRowColumn style={{color: "green"}}>+{formatNumber(125000000)} ISK</TableRowColumn>
                  <TableRowColumn>Player Deposit</TableRowColumn>
                </TableRow>
              </TableBody>
            </Table>
*/

class Settings extends React.Component {

  render() {

    return (
      <div>

      </div>
    );
  }
}

const mapStateToProps = function(store) {
  return { settings: store.settings };
}

export default connect(mapStateToProps)(Settings);