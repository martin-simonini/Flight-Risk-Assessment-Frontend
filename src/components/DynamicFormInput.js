import React, {useEffect, useState} from 'react';
import {Accordion, Card, Row, Col, Form, Jumbotron, Container, useAccordionToggle} from 'react-bootstrap';
import axios from 'axios';
import {BsChevronDoubleDown, BsChevronDoubleRight} from "react-icons/all";


import AirSigmetModal from "./dynamic_subcomponents/AirSigmetAccordion";
import './../stylesheets/RiskAssessmentForm.css';
import './../stylesheets/AdminPanel.css';
import AirSigmetAccordion from "./dynamic_subcomponents/AirSigmetAccordion";
import PirepAccordion from "./dynamic_subcomponents/PirepAccordion";
import CrossCountryQuestions from "./CrossCountryQuestions";


function DynamicFormInput(props) {

    const [currentWeather, setCurrentWeather] = useState({
        airSigmetList: [],
        winds: '',
        crosswind: 0,
        crosswind_gust: 0,
        headwind: 0,
        headwind_gust: 0,
        instrumentCurrent: true,
        metar: '',
        alternateMetar:'',
        destinationMetar: [],
        pireps: [],
        primaryRunway: ''
    });
    const [isInstrumentCurrent, setIsInstrumentCurrent] = useState("No");
    const [departureIAP, setDepartureIAP] = useState("");
    const [acceptableWinds, setAcceptableWinds] = useState("No");
    const [requireWinds, setRequireWinds] = useState(false);
    const [displayAirSigmets, setDisplayAirSigmets] = useState([]);
    const [displayPireps, setDisplayPireps] = useState([]);


    useEffect(() => {
        console.log(props.requestData)
        axios({
            method: 'post',
            url: "/basicFormInfo",
            headers: {
                accept: "application/json",
                "Content-Type": "application/json"
            },
            data: props.requestData
        }).then(response => {
            console.log(response.data);
            setCurrentWeather(response.data);
            checkCrosswind(response.data);
            let AirSigmetAccordionList = [];
            let PirepAccordionList = [];
            response.data.airSigmetList.map((item, index) => AirSigmetAccordionList.push(<AirSigmetAccordion
                airSigmet={item} index={index}/>));
            response.data.pireps.map((item, index) => PirepAccordionList.push(<PirepAccordion pirep={item}
                                                                                              index={index}/>));
            setDisplayAirSigmets(AirSigmetAccordionList);
            setDisplayPireps(PirepAccordionList);

        })
    }, []);

    /*This method will check if the crosswind is within limiations*/
    function checkCrosswind(data) {
        //TODO: get threshold values from backend
        //console.log(currentWeather);
        setRequireWinds(data.crosswind >= 10 || data.crosswind_gust >= 10 || data.headwind >= 15 || data.headwind_gust >= 15);
    }

    /*Formats the crosswind/headwind. If there is no gusts it should just display the winds. With gusts the gust should be preceded by a 'G'. Ex: 12G20*/
    function getWind(isCrosswind) {
        if (isCrosswind) {
            if (currentWeather.crosswind_gust === 0)
                return currentWeather.crosswind;
            else
                return currentWeather.crosswind + "G" + currentWeather.crosswind_gust;
        } else {
            if (currentWeather.headwind_gust === 0)
                return currentWeather.headwind;
            else
                return currentWeather.headwind + "G" + currentWeather.headwind_gust;
        }
    }


    function isDepartureIFR() {
        if (currentWeather.metar === null)
            return false;
        return (currentWeather.metar.flightCategory === "IFR" || currentWeather.metar.flightCategory === "LIFR");
    }

    function displayMetars() {
        if (props.requestData.categoryOfFlight !== "normal" || props.requestData.typeOfFlight === "pattern" || props.requestData.typeOfFlight === "practice area") {
            return (
                <> <h4><u>METAR:</u></h4>
                    <span className="display-metar">{currentWeather.metar.rawText}</span>
                    <br/>
                </>)
        } else if (props.requestData.categoryOfFlight === "normal") {
            return (
                <>
                    <h4><u>Departure METAR: </u></h4>
                    <span className="display-metar">{currentWeather.metar.rawText}</span>
                    <h4>
                        <u>{props.requestData.typeOfFlight === "aux_field" ? "Auxiliary Airport METARs" : "Destination Airport METARs"}: </u>
                    </h4>
                    {currentWeather.destinationMetar.map(i => {
                        /*The color coding is VFR - Green text, IFR - Red text, LIFR - Magenta text. Returns appropriate color.*/
                        if (i === null)
                            return (<span className="error">UNABLE TO DISPLAY METAR. Check Airport CODE.</span>)
                        if (i.flightCategory === "VFR")
                            return (<><span className="display-metar vfr">{i.rawText}</span><br/></>)
                        else if (i.flightCategory === "MVFR")
                            return (<><span className="display-metar mvfr">{i.rawText}</span><br/></>)
                        else if (i.flightCategory === "IFR")
                            return (<><span className="display-metar ifr">{i.rawText}</span><br/></>)
                        else
                            return (<><span className="display-metar lifr">{i.rawText}</span><br/></>)
                    })}
                    {props.requestData.typeOfFlight === "cross_country" &&

                    <>
                        <h4><u>Alternate Aiport METAR: </u></h4>
                        {displayAlternateAirport()}
                    </>
                    }
                </>
            )
        }
    }

    function displayAlternateAirport(){
            if (currentWeather.alternateMetar === null)
                return (<span className="error">UNABLE TO DISPLAY METAR. Check Airport CODE.</span>)
            else if (currentWeather.alternateMetar.flightCategory === "VFR")
                return (<><span className="display-metar vfr">{currentWeather.alternateMetar.rawText}</span><br/></>)
            else if (currentWeather.alternateMetar.flightCategory === "MVFR")
                return (<><span className="display-metar mvfr">{currentWeather.alternateMetar.rawText}</span><br/></>)
            else if (currentWeather.alternateMetar.flightCategory === "IFR")
                return (<><span className="display-metar ifr">{currentWeather.alternateMetar.rawText}</span><br/></>)
            else
                return (<><span className="display-metar lifr">{currentWeather.alternateMetar.rawText}</span><br/></>)
    }

    return (
        <Container className="dynamicContainer">
            <Row>
                <Col>
                    <Jumbotron fluid className="jumbo">
                        <h1 className="text-center">Additional Questions</h1>
                    </Jumbotron>
                </Col>
            </Row>
            <Form className="overflow-auto">
                <Row>
                    <Col md="12" className="px-3">
                        {displayMetars()}
                        <br/>
                    </Col>
                </Row>

                {isDepartureIFR() &&
                <Form.Group as={Row} controlId="isInstrumentCurrent">
                    <Form.Label column md="4">Are you instrument Proficient and Current?</Form.Label>
                    <Form.Control as="select" column md="8" className="studentInfo" name="student_level"
                                  onChange={e => setIsInstrumentCurrent(e.target.value)}
                                  value={isInstrumentCurrent}>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                    </Form.Control>
                    <Form.Label column md="4">What is teh best IAP Avialable? </Form.Label>
                    <Form.Control as="select" column md="8" className="studentInfo" name="student_level"
                                  onChange={e => setDepartureIAP(e.target.value)}
                                  value={departureIAP}>
                        <option value="Precision">Precision</option>
                        <option value="Non-Precision">Non-Precision</option>
                        <option value="Circling">Circling</option>
                    </Form.Control>
                </Form.Group>
                }
                {requireWinds &&
                <Form.Group as={Row} controlId="crosswind">
                    <Form.Label column md="4">The winds
                        are {currentWeather.winds}. {currentWeather.primaryRunway} has a
                        headwind of {getWind(false)} and a crosswind of {getWind(true)}. Is that
                        acceptable? </Form.Label>
                    <Form.Control as="select" column md="8" className="studentInfo" name="student_level"
                                  onChange={e => setAcceptableWinds(e.target.value)} value={acceptableWinds}>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                    </Form.Control>
                </Form.Group>
                }

                {currentWeather.airSigmetList.length > 0 &&
                <Form.Group as={Row}>
                    <Col md="12">
                        <h3 className="text-center">Airmets and Sigmets</h3>
                    </Col>
                    <Col md="12">
                        <Accordion>
                            {displayAirSigmets}
                        </Accordion>
                    </Col>
                </Form.Group>
                }

                {currentWeather.pireps.length > 0 &&
                <Form.Group as={Row}>
                    <Col md="12">
                        <h3 className="text-center">Pireps</h3>
                    </Col>
                    <Col md="12">
                        <Accordion>
                            {displayPireps}
                        </Accordion>
                    </Col>
                </Form.Group>
                }

                <CrossCountryQuestions flightRules={props.requestData.xcFlightRules} />

            </Form>

        </Container>
    );
    }


    export default DynamicFormInput;
