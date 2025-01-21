const express = require('express');
const cors = require('cors');
const fs = require('fs');
const pg = require('pg'); // Install pg package: npm install pg
const app = express();
const port = process.env.PORT || 3001;

const username = process.env.USERNAME || 'data';
const hostname = process.env.HOSTNAME || 'dpg-ctthaq9u0jms73bj0cr0-a.virginia-postgres.render.com'
const password = process.env.PASSWORD || 'zZsgVUWvt3wWxTICMCKNljDxHGonNma4'
const schema = process.env.SCHEMA || 'dev'

const pool = new pg.Pool({
  user: username,
  host: hostname,
  database: 'wedding_data_16hs',
  password: password,
  port: 5432, // Default PostgreSQL port
  ssl: 'true'
});

async function fetchPartyData(partyCode) {
  try {
    const client = await pool.connect();
    await client.query(`SET search_path TO ${schema};`);
    
    // Queries for party and guest data
    const partyQuery = `SELECT party_code, note, photos FROM parties WHERE party_code = $1;`;
    const guestQuery = `SELECT first_name, last_name, rsvp, allergies FROM guests WHERE party_code = $1;`;

    const [partyResults, guestResults] = await Promise.all([
      client.query(partyQuery, [partyCode]),
      client.query(guestQuery, [partyCode]),
    ]);

    if (partyResults.rows.length === 0) {
      client.release();
      return null; // No party found
    }

    // Construct the response object
    const partyObject = {
      [partyCode]: {
        note: partyResults.rows[0].note,
        photos: partyResults.rows[0].photos || [],
        members: guestResults.rows, // Associate members here
      },
    };

    client.release();
    return partyObject;
  } catch (err) {
    console.error("Error executing query:", err);
    throw err;
  }
}



app.use(cors());
app.use(express.json());

app.post('/rsvp', (req, res) => {
  console.log('Received RSVP request:', req.body);

  const { code, memberRSVPs, memberAllergies } = req.body;
  const lowerCaseCode = code.toLowerCase();  // Convert the incoming code to lowercase
  console.log(Object.keys(partyData));

  // Find the party with a case-insensitive comparison
  const foundPartyKey = Object.keys(partyData).find(
    partyCode => partyCode.toLowerCase() === lowerCaseCode
  );

  if (foundPartyKey) {
    const foundParty = partyData[foundPartyKey];

    // Update the members' RSVP status and allergies
    foundParty.members.forEach((member) => {
      const fullName = `${member.firstname} ${member.lastname}`; // Construct the full name

      // Update the RSVP status and allergies using the full name as the key
      member.rsvp = memberRSVPs[fullName] || 'no';
      member.allergies = memberAllergies[fullName] || '';
    });

    // Write the updated party data back to the file
    fs.writeFileSync(
      './data/partyData.json',
      JSON.stringify(partyData, null, 2)
    );
    res.json({ message: 'RSVP received!' });
  } else {
    res.status(400).json({ error: 'Invalid party code' });
  }
});

app.get('/partyData/:partyCode', async (req, res) => {
  const partyCode = req.params.partyCode;
  const data = await fetchPartyData(partyCode);
  res.json(data);
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});