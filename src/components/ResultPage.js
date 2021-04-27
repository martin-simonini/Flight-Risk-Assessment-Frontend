import React, {useEffect, useState} from 'react';
import axios from "axios";
import AirSigmetAccordion from "./dynamic_subcomponents/AirSigmetAccordion";
import PirepAccordion from "./dynamic_subcomponents/PirepAccordion";

function ResultPage(props)
{
    const [requestData, setRequestData] = useState();

    useEffect(() => {
        console.log("Results request Data: ")
        console.log(props.requestData)
        const url = props.requestData.flightRules==="IFR"? "/VFRRiskCalculation":"/IFRRiskCalculation";
        console.log("URL: "+url);
        axios({
            method: 'post',
            url: url ,
            headers: {
                accept: "application/json",
                "Content-Type": "application/json"
            },
            data: props.requestData
        }).then(response => {
            console.log(response.data);
        })
    }, []);

    function getResult(){
        console.log("Results request Data: ")
        console.log(props.requestData)
        const url = props.isDepartureIFR? "/IFRRiskCalculation":"/VFRRiskCalculation";
        axios({
            method: 'post',
            url: url ,
            data: props.requestData
        }).then(response => {
            console.log(response.data);
        })
    }

    return(
        <>
            <h1>Hello World</h1>
            <button onClick={getResult}>Result</button>
        </>

    )

}
export default ResultPage;