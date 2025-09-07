const app = require('./app');
const dotenv = require('dotenv');
const db = require('./BackEnd/src/config/db');

require('dotenv').config();

const PORT = process.env.PORT || 5000;


const pool = require('./BackEnd/src/config/db');

async function testDb() {
  try {
    await pool.query('SELECT 1');
    console.log('✅ DB connected');
  } catch (err) {
    console.error('❌ DB connection failed:', err.message);
    process.exit(1); 
  }
}




app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});


