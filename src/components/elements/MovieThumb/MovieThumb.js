import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import "./MovieThumb.css";

const MovieThumb = ({image, movieName, movieId,clickeable}) => {
  return (
    <div className="rmdb-moviethumb">
      {clickeable ? (
        <Link
          to={{
            pathname: `/${movieId}`,
            movieName: `${movieName}`
          }}
        >
          <img src={image} alt="" />
        </Link>
      ) : (
        <img src={image} alt="" />
      )}
    </div>
  );
};

MovieThumb.propTypes ={
  image: PropTypes.string,
  movieId: PropTypes.number,
  movieName:PropTypes.string,
  clickeable:PropTypes.bool
}

export default MovieThumb;
