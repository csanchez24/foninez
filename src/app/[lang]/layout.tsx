import '../../styles/global.css';

import { Header } from '@/components/header';
import { Nav } from '@/components/nav';
import { Providers } from '@/components/providers';
import NextTopLoader from 'nextjs-toploader';

import { getSession } from '@/auth/libs/server-side-fns';
import { fontSans } from '@/components/fonts';
import { i18n, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/get-dictionary';
import { cn } from '@/utils/cn';

export const dynamic = 'force-dynamic';

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: Locale };
}) {
  const session = getSession();
  const dictionary = await getDictionary(params.lang);

  return (
    <html lang={params.lang} suppressHydrationWarning>
      <body className={cn('min-h-screen font-sans antialiased', fontSans.variable)}>
        <NextTopLoader showSpinner={false} color="hsl(var(--foreground))" />
        <Providers session={session} dictionary={dictionary}>
          <div className="relative flex min-h-screen flex-col">
            <Header lang={params.lang} />
            <main className="flex-1">
              <div className="border-b">
                <div className="md:grid md:grid-cols-[70px_minmax(0,1fr)]">
                  <Nav lang={params.lang} />
                  {children}
                </div>
              </div>
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
