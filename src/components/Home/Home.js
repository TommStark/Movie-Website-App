import React, { Component } from "react";
import {
  API_URL,
  API_KEY,
  IMAGE_BASE_URL,
  BACKDROP_SIZE
} from "../../config";
import HeroImage from "../elements/HeroImage/HeroImage";
import SearchBar from "../elements/SearchBar/SearchBar";
import FourColGrid from "../elements/FourColGrid/FourColGrid";
import MovieThumb from "../elements/MovieThumb/MovieThumb";
import LoadMoreButton from "../elements/LoadMoreBtn/LoadMoreBtn";
import Spinner from "../elements/Spinner/Spinner";
import "./Home.css";

class Home extends Component {
  state = {
    movies: [],
    heroImage: null,
    loading: false,
    currentPage: 0,
    totalPages: 0,
    searchTerm: ""
  };

  componentDidMount() {
    if (localStorage.getItem("HomeState")) {
      const state = JSON.parse(localStorage.getItem("HomeState"));
      this.setState({
        ...state
      });
    } else {
      this.setState({ loading: true });
      this.fetchItems(this.createEndpoint("movie/popular",false, ""));
    }
  }

  createEndpoint = (type, loadMore, searchTerm) => {
    return `${API_URL}${type}?api_key=${API_KEY}&languaje=en-US&page=${loadMore &&
      this.state.currentPage + 1}&query=${searchTerm}`;
  };

  updateItems = (loadMore, searchTerm) => {
    console.log(loadMore, searchTerm)
    console.log(this.state)
    this.setState(
      {
        movies: loadMore ? [...this.state.movies] : [],
        loading: true,
        searchTerm: loadMore ? this.state.searchTerm : searchTerm
      },
      () => {
        console.log(this.state)
        this.fetchItems(
          !this.state.searchTerm
            ? this.createEndpoint("movie/popular", loadMore, "")
            : this.createEndpoint(
                "search/movie",
                loadMore,
                this.state.searchTerm
              )
        );
      }
    );
  };

  fetchItems = async endpoint => {
    console.log(endpoint)
    const { movies, heroImage, searchTerm } = this.state;
    const result = await (await fetch(endpoint)).json();
    try {
      this.setState(
        {
          movies: [...movies, ...result.results],
          heroImage:
            heroImage ||
            result.results[Math.floor(Math.random() * result.results.length)],
          loading: false,
          currentPage: result.page,
          totalPages: result.total_pages
        },
        () => {
          if (searchTerm === "") {
            localStorage.setItem("HomeState", JSON.stringify(this.state));
          }
        }
      );
    } catch (error) {
      console.log("ERROR", error);
    }
  };

  render() {
    //ES6 destructuring the state
    const {
      movies,
      heroImage,
      loading,
      currentPage,
      totalPages,
      searchTerm
    } = this.state;
    return (
      <div className="rmdb-home">
        {heroImage && !searchTerm ? (
          <div>
            <HeroImage
              image={`${IMAGE_BASE_URL}${BACKDROP_SIZE}${heroImage.backdrop_path}`}
              title={heroImage.original_title}
              text={heroImage.overview}
            />
          </div>
        ) : null}
        <SearchBar callback={this.updateItems} />
        <div className="rmdb-home-grid">
          <FourColGrid
            header={searchTerm ? "Search Result" : "Popular Movies"}
            loading={loading}
          >
            {movies.map((e, i) => {
              return (
                <MovieThumb
                  key={i}
                  clickeable={true}
                  image={
                    e.poster_path
                      ? `${IMAGE_BASE_URL}${BACKDROP_SIZE}${e.poster_path}`
                      : "./images/no_image.jpg"
                  }
                  movieId={e.id}
                  movieName={e.original_title}
                />
              );
            })}
          </FourColGrid>
          {loading ? <Spinner /> : null}
          {currentPage < totalPages && !loading ? (
            <LoadMoreButton text="Load More" onClick={this.updateItems} />
          ) : null}
        </div>
      </div>
    );
  }
}

export default Home;
