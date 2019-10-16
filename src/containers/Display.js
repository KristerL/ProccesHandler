import React, {useEffect, useState} from "react";

const Display = ({process, algorithm}) => {
    const [length, setLength] = useState(null);
    const [arrivalTimes, setArrivalTimes] = useState(null);
    const [waitTimesState, setWaitTimesState] = useState(null);
    const [average, setAverage] = useState(null);

    useEffect(() => {
        console.log(process);
        const pairs = process.split(";");
        const arrivalTimes = pairs.map(pair => parseFloat(pair.split(",")[0]));
        const waitTimes = pairs.map(pair => parseFloat(pair.split(",")[1]));

        setLength(pairs.length);
        setArrivalTimes(arrivalTimes);
        console.log("useEffect", arrivalTimes);
        SJF(arrivalTimes, waitTimes);
        //waitTimes.unshift(arrivalTimes[0]);
    }, [process]);

    const randomColor = () => '#' + (0x1000000 + (Math.random()) * 0xffffff).toString(16).substr(1, 6);

    const FCFS = (arrivalTimes, waitTimes) => {
        let totalTime = 0;
        let waitTime = 0;
        for (let i = 0; i < arrivalTimes.length; i++) {
            if (i === 0) {
                totalTime += parseFloat(waitTimes[i]) + parseFloat(arrivalTimes[i]);
            } else {
                if (arrivalTimes[i] < totalTime) {
                    waitTime += totalTime - arrivalTimes[i];
                    totalTime += waitTimes[i];
                } else {
                    totalTime += waitTimes[i];
                }
            }
        }
        setAverage((waitTime / length - 1) + 1);
    };

    const SJF = async (arrivalTimes, waitTimes) => {
        let arrives = [...arrivalTimes];

        let i = 0;
        let executionOrder = [];
        let isRunning = false;
        let workingTime = 0;
        let workingName = "";
        let shortest = {};
        let path = [];
        let currentWorkTime = 0;
        let waitTime = 0;
        while (true) {
            shortest = {};
            if (arrives.length === 0 && executionOrder.length === 0 && !isRunning) {
                break;
            }

            if (arrivalTimes.includes(i)) {
                executionOrder.push({
                    name: "P" + arrivalTimes.findIndex(el => el === i),
                    waitTime: waitTimes[arrivalTimes.findIndex(el => el === i)]
                });
                arrives.shift();
            }

            if (executionOrder.length > 0) {
                shortest = executionOrder.reduce((res, object) => object.waitTime < res.waitTime ? object : res);
                executionOrder = executionOrder.filter(el => el.name !== shortest.name);
                waitTime += executionOrder.length;
            }

            if (!(Object.entries(shortest).length === 0 && shortest.constructor === Object)) {
                if (!isRunning) {
                    if (workingName === "PAUS") {
                        currentWorkTime--;
                        if (currentWorkTime > 0) {
                            path.push({name: workingName, workingTime: currentWorkTime});
                        }
                    } else {
                        path.push({name: workingName, workingTime: currentWorkTime});
                    }

                    currentWorkTime = 0;
                    isRunning = true;
                    workingTime = shortest.waitTime;
                    workingName = shortest.name;
                } else {
                    if (workingTime > shortest.waitTime) {
                        path.push({name: workingName, workingTime: currentWorkTime});
                        currentWorkTime = 0;
                        executionOrder.push({name: workingName, waitTime: workingTime});
                        workingTime = shortest.waitTime;
                        workingName = shortest.name;
                    } else {
                        executionOrder.push(shortest);
                        waitTime++;
                    }
                }
            }

            workingTime--;
            if (workingTime === 0) {
                currentWorkTime++;
                isRunning = false;
                path.push({name: workingName, workingTime: currentWorkTime});
                currentWorkTime = 0;
                workingName = "PAUS";
            }
            currentWorkTime++;
            i++;
        }
        setWaitTimesState(path);
    };

    return (
        <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
            <h1>{average}</h1>
            <div style={{width: "800px", height: "100px", display: "flex", justifyContent: "center"}}>
                {waitTimesState ? Object.keys(waitTimesState).map(waitTimeObject => {
                    console.log("loop", waitTimeObject);
                    return <div
                        style={{
                            height: "100px",
                            width: waitTimesState[waitTimeObject].workingTime / Object.keys(waitTimesState).length * 800,
                            backgroundColor: randomColor()
                        }}>{waitTimesState[waitTimeObject].name}</div>
                }) : null}
            </div>
        </div>
    )
};

export default Display;