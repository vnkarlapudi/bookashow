import React, { Component } from 'react';
import {AppBar,Toolbar,Button} from '@material-ui/core/';
import Countdown from 'react-countdown-now';
import {Card,  Grid, CardActions, Typography, CardContent} from '@material-ui/core/';
import Time from 'react-time';


class Transaction extends Component {

  constructor(props) {
      super(props);
      this.state = {
        timeUp:false,
        transaction_id:null,
        movie_name: null,
        theater_name: null,
        show_time:null,
        showSeats: []
      };
    }

    bookTickets(e){
      var arr = Object.create(null);
      arr['noOfSeats']= this.state.showSeats.length;
      arr['txnId']= this.state.transaction_id;
      var jsonObj = JSON.stringify(arr);
      console.log(jsonObj);
      fetch('http://localhost:6001/bookShowSeats',{
         method: 'PATCH',
         body: JSON.stringify(arr),
         headers: {
             'Content-Type': 'application/json'
         }
     })
       .then((response)=>{

         })
         .then(
           (result) => {
             this.props.history.push('/');
           }
         );
    }

    releaseTickets(e){
      var arr = Object.create(null);
      arr['txnId']= this.state.transaction_id;
      fetch('http://localhost:6001/releaseShowSeats',{
         method: 'PATCH',
         body: JSON.stringify(arr),
         headers: {
             'Content-Type': 'application/json'
         }
     })
       .then((response)=>{
         console.log(response);
         })
         .then(
           (result) => {
            this.props.history.push('/');
           }
         );
    }

    componentDidMount(){
        console.log(this.props.match.params.txnId);
        fetch('http://localhost:6001/getTxnSeats/'+this.props.match.params.txnId)
         .then((response)=>{
           return response.json()})
         .then(
           (result) => {
          var temp=   result.reduce((p,c) => (p[c.transaction_id] ? p[c.transaction_id].push(c) : p[c.transaction_id] = [c],p), {});
          console.log(temp);
          var arr = Object.keys(temp).map(k => ({transaction_id: k, movie_name:(temp[k])[0].movie_name, theater_name:(temp[k])[0].name, show_time:(temp[k])[0].show_time, seats: temp[k]}));
           console.log(arr);
             this.setState({
                 transaction_id:arr[0].transaction_id,
                 movie_name:arr[0].movie_name,
                 theater_name:arr[0].theater_name,
                 show_time:arr[0].show_time,
                 showSeats: arr[0].seats,
             });
             console.log(this.state);
           }
         )
    }

  render() {

const renderer = ({ hours, minutes, seconds, completed }) => {
    return (
      <span>
        {minutes}:{seconds}
      </span>
    );
  };

    return(
           <div>
           <AppBar position="static">
           <Toolbar>
           <Typography variant="title" color="inherit">
              Transaction
            </Typography>
            </Toolbar>
           </AppBar>
           <br/>
             <Grid container spacing={32}>
             <Grid item xs={6} sm={3}>

             </Grid>
             <Grid item xs={8} sm={4}>
             <Card>
                   <CardContent>
                     <Typography align="center" noWrap="true" color="textSecondary">
                       {this.state.movie_name}
                       <br/>
                       <br/>
                     </Typography>
                     <Typography align="center" noWrap="true" color="textSecondary">
                       {this.state.theater_name}
                       <br/>
                       <br/>
                     </Typography>
                     <Typography align="center" variant="headline" component="h2">
                         <Time value={this.state.show_time} format="HH:mm" />
                         <br/>
                         <br/>
                     </Typography>
                     <Typography align="center"color="primary">

                     {this.state.showSeats.map(seats =>

                        <span>{seats.RowName}{seats.column_number}  </span>

                     )}
                     </Typography>


                   </CardContent>
                   <CardActions classes={{alignItems: 'center', align:'center',}}>

                     <span>

                     <Button variant="raised" size="medium" onClick={(e) => this.bookTickets()}>Pay</Button>
                     &nbsp;
                     <Button variant="raised" size="medium" onClick={(e) => this.releaseTickets()}>Cancel</Button>
                     </span>

                   </CardActions>
               </Card>
             </Grid>
             <Grid item xs={6} sm={3}>
             <Card>
             <Typography align="center" variant="subheading">
            Time Left
              </Typography>
              <Typography align="center" color="primary" variant="headline" component="h2">
              <Countdown renderer={renderer} date={Date.now() + 120000} onComplete={(e) => this.releaseTickets()}/>
               </Typography>

               </Card>
             </Grid>
            </Grid>
            <br/><br/>

           </div>
    )
  }




}

export default Transaction;
