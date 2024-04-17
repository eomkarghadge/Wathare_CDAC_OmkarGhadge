const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 9999;

// MySQL database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'manager',
  database: 'mernapp'
});
app.use(cors());
// Connect to MySQL database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// Middleware to parse JSON request bodies
app.use(bodyParser.json());


function convertTimestamp(isoTimestamp) {
    const date = new Date(isoTimestamp);
    // Format the date as YYYY-MM-DD HH:mm:ss
    return date.toISOString().slice(0, 19).replace('T', ' ');
  }
  
// POST endpoint to insert data into MySQL database
app.post('/import', (req, res) => {
  const data = req.body; // Assuming data is sent in the request body
  console.log(data);
  // Check if data is an array
  if (!Array.isArray(data)) {
    return res.status(400).json({ error: 'Invalid data format' });
  }

  // Prepare the SQL query to insert data
  console.log(data);
  const insertQuery = 'INSERT INTO sample_data (ts, machine_status, vibration) VALUES ?';
  
  // Extract values from the JSON data and format them as an array of arrays
  const values = data.map(({ ts, machine_status, vibration }) => [convertTimestamp(ts), machine_status, vibration]);

  // Execute the SQL query to insert data
  db.query(insertQuery, [values], (err, result) => {
    if (err) {
      console.error('Error inserting data into MySQL:', err);
      return res.status(500).json({ error: 'Failed to insert data into MySQL' });
    }
    console.log('Data inserted into MySQL successfully');
    res.status(200).json({ message: 'Data inserted into MySQL successfully' });
  });
});

app.get('/filter', (req, res) => {
    const { startTime, frequency } = req.query;
    console.log("HIIIIIIIIIIIIII")
     console.log(startTime);
     console.log(frequency);

    // Check if startTime and frequency are provided
    if (!startTime || !frequency) {
        return res.status(400).json({ error: 'Missing parameters' });
    }

    // Parse the startTime parameter into a Date object
    const startDate = new Date(startTime);

    // Determine the endTime based on the frequency
    let endDate;
    switch (frequency) {
        case 'hour':
            endDate = new Date(startDate.getTime() + (60 * 60 * 1000)); // Add 1 hour
            break;
        case 'day':
            endDate = new Date(startDate.getTime() + (24 * 60 * 60 * 1000)); // Add 1 day
            break;
        case 'week':
            endDate = new Date(startDate.getTime() + (7 * 24 * 60 * 60 * 1000)); // Add 7 days
            break;
        case 'month':
            // Note: This is a simplified version; handling months with varying lengths may require more complex logic
            endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, startDate.getDate()); // Add 1 month
            break;
        default:
            return res.status(400).json({ error: 'Invalid frequency' });
    }
console.log(endDate);
    // Construct the SQL query to filter data based on the time range
    const filterQuery = 'SELECT * FROM sample_data WHERE ts >= ? AND ts < ?';

    const formattedStartTime = startDate.toISOString().replace('T', ' ').substring(0, 19);

    
    // Execute the query to retrieve filtered data
    db.query(filterQuery, [formattedStartTime, endDate], (err, result) => {
        if (err) {
            console.error('Error filtering data:', err);
            return res.status(500).json({ error: 'Failed to filter data' });
        }
        console.log('Data filtered successfully');
        console.log("Data...." + result.data);
        res.status(200).json(result); // Return filtered data
    });
});

app.get('/data',(req,res)=>{

    const filterQuery = 'SELECT * FROM sample_data';
    db.query(filterQuery,(err,result)=>{
        if (err) {
            console.error('Error filtering data:', err);
            return res.status(500).json({ error: 'Failed to filter data' });
        }
        console.log('Data getting successfully');
        console.log("Data...." + result.data);
        res.status(200).json(result); // Return filtered data
    });
});

  


// Start the Express server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
