import {getTrackBackground, Range} from "react-range";
import React from "react";

function RangeSelect({min,max,step, setFinal}) {
    const [values, setValues] = React.useState([max/2]);

    function handleChange(values){
        setValues(values);
        setFinal(values[0]);
    }
    return (
        <>
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                flexWrap: 'wrap',
                padding: '2em'
            }}
        >

            <Range
                values={values}
                step={step}
                min={min}
                max={max}
                onChange={(values) => handleChange(values)}
                onFinalChange={(values) => setFinal(values[0])}
                renderMark={({props, index}) => (
                    <div
                        {...props}
                        style={{
                            ...props.style,
                            height: '16px',
                            width: '5px',
                            backgroundColor: index * step < values[0] ? '#548BF4' : '#ccc'
                        }}
                    />
                )}
                renderTrack={({props, children}) => (
                    <div
                        onMouseDown={props.onMouseDown}
                        onTouchStart={props.onTouchStart}
                        style={{
                            ...props.style,
                            height: '36px',
                            display: 'flex',
                            width: '100%'
                        }}
                    >
                        <div
                            ref={props.ref}
                            style={{
                                height: '5px',
                                width: '100%',
                                borderRadius: '4px',
                                background: getTrackBackground({
                                    values: values,
                                    colors: ['#548BF4', '#ccc'],
                                    min: min,
                                    max: max
                                }),
                                alignSelf: 'center'
                            }}
                        >
                            {children}
                        </div>
                    </div>
                )}
                renderThumb={({props, isDragged}) => (
                    <div
                        {...props}
                        style={{
                            ...props.style,
                            height: '42px',
                            width: '42px',
                            borderRadius: '4px',
                            backgroundColor: '#FFF',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            boxShadow: '0px 2px 6px #AAA'
                        }}
                    >
                        <div
                            style={{
                                position: 'absolute',
                                top: '-28px',
                                color: '#fff',
                                fontWeight: 'bold',
                                fontSize: '14px',
                                fontFamily: 'Arial,Helvetica Neue,Helvetica,sans-serif',
                                padding: '4px',
                                borderRadius: '4px',
                                backgroundColor: '#548BF4'
                            }}
                        >
                            {values[0]===max? values[0]+"+":values[0].toFixed(0)}
                        </div>
                        <div
                            style={{
                                height: '16px',
                                width: '5px',
                                backgroundColor: isDragged ? '#548BF4' : '#CCC'
                            }}
                        />
                    </div>
                )}
            />
        </div>
    </>
    )
}

export default RangeSelect;