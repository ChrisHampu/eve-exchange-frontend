/* eslint-disable global-require */
import React from 'react';
import { connect } from 'react-redux';
import store from '../../store';
import DashboardPage from '../DashboardPage/DashboardPageComponent';
import DashboardPageMenu from '../DashboardPage/DashboardPageMenu';
import DashboardPageBody from '../DashboardPage/DashboardPageBody';
import PortfoliosViewAll from './PortfoliosViewAll';
import cx from 'classnames';

class Portfolios extends React.Component {

  render() {

    let defaultPath = "/dashboard/portfolios";

    if (this.props.location.pathname === "/dashboard/portfolios/view") {
      defaultPath = this.props.location.pathname;
    }

    const menu = {
      'View All': defaultPath,
      'Create New': "/dashboard/portfolios/create"
    };

    const match = this.props.location.pathname.match(/dashboard\/portfolios\/view\/([0-9]+)/);

    if (match && match[1]) {
      
      return (
        this.props.children
      )

      /*
      const portfolio = this.props.portfolios.find(el => el.portfolioID === parseInt(match[1]));

      if (portfolio) {
        menu[portfolio.name] = `/dashboard/portfolios/view/${portfolio.portfolioID}`;
      } else {

        return (
          this.props.children
        )
      }
      */
    }

    return (
      <DashboardPage title="Portfolios" fullWidth={true}>
        <DashboardPageMenu menu={menu}
          location={this.props.location}
        />
        <DashboardPageBody children={this.props.children} defaultComponent={<PortfoliosViewAll />} padding={false}/>
      </DashboardPage>
    );
  }
}

const mapStateToProps = function(store) {
  return { portfolios: store.portfolios.all };
}

export default connect(mapStateToProps)(Portfolios);