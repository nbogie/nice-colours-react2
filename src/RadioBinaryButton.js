import React, { useEffect } from 'react';

function RadioBinaryButton({ nameOn, nameOff, current, groupName, changeHandler }) {

    return (

        <div className="radio-binary-button" onClick={(ev) => changeHandler(!current)}>
            <input
                type="radio"
                name={groupName}
                id={nameOn}
                checked={current}
            />
            <label className="radio-binary-button--label" htmlFor={nameOn}>
                {nameOn}
            </label>

            <input
                type="radio"
                name={groupName}
                id={nameOff}
                checked={!current}
            />
            <label className="radio-binary-button--label" htmlFor={nameOff}>
                {nameOff}
            </label>
        </div>
    )
}
export default RadioBinaryButton;