import React, { Component } from 'react';
import {Card,  CardHeader, CardMedia, Grid} from '@material-ui/core/';



import Shows from './shows'

class Movies extends Component {

  constructor(props) {
      super(props);
      this.state = {
        onDate: this.formatDate(new Date(2018, 5, 23)),
        movies: []
      };
    }

    componentDidMount(){
      fetch('http://localhost:6001/movies/'+'2018-06-23')
       .then((response)=>{
         return response.json()})
       .then(
         (result) => {
           this.setState({
               movies: result
           });
         }
       )
    }
    formatDate(date) {      
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [year, month, day].join('-');
    }
  render() {

    const images = {
  Tag: require('./images/Tag.jpg'),
  Oceans8: require('./images/Oceans8.jpg'),
  Incredibles2: require('./images/Incredibles2.jpg'),
  DeadPool2: require('./images/DeadPool2.jpg'),
  SoloAStarWarsStory: require('./images/SoloAStarWarsStory.jpg')
}

    return(

           <div>
           <br/>
           {this.state.movies.map(mov =>
             <Grid container spacing={32}>
             <Grid item xs={6} sm={3}>
             <Card>
                 <CardHeader
                   title={mov.movie_name}
                 />
                 <CardMedia>
                   <img  src={images[mov.movie_thumbnail]} alt={mov.movie_name}></img>
                 </CardMedia>
               </Card>
             </Grid>
            <Grid item xs={6} sm={6}>
            <Shows movieid={mov.movie_id} showDate={this.state.onDate}></Shows>
            </Grid>
            </Grid>


             /* <div key={mov.movie_id}>
            <table align="center"><tr>
             <td>
             <img  src={images[mov.movie_thumbnail]} alt={mov.movie_name}></img>
             <h3>{mov.movie_name}</h3></td>

             <td><Shows movieid={mov.movie_id}></Shows></td>
             </tr>
             <tr></tr>
             </table>
             </div>*/


           )}

           </div>



    )
  }
}

export default Movies;
