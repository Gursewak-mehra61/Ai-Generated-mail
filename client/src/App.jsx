import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

function App() {
  const [recipients, setRecipients] = useState("");
  const [prompt, setPrompt] = useState("");
  const [generatedText, setGeneratedText] = useState('');
  const [generatedEmail, setGeneratedEmail] = useState("");
  const [editableEmail, setEditableEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sentStatus, setSentStatus] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const rippleCanvasRef = useRef(null);

  // Particle effect for background
  useEffect(() => {
    const canvas = document.getElementById('particles');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particles = [];
    const particleCount = 30;
    
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.3 + 0.1
      });
    }
    
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
        
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(139, 92, 246, ${particle.opacity})`;
        ctx.fill();
      });
      
      requestAnimationFrame(animate);
    }
    
    animate();
  }, []);

  // Ripple effect for background
  useEffect(() => {
    const canvas = rippleCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    // Responsive resize
    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener('resize', handleResize);

    // Ripple state
    const ripples = [];
    const maxRipples = 4;
    const rippleInterval = 1800; // ms
    let lastRipple = Date.now();

    function addRipple() {
      const centerX = width / 2 + (Math.random() - 0.5) * width * 0.2;
      const centerY = height / 2 + (Math.random() - 0.5) * height * 0.2;
      ripples.push({
        x: centerX,
        y: centerY,
        radius: 0,
        maxRadius: Math.max(width, height) * (0.4 + Math.random() * 0.2),
        alpha: 0.18 + Math.random() * 0.07,
        color: Math.random() > 0.5 ? 'rgba(139,92,246,ALPHA)' : 'rgba(99,102,241,ALPHA)'
      });
      if (ripples.length > maxRipples) ripples.shift();
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);
      const now = Date.now();
      if (now - lastRipple > rippleInterval) {
        addRipple();
        lastRipple = now;
      }
      ripples.forEach((ripple, i) => {
        ripple.radius += 1.2 + i * 0.2;
        let alpha = ripple.alpha * (1 - ripple.radius / ripple.maxRadius);
        if (alpha < 0) alpha = 0;
        ctx.beginPath();
        ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
        ctx.strokeStyle = ripple.color.replace('ALPHA', alpha.toFixed(3));
        ctx.lineWidth = 2.5;
        ctx.shadowColor = ripple.color.replace('ALPHA', '0.15');
        ctx.shadowBlur = 16;
        ctx.stroke();
      });
      requestAnimationFrame(animate);
    }
    addRipple();
    animate();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const generateEmail = async () => {
    setLoading(true);
    try {
    const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/generate`, { prompt });
      setGeneratedText(res.data.generatedText);
      setGeneratedEmail(res.data.generatedText);
      setEditableEmail(res.data.generatedText);
      setSentStatus("");
      
    } catch (err) {
     console.error("Error:", err.response?.data || err.message);
      showNotification("error", "Error generating email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const sendEmail = async () => {
    console.log("Sending this content:", generatedText);
    try {
     const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/send`, { recipients, content: generatedText, });
      showNotification("success", "Email sent successfully!");
    } catch (err) {
      console.error(err);
      showNotification("error", "Failed to send email. Please try again.");
    }
  };

  const showNotification = (type, message) => {
    setAlertType(type);
    setAlertMessage(message);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 5000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-50 relative overflow-hidden">
      {/* Ripple Effect Canvas */}
      <canvas
        ref={rippleCanvasRef}
        className="absolute inset-0 pointer-events-none z-0"
        style={{ width: '100vw', height: '100vh' }}
      />
      {/* Animated Background Particles */}
      <canvas 
        id="particles" 
        className="absolute inset-0 pointer-events-none opacity-40 z-0"
      />
      {/* ... existing code ... */}
 
      <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.05)_1px,transparent_1px)] bg-[size:60px_60px]" />
      
      {/* Soft Glowing Orbs */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-20 w-80 h-80 bg-indigo-200/30 rounded-full blur-3xl animate-pulse delay-1000" />

      {/* Header */}
      <header className="relative bg-white/80 backdrop-blur-xl border-b border-slate-200/60 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30">
                  {/* Envelope + Sparkle SVG, theme colors */}
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24">
                    <rect x="3" y="7" width="18" height="10" rx="3" fill="#fff" fillOpacity="0.85" />
                    <path d="M3 7l9 6 9-6" stroke="#9333ea" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                    <rect x="3" y="7" width="18" height="10" rx="3" stroke="#7c3aed" strokeWidth="1.5" />
                    <path d="M17.5 3.5l.5 1.5 1.5.5-1.5.5-.5 1.5-.5-1.5-1.5-.5 1.5-.5.5-1.5z" fill="#facc15" fillOpacity="0.95" />
                  </svg>
                </div>
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl blur opacity-20" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                  AI Email Generator
                </h1>
                <p className="text-slate-600 text-sm">AI-Powered Email Automation</p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="hidden sm:flex items-center space-x-3 text-slate-600">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
                <span className="text-sm font-medium">System Online</span>
              </div>
              <div className="flex items-center space-x-2 bg-purple-50 rounded-full px-4 py-2 border border-purple-200">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm text-slate-700 font-medium">Ready</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Panel - Input Form */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-slate-200/60 overflow-hidden transform hover:scale-[1.01] transition-all duration-300">
              <div className="px-8 py-6 border-b border-slate-200/60 bg-gradient-to-r from-purple-50 to-indigo-50">
                <h2 className="text-xl font-bold text-slate-900 mb-2">Email Configuration</h2>
                <p className="text-slate-600 text-sm">Configure your AI-powered email settings</p>
              </div>
              
              <div className="p-8 space-y-8">
                {/* Recipients Input */}
                <div className="space-y-3">
                  <label htmlFor="recipients" className="block text-sm font-semibold text-slate-700">
                    Recipients
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-grey-800 group-focus-within:text-purple-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <input
                      id="recipients"
                      type="text"
                      placeholder="Enter email addresses (comma-separated)"
                      className="block w-full pl-12 pr-4 py-4 bg-white/60 border border-slate-300 rounded-2xl text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                      value={recipients}
                      onChange={(e) => setRecipients(e.target.value)}
                    />
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/10 to-indigo-500/10 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 -z-10 blur-xl" />
                  </div>
                  <p className="text-xs text-slate-500">Separate multiple emails with commas</p>
                </div>

                {/* Prompt Input */}
                <div className="space-y-3">
                  <label htmlFor="prompt" className="block text-sm font-semibold text-slate-700">
                    AI Prompt
                  </label>
                  <div className="relative group">
                    <div className="absolute top-4 left-4 pointer-events-none">
                      <svg className="h-5 w-5 text-grey-800 group-focus-within:text-purple-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <textarea
                      id="prompt"
                      placeholder="Describe the email you want to generate..."
                      className="block w-full pl-12 pr-4 py-4 bg-white/60 border border-slate-300 rounded-2xl text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 resize-none backdrop-blur-sm"
                      rows={4}
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                    />
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/10 to-indigo-500/10 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 -z-10 blur-xl" />
                  </div>
                  <p className="text-xs text-slate-500">Be specific about tone, content, and purpose</p>
                </div>

                {/* Generate Button */}
                <button
                  onClick={generateEmail}
                  disabled={loading || !prompt.trim()}
                  className="w-full bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-500 hover:via-indigo-500 hover:to-purple-600 disabled:from-slate-400 disabled:via-slate-400 disabled:to-slate-500 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-500/30 disabled:transform-none disabled:cursor-not-allowed flex items-center justify-center space-x-3 relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Generating AI Email...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <span>Generate AI Email</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Right Panel - Generated Email */}
          <div className="lg:col-span-2">
            {generatedEmail ? (
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-slate-200/60 overflow-hidden transform hover:scale-[1.01] transition-all duration-300">
                <div className="px-8 py-6 border-b border-slate-200/60 bg-gradient-to-r from-purple-50 to-indigo-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-slate-900 mb-2">Generated Email</h2>
                      <p className="text-slate-600 text-sm">Review and edit your AI-generated email</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-ping" />
                      <span className="text-sm text-green-600 font-medium">Ready to send</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-8">
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <label htmlFor="editableEmail" className="block text-sm font-semibold text-slate-700">
                        Email Content
                      </label>
                      <div className="relative group">
                        <textarea
                          id="editableEmail"
                          className="block w-full px-6 py-4 bg-white/60 border border-slate-300 rounded-2xl text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 resize-none backdrop-blur-sm"
                          rows={12}
                          value={editableEmail}
                          onChange={(e) => setEditableEmail(e.target.value)}
                          placeholder="Your AI-generated email will appear here..."
                        />
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 -z-10 blur-xl" />
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-6">
                      <div className="flex items-center space-x-6">
                        <div className="flex items-center space-x-2 text-sm text-slate-600">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>{editableEmail.length} characters</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-slate-600">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>AI Enhanced</span>
                        </div>
                      </div>
                      
                      <button
                        onClick={sendEmail}
                        disabled={!recipients.trim() || !editableEmail.trim()}
                        className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 hover:from-green-500 hover:via-emerald-500 hover:to-teal-500 disabled:from-slate-400 disabled:via-slate-400 disabled:to-slate-500 text-white font-bold py-3 px-8 rounded-2xl transition-all duration-300 transform hover:scale-[1.05] hover:shadow-xl hover:shadow-green-500/30 disabled:transform-none disabled:cursor-not-allowed flex items-center space-x-3 relative overflow-hidden group"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                        <span>Send Email</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-slate-200/60 overflow-hidden">
                <div className="px-8 py-6 border-b border-slate-200/60 bg-gradient-to-r from-purple-50 to-indigo-50">
                  <h2 className="text-xl font-bold text-slate-900 mb-2">Generated Email</h2>
                  <p className="text-slate-600 text-sm">Your AI-generated email will appear here</p>
                </div>
                
                <div className="p-16 text-center">
                  <div className="relative">
                    <div className="w-24 h-24 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6 border border-purple-200">
                      <svg className="w-12 h-12 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="absolute inset-0 w-24 h-24 bg-gradient-to-r from-purple-200 to-indigo-200 rounded-full blur-xl animate-pulse opacity-50" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">No email generated yet</h3>
                  <p className="text-slate-600">Enter a prompt and click "Generate AI Email" to get started</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Animated Status Messages */}
        {showAlert && (
          <div className="fixed top-24 right-8 z-50 animate-slide-in">
            <div className={`rounded-2xl p-6 shadow-2xl backdrop-blur-xl border ${
              alertType === "success" 
                ? "bg-green-50 border-green-200 text-green-800" 
                : "bg-red-50 border-red-200 text-red-800"
            } transform transition-all duration-500 hover:scale-105`}>
              <div className="flex items-center space-x-4">
                {alertType === "success" ? (
                  <>
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">Success!</h4>
                      <p className="text-sm opacity-90">{alertMessage}</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">Error</h4>
                      <p className="text-sm opacity-90">{alertMessage}</p>
                    </div>
                  </>
                )}
              </div>
              <div className="absolute top-2 right-2">
                <button 
                  onClick={() => setShowAlert(false)}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}

export default App;