import React, { Component } from "react";
import { API_URL, API_KEY } from "../../config";
import MovieInfo from "../elements/MovieInfo/MovieInfo";
import MovieInfoBar from "../elements/MovieInfoBar/MovieInfoBar";
import FourColGrid from "../elements/FourColGrid/FourColGrid";
import Actor from "../elements/Actor/Actor";
import Spinner from "../elements/Spinner/Spinner";
import Navigation from "../elements/Navigation/Navigation";
import CastService from "../services/CastService";
import "./Movie.css";

class Movie extends Component {
  state = {
    movie: null,
    actors: null,
    directors: [],
    loading: false
  };

  componentDidMount() {
    if (localStorage.getItem(`${this.props.match.params.movieId}`)) {
      const state = JSON.parse(
        localStorage.getItem(`${this.props.match.params.movieId}`)
      );
      this.setState({
        ...state
      });
    } else {
      this.setState({
        loading: true
      });
      const endpoint = `${API_URL}movie/${this.props.match.params.movieId}?api_key=${API_KEY}&languaje=en-US`;
      this.fetchItems(endpoint);
    }
  }
  fetchItems = endpoint => {
    fetch(endpoint)
      .then(result => result.json())
      .then(result => {
        if (result.status_code) {
          console.log(result)
          this.setState({ loading: false });
        } else {
          this.setState({ movie: result }, () => {
            const endpoint = `${API_URL}movie/${this.props.match.params.movieId}/credits?api_key=${API_KEY}`;
            fetch(endpoint)
              .then(response => response.json())
              .then(data => {
                console.log(data)
                const directors = data.crew.filter(member => member.job === "Director");
                this.setState({
                  loading: false,
                  actors: data.cast,
                  directors,
                });
              })
            localStorage.setItem(
              `${this.props.match.params.movieId}`,
              JSON.stringify(this.state)
              );
            });
          }
        })
        .catch(function(error) {
          console.log("ERRROR:" + error.message);
        });
  };

  render() {
    const { movie, directors, actors, loading } = this.state;
    return (
      <div className="rmdb-movie">
        {movie ? (
          <div>
            <Navigation movie={movie.title} />
            <MovieInfo movie={movie} directors={directors} />
            <MovieInfoBar
              time={movie.runtime}
              budget={movie.budget}
              revenue={movie.revenue}
            />
          </div>
        ) : null}
        {actors ? (
          <div className="rmdb-movie-grid">
            <FourColGrid header={"Actors"}>
              {this.state.actors.map((e, i) => {
                return <Actor key={i} actor={e} />;
              })}
            </FourColGrid>
          </div>
        ) : null}
        {!actors && !movie && !loading ? <h1>No Movie Found!</h1> : null}
        {loading ? <Spinner /> : null}
      </div>
    );
  }
}
export default Movie;
