const StatsCard = ({ title, value }) => {
  return (
    <div style={cardStyle}>
      <h3>{title}</h3>
      <h2>{value}</h2>
    </div>
  );
};

const cardStyle = {
  background: "#fff",
  padding: "20px",
  borderRadius: "10px",
  boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  width: "200px",
  textAlign: "center"
};

export default StatsCard;