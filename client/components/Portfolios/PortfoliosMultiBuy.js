/* eslint-disable global-require */
import 'whatwg-fetch';
import React from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import cx from 'classnames';
import s from './PortfoliosMultiBuy.scss';
import { formatNumber, formatNumberUnit } from '../../utilities';
import { itemIDToName } from '../../market';
import { APIEndpointURL } from '../../globals';
import { getAuthToken } from '../../deepstream';

// Material UI
import TextField from 'material-ui/TextField';
import CircularProgress from 'material-ui/CircularProgress';
import RaisedButton from 'material-ui/RaisedButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';

export default class PortfoliosMultiBuy extends React.Component {

  static propTypes = {

    portfolio: React.PropTypes.object
  };

  constructor(props) {
    super(props);

    this.state = {
      results: null,
      region: 10000002,
      quantity: 1,
      totalPrice: 0,
      loading: false,
      queueQuery: true
    };
  }

  componentDidUpdate() {
    
    if (this.state.loading === false && this.state.queueQuery === true && this.state.quantity) {

      this.setState({
        loading: true,
        queueQuery: false,
        results: null
      }, async () => {

        const res = await fetch(`${APIEndpointURL}/portfolio/get/${this.props.portfolio.portfolioID}/multibuy?region=${this.state.region}&quantity=${this.state.quantity}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Token ${getAuthToken()}`
          }
        });

        const result = await res.json();

        if (result.error) {
          this.setState({
            loading: false
          });
        } else {

          const results = Object.keys(result.components).map(type => { return {
            defecit: result.components[type].defecit,
            price: result.components[type].price,
            wanted: result.components[type].wanted,
            available: result.components[type].available,
            type: parseInt(type)
          }})

          this.setState({
            loading: false,
            totalPrice: result.totalCost,
            results
          })
        }
      });
    }
  }
 
  setRegion = (event, index, value) => { this.setState({queueQuery: true}); this.setState({region: parseInt(value) || null}); };
  setQuantity = (event) => { this.setState({queueQuery: true}); this.setState({quantity: parseFloat(event.target.value) || null}) };

  render() {

    return (
      <div className={s.root}> 
          <div className={s.options}>
            <SelectField
              value={this.state.region}
              onChange={this.setRegion}
              floatingLabelText="Region"
              floatingLabelStyle={{color: "#BDBDBD"}}
            >
              <MenuItem value={10000002} primaryText="Jita/The Forge" />
              <MenuItem value={10000043} primaryText="Amarr/Domain" />
              <MenuItem value={10000032} primaryText="Dodixie/Sing Laison" />
              <MenuItem value={10000030} primaryText="Rens/Heimatar" />
              <MenuItem value={10000042} primaryText="Hek/Metropolis" />
            </SelectField>
            <TextField
              type="number"
              floatingLabelText="Quantity"
              floatingLabelStyle={{color: "#BDBDBD"}}
              underlineStyle={{borderColor: "rgba(255, 255, 255, 0.298039)"}}
              underlineFocusStyle={{borderColor: "rgb(235, 169, 27)"}}
              inputStyle={{color: "#FFF"}}
              style={{display: "block", marginBottom: ".8rem"}}
              onChange={this.setQuantity}
              defaultValue={this.state.quantity}
            />
            <div className={s.total_price}>
              Total Cost: <span>{formatNumberUnit(this.state.totalPrice)}</span>
            </div>
        </div>
        <div className={s.table}>
        {
          !this.state.results ?
            <div style={{display: "flex", alignItems: "center", width: "100%", height: "100%"}}>
              <CircularProgress color="#eba91b" style={{margin: "0 auto"}}/>
            </div>
            :
            <Table selectable={false} style={{backgroundColor: "rgb(40, 46, 51)"}}>
              <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                <TableRow selectable={false}>
                  <TableHeaderColumn>Component</TableHeaderColumn>
                  <TableHeaderColumn>Price</TableHeaderColumn>
                  <TableHeaderColumn>Available</TableHeaderColumn>
                  <TableHeaderColumn>Wanted</TableHeaderColumn>
                  <TableHeaderColumn>Defecit</TableHeaderColumn>
                </TableRow>
              </TableHeader>
              <TableBody displayRowCheckbox={false}>
                {
                  this.state.results.map((el, i) => {
                    return (
                      <TableRow key={i} selectable={false}>
                        <TableRowColumn>{itemIDToName(el.type)}</TableRowColumn>
                        <TableRowColumn>{formatNumberUnit(el.price)}</TableRowColumn>
                        <TableRowColumn>{formatNumber(el.available)}</TableRowColumn>
                        <TableRowColumn>{formatNumber(el.wanted)}</TableRowColumn>
                        <TableRowColumn><span className={cx({[s.green]: el.defecit===0, [s.red]: el.defecit})}>{formatNumber(el.defecit)}</span></TableRowColumn>
                      </TableRow>
                    )
                  })
                }
              </TableBody>
            </Table>
        }
        </div>
      </div>
    );
  }
}