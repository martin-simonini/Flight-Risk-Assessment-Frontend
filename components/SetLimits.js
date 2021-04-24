import React, {Component} from 'react';
import {Link} from "react-router-dom";
import './../stylesheets/AdminPanel.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Jumbotron, Row, Form, FormGroup, Button} from 'react-bootstrap';

// This component allows admins to set the safety limits for the application.
class SetLimits extends Component {

constructor(props){
  super(props)

  this.state = ({settings: "IFR"},
                {type: "Departure"})
}

// This function takes in a string and switches the subcategory that is being displayed.
switch(panel){
  this.setState({type: panel})
}

// This function takes in a string and switches the category that is being displayed and sets the subcategory to its default.
switchCurrent(panel){
    this.setState({settings: panel})
    if (panel === "IFR"){
      this.setState({type: "Departure"})
    }
    else {
      this.setState({type: "LocalPattern"}) 
    }
}

// This function takes in a list of strings and maps them to a form that can set lows, mids, and highs for a given parameter then returns that form.
form(items){
  let itemList=[]
  items.forEach((item)=>{
    itemList.push(
    <div key={item}>
      <h5><b>{item}</b></h5>
      <Form.Row>
        <FormGroup>
          <Form.Label>Max: </Form.Label>
          <Form.Control type="number"></Form.Control>
          <Button className="btn btn-default">Set</Button>
        </FormGroup>
      </Form.Row>
      <Form.Row>
        <FormGroup>
          <Form.Label>Mid: </Form.Label>
          <Form.Control type="number"></Form.Control>
          <Button className="btn btn-default">Set</Button>
        </FormGroup>
      </Form.Row>
      <Form.Row>
        <FormGroup>
          <Form.Label>Low: </Form.Label>
          <Form.Control type="number"></Form.Control>
          <Button className="btn btn-default">Set</Button>
        </FormGroup>
      </Form.Row>
    </div>
    )
  })
  return (
    <Form inline className="section">
    {itemList}
    </Form>
  )
}

// This function returns the form to set the limits for ifr.
ifr(){
  let type
  if (this.state.type === "Departure"){
    type = this.form(['ceilingDay','ceilingNight','visibility','totalWind','gustIncr','crosswind'])
  }
  else if (this.state.type === "Enroute"){
    type = this.form(['ceilingDay','ceilingNight','visibility','time','thunderstorm','fuelAlt','altAirfield'])
  }
  else if (this.state.type === "Destination"){
    type = this.form(['ceilingDay','ceilingNight','visibility','totalWind','gustIncr','crosswind'])
  }
  else if (this.state.type === "Physiology"){
    type = this.form(['flightTime','flightBegan','prevFlights','outsideTemp'])
  }
  return(
    <div>
      <Row>
        <Button className="btn dash-btn" onClick={this.switch.bind(this, "Departure")}>departure</Button>
        <Button className="btn dash-btn" onClick={this.switch.bind(this, "Enroute")}>enroute</Button>
        <Button className="btn dash-btn" onClick={this.switch.bind(this, "Destination")}>destination</Button>
        <Button className="btn dash-btn" onClick={this.switch.bind(this, "Physiology")}>physiology</Button>
      </Row>
      <h1>{this.state.type}</h1>
      {type}
    </div>
  )
}

// This function returns the form to set the limits for vfr.
vfr(){
  let type
  if (this.state.type === "LocalPattern"){
    type = this.form(['ceilingDayDual','ceilingDaySolo','ceilingNight','visibilityDay','visibilityNight','totalWind','gustIncr','crosswind'])
  }
  else if (this.state.type === "Departure"){
    type = this.form(['ceiling','visibility','totalWind','gustIncr','crosswind'])
  }
  else if (this.state.type === "Enroute"){
    type = this.form(['ceiling','visibility','time','fuelAlt'])
  }
  else if (this.state.type === "Destination"){
    type = this.form(['ceiling','visibility','totalWind','gustIncr','crosswind'])
  }
  else if (this.state.type === "Physiology"){
    type = this.form(['flightTime','flightBegan','prevFlights','outsideTemp'])
  }
  else if (this.state.type === "SoloFactors"){
    type = this.form(['GndRefernceManuevers','experience','lastLandingPriv','lastLandingComm'])
  }
  return(
    <div>
      <Row>
        <Button className="btn dash-btn" onClick={this.switch.bind(this, "LocalPattern")}>localPattern</Button>
        <Button className="btn dash-btn" onClick={this.switch.bind(this, "Departure")}>departure</Button>
        <Button className="btn dash-btn" onClick={this.switch.bind(this, "Enroute")}>enroute</Button>
        <Button className="btn dash-btn" onClick={this.switch.bind(this, "Destination")}>destination</Button>
        <Button className="btn dash-btn" onClick={this.switch.bind(this, "Physiology")}>physiology</Button>
        <Button className="btn dash-btn" onClick={this.switch.bind(this, "SoloFactors")}>soloFactors</Button>
      </Row>
      <h1>{this.state.type}</h1>
      {type}
    </div>
  )
}

// This renders the jumbotron and displays the current form of the limits being modified.
render() {
  let display
  if (this.state.settings === "VFR"){
    display = this.vfr()
  }
  else {
    display = this.ifr()
  }
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
          <Button className="btn dash-btn" onClick={this.switchCurrent.bind(this, "IFR")}>IFR Safety Limits</Button>
          <Button className="btn dash-btn" onClick={this.switchCurrent.bind(this, "VFR")}>VFR Safety Limits</Button>
        </Row>
        {display}
      </Row>
    </div>
  )
}
}
export default SetLimits;