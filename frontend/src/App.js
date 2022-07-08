import './App.css';
import axios from 'axios';
import { RequiredTextInput, OptionalTextInput } from './components/TextInput';
import DropDownMenu from './components/DropDownMenu';
import { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Alert } from 'react-bootstrap'

export const FIELDS = ['firstName', 'lastName', 'email', 'phoneNumber', 'supervisor'];
const ERRORS = {
  firstName: {
    required: 'First name is required.',
    invalid: 'Name can only contain letters.'
  },
  lastName: {
    required: 'Last name is required.',
    invalid: 'Name can only contain letters.'
  },
  email: {
    required: 'Must input email or uncheck option.',
    invalid: 'Email is invalid.'
  },
  phoneNumber: {
    required: 'Must input phone number or uncheck option.',
    invalid: 'Phone number is invalid.'
  },
  supervisor: {
    required: 'Supervisor is required.',
    invalid: 'Supervisor is invalid.'
  }
};

const App = () => {
  const [loading, setLoading] = useState(true);
  const [options, setOptions] = useState([]);
  const [validated, setValidated] = useState(false);
  const [submitMsgVisibility, setSubmitMsgVisibility] = useState(false);

  const [errorMessages, setErrorMessages] = useState(FIELDS.reduce((acc, field) => {
    return {...acc, [field]: ERRORS[field].required}
  }, {}));
  const [formData, setFormData] = useState(FIELDS.reduce((acc, field) => {
    return {...acc, [field]: ''}
  }, {}));
  
  useEffect(() => {
    axios.get('/api/supervisors')
    .then(res => {
      setOptions(res.data);
    })
    .catch(err => {
      console.log('Supervisors endpoint error:', err);
    })
    .finally(() => setLoading(false));
  }, [])

  const submitForm = (e) => {
    e.preventDefault();

    // disable submit msg from before if active
    setSubmitMsgVisibility(false);

    // if invalid, show validation messages in case off
    if (!e.currentTarget.checkValidity()) {
      setValidated(true);
      return;
    }

    // otherwise disable messages in case they were activate
    setValidated(false);

    // create request package
    const data = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      ...formData.email.length > 0 && {email: formData.email},
      ...formData.phoneNumber.length > 0 && {phoneNumber: formData.phoneNumber},
      supervisor: formData.supervisor
    };

    // send submission request
    axios.post('/api/submit', data)
    .then(_res => {
      // show success screen
      setSubmitMsgVisibility(true);
      
      // clear forms
      setFormData(FIELDS.reduce((acc, field) => {
        return {...acc, [field]: ''}
      }));
    })
    .catch(err => {
      // server error
      if (err.response.status >= 500 && err.response.status < 600) {
        console.log('Server error:', err);
        alert('Sorry, there was a server error. Please try again later.');
      }
      // unknown error 
      else if (err.response.status != 400) {
        console.log('Unknown error:', err);
        alert('Sorry, there seems to be a problem with the site. Please try again later.');
      }
      // invalid request
      else {
        const errFields = err.response.data.fields;
        setErrorMessages(FIELDS.reduce((acc, field) => {
          // if field not included, set default error
          if (!errFields.includes(field)) {
            return {...acc, 
              [field]: ERRORS[field].required
            }
          }

          // otherwise, force clear input so new message shows
          setFormData(prev => {
            return {...prev, [field]: ''}
          });

          // and set error message
          return {...acc, 
            [field]: ERRORS[field].invalid
          }
        }, {}));
        
        // activate validation
        setValidated(true);
      }
    });
  }

  return (
    loading ? null :
    <div className="App">
      <h1>Notification Form</h1>
      <Form onSubmit={submitForm} noValidate validated={validated}>
        <Row>
          <Col>
            <RequiredTextInput
              label='First Name'
              value={formData.firstName}
              updateValue={(newVal) => setFormData(prev => ({...prev, firstName: newVal}))}
              feedbackMessage={errorMessages.firstName}
            />
          </Col>
          <Col>
            <RequiredTextInput 
              label='Last Name'
              value={formData.lastName}
              updateValue={(newVal) => setFormData(prev => ({...prev, lastName: newVal}))}
              feedbackMessage={errorMessages.lastName}
            />
          </Col>
        </Row>
        <Row>
          <span>How would you prefer to be notified?</span>
          <Col>
            <OptionalTextInput 
              label='Email' 
              value={formData.email}
              updateValue={(newVal) => setFormData(prev => ({...prev, email: newVal}))}
              feedbackMessage={errorMessages.email}
            />
          </Col>
          <Col>
            <OptionalTextInput 
              label='Phone Number'
              value={formData.phoneNumber}
              updateValue={(newVal) => setFormData(prev => ({...prev, phoneNumber: newVal}))}
              feedbackMessage={errorMessages.phoneNumber}
            />
          </Col>
        </Row>
        <Row className='supervisor-container'>
          <DropDownMenu 
            label='Supervisor'
            value={formData.supervisor}
            updateValue={(newVal) => setFormData(prev => ({...prev, supervisor: newVal}))}
            options={options}
            feedbackMessage={errorMessages.supervisor}
          />
        </Row>
        <Row> 
          <Button type='submit'>Submit</Button>
        </Row>
      </Form>
      {submitMsgVisibility ? 
      <Alert variant='success'>
        Form successfully submitted.
      </Alert> : null}
    </div>
  );
}

export default App;
