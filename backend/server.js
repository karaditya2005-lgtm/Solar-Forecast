const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const { Webhook } = require('svix');

const app = express();

// Use express.json() but we need raw body for webhook verification
// So we use it everywhere EXCEPT the webhook route
app.use(cors());

// Connect to MongoDB
const connectDB = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            console.warn('MONGODB_URI is not defined in environment variables');
            return;
        }
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB connected successfully');
    } catch (err) {
        console.error('MongoDB connection error:', err);
    }
};

connectDB();

// Simple Schema for testing/future use
const userSchema = new mongoose.Schema({
    clerkId: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    firstName: String,
    lastName: String,
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// Basic health check route
app.get('/', (req, res) => {
    res.status(200).json({ message: 'Backend is running successfully.' });
});

// Webhook route for Clerk
// We need raw body for Svix to verify the signature
app.post(
    '/api/webhooks/clerk',
    express.raw({ type: 'application/json' }),
    async (req, res) => {
        const payload = req.body;
        const headers = req.headers;
        
        const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

        if (!webhookSecret) {
            console.error('CLERK_WEBHOOK_SECRET is not set');
            return res.status(500).send('Webhook secret not configured');
        }

        const svix_id = headers['svix-id'];
        const svix_timestamp = headers['svix-timestamp'];
        const svix_signature = headers['svix-signature'];

        if (!svix_id || !svix_timestamp || !svix_signature) {
            return res.status(400).json({ error: 'Error occurred -- no svix headers' });
        }

        const wh = new Webhook(webhookSecret);
        let evt;

        try {
            evt = wh.verify(payload, {
                'svix-id': svix_id,
                'svix-timestamp': svix_timestamp,
                'svix-signature': svix_signature,
            });
        } catch (err) {
            console.log('Error verifying webhook:', err.message);
            return res.status(400).json({ error: 'Error verifying webhook' });
        }

        const { id } = evt.data;
        const eventType = evt.type;

        console.log(`Webhook with an ID of ${id} and type of ${eventType}`);
        // console.log('Webhook body:', evt.data);

        // Handle specific events
        if (eventType === 'user.created') {
            const { id: clerkId, email_addresses, first_name, last_name } = evt.data;
            const email = email_addresses && email_addresses.length > 0 ? email_addresses[0].email_address : '';
            
            try {
                const newUser = new User({
                    clerkId,
                    email,
                    firstName: first_name,
                    lastName: last_name
                });
                await newUser.save();
                console.log('User saved to MongoDB');
            } catch (error) {
                console.error('Error saving user to MongoDB:', error);
            }
        }
        
        if (eventType === 'user.deleted') {
            const { id: clerkId } = evt.data;
            try {
                await User.findOneAndDelete({ clerkId });
                console.log('User deleted from MongoDB');
            } catch (error) {
                console.error('Error deleting user from MongoDB:', error);
            }
        }

        res.status(200).json({ success: true, message: 'Webhook processed' });
    }
);

// Standard JSON body parser for other routes
app.use(express.json());

// Start server (when running locally)
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

// Export for Vercel Serverless Functions
module.exports = app;
