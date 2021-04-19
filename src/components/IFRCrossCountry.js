import React, {useEffect, useState} from 'react';
import {Button, Card, Row, Col, Form, Jumbotron, Container, useAccordionToggle} from 'react-bootstrap';
import {Range, getTrackBackground} from "react-range";
import RangeSelect from "./dynamic_subcomponents/RangeSelect";

function IFRCrossCountry() {

    const [enrouteCeiling, setEnrouteCeiling] = useState(1000);
    const [enrouteVis, setEnrouteVis] = useState(4);
    const [thunderstorm, setThunderstorm] = useState(0);
    const [fuelAtAlt, setFuelAtAlt] = useState(90);


//<Form.Label>Average Enroute Ceiling: </Form.Label>
    return(
        <>
            <Row>
                <Col md="12">
                    <Form.Label className="px-3 overflow-auto">Average Enroute Ceilings: </Form.Label>
                    <div className="overflow-auto">
                        <RangeSelect min={0} max={2000} step={100} setFinal={setEnrouteCeiling} />
                    </div>
                </Col>
            </Row>

            <Row>
                <Col md="12">
                    <Form.Label className="px-3 overflow-auto">Average Enroute Visibility: </Form.Label>
                    <div className="overflow-auto">
                        <RangeSelect min={0} max={10} step={1} setFinal={setEnrouteVis} />
                    </div>
                </Col>
            </Row>

            <Row>
                <Col md="12">
                    <Form.Label className="px-3 overflow-auto">Fuel At Alternative (minutes): </Form.Label>
                    <div className="overflow-auto">
                        <RangeSelect min={0} max={90} step={5} setFinal={setFuelAtAlt} />
                    </div>
                </Col>
            </Row>

            <Row>
                <Col md="12">
                    <Form.Label className="px-3 overflow-auto">Thunderstorm Probability Percentage: </Form.Label>
                    <div className="overflow-auto">
                        <RangeSelect min={0} max={30} step={1} setFinal={setThunderstorm} />
                    </div>
                </Col>
            </Row>

        </>
    )
}

export default IFRCrossCountry;