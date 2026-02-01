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
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>GitHub Activity Feed</h2>
      <EventList events={events} />
    </div>
  );
}

export default App;
