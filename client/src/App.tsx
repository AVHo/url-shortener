import React, { useState, useEffect } from "react";
import "./App.css";

enum Mode {
  SHORTEN = "SHORTEN",
  GET_FULL = "GET_FULL",
}

// Interface for Active URL entries
interface ActiveUrl {
  shortId: string;
  fullUrl: string;
  createdAt: string;
  expiresAt: string;
}

const API_BASE = "http://localhost:3000";

function App() {
  const [mode, setMode] = useState<Mode>(Mode.SHORTEN);

  // Form inputs
  const [inputValue, setInputValue] = useState("");
  const [expiryMinutes, setExpiryMinutes] = useState("");

  // Result/error messages
  const [result, setResult] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // State to store active URLs list
  const [activeUrls, setActiveUrls] = useState<ActiveUrl[]>([]);

  // Clear previous result/error whenever form inputs or mode changes
  useEffect(() => {
    setResult(null);
    setErrorMsg(null);
  }, [mode, inputValue, expiryMinutes]);

  // POST /shorten
  const handleShorten = async () => {
    if (!inputValue) {
      setErrorMsg("Please enter a URL to shorten.");
      return;
    }
  
    // Define a regular expression to validate the URL.
    // This regex checks for a proper protocol and domain
    const urlRegex = new RegExp(
      // This regex ensures the URL starts with http:// or https:// and then has some valid domain content.
      "^(https?:\\/\\/)" + // protocol
        "((([a-zA-Z0-9\\-]+\\.)+[a-zA-Z]{2,})|" + // domain name
        "localhost|" + // localhost
        "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
        "(\\:\\d+)?(\\/[-a-zA-Z0-9@:%_\\+.~#?&//=]*)?$",
      "i"
    );
  
    // Validate the input URL using the regex
    if (!urlRegex.test(inputValue)) {
      setErrorMsg("Please enter a valid URL (must start with http:// or https://).");
      return;
    }
    try {
      // Build the request payload
      const payload: Record<string, any> = { url: inputValue };

      // If user specified expiry in minutes, include it
      if (expiryMinutes) {
        payload.expiryMinutes = parseInt(expiryMinutes, 10);
      }

      const response = await fetch(`${API_BASE}/shorten`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errData = await response.json();
        setErrorMsg(errData.error || "Error creating shortened URL.");
        return;
      }

      const data = await response.json();
      setResult(
        `Shortened URL: ${data.shortenedUrl} (Expires at: ${data.expiresAt})`
      );
    } catch (error) {
      console.error(error);
      setErrorMsg("Network error or server not reachable.");
    }
  };

  // GET /:shortUrl
  const handleGetFull = async () => {
    try {
      const response = await fetch(`${API_BASE}/${inputValue}`);
      if (!response.ok) {
        const errData = await response.json();
        setErrorMsg(errData.error || "Error retrieving full URL.");
        return;
      }

      const data = await response.json();
      setResult(`Full URL: ${data.fullUrl}`);
    } catch (error) {
      console.error(error);
      setErrorMsg("Network error or server not reachable.");
    }
  };

  // GET /active
  const handleGetActiveUrls = async () => {
    // Clear old result/error
    setResult(null);
    setErrorMsg(null);
    setActiveUrls([]); // Clear previous active URLs list if you wish

    try {
      const response = await fetch(`${API_BASE}/active`);
      if (!response.ok) {
        const errData = await response.json();
        setErrorMsg(errData.error || "Error retrieving active URLs.");
        return;
      }

      const data = await response.json();
      setActiveUrls(data);
    } catch (error) {
      console.error(error);
      setErrorMsg("Network error or server not reachable.");
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Clear the inputs immediately upon button click
    setInputValue("");
    setExpiryMinutes("");

    if (mode === Mode.SHORTEN) {
      if (!inputValue) {
        setErrorMsg("Please enter a URL to shorten.");
        return;
      }
      handleShorten();
    } else {
      if (!inputValue) {
        setErrorMsg("Please enter a short URL id.");
        return;
      }
      handleGetFull();
    }
  };

  return (
    <div className="container">
      <h1>URL Shortener</h1>

      <div className="mode-toggle">
        <label style={{ marginRight: "1em" }}>
          <input
            type="radio"
            value={Mode.SHORTEN}
            checked={mode === Mode.SHORTEN}
            onChange={() => setMode(Mode.SHORTEN)}
          />
          Shorten URL
        </label>

        <label>
          <input
            type="radio"
            value={Mode.GET_FULL}
            checked={mode === Mode.GET_FULL}
            onChange={() => setMode(Mode.GET_FULL)}
          />
          Get Full URL
        </label>
      </div>

      <form onSubmit={handleSubmit}>
        {mode === Mode.SHORTEN ? (
          <>
            <div className="instructions">
              Enter the <strong>full</strong> URL you want to shorten:
            </div>
            <input
              type="text"
              placeholder="e.g. https://www.example.com/long/path"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />

            <div className="instructions">
              (Optional) Enter <strong>expiration in minutes</strong>.
              <br />
              If left blank, <strong>defaults to 24 hours</strong>.
            </div>
            <input
              type="number"
              min="0"
              placeholder="e.g. 60 for 1 hour"
              value={expiryMinutes}
              onChange={(e) => setExpiryMinutes(e.target.value)}
            />

            <button type="submit">Shorten</button>
          </>
        ) : (
          <>
            <div className="instructions">
              Enter the <strong>short URL id</strong> (the part after the slash).
            </div>
            <input
              type="text"
              placeholder="e.g. abc12345"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <button type="submit">Get Full URL</button>
          </>
        )}
      </form>

      <div style={{ marginTop: "1rem" }}>
        <button onClick={handleGetActiveUrls}>Get Active URLs</button>
      </div>

      {/* Show error messages, if any */}
      {errorMsg && (
        <div
          className="result"
          style={{ background: "#ffebee", borderLeftColor: "#c62828" }}
        >
          <p style={{ color: "#c62828" }}>{errorMsg}</p>
        </div>
      )}

      {/* Show success or general result */}
      {result && (
        <div className="result">
          <p>{result}</p>
        </div>
      )}

      {/* Display active URLs if any are returned */}
      {activeUrls.length > 0 && (
        <div className="result">
          <h2>Active URLs:</h2>
          <ul>
            {activeUrls.map((item) => (
              <li key={item.shortId}>
                <strong>{item.shortId}</strong> → {item.fullUrl}
                <br />
                <small>
                  Expires at: {new Date(item.expiresAt).toLocaleString()}
                </small>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
