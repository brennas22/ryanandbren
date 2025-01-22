const express = require('express');
const cors = require('cors');
const fs = require('fs');
const pg = require('pg'); // Install pg package: npm install pg
const app = express();
const port = process.env.PORT || 3001;

const username = process.env.USERNAME;
const hostname = process.env.HOSTNAME;
const password = process.env.PASSWORD;
const schema = process.env.SCHEMA;

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

app.post('/rsvp', async (req, res) => {
  console.log('Received RSVP request:', req.body);
  const client = await pool.connect();

  const { code, memberRSVPs, memberAllergies } = req.body;
  updateObject = {};
  for (const key in memberRSVPs) {
    const [first_name, last_name] = key.split(" ");
    //last_name = last_name.trim();
    const rsvp = memberRSVPs[key];
    const allergies = memberAllergies[key];
    updateObject[key] = {
      first_name: first_name,
      last_name: last_name,
      rsvp: rsvp,
      allergies: allergies,
      party_code: code
    }
  };

  const query_begining = "UPDATE guests as g SET rsvp = g2.rsvp, allergies = g2.allergies from (values ";
  let query_middle = ""
  for (const key in updateObject) {
    query_middle += `('${updateObject[key].first_name}', 
      '${updateObject[key].last_name}',
      ${updateObject[key].rsvp},
      '${updateObject[key].allergies}',
      '${updateObject[key].party_code}'), `
  };
  query_middle = query_middle.slice(0, -2);
  query_middle += ") as g2 (first_name, last_name, rsvp, allergies, party_code) where g.first_name = g2.first_name and g.last_name = g2.last_name;"
  const query = query_begining + query_middle;
  await client.query(`SET search_path TO ${schema};`);

  const updateResults = await client.query(query);
  if (updateResults.rowCount == Object.keys(updateObject).length) {
    res.json({ message: 'RSVP received!' });
  }else {d
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