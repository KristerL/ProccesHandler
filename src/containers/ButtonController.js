import React from "react";
import styled from "styled-components";

const ButtonContainer = styled.div`
    display:flex;
    flex-direction: column;
    justify-content:center;
    align-items:center;
`;
const ButtonController = ({algorithms, algorithmHandler}) => {

    return (
        <ButtonContainer>
            {algorithms.map(el =>
                <button onClick={() => algorithmHandler(el)} key={el}>{el}</button>
            )}
            <button>Puhasta väljund</button>
        </ButtonContainer>
    )
};

export default ButtonController;