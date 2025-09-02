import { Button } from '@/components/ui/button';
import type { ChildFormValues } from './@types';

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
import { useGetIdentifications } from '@/hooks/queries/use-identification-queries';
import { useGetGuardians } from '@/hooks/queries/use-guardian-queries';

import { useStoreContext } from '@/store';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Icons } from '@/components/icons';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { cn } from '@/utils/cn';
import { useGetBeneficiaryTypes } from '@/hooks/queries/use-beneficiary-type-queries';
import { useGetCountries } from '@/hooks/queries/use-country-queries';
import { useGetCities } from '@/hooks/queries/use-city-queries';
import { useGetEducationLevels } from '@/hooks/queries/use-education-level-queries';
import { useGetSchoolGrades } from '@/hooks/queries/use-school-grade-queries';
import { useGetEthnicities } from '@/hooks/queries/use-ethnicity-queries';
import { useGetPopulations } from '@/hooks/queries/use-population-queries';
import { useGetShifts } from '@/hooks/queries/use-shift-queries';
import { useGetIndigenousReserves } from '@/hooks/queries/use-indigenous-reserve-queries';
import { useGetIndigenousCommunities } from '@/hooks/queries/use-indigenous-community-queries';
import { useGetVulnerabilityFactors } from '@/hooks/queries/use-vulnerability-factor-queries';
import { useGetGenders } from '@/hooks/queries/use-gender-queries';
import { useGetStates } from '@/hooks/queries/use-state-queries';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { useGetKinships } from '@/hooks/queries/use-kinships-queries';

