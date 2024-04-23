import Image from "next/image";

type CardProps = {
  emoji: any;
  heading: string;
  detail: string;
  darkMode: boolean;
};

const Card = ({ emoji, heading, detail, darkMode }:CardProps) => {
  return (
    <div
      className="card"
      style={{ backgroundColor: darkMode ? 'var(--black)' : '' }}
    >
      <Image src={emoji} alt="" />
      <span>{heading}</span>
      <span>{detail}</span>
      <button className="c-button">LEARN MORE</button>
    </div>
  );
};

export default Card;
