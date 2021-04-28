import {Col, Form, Row} from "react-bootstrap";
import RangeSelect from "./RangeSelect";
import React from "react";


function HumanFactorQuestions({
                                  studentLevel,
                                  setTimeInAirplane,
                                  setLastDualLanding,
                                  setLastDualStall,
                                  groundReferenceManeuvers,
                                  setGroundReferenceManeuvers,
                                  typeOfFlight
                              }) {

    function commonQuestions() {
        return (
            <>
                <Form.Group as={Row}>
                    <Col md="12">
                        <Form.Label className="px-3 overflow-auto">Last Dual Landing (Days)</Form.Label>
                        <div className="overflow-auto">
                            <RangeSelect min={0} max={45} step={1} setFinal={setLastDualLanding}/>
                        </div>
                    </Col>
                </Form.Group>

                <Form.Group as={Row}>
                    <Col md="12">
                        <Form.Label className="px-3 overflow-auto">Last Dual Stall (Days)</Form.Label>
                        <div className="overflow-auto">
                            <RangeSelect min={0} max={45} step={1} setFinal={setLastDualStall}/>
                        </div>
                    </Col>
                </Form.Group>

                {typeOfFlight === "practice_area" &&
                <Form.Group as={Row}>
                    <Col md="12">
                        <Form.Label column md="4" className="px-3 overflow-auto">Number of Ground Reference Maneuvers
                            Doing?</Form.Label>
                        <div className="overflow-auto">
                            <Form.Control
                                as="select"
                                name="student_level"
                                onChange={e => setGroundReferenceManeuvers(e.target.value)}
                                value={groundReferenceManeuvers}
                                className="studentInfo"
                                column md="8"
                            >
                                <option value="none">None</option>
                                <option value="one">One</option>
                                <option value="two">2+</option>
                            </Form.Control>
                        </div>
                    </Col>
                </Form.Group>
                }
            </>

        )
    }

    /* I'm Assuming a student working on an advanced rating will have more than 15 hours time in type*/
    if (studentLevel !== "private")
        return commonQuestions();
    else {
        return (
            <>
                <Form.Group as={Row}>
                    <Col md="12">
                        <Form.Label className="px-3 overflow-auto">Time in Airplane Type</Form.Label>
                        <div className="overflow-auto">
                            <RangeSelect min={0} max={15} step={1} setFinal={setTimeInAirplane}/>
                        </div>
                    </Col>
                </Form.Group>
                {commonQuestions()}
            </>
        )
    }
}

export default HumanFactorQuestions;