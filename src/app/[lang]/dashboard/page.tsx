'use client';

import { Icons } from '@/components/icons';
import * as Layout from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import ActivitiesMonthlyChart from './components/activities-monthly-chart';
import ActivitiesStatusChart from './components/activities-status-chart';
import RegisterMonthlyChart from './components/register-monthly-chart';

import { api } from '@/clients/api';
import { useStoreContext } from '@/store';
import { cn } from '@/utils/cn';
import { formatDate } from '@/utils/format-date';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

export default function DashboardPage() {
  const dictionary = useStoreContext((state) => state.dictionary.dashboard);

  const [open, setOpen] = useState(false);
  const [yearSelected, setYearSelected] = useState<number>();

  const { data, isLoading } = useQuery({
    queryKey: ['dashboard', yearSelected],
    queryFn: async () => {
      const res = await api.dashboard.dashboard.query({
        params: {
          year: yearSelected ?? new Date().getFullYear(),
        },
      });
      return res.status === 200 ? res : null;
    },
    cacheTime: 1,
  });

  useEffect(() => {
    if (yearSelected) return;
    setYearSelected(new Date().getFullYear());
  }, [data, yearSelected]);

  function calculatePercentage(total: number, value: number) {
    if (total === 0) {
      return 0;
    }
    return parseFloat(((value / total) * 100).toFixed(2));
  }

  return (
    <Layout.Root>
      <Layout.Header>
        <div className="flex flex-wrap items-center justify-between gap-8">
          <div>
            <Layout.Heading>{dictionary.layout.title}</Layout.Heading>
          </div>
          <div className="space-x-4">
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-[200px] justify-between"
                >
                  {yearSelected
                    ? data?.body?.years.find((year) => year === yearSelected)
                    : dictionary.layout.searchFilter.input.placeholder}
                  <Icons.CaretSort className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0">
                <Command>
                  <CommandInput
                    placeholder={dictionary.layout.searchFilter.input.filter}
                    className="h-9"
                  />
                  <CommandEmpty>{dictionary.layout.searchFilter.input.empty}.</CommandEmpty>
                  <CommandGroup>
                    <CommandList>
                      {data?.body?.years.map((year) => (
                        <CommandItem
                          key={year}
                          value={year.toString()}
                          onSelect={(currentValue) => {
                            setYearSelected(
                              data?.body?.years.find((y) => y.toString() === currentValue)
                            );
                            setOpen(false);
                          }}
                        >
                          {year}
                          <Icons.Check
                            className={cn(
                              'ml-auto h-4 w-4',
                              yearSelected === year ? 'opacity-100' : 'opacity-0'
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandList>
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </Layout.Header>
      <Layout.Main>
        <div className="">
          <div className="mb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3 ">
            <Card className="rounded-md p-0">
              <CardHeader className="pb-1">
                <CardTitle className="flex items-center justify-between">
                  <p className="text-sm font-medium tracking-tight">{dictionary.cardOne.title}</p>
                  <div className="rounded-full bg-secondary p-1.5">
                    <Icons.LineChart className="h-5 w-5 text-blue-500" />
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                {isLoading ? (
                  <Icons.Spinner className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <p className="mb-2 text-xl font-bold">{data?.body.totalActivities ?? 0}</p>
                    <p className="text-sm">
                      <span className="font-bold">{dictionary.cardOne.labelOne}: </span>
                      {data?.body.completeActivities ?? 0}
                    </p>
                    <p className="text-sm">
                      <span className="font-bold">{dictionary.cardOne.labelTwo}:</span>
                      {calculatePercentage(
                        data?.body.totalActivities ?? 0,
                        data?.body.completeActivities ?? 0
                      )}
                      %
                    </p>
                    <p className="text-sm">
                      <span className="font-bold">{dictionary.cardOne.labelThree}:</span>
                      {data?.body.executingActivities ?? 0}
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
            <Card className="rounded-md p-0">
              <CardHeader className="pb-1">
                <CardTitle className="flex items-center justify-between">
                  <p className="text-sm font-medium tracking-tight">{dictionary.cardTwo.title}</p>
                  <div className="rounded-full bg-secondary p-1.5">
                    <Icons.Building className="h-5 w-5 text-orange-500" />
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                {isLoading ? (
                  <Icons.Spinner className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <p className="mb-2 text-xl font-bold">{data?.body.totalSchool ?? 0}</p>
                  </>
                )}
              </CardContent>
            </Card>
            <Card className="rounded-md p-0">
              <CardHeader className="pb-1">
                <CardTitle className="flex items-center justify-between">
                  <p className="text-sm font-medium tracking-tight">{dictionary.cardThree.title}</p>
                  <div className="rounded-full bg-secondary p-1.5">
                    <Icons.Baby className="h-5 w-5 text-green-500" />
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                {isLoading ? (
                  <Icons.Spinner className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <p className="mb-2 text-xl font-bold">{data?.body.totalChildren ?? 0}</p>
                    <p className="text-sm">
                      <span className="font-bold">{dictionary.cardThree.labelOne}:</span>
                      {data?.body.budgetChildren ?? 0}
                    </p>
                    <p className="text-sm">
                      <span className="font-bold">{dictionary.cardThree.labelTwo}:</span>
                      {calculatePercentage(
                        data?.body.budgetChildren ?? 0,
                        data?.body.totalChildren ?? 0
                      )}
                      %
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
            <div className="lg:col-span-4">
              <ActivitiesMonthlyChart
                dictionary={dictionary}
                data={data?.body.activityMonthly ?? []}
              />
            </div>
            <div className="lg:col-span-3 ">
              <ActivitiesStatusChart dictionary={dictionary} data={data?.body.statusChart ?? []} />
            </div>
            <div className="lg:col-span-4">
              <RegisterMonthlyChart
                dictionary={dictionary}
                data={data?.body.registerMonthly ?? []}
              />
            </div>
            <div className="overflow-x-auto lg:col-span-3">
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>{dictionary.inventoryTable.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{dictionary.inventoryTable.columns.type}</TableHead>
                        <TableHead>{dictionary.inventoryTable.columns.orderNumber}</TableHead>
                        <TableHead>{dictionary.inventoryTable.columns.activity}</TableHead>
                        <TableHead>{dictionary.inventoryTable.columns.status}</TableHead>
                        <TableHead>{dictionary.inventoryTable.columns.createdDate}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data?.body.inventories.map((inventory, index) => (
                        <TableRow key={`table-row-${index}`}>
                          <TableCell className="font-medium">{inventory.type}</TableCell>
                          <TableCell>{inventory.orderNumber}</TableCell>
                          <TableCell>
                            {inventory.planModalityActivitySchool?.planModalityActivity?.name}
                          </TableCell>
                          <TableCell>{inventory.status}</TableCell>
                          <TableCell>{formatDate(inventory.createdAt, 'y-MM-dd')}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </Layout.Main>
    </Layout.Root>
  );
}
