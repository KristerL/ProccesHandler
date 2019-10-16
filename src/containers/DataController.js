import React, {useState} from "react"
import styled from "styled-components";

const InputContainer = styled.div`
    display:flex;
    flex-direction:column;
`;

const InputBox = styled.div`
    display:flex;
    flex-direction:column;
`;

const DataController = ({processes, processHandler}) => {
    const [customProcess, setCustomProcess] = useState(null);

    const handleCustomInput = (el) => {
        setCustomProcess(el);
    };

    const handleCustomSelect = () => {
        processHandler(customProcess);
    };

    return (
        <InputContainer>
            <h4>Vali või sisesta järjend (kujul 1,10;3,3;4,1;8,6;15,2)</h4>
            <InputBox>
                {Object.keys(processes).map(item =>
                    <h3 key={item} onClick={() => processHandler(processes[item])}><input type={"radio"}
                                                                                          name={"process"}/>{item} {processes[item]}
                    </h3>)}
                <h3><input type={"radio"} name={"process"} onClick={handleCustomSelect}/>Sisesta Enda <input
                    type={"textarea"} onChange={target => handleCustomInput(target.target.value)}/></h3>
            </InputBox>
        </InputContainer>
    )
};

export default DataController;