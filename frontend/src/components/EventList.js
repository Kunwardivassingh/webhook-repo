import React from "react";

const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);

  return date.toLocaleString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "UTC",
    timeZoneName: "short",
  });
};

const formatText = (event) => {
  // const time = formatTimestamp(event.timestamp);

  if (event.action === "PUSH") {
    return `${event.author} pushed to ${event.to_branch} on ${event.timestamp}`;
  }

  if (event.action === "PULL_REQUEST") {
    return `${event.author} submitted a pull request from ${event.from_branch} to ${event.to_branch} on ${event.timestamp}`;
  }

  if (event.action === "MERGE") {
    return `${event.author} merged branch ${event.from_branch} to ${event.to_branch} on ${event.timestamp}`;
  }

  return "Unknown event";
};

export default function EventList({ events }) {
  if (!events.length) {
    return <p style={{ color: "#777" }}>No activity yet</p>;
  }

  return (
    <div>
      {events.map((event, index) => (
        <div key={index} style={styles.card}>
          <span style={styles.badge}>{event.action}</span>

          <p style={styles.text}>{formatText(event)}</p>

          <p style={styles.time}>{formatTimestamp(event.timestamp)}</p>
        </div>
      ))}
    </div>
  );
}

const styles = {
  card: {
    border: "1px solid #e0e0e0",
    borderRadius: "6px",
    padding: "16px",
    marginBottom: "16px",
    backgroundColor: "#fff",
  },
  badge: {
    display: "inline-block",
    fontSize: "11px",
    fontWeight: "600",
    color: "#000",
    backgroundColor: "#eee",
    padding: "4px 8px",
    borderRadius: "4px",
    marginBottom: "8px",
  },
  text: {
    fontSize: "16px",
    fontWeight: "500",
    marginBottom: "6px",
  },
  time: {
    fontSize: "12px",
    color: "#777",
  },
};
