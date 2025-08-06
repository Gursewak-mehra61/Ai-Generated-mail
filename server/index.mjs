import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { generateText } from 'ai';
import { groq } from '@ai-sdk/groq';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ AI Email Generator
app.post('/generate', async (req, res) => {
  const { prompt } = req.body;

  try {
    const result = await generateText({
      model: groq('llama3-8b-8192'), // You can use 70b as well
      prompt,
    });

    res.json({ generatedText: result.text });
  } catch (err) {
    console.error("Groq error:", err.message);
    res.status(500).json({ error: 'Failed to generate email.' });
  }
});

// ✅ Email Sender
app.post('/send', async (req, res) => {
  const { recipients, content } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // App password
      }
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: recipients,
      subject: "AI Generated Email",
      text: content,
    });

    res.json({ message: "Email sent successfully." });
  } catch (err) {
    console.error("Send error:", err.message);
    res.status(500).json({ error: 'Failed to send email.' });
  }
});

app.listen(5000, () => {
  console.log("✅ Server running at http://localhost:5000");
});
