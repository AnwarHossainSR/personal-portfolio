import Image from "next/image";

type ImgProps = {
  project: any;
  handleEvent: any;
};

const ImageCard = ({ project, handleEvent }: ImgProps) => {
  return (
    <Image
      alt={project.title}
      src={project.img}
      onClick={handleEvent}
      height={200}
    />
  );
};

export default ImageCard;
