const pg = require('pg'); // Install pg package: npm install pg
const fs = require('fs');
const { parse } = require("csv-parse");
const prompt = require('prompt-sync')();
const username = prompt('Username: ') || 'data';
console.log(`Hey there ${username}`);
const hostname = prompt('Host: ').concat('.virginia-postgres.render.com');
const schema = prompt('what schema do you want to use? ') || 'dev';
console.log(`Using ${schema}`);

const password = prompt('Password: ');


const pool = new pg.Pool({
  user: username,
  host: hostname,
  database: 'wedding_data_16hs',
  password: password,
  port: 5432, // Default PostgreSQL port
  ssl: 'true'
});

async function setupTables(){
  try {
    const client = await pool.connect();
    const searchPathResults = await client.query(`set search_path to ${schema}`);

    //create the parties table if not exisits
    const createPartyResults = await client.query(`
      CREATE TABLE IF NOT EXISTS parties (
        party_code varchar(50) PRIMARY KEY,
        note text NOT NULL,
        photos text[]
      )
    `);
    console.log(createPartyResults);

    //create the members table if not exisits
    const createGuestResults = await client.query(`
      CREATE TABLE IF NOT EXISTS guests (
        first_name varchar(50) NOT NULL,
        last_name varchar(50) NOT NULL,
        rsvp BOOLEAN,
        allergies text,
        party_code varchar(50),
        PRIMARY KEY(first_name, last_name)
      )
    `);
    console.log(createGuestResults);

  } catch (err) {
    console.error('Error:', err);
  }
}

async function populateTables(){
  const tables = await setupTables();
  const client = await pool.connect();
  const searchPathResults = await client.query(`set search_path to ${schema}`);

  // populate the parties table
  fs.createReadStream('party_data.csv')
    .pipe(parse({
      delimiter: ':',
      columns: true,
      relax_quotes: true
    }))
    .on('data', row => {
      try {
        const query = 
          `INSERT INTO parties (party_code, note, photos) 
            VALUES ($1, $2, $3)
            ON CONFLICT(party_code)
            DO UPDATE SET
              note = EXCLUDED.note,
              photos = EXCLUDED.photos`;

        const values = [row['party_code'], row['note'], `{${row['photos']}}`]; // Map CSV columns to table columns
        const insertRecord = client.query(query, values);
        console.log(insertRecord)
      } catch (error) {
        console.error(error);
      }
    });

    //populate the guests table
    fs.createReadStream('guest_data.csv')
    .pipe(parse({
      delimiter: ':',
      columns: true
    }))
    .on('data', row => {
      try {
        const query = 
          `INSERT INTO guests (first_name, last_name, allergies, party_code) 
            VALUES ($1, $2, $3, $4)
            ON CONFLICT(first_name, last_name)
            DO UPDATE SET
              allergies = EXCLUDED.allergies`;
        const values = [row['first_name'], row['last_name'], row['allergies'], row['party_code'] ]; // Map CSV columns to table columns
        const insertRecord = client.query(query, values);
        console.log(insertRecord)
      } catch (error) {
        console.error(error);
      }
    });
  pool.end();
}

populateTables();
