/* eslint-disable global-require */
import React from 'react';
import { connect } from 'react-redux';
import store from '../../store';
import { formatNumberUnit } from '../../utilities';
import s from './UsersView.scss';
import fuzzy from 'fuzzy';

import OverlayStack from '../OverlayStack/OverlayStack';

import TextField from 'material-ui/TextField';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

class UsersView extends React.Component {

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      subFilter: 0,
      search: null
    };
  }

  setRoute(path) {

    this.context.router.push(path);
  }

  setSubFilter = (event, index, value) => this.setState({subFilter: value});
  setSearch = (event) => this.setState({search: event.target.value || null});

  render() {

    let subs = this.props.subs || [];

    if (this.state.search) {

      subs = fuzzy.filter(this.state.search, subs, { extract: item => item.user_name.toLowerCase() }).map(el => el.original);

    } else if (this.state.subFilter) {

      if (this.state.subFilter === 1) {
        subs = subs.filter(el => el.premium === true);
      } else if (this.state.subFilter === 2) {
        subs = subs.filter(el => el.premium === false);
      }
    }

    return (
      <OverlayStack popStack={()=>this.context.router.push('/dashboard/users')}>
        <div>
          <div className={s.header}>
            <div className={s.search}>
              <TextField
                floatingLabelText="Search Users"
                floatingLabelStyle={{color: "#BDBDBD"}}
                underlineStyle={{borderColor: "rgba(255, 255, 255, 0.298039)"}}
                underlineFocusStyle={{borderColor: "rgb(235, 169, 27)"}}
                inputStyle={{color: "#FFF"}}
                onChange={this.setSearch}
              />
            </div>
            <div className={s.selector}>
              <SelectField value={this.state.subFilter} onChange={this.setSubFilter}>
                <MenuItem type="text" value={0} primaryText="Show All" style={{cursor: "pointer"}} />
                <MenuItem type="text" value={1} primaryText="Show Premium" style={{cursor: "pointer"}} />
                <MenuItem type="text" value={2} primaryText="Show Free" style={{cursor: "pointer"}} />
              </SelectField>
            </div>
            <div className={s.counter}>
            Showing {subs.length} results
            </div>
          </div>
          <Table selectable={false} style={{backgroundColor: "rgb(40, 46, 51)"}}>
            <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
              <TableRow selectable={false}>
                <TableHeaderColumn style={{textAlign: "center"}}>Name</TableHeaderColumn>
                <TableHeaderColumn style={{textAlign: "center"}}>Status</TableHeaderColumn>
                <TableHeaderColumn style={{textAlign: "center"}}>Balance</TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody displayRowCheckbox={false}>
              {
                subs.length === 0 ?
                  <TableRow selectable={false}>
                    <TableRowColumn>No records available</TableRowColumn>
                  </TableRow>
                  :
                  subs.map((el, i) => {
                    return (
                     <TableRow key={i} selectable={false}>
                        <TableRowColumn style={{textAlign: "center"}}><span className={s.browser_route} onClick={()=>{this.setRoute(`/dashboard/users/view/${el.user_id}`)}}>{el.user_name}</span></TableRowColumn>
                        <TableRowColumn style={{textAlign: "center"}}>{el.premium ? <span className={s.premium}>Premium</span> : "Free"}</TableRowColumn>
                        <TableRowColumn style={{textAlign: "center"}}>{formatNumberUnit(el.balance)}</TableRowColumn>
                      </TableRow>
                    )
                  })
              }
            </TableBody>
          </Table>
       </div>
       {this.props.children}
     </OverlayStack>
    );
  }
}

const mapStateToProps = function(store) {
  return { subs: store.admin.subscriptions };
}

export default connect(mapStateToProps)(UsersView);