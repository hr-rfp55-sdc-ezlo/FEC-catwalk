import React, { useState, useEffect } from 'react';
import axios from 'axios';
import RatingBreakdown from './RatingBreakdown/RatingBreakdown.jsx';
import ProductBreakdown from './ProductBreakdown/ProductBreakdown.jsx'
import ReviewList from './ReviewList/ReviewList.jsx';
import AddReview from './AddReview/AddReview.jsx';
import Modal from './Modal.jsx';
import token from '../../config.js';
import './RatingsReviews.css';
import { TrackClickContext } from './../trackClick.jsx';

var reviewPage = 1;
var sort = 'relevant';
var reviews = [];
// console.log(TrackClickContext);
class RatingsReviews extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      reviews: [],
      hasMoreReviews: true,
      meta: {},
      filterByRating: [],
      showAddReview: false,
      filterBySearch: '',
      helpedList: localStorage.getItem('helpful') ?
        localStorage.getItem('helpful').split(',') : null
    }
    // console.log(this.state.helpedList);
    this.getAllReviews = this.getAllReviews.bind(this);
    this.moreReviews = this.moreReviews.bind(this);
    this.sortChange = this.sortChange.bind(this);
    this.setRatingFilter = this.setRatingFilter.bind(this);
    this.setListToDefault = this.setListToDefault.bind(this);
    this.showAddReview = this.showAddReview.bind(this);
    this.hideAddReview = this.hideAddReview.bind(this);
    this.addReview = this.addReview.bind(this);
    this.markHelpful = this.markHelpful.bind(this);
    this.reportReview = this.reportReview.bind(this);
    this.keywordSearch = this.keywordSearch.bind(this);
    this.keywordChange = this.keywordChange.bind(this);
  }
  //////////////////////////////
  //Rating BreakDown handlers//
  /////////////////////////////
  setRatingFilter(rating) {
    reviewPage = 1;
    if (this.state.filterByRating.includes(rating)) {
      var newfilter = this.state.filterByRating.filter((filterValue) => {
        return filterValue !== rating;
      })
      this.setState({ filterByRating: newfilter }, () => {
        if (this.state.filterByRating.length === 0) {
          this.setListToDefault();
        } else {
          this.getAllReviews();
        }
      });
    } else {
      this.setState({ filterByRating: [...this.state.filterByRating, rating] }, () => {
        this.getAllReviews();
      });
    }
  }
  ////////////////////////
  //Review list handlers//
  ////////////////////////
  sortChange(e) {
    e.preventDefault();
    sort = e.target.value;
    reviewPage = 1;
    if (this.state.filterByRating.length === 0) {
      this.setListToDefault();
    } else {
      this.getAllReviews();
    }
  }
  setListToDefault() {
    this.state.hasMoreReviews = true;
    this.state.filterByRating = [];
    this.state.reviews = [];
    this.getAllReviews();
  }
  keywordSearch(search) {
    var reg = new RegExp(search, 'i');
    var filteredResults = reviews.filter((review) => {
      return reg.test(review.summary) || reg.test(review.body) || reg.test(review.response);
    });
    this.setState({ reviews: filteredResults, hasMoreReviews: false });
  }
  keywordChange(e) {
    var search = e.target.value;
    if (search.length === 3) {
      this.getAllReviews(() => this.keywordSearch(search));
    } else if (search.length > 3) {
      this.keywordSearch(search);
    } else if (search.length === 2) {
      this.setListToDefault();
    }
  }
  ///////////////////////
  //Add Review Handlers//
  ///////////////////////
  showAddReview() {
    // context()
    this.setState({ showAddReview: true });
  }
  hideAddReview() {
    this.setState({ showAddReview: false });
  }
  /////////////////////
  //api call handlers//
  /////////////////////
  getMeta() {
    axios({
      method: 'get',
      url: `http://3.144.130.202/reviews/meta?product_id=${this.props.product_id}`
    }).then((response) => {
      this.setState({ meta: response.data });
    }).catch((err) => {
      console.log(err);
    })
  }
  getAllReviews(callback) {
    if (this.state.meta.recommended) {
      var count = this.state.meta.recommended.true + this.state.meta.recommended.false;
    } else {
      var count = 100;
    }
    axios({
      method: 'get',
      url: `http://3.144.130.202/reviews?product_id=${this.props.product_id}&count=${count}&sort=${sort}`
    }).then((response) => {
      this.state.hasMoreReviews = true;
      if (this.state.filterByRating.length) {
        var filteredResults = response.data.results.filter((review) => {
          return this.state.filterByRating.includes(review.rating)
        })
      } else {
        filteredResults = response.data.results;
      }
      reviews = filteredResults;
      this.setState({ reviews: filteredResults.slice(0, 2) }, () => {
        if (this.state.reviews.length === reviews.length) {
          this.setState({ hasMoreReviews: false });
        }
        if (callback) {
          callback();
        }
      });
    }).catch((err) => {
      console.log('error getting all reviews to then filter by rating', err);
    })
  }
  moreReviews() {
    reviewPage++;
    this.setState({ reviews: reviews.slice(0, 2 * reviewPage) }, () => {
      if (this.state.reviews.length === reviews.length) {
        this.setState({ hasMoreReviews: false })
      }
    });
  }
  addReview(newReview) {
    newReview.product_id = this.props.product_id;
    newReview.recommend = newReview.recommend === 'true';
    axios({
      method: 'post',
      url: 'http://3.144.130.202/reviews',
      data: newReview
    }).catch((err) => {
      console.log('error posting new review to server', err);
    })
  }
  markHelpful(review_id) {
    var helped = localStorage.getItem('helpful');
    if (helped) {
      helped = helped.split(',');
      helped.push(review_id);
      this.setState({ helpedList: helped });
      helped = helped.join(',');
      localStorage.setItem('helpful', helped);
    } else {
      localStorage.setItem('helpful', review_id);
    }
    axios({
      method: 'put',
      url: `http://3.144.130.202/reviews/${review_id}/helpful`
    }).catch((err) => {
      console.log('error marking review as helpful', err);
    })
  }
  reportReview(review_id) {
    reviews = reviews.filter((review) => {
      return review.review_id !== review_id;
    })
    this.setState({
      reviews: this.state.reviews.filter((review) => {
        return review.review_id !== review_id;
      })
    })
    axios({
      method: 'put',
      url: `http://3.144.130.202/reviews/${review_id}/report`
    }).catch((err) => {
      console.log('error reporting review', err);
    })
  }
  ///////////////////////
  //lifecycle functions//
  ///////////////////////
  componentDidUpdate(oldProps) {
    if (oldProps.product_id !== this.props.product_id) {
      this.setListToDefault();
      this.getMeta();
    }
  }
  componentDidMount() {
    this.getAllReviews();
    this.getMeta();
  }
  render() {
    return (
      <TrackClickContext.Consumer>{(context) => {

        return(
        <div className="rr-main" >
          <h1 className='rr-title' id='review-section'>RATINGS & REVIEWS</h1>
          <RatingBreakdown meta={this.state.meta} filter={this.setRatingFilter} clear={this.setListToDefault} />

          <ProductBreakdown chars={this.state.meta.characteristics} />

          <ReviewList reviews={this.state.reviews} more={this.moreReviews} sort={this.sortChange}
            renderButton={this.state.hasMoreReviews} meta={this.state.meta} filter={this.state.filterByRating}
            setFilter={this.setRatingFilter} addReview={this.showAddReview} markHelpful={this.markHelpful}
            report={this.reportReview} keywordChange={this.keywordChange} helped={this.state.helpedList} />

          <Modal show={this.state.showAddReview} handleClose={this.hideAddReview}
            children={<AddReview chars={this.state.meta.characteristics} close={this.hideAddReview}
              postReview={this.addReview} />} />
        </div>
        )
      }}
      </TrackClickContext.Consumer>
    )
  }
}

export default RatingsReviews;