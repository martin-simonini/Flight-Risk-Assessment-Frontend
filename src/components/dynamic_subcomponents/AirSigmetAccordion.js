
import {React} from "react";

import '../../stylesheets/accordion.css';
import {Accordion, Card} from "react-bootstrap";
import {BiPlus} from "react-icons/all";

function AirSigmetAccordion({airSigmet, index})
{
    return (
            <Card key={index.toString()} className="airsigmet-card">
                <Accordion.Toggle as={Card.Header} eventKey={index+1} className="airsigmet-card-header">
                    <div className="center-block">{airSigmet.type}</div> <BiPlus />
                </Accordion.Toggle>
                <Accordion.Collapse eventKey={index+1}>
                    <Card.Body className="airsigmet-card-body">
                        <div className="airsigmet-card-text"> <u>Start Time</u>:  {airSigmet.timeStart}</div>
                        <div className="airsigmet-card-text"> <u>End Time</u>: {airSigmet.timeEnd} </div>
                        <div className="airsigmet-card-text"> {airSigmet.rawText} </div>
                        {airSigmet.movementHeading > 0 || airSigmet.movementSpeed > 0 &&
                        <div className="airsigmet-card-text"> Movement Heading: {airSigmet.movementHeading} </div>&&
                        <div className="airsigmet-card-text"> Movement Speed: {airSigmet.movementSpeed} </div>
                        }
                    </Card.Body>
                </Accordion.Collapse>
            </Card>
    );
}

export default AirSigmetAccordion;
