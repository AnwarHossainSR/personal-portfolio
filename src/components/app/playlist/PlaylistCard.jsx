const PlaylistCard = ({ title, link }) => {
  return (
    <iframe
      width="380"
      height="200"
      src={`https://www.youtube.com/embed/${link}`}
      title={title}
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
      //sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin"
    />
  );
};

export default PlaylistCard;
