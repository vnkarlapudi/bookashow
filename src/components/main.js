import React, { Component } from 'react';
import Movies from './movies';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import  DatePicker from 'material-ui-pickers/DatePicker';
import MuiPickersUtilsProvider from 'material-ui-pickers/utils/MuiPickersUtilsProvider';
import DateFnsUtils from 'material-ui-pickers/utils/date-fns-utils';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {grey50} from 'material-ui/styles/colors';

class Main extends Component {
  constructor(props) {
      super(props);
      this.state = {
        onDate: new Date()
      };
    }
  handleDateChange(d){
    console.log(d);
  }
  render() {
    const muiTheme = getMuiTheme({
      DatePicker: {
        color:grey50,
        textColor: grey50,
        selectColor:grey50,
        selectTextColor: grey50
      },
    });
    return (
          <div>
            <AppBar position="static">
                <Toolbar>
                  <Typography variant="title" color="inherit" style={{ flex: 1 }}>
                  Book Show
                  </Typography>
                  <MuiThemeProvider muiTheme={muiTheme}>
                  <MuiPickersUtilsProvider utils={DateFnsUtils} >
                  <DatePicker
                    showTodayButton
                    maxDateMessage="Date must be less than today"
                    value={this.state.onDate}
                    disablePast={true}
                    onChange={(e,d)=>this.handleDateChange(d)}
                    animateYearScrolling={false}
                  />
                   </MuiPickersUtilsProvider>
                   </MuiThemeProvider>

                </Toolbar>

            </AppBar>
            <Movies/>

      </div>
    );
  }
}

export default Main;
