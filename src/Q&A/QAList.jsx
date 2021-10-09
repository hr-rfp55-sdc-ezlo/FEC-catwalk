import React from 'react';
import axios from 'axios';
import QAAnswer from './QAAnswer.jsx';
import EachQuestion from './Q&AEachQuestion.jsx';
import ModalQ from './ModalQ.jsx';
// import Search from './Search.jsx';
import { TrackClickContext } from './../trackClick.jsx';

class QAList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      originquestions: [],
      questions: [],
      showQ: 2,
      show: false
    }
    this.getQuestions = this.getQuestions.bind(this);
    this.loadMoreQClick = this.loadMoreQClick.bind(this);
    this.collapseQClick = this.collapseQClick.bind(this);
    this.showModal = this.showModal.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.handleFilter = this.handleFilter.bind(this);
    this.sort = this.sort.bind(this);
  }

  componentDidMount() {
    this.getQuestions();
  }

  componentDidUpdate(prevProps) {
    if(this.props.product.id !== prevProps.product.id) {
      this.getQuestions();
    }
  }

  getQuestions() {
    const product_id = this.props.product.id
    axios.get(`http://184.169.232.78/qa/questions/?product_id=${product_id}`)
      .then((res) => {
        this.setState({
          questions: res.data,
          originquestions: res.data
        });
      })
      .catch((error) => {
        throw error;
      });
  }


  loadMoreQClick(e) {
    e.preventDefault();
    this.setState(
      prevState => {
        return {
          showQ: prevState.showQ += 2
        }
      })
  }

  collapseQClick(e) {
    e.preventDefault();
    this.setState({
      showQ: 2
    })
  }

  showModal(e) {
    e.preventDefault();
    this.setState ({
      show: true,
    })
  }

  hideModal() {
    this.setState ({
      show: false,
    })
  }

  sort(prop, arr) {
    arr.sort(function(a, b) {
      if (a[prop] < b[prop]) {
        return 1;
      } else if (a[prop] > b[prop]) {
        return -1;
      } else {
        return 0;
      }
    })
    return arr;
  }

  handleFilter(e) {
    e.preventDefault();
    const matched = [];
    if (e.target.value.length >= 3) {
      for(var i = 0; i < this.state.questions.length; i++) {
        if(this.state.questions[i].question_body.toLowerCase().includes(e.target.value)) {
          matched.push(this.state.questions[i]);
        }
      }
      this.setState({
        questions: matched
      })
    } else {
      this.setState({
        questions: this.state.originquestions
      })
    }
  }



  render() {

    if(this.state.questions.length === 0) {

      return(
        <TrackClickContext.Consumer>{(context) => {
          var context = context
          return (
            <div className = 'QA'>
              <h2>Questions & Answers</h2>
              <div className='listTitle'>We don't have questions for this product, Post the first Question!</div>
              <div>
                <ModalQ
                show={this.state.show}
                handleClose={this.hideModal}
                getQuestions={this.getQuestions}
                product_id={this.props.product.id}
                type = 'question'/>
                <button className='button' type = 'submit' onClick={(e) => {this.showModal(e); context.click('qa_addQBtn', 'QA')}}>
                  Submit a question
                </button>
              </div>
            </div>
          )
        }

        }
        </TrackClickContext.Consumer>

      )
    }else {
      this.sort('question_helpfulness', this.state.questions);
      return(
        <TrackClickContext.Consumer>{(context) => {
          var context = context
          return (
            <div className = 'QA'>
          <h2>Questions & Answers</h2>
          <div >
            <input
              className = 'searchBar'
              type = 'text'
              placeholder="Have a question? Search for answers…"
              onChange = {(e) => {this.handleFilter(e)}}
            ></input>
          </div>
          <div className = 'questionList'>
            {this.state.questions.slice(0,this.state.showQ).map(question =>
            <EachQuestion key = {question.question_id} question = {question} postQuestion = {this.postQuestion} getQuestions = {this.getQuestions}product = {this.props.product}/>
            )}
          </div>
          <div className = 'qa_questionBtn'>
            <div>
              <button className='button' type='submit' onClick={(e)=>{this.collapseQClick(e); context.click('qa_showlessQBtn', 'QA')}}>Show less answered questions</button>
            </div>
            <div>
              {this.state.questions.length > 2 && <button className='button' type = 'submit' onClick={(e)=>{this.loadMoreQClick(e); context.click('qa_showmoreQBtn', 'QA')}}>More answered questions</button>}
            </div>
          </div>
          <div className='qa_addAnswer'>
              <ModalQ
              show={this.state.show}
              handleClose={this.hideModal}
              getQuestions={this.getQuestions}
              product_id={this.props.product.id}
              type = 'question'/>
              <div>
                <button className='button' type = 'submit' onClick={(e) => {this.showModal(e); context.click('qa_addQBtn', 'QA')}}>
                  Add more question
                </button>
              </div>
          </div>
        </div>
          )
        }
        }
        </TrackClickContext.Consumer>

      )
    }
  }
}

export default QAList;
