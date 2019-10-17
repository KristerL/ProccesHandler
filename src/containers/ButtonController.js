import React from "react";
import styled from "styled-components";

const ButtonContainer = styled.div`
    display:flex;
    flex-direction: column;
    justify-content:space-evenly;
    align-items:center;
    height:95%;
    
    button{
        width:200px;
        background-color:white;
        height:50px;
    }
`;
const ButtonController = ({algorithms, algorithmHandler, reset}) => {

    return (
        <div>
            <h4>Vali algoritm</h4>
            <ButtonContainer>
                {algorithms.map(el =>
                    <button onClick={() => algorithmHandler(el)} key={el}>{el}</button>
                )}
                <button onClick={() => reset()}>Puhasta väljund</button>
            </ButtonContainer>
        </div>
    )
};

export default ButtonController;