// routes/investmentRoutes.js
const express = require('express');
const router = express.Router();
const investmentController = require('../controllers/investmentController');
const { validate, schemas } = require('../middleware/validation');
const auth = require('../middleware/auth');

router.use(auth);

router.get('/', investmentController.getAll);
router.get('/:id', investmentController.getById);
router.post('/', validate(schemas.createInvestment), investmentController.create);
router.put('/:id', validate(schemas.updateInvestment), investmentController.update);
router.delete('/:id', investmentController.delete);

module.exports = router;