import React from 'react';
import 'normalize.css/normalize.css';
import s from './App.scss';
import store from '../../store';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import injectTapEventPlugin from 'react-tap-event-plugin';
import Snackbar from './Snackbar';

injectTapEventPlugin();

const theme = darkBaseTheme;

theme.palette.primary1Color = '#333a41';
theme.palette.primary2Color = 'rgb(40, 46, 51)';
theme.palette.accent1Color = '#eba91b';
theme.palette.accent2Color = '#eba91b';
theme.palette.accent3Color = '#eba91b';
theme.palette.alternateTextColor = '#eba91b';

export default class App extends React.Component {
  static propTypes = {
    children: React.PropTypes.object.isRequired
  };

  render() {

    return (
      <MuiThemeProvider muiTheme={getMuiTheme(theme)}>
        <div className={s.root}>
          {this.props.children}
          <Snackbar className={s.snackbar} />
        </div>
      </MuiThemeProvider>
    );
  }
}
