require('dotenv').config();  // Load environment variables from .env file

const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');  // Require nodemailer once

// Initialize express app
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(bodyParser.json());  // For parsing application/json
app.use(bodyParser.urlencoded({ extended: true }));  // For parsing application/x-www-form-urlencoded

// MongoDB connection
const uri = "mongodb+srv://topsymachemba:Topsybling@UrbanNestDatabase.jzf0i.mongodb.net/?retryWrites=true&w=majority&appName=UrbanNestDatabase";
mongoose.connect(uri)
    .then(() => console.log("MongoDB connected successfully!"))
    .catch(err => console.error("MongoDB connection error:", err));

// User Schema
const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    registrationType: String,
    businessName: String,  // optional for business registration
    portfolioLink: String,  // optional for photographer registration
    experience: Number  // optional for photographer registration
});

// User Model
const User = mongoose.model('User', userSchema);

// Set up Nodemailer transporter using environment variables
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,   // Use SMTP_HOST from .env
    port: process.env.SMTP_PORT,   // Use SMTP_PORT from .env
    secure: false,                 // Set to true if using port 465 for SSL
    auth: {
        user: process.env.EMAIL_USER,  // Your email address from .env
        pass: process.env.EMAIL_PASS   // Your email password or App Password from .env
    }
});

// Registration Route
app.post('/register', async (req, res) => {
    try {
        const { username, email, password, registrationType, businessName, portfolioLink, experience } = req.body;

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            registrationType,
            businessName: registrationType === 'business' ? businessName : undefined,
            portfolioLink: registrationType === 'photographer' ? portfolioLink : undefined,
            experience: registrationType === 'photographer' ? experience : undefined
        });

        // Save the user to the database
        await newUser.save();

        // Send confirmation email
        const mailOptions = {
            from: process.env.EMAIL_USER,  // Sender address from .env
            to: email,                    // Recipient address (user's email)
            subject: 'Registration Confirmation', // Subject line
            text: `Hi ${username},\n\nThank you for registering with us! We are excited to have you on board.\n\nBest regards,\nUrbanNest Team` // Email body
        };

        // Send email
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
                return res.status(500).send("Error sending email: " + error.message);  // Return error to client
            }
            console.log('Email sent: ' + info.response);
            res.status(201).send("User registered successfully, and confirmation email sent!");  // Return success to client
        });

    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
