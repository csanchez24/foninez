'use client';

import { queryClientConfig } from '@/utils/query';
import { useState } from 'react';

import { Toaster } from '@/components/ui/toaster';
import { type State, StoreProvider } from '@/store';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ThemeProvider } from 'next-themes';

type ProvidersProps = React.PropsWithChildren & Pick<State, 'session' | 'dictionary'>;

export const Providers = ({ children, session, dictionary }: ProvidersProps) => {
  const [queryClient] = useState(() => new QueryClient(queryClientConfig));

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <StoreProvider session={session} dictionary={dictionary}>
          {children}
        </StoreProvider>
        <Toaster />
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};
