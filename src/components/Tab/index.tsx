/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
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
