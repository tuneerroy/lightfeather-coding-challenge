import { useState, useId } from 'react';
import { Form } from 'react-bootstrap'

export const RequiredTextInput = ({ label, updateValue }) => {
    const id = useId();

    const handleInputChange = (e) => {
        updateValue(e.target.value);
    }

    return (
        <Form.Group>
            <Form.Label htmlFor={id}>{label}</Form.Label>
            <Form.Control type='text' onChange={handleInputChange} required/>
        </Form.Group>
    )
};

export const OptionalTextInput = ({ label, updateValue }) => {
    const [disabled, setDisabled] = useState(false);

    const handleCheckboxChange = () => {
        setDisabled(!disabled);
    };

    const handleInputChange = e => {
        updateValue(e.target.value);
    };

    return (
        <Form.Group className='form-inline'>
            <Form.Check type='checkbox' label={label} onChange={handleCheckboxChange}/>
            <Form.Control disabled={!disabled} required={disabled} type='text' onChange={handleInputChange}/>
        </Form.Group>
    )
};