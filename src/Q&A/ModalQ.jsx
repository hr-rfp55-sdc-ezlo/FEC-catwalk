import React from 'react';
import axios from 'axios';
import './Q&A.css';
//import { TrackClickContext } from './../trackClick.jsx';

class ModalQ extends React.Component {
  constructor(props) {
    super (props);
    this.state = {
      body: '',
      name: '',
      email: '',
      photos: [],
      question: true,
      answer: false,
    }

    this.handleFormChange = this.handleFormChange.bind(this)
    this.submitForm = this.submitForm.bind(this)
    this.postQuestion = this.postQuestion.bind(this)
    this.submitErrForm = this.submitErrForm.bind(this)
    this.submitErrEmail = this.submitErrEmail.bind(this)
  }

  handleFormChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    })
  }


  postQuestion(question) {
    const product_id = this.props.product_id
    axios({
      method: 'post',
      url: `http://184.169.232.78/qa/questions`,
      params: product_id,
      data: question
    })
      .then((res) => {
        this.props.getQuestions();
      })
      .catch((error) => {
        throw error;
      })
  }

  //event handler here
  submitForm(e) {
    const { body, name, email } = this.state;
    const product_id = this.props.product_id;
    const input = {body, name, email, product_id}
    e.preventDefault()

    this.postQuestion(input);

    this.setState({
      body: '',
      name: '',
      email: '',
      photos: []
    })
  }

  submitErrForm(e) {
    alert(`You must enter the following: ${e.target.name}`);
    event.preventDefault();
  }

  submitErrEmail(e) {
    alert('The email address provided is not in correct email format');
  }


  render() {
    const question = this.state.question
    const product = this.props.product
    const eachQuestion  = this.props.question
    const handleClose = this.props.handleClose;
    const show = this.props.show;
    const children = this.props.children;
    const showHideClassName = show ? 'modal display-block' : 'modal display-none';
    const text = (question ? 'Question: ' : 'Answer: ')
    const titleText = (question ? 'Ask your Question: ' : 'Submit your Answer')
    const subtitleText = (question ? 'About the Product: ' : `${product.name}: ${eachQuestion.question_body}`)

    return (
      <div className={showHideClassName}>
        <section className='modal-main1'>
          {children}
          <div className='modal-header'>
            <h3>{titleText}</h3>
            <p>
              <strong>{subtitleText}</strong>
            </p>
          </div>
          <div className='modal-body'>
            <form  onSubmit={this.submitForm} name='QA'>
              <div>
                <label htmlFor='yourName'>
                  *Name:
                  <br />
                  <input
                    required
                    style = {{width: "300px"}}
                    type='text'
                    name='name'
                    maxLength='60'
                    placeholder='Example: jackson11!'
                    onChange={(e) => {this.handleFormChange(e)}}
                    onInvalid={this.submitErrForm}>
                  </input>
                </label>
                <div>
                  For privacy reasons, do not use your full name or email address
                </div>
              <br />
                <label htmlFor='email'>
                  *Email:
                  <br />
                  <input
                    required
                    style = {{width: "300px"}}
                    type='email'
                    name='email'
                    placeholder='Example: yourname@gmail.com'
                    maxLength='60'
                    onChange={(e) => {this.handleFormChange(e)}}
                    onInvalid={this.submitErrEmail}
                    >
                  </input>
                </label>
                <div>
                  For authentication reasons, you will not be emailed
                </div>
              <br />
                <label htmlFor={text}>
                  *
                  {text}
                  <br />
                  <input
                    type='textarea'
                    style={{height: "50px", width: "300px"}}
                    required
                    name='body'
                    rows='20'
                    maxLength='1000'
                    onChange={(e) => { this.handleFormChange(e) }}
                    onInvalid={this.submitErrForm}>
                  </input>
                </label>
              </div>

              <button className='button' type = 'submit' onClick={this.props.handleClose} >
                Submit
              </button>
            </form>
            <button className='button' onClick={handleClose}>
                Close
            </button>
          </div>
        </section>
      </div>

    )
  }
}



export default ModalQ;