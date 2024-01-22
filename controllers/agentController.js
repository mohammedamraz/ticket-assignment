const { Agent, getNextAgentId } = require('../models/agentModel');

exports.createAgent = async (req, res) => {
  try {
    const { name, email, phone, description } = req.body;
    const agentId = await getNextAgentId();
    const agent = new Agent({ id: agentId, name, email, phone, description });
    await agent.save();
    res.status(201).json(agent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateAgentStatus = async (req, res) => {
  try {
    const { agentId } = req.params;

    const agent = await Agent.findOne({ id: agentId });

    if (!agent) {
      return res.status(404).json({ error: 'Agent not found' });
    }

    agent.active = !agent.active;

    await agent.save();

    res.status(200).json(agent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllAgents = async (req, res) => {
  try {
    const filter = req.query.active ? { active: req.query.active === 'true' } : {};

    const agents = await Agent.find(filter);

    res.status(200).json(agents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAgentById = async (req, res) => {
  try {
    const { agentId } = req.params;

    const agents = await Agent.findOne({ id: agentId })

    res.status(200).json(agents);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
