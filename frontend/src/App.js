import './App.css';
import axios from 'axios';
import { RequiredTextInput, OptionalTextInput } from './components/TextInput';
import DropDownMenu from './components/DropDownMenu';
import { useState, useEffect } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap'


const App = () => {
  const [loading, setLoading] = useState(true);

  const [options, setOptions] = useState([]);
  const [validated, setValidated] = useState(false);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [supervisor, setSupervisor] = useState('');
  
  useEffect(() => {
    axios.get('/api/supervisors')
    .then(res => {
      setOptions(res.data);
    })
    .catch(err => {
      console.log(`Supervisors error: ${err}`);
    })
    .finally(() => setLoading(false));
  }, [])

  const submitForm = (e) => {
    e.preventDefault();
    if (!e.currentTarget.checkValidity()) {
      console.log('invalid');
      setValidated(true);
      return;
    }

    setValidated(true);

    // create request package
    const data = {
      firstName,
      lastName,
      ...email.length > 0 && {email},
      ...phoneNumber.length > 0 && {phoneNumber},
      supervisorValue: supervisor
    };

    // send request
    axios.post('/api/submit', data)
    .then(res => {
      console.log(res);
    })
    .catch(err => {
      console.log(`Submit error: ${err}`);
      console.log(`Error message: ${err.response.data}`);
    });
  }

  return (
    loading ? <div>Loading...</div> :
    <div className="App">
      <h1>Notification Form</h1>
      <Form onSubmit={submitForm} noValidate validated={validated}>
        <Row>
          <Col>
            <RequiredTextInput label='First Name' updateValue={setFirstName}/>
          </Col>
          <Col>
            <RequiredTextInput label='Last Name' updateValue={setLastName}/>
          </Col>
        </Row>
        <Row>
          <span>How would you prefer to be notified?</span>
          <Col>
            <OptionalTextInput label='Email' updateValue={setEmail}/>
          </Col>
          <Col>
            <OptionalTextInput label='Phone Number' updateValue={setPhoneNumber}/>
          </Col>
        </Row>
        <Row className='supervisor-container'>
          <DropDownMenu label='Supervisor' updateValue={setSupervisor}  options={options}/>
        </Row>
        <Row> 
          <Button type='submit'>Submit</Button>
        </Row>
      </Form>
    </div>
  );
}

export default App;
