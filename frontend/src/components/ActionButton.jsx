   const ActionButton = ({ icon, label }) => (
  <button style={{
    display: "flex",
    alignItems: "center",
    gap: "8px",
    background: "none",
    border: "none",
    padding: "10px",
    cursor: "pointer",
    borderRadius: "4px",
    color: "#666",
    fontWeight: "600",
    fontSize: "14px"
  }}>
    <span>{icon}</span> {label}
  </button>
);

export default ActionButton