import React from 'react';
import cx from 'classnames';
import s from './PaginatedTable.scss';
import {Table, TableBody, TableHeader, TableRow, TableRowColumn} from 'material-ui/Table';

export default class PaginatedTable extends React.Component {

  static propTypes = {

    items: React.PropTypes.array,
    headers: React.PropTypes.array,
    itemsPerPage: React.PropTypes.number,
    showPagination: React.PropTypes.bool
  };

  constructor(props) {
    super(props);

    this.props = props;

    this.state = this.getUpdatedState();
  }

  getUpdatedState() {

    const itemsPerPage = this.props.itemsPerPage || 100;

    return {
      itemsPerPage: itemsPerPage,
      page: 0,
      pageCount: Math.ceil(this.props.items.length / itemsPerPage),
      showPagination: this.props.showPagination || true
    };
  }

  componentWillReceiveProps(nextProps) {
    
    this.props = nextProps;

    this.update();
  }

  update() {

    this.setState(this.getUpdatedState());
  }

  getItems() {

    return this.props.items.slice(this.state.page * this.state.itemsPerPage, (this.state.page + 1) * this.state.itemsPerPage);
  }

  render() {

    return (
      <div className={s.root}>
        <div className={s.table}>
          <Table selectable={false} style={{backgroundColor: "rgb(40, 46, 51)"}}>
            <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
              <TableRow selectable={false}>
              {this.props.headers}
              </TableRow>
            </TableHeader>
            <TableBody displayRowCheckbox={false}>
              {
                !this.props.items || this.props.items.length === 0 ?
                  <TableRow selectable={false}>
                    <TableRowColumn>No records available</TableRowColumn>
                  </TableRow>
                  :
                  this.getItems()
              }
            </TableBody>
          </Table>
        </div>    
        <div className={s.paginator}>
          {
            this.state.pageCount <= 1 ? <span className={s.active}>1</span> :
            [...Array(this.state.pageCount)].map((_, page) => 
              <span
                className={cx({[s.active]: this.state.page===page})}
                onClick={()=>this.setState({page: page})}
              >
                {page+1}
              </span>
            )
          }
        </div>
      </div>
    );
  }
};