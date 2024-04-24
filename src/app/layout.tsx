import { ThemeProvider } from '@/providers/context/Context';
import '@/styles/main.scss';
import type { ChildrenProps } from '@/types';

export default async function RootLayout({ children }: ChildrenProps) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
