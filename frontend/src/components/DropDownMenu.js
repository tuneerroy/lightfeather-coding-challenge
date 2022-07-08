import { Form } from 'react-bootstrap'

const DropDownMenu = ({ label, updateValue, options }) => {
    const handleSelectChange = (e) => {
        updateValue(e.target.value);
    }

    return (
        <Form.Group className='form-group col-md-4'>
            <Form.Label>{label}</Form.Label>
            <Form.Select className='form-control' onChange={handleSelectChange} defaultValue={''} required>
                <option value='' disabled hidden>Select...</option>
                {options.map(option => <option key={option} value={option}>{option}</option>)}
            </Form.Select>
            <div className='invalid-feedback'>Please select a value.</div>
        </Form.Group>
    )
};

export default DropDownMenu;