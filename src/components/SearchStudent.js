import React, {Component} from 'react';
import {Link} from "react-router-dom";
import './../stylesheets/AdminPanel.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Jumbotron, Row, Form, FormGroup, Button} from 'react-bootstrap';
import {Redirect} from "react-router-dom";

// This component will display the forms submitted by the student selected.
class SearchStudent extends Component{
    
    constructor(props) {
        super(props);

        this.state = ({});
    }

    render() {
        return (
            <div>
                <Jumbotron fluid className="jumbo">
                    <h1>Admin Panel</h1>
                    <Link to="/AdminPanel/SearchStudent"><Button className="btn dash-btn">Search Students' Forms</Button></Link>
                    <Link to="/AdminPanel/CurrentSettings"><Button className="btn dash-btn">Current Safety Limits</Button></Link>
                    <Link to="/AdminPanel/SetLimits"><Button className="btn dash-btn">Set Safety Limits</Button></Link>
                  </Jumbotron>
                <Form inline className="section">
                <Form.Row>
                    <h3 className="section">Search for student's submitted forms</h3>
                    <FormGroup as={Row} className="section">
                        <Form.Label>Student's Name: </Form.Label>
                        <Form.Control type="text"></Form.Control>
                        <Button className="btn btn-default">Search</Button>
                    </FormGroup>
                </Form.Row>
                </Form>
            </div>
        );
    }
}

export default SearchStudent;