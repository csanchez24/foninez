import { tsr } from '@ts-rest/serverless/next';
import { contract } from '../contracts';
import type { ReportCoverage, ReportMicrodato, ReportProgramResources } from '../types';
import { db } from '@/server/db';
import {
  children,
  modalities,
  planModalities,
  planModalityActivities,
  planModalityActivityResources,
  planModalityActivitySchoolChildren,
  planModalityActivitySchools,
  plans,
  resources,
  schools,
} from '@/server/db/schema';
import { and, eq, sum } from 'drizzle-orm';
import { format } from 'date-fns';

export const report = tsr.router(contract.report, {
  coverage: async ({ query: { year, programId } }) => {
    const response: ReportCoverage[] = [];
    const planChildren = await db
      .select()
      .from(planModalityActivitySchoolChildren)
      .innerJoin(
        planModalityActivitySchools,
        eq(
          planModalityActivitySchools.id,
          planModalityActivitySchoolChildren.planModalityActivitySchoolId
        )
      )
      .innerJoin(
        planModalityActivities,
        eq(planModalityActivities.id, planModalityActivitySchools.planModalityActivityId)
      )
      .innerJoin(planModalities, eq(planModalities.id, planModalityActivities.planModalityId))
      .innerJoin(plans, eq(plans.id, planModalities.planId))
      .where(and(eq(plans.programId, programId), eq(plans.year, year)));

    for (const data of planChildren) {
      const child = await db.query.children.findFirst({
        where: eq(children.id, data.planModalityActivitySchoolChildren.childId),
        with: {
          identification: true,
          guardian: true,
          shift: true,
          gender: true,
          country: true,
          ethnicity: true,
          city: true,
          state: true,
          birthCity: true,
          birthState: true,
          population: true,
          schoolGrade: true,
          educationLevel: true,
          beneficiaryType: true,
          indigenousReserve: true,
          indigenousCommunity: true,
          vulnerabilityFactor: true,
          planModalityActivitySchoolChildren: true,
        },
      });
      const school = await db.query.schools.findFirst({
        where: eq(schools.id, data.planModalityActivitySchools.schoolId),
        with: {
          city: true,
        },
      });
      const modality = await db.query.modalities.findFirst({
        where: eq(modalities.id, data.planModalities.modalityId),
        with: {
          modalityType: true,
        },
      });
      response.push({
        TIP_DE_BENEFICIARIO: child?.beneficiaryType.code ?? '',
        TIP_IDENTIFICACION_ESTUDIANTE: child?.identification.id.toString() ?? '',
        NUM_IDENTIFICACION_ESTUDIANTE: child?.idNum ?? '',
        PRI_NOMBRE_ESTUDIANTE: child?.firstName ?? '',
        SEG_NOMBRE_ESTUDIANTE: child?.middleName ?? '',
        PRI_APELLIDO_ESTUDIANTE: child?.lastName ?? '',
        SEG_APELLIDO_ESTUDIANTE: child?.secondLastName ?? '',
        GENERO_BENEFICIARIO: child?.gender.code ?? '',
        FEC_NACIMIENTO_BENEFICIARIO: child?.birthDate ? format(child?.birthDate, 'PPP') : '',
        PAI_NACIMIENTO_BENEFICIARIO: child?.country.code ?? '',
        COD_DEPARTAMENTO_NACIMIENTO_DANE: child?.birthState.code ?? '',
        COD_MUNICIPIO_NACIMIENTO_DANE: child?.birthCity?.code ?? '',
        COD_MUNICIPIO_RESIDENCIA_DANE: child?.city.code ?? '',
        COD_ZONA_UBICACION_RESIDENCIA: child?.state.code ?? '',
        DIR_RESIDENCIA_BENEFICIARIO: child?.address ?? '',
        MOD_JEC: modality?.modalityType.code ?? '',
        ARE_GEOGRAFICA: '',
        COD_INFRAESTRUCTURA_CCF: school?.infrastructureCode ?? '',
        COD_COLEGIO_ESTUDIANTE: school?.infrastructureCode ?? '',
        SEDE_ESTABLECIMIENTO_EDUCATIVO: school?.sectorType ?? '',
        NIVEL_ESCOLARIDAD: child?.educationLevel.code ?? '',
        GRADO: child?.schoolGrade.code ?? '',
        TIP_SECTOR: child?.areaType ?? '',
        TIP_JORNADA: child?.shift.code ?? '',
        COD_GRUPO_ETNICO_BENEFICIARIO: child?.ethnicity.code ?? '',
        COD_RESGUARDO: child?.indigenousCommunity.code ?? '',
        COD_PUB_INDIGENA: child?.indigenousCommunity?.code ?? '',
        COD_FACTOR_VULNERABILIDAD: child?.vulnerabilityFactor.code ?? '',
      });
    }

    return { status: 200, body: response };
  },
  microdato: async ({ query: { programId, year } }) => {
    const response: ReportMicrodato[] = [];
    const planChildren = await db
      .select()
      .from(planModalityActivitySchoolChildren)
      .innerJoin(
        planModalityActivitySchools,
        eq(
          planModalityActivitySchools.id,
          planModalityActivitySchoolChildren.planModalityActivitySchoolId
        )
      )
      .innerJoin(
        planModalityActivities,
        eq(planModalityActivities.id, planModalityActivitySchools.planModalityActivityId)
      )
      .innerJoin(planModalities, eq(planModalities.id, planModalityActivities.planModalityId))
      .innerJoin(plans, eq(plans.id, planModalities.planId))
      .where(and(eq(plans.programId, programId), eq(plans.year, year)));

    for (const data of planChildren) {
      const child = await db.query.children.findFirst({
        where: eq(children.id, data.planModalityActivitySchoolChildren.childId),
        with: {
          identification: true,
          guardian: true,
          shift: true,
          gender: true,
          country: true,
          ethnicity: true,
          birthCity: true,
          birthState: true,
          city: true,
          state: true,
          population: true,
          schoolGrade: true,
          educationLevel: true,
          beneficiaryType: true,
          indigenousReserve: true,
          indigenousCommunity: true,
          vulnerabilityFactor: true,
          planModalityActivitySchoolChildren: true,
        },
      });
      const school = await db.query.schools.findFirst({
        where: eq(schools.id, data.planModalityActivitySchools.schoolId),
        with: {
          city: true,
        },
      });
      response.push({
        TIP_DE_BENEFICIARIO: child?.beneficiaryType.code ?? '',
        TIP_IDENTIFICACION_BENEFICIARIO: child?.identification.id.toString() ?? '',
        NUM_IDENTIFICACION_BENEFICIARIO: child?.idNum ?? '',
        PRI_NOMBRE_BENEFICIARIO: child?.firstName ?? '',
        SEG_NOMBRE_BENEFICIARIO: child?.middleName ?? '',
        PRI_APELLIDO_BENEFICIARIO: child?.lastName ?? '',
        SEG_APELLIDO_BENEFICIARIO: child?.secondLastName ?? '',
        GENERO_BENEFICIARIO: child?.gender.code ?? '',
        FEC_NACIMIENTO_BENEFICIARIO: child?.birthDate ? format(child?.birthDate, 'PPP') : '',
        PAI_NACIMIENTO_BENEFICIARIO: child?.country.code ?? '',
        COD_DEPARTAMENTO_NACIMIENTO_DANE: child?.birthState.code ?? '',
        COD_MUNICIPIO_NACIMIENTO_DANE: child?.birthCity?.code ?? '',
        COD_DEPARTAMENTO_RESIDENCIA_DANE: child?.state.code ?? '',
        COD_MUNICIPIO_RESIDENCIA_DANE: child?.city.code ?? '',
        COD_ZONA_UBICACION_RESIDENCIA: '',
        DIR_RESIDENCIA_BENEFICIARIO: child?.address ?? '',
        FEC_VINCULACION_BENEFICIARIO: child?.affiliationDate
          ? format(child?.affiliationDate, 'PPP')
          : '',
        FEC_INACTIVACION_BENEFICIARIO: child?.deactivationDate
          ? format(child?.deactivationDate, 'PPP')
          : '',
        MOTIVO_INACTIVACION_BENEFICIARIO: child?.deactivationReason ?? '',
        COD_GRUPO_ETNICO_BENEFICIARIO: child?.ethnicity.code ?? '',
        COD_RESGUARDO: child?.indigenousReserve.code ?? '',
        COD_PUB_INDIGENA: child?.indigenousCommunity?.code ?? '',
        COD_FACTOR_VULNERABILIDAD: child?.vulnerabilityFactor.code ?? '',
        RESP_BENEFICIARIO: '1',
        TIP_IDENTIFICACION_MADRE_PADRE_ACUDIENTE:
          child?.guardian.identificationId?.toString() ?? '',
        NUM_IDENTIFICACION_MADRE_PADRE_ACUDIENTE: child?.guardian.idNum ?? '',
        PRI_NOMBRE_MADRE_PADRE_ACUDIENTE: child?.guardian.firstName ?? '',
        SEG_NOMBRE_MADRE_PADRE_ACUDIENTE: child?.guardian.middleName ?? '',
        PRI_APELLIDO_MADRE_PADRE_ACUDIENTE: child?.guardian.lastName ?? '',
        SEG_APELLIDO_MADRE_PADRE_ACUDIENTE: child?.guardian.secondLastName ?? '',
        TEL_MADRE_PADRE_ACUDIENTE: child?.guardian.phone ?? '',
        COD_SERVICIO_AIPI: '',
        COD_DE_LA_INFRAESTRUCTURA: school?.infrastructureCode ?? '',
        COD_DADO_MINISTERIO_EDUCACION: school?.daneCode ?? '',
      });
    }

    return { status: 200, body: response };
  },
  resources: async ({ query: { programId, year } }) => {
    const response: ReportProgramResources[] = [];
    const resourcesData = await db
      .select({ name: resources.name, qty: sum(planModalityActivityResources.qty) })
      .from(planModalityActivityResources)
      .innerJoin(
        planModalityActivities,
        eq(planModalityActivities.id, planModalityActivityResources.planModalityActivityId)
      )
      .innerJoin(plans, eq(plans.id, planModalityActivities.planId))
      .innerJoin(resources, eq(resources.id, planModalityActivityResources.resourceId))
      .where(and(eq(plans.programId, programId), eq(plans.year, year)))
      .groupBy(resources.name);
    for (const data of resourcesData) {
      response.push({
        recurso: data.name,
        cantidad: parseInt(data.qty ?? '0') ?? 0,
      });
    }

    return { status: 200, body: response };
  },
});
