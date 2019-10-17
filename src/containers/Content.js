import React, {useState} from "react"
import DataController from "./DataController";
import ButtonController from "./ButtonController";
import styled from "styled-components";
import Display from "./Display";

const ControllerContainer = styled.div`
    display:flex;
    justify-content:space-evenly
`;

const algorithms = ["FCFS", "FCFS2", "SJF", "RR"];
const processes = {
    Esimene: "0,5;6,9;7,5;15,10",
    Teine: "0,2;1,4;12,4;15,5;21,10",
    Kolmas: "5,6;6,4;11,3;12,7",
    Neljas: "1,10;3,3;4,1;8,6;15,2",
    Viies: "1,8;3,5;4,3;12,1;19,1",
    Kuues: "0,24;4,3;7,3",
    Seitsmes: "0,7;2,4;4,1;5,4",
};

const Container = () => {

    const [algorithm, setAlgorithm] = useState("FCFS");
    const [process, setProcess] = useState("0,5;6,9;7,5;15,10");

    const alghorithmChangeHandler = (algorithm) => {
        setAlgorithm(algorithm)
    };

    const processChangeHandler = (process) => {
        setProcess(process);
    };

    const resetFields = () => {
        console.log("reset");
        setAlgorithm("FCFS");
        setProcess("0,5;6,9;7,5;15,10");
    };
    return (
        <div>
            <h1>Graafilise kasutajaliidesega simulaator protsessoriaja planeerimise algoritmide töö
                visualiseerimiseks</h1>
            <ControllerContainer>
                <DataController processes={processes} processHandler={processChangeHandler} selected={process}/>
                <ButtonController algorithms={algorithms} algorithmHandler={alghorithmChangeHandler}
                                  reset={resetFields}/>
            </ControllerContainer>
            <Display process={process} algorithm={algorithm}/>
        </div>
    )
};

export default Container;