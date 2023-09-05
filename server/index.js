require('dotenv').config({path: './.env.local'});

const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));


const PORT = 8080;

// Create a connection pool to the PostgreSQL database
const pool = new Pool({
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  port: 5432,
  ssl: false,
});

// Middleware to parse JSON requests
app.use(express.json());

// Route to handle POST requests and proxy them to the database
app.post('/sign-in', async (req, res) => {
  try {
    const { email, password } = req.body.params;

    if (!req.body || !email || !password) {
      return res.status(500).json({ error: 'Email and/or password not present in the request body'});
    }
    const { rows } = await pool.query(`SELECT * FROM account WHERE email_address = '${email}' and password = '${password}'`);
    console.log('SIGNED IN');
    return res.json(rows);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error on route /sign-in'});
  }
});
app.post('/sign-up', async (req, res) => {
  try {
    const {
      accountNumber,
      email,
      password,
      firstName,
      lastName,
      nin,
      phoneNumber,
      securityPin,
      creditScore,
    } = req.body.params;

    if (!req.body || !email) {
      return res.status(500).json({ error: 'Email is not present in the request body'});
    }

    const accountStatus = 'normal';
    const verified = false;
    const dateCreated = new Date().toISOString();

    const { rows } = await pool.query(`
    INSERT INTO account(first_name, last_name, security_pin, account_number, phone_number, credit_score, account_status, verified, date_created, email_address, password, nin)
    VALUES('${firstName}', '${lastName}', '${securityPin}', '${accountNumber}', '${phoneNumber}', '${creditScore}', '${accountStatus}', '${verified}', '${dateCreated}', '${email}', '${password}', '${nin}') returning *`);
    return res.json(rows);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error on route /sign-up'});
  }
});
app.post('/add-job', async (req, res) => {
  console.log('\n/add-job');
  try {
    const { accountId, yearlySalary, jobType, vetted } = req.body.params;
    if (!req.body || !accountId || !yearlySalary || !jobType) {
      return res.status(500).json({ error: 'Job is not correctly specified'});
    }

    if (!vetted) {
      return res.status(500).json({ error: 'Job is not vetted'});
    }
  
    const dateCreated = new Date().toISOString();
    const { rows } = await pool.query(`
    INSERT INTO job(account_id, yearly_salary, job_type, vetted, date_created)
    VALUES('${accountId}', '${yearlySalary}', '${jobType}', ${vetted}, '${dateCreated}')
    RETURNING id
    `);
    return res.json(rows);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error on route /add-job'});
  }
});

app.post('/add-asset', async (req, res) => {
  try {
    const { worth, accountId, assetType, vetted } = req.body.params;

    if (!req.body || !worth || !assetType || !accountId) {
      return res.status(500).json({ error: 'Correct parameters not sent.'});
    }
  
    if (!vetted) {
      return res.status(500).json({ error: 'Asset is not vetted'});
    }
  
    const dateCreated = new Date().toISOString();

    const { rows } = await pool.query(`
      INSERT INTO asset(worth, asset_type, vetted, account_id, date_created)
      VALUES('${worth}', '${assetType}', ${vetted}, ${accountId}, '${dateCreated}')
      RETURNING id;
    `);
    return res.json(rows);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error on route /add-asset'});
  }
});

app.get('/verify/:id', async (req, res) => {
  try {
    const { id } = req.params;
  
    if (!req.params || !id) {
      return res.status(500).json({ error: 'Not verified.'});
    }
    const { rows } = await pool.query(`UPDATE account SET verified = true WHERE id = '${id}' returning *`);
    return res.json(rows);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error on route /verify'});
  }
});

// REMOVE THIS LATER ALL CREDIT SCORE CALCULATIONS AND UPDATE WILL HAPPEN HERE ON THE BACKEND
app.post('/update-credit-score', async (req, res) => {
  try {
    const { creditScore, accountId } = req.body.params;
  
    if (!req.body || !accountId || !creditScore) {
      return res.status(500).json({ error: 'Correct credentials not sent.'});
    }
    const { rows } = await pool.query(`UPDATE account SET credit_score = '${creditScore}' WHERE id = ${accountId} returning id`);
    return res.json(rows);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error on route /update-credit-score'});
  }
});

app.get('/get-loan-plans-by-credit/:minCreditScore', async (req, res) => {
  try {
    const { minCreditScore } = req.params;

    if (!req.params || !minCreditScore) {
      return res.status(500).json({ error: 'Minimum credit score not sent.'});
    }
    const { rows } = await pool.query(`SELECT * FROM loan_plan WHERE min_credit_score <= ${minCreditScore}`);
    return res.json(rows);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error on route /get-loan-plans-by-credit'});
  }
});

app.get('/get-incomplete-loans-by-account/:accountId', async (req, res) => {
  try {
    const { accountId } = req.params;
    if (!req.params || !accountId) {
      return res.status(500).json({ error: 'Account id not sent.'});
    }
    const { rows } = await pool.query(`SELECT * FROM loan WHERE account_id = ${accountId} and loan_status != 'completed'`);
    return res.json(rows);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error on route /get-incomplete-loans-by-account'});
  }
});

app.post('/add-loan', async (req, res) => {
  try {
    const { amountTaken, accountId, loanPlanId } = req.body.params;

    if (!req.body || !amountTaken || !accountId || !loanPlanId) {
      return res.status(500).json({ error: 'Correct parameters not sent.'});
    }
    const amountPaid = 0;
    const dateCreated = new Date().toISOString();
    const loanStatus = 'ongoing';
    const { rows } = await pool.query(`
      INSERT INTO loan(amount_taken, amount_paid, loan_status, account_id, loan_plan_id, date_created)
      VALUES('${amountTaken}', '${amountPaid}', '${loanStatus}', ${accountId}, ${loanPlanId}, '${dateCreated}')
      RETURNING id;
    `);
    return res.json(rows);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error on route /add-loan'});
  }
});

app.post('/repay-loan', async (req, res) => {
  // add to repayment history
  // calculate and add payment to existing amountPaid in loan
});

app.get('/get-assets-by-account/:accountId', async (req, res) => {
  try {
    const { accountId } = req.params;
    if (!req.params || !accountId) {
      return res.status(500).json({ error: 'Account id not sent.'});
    }

    const { rows } = await pool.query(`SELECT * FROM asset WHERE account_id = ${accountId}`);
    return res.json(rows);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error on route /get-assets-by-account'});
  }
});

app.get('/get-current-job/:accountId', async (req, res) => {
  try {
    const { accountId } = req.params;

    if (!req.params || !accountId) {
      return res.status(500).json({ error: 'Account id not sent.'});
    }

    const { rows } = await pool.query(`SELECT * FROM job WHERE account_id = ${accountId} ORDER BY date_created DESC LIMIT 1;`);
    return res.json(rows);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error on route /get-incomplete-loans-by-account'});
  }
});

app.get('/get-user-assets/:accountId', async (req, res) => {
  try {
    const { accountId } = req.params;

    if (!req.params || !accountId) {
      return res.status(500).json({ error: 'Account id not sent.'});
    }

    const { rows } = await pool.query(`SELECT * FROM assets WHERE account_id = ${accountId}`);
    return res.json(rows);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error on route /get-incomplete-loans-by-account'});
  }
});

app.listen(PORT, () => {
  if (pool) console.log(`Server is running on port ${PORT}`);
});

app.use((req, res, next) => {
  next('404RouteNotFound. You\'re falling off the earth 😵‍💫.');
});

module.exports = app;
