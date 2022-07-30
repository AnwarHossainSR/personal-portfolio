import { GoTriangleRight } from 'react-icons/go';

const Technology = ({ technology }) => {
  return (
    <li>
      <span>
        <GoTriangleRight
          style={{ color: 'var(--orange)', fontSize: '.6rem' }}
        />
      </span>
      <span style={{ marginLeft: 5 }}>{technology}</span>
    </li>
  );
};

export default Technology;
