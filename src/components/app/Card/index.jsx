const Card = ({ emoji, heading, detail, darkMode }) => {
  return (
    <div
      className="card"
      style={{ backgroundColor: darkMode ? 'var(--black)' : '' }}
    >
      <img src={emoji} alt="" />
      <span>{heading}</span>
      <span>{detail}</span>
      <button className="c-button">LEARN MORE</button>
    </div>
  );
};

export default Card;
