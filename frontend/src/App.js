import React, { useState } from 'react';
import axios from 'axios';
import { ShieldCheck, AlertTriangle, Link, FileText, Mic, Globe, Info, Loader2 } from 'lucide-react';

const API_BASE = 'http://localhost:8000/api';

const App = () => {
  const [activeTab, setActiveTab] = useState('text');
  const [input, setInput] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleAnalyze = async () => {
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      let response;
      if (activeTab === 'text') {
        response = await axios.post(`${API_BASE}/predict-text/`, { text: input });
      } else if (activeTab === 'url') {
        response = await axios.post(`${API_BASE}/analyze-url/`, { url: input });
      } else if (activeTab === 'audio') {
        const formData = new FormData();
        formData.append('audio', file);
        response = await axios.post(`${API_BASE}/predict-audio/`, formData);
      }
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.error || "An error occurred during analysis.");
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'text', label: 'Raw Text', icon: <FileText className="w-5 h-5" /> },
    { id: 'url', label: 'News URL', icon: <Link className="w-5 h-5" /> },
    { id: 'audio', label: 'Audio Clip', icon: <Mic className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <ShieldCheck className="text-white w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">TruthGuard 360</h1>
          </div>
          <div className="text-sm font-medium text-slate-500">AI-Powered Verification</div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-extrabold text-slate-900 mb-4">Guard Your Information.</h2>
          <p className="text-lg text-slate-600">Analyze news, articles, and audio clips for potential misinformation with our neural verification engine.</p>
        </div>

        {/* Tab Selection */}
        <div className="flex justify-center gap-2 mb-8 bg-white p-1.5 rounded-xl shadow-sm border w-fit mx-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setResult(null); setError(null); setInput(''); }}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                activeTab === tab.id 
                ? 'bg-indigo-600 text-white shadow-md' 
                : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Input Area */}
        <div className="bg-white rounded-2xl shadow-xl border p-8 mb-10">
          <div className="space-y-6">
            {activeTab === 'text' && (
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider italic">Input Text Content</label>
                <textarea
                  className="w-full h-48 p-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none transition-all placeholder:text-slate-400"
                  placeholder="Paste the news text or article content here for deep analysis..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
              </div>
            )}

            {activeTab === 'url' && (
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider italic">Article URL</label>
                <div className="relative">
                  <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="url"
                    className="w-full pl-12 pr-4 py-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                    placeholder="https://news-site.com/breaking-news-article"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                  />
                </div>
              </div>
            )}

            {activeTab === 'audio' && (
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-10 text-center">
                <input
                  type="file"
                  id="audio-upload"
                  className="hidden"
                  accept="audio/*"
                  onChange={(e) => setFile(e.target.files[0])}
                />
                <label htmlFor="audio-upload" className="cursor-pointer">
                  <div className="bg-indigo-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mic className="text-indigo-600 w-8 h-8" />
                  </div>
                  <p className="text-slate-700 font-medium">{file ? file.name : "Click to upload audio file"}</p>
                  <p className="text-sm text-slate-400 mt-1">MP3, WAV, or M4A (Max 10MB)</p>
                </label>
              </div>
            )}

            <button
              onClick={handleAnalyze}
              disabled={loading || (!input && !file)}
              className="w-full bg-slate-900 text-white py-4 rounded-xl text-lg font-bold hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin w-5 h-5" />
                  Processing Claim...
                </>
              ) : "Perform Verification"}
            </button>
          </div>
        </div>

        {/* Results Area */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-4 mb-10">
            <AlertTriangle className="text-red-600 w-6 h-6 flex-shrink-0" />
            <p className="text-red-800 font-medium">{error}</p>
          </div>
        )}

        {result && (
          <div className={`rounded-2xl border p-8 animate-in fade-in slide-in-from-bottom-4 duration-500 ${
            result.prediction === 'Real' 
            ? 'bg-emerald-50 border-emerald-100' 
            : 'bg-rose-50 border-rose-100'
          }`}>
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
              <div>
                <p className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-1">Analysis Verdict</p>
                <div className="flex items-center gap-3">
                  <span className={`text-4xl font-black ${result.prediction === 'Real' ? 'text-emerald-700' : 'text-rose-700'}`}>
                    {result.prediction.toUpperCase()}
                  </span>
                  {result.prediction === 'Real' ? (
                    <ShieldCheck className="text-emerald-600 w-8 h-8" />
                  ) : (
                    <AlertTriangle className="text-rose-600 w-8 h-8" />
                  )}
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="bg-white/50 px-6 py-4 rounded-xl border border-white/80 text-center">
                  <p className="text-xs font-bold text-slate-500 uppercase mb-1">Confidence</p>
                  <p className="text-2xl font-bold text-slate-800">{result.confidence}%</p>
                </div>
                <div className="bg-white/50 px-6 py-4 rounded-xl border border-white/80 text-center">
                  <p className="text-xs font-bold text-slate-500 uppercase mb-1">Misinfo Score</p>
                  <p className="text-2xl font-bold text-slate-800">{result.fake_score}/100</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="flex items-center gap-2 font-bold text-slate-800">
                <Info className="w-4 h-4" />
                Explanation & Indicators
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {result.explanation.map((e, idx) => (
                  <div key={idx} className="bg-white/60 p-4 rounded-lg text-sm text-slate-700 border border-white/80">
                    • {e}
                  </div>
                ))}
              </div>
              
              {result.domain_status && (
                <div className="mt-6 pt-6 border-t border-slate-200/50 flex items-center justify-between font-medium">
                  <span className="text-slate-600 italic">Source Credibility Index:</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    result.domain_status === 'Verified Source' ? 'bg-emerald-200 text-emerald-800' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {result.domain_status.toUpperCase()}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <footer className="max-w-5xl mx-auto px-6 py-12 text-center text-slate-400 text-sm">
        <p>© 2024 TruthGuard 360 - Linguistic Pattern Recognition System.</p>
        <p className="mt-2 text-xs">Note: Model predictions are based on statistical training data and may vary in accuracy. Always use multiple sources.</p>
      </footer>
    </div>
  );
};

export default App;
