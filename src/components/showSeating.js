import React, { Component } from 'react';
import Divider from '@material-ui/core/Divider';
import {AppBar,Toolbar,Button,Typography} from '@material-ui/core/';
import {IconButton} from '@material-ui/core/';
import { withStyles } from '@material-ui/core/styles';
import Time from 'react-time';
import PropTypes from 'prop-types';
import Back from '@material-ui/icons/ChevronLeft';
import {Table,TableBody,TableCell,TableHead,TableRow} from '@material-ui/core/';
import Paper from '@material-ui/core/Paper';


const styles = {
  root: {
    flexGrow: 1,
  },
  flex: {
    flex: 1,
  },

};

class ShowSeating extends Component {

  constructor(props) {
      super(props);
      this.state = {
        ShowId: props.match.params.showId,
        MovieId:null,
        MovieName:null,
        TheaterId:null,
        TheaterName:null,
        ShowTime:null,
        selectedArray:new Map(),
        ShowSeating: []
      };
    }

    componentDidMount(){
      fetch('http://localhost:6001/getShowSeats/'+this.state.ShowId)
       .then((response)=>{
         return response.json()})
       .then(
         (result) => {
           var temp=   result.reduce((p,c) => (p[c.show_id] ? p[c.show_id].push(c) : p[c.show_id] = [c],p), {});
           var arr = Object.keys(temp).map(k => ({showId: k, MovieId:(temp[k])[0].movie_id, MovieName: (temp[k])[0].movie_name,
             TheaterId:(temp[k])[0].theater_id, TheaterName:(temp[k])[0].name, ShowTime:(temp[k])[0].show_time, showSeating: temp[k]}));

             var temp1=   result.reduce((p,c) => (p[c.Rowseq] ? p[c.Rowseq].push(c) : p[c.Rowseq] = [c],p), {});
             var arr2 = Object.keys(temp1).map(k => ({Rowseq: k, RowName:(temp1[k])[0].RowName, showSeating: temp1[k]}));

              this.setState({
                MovieId:arr[0].MovieId,
                MovieName:arr[0].MovieName,
                TheaterId:arr[0].TheaterId,
                TheaterName:arr[0].TheaterName,
                ShowTime:arr[0].ShowTime,
                ShowSeating: arr2
              });
              console.log(this.state);
         }
       )
    }

     handleClick(){
      window.history.back();
    }

   markSelected(id,seatName,e){

     var selectedArray = this.state.selectedArray;
     selectedArray.set(id,seatName);
     this.setState(selectedArray: selectedArray);
     console.log(this.state);

   }

   removeSelected(id,seatName,e){
     var selectedArray = this.state.selectedArray;
     selectedArray.delete(id);
     this.setState(selectedArray: selectedArray);
     console.log(this.state);
   }

   isSelected(id,seatName){
     var selectedArray = this.state.selectedArray;
     var hasValue = false;
     if(selectedArray.has(id)){
       hasValue = true;
     }
     return hasValue;
   }

   strMapToObj(strMap) {
       let obj = Object.create(null);
       for (let [k,v] of strMap) {
           obj[k] = v;
       }
       return obj;
   }

   blockTickets(){
     var txnId =null;
     var txnpage = '';
     fetch('http://localhost:6001/blockShowSeats',{
        method: 'PATCH',
        body: JSON.stringify(this.strMapToObj(this.state.selectedArray)),
        headers: {
            'Content-Type': 'application/json'
        }
    })
      .then((response)=>{
        return response.json()
      })
        .then((result) => {
             txnId = result.txnId;
             if(txnId === 'AlreadyBlocked'){
               alert('One of More selected seats are already blocked');
             }
             else{
             txnpage = '/transaction/'+txnId;
             this.props.history.push(txnpage);
           }
          }
        );
   }

   bookTickets(){
     var selectedArr = this.state.selectedArray;
     
     if(selectedArr.size===0){
       alert("Select atleast on Seat");
       return;
     }
     if(selectedArr.size>6){
       alert("Maximum of 6 seats can be booked on one ticket");
       return;
     }
     this.blockTickets();
   }



  render() {
const { classes } = this.props;
const images = {
available: require('./images/available.gif'),
booked: require('./images/booked.gif'),
selected: require('./images/selected.gif'),
unavailable: require('./images/unavailable.gif')
}
    return(

           <div>
           <AppBar position="static">
               <Toolbar>
               <IconButton color="inherit" aria-label="back"  onClick={this.handleClick}>
               <Back />
               </IconButton>
               <Typography variant="title" color="inherit" className={classes.flex}>
                 {this.state.MovieName}
               </Typography>
               <Typography variant="subheading" color="inherit" className={classes.flex}>
                 {this.state.TheaterName}
               </Typography>
               <Typography variant="title" color="inherit" className={classes.flex}>
                 <Time value={this.state.ShowTime} format="HH:mm" />
               </Typography>
               <Button size="large" color="inherit" onClick={()=> this.bookTickets()}>Book</Button>
               </Toolbar>
           </AppBar>
           <br/>
      <Divider />

           <Paper className={classes.root}>
             <Table style={{width: '50px'}} className={classes.table}>
               <TableHead>
               <TableRow>
                 <TableCell></TableCell>
                           <TableCell style={{ width: '10px'}}>1</TableCell>
                           <TableCell style={{  width: '10px'}}>2</TableCell>
                           <TableCell style={{ width: '10px'}}>3</TableCell>
                           <TableCell style={{  width: '10px'}}>4</TableCell>
                           <TableCell style={{ width: '10px'}}>5</TableCell>
                           <TableCell style={{ width: '10px'}}>6</TableCell>
                           <TableCell style={{ width: '10px'}}>7</TableCell>
                           <TableCell style={{ width: '10px'}}>8</TableCell>
                           <TableCell style={{ width: '10px'}}>9</TableCell>
                           <TableCell style={{ width: '10px'}}>10</TableCell>
                </TableRow>
               </TableHead>
               <TableBody style={{width: 100}}>
                 {this.state.ShowSeating.map(Row => {
                   return (
                     <TableRow key={Row.Rowseq}>
                       <TableCell style={{padding:'none', width: '10px'}} variant="head" component="th" scope="row">
                         {Row.RowName}
                       </TableCell>
                       {Row.showSeating.map(column =>{



                           if(column.state==='EMPTY' && !this.isSelected(column.show_seat_id, Row.RowName+column.column_number))
                            return(
                              <TableCell style={{width: '10px'}}>
                           <img src={images['available']} alt="Check" onClick={(e) => this.markSelected(column.show_seat_id,Row.RowName+column.column_number, e)}></img>
                           </TableCell>
                         );
                         else if(column.state==='EMPTY' && this.isSelected(column.show_seat_id, Row.RowName+column.column_number))
                          return(
                            <TableCell style={{width: '10px'}}>
                         <img src={images['selected']} alt="Check" onClick={(e) => this.removeSelected(column.show_seat_id,Row.RowName+column.column_number, e)}></img>
                         </TableCell>
                       );
                           else if(column.state==='BOOKED')
                           return(
                              <TableCell style={{width: '10px'}}>
                           <img src={images['booked']} alt="Check"></img>
                           </TableCell>
                         );
                           else if(column.state === 'BLOCKED')
                           return(
                              <TableCell style={{width: '10px'}}>
                           <img src={images['unavailable']} alt="Check"></img>
                           </TableCell>

                         );
                       }
                      )}
                     </TableRow>
                   );
                 })}
               </TableBody>
             </Table>
           </Paper>


            <Divider />

           </div>

    )
  }




}
ShowSeating.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles) (ShowSeating);
