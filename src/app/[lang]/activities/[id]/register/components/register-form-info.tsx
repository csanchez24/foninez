import type { SchoolChildFormValues } from './@types';

import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import * as React from 'react';

import { useStoreContext } from '@/store';
import { cn } from '@/utils/cn';
import { useFormContext } from 'react-hook-form';
import { useGetIdentifications } from '@/hooks/queries/use-identification-queries';
import { useGetBeneficiaryTypes } from '@/hooks/queries/use-beneficiary-type-queries';
import { useGetGenders } from '@/hooks/queries/use-gender-queries';
import { useGetCountries } from '@/hooks/queries/use-country-queries';
import { useGetStates } from '@/hooks/queries/use-state-queries';
import { useGetCities } from '@/hooks/queries/use-city-queries';
import { useGetEducationLevels } from '@/hooks/queries/use-education-level-queries';
import { useGetEthnicities } from '@/hooks/queries/use-ethnicity-queries';
import { useGetSchoolGrades } from '@/hooks/queries/use-school-grade-queries';
import { useGetPopulations } from '@/hooks/queries/use-population-queries';
import { useGetVulnerabilityFactors } from '@/hooks/queries/use-vulnerability-factor-queries';
import { useGetShifts } from '@/hooks/queries/use-shift-queries';
import { useGetIndigenousReserves } from '@/hooks/queries/use-indigenous-reserve-queries';
import { useGetIndigenousCommunities } from '@/hooks/queries/use-indigenous-community-queries';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useGetKinships } from '@/hooks/queries/use-kinships-queries';

