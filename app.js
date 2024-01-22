const express = require('express');
const mongoose = require('mongoose');
const agentRoutes = require('./routes/agentRoutes');
const ticketRoutes = require('./routes/ticketRoutes');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;
const cors = require('cors');


app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/Agent_Ticket_Assignment', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});
app.use(express.json());

// Use the routes
app.use('/api', agentRoutes);
app.use('/api', ticketRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
