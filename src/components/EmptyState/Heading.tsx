'use client';

interface HeadingProps {
  title: string;
  subtitle?: string;
  center?: boolean;
}

const Heading: React.FC<HeadingProps> = ({ title, subtitle, center }) => {
  return (
    <div style={{ textAlign: center ? 'center' : 'start' }}>
      <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{title}</div>
      <div
        style={{
          fontSize: '1rem',
          fontWeight: '300',
          marginTop: '0.5rem',
          color: '#a0aec0',
        }}
      >
        {subtitle}
      </div>
    </div>
  );
};

export default Heading;
