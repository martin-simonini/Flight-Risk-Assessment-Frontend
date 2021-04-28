import React, {useEffect, useState} from 'react';
import axios from "axios";
import {Col, Container, Jumbotron, Row} from "react-bootstrap";
import './../stylesheets/RiskAssessmentForm.css';

function ResultPage(props) {
    const [results, setResults] = useState(null);

    useEffect(() => {
        console.log("Results request Data: ")
        console.log(props.requestData)
        const url = props.requestData.flightRules === "IFR" ? "/IFRRiskCalculation" : "/VFRRiskCalculation";
        console.log("URL: " + url);
        axios({
            method: 'post',
            url: url,
            headers: {
                accept: "application/json",
                "Content-Type": "application/json"
            },
            data: props.requestData
        }).then(response => {
            console.log(response.data);
            setResults(response.data);
        })
    }, []);

    function getResult() {
        console.log("Results request Data: ")
        console.log(props.requestData)
        const url = props.isDepartureIFR ? "/IFRRiskCalculation" : "/VFRRiskCalculation";
        axios({
            method: 'post',
            url: url,
            data: props.requestData
        }).then(response => {
            console.log(response.data);
        })
    }

    function isIFR() {
        return props.flightRules === "IFR";
    }

    function getRisk(risk) {
        if (risk === 0)
            return "Low";
        else if (risk === 1)
            return "Medium"
        else if (risk == 3)
            return "High"
        else
            return "No-go"
    }

    function setSpan(risk) {
        if (risk === 0)
            return "results-span-low";
        else if (risk === 1)
            return "results-span-med"
        else if (risk == 3)
            return "results-span-high"
        else
            return "results-span-no-go"

    }

    function calculateDepartureRisk(isIFR) {
        console.log("In Dparture risk");
        console.log(results);
        if (results === null)
            return 0;
        let sum = results.departure_ceiling_risk + results.departure_vis_risk + results.departure_wind_risk + results.departure_gust_risk + results.departure_crosswind_risk;
        if (isIFR) {
            sum += results.departure_iap_risk;
        }
        return sum;
    }

    function calculateEnrouteRisk(isIFR) {
        if (results === null)
            return 0;
        let sum = results.enroute_ceiling_risk + results.enroute_vis_risk + results.time_enroute_risk + results.fuel_at_alternate_risk;
        if (isIFR) {
            sum += results.thunderstorm_risk;
        } else {
            sum += results.vfr_checkpoint_risk;
        }
        return sum;
    }

    function calculateDestinationRisk(isIFR) {
        if (results === null)
            return 0;
        let sum = results.destination_ceiling_risk + results.destination_vis_risk + results.destination_wind_risk + results.destination_gust_risk + results.destination_crosswind_risk;
        if (isIFR) {
            sum += results.destination_iap_risk;
        }
        return sum;
    }

    function calculateAlternateRisk(isIFR) {
        if (results === null)
            return 0;
        let sum = results.alternate_ceiling_risk + results.alternate_vis_risk + results.alternate_wind_risk + results.alternate_gust_risk + results.alternate_crosswind_risk;
        if (isIFR) {
            sum += results.alternate_iap_risk;
        }
        return sum;
    }

    function calculateHFRisk() {
        if (results === null)
            return 0;
        return results.time_of_flight_risk + results.flight_duty_risk + results.previous_flight_risk + results.type_of_flight_risk + results.temperature_risk;

    }

    function calculateSoloRisk() {
        if (results === null)
            return 0;
        return results.flight_location_risk + results.ground_ref_maneuver_risk + results.experience_in_airplane_risk + results.dual_landing_risk + results.dual_stall_risk;
    }

    function setCategoryRisk(risk) {
        if (risk < 12)
            return "category-risk-low";
        else if (risk < 15)
            return "category-risk-med";
        else
            return "category-risk-high"
    }

    function setDepartureTitle() {
        if (props.typeofFlight === "pattern") {
            return "Local Pattern "
        }

        return "Departure";
    }


    if(results !== null) {
        return (
            <>
                <Row>
                    <Col>
                        <Jumbotron fluid className="jumbo">
                            <h1 className="text-center mb-3 ">Risk Assessment Result</h1>
                        </Jumbotron>
                    </Col>
                </Row>

                <Container className="dynamicContainer">
                    <Row>
                        <Col md="12">
                            <h3 className={"text-center category-risk " + setCategoryRisk(calculateDepartureRisk(isIFR()))}>{setDepartureTitle()} risk
                                - {calculateDepartureRisk(isIFR())}</h3>
                            <hr/>
                            <br/>
                        </Col>
                    </Row>

                    <Row>
                        <Col sm="4" className="mx-3 pb-2">
                            <br/>
                            <span className="results-span">Ceiling Risk:</span>
                        </Col>
                        <Col sm="8" className="text-center">
                            <span
                                className={setSpan(results.departure_ceiling_risk)}>{getRisk(results.departure_ceiling_risk)} (score: {results.departure_ceiling_risk})</span>
                        </Col>
                    </Row>

                    <Row>
                        <Col sm="4" className="mx-3 pb-2">
                            <br/>
                            <span className="results-span">Visibility Risk:</span>
                        </Col>
                        <Col sm="8" className="text-center">
                            <span
                                className={setSpan(results.departure_vis_risk)}>{getRisk(results.departure_vis_risk)} (score: {results.departure_vis_risk})</span>
                        </Col>
                    </Row>

                    {props.flightRules === "IFR" &&
                    <Row>
                        <Col sm="4" className="mx-3 pb-2">
                            <br/>
                            <span className="results-span">IAP Risk:</span>
                        </Col>
                        <Col sm="8" className="text-center">
                            <span
                                className={setSpan(results.departure_iap_risk)}>{getRisk(results.departure_iap_risk)} (score: {results.departure_iap_risk})</span>
                        </Col>
                    </Row>
                    }

                    <Row>
                        <Col sm="4" className="mx-3 pb-2">
                            <br/>
                            <span className="results-span">Total Wind Risk</span>
                        </Col>
                        <Col sm="8" className="text-center">
                            <span
                                className={setSpan(results.departure_wind_risk)}>{getRisk(results.departure_wind_risk)} (score: {results.departure_wind_risk})</span>
                        </Col>
                    </Row>

                    <Row>
                        <Col sm="4" className="mx-3 pb-2">
                            <br/>

                            <span className="results-span">Gust Risk:</span>
                        </Col>
                        <Col sm="8" className="text-center">
                                <span
                                    className={setSpan(results.departure_gust_risk)}>{getRisk(results.departure_gust_risk)} (score: {results.departure_gust_risk})</span>

                        </Col>
                    </Row>

                    <Row>
                        <Col sm="4" className="mx-3 pb-2">
                            <br/>
                            <span className="results-span">Crosswind Risk:</span>
                        </Col>
                        <Col sm="8" className="text-center">
                            <span
                                className={setSpan(results.departure_crosswind_risk)}>{getRisk(results.departure_crosswind_risk)} (score: {results.departure_crosswind_risk})</span>
                        </Col>
                    </Row>

                    {/*Enroute Risk-----------------------------------------------*/}
                    {!props.isLocal() &&
                    <>
                        <Row>
                            <Col md="12">
                                <h3 className={"text-center category-risk " + setCategoryRisk(calculateEnrouteRisk(isIFR()))}>Enroute
                                    Risk
                                    - {calculateEnrouteRisk(isIFR())}</h3>
                                <hr/>
                                <br/>
                            </Col>
                        </Row>

                        <Row>
                            <Col sm="4" className="mx-3 pb-2">
                                <br/>
                                <span className="results-span"> Ceiling Risk:</span>
                            </Col>
                            <Col sm="8" className="text-center">
                    <span
                        className={setSpan(results.enroute_ceiling_risk)}>{getRisk(results.enroute_ceiling_risk)} (score: {results.enroute_ceiling_risk})</span>
                            </Col>


                        </Row>

                        <Row>
                            <Col sm="4" className="mx-3 pb-2">
                                <br/>
                                <span className="results-span"> Visibility Risk:</span>
                            </Col>
                            <Col sm="8" className="text-center">
                    <span
                        className={setSpan(results.enroute_vis_risk)}>{getRisk(results.enroute_vis_risk)} (score: {results.enroute_vis_risk})</span>
                            </Col>
                        </Row>

                        {props.flightRules === "IFR" &&
                        <Row>
                            <Col sm="4" className="mx-3 pb-2">
                                <br/>
                                <span className="results-span"> Thunderstorm Risk:</span>
                            </Col>
                            <Col sm="8" className="text-center">
                    <span
                        className={setSpan(results.thunderstorm_risk)}>{getRisk(results.thunderstorm_risk)} (score: {results.thunderstorm_risk})</span>
                            </Col>
                        </Row>}

                        <Row>
                            <Col sm="4" className="mx-3 pb-2">
                                <br/>
                                <span className="results-span">Time Enroute Risk</span>
                            </Col>
                            <Col sm="8" className="text-center">
                    <span
                        className={setSpan(results.time_enroute_risk)}>{getRisk(results.time_enroute_risk)} (score: {results.time_enroute_risk})</span>
                            </Col>
                        </Row>

                        <Row>
                            <Col sm="4" className="mx-3 pb-2">
                                <br/>

                                <span className="results-span"> Fuel At Alternate Risk:</span>
                            </Col>
                            <Col sm="8" className="text-center">
                    <span
                        className={setSpan(results.fuel_at_alternate_risk)}>{getRisk(results.fuel_at_alternate_risk)} (score: {results.fuel_at_alternate_risk})</span>

                            </Col>
                        </Row>
                    </>
                    }

                    {/*Destination Risk ----------------------------------------------------*/}
                    {!props.isLocal() &&
                    <>
                        <Row>
                            <Col md="12">
                                <h3 className={"text-center category-risk " + setCategoryRisk(calculateDestinationRisk(isIFR()))}>Destination
                                    Risk
                                    - {calculateDestinationRisk(isIFR())}</h3>
                                <hr/>
                                <br/>
                            </Col>
                        </Row>

                        <Row>
                            <Col sm="4" className="mx-3 pb-2">
                                <br/>
                                <span className="results-span">Ceiling Risk:</span>
                            </Col>
                            <Col sm="8" className="text-center">
                    <span
                        className={setSpan(results.destination_ceiling_risk)}>{getRisk(results.destination_ceiling_risk)} (score: {results.destination_ceiling_risk})</span>
                            </Col>


                        </Row>

                        <Row>
                            <Col sm="4" className="mx-3 pb-2">
                                <br/>
                                <span className="results-span"> Visibility Risk:</span>
                            </Col>
                            <Col sm="8" className="text-center">
                    <span
                        className={setSpan(results.destination_vis_risk)}>{getRisk(results.destination_vis_risk)} (score: {results.destination_vis_risk})</span>
                            </Col>
                        </Row>

                        {props.flightRules === "IFR" &&
                        <Row>
                            <Col sm="4" className="mx-3 pb-2">
                                <br/>
                                <span className="results-span">IAP Risk:</span>
                            </Col>
                            <Col sm="8" className="text-center">
                    <span
                        className={setSpan(results.destination_iap_risk)}>{getRisk(results.destination_iap_risk)} (score: {results.destination_iap_risk})</span>
                            </Col>
                        </Row>}

                        <Row>
                            <Col sm="4" className="mx-3 pb-2">
                                <br/>
                                <span className="results-span">Total Wind Risk</span>
                            </Col>
                            <Col sm="8" className="text-center">
                    <span
                        className={setSpan(results.destination_wind_risk)}>{getRisk(results.destination_wind_risk)} (score: {results.destination_wind_risk})</span>
                            </Col>
                        </Row>

                        <Row>
                            <Col sm="4" className="mx-3 pb-2">
                                <br/>

                                <span className="results-span">Gust Risk:</span>
                            </Col>
                            <Col sm="8" className="text-center">
                    <span
                        className={setSpan(results.destination_gust_risk)}>{getRisk(results.destination_gust_risk)} (score: {results.destination_gust_risk})</span>

                            </Col>
                        </Row>

                        <Row>
                            <Col sm="4" className="mx-3 pb-2">
                                <br/>
                                <span className="results-span">Crosswind Risk:</span>
                            </Col>
                            <Col sm="8" className="text-center">
                    <span
                        className={setSpan(results.destination_crosswind_risk)}>{getRisk(results.destination_crosswind_risk)} (score: {results.destination_crosswind_risk})</span>
                            </Col>
                        </Row>
                    </>
                    }


                    {/*Alternate Risk ---------------------------------------------------------------*/}
                    {!props.isLocal() &&
                    <>
                        <Row>
                            <Col md="12">
                                <h3 className={"text-center category-risk " + setCategoryRisk(calculateAlternateRisk(isIFR()))}>Alternate
                                    Risk
                                    - {calculateAlternateRisk(isIFR())}</h3>
                                <hr/>
                                <br/>
                            </Col>
                        </Row>

                        <Row>
                            <Col sm="4" className="mx-3 pb-2">
                                <br/>
                                <span className="results-span">Ceiling Risk:</span>
                            </Col>
                            <Col sm="8" className="text-center">
                    <span
                        className={setSpan(results.alternate_ceiling_risk)}>{getRisk(results.alternate_ceiling_risk)} (score: {results.alternate_ceiling_risk})</span>
                            </Col>


                        </Row>

                        <Row>
                            <Col sm="4" className="mx-3 pb-2">
                                <br/>
                                <span className="results-span"> Visibility Risk:</span>
                            </Col>
                            <Col sm="8" className="text-center">
                    <span
                        className={setSpan(results.alternate_vis_risk)}>{getRisk(results.alternate_vis_risk)} (score: {results.alternate_vis_risk})</span>
                            </Col>
                        </Row>

                        {props.flightRules === "IFR" &&
                        <Row>
                            <Col sm="4" className="mx-3 pb-2">
                                <br/>
                                <span className="results-span">IAP Risk:</span>
                            </Col>
                            <Col sm="8" className="text-center">
                    <span
                        className={setSpan(results.alternate_iap_risk)}>{getRisk(results.alternate_iap_risk)} (score: {results.alternate_iap_risk})</span>
                            </Col>
                        </Row>}

                        <Row>
                            <Col sm="4" className="mx-3 pb-2">
                                <br/>
                                <span className="results-span">Total Wind Risk</span>
                            </Col>
                            <Col sm="8" className="text-center">
                    <span
                        className={setSpan(results.alternate_wind_risk)}>{getRisk(results.alternate_wind_risk)} (score: {results.alternate_wind_risk})</span>
                            </Col>
                        </Row>

                        <Row>
                            <Col sm="4" className="mx-3 pb-2">
                                <br/>

                                <span className="results-span">Gust Risk:</span>
                            </Col>
                            <Col sm="8" className="text-center">
                    <span
                        className={setSpan(results.alternate_gust_risk)}>{getRisk(results.alternate_gust_risk)} (score: {results.alternate_gust_risk})</span>

                            </Col>
                        </Row>

                        <Row>
                            <Col sm="4" className="mx-3 pb-2">
                                <br/>
                                <span className="results-span">Crosswind Risk:</span>
                            </Col>
                            <Col sm="8" className="text-center">
                    <span
                        className={setSpan(results.alternate_crosswind_risk)}>{getRisk(results.alternate_crosswind_risk)} (score: {results.alternate_crosswind_risk})</span>
                            </Col>
                        </Row>
                    </>
                    }


                    {/* Human Factor Risk ------------------------------*/}
                    <Row>
                        <Col md="12">
                            <h3 className={"text-center category-risk " + setCategoryRisk(calculateHFRisk())}>Human
                                Factor Risk
                                - {calculateHFRisk()}</h3>
                            <hr/>
                            <br/>
                        </Col>
                    </Row>

                    <Row>
                        <Col sm="4" className="mx-3 pb-2">
                            <br/>
                            <span className="results-span">Time of Flight Risk:</span>
                        </Col>
                        <Col sm="8" className="text-center">
                            <span
                                className={setSpan(results.time_of_flight_risk)}>{getRisk(results.time_of_flight_risk)} (score: {results.time_of_flight_risk})</span>
                        </Col>


                    </Row>

                    <Row>
                        <Col sm="4" className="mx-3 pb-2">
                            <br/>
                            <span className="results-span">Flight Duty Risk:</span>
                        </Col>
                        <Col sm="8" className="text-center">
                            <span
                                className={setSpan(results.flight_duty_risk)}>{getRisk(results.flight_duty_risk)} (score: {results.flight_duty_risk})</span>
                        </Col>
                    </Row>

                    <Row>
                        <Col sm="4" className="mx-3 pb-2">
                            <br/>
                            <span className="results-span">Previous Flight Risk:</span>
                        </Col>
                        <Col sm="8" className="text-center">
                            <span
                                className={setSpan(results.previous_flight_risk)}>{getRisk(results.previous_flight_risk)} (score: {results.previous_flight_risk})</span>
                        </Col>
                    </Row>

                    <Row>
                        <Col sm="4" className="mx-3 pb-2">
                            <br/>
                            <span className="results-span">Syllabus Flight Type Risk:</span>
                        </Col>
                        <Col sm="8" className="text-center">
                            <span
                                className={setSpan(results.type_of_flight_risk)}>{getRisk(results.type_of_flight_risk)} (score: {results.type_of_flight_risk})</span>
                        </Col>
                    </Row>

                    <Row>
                        <Col sm="4" className="mx-3 pb-2">
                            <br/>

                            <span className="results-span">Temperature Risk:</span>
                        </Col>
                        <Col sm="8" className="text-center">
                                <span
                                    className={setSpan(results.temperature_risk)}>{getRisk(results.temperature_risk)} (score: {results.temperature_risk})</span>

                        </Col>
                    </Row>

                    {!props.isDual&&
                        <>
                            <Row>
                                <Col md="12">
                                    <h3 className={"text-center category-risk " + setCategoryRisk(calculateSoloRisk())}>Solo
                                        Risk
                                        - {calculateSoloRisk()}</h3>
                                    <hr/>
                                    <br/>
                                </Col>
                            </Row>

                            <Row>
                                <Col sm="4" className="mx-3 pb-2">
                                    <br/>

                                    <span className="results-span">Flight Location:</span>
                                </Col>
                                <Col sm="8" className="text-center">
                                <span
                                    className={setSpan(results.flight_location_risk)}>{getRisk(results.flight_location_risk)} (score: {results.flight_location_risk})</span>

                                </Col>
                            </Row>

                            <Row>
                                <Col sm="4" className="mx-3 pb-2">
                                    <br/>

                                    <span className="results-span">Ground Reference Maneuver Risk:</span>
                                </Col>
                                <Col sm="8" className="text-center">
                                <span
                                    className={setSpan(results.ground_ref_maneuver_risk)}>{getRisk(results.ground_ref_maneuver_risk)} (score: {results.ground_ref_maneuver_risk})</span>

                                </Col>
                            </Row>

                            <Row>
                                <Col sm="4" className="mx-3 pb-2">
                                    <br/>

                                    <span className="results-span">Experience In Airplane Risk:</span>
                                </Col>
                                <Col sm="8" className="text-center">
                                <span
                                    className={setSpan(results.ground_ref_maneuver_risk)}>{getRisk(results.ground_ref_maneuver_risk)} (score: {results.ground_ref_maneuver_risk})</span>
                                </Col>
                            </Row>

                            <Row>
                                <Col sm="4" className="mx-3 pb-2">
                                    <br/>

                                    <span className="results-span">Last Dual Landing Risk:</span>
                                </Col>
                                <Col sm="8" className="text-center">
                                <span
                                    className={setSpan(results.dual_stall_risk)}>{getRisk(results.dual_stall_risk)} (score: {results.dual_stall_risk})</span>
                                </Col>
                            </Row>

                            <Row>
                                <Col sm="4" className="mx-3 pb-2">
                                    <br/>

                                    <span className="results-span">Last Dual Landing Risk:</span>
                                </Col>
                                <Col sm="8" className="text-center">
                                <span
                                    className={setSpan(results.dual_landing_risk)}>{getRisk(results.dual_landing_risk)} (score: {results.dual_landing_risk})</span>
                                </Col>
                            </Row>
                        </>
                    }

                </Container>
            </>
        );
    }
    else{
        return (<h1>Loading...</h1>);
    }
}

export default ResultPage;


