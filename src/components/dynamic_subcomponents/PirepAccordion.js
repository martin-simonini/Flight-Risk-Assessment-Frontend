import {React, useEffect, useState} from "react";

import '../../stylesheets/accordion.css';
import {Accordion, Card} from "react-bootstrap";
import {BiPlus} from "react-icons/all";

function PirepAccordion({pirep, index})
{
    const [icing, setIcing] = useState("");
    const [turbulence, setTurbulence] = useState("");

    /* Set Icing field */
    useEffect(() =>{
        if(pirep.icing != null)
        {
            if (pirep.icing.base != pirep.icing.top) {
                setIcing(pirep.icing.type + " " + pirep.icing.intensity + " " + "bases at " + pirep.icing.base + " ft tops at " + pirep.icing.top + " ft.");
            } else
                setIcing((pirep.icing.type===null?"":pirep.icing.type)+" "+(pirep.icing.intensity===null?"":pirep.icing.intensity));
        }

        if(pirep.turbulence != null)
        {
            if (pirep.turbulence.base != pirep.turbulence.top)
                setTurbulence(pirep.turbulence.frequency + " " + pirep.turbulence.intensity + " bases at " + pirep.turbulence.base + " ft, tops at " + pirep.turbulence.top + " ft.");
            else
                setTurbulence(pirep.turbulence.frequency + " " + pirep.turbulence.intensity);
        }

        if(pirep.skyCoverage != null)
        {

        }

    }, []);

    return (
            <Card key={index.toString()} className="airsigmet-card">
                <Accordion.Toggle as={Card.Header} eventKey={index+1} className="airsigmet-card-header">
                    <div className="center-block">Pirep from {pirep.time}</div> <BiPlus />
                </Accordion.Toggle>
                <Accordion.Collapse eventKey={index+1}>
                    <Card.Body className="airsigmet-card-body">
                        <div className="pirep-raw-text">{pirep.raw_text}</div>
                        <div className="airsigmet-card-text"> <u>Aircraft Type</u>:  {pirep.aircraftType}</div>
                        <div className="airsigmet-card-text"> <u>Altitude</u>: {pirep.altitude} </div>
                        <div className="airsigmet-card-text"> <u>Temperature</u>: {pirep.temperature} </div>
                        <div className="airsigmet-card-text"> <u>Icing</u>: {icing}</div>
                        <div className="airsigmet-card-text"> <u>Turbulence</u>: {turbulence}</div>
                    </Card.Body>
                </Accordion.Collapse>
            </Card>
    );
}

export default PirepAccordion;
