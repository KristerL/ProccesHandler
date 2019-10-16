import React, {useState} from "react"
import DataController from "./DataController";
import ButtonController from "./ButtonController";
import styled from "styled-components";
import Display from "./Display";

const ControllerContainer = styled.div`
    display:flex;
    justify-content:space-evenly
`;

const algorithms = ["FCFS", "SJF", "NJF", "RR2"];
const processes = {
    Esimene: "0,5;6,9;7,5;15,10",
    Teine: "0,2;1,4;12,4;15,5;21,10",
    Kolmas: "5,6;6,9;11,3;12,7",
    Neljas: "1,10;3,3;4,1;8,6;15,2",
    Viies: "1,8;3,5;4,3;12,1;19,1"
};

const Container = () => {

    const [algortihm, setAlgorithm] = useState("FCFS");
    const [process, setProcess] = useState("1,2;2,3");

    const alghorithmChangeHandler = (algorithm) => {
        setAlgorithm(algorithm)
    };

    const processChangeHandler = (process) => {
        setProcess(process);
    };

    return (
        <div>
            <h1>Graafilise kasutajaliidesega simulaator protsessoriaja planeerimise algoritmide töö
                visualiseerimiseks</h1>
            <ControllerContainer>
                <DataController processes={processes} processHandler={processChangeHandler}/>
                <ButtonController algorithms={algorithms} algorithmHandler={alghorithmChangeHandler}/>
            </ControllerContainer>
            <Display process={process} algorithm={algortihm}/>
        </div>
    )
};

export default Container;