const StateCard = ({ darkMode }: { darkMode: boolean }) => {
  return (
    <div
      className={`p-5 rounded text-center ${
        darkMode ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-900'
      }`}
    >
      <h2 className="text-lg mb-2">Total Visits</h2>
      <p className="text-2xl font-bold">545</p>
    </div>
  );
};

export default StateCard;
