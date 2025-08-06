import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { generateText } from 'ai';
import { groq } from '@ai-sdk/groq';

dotenv.config();

const app = express();
app.use(cors({
  origin: "https://ai-generated-mail.vercel.app",  // ✅ Vercel frontend URL
  methods: ["GET", "POST"],
  credentials: true,
}));

app.use(express.json());

// ✅ AI Email Generator
app.post('/api/generate', async (req, res) => {
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
app.post('/api/send', async (req, res) => {
     console.log("🔥 Email request body:", req.body);
  const { recipients, content } = req.body;
console.log("Received email content:", content);
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
     html: `<div style="font-size:16px; line-height:1.6;">${content.replace(/\n/g, '<br/>')}</div>`

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