export function ChildFormInfo() {
  const dictionary = useStoreContext((state) => state.dictionary.child.form.info);

  const form = useFormContext<ChildFormValues>();

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

  const { data: guardians } = useGetGuardians({ limit: 1000 });

  const [opened, setOpened] = useState(false);
  const [openedGuardian, setOpenedGuardian] = useState(false);
  const [openedKinship, setOpenedKinship] = useState(false);
  const [openedBeneficiaryType, setOpenedBeneficiaryType] = useState(false);
  const [openedGender, setOpenedGender] = useState(false);
  const [openedCountry, setOpenedCountry] = useState(false);
  const [openedState, setOpenedState] = useState(false);
  const [openedCity, setOpenedCity] = useState(false);
  const [openedBirthState, setOpenedBirthState] = useState(false);
  const [openedBirthCity, setOpenedBirthCity] = useState(false);
  const [openedEducationLevel, setOpenedEducationLevel] = useState(false);
  const [openedEthnicity, setOpenedEthnicity] = useState(false);
  const [openedSchoolGrade, setOpenedSchoolGrade] = useState(false);
  const [openedPopulation, setOpenedPopulation] = useState(false);
  const [openedVulnerabilityFactor, setOpenedVulnerabilityFactor] = useState(false);
  const [openedShifts, setOpenedShifts] = useState(false);
  const [openedIndigenousReserve, setOpenedIndigenousReserve] = useState(false);
  const [openedIndigenousCommunity, setOpenedIndigenousCommunity] = useState(false);

  const dictionaryTypes = useStoreContext(
    (state) => state.dictionary.child.table.columns.areaType.values
  );

  return (
    <div className="my-6 space-y-2">
      <div>
        <h3 className="text-lg font-medium">{dictionary.heading}</h3>
        <p className="text-sm text-muted-foreground">{dictionary.description}</p>
      </div>
      <Separator />
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
        <FormField
          name="idNum"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{dictionary.idNum.label}</FormLabel>
              <FormControl>
                <Input placeholder={dictionary.idNum.placeholder} {...field} />
              </FormControl>
              <FormDescription>{dictionary.idNum.description}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="identificationId"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{dictionary.identification.label}</FormLabel>
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
                      {field.value
                        ? identifications?.body.data.find(({ id }) => id === field.value)?.name
                        : dictionary.identification.label}
                      <Icons.ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                    <Command>
                      <CommandInput placeholder={dictionary.identification.placeholder} />
                      <CommandList>
                        <CommandEmpty>{dictionary.identification.empty}</CommandEmpty>
                        <CommandGroup>
                          {identifications?.body.data.map((identification) => (
                            <CommandItem
                              key={identification.id}
                              value={identification.id.toString()}
                              keywords={[identification.name]}
                              onSelect={() => {
                                form.setValue('identificationId', identification.id);
                                setOpened(false);
                              }}
                            >
                              <div className="flex items-start">
                                <Icons.Check
                                  className={cn(
                                    'mr-2 h-4 w-4',
                                    field.value === identification.id ? 'opacity-100' : 'opacity-0'
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
          name="firstName"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{dictionary.firstName.label}</FormLabel>
              <FormControl>
                <Input placeholder={dictionary.firstName.placeholder} {...field} />
              </FormControl>
              <FormDescription>{dictionary.firstName.description}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="middleName"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{dictionary.middleName.label}</FormLabel>
              <FormControl>
                <Input placeholder={dictionary.middleName.placeholder} {...field} />
              </FormControl>
              <FormDescription>{dictionary.middleName.description}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="lastName"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{dictionary.lastName.label}</FormLabel>
              <FormControl>
                <Input placeholder={dictionary.lastName.placeholder} {...field} />
              </FormControl>
              <FormDescription>{dictionary.lastName.description}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="secondLastName"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{dictionary.secondLastName.label}</FormLabel>
              <FormControl>
                <Input placeholder={dictionary.secondLastName.placeholder} {...field} />
              </FormControl>
              <FormDescription>{dictionary.secondLastName.description}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="kinshipId"
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
                      {field.value
                        ? `${kinships?.body.data.find(({ id }) => id === field.value)?.name}`
                        : dictionary.kinship.label}
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
                                form.setValue('kinshipId', kinship.id);
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
          name="guardianId"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{dictionary.guardian.label}</FormLabel>
              <FormControl>
                <Popover open={openedGuardian} onOpenChange={setOpenedGuardian} modal={true}>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      role="combobox"
                      aria-expanded={openedGuardian}
                      className={cn(
                        'w-full justify-between capitalize',
                        !field.value && 'text-muted-foreground'
                      )}
                    >
                      {field.value
                        ? `${guardians?.body.data.find(({ id }) => id === field.value)?.firstName} ${guardians?.body.data.find(({ id }) => id === field.value)?.lastName}`
                        : dictionary.guardian.label}
                      <Icons.ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                    <Command>
                      <CommandInput placeholder={dictionary.guardian.placeholder} />
                      <CommandList>
                        <CommandEmpty>{dictionary.guardian.empty}</CommandEmpty>
                        <CommandGroup>
                          {guardians?.body.data.map((guardian) => (
                            <CommandItem
                              key={guardian.id}
                              value={guardian.id.toString()}
                              keywords={[guardian.firstName, guardian.lastName]}
                              onSelect={() => {
                                form.setValue('guardianId', guardian.id);
                                setOpenedGuardian(false);
                              }}
                            >
                              <div className="flex items-start">
                                <Icons.Check
                                  className={cn(
                                    'mr-2 h-4 w-4',
                                    field.value === guardian.id ? 'opacity-100' : 'opacity-0'
                                  )}
                                />
                                <div className="flex-1">
                                  <div className="capitalize">
                                    {guardian.firstName} {guardian.lastName}
                                  </div>
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
          name="beneficiaryTypeId"
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
                      {field.value
                        ? beneficiaryTypes?.body.data.find(({ id }) => id === field.value)?.name
                        : dictionary.beneficiaryType.label}
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
                                form.setValue('beneficiaryTypeId', beneficiaryType.id);
                                setOpenedBeneficiaryType(false);
                              }}
                            >
                              <div className="flex items-start">
                                <Icons.Check
                                  className={cn(
                                    'mr-2 h-4 w-4',
                                    field.value === beneficiaryType.id ? 'opacity-100' : 'opacity-0'
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
          name="genderId"
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
                      {field.value
                        ? genders?.body.data.find(({ id }) => id === field.value)?.name
                        : dictionary.gender.label}
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
                                form.setValue('genderId', gender.id);
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
          name="countryId"
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
                      {field.value
                        ? countries?.body.data.find(({ id }) => id === field.value)?.name
                        : dictionary.country.label}
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
                                form.setValue('countryId', country.id);
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
          name="birthStateId"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{dictionary.birthState.label}</FormLabel>
              <FormControl>
                <Popover open={openedBirthState} onOpenChange={setOpenedBirthState} modal={true}>
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
                      {field.value
                        ? states?.body.data.find(({ id }) => id === field.value)?.name
                        : dictionary.birthState.label}
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
                                form.setValue('birthStateId', state.id);
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
          name="stateId"
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
                      {field.value
                        ? states?.body.data.find(({ id }) => id === field.value)?.name
                        : dictionary.state.label}
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
                                form.setValue('stateId', state.id);
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
          name="birthCityId"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{dictionary.birthCity.label}</FormLabel>
              <FormControl>
                <Popover open={openedBirthCity} onOpenChange={setOpenedBirthCity} modal={true}>
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
                      {field.value
                        ? cities?.body.data.find(({ id }) => id === field.value)?.name
                        : dictionary.birthCity.label}
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
                                form.setValue('birthCityId', city.id);
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
          name="cityId"
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
                      {field.value
                        ? cities?.body.data.find(({ id }) => id === field.value)?.name
                        : dictionary.city.label}
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
                                form.setValue('cityId', city.id);
                                setOpenedCity(false);
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
          name="educationLevelId"
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
                      {field.value
                        ? educationLevels?.body.data.find(({ id }) => id === field.value)?.name
                        : dictionary.educationLevel.label}
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
                                form.setValue('educationLevelId', educationLevel.id);
                                setOpenedEducationLevel(false);
                              }}
                            >
                              <div className="flex items-start">
                                <Icons.Check
                                  className={cn(
                                    'mr-2 h-4 w-4',
                                    field.value === educationLevel.id ? 'opacity-100' : 'opacity-0'
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
          name="schoolGradeId"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{dictionary.schoolGrade.label}</FormLabel>
              <FormControl>
                <Popover open={openedSchoolGrade} onOpenChange={setOpenedSchoolGrade} modal={true}>
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
                      {field.value
                        ? schoolGrades?.body.data.find(({ id }) => id === field.value)?.name
                        : dictionary.schoolGrade.label}
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
                                form.setValue('schoolGradeId', schoolGrade.id);
                                setOpenedSchoolGrade(false);
                              }}
                            >
                              <div className="flex items-start">
                                <Icons.Check
                                  className={cn(
                                    'mr-2 h-4 w-4',
                                    field.value === schoolGrade.id ? 'opacity-100' : 'opacity-0'
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
        <FormField
          control={form.control}
          name="areaType"
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
          name="address"
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
          name="ethnicityId"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{dictionary.ethnicity.label}</FormLabel>
              <FormControl>
                <Popover open={openedEthnicity} onOpenChange={setOpenedEthnicity} modal={true}>
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
                      {field.value
                        ? ethnicities?.body.data.find(({ id }) => id === field.value)?.name
                        : dictionary.ethnicity.label}
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
                                form.setValue('ethnicityId', ethnicity.id);
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
          name="populationId"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{dictionary.population.label}</FormLabel>
              <FormControl>
                <Popover open={openedPopulation} onOpenChange={setOpenedPopulation} modal={true}>
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
                      {field.value
                        ? populations?.body.data.find(({ id }) => id === field.value)?.name
                        : dictionary.population.label}
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
                                form.setValue('populationId', population.id);
                                setOpenedPopulation(false);
                              }}
                            >
                              <div className="flex items-start">
                                <Icons.Check
                                  className={cn(
                                    'mr-2 h-4 w-4',
                                    field.value === population.id ? 'opacity-100' : 'opacity-0'
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
          name="vulnerabilityFactorId"
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
                      {field.value
                        ? vulnerabilityFactors?.body.data.find(({ id }) => id === field.value)?.name
                        : dictionary.vulnerabilityFactor.label}
                      <Icons.ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                    <Command>
                      <CommandInput placeholder={dictionary.vulnerabilityFactor.placeholder} />
                      <CommandList>
                        <CommandEmpty>{dictionary.vulnerabilityFactor.empty}</CommandEmpty>
                        <CommandGroup>
                          {vulnerabilityFactors?.body.data.map((vulnerabilityFactor) => (
                            <CommandItem
                              key={vulnerabilityFactor.id}
                              value={vulnerabilityFactor.id.toString()}
                              keywords={[vulnerabilityFactor.name]}
                              onSelect={() => {
                                form.setValue('vulnerabilityFactorId', vulnerabilityFactor.id);
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
          name="shiftId"
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
                      {field.value
                        ? shifts?.body.data.find(({ id }) => id === field.value)?.name
                        : dictionary.shift.label}
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
                                form.setValue('shiftId', shift.id);
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
          name="indigenousReserveId"
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
                      {field.value
                        ? indigenousReserves?.body.data.find(({ id }) => id === field.value)?.name
                        : dictionary.indigenousReserve.label}
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
                                form.setValue('indigenousReserveId', indigenousReserve.id);
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
          name="indigenousCommunityId"
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
                      {field.value
                        ? indigenousCommunities?.body.data.find(({ id }) => id === field.value)
                            ?.name
                        : dictionary.indigenousCommunity.label}
                      <Icons.ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                    <Command>
                      <CommandInput placeholder={dictionary.indigenousCommunity.placeholder} />
                      <CommandList>
                        <CommandEmpty>{dictionary.indigenousCommunity.empty}</CommandEmpty>
                        <CommandGroup>
                          {indigenousCommunities?.body.data.map((indigenousCommunity) => (
                            <CommandItem
                              key={indigenousCommunity.id}
                              value={indigenousCommunity.id.toString()}
                              keywords={[indigenousCommunity.name]}
                              onSelect={() => {
                                form.setValue('indigenousReserveId', indigenousCommunity.id);
                                setOpenedIndigenousReserve(false);
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
        <FormField
          control={form.control}
          name="birthDate"
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
              <FormDescription>{dictionary.birthDate.description}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="affiliationDate"
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
          name="deactivationDate"
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
          name="deactivationReason"
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
  );
}
