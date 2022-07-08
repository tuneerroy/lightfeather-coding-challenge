import { useState } from 'react';
import { Form } from 'react-bootstrap'

const TextInput = ({ required, label, value, updateValue, feedbackMessage }) => {
    const [disabled, setDisabled] = useState(false);

    const handleCheckboxChange = () => {
        setDisabled(!disabled);
    };

    const handleInputChange = e => {
        updateValue(e.target.value);
    };

    return (
        <Form.Group className='form-inline'>
            {required ? <Form.Label>{label}</Form.Label> :
            <Form.Check 
                className='ignore-validate'
                type='checkbox' 
                label={label}
                onChange={handleCheckboxChange}
                required={false}
            />}
            <Form.Control 
                disabled={!required && !disabled} 
                required={required || disabled} 
                type='text'
                value={value ?? ''}
                onChange={handleInputChange}
            />
            <div className='invalid-feedback'>{feedbackMessage}</div>
        </Form.Group>
    )
};

export const RequiredTextInput = ({ ...props }) => <TextInput required={true} {...props}/>
export const OptionalTextInput = ({ ...props }) => <TextInput required={false} {...props}/>