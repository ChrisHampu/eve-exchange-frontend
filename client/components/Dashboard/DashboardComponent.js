/* eslint-disable global-require */
import React from 'react';
import Paper from 'material-ui/Paper';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import s from './DashboardComponent.scss';
import Divider from 'material-ui/Divider';
import ContentCopy from 'material-ui/svg-icons/content/content-copy';
import Download from 'material-ui/svg-icons/file/file-download';
import Delete from 'material-ui/svg-icons/action/delete';
import FontIcon from 'material-ui/FontIcon';
import RemoveRedEye from 'material-ui/svg-icons/image/remove-red-eye';
import PersonAdd from 'material-ui/svg-icons/social/person-add';
import ContentLink from 'material-ui/svg-icons/content/link';
import cx from 'classnames';

export default class Dashboard extends React.Component {

  render() {
    return (
      <div className={s.root}>
        <Paper zDepth={2} className={s.sidebar_container}>
          <div className={s.sidebar_inner}>
            <div  className={s.sidebar_title}>
              Trade Forecaster
            </div>
            <Divider className={s.divider_line} />
            <div className={s.sidebar_menu_divider}>
            Main
            </div>
            <Menu className={s.sidebar_menu}>
              <MenuItem type="text" className={s.sidebar_menu_item} primaryText="Preview" leftIcon={<RemoveRedEye />} />
              <MenuItem type="text" className={cx(s.sidebar_menu_item, s.focused)} primaryText="Share" leftIcon={<PersonAdd />} />
              <MenuItem type="text" className={s.sidebar_menu_item} primaryText="Get links" leftIcon={<ContentLink />} />
              <MenuItem type="text" className={s.sidebar_menu_item} primaryText="Make a copy" leftIcon={<ContentCopy />} />
              <MenuItem type="text" className={s.sidebar_menu_item} primaryText="Download" leftIcon={<Download />} />
              <MenuItem type="text" className={s.sidebar_menu_item} primaryText="Remove" leftIcon={<Delete />} />
            </Menu>
            <Divider className={s.divider_line} />
            <div className={s.sidebar_menu_divider}>
            Admin
            </div>
            <Menu className={s.sidebar_menu}>
              <MenuItem type="text" className={s.sidebar_menu_item} primaryText="Preview" leftIcon={<RemoveRedEye />} />
              <MenuItem type="text" className={s.sidebar_menu_item} primaryText="Share" leftIcon={<PersonAdd />} />
              <MenuItem type="text" className={s.sidebar_menu_item} primaryText="Get links" leftIcon={<ContentLink />} />
              <MenuItem type="text" className={s.sidebar_menu_item} primaryText="Make a copy" leftIcon={<ContentCopy />} />
              <MenuItem type="text" className={s.sidebar_menu_item} primaryText="Download" leftIcon={<Download />} />
              <MenuItem type="text" className={s.sidebar_menu_item} primaryText="Remove" leftIcon={<Delete />} />
            </Menu>
          </div>
        </Paper>
        <div className={s.body_container}>
        </div>
      </div>
    );
  }
}
