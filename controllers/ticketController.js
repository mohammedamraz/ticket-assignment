const { Ticket, getNextTicketId } = require('../models/ticketModel');

const { Agent, getNextAgentId } = require('../models/agentModel');

exports.createTicket = async (req, res) => {
  try {
    const {
      topic,
      description,
      severity,
      type,
      status,
      resolvedOn,
    } = req.body;

    const lastTicket = await Ticket.findOne().sort({ id: -1 });

    const activeAgents = await Agent.find({ active: true });

    let assignedTo;

    if (lastTicket) {
      const lastAssignedTo = lastTicket.assignedTo;

      const index = activeAgents.findIndex((agent) => agent.id === lastAssignedTo);

      assignedTo = index !== -1 ? activeAgents[(index + 1) % activeAgents.length].id : activeAgents[0].id;
    } else {
      assignedTo = activeAgents.length > 0 ? activeAgents[0].id : null;
    }

    const ticketId = await getNextTicketId();
    const ticket = new Ticket({
      id: ticketId,
      topic,
      description,
      severity,
      type,
      assignedTo,
      status,
      resolvedOn,
    });

    await ticket.save();
    res.status(201).json(ticket);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.updateTicketStatus = async (req, res) => {
  try {
    const { ticketId } = req.params;

    const ticket = await Ticket.findOne({ id: ticketId });

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    if (ticket.status === 'assigned') {
      ticket.status = 'completed';
      ticket.resolvedOn = new Date();
      await ticket.save();
      res.status(200).json(ticket);
    } else if (ticket.status === 'completed') {
      res.status(400).json({ error: 'Ticket is already completed' });
    } else {
      res.status(400).json({ error: 'Invalid status for updating' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getTickets = async (req, res) => {
  try {
    const { status, assignedTo, dateCreated, severity } = req.query;
    const filter = {};

    if (status) {
      filter.status = status;
    }

    if (assignedTo) {
      filter.assignedTo = assignedTo;
    }

    if (dateCreated) {
      filter.dateCreated = dateCreated;
    }

    if (severity) {
      filter.severity = severity;
    }

    const tickets = await Ticket.find(filter);

    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};