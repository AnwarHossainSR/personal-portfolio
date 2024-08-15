import Alert from '@/components/common/Alert';
import ConfirmationDialog from '@/components/common/ConfirmationDialog';
import { ThemeProvider } from '@/providers/context/Context';
import { NotificationProvider } from '@/providers/context/NotificationProvider';
import { QueryProvider } from '@/providers/query';
import '@/styles/index.scss';
import type { ChildrenProps } from '@/types';

export default async function RootLayout({ children }: ChildrenProps) {
  return (
    <html lang="en">
      <body>
        <NotificationProvider>
          <ThemeProvider>
            <QueryProvider>{children}</QueryProvider>
          </ThemeProvider>
          <Alert />
          <ConfirmationDialog />
        </NotificationProvider>
      </body>
    </html>
  );
}
