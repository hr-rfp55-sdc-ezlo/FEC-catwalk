import OverviewInformation from './OverviewInformation.jsx';
import ImageGallery from './ImageGallery.jsx';
import StyleSelector from './StyleSelector.jsx';
import AddToCart from './AddToCart.jsx';
import _ from 'underscore';
import StarRating from '../sharedComponents/StarRating.jsx';
import axios from 'axios';
// import token from '../../config.js';
import './OverviewStyleSheet.css';

import React from 'react';

class Overview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {selectedStyle: this.props.styles.results[0],
                  productStarRating: {1: "4", 2: "5", 3: "9", 4: "19", 5: "85"},
                  ratingCount: 122};
  }

  countReviews(obj) {
    var totalReviews = 0;
    for (var key in obj) {
      totalReviews += parseInt(obj[key]);
    }
    return totalReviews;
  }

  componentDidUpdate(prevProps) {
    if (this.props.styles.product_id !== prevProps.styles.product_id) {
      this.setState({ selectedStyle: this.props.styles.results[0] });
      // fetch review and rating data
      axios({
        method: 'get',
        url: `http://3.144.130.202/reviews/meta?product_id=${this.props.styles.product_id}`,
        headers: {
          'Authorization': token.TOKEN
        }
      })
        .then((response) => {
          this.setState({
            ratingCount: this.countReviews(response.data.ratings),
            productStarRating: response.data.ratings
          });
        })
        .catch((error) => {
          console.log(error);
        });

    }
  }

  handleSelect(style) {
    this.setState({ selectedStyle: style });
  }

  render () {

    const features = this.props.product.features;
    const icon_styles = {
      fontSize: '48px',
      paddingLeft: '10%',
      paddingTop: '5%'
    }

    return (
      <div class='overview'>
        <div class='overviewTop'>
          <div class='leftCol'>
            <ImageGallery selectedStyle={this.state.selectedStyle}/>
          </div>

          <div class='rightCol'>
            <div><StarRating meta={this.state.productStarRating} /><a href='#review-section'>Read all reviews ({this.state.ratingCount})</a></div>
            <OverviewInformation product={this.props.product} selectedStyle={this.state.selectedStyle} />
            <StyleSelector styles={this.props.styles} selectStyle={this.handleSelect.bind(this)} />

            <div class='right-bottom'>
              <div class='right-bottom-left'>
                <div class='infoFreeText'>
                  <h3>{this.props.product.slogan}</h3>
                  <p>{this.props.product.description}</p>
                </div>
                <div class='features'>
                  {_.map(this.props.product.features, (feature)   => {
                    return (<p>	&#10003; {feature.feature}:   {feature.value}</p>)
                  })}
                  <div class='social-icons'>
                    <a href="#" class="icon fa fa-facebook icon"   style={icon_styles}></a>
                    <a href="#" class="icon fa fa-twitter icon"   style={icon_styles}></a>
                    <a href="#" class="icon fa fa-instagram icon"   style={icon_styles}></a>
                  </div>

                </div>
              </div>
              <div class='right-bottom-right'>
                <AddToCart selectedStyle={this.state.selectedStyle}/>
              </div>


            </div>



          </div>
        </div>
      </div>
    );

  }
}

export default Overview;