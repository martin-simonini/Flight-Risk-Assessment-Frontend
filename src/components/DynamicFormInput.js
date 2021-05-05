import React, {useEffect, useState} from 'react';
import {Accordion, Card, Row, Col, Form, Jumbotron, Container, useAccordionToggle, Button} from 'react-bootstrap';
import axios from 'axios';
import {getSunrise, getSunset} from "sunrise-sunset-js";


import AirSigmetModal from "./dynamic_subcomponents/AirSigmetAccordion";
import './../stylesheets/RiskAssessmentForm.css';
import './../stylesheets/AdminPanel.css';
import AirSigmetAccordion from "./dynamic_subcomponents/AirSigmetAccordion";
import PirepAccordion from "./dynamic_subcomponents/PirepAccordion";
import CrossCountryQuestions from "./CrossCountryQuestions";
import ResultPage from "./ResultPage";
import moment from "moment";
import {forEach} from "react-bootstrap/ElementChildren";


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
        alternateMetar: '',
        destinationMetar: [],
        pireps: [],
        primaryRunway: ''
    });
    const [isInstrumentCurrent, setIsInstrumentCurrent] = useState("No");
    const [departureIAP, setDepartureIAP] = useState("Precision");
    const [destinationIAP, setDestinationIAP] = useState("Precision");
    const [alternateIAP, setAlternateIAP] = useState("Precision");
    const [acceptableWinds, setAcceptableWinds] = useState("No");
    const [requireWinds, setRequireWinds] = useState(false);
    const [displayAirSigmets, setDisplayAirSigmets] = useState([]);
    const [displayPireps, setDisplayPireps] = useState([]);

    const [enrouteCeiling, setEnrouteCeiling] = useState(1000);
    const [enrouteVis, setEnrouteVis] = useState(4);
    const [thunderstorm, setThunderstorm] = useState(0);
    const [fuelAtAlt, setFuelAtAlt] = useState(90);
    const [vfrCheckpoints, setVFRCheckpoints] = useState("Few to None");
    const [timeEnroute, setTimeEnroute] = useState(0);
    const [formValidation, setFormValidation] = useState(false);
    const [destinationCrosswind, setDestinationCrosswind] = useState(0);
    const [alternateCrosswind, setAlternateCrosswind] = useState(0);
    const [showResults, setShowResults] = useState(false);

    useEffect(() => {
        console.log("Request Data")
        console.log(props.requestData)
        axios({
            method: 'post',
            url: "http://flight-risk-assessment-backend.us-east-2.elasticbeanstalk.com/basicFormInfo",
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

    function generate_risk_info() {
        const is_commercial = !(props.requestData.studentLevel === "private");
        console.log("Current Weather: ")
        console.log(currentWeather);

        if (isDepartureIFR() || props.requestData.flightRules === "IFR") {
            if (isLocal()) {
                const data = {
                    "is_local": isLocal(),
                    "departure_vis": currentWeather.metar.visibility,
                    "departure_ceilings": getCeiling(currentWeather.metar.skyCoverage),
                    "departure_iap": departureIAP,
                    "departure_winds": currentWeather.metar.windSpeed,
                    "departure_gusts": currentWeather.metar.windGust,
                    "departure_crosswind": currentWeather.crosswind,
                    "enroute_ceilings": null,
                    "enroute_vis": null,
                    "time_enroute": null,
                    "tunderstorm_risk": null,
                    "fuel_at_alternate": null,
                    "destination_vis": null,
                    "destination_ceilings": null,
                    "destination_iap": null,
                    "destination_winds": null,
                    "destination_gusts": null,
                    "destination_crosswind": null,
                    "alternate_vis": null,
                    "alternate_ceilings": null,
                    "alternate_iap": null,
                    "alternate_winds": null,
                    "alternate_gusts": null,
                    "alternate_crosswind": null,
                    "time_of_day": props.timeofFlight,
                    "flight_duty_period": props.requestData.flightDuty,
                    "previous_flights": props.requestData.prevFlights,
                    "temperature": currentWeather.metar.temperature,
                    "type_of_flight": type_of_flight()
                }
                return data;

            }
            const data = {
                "is_local": isLocal(),
                "departure_vis": currentWeather.metar.visibility,
                "departure_ceilings": getCeiling(currentWeather.metar.skyCoverage),
                "departure_iap": departureIAP,
                "departure_winds": currentWeather.metar.windSpeed,
                "departure_gusts": currentWeather.metar.windGust,
                "departure_crosswind": currentWeather.crosswind,
                "enroute_ceilings": enrouteCeiling,
                "enroute_vis": enrouteVis,
                "time_enroute": timeEnroute,
                "tunderstorm_risk": thunderstorm,
                "fuel_at_alternate": fuelAtAlt,
                "destination_vis": currentWeather.destinationMetar[0].visibility,
                "destination_ceilings": getCeiling(currentWeather.destinationMetar[0].skyCoverage),
                "destination_iap": destinationIAP,
                "destination_winds": currentWeather.destinationMetar[0].windSpeed,
                "destination_gusts": currentWeather.destinationMetar[0].windGust,
                "destination_crosswind": destinationCrosswind,
                "alternate_vis": currentWeather.alternateMetar.visibility,
                "alternate_ceilings": getCeiling(currentWeather.alternateMetar.skyCoverage),
                "alternate_iap": alternateIAP,
                "alternate_winds": currentWeather.alternateMetar.windSpeed,
                "alternate_gusts": currentWeather.alternateMetar.windGust,
                "alternate_crosswind": alternateCrosswind,
                "time_of_day": props.timeofFlight,
                "flight_duty_period": props.requestData.flightDuty,
                "previous_flights": props.requestData.prevFlights,
                "temperature": currentWeather.metar.temperature,
                "type_of_flight": type_of_flight()
            }
            return data;
        } else {
            if (isLocal()) {
                const data = {
                    "is_local": isLocal(),
                    "is_dual": props.requestData.isDualFlight,
                    "is_commercial": is_commercial,
                    "departure_vis": currentWeather.metar.visibility,
                    "departure_ceilings": getCeiling(currentWeather.metar.skyCoverage),
                    "departure_winds": currentWeather.metar.windSpeed,
                    "departure_gusts": currentWeather.metar.windGust,
                    "departure_crosswind": currentWeather.crosswind,
                    "enroute_ceilings": null,
                    "enroute_vis": null,
                    "vfr_checkpoints": null,
                    "time_enroute": null,
                    "fuel_at_alternate": null,
                    "destination_vis": null,
                    "destination_ceilings": null,
                    "destination_winds": null,
                    "destination_gusts": null,
                    "destination_crosswind": null,
                    "alternate_vis": null,
                    "alternate_ceilings": null,
                    "alternate_winds": null,
                    "alternate_gusts": null,
                    "alternate_crosswind": null,
                    "time_of_day": props.timeofFlight,
                    "flight_duty_period": props.requestData.flightDuty,
                    "previous_flights": props.requestData.prevFlights,
                    "type_of_flight": type_of_flight(),
                    "temperature": currentWeather.metar.temperature,
                    "flight_location": flight_location(),
                    "ground_ref_maneuvers": props.requestData.groundReferenceManeuvers,
                    "experience_in_airplane": props.timeInAirplane,
                    "last_dual_landing": props.lastDualLanding,
                    "last_dual_stall": props.lastDualStall
                }
                return data;
            } else {
                const data = {
                    "is_local": isLocal(),
                    "is_dual": props.requestData.isDualFlight,
                    "is_commercial": is_commercial,
                    "departure_vis": currentWeather.metar.visibility,
                    "departure_ceilings": getCeiling(currentWeather.metar.skyCoverage),
                    "departure_winds": currentWeather.metar.windSpeed,
                    "departure_gusts": currentWeather.metar.windGust,
                    "departure_crosswind": currentWeather.crosswind,
                    "enroute_ceilings": enrouteCeiling,
                    "enroute_vis": enrouteVis,
                    "vfr_checkpoints": vfrCheckpoints,
                    "time_enroute": timeEnroute,
                    "fuel_at_alternate": fuelAtAlt,
                    "destination_vis": currentWeather.destinationMetar[0].visibility,
                    "destination_ceilings": getCeiling(currentWeather.destinationMetar[0].skyCoverage),
                    "destination_winds": currentWeather.destinationMetar[0].windSpeed,
                    "destination_gusts": currentWeather.destinationMetar[0].windGust,
                    "destination_crosswind": destinationCrosswind,
                    "alternate_vis": currentWeather.alternateMetar.visibility,
                    "alternate_ceilings": getCeiling(currentWeather.alternateMetar.skyCoverage),
                    "alternate_winds": currentWeather.alternateMetar.windSpeed,
                    "alternate_gusts": currentWeather.alternateMetar.windGust,
                    "alternate_crosswind": alternateCrosswind,
                    "time_of_day": props.timeofFlight,
                    "flight_duty_period": props.requestData.flightDuty,
                    "previous_flights": props.requestData.prevFlights,
                    "type_of_flight": type_of_flight(),
                    "temperature": currentWeather.metar.temperature,
                    "flight_location": flight_location(),
                    "ground_ref_maneuvers": props.requestData.ground_ref_maneuvers,
                    "experience_in_airplane": props.timeInAirplane,
                    "last_dual_landing": props.lastDualLanding,
                    "last_dual_stall": props.lastDualStall
                }
                return data;
            }

        }
    }

    function getCeiling(skyCoverage) {
        let highestCeiling = 12000;
        skyCoverage.forEach(i => {
            if (i.coverage === "BKN" || i.coverage === "OVC") {
                if (highestCeiling > i.base)
                    highestCeiling = i.base;
            } else if (i.coverage === "OVX") {
                if (highestCeiling > i.verticalVis)
                    highestCeiling = i.verticalVis;
            }
        })
        return highestCeiling;
    }

    function isLocal() {
        return (props.requestData.typeOfFlight === "pattern" || props.requestData.typeOfFlight === "practice_area" || props.requestData.typeOfFlight === "aux_field");
    }

    function isIFR(){
        return props.flightRules === "IFR";
    }

    function flight_location() {
        if (props.requestData.typeOfFlight === "pattern" || props.requestData.typeOfFlight === "practice_area")
            return "Local Area";
        else if (props.requestData.typeOfFlight === "aux_field")
            return "Aux Field";
        return "cross_country";
    }

    function type_of_flight() {
        if (props.requestData.categoryOfFlight === "normal")
            return "Normal";
        else if (props.requestData.categoryOfFlight === "stage_check")
            return "Stage Check";
        else
            return "FAA Check";
    }

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

    function displayAlternateAirport() {
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

    function instrument_local_iap(){
        return(
            <>
                <Form.Group as={Row} controlId="local_bestIAP">
                    <Form.Label column md="4">What is the best IAP Avialable at the departure airport? </Form.Label>
                    <Form.Control as="select" column md="8" className="studentInfo" name="student_level"
                                  onChange={e => setDepartureIAP(e.target.value)}
                                  value={departureIAP}>
                        <option value="Precision">Precision</option>
                        <option value="Non-Precision">Non-Precision</option>
                        <option value="Circling">Circling</option>
                    </Form.Control>
                </Form.Group>
            </>
        )
    }

    if (!showResults) {
        return (
            <>
                <Row>
                    <Col>
                        <Jumbotron fluid className="jumbo">
                            <h1 className="text-center">Additional Questions</h1>
                        </Jumbotron>
                    </Col>
                </Row>
                <Container className="dynamicContainer">
                    <Form nonValidate validated={formValidation} className="overflow-auto">
                        <Row>
                            <Col md="12" className="px-3">
                                {displayMetars()}
                                <br/>
                            </Col>
                        </Row>

                        {isIFR()?instrument_local_iap(): ""}

                        {isDepartureIFR() &&
                        <Form.Group as={Row} controlId="isInstrumentCurrent">
                            <Form.Label column md="4">Are you instrument Proficient and Current?</Form.Label>
                            <Form.Control as="select" column md="8" className="studentInfo" name="student_level"
                                          onChange={e => setIsInstrumentCurrent(e.target.value)}
                                          value={isInstrumentCurrent}>
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
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

                        {!isLocal() &&
                        <CrossCountryQuestions
                            flightRules={props.requestData.flightRules}
                            setEnrouteCeiling={setEnrouteCeiling}
                            setEnrouteVis={setEnrouteVis}
                            setThunderstorm={setThunderstorm}
                            setFuelAtAlt={setFuelAtAlt}
                            vfrCheckpoints={vfrCheckpoints}
                            setVFRCheckpoints={setVFRCheckpoints}
                            setTimeEnroute={setTimeEnroute}
                            destinationIAP={destinationIAP}
                            setDestinationIAP={setDestinationIAP}
                            alternateIAP={alternateIAP}
                            setAlternateIAP={setAlternateIAP}
                            setDestinationCrosswind={setDestinationCrosswind}
                            setAlternateCrosswind={setAlternateCrosswind}
                        />}
                        <Button className="dash-btn" onClick={() => setShowResults(true)}>
                            Submit
                        </Button>
                    </Form>

                </Container>
            </>
        );
    } else {
        const data = generate_risk_info();
        return (<ResultPage requestData={data} flightRules={props.flightRules}
                            isLocal={isLocal} isDual={props.requestData.isDualFlight}/>)
    }
}


export default DynamicFormInput;
