const express = require('express');
const {deleteCompany , updateCompany ,getCompanyProfile } = require('../controllers/compController');
const auth = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', auth(['company']), deleteCompany);
router.put('/', auth(['company']), updateCompany);


module.exports = router;