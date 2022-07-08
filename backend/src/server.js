import express from 'express';
import axios from 'axios';

const PORT = 8080;
const app = express();
app.use(express.json());

app.get('/api/supervisors', (_req, res) => {
    axios.get('https://o3m5qixdng.execute-api.us-east-1.amazonaws.com/api/managers')
    .then(resp => resp.data)
    // filter data
    .then(data => data.filter(o => isNaN(o.jurisdiction)))
    // alphabetically sort data
    .then(filtered => {
        return filtered.sort((o1, o2) => {
            // compare jurisdiction first
            if (o1.jurisdiction != o2.jurisdiction) {
                return o1.jurisdiction < o2.jurisdiction ? -1 : 1;
            }
            // then lastName
            if (o1.lastName != o2.lastName) {
                return o1.lastName < o2.lastName ? -1 : 1;
            }
            // then firstName
            if (o1.firstName != o2.firstName) {
                return o1.firstName < o2.firstName ? -1 : 1;
            }
            return 0;
        })
    })
    // get desired elements
    .then(sorted => sorted.map(o => `${o.jurisdiction} - ${o.lastName}, ${o.firstName}`))
    // send response
    .then(final => res.status(200).send(final))
    // catch any errors
    .catch(err => {
        console.log(`/api/supervisors Error: ${err}`);
        res.sendStatus(500);
    });
});

const validatePost = (req, res, next) => {
    // check for missing required elements
    const missing = ['firstName', 'lastName', 'supervisor'].filter(key => !(key in req.body));
    if (missing.length > 0) 
    return res.status(400).send(`Missing required fields: ${missing.join(', ')}`);

    // validate names
    if (/^[a-zA-Z]+$/.test(req.body.firstName) || /^[a-zA-Z]+$/.test(req.body.lastName) || /^[a-zA-Z]+$/.test(req.body.supervisor)) 
    return res.status(400).send('Names must only contain letters.');
    
    // validate email if exists (uses RFC 2822, directly taken from https://stackoverflow.com/a/1373724)
    const emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
    if ('email' in req.body && !req.body.email.match(emailRegex)) 
    return res.status(400).send('Email is invalid.');

    // validate phone number if exists (directly taken from https://stackoverflow.com/q/4338267)
    const numberRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im
    if ('phoneNumber' in req.body && !req.body.phoneNumber.match(numberRegex)) 
    return res.status(400).send('Phone number is invalid.');

    next();
}

app.post('/api/submit', validatePost, (req, res) => {
    console.log({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        ... 'email' in req.body && {email: req.body.email},
        ... 'phoneNumber' in req.body && {phoneNumber: req.body.phoneNumber},
        supervisor: req.body.supervisor
    })
    res.sendStatus(200);
});

app.listen(PORT, () => {
    console.log(`Server started at port ${PORT}. Ctrl-C to stop server.`);
});