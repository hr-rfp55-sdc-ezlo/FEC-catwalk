import React from 'react';
import axios from 'axios';
// import token from '../../../config.js';
import StarRating from '../../sharedComponents/StarRating.jsx';
import noImage from '../../noImage.js';
import $ from 'jquery';
import '../riac.css';
import { TrackClickContext } from './../../trackClick.jsx';

class OutfitCard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      id: '',
      info: {},
      img: '',
      styles: {},
      stars: {},
      price: '',
      sale: ''
    };

    this.fetchProduct = this.fetchProduct.bind(this);
  }


  fetchProduct() {
    axios({
      method: 'get',
      url: `http://18.144.168.19/products/${this.props.productid}`
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
      url: `http://18.144.168.19/products/${this.props.productid}/styles`
    })
      .then((response) => {
        this.setState({
          img: response.data.results[0].photos[0].thumbnail_url,
          styles: response.data,
          price: response.data.results[0].original_price,
          sale: response.data.results[0].sale_price
        });
      })
      .catch((error) => {
        console.log(error);
      });
    axios({
      method: 'get',
      url: `http://3.144.130.202/reviews/meta?product_id=${this.props.productid}`
    })
      .then((response) => {
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
    return (
      <TrackClickContext.Consumer>{(context) => {
        return (
          <div>

            <div className='riac-productcard'>

              <i class='fas fa-times-circle riac-productcard-button' onClick={() => {this.props.removeOutfit(this.state.info.id); context.click('Remove Outfit Button', 'Related Products')}} alt='Remove item from outfit list'></i>

              <div className='riac-productcard-image' onClick={() => {this.props.onClick(this.state.info.id); context.click('Select New Product', 'Related Products')}}>
                {this.state.img ? <img src={this.state.img} alt={`Image of ${this.state.info.name}`}/> : <img src={noImage} alt='Image of item not available'/>}
              </div>

              <div className='riac-productcard-category'> {this.state.info.category} </div>
              <div className='riac-productcard-name'> {this.state.info.name} </div>

              {this.state.sale ?
                <div className='riac-productcard-price'>
                  <div className='riac-productcard-sale'> {this.state.sale} </div>
                  <div className='riac-productcard-price-sale'> {this.state.price} </div>
                </div>
                : <div className='riac-productcard-price'> {this.state.info.default_price} </div>}

              {$.isEmptyObject(this.state.stars) ? null
                : <div className='riac-productcard-rating'> <StarRating meta={this.state.stars} /> </div>}

            </div>
          </div>
        )
      }}
      </TrackClickContext.Consumer>
    );
  }
}

export default OutfitCard;