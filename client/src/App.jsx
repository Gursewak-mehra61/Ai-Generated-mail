import React, { useState } from "react";
import axios from "axios";

function App() {
  const [recipients, setRecipients] = useState("");
  const [prompt, setPrompt] = useState("");
  const [generatedEmail, setGeneratedEmail] = useState("");
  const [editableEmail, setEditableEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sentStatus, setSentStatus] = useState("");

  const generateEmail = async () => {
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/generate", {
        prompt,
      });
      setGeneratedEmail(res.data.generatedText);
      setEditableEmail(res.data.generatedText);
      setSentStatus("");
    } catch (err) {
      console.error(err);
      alert("Error generating email.");
    } finally {
      setLoading(false);
    }
  };

  const sendEmail = async () => {
    try {
      const res = await axios.post("http://localhost:5000/send", {
        recipients,
        content: editableEmail,
      });
      setSentStatus(" Email sent successfully!");
    } catch (err) {
      console.error(err);
      setSentStatus(" Failed to send email.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-2xl p-8">
        <h1 className="text-4xl font-extrabold text-center mb-6 text-blue-600">
           AI Email Generator
        </h1>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Recipients (comma-separated emails)"
            className="w-full border border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={recipients}
            onChange={(e) => setRecipients(e.target.value)}
          />

          <textarea
            placeholder="Enter your prompt..."
            className="w-full border border-gray-300 rounded-md p-3 h-28 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />

          <button
            className="w-full bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700 transition"
            onClick={generateEmail}
            disabled={loading}
          >
            {loading ? "Generating..." : "Generate Email"}
          </button>
        </div>

        {generatedEmail && (
          <>
            <h2 className="text-2xl font-bold mt-8 mb-2 text-gray-700"> Editable Email</h2>
            <textarea
              className="w-full border border-gray-300 rounded-md p-3 h-56 resize-none focus:outline-none focus:ring-2 focus:ring-green-400"
              value={editableEmail}
              onChange={(e) => setEditableEmail(e.target.value)}
            />
            <button
              className="w-full bg-green-600 text-white py-3 rounded-md font-semibold hover:bg-green-700 transition mt-4"
              onClick={sendEmail}
            >
              Send Email
            </button>
          </>
        )}

        {sentStatus && (
          <div className="mt-6 text-center text-lg font-medium text-gray-700">
            {sentStatus}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
