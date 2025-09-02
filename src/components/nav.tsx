'use client';

import type { Locale } from '@/i18n/config';

import { Icons } from '@/components/icons';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import Link from 'next/link';

import { usePermissions } from '@/hooks/use-permissions';
import { useStoreContext } from '@/store';
import { cn } from '@/utils/cn';
import { usePathname } from 'next/navigation';
import { useMemo, useState } from 'react';

export const Nav = ({ lang }: { lang: Locale }) => {
  const _pathname = usePathname();

  const [pathname, setPathname] = useState(() => _pathname);

  const dictionary = useStoreContext((state) => state.dictionary.misc.nav);

  const { getPermission } = usePermissions({
    include: [
      'manage:dashboard',
      'manage:proofFileClassification',
      'manage:plan',
      'manage:program',
      'manage:planModalityActivitySchool',
      'manage:school',
      'manage:professional',
      'manage:child',
      'manage:inventoryTransaction',
    ],
  });

  const navbarItems = useMemo(
    () => [
      ...(getPermission('read:dashboard').granted
        ? [
            {
              icon: Icons.LineChart,
              label: dictionary.dashboard,
              href: `/${lang}/dashboard`,
              matches: ['/dashboard', `/${lang}/dashboard`],
            },
          ]
        : []),
      ...(getPermission('read:plan').granted
        ? [
            {
              icon: Icons.Tasks,
              label: dictionary.plans,
              href: `/${lang}/plans`,
              matches: ['/plans', `/${lang}/plans`],
            },
          ]
        : []),
      ...(getPermission('read:planModalityActivitySchool').granted
        ? [
            {
              icon: Icons.Layers,
              label: dictionary.activities,
              href: `/${lang}/activities`,
              matches: ['/activities', `/${lang}/activities`],
            },
          ]
        : []),
      ...(getPermission('read:school').granted
        ? [
            {
              icon: Icons.School,
              label: dictionary.schools,
              href: `/${lang}/schools`,
              matches: ['/schools', `/${lang}/schools`],
            },
          ]
        : []),
      ...(getPermission('read:professional').granted
        ? [
            {
              icon: Icons.HandShake,
              label: dictionary.professionals,
              href: `/${lang}/professionals`,
              matches: ['/professionals', `/${lang}/professionals`],
            },
          ]
        : []),
      ...(getPermission('read:child').granted
        ? [
            {
              icon: Icons.Users,
              label: dictionary.children,
              href: `/${lang}/children`,
              matches: ['/children', `/${lang}/children`],
            },
          ]
        : []),
      ...(getPermission('read:resource').granted
        ? [
            {
              icon: Icons.Blocks,
              label: dictionary.resources,
              href: `/${lang}/resources`,
              matches: ['/resources', `/${lang}/resources`],
            },
          ]
        : []),
      ...(getPermission('read:inventoryTransaction').granted
        ? [
            {
              icon: Icons.Tally,
              label: dictionary.inventoryTransactions,
              href: `/${lang}/inventory-transactions`,
              matches: ['/inventory-transactions', `/${lang}/inventory-transactions`],
            },
          ]
        : []),
      ...(getPermission('read:proofFileClassification').granted
        ? [
            {
              icon: Icons.FileText,
              label: dictionary.classification,
              href: `/${lang}/classifications`,
              matches: ['/classifications', `/${lang}/classifications`],
            },
          ]
        : []),
      ...(getPermission('read:program').granted
        ? [
            {
              icon: Icons.ArchiveIcon,
              label: dictionary.programs,
              href: `/${lang}/programs`,
              matches: ['/programs', `/${lang}/programs`],
            },
          ]
        : []),
      ...(getPermission('read:report').granted
        ? [
            {
              icon: Icons.FileBarChart,
              label: dictionary.reports,
              href: `/${lang}/reports`,
              matches: ['/reports', `/${lang}/reports`],
            },
          ]
        : []),
    ],
    [dictionary, lang, getPermission]
  );

  return (
    <aside className="fixed top-14 z-30 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 border-r md:sticky md:block">
      <ScrollArea className="h-full py-4">
        <ul className="flex flex-col items-center space-y-0.5">
          {navbarItems.map(({ icon: Icon, ...nav }) => (
            <li key={nav.label} className="flex w-full justify-center">
              <TooltipProvider>
                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <Link
                      onClick={() => setPathname(nav.href)}
                      href={nav.href}
                      className={cn(
                        'mb-4 flex h-10 w-10 items-center justify-center rounded-xl transition duration-300 hover:bg-muted-foreground/10',
                        nav.matches.some((match) => match === pathname) &&
                          'bg-muted-foreground/20 hover:bg-muted-foreground/20 [&>*]:text-foreground'
                      )}
                    >
                      <Icon className="h-5 w-5 text-muted-foreground" />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">{nav.label}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </li>
          ))}
        </ul>
      </ScrollArea>
    </aside>
  );
};
