import React from 'react';
import 'normalize.css/normalize.css';
import s from './App.scss';
import store from '../../store';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import injectTapEventPlugin from 'react-tap-event-plugin';

injectTapEventPlugin();

const theme = darkBaseTheme;

theme.palette.primary1Color = '#333a41';
theme.palette.primary2Color = 'rgb(40, 46, 51)';
theme.palette.accent1Color = '#eba91b';
theme.palette.accent2Color = '#eba91b';
theme.palette.accent3Color = '#eba91b';
theme.palette.alternateTextColor = '#59c8e2';

export default class App extends React.Component {
  static propTypes = {
    children: React.PropTypes.object.isRequired
  };

  render() {

    return (
      <div className={s.root}>
        <MuiThemeProvider muiTheme={getMuiTheme(theme)}>
          {this.props.children}
        </MuiThemeProvider>
      </div>
    );
  }
}
