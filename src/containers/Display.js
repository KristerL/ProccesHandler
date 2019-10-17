import React, {useEffect, useState} from "react";

const Display = ({process, algorithm}) => {
    const [average, setAverage] = useState(null);
    const [visualize, setVisualize] = useState(null);
    const [timeIndexes, setTimeIndexes] = useState(null);

    useEffect(() => {
        const pairs = process.split(";");
        const arrivalTimes = pairs.map(pair => parseFloat(pair.split(",")[0]));
        const waitTimes = pairs.map(pair => parseFloat(pair.split(",")[1]));
        if (algorithm === "FCFS") {
            FCFS(arrivalTimes, waitTimes);
        } else if (algorithm === "SJF") {
            SJF(arrivalTimes, waitTimes);
        } else if (algorithm === "FCFS2") {
            FCFS2(arrivalTimes, waitTimes);
        } else if (algorithm = "RR") {
            RR(arrivalTimes, waitTimes);
        }

        //waitTimes.unshift(arrivalTimes[0]);
    }, [process, algorithm]);


    const randomColor = () => '#' + (0x1000000 + (Math.random()) * 0xffffff).toString(16).substr(1, 6);

    const FCFS = (arrivalTimes, waitTimes) => {
        let arrives = [...arrivalTimes];

        let i = 0;
        let executionOrder = [];
        let isRunning = false;
        let workingTime = 0;
        let workingName = "";
        let path = [];
        let currentWorkTime = 0;
        let waitTime = 0;
        path.push({name: "PAUS", workingTime: arrivalTimes[0]});
        while (true) {
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
                waitTime += executionOrder.length;
                if (!isRunning) {
                    if (workingName === "PAUS") {
                        currentWorkTime--;
                        if (currentWorkTime > 0) {
                            path.push({name: workingName, workingTime: currentWorkTime});
                        }
                    }
                    let nextTask = executionOrder.shift();
                    workingTime = nextTask.waitTime;
                    workingName = nextTask.name;
                    currentWorkTime = 0;
                    isRunning = true;
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

        setVisualize(path);
        buildIndexes(path);
        setAverage(((waitTime / (arrivalTimes.length)) - 1).toFixed(2));
    };

    const SJF = (arrivalTimes, waitTimes) => {
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
                        waitTime++;
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
        setVisualize(path);
        buildIndexes(path);
        setAverage(waitTime / (arrivalTimes.length))
    };

    const RR = (arrivalTimes, waitTimes) => {
        let arrives = [...arrivalTimes];
        let i = 0;
        let executionOrder = [];
        let isRunning = false;
        let workingName = "PAUS";
        let workingTime = 0;
        let path = [];
        let currentWorkTime = -1;
        let waitTime = 0;
        const rr = 2;
        while (true) {
            console.log("Index", i, "Task", workingName, "Worked", currentWorkTime, "Left", workingTime, "running", isRunning, "Execorder", executionOrder);
            if (arrives.length === 0 && executionOrder.length === 0 && !isRunning) {
                break;
            }

            if (arrivalTimes.includes(i)) {
                executionOrder.unshift({
                    name: "P" + arrivalTimes.findIndex(el => el === i),
                    waitTime: waitTimes[arrivalTimes.findIndex(el => el === i)]
                });
                arrives.shift();
                console.log("added to exec", "P" + arrivalTimes.findIndex(el => el === i))
            }

            workingTime--;
            currentWorkTime++;
            if (workingTime === 0) {
                isRunning = false;
                path.push({name: workingName, workingTime: currentWorkTime});
                if (executionOrder.length > 0) {
                    console.log("previos task ended, adding new", executionOrder[0]);
                    let newTask = executionOrder.shift();
                    workingName = newTask.name;
                    workingTime = newTask.waitTime;
                    currentWorkTime = 0;
                    isRunning = true
                } else {
                    workingName = "PAUS";
                    currentWorkTime = 0;
                }

            }

            console.log("I", i, isRunning, currentWorkTime, executionOrder.length);
            if (isRunning && (currentWorkTime % rr === 0 && currentWorkTime !== 0) && executionOrder.length > 0) {
                let newTask = executionOrder.shift();
                path.push({name: workingName, workingTime: currentWorkTime});
                executionOrder.push({name: workingName, waitTime: workingTime});
                workingName = newTask.name;
                workingTime = newTask.waitTime;
                currentWorkTime = 0;
                isRunning = true
            }

            if (!isRunning) {
                if (executionOrder.length > 0) {
                    let newTask = executionOrder.shift();
                    path.push({name: workingName, workingTime: currentWorkTime});
                    workingName = newTask.name;
                    workingTime = newTask.waitTime;
                    currentWorkTime = 0;
                    isRunning = true
                }
            }
            i++;
        }

        console.log(path);
        setVisualize(path);
        buildIndexes(path);
        setAverage(waitTime / (arrivalTimes.length))
    };

    const FCFS2 = (arrivalTimes, waitTimes) => {
        let arrives = [...arrivalTimes];

        let i = 0;
        let highPriority = [];
        let lowPriority = [];
        let isRunning = false;
        let workingTime = 0;
        let workingName = "";
        let path = [];
        let currentWorkTime = 0;
        let waitTime = 0;
        let isHigh = false;
        path.push({name: "PAUS", workingTime: arrivalTimes[0]});
        while (true) {
            if (arrives.length === 0 && highPriority.length === 0 && !isRunning && lowPriority.length === 0) {
                break;
            }

            if (arrivalTimes.includes(i)) {
                let taskTime = waitTimes[arrivalTimes.findIndex(el => el === i)];
                if (taskTime <= 5) {
                    highPriority.push({
                        name: "P" + arrivalTimes.findIndex(el => el === i),
                        waitTime: waitTimes[arrivalTimes.findIndex(el => el === i)]
                    })
                } else {
                    lowPriority.push({
                        name: "P" + arrivalTimes.findIndex(el => el === i),
                        waitTime: waitTimes[arrivalTimes.findIndex(el => el === i)]
                    })
                }
                arrives.shift();
            }

            if (!isRunning) {
                let newTask;
                if (highPriority.length > 0) {
                    newTask = highPriority.shift();
                    isHigh = true;
                } else if (lowPriority.length > 0) {
                    newTask = lowPriority.shift();
                    isHigh = false;
                }

                if (newTask) {
                    if (!(workingName === "PAUS" && currentWorkTime === 1) && workingName !== "") {
                        path.push({name: workingName, workingTime: currentWorkTime});
                    }
                    workingTime = newTask.waitTime;
                    workingName = newTask.name;
                    currentWorkTime = 0;
                    isRunning = true;
                }
            } else {
                if (highPriority.length > 0 && !isHigh) {
                    path.push({name: workingName, workingTime: currentWorkTime});
                    lowPriority.push({
                        name: workingName,
                        waitTime: workingTime
                    });
                    let newTask = highPriority.shift();
                    workingTime = newTask.waitTime;
                    workingName = newTask.name;
                    currentWorkTime = 0;
                    isHigh = true;
                    isRunning = true;
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
        console.log(path);
        setVisualize(path);
        buildIndexes(path);
        setAverage(waitTime / (arrivalTimes.length))
    };

    const buildIndexes = (path) => {
        let indexes = [];
        let currentSum = 0;
        path.forEach(el => {
            currentSum += el.workingTime;
            indexes.push(currentSum);
        });
        console.log(indexes);
        setTimeIndexes(indexes);
    };

    return (
        <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
            <h1>{algorithm}: Keskmine ooteaeg: {average}</h1>
            <div style={{width: "800px", height: "100px", display: "flex", justifyContent: "center"}}>
                <div
                    style={{
                        position: "relative",
                        height: "100px",
                        width: "0",
                    }}><span style={{position: "absolute", zIndex: "1", top: "100px", left: "100%"}}>0</span></div>
                {visualize ? Object.keys(visualize).map((waitTimeObject, index) => {
                    return <div
                        style={{
                            position: "relative",
                            height: "100px",
                            width: visualize[waitTimeObject].workingTime / Object.keys(visualize).length * 800,
                            backgroundColor: randomColor()
                        }}>{visualize[waitTimeObject].name} {timeIndexes ? <span style={{
                        position: "absolute",
                        zIndex: "1",
                        top: "100px",
                        left: "100%"
                    }}>{timeIndexes[index]}</span> : null}</div>
                }) : null}
            </div>
        </div>
    )
};

export default Display;