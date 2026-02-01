import React, { useEffect, useState } from "react";
import { fetchEvents } from "./api";
import EventList from "./components/EventList";

function App() {
  const [events, setEvents] = useState([]);

  const loadEvents = async () => {
    const res = await fetchEvents();
    setEvents(res.data);
  };

  useEffect(() => {
    loadEvents();
    const interval = setInterval(loadEvents, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>GitHub Activity Feed</h1>
        <p style={styles.subtitle}>
          Latest repository actions (auto-refreshes every 15 seconds)
        </p>

        <EventList events={events} />
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    paddingTop: "40px",
  },
  container: {
    width: "100%",
    maxWidth: "720px",
    background: "#fff",
    padding: "24px",
    borderRadius: "8px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
  },
  title: {
    fontSize: "28px",
    fontWeight: "600",
    marginBottom: "6px",
  },
  subtitle: {
    fontSize: "14px",
    color: "#666",
    marginBottom: "24px",
  },
};

export default App;
