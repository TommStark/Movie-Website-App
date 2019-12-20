import React from "react";
import { Link } from "react-router-dom";
import "./MovieThumb.css";

const MovieThumb = props => {
  return (
    <div className="rmdb-moviethumb">
      {props.clickeable ? (
        <Link
          to={{
            pathname: `/${props.movieId}`,
            movieName: `${props.movieName}`
          }}
        >
          <img src={props.image} alt="" />
        </Link>
      ) : (
        <img src={props.image} alt="" />
      )}
    </div>
  );
};

export default MovieThumb;
