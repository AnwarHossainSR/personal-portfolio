const StateCard = ({ darkMode }: { darkMode: boolean }) => {
  return (
    <div
      className="stats-card"
      style={{
        backgroundColor: darkMode ? '#1E293B' : 'var(--light)',
        color: darkMode ? 'white' : '',
      }}
    >
      <h2>Total Visits</h2>
      <p
        style={{
          color: darkMode ? 'white' : '',
        }}
      >
        545
      </p>
    </div>
  );
};

export default StateCard;
