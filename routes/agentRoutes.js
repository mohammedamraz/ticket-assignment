const express = require('express');
const router = express.Router();
const agentController = require('../controllers/agentController');

router.post('/agents', agentController.createAgent);

router.patch('/agents/:agentId/status', agentController.updateAgentStatus);
router.get('/agents', agentController.getAllAgents);
router.get('/agents/:agentId', agentController.getAgentById);
module.exports = router;
