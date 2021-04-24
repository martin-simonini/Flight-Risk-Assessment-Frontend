
import {React} from "react";

import '../stylesheets/accordion.css';
import {Accordion, Card} from "react-bootstrap";
import {BiPlus} from "react-icons/all";

function PirepAccordion({pirep, index})
{
    function displayIntensity(){
        if(pirep.icing.base === pirep.icing.top)
        {
            return (pirep.icing.type+" "+pirep.icing.intensity+" "+"bases at "+pirep.icing.base+" ft tops at "+pirep.icing.top+" ft.");
        }
        else
            return (pirep.icing.intensity);
    }
    return (
        <Accordion>
            <Card key={index.toString()} className="airsigmet-card">
                <Accordion.Toggle as={Card.Header} eventKey={index+1} className="airsigmet-card-header">
                    <div className="center-block">Pirep from {pirep.time}</div> <BiPlus />
                </Accordion.Toggle>
                <Accordion.Collapse eventKey={index+1}>
                    <Card.Body className="airsigmet-card-body">
                        <div className="pirep-raw-text">{pirep.raw_text}</div>
                        <div className="airsigmet-card-text"> <u>Aircraft Type</u>:  {pirep.aircraftType}</div>
                        <div className="airsigmet-card-text"> <u>Altitude</u>: {pirep.altitude} </div>
                        <div className="airsigmet-card-text"> <u>Icing</u>: {displayIntensity}</div>
                    </Card.Body>
                </Accordion.Collapse>
            </Card>
        </Accordion>
    );
}

export default PirepAccordion;
