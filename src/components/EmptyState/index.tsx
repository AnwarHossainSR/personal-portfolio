'use client';

import { useRouter } from 'next/navigation';

import Button from './Button';
import Heading from './Heading';

interface EmptyStateProps {
  title?: string;
  subtitle?: string;
  showReset?: boolean;
  label?: string;
  reset?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No exact matches',
  subtitle = 'Try changing or removing some of your filters.',
  label = 'Remove all filters',
  showReset,
  reset,
}) => {
  const router = useRouter();

  return (
    <div
      style={{
        height: '60vh',
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Heading center title={title} subtitle={subtitle} />
      <div
        style={{
          width: '12rem',
          marginTop: '1rem',
          display: 'flex',
          flexDirection: 'row',
          gap: '0.5rem',
        }}
      >
        {showReset && (
          <Button
            outline
            label={label ?? 'Remove all filters'}
            onClick={() => reset && reset()}
          />
        )}
        <Button outline label="Go Back" onClick={() => router.push('/')} />
      </div>
    </div>
  );
};

export default EmptyState;
