const SelfCard = ({ data }) => {
  return (
    <div className="description">
      <div className="description-heading">{data?.heading}</div>
      <div className="description-content">
        <p>{data?.content1}</p>
        <p>{data?.content2}</p>
        <p>{data?.content3}</p>
      </div>
    </div>
  );
};

export default SelfCard;
