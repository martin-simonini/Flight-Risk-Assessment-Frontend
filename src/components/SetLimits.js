import React, {Component} from 'react';
import {Link} from "react-router-dom";
import './../stylesheets/AdminPanel.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Jumbotron, Row, Form, FormGroup, Button} from 'react-bootstrap';

// This component allows admins to set the safety limits for the application.
class SetLimits extends Component {

  constructor(props){
    super(props)

    this.state = ({group: "ifr", category: "departure", items: [], loaded: false,})

    this.input = [];
  }

  componentDidMount() {
    fetch("/adminThresholds/getAll")
      .then(res => res.json())
      .then(
          (result) => {
            this.setState({items: result})
          }
      )
      this.setState({loaded: true})
  }

  // This function takes in a string and switches the subcategory that is being displayed.
  switch(panel){
    this.setState({category: panel})
  }

  // This function takes in a string and switches the category that is being displayed and sets the subcategory to its default.
  switchCurrent(panel){
    this.setState({group: panel})
    if (panel === "ifr"){
      this.setState({category: "departure"})
    }
    else {
      this.setState({category: "localPattern"}) 
    }
  }

  // This function updates the safety limits in the database with the value given.
  update(limit, event){
    if (this.input[event.target.name + limit].value !== ''){
      switch(limit){
        case("high"):
          fetch("/adminThresholds/updateByGroupNameCategoryHigh?val=" + this.input[event.target.name + limit].value +
            "&group=" + this.state.group +
            "&name=" + event.target.name +
            "&category=" + this.state.category);
            break;
          case("med"):
          fetch("/adminThresholds/updateByGroupNameCategoryMed/?val=" + this.input[event.target.name + limit].value +
            "&group=" + this.state.group +
            "&name=" + event.target.name +
            "&category=" + this.state.category);
            break;
        case("low"):
          fetch("/adminThresholds/updateByGroupNameCategoryLow/?val=" + this.input[event.target.name + limit].value +
            "&group=" + this.state.group +
            "&name=" + event.target.name +
            "&category=" + this.state.category);
            break;
      }
    }
  }

  // This function return the form for setting the limits.
  display(){
    const itemList = this.state.items.map((item) =>{
      if(item.ranges !== null && item.group === this.state.group && item.category === this.state.category)
        return <div key={item.name}>
            <h5><b>{item.name}</b></h5>
            <Form.Row>
              <FormGroup>
                <Form.Label>High {item.ranges} </Form.Label>
                <Form.Control type="number" ref={input => this.input[item.name + "high"] = input} ></Form.Control>
                <Button name={item.name} className="btn btn-default" onClick={this.update.bind(this, "high")}>Set</Button>
              </FormGroup>
            </Form.Row>
            <Form.Row>
              <FormGroup>
                <Form.Label>Medium {item.ranges} </Form.Label>
                <Form.Control type="number" ref={input => this.input[item.name + "med"] = input} ></Form.Control>
                <Button name={item.name} className="btn btn-default" onClick={this.update.bind(this, "med")}>Set</Button>
              </FormGroup>
            </Form.Row>
            <Form.Row>
              <FormGroup>
                <Form.Label>Low {item.ranges} </Form.Label>
                <Form.Control type="number" ref={input => this.input[item.name + "low"] = input} ></Form.Control>
                <Button name={item.name} className="btn btn-default" onClick={this.update.bind(this, "low")}>Set</Button>
              </FormGroup>
            </Form.Row>
          </div>
    })
    if (this.state.group === "ifr"){
      return (
        <Form inline className="section">
        <div>
        <Row>
          <Button className="btn dash-btn" onClick={this.switch.bind(this, "departure")}>Departure</Button>
          <Button className="btn dash-btn" onClick={this.switch.bind(this, "enroute")}>Enroute</Button>
          <Button className="btn dash-btn" onClick={this.switch.bind(this, "destination")}>Destination</Button>
          <Button className="btn dash-btn" onClick={this.switch.bind(this, "physiology")}>Physiology</Button>
        </Row>
        <h1>{this.state.category}</h1>
        {itemList}
      </div>
        </Form>
      )}
    else{
      return (
        <Form inline className="section">
        <div>
        <Row>
          <Button className="btn dash-btn" onClick={this.switch.bind(this, "localPattern")}>Local Pattern</Button>
          <Button className="btn dash-btn" onClick={this.switch.bind(this, "departure")}>Departure</Button>
          <Button className="btn dash-btn" onClick={this.switch.bind(this, "enroute")}>Enroute</Button>
          <Button className="btn dash-btn" onClick={this.switch.bind(this, "destination")}>Destination</Button>
          <Button className="btn dash-btn" onClick={this.switch.bind(this, "physiology")}>Physiology</Button>
          <Button className="btn dash-btn" onClick={this.switch.bind(this, "soloFactors")}>Solo Factors</Button>
        </Row>
        <h1>{this.state.category}</h1>
        {itemList}
      </div>
        </Form>
      )}
  }

  // This renders the jumbotron and displays the current form of the limits being modified.
  render() {https://edhrec.com/
    if (this.state.loaded == true){
      return (
        <div>
          <Jumbotron fluid className="jumbo">
            <h1>Admin Panel</h1>
            <Link to="/AdminPanel/SearchStudent"><Button className="btn dash-btn">Search Students' Forms</Button></Link>
            <Link to="/AdminPanel/CurrentSettings"><Button className="btn dash-btn">Current Safety Limits</Button></Link>
            <Link to="/AdminPanel/SetLimits"><Button className="btn dash-btn">Set Safety Limits</Button></Link>
          </Jumbotron>
          <Row className="section">
            <Row>
              <Button className="btn dash-btn" onClick={this.switchCurrent.bind(this, "ifr")}>IFR Safety Limits</Button>
              <Button className="btn dash-btn" onClick={this.switchCurrent.bind(this, "vfr")}>VFR Safety Limits</Button>
            </Row>
            {this.display()}
          </Row>
        </div>
      )
    }
    else {
      return(<div>The page is loading...</div>)
    }
  }
}
export default SetLimits;