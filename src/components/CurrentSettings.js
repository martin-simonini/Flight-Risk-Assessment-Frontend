import React, {Component} from 'react';
import {Link} from "react-router-dom";
import './../stylesheets/AdminPanel.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Jumbotron, Row, Col, Form, FormGroup, Button} from 'react-bootstrap';

// This component displays all of current safety limits.
class CurrentSettings extends Component{
    
    constructor(props) {
        super(props);

        this.state = ({
                    group: "ifr",
                    category: "departure",
                    items: [],
                    loaded: false,
                    });
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

    // This function changes if the vfr limits are being shown or if the ifr limits are being shown.
    switchCurrent(panel){
        this.setState({group: panel})
        if (panel === "ifr")
            this.setState({category: "departure"})
        else
            this.setState({category: "localPattern"})
    }

    // This function changes if the vfr limits are being shown or if the ifr limits are being shown.
    switchCategory(panel){
        this.setState({category: panel})
    }

    // This function return the html for the limits.
    Display() {
        const listItems = this.state.items.map((value) =>{
        if(value.group === this.state.group && value.category === this.state.category)
            return <div key={value.name}>
                    <b>{value.name}</b>
                    <p>{value.ranges} Low: {value.low} {value.ranges} Medium: {value.med} {value.ranges} High: {value.high} {value.ranges}</p>
                </div>
        });
        if (this.state.group === "ifr"){
            return (
                <Row>
                    <Button as={Col} className="btn dash-btn" onClick={this.switchCategory.bind(this, "departure")}>Departure</Button>
                    <Button as={Col} className="btn dash-btn" onClick={this.switchCategory.bind(this, "enroute")}>Enroute</Button>
                    <Button as={Col} className="btn dash-btn" onClick={this.switchCategory.bind(this, "destination")}>Destination</Button>
                    <Button as={Col} className="btn dash-btn" onClick={this.switchCategory.bind(this, "physiology")}>Physiology</Button>
                    <h3>{this.state.category}</h3>
                    {listItems}
                </Row>
            );
        }
        else{
            return (
                <Row>
                    <Button as={Col} className="btn dash-btn" onClick={this.switchCategory.bind(this, "localPattern")}>Local Pattern</Button>
                    <Button as={Col} className="btn dash-btn" onClick={this.switchCategory.bind(this, "departure")}>Departure</Button>
                    <Button as={Col} className="btn dash-btn" onClick={this.switchCategory.bind(this, "enroute")}>Enroute</Button>
                    <Button as={Col} className="btn dash-btn" onClick={this.switchCategory.bind(this, "destination")}>Destination</Button>
                    <Button as={Col} className="btn dash-btn" onClick={this.switchCategory.bind(this, "physiology")}>Physiology</Button>
                    <Button as={Col} className="btn dash-btn" onClick={this.switchCategory.bind(this, "soloFactors")}>Solo Factors</Button>
                    <h3>{this.state.category}</h3>
                    {listItems}
                </Row>
            );
        }
    }

    // This renders the jumbotron and the currently selected limits.
    render() {
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
                            <Button as={Col} className="btn dash-btn" onClick={this.switchCurrent.bind(this, "ifr")}>IFR Safety Limits</Button>
                            <Button as={Col} className="btn dash-btn" onClick={this.switchCurrent.bind(this, "vfr")}>VFR Safety Limits</Button>
                        </Row>
                        {this.Display()}
                    </Row>
                </div>
            )
        }
        else {
            return(<div>The page is loading...</div>)
        }
    }

}

export default CurrentSettings;