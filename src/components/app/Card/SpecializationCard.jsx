const SpecializationCard = ({ Icon, title, description, darkMode }) => {
  return (
    <div className="specialization--card">
      <div className="specialization--card--image">
        <Icon style={{ color: 'var(--orange)', fontSize: 70 }} />
      </div>
      <div
        className="specialization--card--heading"
        style={{ color: !darkMode && '#ffffff' }}
      >
        {title}
      </div>
      <div className="specialization--card--body">{description}</div>
    </div>
  );
};

export default SpecializationCard;
