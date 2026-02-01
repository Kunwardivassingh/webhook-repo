import React from "react";

const formatEvent = (event) => {
  if (event.action === "PUSH") {
    return `${event.author} pushed to ${event.to_branch} on ${event.timestamp}`;
  }

  if (event.action === "PULL_REQUEST") {
    return `${event.author} submitted a pull request from ${event.from_branch} to ${event.to_branch} on ${event.timestamp}`;
  }

  if (event.action === "MERGE") {
    return `${event.author} merged branch ${event.from_branch} to ${event.to_branch} on ${event.timestamp}`;
  }
};

export default function EventList({ events }) {
  return (
    <div>
      {events.map((event, index) => (
        <p key={index}>{formatEvent(event)}</p>
      ))}
    </div>
  );
}
