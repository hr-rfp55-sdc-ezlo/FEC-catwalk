import React from 'react';
import { useState } from 'react';
import axios from 'axios';
import './Q&A.css';

class ModalA extends React.Component {
  constructor(props) {
    super (props);
    this.state = {
      body: '',
      name: '',
      email: '',
      photos: [],
      url: '',
      question: false,
      answer: true,
      // show: false
    }

    this.handleFormChange = this.handleFormChange.bind(this)
    this.submitForm = this.submitForm.bind(this)
    this.postAnswer = this.postAnswer.bind(this)
    this.submitErrForm = this.submitErrForm.bind(this)
    this.submitErrEmail = this.submitErrEmail.bind(this)
    this.addUrl = this.addUrl.bind(this)
    this.setUrl = this.setUrl.bind(this)
  }

  handleFormChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  addUrl(e) {
    e.preventDefault();
    this.setState(prevState => {
      return {
        photos: [...prevState.photos, this.state.url],
        url: ''
      }
    })
  }

  setUrl(e) {
    this.setState({
      url: e.target.value
    })
  }


  postAnswer(id, answer) {
    const question_id = this.props.question.question_id;
    axios({
      method: 'post',
      url: `http://184.169.232.78/qa/questions/${question_id}/answers`,
      params: question_id,
      data: answer
    })
      .then((res) => {
        this.props.getQuestions();
      })
      .catch((error) => {
        console.log(answer);
        throw error;
      })
  }

  submitForm(e) {
    const { body, name, email, photos, answer } = this.state
    const { question, postQuestion, product_id } = this.props
    const question_id = this.props.question.question_id
    const input = { question_id, body, name, email, photos }
    // should work more on photos

    e.preventDefault()


    this.postAnswer(question_id, input)


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
            <form onSubmit={this.submitForm} name='QA'>
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
                    placeholder='Example: jack543!'
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
                    onInvalid={this.submitErrEmail}>
                  </input>
                </label>
                <br />
                For authentication reasons, you will not be emailed” will appear
                <br />
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
                <br />
                  <label htmlFor='photos'>
                    Photos url:
                    <br />
                    <input
                      type='text'
                      style={{width: "300px"}}
                      name='photos'
                      onChange={(e) => {
                        this.setUrl(e)
                      }}
                      placeholder = 'your answer img url example.com/photo.jpg'>
                    </input>
                    {this.state.photos.map(photo => <img className='answerPic' src = {`${photo}`}/>)}
                    <button className='button' onClick={this.addUrl}>
                      Add Image
                    </button>
                  </label>
              </div>
              <button className='button' type = 'submit' onClick={handleClose}>
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



export default ModalA;