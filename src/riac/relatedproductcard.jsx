import React from 'react';
import axios from 'axios';
import token from '../../config.js';
import StarRating from '../sharedComponents/StarRating.jsx';
import './riac.css';

class RelatedProductCard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      id: '',
      info: {},
      img: '',
      styles: {},
      stars: {}
    };

    this.fetchProduct = this.fetchProduct.bind(this);
  }

  fetchProduct() {
    axios({
      method: 'get',
      url: `https://app-hrsei-api.herokuapp.com/api/fec2/hr-rfp/products/${this.state.id}`,
      headers: {
        'Authorization': token.TOKEN
      }
    })
      .then((response) => {
        this.setState({
          info: response.data
        });
      })
      .catch((error) => {
        console.log(error);
      });
    axios({
      method: 'get',
      url: `https://app-hrsei-api.herokuapp.com/api/fec2/hr-rfp/products/${this.state.id}/styles`,
      headers: {
        'Authorization': token.TOKEN
      }
    })
      .then((response) => {
        this.setState({
          img: response.data.results[0].photos[0].thumbnail_url,
          styles: response.data
        });
      })
      .catch((error) => {
        console.log(error);
      });
    axios({
      method: 'get',
      url: `https://app-hrsei-api.herokuapp.com/api/fec2/hr-rfp/reviews/meta?product_id=${this.state.id}`,
      headers: {
        'Authorization': token.TOKEN
      }
    })
      .then((response) => {
        // console.log('meta', response.data.ratings)
        this.setState({
          stars: response.data.ratings
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  componentDidMount() {
    this.fetchProduct();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.productid !== this.props.productid) {
      this.fetchProduct();
    }
  }

  render() {
    this.state.id = this.props.productid;
    return (
      <div className='riac-productcard' onClick={() => this.props.onClick(this.state.info.id)}>

        <div className='riac-productcard-image'>
          <img src={this.state.img} />
        </div>

        <button className='riac-productcard-button'>cart</button>


        <div className='riac-productcard-category'> {this.state.info.category} </div>
        <div className='riac-productcard-name'> {this.state.info.name} </div>
        <div className='riac-productcard-price'> {this.state.info.default_price} </div>
        <div className='riac-productcard-rating'> <StarRating meta={this.state.stars} /> </div>

      </div>
    );
  }
}

export default RelatedProductCard;