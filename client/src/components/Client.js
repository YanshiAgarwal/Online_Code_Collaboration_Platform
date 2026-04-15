import React from "react";
import Avatar from "react-avatar";

function Client({ username }) {
  return (
    <div className="participant-card">
      <Avatar name={username} size="42" round="12px" />
      <span>{username}</span>
    </div>
  );
}

export default Client;
