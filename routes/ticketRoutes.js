const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');

router.post('/tickets', ticketController.createTicket);
router.get('/tickets', ticketController.getTickets);
router.patch('/tickets/:ticketId/status', ticketController.updateTicketStatus);
module.exports = router;
