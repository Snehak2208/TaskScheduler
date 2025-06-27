const express = require('express');
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');

const app = express();
app.use(express.json());
app.use(cors());
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);
const taskRoutes = require('./routes/task');
app.use('/api/tasks', taskRoutes);
const recommendRoutes = require('./routes/recommend');
app.use('/api/recommend', recommendRoutes);

// Test route
app.get('/', (req, res) => {
    res.send('API is running!');
});
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('MongoDB connected!');
}).catch((err) => {
    console.error('MongoDB connection error:', err);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
