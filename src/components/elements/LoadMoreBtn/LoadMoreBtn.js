import React from 'react';
import PropTypes from "prop-types";
import './LoadMoreBtn.css';

const LoadMoreBtn = (props) =>{
  const {text, onClick}= props
  return(
    <div className="rmdb-loadmorebtn" onClick={ ()=>{onClick(true)}} >
    <p>{text}</p>
    </div>
  )
}

LoadMoreBtn.prototype={
  text: PropTypes.string,
  onclick: PropTypes.func
}

export default LoadMoreBtn;