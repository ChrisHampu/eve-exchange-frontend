import React from 'react';
import cx from 'classnames';
import s from './GuidebookPage.scss';

export default class GuidebookHome extends React.Component {

  render() {
    return (
      <div className={s.body}>
        <div className={s.title}>Portfolios</div>
        <p>What we consider portfolios is a little bit different from a traditional portfolio. Our portfolios are really just aggregations for a group of items. When you create a portfolio, you'll select one or more items and their quantities, and then get hourly/daily charts for aggregated statistics along with some extra features depending on the type of portfolio.</p>
        <p>Portfolios are most useful for tracking the long term performance of items. An investor will want this data to determine whether to continue an investment, add to an investment, or remove certain items for an investment. Industrialists need to know the items they want to build will retain their value throughout a long build cycle. This brings us to supporting two types of portfolios detailed below.</p>
        <h3>Trading Portflio</h3>
        <p>A trading portfolio will allow you to select multiple items and a quantity for each. This will give you an aggreaged total portfolio value, an average spread for each item, and track the change in value for the portfolio (growth).</p>
        <p>The portfolio chart looks like a regular item chart, but with only portfolio value, spread, and growth.</p>
        <h3>Industry Portfolio</h3>
        <p>An industrial portfolio requires that you select a manufacturable item, a quantity, and optionally a material efficiency to calculate the input build materials. The portfolio will then show you the number of components required to build the item based upon the blueprint used. Additionally, a separate table will show the number of raw materials/ores that would be needed to build each individual blueprint component.</p>
        <p>The data collected during aggregation will show the individual buy price of each build component, the total price to buy the required quantity of each component, and compare that to the cost of building each component along with a margin percentage. This can help you determine if its better to buy some components but build others. Additionally, the component spider chart can show you relative costs and hot spots in the build.</p>
        <p>The chart for this portfolio will track the total price of components, the build costs of components, and the potential profit as a percentage. The chart supports hourly and daily intervals.</p>
        <h3>Creating Portfolios</h3>
        <p>Each portfolio requres only a name and optionally a description. Trading and industry portfolios have their own separate requirements.</p>
        <p><b>Note:</b> There is a limit of <b>25</b> portfolios per premium account. If you require more, contact us about your use cases and we can consider raising this limit.<br />
        <b>Note:</b> Each portfolio has a limit of 20 items/components. If you require more, contact us about your use cases and we can consider raising this limit.</p>
      </div>
    );
  }
}
