import { Form } from 'react-bootstrap'

const DropDownMenu = ({ label, value, updateValue, options, feedbackMessage }) => {
    const handleSelectChange = (e) => {
        updateValue(e.target.value);
    }

    return (
        <Form.Group className='form-group col-md-4'>
            <Form.Label>{label}</Form.Label>
            <Form.Select className='form-control' onChange={handleSelectChange} value={value ?? ''} required={options.length > 0}>
                <option value='' disabled hidden>Select...</option>
                {options.map(option => <option key={option} value={option}>{option}</option>)}
            </Form.Select>
            <div className='invalid-feedback'>{feedbackMessage}</div>
        </Form.Group>
    )
};

export default DropDownMenu;