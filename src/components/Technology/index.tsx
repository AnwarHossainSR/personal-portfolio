import { GoTriangleRight } from 'react-icons/go';

const Technology = ({ technology }: { technology: string }) => {
  return (
    <li
      style={{
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <span>
        <GoTriangleRight
          style={{ color: 'var(--orange)', fontSize: '.6rem' }}
        />
      </span>
      <span style={{ marginLeft: 5 }}>{technology}</span>

      {/* <span style={{ marginLeft: 5 }}>{technology}</span> */}
    </li>
  );
};

export default Technology;
