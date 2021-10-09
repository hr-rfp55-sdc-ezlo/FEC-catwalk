import React from 'react';
import axios from 'axios';


class EachAnswer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      helpness: this.props.answer.helpfulness,
      reported: false,
      voted: false
    }

    this.addHelp = this.addHelp.bind(this);
    this.handleClickYes = this.handleClickYes.bind(this);
    this.markReport = this.markReport.bind(this);
    this.handleClickReport = this.handleClickReport.bind(this);
  }

  //after onclick helpful?, this.setState : helpness+1
  addHelp(num) {
    const answer_id = this.props.answer.id;
    axios({
      method: 'put',
      url: `http://184.169.232.78/qa/answers/${answer_id}/helpful`,
      params: answer_id,
      data: num
    })
      .then((res) => {
        this.props.getQuestions();
      })
      .catch((error) => {
        throw error;
      })
  }

  markReport(input) {
    const answer_id = this.props.answer.id;
    axios({
      method: 'put',
      url: `http://184.169.232.78/qa/answers/${answer_id}/report`,
      parames: answer_id,
      data: input
    })
      .then((res) => {
        this.props.getQuestions();
      })
      .catch((error) => {
        throw error;
      })
  }

  handleClickYes() {
    const answer_id = this.props.answer.id;
    if (this.state.voted === true) {
      return;
    } else {
      this.setState(prevState => {
        return {
          helpfulness: prevState.helpfulness + 1,
          voted: true
        }
      })
      this.addHelp(answer_id);
    }
  }

  handleClickReport() {
    const answer_id = this.props.answer.id;
    this.setState({
      reported: true
    })
    this.markReport(answer_id, {});
  }

  render() {
    const answer = this.props.answer;
    const photos = this.props.answer.photos; //photos here are array, let's retrieve the url
    return (
      <div key = {answer.id} className='qa_answer'>
        <div className='qa_answerBody'>
          {answer.body}
        </div>

          <div className='qa_photo'>
            {photos.map(photo => <img className='answerPic' key = {answer.id} src = {`${photo}`}/>)}
          </div>
        <div className='qa_answerInfo'>
          <div className='qa_answerer'>
              answerer:
              {(answer.answerer_name === 'Seller') && <b>{answer.answerer_name}</b>}
              {(answer.answerer_name !== 'Seller') && <div>{answer.answerer_name}</div>}
          </div>
          <div className='qa_answerDate'>
              {answer.date.substring(0,10)}
          </div>

          <div className='qa_answerHelpful'>
            helpful?
            <a className = 'link' onClick={this.handleClickYes}>
              <span>Yes({this.props.answer.helpfulness}) | </span>
            </a>

            <a className = 'link'>
              <span onClick={this.handleClickReport}>Report</span>
            </a>

          </div>
        </div>

      </div>
    )
  }
}

export default EachAnswer;
