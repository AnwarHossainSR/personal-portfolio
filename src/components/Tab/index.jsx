const Tab = ({ text, className, handleEvent }) => {
  return (
    <span className={className} onClick={handleEvent}>
      {text}
    </span>
  );
};

export default Tab;
