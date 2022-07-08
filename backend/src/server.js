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

app.listen(PORT, () => {
    console.log(`Server started at port ${PORT}. Ctrl-C to stop server.`);
});