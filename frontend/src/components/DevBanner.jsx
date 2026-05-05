import React from "react";

const DevBanner = () => {
  // You can easily update this string whenever you change tasks
  const currentFocus = " mobile screen layout & UI";

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
      }}
    >
      <div
        style={{
          backgroundColor: "#fff3cd", // Warning yellow
          color: "#856404",
          padding: "10px 20px",
          textAlign: "center",
          borderBottom: "1px solid #ffeeba",
          fontSize: "14px",
          fontWeight: "500",
          
        }}
      >
        🚧 <strong>Under Development:</strong> Pneuma is currently being built.
        Right now, I'm working on:{" "}
        <span style={{ textDecoration: "underline" }}>{currentFocus}</span>.
        Expect some dust!
      </div>
    </div>
  );
};

export default DevBanner;