export function RegisterFormInfo() {
  const dictionary = useStoreContext((state) => state.dictionary.register.form.info);

  const dictionaryTypes = useStoreContext(
    (state) => state.dictionary.child.table.columns.areaType.values
  );

  const { data: identifications } = useGetIdentifications();
  const { data: beneficiaryTypes } = useGetBeneficiaryTypes();
  const { data: genders } = useGetGenders();
  const { data: countries } = useGetCountries();
  const { data: states } = useGetStates();
  const { data: cities } = useGetCities();
  const { data: educationLevels } = useGetEducationLevels();
  const { data: ethnicities } = useGetEthnicities();
  const { data: schoolGrades } = useGetSchoolGrades();
  const { data: populations } = useGetPopulations();
  const { data: vulnerabilityFactors } = useGetVulnerabilityFactors();
  const { data: shifts } = useGetShifts();
  const { data: indigenousReserves } = useGetIndigenousReserves();
  const { data: indigenousCommunities } = useGetIndigenousCommunities();
  const { data: kinships } = useGetKinships();

  const form = useFormContext<SchoolChildFormValues>();

  const [opened, setOpened] = React.useState(false);
  const [openedTwo, setOpenedTwo] = React.useState(false);

  const [openedKinship, setOpenedKinship] = React.useState(false);
  const [openedBeneficiaryType, setOpenedBeneficiaryType] = React.useState(false);
  const [openedGender, setOpenedGender] = React.useState(false);
  const [openedCountry, setOpenedCountry] = React.useState(false);
  const [openedBirthState, setOpenedBirthState] = React.useState(false);
  const [openedBirthCity, setOpenedBirthCity] = React.useState(false);
  const [openedState, setOpenedState] = React.useState(false);
  const [openedCity, setOpenedCity] = React.useState(false);
  const [openedEducationLevel, setOpenedEducationLevel] = React.useState(false);
  const [openedEthnicity, setOpenedEthnicity] = React.useState(false);
  const [openedSchoolGrade, setOpenedSchoolGrade] = React.useState(false);
  const [openedPopulation, setOpenedPopulation] = React.useState(false);
  const [openedVulnerabilityFactor, setOpenedVulnerabilityFactor] = React.useState(false);
  const [openedShifts, setOpenedShifts] = React.useState(false);
  const [openedIndigenousReserve, setOpenedIndigenousReserve] = React.useState(false);
  const [openedIndigenousCommunity, setOpenedIndigenousCommunity] = React.useState(false);

  return (
    <div className="my-6 space-y-2">
      <Collapsible defaultOpen={true}>
        <CollapsibleTrigger className="w-full">
          <div className="flex w-full items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">{dictionary.heading}</h3>
            </div>
            <div>
              <Icons.CaretSort className="h-5 w-5" />
            </div>
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="my-4">
            <h3 className="text-lg font-medium">{dictionary.subheading.basicData}</h3>
            <Separator className="mb-3 mt-2" />
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
              <FormField
                name="child.idNum"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{dictionary.idNumField.label}</FormLabel>
                    <FormControl>
                      <Input placeholder={dictionary.idNumField.placeholder} {...field} />
                    </FormControl>
                    <FormDescription>{dictionary.idNumField.description}</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="child.identificationId"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{dictionary.identificationField.label}</FormLabel>
                    <FormControl>
                      <Popover open={opened} onOpenChange={setOpened} modal={true}>
                        <PopoverTrigger asChild>
                          <Button
                            type="button"
                            variant="outline"
                            role="combobox"
                            aria-expanded={opened}
                            className={cn(
                              'w-full justify-between capitalize',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            <span className="truncate">
                              {field.value
                                ? identifications?.body.data.find(({ id }) => id === field.value)
                                    ?.name
                                : dictionary.identificationField.label}
                            </span>
                            <Icons.ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                          <Command>
                            <CommandInput
                              placeholder={dictionary.identificationField.placeholder}
                            />
                            <CommandList>
                              <CommandEmpty>{dictionary.identificationField.empty}</CommandEmpty>
                              <CommandGroup>
                                {identifications?.body.data.map((identification) => (
                                  <CommandItem
                                    key={identification.id}
                                    value={identification.id.toString()}
                                    keywords={[identification.name]}
                                    onSelect={() => {
                                      form.setValue('child.identificationId', identification.id);
                                      setOpened(false);
                                    }}
                                  >
                                    <div className="flex items-start">
                                      <Icons.Check
                                        className={cn(
                                          'mr-2 h-4 w-4',
                                          field.value === identification.id
                                            ? 'opacity-100'
                                            : 'opacity-0'
                                        )}
                                      />
                                      <div className="flex-1">
                                        <div className="capitalize">{identification.name}</div>
                                      </div>
                                    </div>
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="child.firstName"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{dictionary.firstNameField.label}</FormLabel>
                    <FormControl>
                      <Input placeholder={dictionary.firstNameField.placeholder} {...field} />
                    </FormControl>
                    <FormDescription>{dictionary.firstNameField.description}</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="child.middleName"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{dictionary.middleNameField.label}</FormLabel>
                    <FormControl>
                      <Input placeholder={dictionary.middleNameField.placeholder} {...field} />
                    </FormControl>
                    <FormDescription>{dictionary.middleNameField.description}</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="child.lastName"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{dictionary.lastNameField.label}</FormLabel>
                    <FormControl>
                      <Input placeholder={dictionary.lastNameField.placeholder} {...field} />
                    </FormControl>
                    <FormDescription>{dictionary.lastNameField.description}</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="child.secondLastName"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{dictionary.secondLastNameField.label}</FormLabel>
                    <FormControl>
                      <Input placeholder={dictionary.secondLastNameField.placeholder} {...field} />
                    </FormControl>
                    <FormDescription>{dictionary.secondLastNameField.description}</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="my-4">
            <h3 className="text-lg font-medium">{dictionary.subheading.infoData}</h3>
            <Separator className="mb-3 mt-2" />
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
              <FormField
                control={form.control}
                name="child.birthDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>{dictionary.birthDate.label}</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(!field.value && 'text-muted-foreground')}
                          >
                            {field.value ? (
                              format(field.value, 'PPP')
                            ) : (
                              <span>{dictionary.birthDate.placeholder}</span>
                            )}
                            <Icons.Calendar className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date('1900-01-01')}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="child.birthStateId"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{dictionary.birthState.label}</FormLabel>
                    <FormControl>
                      <Popover
                        open={openedBirthState}
                        onOpenChange={setOpenedBirthState}
                        modal={true}
                      >
                        <PopoverTrigger asChild>
                          <Button
                            type="button"
                            variant="outline"
                            role="combobox"
                            aria-expanded={openedBirthState}
                            className={cn(
                              'w-full justify-between capitalize',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            <span className="truncate">
                              {field.value
                                ? states?.body.data.find(({ id }) => id === field.value)?.name
                                : dictionary.birthState.label}
                            </span>
                            <Icons.ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                          <Command>
                            <CommandInput placeholder={dictionary.birthState.placeholder} />
                            <CommandList>
                              <CommandEmpty>{dictionary.birthState.empty}</CommandEmpty>
                              <CommandGroup>
                                {states?.body.data.map((state) => (
                                  <CommandItem
                                    key={state.id}
                                    value={state.id.toString()}
                                    keywords={[state.name]}
                                    onSelect={() => {
                                      form.setValue('child.birthStateId', state.id);
                                      setOpenedBirthState(false);
                                    }}
                                  >
                                    <div className="flex items-start">
                                      <Icons.Check
                                        className={cn(
                                          'mr-2 h-4 w-4',
                                          field.value === state.id ? 'opacity-100' : 'opacity-0'
                                        )}
                                      />
                                      <div className="flex-1">
                                        <div className="capitalize">{state.name}</div>
                                      </div>
                                    </div>
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="child.birthCityId"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{dictionary.birthCity.label}</FormLabel>
                    <FormControl>
                      <Popover
                        open={openedBirthCity}
                        onOpenChange={setOpenedBirthCity}
                        modal={true}
                      >
                        <PopoverTrigger asChild>
                          <Button
                            type="button"
                            variant="outline"
                            role="combobox"
                            aria-expanded={openedBirthCity}
                            className={cn(
                              'w-full justify-between capitalize',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            <span className="truncate">
                              {field.value
                                ? cities?.body.data.find(({ id }) => id === field.value)?.name
                                : dictionary.birthCity.label}
                            </span>
                            <Icons.ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                          <Command>
                            <CommandInput placeholder={dictionary.birthCity.placeholder} />
                            <CommandList>
                              <CommandEmpty>{dictionary.birthCity.empty}</CommandEmpty>
                              <CommandGroup>
                                {cities?.body.data.map((city) => (
                                  <CommandItem
                                    key={city.id}
                                    value={city.id.toString()}
                                    keywords={[city.name]}
                                    onSelect={() => {
                                      form.setValue('child.birthCityId', city.id);
                                      setOpenedBirthCity(false);
                                    }}
                                  >
                                    <div className="flex items-start">
                                      <Icons.Check
                                        className={cn(
                                          'mr-2 h-4 w-4',
                                          field.value === city.id ? 'opacity-100' : 'opacity-0'
                                        )}
                                      />
                                      <div className="flex-1">
                                        <div className="capitalize">{city.name}</div>
                                      </div>
                                    </div>
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="child.countryId"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{dictionary.country.label}</FormLabel>
                    <FormControl>
                      <Popover open={openedCountry} onOpenChange={setOpenedCountry} modal={true}>
                        <PopoverTrigger asChild>
                          <Button
                            type="button"
                            variant="outline"
                            role="combobox"
                            aria-expanded={openedCountry}
                            className={cn(
                              'w-full justify-between capitalize',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            <span className="truncate">
                              {field.value
                                ? countries?.body.data.find(({ id }) => id === field.value)?.name
                                : dictionary.country.label}
                            </span>
                            <Icons.ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                          <Command>
                            <CommandInput placeholder={dictionary.country.placeholder} />
                            <CommandList>
                              <CommandEmpty>{dictionary.country.empty}</CommandEmpty>
                              <CommandGroup>
                                {countries?.body.data.map((country) => (
                                  <CommandItem
                                    key={country.id}
                                    value={country.id.toString()}
                                    keywords={[country.name]}
                                    onSelect={() => {
                                      form.setValue('child.countryId', country.id);
                                      setOpenedCountry(false);
                                    }}
                                  >
                                    <div className="flex items-start">
                                      <Icons.Check
                                        className={cn(
                                          'mr-2 h-4 w-4',
                                          field.value === country.id ? 'opacity-100' : 'opacity-0'
                                        )}
                                      />
                                      <div className="flex-1">
                                        <div className="capitalize">{country.name}</div>
                                      </div>
                                    </div>
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="child.stateId"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{dictionary.state.label}</FormLabel>
                    <FormControl>
                      <Popover open={openedState} onOpenChange={setOpenedState} modal={true}>
                        <PopoverTrigger asChild>
                          <Button
                            type="button"
                            variant="outline"
                            role="combobox"
                            aria-expanded={openedState}
                            className={cn(
                              'w-full justify-between capitalize',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            <span className="truncate">
                              {field.value
                                ? states?.body.data.find(({ id }) => id === field.value)?.name
                                : dictionary.state.label}
                            </span>
                            <Icons.ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                          <Command>
                            <CommandInput placeholder={dictionary.state.placeholder} />
                            <CommandList>
                              <CommandEmpty>{dictionary.state.empty}</CommandEmpty>
                              <CommandGroup>
                                {states?.body.data.map((state) => (
                                  <CommandItem
                                    key={state.id}
                                    value={state.id.toString()}
                                    keywords={[state.name]}
                                    onSelect={() => {
                                      form.setValue('child.stateId', state.id);
                                      setOpenedState(false);
                                    }}
                                  >
                                    <div className="flex items-start">
                                      <Icons.Check
                                        className={cn(
                                          'mr-2 h-4 w-4',
                                          field.value === state.id ? 'opacity-100' : 'opacity-0'
                                        )}
                                      />
                                      <div className="flex-1">
                                        <div className="capitalize">{state.name}</div>
                                      </div>
                                    </div>
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="child.cityId"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{dictionary.city.label}</FormLabel>
                    <FormControl>
                      <Popover open={openedCity} onOpenChange={setOpenedCity} modal={true}>
                        <PopoverTrigger asChild>
                          <Button
                            type="button"
                            variant="outline"
                            role="combobox"
                            aria-expanded={openedCity}
                            className={cn(
                              'w-full justify-between capitalize',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            <span className="truncate">
                              {field.value
                                ? cities?.body.data.find(({ id }) => id === field.value)?.name
                                : dictionary.city.label}
                            </span>
                            <Icons.ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                          <Command>
                            <CommandInput placeholder={dictionary.city.placeholder} />
                            <CommandList>
                              <CommandEmpty>{dictionary.city.empty}</CommandEmpty>
                              <CommandGroup>
                                {cities?.body.data.map((city) => (
                                  <CommandItem
                                    key={city.id}
                                    value={city.id.toString()}
                                    keywords={[city.name]}
                                    onSelect={() => {
                                      form.setValue('child.cityId', city.id);
                                      setOpenedBirthCity(false);
                                    }}
                                  >
                                    <div className="flex items-start">
                                      <Icons.Check
                                        className={cn(
                                          'mr-2 h-4 w-4',
                                          field.value === city.id ? 'opacity-100' : 'opacity-0'
                                        )}
                                      />
                                      <div className="flex-1">
                                        <div className="capitalize">{city.name}</div>
                                      </div>
                                    </div>
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="child.areaType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{dictionary.areaType.label}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={dictionary.areaType.placeholder} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {dictionaryTypes.map((status) => (
                          <SelectItem key={status.value} value={status.value}>
                            {status.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>{dictionary.areaType.description}</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="child.address"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{dictionary.address.label}</FormLabel>
                    <FormControl>
                      <Input placeholder={dictionary.address.placeholder} {...field} />
                    </FormControl>
                    <FormDescription>{dictionary.address.description}</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="child.kinshipId"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{dictionary.kinship.label}</FormLabel>
                    <FormControl>
                      <Popover open={openedKinship} onOpenChange={setOpenedKinship} modal={true}>
                        <PopoverTrigger asChild>
                          <Button
                            type="button"
                            variant="outline"
                            role="combobox"
                            aria-expanded={openedKinship}
                            className={cn(
                              'w-full justify-between capitalize',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            <span className="truncate">
                              {field.value
                                ? kinships?.body.data.find(({ id }) => id === field.value)?.name
                                : dictionary.kinship.label}
                            </span>
                            <Icons.ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                          <Command>
                            <CommandInput placeholder={dictionary.kinship.placeholder} />
                            <CommandList>
                              <CommandEmpty>{dictionary.kinship.empty}</CommandEmpty>
                              <CommandGroup>
                                {kinships?.body.data.map((kinship) => (
                                  <CommandItem
                                    key={kinship.id}
                                    value={kinship.id.toString()}
                                    keywords={[kinship.name]}
                                    onSelect={() => {
                                      form.setValue('child.kinshipId', kinship.id);
                                      setOpenedKinship(false);
                                    }}
                                  >
                                    <div className="flex items-start">
                                      <Icons.Check
                                        className={cn(
                                          'mr-2 h-4 w-4',
                                          field.value === kinship.id ? 'opacity-100' : 'opacity-0'
                                        )}
                                      />
                                      <div className="flex-1">
                                        <div className="capitalize">{kinship.name}</div>
                                      </div>
                                    </div>
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="child.beneficiaryTypeId"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{dictionary.beneficiaryType.label}</FormLabel>
                    <FormControl>
                      <Popover
                        open={openedBeneficiaryType}
                        onOpenChange={setOpenedBeneficiaryType}
                        modal={true}
                      >
                        <PopoverTrigger asChild>
                          <Button
                            type="button"
                            variant="outline"
                            role="combobox"
                            aria-expanded={openedBeneficiaryType}
                            className={cn(
                              'w-full justify-between capitalize',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            <span className="truncate">
                              {field.value
                                ? beneficiaryTypes?.body.data.find(({ id }) => id === field.value)
                                    ?.name
                                : dictionary.beneficiaryType.label}
                            </span>
                            <Icons.ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                          <Command>
                            <CommandInput placeholder={dictionary.beneficiaryType.placeholder} />
                            <CommandList>
                              <CommandEmpty>{dictionary.beneficiaryType.empty}</CommandEmpty>
                              <CommandGroup>
                                {beneficiaryTypes?.body.data.map((beneficiaryType) => (
                                  <CommandItem
                                    key={beneficiaryType.id}
                                    value={beneficiaryType.id.toString()}
                                    keywords={[beneficiaryType.name]}
                                    onSelect={() => {
                                      form.setValue('child.beneficiaryTypeId', beneficiaryType.id);
                                      setOpenedBeneficiaryType(false);
                                    }}
                                  >
                                    <div className="flex items-start">
                                      <Icons.Check
                                        className={cn(
                                          'mr-2 h-4 w-4',
                                          field.value === beneficiaryType.id
                                            ? 'opacity-100'
                                            : 'opacity-0'
                                        )}
                                      />
                                      <div className="flex-1">
                                        <div className="capitalize">{beneficiaryType.name}</div>
                                      </div>
                                    </div>
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="child.genderId"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{dictionary.gender.label}</FormLabel>
                    <FormControl>
                      <Popover open={openedGender} onOpenChange={setOpenedGender} modal={true}>
                        <PopoverTrigger asChild>
                          <Button
                            type="button"
                            variant="outline"
                            role="combobox"
                            aria-expanded={openedGender}
                            className={cn(
                              'w-full justify-between capitalize',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            <span className="truncate">
                              {field.value
                                ? genders?.body.data.find(({ id }) => id === field.value)?.name
                                : dictionary.gender.label}
                            </span>
                            <Icons.ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                          <Command>
                            <CommandInput placeholder={dictionary.gender.placeholder} />
                            <CommandList>
                              <CommandEmpty>{dictionary.gender.empty}</CommandEmpty>
                              <CommandGroup>
                                {genders?.body.data.map((gender) => (
                                  <CommandItem
                                    key={gender.id}
                                    value={gender.id.toString()}
                                    keywords={[gender.name]}
                                    onSelect={() => {
                                      form.setValue('child.genderId', gender.id);
                                      setOpenedGender(false);
                                    }}
                                  >
                                    <div className="flex items-start">
                                      <Icons.Check
                                        className={cn(
                                          'mr-2 h-4 w-4',
                                          field.value === gender.id ? 'opacity-100' : 'opacity-0'
                                        )}
                                      />
                                      <div className="flex-1">
                                        <div className="capitalize">{gender.name}</div>
                                      </div>
                                    </div>
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="child.educationLevelId"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{dictionary.educationLevel.label}</FormLabel>
                    <FormControl>
                      <Popover
                        open={openedEducationLevel}
                        onOpenChange={setOpenedEducationLevel}
                        modal={true}
                      >
                        <PopoverTrigger asChild>
                          <Button
                            type="button"
                            variant="outline"
                            role="combobox"
                            aria-expanded={openedEducationLevel}
                            className={cn(
                              'w-full justify-between capitalize',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            <span className="truncate">
                              {field.value
                                ? educationLevels?.body.data.find(({ id }) => id === field.value)
                                    ?.name
                                : dictionary.educationLevel.label}
                            </span>
                            <Icons.ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                          <Command>
                            <CommandInput placeholder={dictionary.educationLevel.placeholder} />
                            <CommandList>
                              <CommandEmpty>{dictionary.educationLevel.empty}</CommandEmpty>
                              <CommandGroup>
                                {educationLevels?.body.data.map((educationLevel) => (
                                  <CommandItem
                                    key={educationLevel.id}
                                    value={educationLevel.id.toString()}
                                    keywords={[educationLevel.name]}
                                    onSelect={() => {
                                      form.setValue('child.educationLevelId', educationLevel.id);
                                      setOpenedEducationLevel(false);
                                    }}
                                  >
                                    <div className="flex items-start">
                                      <Icons.Check
                                        className={cn(
                                          'mr-2 h-4 w-4',
                                          field.value === educationLevel.id
                                            ? 'opacity-100'
                                            : 'opacity-0'
                                        )}
                                      />
                                      <div className="flex-1">
                                        <div className="capitalize">{educationLevel.name}</div>
                                      </div>
                                    </div>
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="child.schoolGradeId"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{dictionary.schoolGrade.label}</FormLabel>
                    <FormControl>
                      <Popover
                        open={openedSchoolGrade}
                        onOpenChange={setOpenedSchoolGrade}
                        modal={true}
                      >
                        <PopoverTrigger asChild>
                          <Button
                            type="button"
                            variant="outline"
                            role="combobox"
                            aria-expanded={openedSchoolGrade}
                            className={cn(
                              'w-full justify-between capitalize',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            <span className="truncate">
                              {field.value
                                ? schoolGrades?.body.data.find(({ id }) => id === field.value)?.name
                                : dictionary.schoolGrade.label}
                            </span>
                            <Icons.ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                          <Command>
                            <CommandInput placeholder={dictionary.schoolGrade.placeholder} />
                            <CommandList>
                              <CommandEmpty>{dictionary.schoolGrade.empty}</CommandEmpty>
                              <CommandGroup>
                                {schoolGrades?.body.data.map((schoolGrade) => (
                                  <CommandItem
                                    key={schoolGrade.id}
                                    value={schoolGrade.id.toString()}
                                    keywords={[schoolGrade.name]}
                                    onSelect={() => {
                                      form.setValue('child.schoolGradeId', schoolGrade.id);
                                      setOpenedSchoolGrade(false);
                                    }}
                                  >
                                    <div className="flex items-start">
                                      <Icons.Check
                                        className={cn(
                                          'mr-2 h-4 w-4',
                                          field.value === schoolGrade.id
                                            ? 'opacity-100'
                                            : 'opacity-0'
                                        )}
                                      />
                                      <div className="flex-1">
                                        <div className="capitalize">{schoolGrade.name}</div>
                                      </div>
                                    </div>
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="my-4">
            <h3 className="text-lg font-medium">{dictionary.subheading.extraData}</h3>
            <Separator className="mb-3 mt-2" />
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
              <FormField
                name="child.ethnicityId"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{dictionary.ethnicity.label}</FormLabel>
                    <FormControl>
                      <Popover
                        open={openedEthnicity}
                        onOpenChange={setOpenedEthnicity}
                        modal={true}
                      >
                        <PopoverTrigger asChild>
                          <Button
                            type="button"
                            variant="outline"
                            role="combobox"
                            aria-expanded={openedEthnicity}
                            className={cn(
                              'w-full justify-between capitalize',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            <span className="truncate">
                              {field.value
                                ? ethnicities?.body.data.find(({ id }) => id === field.value)?.name
                                : dictionary.ethnicity.label}
                            </span>
                            <Icons.ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                          <Command>
                            <CommandInput placeholder={dictionary.ethnicity.placeholder} />
                            <CommandList>
                              <CommandEmpty>{dictionary.ethnicity.empty}</CommandEmpty>
                              <CommandGroup>
                                {ethnicities?.body.data.map((ethnicity) => (
                                  <CommandItem
                                    key={ethnicity.id}
                                    value={ethnicity.id.toString()}
                                    keywords={[ethnicity.name]}
                                    onSelect={() => {
                                      form.setValue('child.ethnicityId', ethnicity.id);
                                      setOpenedEthnicity(false);
                                    }}
                                  >
                                    <div className="flex items-start">
                                      <Icons.Check
                                        className={cn(
                                          'mr-2 h-4 w-4',
                                          field.value === ethnicity.id ? 'opacity-100' : 'opacity-0'
                                        )}
                                      />
                                      <div className="flex-1">
                                        <div className="capitalize">{ethnicity.name}</div>
                                      </div>
                                    </div>
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="child.populationId"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{dictionary.population.label}</FormLabel>
                    <FormControl>
                      <Popover
                        open={openedPopulation}
                        onOpenChange={setOpenedPopulation}
                        modal={true}
                      >
                        <PopoverTrigger asChild>
                          <Button
                            type="button"
                            variant="outline"
                            role="combobox"
                            aria-expanded={openedPopulation}
                            className={cn(
                              'w-full justify-between capitalize',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            <span className="truncate">
                              {field.value
                                ? populations?.body.data.find(({ id }) => id === field.value)?.name
                                : dictionary.population.label}
                            </span>
                            <Icons.ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                          <Command>
                            <CommandInput placeholder={dictionary.population.placeholder} />
                            <CommandList>
                              <CommandEmpty>{dictionary.population.empty}</CommandEmpty>
                              <CommandGroup>
                                {populations?.body.data.map((population) => (
                                  <CommandItem
                                    key={population.id}
                                    value={population.id.toString()}
                                    keywords={[population.name]}
                                    onSelect={() => {
                                      form.setValue('child.populationId', population.id);
                                      setOpenedPopulation(false);
                                    }}
                                  >
                                    <div className="flex items-start">
                                      <Icons.Check
                                        className={cn(
                                          'mr-2 h-4 w-4',
                                          field.value === population.id
                                            ? 'opacity-100'
                                            : 'opacity-0'
                                        )}
                                      />
                                      <div className="flex-1">
                                        <div className="capitalize">{population.name}</div>
                                      </div>
                                    </div>
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="child.vulnerabilityFactorId"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{dictionary.vulnerabilityFactor.label}</FormLabel>
                    <FormControl>
                      <Popover
                        open={openedVulnerabilityFactor}
                        onOpenChange={setOpenedVulnerabilityFactor}
                        modal={true}
                      >
                        <PopoverTrigger asChild>
                          <Button
                            type="button"
                            variant="outline"
                            role="combobox"
                            aria-expanded={openedVulnerabilityFactor}
                            className={cn(
                              'w-full justify-between capitalize',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            <span className="truncate">
                              {field.value
                                ? vulnerabilityFactors?.body.data.find(
                                    ({ id }) => id === field.value
                                  )?.name
                                : dictionary.vulnerabilityFactor.label}
                            </span>
                            <Icons.ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                          <Command>
                            <CommandInput
                              placeholder={dictionary.vulnerabilityFactor.placeholder}
                            />
                            <CommandList>
                              <CommandEmpty>{dictionary.vulnerabilityFactor.empty}</CommandEmpty>
                              <CommandGroup>
                                {vulnerabilityFactors?.body.data.map((vulnerabilityFactor) => (
                                  <CommandItem
                                    key={vulnerabilityFactor.id}
                                    value={vulnerabilityFactor.id.toString()}
                                    keywords={[vulnerabilityFactor.name]}
                                    onSelect={() => {
                                      form.setValue(
                                        'child.vulnerabilityFactorId',
                                        vulnerabilityFactor.id
                                      );
                                      setOpenedVulnerabilityFactor(false);
                                    }}
                                  >
                                    <div className="flex items-start">
                                      <Icons.Check
                                        className={cn(
                                          'mr-2 h-4 w-4',
                                          field.value === vulnerabilityFactor.id
                                            ? 'opacity-100'
                                            : 'opacity-0'
                                        )}
                                      />
                                      <div className="flex-1">
                                        <div className="capitalize">{vulnerabilityFactor.name}</div>
                                      </div>
                                    </div>
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="child.shiftId"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{dictionary.shift.label}</FormLabel>
                    <FormControl>
                      <Popover open={openedShifts} onOpenChange={setOpenedShifts} modal={true}>
                        <PopoverTrigger asChild>
                          <Button
                            type="button"
                            variant="outline"
                            role="combobox"
                            aria-expanded={openedShifts}
                            className={cn(
                              'w-full justify-between capitalize',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            <span className="truncate">
                              {field.value
                                ? shifts?.body.data.find(({ id }) => id === field.value)?.name
                                : dictionary.shift.label}
                            </span>
                            <Icons.ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                          <Command>
                            <CommandInput placeholder={dictionary.shift.placeholder} />
                            <CommandList>
                              <CommandEmpty>{dictionary.shift.empty}</CommandEmpty>
                              <CommandGroup>
                                {shifts?.body.data.map((shift) => (
                                  <CommandItem
                                    key={shift.id}
                                    value={shift.id.toString()}
                                    keywords={[shift.name]}
                                    onSelect={() => {
                                      form.setValue('child.shiftId', shift.id);
                                      setOpenedShifts(false);
                                    }}
                                  >
                                    <div className="flex items-start">
                                      <Icons.Check
                                        className={cn(
                                          'mr-2 h-4 w-4',
                                          field.value === shift.id ? 'opacity-100' : 'opacity-0'
                                        )}
                                      />
                                      <div className="flex-1">
                                        <div className="capitalize">{shift.name}</div>
                                      </div>
                                    </div>
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="child.indigenousReserveId"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{dictionary.indigenousReserve.label}</FormLabel>
                    <FormControl>
                      <Popover
                        open={openedIndigenousReserve}
                        onOpenChange={setOpenedIndigenousReserve}
                        modal={true}
                      >
                        <PopoverTrigger asChild>
                          <Button
                            type="button"
                            variant="outline"
                            role="combobox"
                            aria-expanded={openedIndigenousReserve}
                            className={cn(
                              'w-full justify-between capitalize',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            <span className="truncate">
                              {field.value
                                ? indigenousReserves?.body.data.find(({ id }) => id === field.value)
                                    ?.name
                                : dictionary.indigenousReserve.label}
                            </span>
                            <Icons.ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                          <Command>
                            <CommandInput placeholder={dictionary.indigenousReserve.placeholder} />
                            <CommandList>
                              <CommandEmpty>{dictionary.indigenousReserve.empty}</CommandEmpty>
                              <CommandGroup>
                                {indigenousReserves?.body.data.map((indigenousReserve) => (
                                  <CommandItem
                                    key={indigenousReserve.id}
                                    value={indigenousReserve.id.toString()}
                                    keywords={[indigenousReserve.name]}
                                    onSelect={() => {
                                      form.setValue(
                                        'child.indigenousReserveId',
                                        indigenousReserve.id
                                      );
                                      setOpenedIndigenousReserve(false);
                                    }}
                                  >
                                    <div className="flex items-start">
                                      <Icons.Check
                                        className={cn(
                                          'mr-2 h-4 w-4',
                                          field.value === indigenousReserve.id
                                            ? 'opacity-100'
                                            : 'opacity-0'
                                        )}
                                      />
                                      <div className="flex-1">
                                        <div className="capitalize">{indigenousReserve.name}</div>
                                      </div>
                                    </div>
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="child.indigenousCommunityId"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{dictionary.indigenousCommunity.label}</FormLabel>
                    <FormControl>
                      <Popover
                        open={openedIndigenousCommunity}
                        onOpenChange={setOpenedIndigenousCommunity}
                        modal={true}
                      >
                        <PopoverTrigger asChild>
                          <Button
                            type="button"
                            variant="outline"
                            role="combobox"
                            aria-expanded={openedIndigenousCommunity}
                            className={cn(
                              'w-full justify-between capitalize',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            <span className="truncate">
                              {field.value
                                ? indigenousCommunities?.body.data.find(
                                    ({ id }) => id === field.value
                                  )?.name
                                : dictionary.indigenousCommunity.label}
                            </span>
                            <Icons.ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                          <Command>
                            <CommandInput
                              placeholder={dictionary.indigenousCommunity.placeholder}
                            />
                            <CommandList>
                              <CommandEmpty>{dictionary.indigenousCommunity.empty}</CommandEmpty>
                              <CommandGroup>
                                {indigenousCommunities?.body.data.map((indigenousCommunity) => (
                                  <CommandItem
                                    key={indigenousCommunity.id}
                                    value={indigenousCommunity.id.toString()}
                                    keywords={[indigenousCommunity.name]}
                                    onSelect={() => {
                                      form.setValue(
                                        'child.indigenousCommunityId',
                                        indigenousCommunity.id
                                      );
                                      setOpenedIndigenousCommunity(false);
                                    }}
                                  >
                                    <div className="flex items-start">
                                      <Icons.Check
                                        className={cn(
                                          'mr-2 h-4 w-4',
                                          field.value === indigenousCommunity.id
                                            ? 'opacity-100'
                                            : 'opacity-0'
                                        )}
                                      />
                                      <div className="flex-1">
                                        <div className="capitalize">{indigenousCommunity.name}</div>
                                      </div>
                                    </div>
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="my-4">
            <h3 className="text-lg font-medium">{dictionary.subheading.affiliationData}</h3>
            <Separator className="mb-3 mt-2" />
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
              <FormField
                control={form.control}
                name="child.affiliationDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>{dictionary.affiliationDate.label}</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(!field.value && 'text-muted-foreground')}
                          >
                            {field.value ? (
                              format(field.value, 'PPP')
                            ) : (
                              <span>{dictionary.affiliationDate.placeholder}</span>
                            )}
                            <Icons.Calendar className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date('1900-01-01')}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>{dictionary.affiliationDate.description}</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="child.deactivationDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>{dictionary.deactivationDate.label}</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(!field.value && 'text-muted-foreground')}
                          >
                            {field.value ? (
                              format(field.value, 'PPP')
                            ) : (
                              <span>{dictionary.deactivationDate.placeholder}</span>
                            )}
                            <Icons.Calendar className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value ?? undefined}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date('1900-01-01')}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>{dictionary.deactivationDate.description}</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="child.deactivationReason"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{dictionary.deactivationReason.label}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell us a little bit about yourself"
                        className="resize-none"
                        {...field}
                        value={field.value ?? ''}
                      />
                    </FormControl>
                    <FormDescription>
                      <FormDescription>{dictionary.deactivationReason.description}</FormDescription>
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
      <Separator />
      <Collapsible>
        <CollapsibleTrigger className="w-full">
          <div className="flex w-full items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">{dictionary.headingGuardian}</h3>
            </div>
            <div>
              <Icons.CaretSort className="h-5 w-5" />
            </div>
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              name="guardian.idNum"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{dictionary.idNumFieldGuardian.label}</FormLabel>
                  <FormControl>
                    <Input placeholder={dictionary.idNumFieldGuardian.placeholder} {...field} />
                  </FormControl>
                  <FormDescription>{dictionary.idNumFieldGuardian.description}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="guardian.identificationId"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{dictionary.identificationFieldGuardian.label}</FormLabel>
                  <FormControl>
                    <Popover open={openedTwo} onOpenChange={setOpenedTwo} modal={true}>
                      <PopoverTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          role="combobox"
                          aria-expanded={openedTwo}
                          className={cn(
                            'w-full justify-between capitalize',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          <span className="truncate">
                            {field.value
                              ? identifications?.body.data.find(({ id }) => id === field.value)
                                  ?.name
                              : dictionary.identificationFieldGuardian.label}
                          </span>
                          <Icons.ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                        <Command>
                          <CommandInput
                            placeholder={dictionary.identificationFieldGuardian.placeholder}
                          />
                          <CommandList>
                            <CommandEmpty>
                              {dictionary.identificationFieldGuardian.empty}
                            </CommandEmpty>
                            <CommandGroup>
                              {identifications?.body.data.map((identification) => (
                                <CommandItem
                                  key={identification.id}
                                  value={identification.id.toString()}
                                  keywords={[identification.name]}
                                  onSelect={() => {
                                    form.setValue('guardian.identificationId', identification.id);
                                    setOpenedTwo(false);
                                  }}
                                >
                                  <div className="flex items-start">
                                    <Icons.Check
                                      className={cn(
                                        'mr-2 h-4 w-4',
                                        field.value === identification.id
                                          ? 'opacity-100'
                                          : 'opacity-0'
                                      )}
                                    />
                                    <div className="flex-1">
                                      <div className="capitalize">{identification.name}</div>
                                    </div>
                                  </div>
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="guardian.firstName"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{dictionary.firstNameFieldGuardian.label}</FormLabel>
                  <FormControl>
                    <Input placeholder={dictionary.firstNameFieldGuardian.placeholder} {...field} />
                  </FormControl>
                  <FormDescription>{dictionary.firstNameFieldGuardian.description}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="guardian.middleName"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{dictionary.middleNameFieldGuardian.label}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={dictionary.middleNameFieldGuardian.placeholder}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    {dictionary.middleNameFieldGuardian.description}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="guardian.lastName"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{dictionary.lastNameFieldGuardian.label}</FormLabel>
                  <FormControl>
                    <Input placeholder={dictionary.lastNameFieldGuardian.placeholder} {...field} />
                  </FormControl>
                  <FormDescription>{dictionary.lastNameFieldGuardian.description}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="guardian.secondLastName"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{dictionary.secondLastNameFieldGuardian.label}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={dictionary.secondLastNameFieldGuardian.placeholder}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    {dictionary.secondLastNameFieldGuardian.description}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
