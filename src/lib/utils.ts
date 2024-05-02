export const cx = (...classNames: unknown[]) =>
  classNames.filter(Boolean).join(' ');

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const myLoader = ({ src }: any) => {
  return src;
};

// display numbers with comma (form string)
export const displayNumbers = (num: number): string =>
  num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

// blog_tag-purple blog_tag-pink blog_tag-teal generate random class from this 3
export const randomTagColorClass = () => {
  const colors = ['purple', 'pink', 'teal', 'orange'];
  return `blog_tag-${colors[Math.floor(Math.random() * colors.length)]}`;
};
