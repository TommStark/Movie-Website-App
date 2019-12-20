import React, { Component } from "react";
import { API_URL, API_KEY } from "../../config";
import MovieInfo from "../elements/MovieInfo/MovieInfo";
import MovieInfoBar from "../elements/MovieInfoBar/MovieInfoBar";
import FourColGrid from "../elements/FourColGrid/FourColGrid";
import Actor from "../elements/Actor/Actor";
import Spinner from "../elements/Spinner/Spinner";
import Navigation from "../elements/Navigation/Navigation";
import CastService from "../services/CastService"
import "./Movie.css";

class Movie extends Component {
  state = {
    movie: null,
    actors: null,
    directors: [],
    loading: false
  };

  componentDidMount() {
    this.setState({
      loading: true
    });
    const endpoint = `${API_URL}movie/${this.props.match.params.movieId}?api_key=${API_KEY}&languaje=en-US`;
    this.fetchItems(endpoint);
  }

  // init() {
  //   const endpoint = `${API_URL}movie/${this.props.match.params.movieId}/credits?api_key=${API_KEY}`;
  //   fetch(endpoint)
  //     .then(response => {
  //       response.json();
  //     })
  //     .then(data => {
  //       const directors = data.crew.filter(member => member.job === "Director");
  //       this.setState({
  //         actors: data.cast,
  //         directors,
  //         loading: false
  //       });
  //     });
  // }

  fetchItems = endpoint => {
    fetch(endpoint)
      .then(result => result.json())
      .then(result => {
        debugger
        if (result.status_code) {
          this.setState({ loading: false });
        } else {
          this.setState({ movie: result });
          let cast = CastService.getCast(this.props.match.params.movieId);
          console.log(cast)
        }
      })
      .catch(function(error) {
        console.log("ERRROR:" + error.message);
      });
  };

  render() {
    return (
      <div className="rmdb-movie">
        {this.state.movie ? (
          <div>
            <Navigation movie={this.state.movie.title} />
            <MovieInfo
              movie={this.state.movie}
              directors={this.state.directors}
            />
            <MovieInfoBar
              time={this.state.movie.runtime}
              budget={this.state.movie.budget}
              revenue={this.state.movie.revenue}
            />
          </div>
        ) : null}
        {this.state.actors ? (
          <div className="rmdb-movie-grid">
            <FourColGrid header={"Actors"}>
              {this.state.actors.map((e, i) => {
                return <Actor key={i} actor={e} />;
              })}
            </FourColGrid>
          </div>
        ) : null}
        {!this.state.actors && !this.state.movie && !this.state.loading ? <h1>No Movie Found!</h1> : null}
        {this.state.loading ? <Spinner /> : null}
      </div>
    );
  }
}
export default Movie;
