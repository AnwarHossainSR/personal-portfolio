type TabProps = {
  text: string;
  className: string;
  handleEvent: any;
};

const Tab = ({ text, className, handleEvent }: TabProps) => {
  return (
    <span className={className} onClick={handleEvent}>
      {text}
    </span>
  );
};

export default Tab;
