import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Card, CardActions, Typography, CardContent} from '@material-ui/core/';
import Time from 'react-time';
import { NavLink } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';


const styles = {
  card: {
    minWidth: 275,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    marginBottom: 1,
    fontSize: 14,
    textAlign:'left'
  },
  pos: {
    marginBottom: 12,
  },
};


class Shows extends Component {

  constructor(props) {    
      super(props);
      this.state = {
        shows: []
      };
    }

    componentDidMount(){
      fetch('http://localhost:6001/getShows/'+this.props.movieid+'/'+this.props.showDate)
       .then((response)=>{
         return response.json()})
       .then(
         (result) => {
        var temp=   result.reduce((p,c) => (p[c.theater_name] ? p[c.theater_name].push(c) : p[c.theater_name] = [c],p), {});
        var arr = Object.keys(temp).map(k => ({theater_name: k, shows: temp[k]}));

           this.setState({
               shows: arr
           });
         }
       )
    }

  render() {
const { classes } = this.props;
    return(
       <div >
       { this.state.shows.map(theater =>
        <Card>
        <CardContent>
          <Typography className={classes.title} color="textSecondary">
                {theater.theater_name}
          </Typography>

</CardContent>
          <CardActions>
             {theater.shows.map(show =>

                <NavLink to={`/showLayout/${show.show_id}`}> <Time key={show.show_id} value={show.show_time} format="HH:mm" /></NavLink>
            )}
          </CardActions>
        </Card>
          )}
        </div>

           /*<div>
            { this.state.shows.map(theater =>
               <div key={theater.theater_name}>
                 <h5>{theater.theater_name}</h5>
               <table align="center"><tr>
               {theater.shows.map(show =>

               <td><a href="" onClick={this.handleClick}><Time key={show.show_id} value={show.show_time} format="HH:mm" /></a></td>

               )}
               </tr></table>
               </div>
           )}
           </div>*/
    )
  }




}

Shows.propTypes = {
  classes: PropTypes.object.isRequired
};
export default withStyles(styles) (Shows);
