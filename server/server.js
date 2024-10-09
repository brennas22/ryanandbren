const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();
const port = 5001;

app.use(cors());
app.use(express.json());

let partyData = JSON.parse(fs.readFileSync('./data/partyData.json')); 

app.post('/rsvp', (req, res) => {
  console.log('Received RSVP request:', req.body);

  const { code, memberRSVPs, memberAllergies } = req.body;
  const lowerCaseCode = code.toLowerCase();  // Convert the incoming code to lowercase

  // Find the party with a case-insensitive comparison
  const foundPartyKey = Object.keys(partyData).find(
    partyCode => partyCode.toLowerCase() === lowerCaseCode
  );

  if (foundPartyKey) {
    const foundParty = partyData[foundPartyKey];

    // Update the members' RSVP status and allergies
    foundParty.members.forEach((member) => {
      member.rsvp = memberRSVPs[member.name] || 'no';
      member.allergies = memberAllergies[member.name] || '';
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

app.get('/partyData', (req, res) => {
  res.json(partyData);
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
