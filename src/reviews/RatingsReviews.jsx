import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReviewList from './ReviewList.jsx';
import token from '../../config.js';
import mockData from './mockData.js';
import './RatingsReviews.css';

var reviewPage = 1;
var sort = 'relevant';
class RatingsReviews extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      reviews: [],
      hasMoreReviews: true
    }
    this.getReviewList = this.getReviewList.bind(this);
    this.moreReviews = this.moreReviews.bind(this);
    this.sortChange = this.sortChange.bind(this);
  }

  sortChange(e) {
    e.preventDefault();
    console.log(e.target.value);
    sort = e.target.value
    reviewPage = 1;
    this.setState({reviews: []}, () => {
      this.getReviewList()
    });
  }
  getReviewList() {
    console.log(this.props.product_id)
    axios({
      method: 'get',
      url: `https://app-hrsei-api.herokuapp.com/api/fec2/hr-rfp/reviews?product_id=${this.props.product_id}&count=2&page=${reviewPage}&sort=${sort}`,
      headers: {
        'Authorization': token.TOKEN
      }
    }).then((response) => {
      this.setState({reviews: [...this.state.reviews, ...response.data.results]})
      axios({
        method: 'get',
        url: `https://app-hrsei-api.herokuapp.com/api/fec2/hr-rfp/reviews?product_id=${this.props.product_id}&count=2&page=${reviewPage + 1}`,
        headers: {
          'Authorization': token.TOKEN
        }
      }).then((response => {
        if (response.data.results.length === 0) {
          this.setState({ hasMoreReviews: false })
        }
      }))
    }).catch((err) => {
      console.log('error getting review list from api', err)
    })
  }
  moreReviews() {
    reviewPage++;
    this.getReviewList()
  }
  componentDidUpdate(oldProps) {
    if(oldProps.product_id !== this.props.product_id) {
      this.state.reviews = [];
      this.getReviewList();
    }
  }
  componentDidMount() {
    this.getReviewList();
  }
  render() {
    return (
      <div className="rr-main" >
        RATINGS & REVIEWS
        <ReviewList reviews={this.state.reviews} more={this.moreReviews} sort={this.sortChange} renderButton={this.state.hasMoreReviews} />
      </div>
    )
  }
}

export default RatingsReviews;