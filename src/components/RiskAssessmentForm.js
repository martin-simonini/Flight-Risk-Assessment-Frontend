import React, {useEffect, useState} from 'react';
import {Button, Row, Col, Form, Jumbotron, Container} from 'react-bootstrap';
import {Link} from "react-router-dom";
import DatePicker from 'react-datepicker';
import axios from 'axios';
import moment from 'moment';
import notams from 'notams';

import FlightDutyFormInput from "./FlightDutyFormInput";
import TypeOfFlightFormInput from "./dynamic_subcomponents/TypeOfFlightFormInput";
import './../stylesheets/RiskAssessmentForm.css';
import './../stylesheets/AdminPanel.css';
import DynamicFormInput from "./DynamicFormInput";
import HumanFactorQuestions from "./dynamic_subcomponents/HumanFactorQuestions";

function RiskAssessmentForm() {
    /* Departure time and date. Format is MM/dd/yyyy h:mm aa*/
    const [departureTime, setDepartureTime] = useState(new Date());
    const [departureAirport, setDepartureAirport] = useState();
    const [studentName, setStudentName] = useState("");
    /*What license the student is pursing. This will indicate their skill level.*/
    const [studentLevel, setStudentLevel] = useState("private");
    /*Will there be an instructor on board. Particularly important if 'private' is selected.*/
    const [isDualFlight, setIsDualFlight] = useState(false);
    /*How Many flights have they flown previously that day*/
    const [prevFlights, setPrevFlights] = useState(0);
    /*When was their first flight today.*/
    const [flightDuty, setFlightDuty] = useState();
    /*What is the category of flight: Normal, Stage Check, FAA checkride*/
    const [categoryOfFlight, setCategoryOfFlight] = useState("normal");
    /*Where are they going? Staying local or going on a cross country*/
    const [typeOfFlight, setTypeOfFlight] = useState("pattern");
    /*If they are going on a cross country, to what airports*/
    const [xcDestination, setXcDestination] = useState("");
    /*If they are going on a cross country, what are their alternates*/
    const [xcAlternate, setXcAlternate] = useState("");
    /*Will they be doing the xc under IFR or VFR?*/
    const [flightRules, setFlightRules] = useState("VFR");
    const [timeInAirplane, setTimeInAirplane] = useState(0);
    const [lastDualLanding, setLastDualLanding] = useState(0);
    const [lastDualStall, setLastDualStall] = useState(0);
    const [groundReferenceManeuvers, setGroundReferenceManeuvers] = useState(0);
    const [showDynamicQuestions, setShowDynamicQuestions] = useState(false);


    function generateData() {
        const formattedDepartureDate = moment(departureTime).utc().format("MM/DD/yyyy HH:mm").toString();
        const data = {
            'departureTime': formattedDepartureDate,
            departureAirport,
            studentName,
            studentLevel,
            isDualFlight,
            prevFlights,
            flightDuty,
            categoryOfFlight,
            typeOfFlight,
            xcDestination,
            flightRules,
            xcAlternate
        }
        return data;
    }

    /*Simple logging function. For debugging purposes only.*/
    function logState(e) {
        /* Remember that setState() is async so console.log my lag behind the state change*/
        e.preventDefault();
        console.log("-----FlightAssessmentForm State Variables-----")
        console.log("departureTime: "+departureTime);
        console.log("Departure Airport: "+departureAirport);
        console.log("Student name: "+studentName);
        console.log("Student level: "+studentLevel);
        console.log("Is Dual flight: "+isDualFlight);
        console.log("previous flights: "+prevFlights);
        console.log("flightDuty: "+flightDuty);
        console.log("Category of flight: "+categoryOfFlight);
        console.log("Type of Flight: "+typeOfFlight);
        console.log("---------------------------------------------")
   }

    if (!showDynamicQuestions) {
        return (
            <Container className="overflow-auto">
                <Link to="/AdminPanel/SearchStudent"><Button style={{float: "right"}}
                                                             className="btn dash-btn">Admin</Button></Link>
                <Jumbotron fluid className="jumbo">
                    <h1 className="text-center">Risk Assessment Form</h1>
                </Jumbotron>
                <Form>
                    <Form.Group as={Row} controlId="departureDateAndTime">
                        <Form.Label column md="4" className="align-right">Departure Time and Date: </Form.Label>
                        <DatePicker
                            selected={departureTime}
                            onChange={date => setDepartureTime(date)}
                            timeInputLabel="Departure Time:"
                            dateFormat="MM/dd/yyyy h:mm aa"
                            timeFormat="HH:mm"
                            showTimeInput
                            minDate={(new Date())}
                            column md="8"
                            className="float-left w-100"
                        />
                    </Form.Group>
                    <Form.Group as={Row} controlId="departureAirport">
                        <Form.Label column md="4" className="float-right">Departure Airport: </Form.Label>
                        <Form.Control
                            type="text"
                            name="departure_airport"
                            onChange={e => setDepartureAirport(e.target.value)}
                            className="departureAirport"
                            column md="8"
                        />
                    </Form.Group>
                    <Form.Group as={Row} controlId="studentName">
                        <Form.Label column md="4" className="float-right">Student's Name: </Form.Label>
                        <Form.Control
                            type="text"
                            name="student_name"
                            onChange={e => setStudentName(e.target.value)}
                            className="studentInfo"
                            column md="8"
                        />
                    </Form.Group>
                    <Form.Group as={Row} controlId="studentLevel">
                        <Form.Label column md="4">Certificate
                            pursuing: </Form.Label> {/*There is probably a better way to phrase this*/}
                        <Form.Control as="select" column md="8" className="studentInfo" name="student_level"
                                      onChange={e => setStudentLevel(e.target.value)} value={studentLevel}>
                            <option value="private">Private Pilot's License</option>
                            <option value="instrument">Instrument Rating</option>
                            <option value="commercial">Commercial License</option>
                            <option value="cfi">Certified Flight Instructor</option>
                            <option value="multi">Commercial Multi Engine Add-on</option>
                            <option value="other">Other</option>
                        </Form.Control>
                    </Form.Group>

                    <Form.Row>

                        <Form.Group id="dualFlight" as={Col}>
                            <Form.Check
                                type="checkbox" label="This is a dual flight"
                                onChange={() => {
                                    setIsDualFlight(!isDualFlight)
                                }}
                                value={isDualFlight}
                            />
                        </Form.Group>

                    </Form.Row>

                    <Form.Row>
                        <Form.Group as={Row} controlId="missionSelect">
                            <Form.Label column md="4" >Flight Rules</Form.Label>
                            <Form.Control
                                as="select"
                                name="student_level"
                                onChange={e => setFlightRules(e.target.value)}
                                value={flightRules}
                                className="studentInfo"
                                column md="8"
                            >
                                <option value="xc_vfr">VFR</option>
                                <option value="xc_ifr">IFR</option>
                            </Form.Control>
                        </Form.Group>
                    </Form.Row>

                    {flightRules==="VFR" && !isDualFlight &&
                       <HumanFactorQuestions
                           studentLevel={studentLevel}
                           setTimeInAirplane={setTimeInAirplane}
                           setLastDualLanding={setLastDualLanding}
                           setLastDualStall={setLastDualStall}
                           groundReferenceManeuvers={groundReferenceManeuvers}
                           setGroundReferenceManeuvers={setGroundReferenceManeuvers}
                           typeOfFlight={typeOfFlight}
                       />

                    }

                    <Form.Group as={Row} controlId="previousFlights">
                        <Form.Label column md="4">Previous Flights that day</Form.Label>
                        <Form.Control
                            type="number"
                            name="prevFlights"
                            onChange={e => setPrevFlights(e.target.value)}
                            value={prevFlights}
                            className="studentInfo"
                            column md="8"
                        />
                    </Form.Group>

                    {/*Should only display if prevFlight > 0*/}
                    <FlightDutyFormInput
                        prevFlights={prevFlights}
                        flightDuty={flightDuty}
                        eventHandler={setFlightDuty}
                    />

                    <Form.Group as={Row} controlId="catOfFlight">
                        <Form.Label column md="4">Category of Syllabus Flight</Form.Label>
                        <Form.Control as="select" column md="8" className="studentInfo" name="student_level"
                                      onChange={e => setCategoryOfFlight(e.target.value)} value={categoryOfFlight}>
                            <option value="normal">Normal</option>
                            <option value="stage_check">Stage Check</option>
                            <option value="checkride">FAA Practical Test</option>
                        </Form.Control>
                    </Form.Group>

                    {/*Should only display if categoryOfFlight is 'normal'*/}
                    <TypeOfFlightFormInput
                        categoryOfFlight={categoryOfFlight}
                        typeOfFlight={typeOfFlight}
                        eventHandler={setTypeOfFlight}
                        xcDestination={xcDestination}
                        xcAlternate={xcAlternate}
                        setXcDestination={setXcDestination}
                        setXcAlternate={setXcAlternate}
                    />


                    <Button className="dash-btn" onClick={() => setShowDynamicQuestions(true)}>
                        Next
                    </Button>
                    <Button className="dash-btn" onClick={logState}>
                        Log State
                    </Button>
                </Form>
            </Container>
        );
    } else {
        const data = generateData();
        return (<DynamicFormInput requestData={data}/>);

    }
}


export default RiskAssessmentForm;
