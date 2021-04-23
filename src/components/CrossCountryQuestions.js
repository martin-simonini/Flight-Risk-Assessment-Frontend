import React, {useEffect, useState} from 'react';
import {Button, Card, Row, Col, Form, Jumbotron, Container, useAccordionToggle} from 'react-bootstrap';
import {Range, getTrackBackground} from "react-range";
import RangeSelect from "./dynamic_subcomponents/RangeSelect";

function CrossCountryQuestions({
                                   flightRules,
                                   setEnrouteCeiling,
                                   setEnrouteVis,
                                   setThunderstorm,
                                   setFuelAtAlt,
                                   vfrCheckpoints,
                                   setVFRCheckpoints,
                                   setTimeEnroute}) {

    function ifr_questions() {
        return (
            <Row>
                <Col md="12">
                    <Form.Label className="px-3 overflow-auto">Thunderstorm Probability Percentage: </Form.Label>
                    <div className="overflow-auto">
                        <RangeSelect min={0} max={30} step={1} setFinal={setThunderstorm}/>
                    </div>
                </Col>
            </Row>
        )
    }

    function vfr_questions(){
        return (
            <Form.Row>
                <Form.Group as={Col} controlId="missionSelect">
                    <Form.Label>Number of VFR Checkpoints</Form.Label>
                    <Form.Control
                        as="select"
                        name="vfr_checkpoint_select"
                        onChange={e => setVFRCheckpoints(e.target.value)}
                        value={vfrCheckpoints}
                    >
                        <option value="Multiple">Multiple VFR Checkpoints</option>
                        <option value="Moderate">Moderate VFR Checkpoints</option>
                        <option value="Few to None">Few to None VFR Checkpoints</option>
                    </Form.Control>
                </Form.Group>
            </Form.Row>
        );
    }
//<Form.Label>Average Enroute Ceiling: </Form.Label>
    return (
        <>
        <Row>
                <Col md="12">
                    <Form.Label className="px-3 overflow-auto">Average Enroute Ceilings: </Form.Label>
                    <div className="overflow-auto">
                        <RangeSelect min={0} max={2000} step={100} setFinal={setEnrouteCeiling}/>
                    </div>
                </Col>
            </Row>

            <Row>
                <Col md="12">
                    <Form.Label className="px-3 overflow-auto">Average Enroute Visibility: </Form.Label>
                    <div className="overflow-auto">
                        <RangeSelect min={0} max={10} step={1} setFinal={setEnrouteVis}/>
                    </div>
                </Col>
            </Row>

            <Row>
                <Col md="12">
                    <Form.Label className="px-3 overflow-auto">Time Enroute</Form.Label>
                    <div className="overflow-auto">
                        <RangeSelect min={0} max={120} step={10} setFinal={setTimeEnroute}/>
                    </div>
                </Col>
            </Row>

            <Row>
                <Col md="12">
                    <Form.Label className="px-3 overflow-auto">Fuel At Alternative (minutes): </Form.Label>
                    <div className="overflow-auto">
                        <RangeSelect min={0} max={90} step={5} setFinal={setFuelAtAlt}/>
                    </div>
                </Col>
            </Row>

            {flightRules === "IFR"? ifr_questions() : vfr_questions()}
        </>
    )
}

export default CrossCountryQuestions;