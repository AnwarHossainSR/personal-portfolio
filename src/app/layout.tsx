import { ThemeProvider } from '@/providers/context/Context';
import { QueryProvider } from '@/providers/query';
import '@/styles/index.scss';
import type { ChildrenProps } from '@/types';

export default async function RootLayout({ children }: ChildrenProps) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <QueryProvider>{children}</QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
