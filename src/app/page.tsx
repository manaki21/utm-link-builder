"use client";
import React, { useState, useEffect } from "react";

const SOURCES = [
  "google", "twitter", "linkedin", "instagram", "youtube", "signature", "newsletter", "referral", "direct", "affiliate", "display", "partner", "webinar", "outreach", "drip"
];
const MEDIUMS = [
  "social", "paid_social", "email", "paid_ad", "banner", "video", "referral", "organic", "print", "t-shirt", "podcast", "influencer", "signature", "event"
];

type HistoryItem = {
  url: string;
  campaign: string;
  timestamp: number;
};

export default function Home() {
  const [baseUrl, setBaseUrl] = useState("");
  const [source, setSource] = useState(SOURCES[0]);
  const [medium, setMedium] = useState(MEDIUMS[0]);
  const [campaign, setCampaign] = useState("");
  const [utmUrl, setUtmUrl] = useState("");
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("utm_history");
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  const generateUtmUrl = () => {
    const params = new URLSearchParams();
    if (source) params.set("utm_source", source);
    if (medium) params.set("utm_medium", medium);
    if (campaign) params.set("utm_campaign", campaign);
    let url = baseUrl;
    if (baseUrl && (source || medium || campaign)) {
      url += (baseUrl.includes("?") ? "&" : "?") + params.toString();
    }
    setUtmUrl(url);
    saveToHistory(url);
  };

  const saveToHistory = (url: string) => {
    if (!url || !campaign) return;
    const newItem = { url, campaign, timestamp: Date.now() };
    const newHistory = [newItem, ...history].slice(0, 50);
    setHistory(newHistory);
    localStorage.setItem("utm_history", JSON.stringify(newHistory));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const deleteHistoryItem = (timestamp: number) => {
    const newHistory = history.filter(item => item.timestamp !== timestamp);
    setHistory(newHistory);
    localStorage.setItem("utm_history", JSON.stringify(newHistory));
  };

  const clearAll = () => {
    setHistory([]);
    localStorage.removeItem("utm_history");
  };

  const filteredHistory = history.filter(item =>
    item.campaign.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main
      className="min-h-screen flex items-center justify-center bg-[#785aef] p-4"
    >
      <div className="w-full max-w-xl bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-primary mb-4 text-center" style={{ fontFamily: 'Comfortaa, cursive' }}>UTM Link Builder</h1>
        <div className="space-y-4" style={{ fontFamily: 'Open Sans, sans-serif' }}>
          <div>
            <label className="block font-medium mb-1">Base URL <span className="text-accent">*</span></label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="https://yourwebsite.com/page"
              value={baseUrl}
              onChange={e => { setBaseUrl(e.target.value); }}
              required
            />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block font-medium mb-1">Source</label>
              <select
                className="w-full border rounded px-3 py-2"
                value={source}
                onChange={e => { setSource(e.target.value); }}
              >
                {SOURCES.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="block font-medium mb-1">Medium</label>
              <select
                className="w-full border rounded px-3 py-2"
                value={medium}
                onChange={e => { setMedium(e.target.value); }}
              >
                {MEDIUMS.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block font-medium mb-1">Campaign</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2"
              placeholder="e.g. q4_launch"
              value={campaign}
              onChange={e => { setCampaign(e.target.value); }}
            />
          </div>
          <button
            className="bg-accent text-white px-4 py-2 rounded hover:bg-primary transition w-full font-bold mt-2"
            onClick={generateUtmUrl}
            disabled={!baseUrl}
          >
            Apply
          </button>
        </div>
        <div className="mt-6">
          <label className="block font-medium mb-1">UTM Link</label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              className="w-full border rounded px-3 py-2 bg-gray-100"
              value={utmUrl}
              readOnly
            />
            <button
              className="bg-primary text-white px-4 py-2 rounded hover:bg-accent transition"
              onClick={() => copyToClipboard(utmUrl)}
              disabled={!utmUrl}
            >
              Copy
            </button>
          </div>
        </div>
        {/* History Section */}
        <div className="w-full bg-white rounded-lg shadow p-6 mt-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-primary" style={{ fontFamily: 'Comfortaa, cursive' }}>History</h2>
            <button
              className="text-accent underline"
              onClick={clearAll}
              disabled={history.length === 0}
            >
              Clear All
            </button>
          </div>
          <input
            type="text"
            className="w-full border rounded px-3 py-2 mb-4"
            placeholder="Search by campaign..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {filteredHistory.length === 0 && (
              <div className="text-gray-400 text-center">No history yet.</div>
            )}
            {filteredHistory.map(item => (
              <div key={item.timestamp} className="flex items-center justify-between bg-gray-50 border rounded px-3 py-2">
                <div>
                  <div className="font-medium">{item.campaign}</div>
                  <div className="text-xs text-gray-500">{new Date(item.timestamp).toLocaleString()}</div>
                  <div className="text-xs text-blue-700 break-all">{item.url}</div>
                </div>
                <div className="flex flex-col gap-2 ml-2">
                  <button
                    className="bg-primary text-white px-2 py-1 rounded text-xs"
                    onClick={() => copyToClipboard(item.url)}
                  >
                    Copy
                  </button>
                  <button
                    className="text-accent text-xs underline"
                    onClick={() => deleteHistoryItem(item.timestamp)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <footer className="mt-8 text-center text-gray-400 text-xs">
          &copy; {new Date().getFullYear()} UTM Link Builder
        </footer>
      </div>
    </main>
  );
}
