/* eslint-disable @next/next/no-img-element */
type FloatinDivProps = {
  img: any;
  text1: string;
  text2: string;
};

const FloatinDiv = ({ img, text1, text2 }: FloatinDivProps) => {
  return (
    // darkMode
    <div className="floatingDiv">
      <img src={img} alt="" />
      <span>
        {text1}
        <br />
        {text2}
      </span>
    </div>
  );
};

export default FloatinDiv;
