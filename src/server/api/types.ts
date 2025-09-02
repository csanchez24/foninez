import type { InventoryTransaction } from '../db/schema';

type Chart = {
  name: string;
  value1: number;
  value2: number;
};

export type DashboardResponse = {
  totalActivities: number;
  completeActivities: number;
  executingActivities: number;
  totalSchool: number;
  totalChildren: number;
  budgetChildren: number;
  inventories: InventoryTransaction[];
  registerMonthly: Chart[];
  activityMonthly: Chart[];
  statusChart: {
    status: string;
    value: number;
  }[];
  years: number[];
};

export type ReportActivities = {
  actividad: string;
  school: string;
  participantes: number;
  recursos: number;
  beneficiarios: number;
  soportes: number;
  estado: string;
};

export type ReportSchool = {
  nombre: string;
  dane: string;
  infrastructura: string;
  sede: string;
  area: string;
  sector: string;
  ciudad: string;
  actividades: number;
};

export type ReportProfessional = {
  tipoDocumento: string;
  numeroDocumento: string;
  primerNombre: string;
  segundoNombre: string;
  primerApellido: string;
  segundoApellido: string;
  email: string;
  telefono: string;
  direccion: string;
  estaActivo: string;
  actividades: number;
};

export type ReportGuardian = {
  tipoDocumento: string;
  numeroDocumento: string;
  primerNombre: string;
  segundoNombre: string;
  primerApellido: string;
  segundoApellido: string;
  telefono: string;
  beneficiarios: number;
};

export type ReportResources = {
  name: string;
  clasificacion: string;
  proveedor: string;
  precio: string;
  inventario: number;
  actividades: number;
};

export type ReportInventoryTransaction = {
  tipo: string;
  numeroOrden: string;
  factura: string;
  actividad: string;
  school: string;
  nota: string;
  notaAprobado: string;
  notaRechazado: string;
  recursos: number;
  estado: string;
};

export type ReportSupplier = {
  nombre: string;
  recursos: number;
};

export type ReportChildren = {
  tipoDocumento: string;
  numeroDocumento: string;
  primerNombre: string;
  segundoNombre: string;
  primerApellido: string;
  segundoApellido: string;
  guardian: string;
  genero: string;
  pais: string;
  estadoNacimiento: string;
  ciudadNacimiento: string;
  nivelEducacion: string;
  gradoEscolar: string;
  area: string;
  direccion: string;
  etnicidad: string;
  population: string;
  vulnerabilidad: string;
  jornada: string;
  reservaIndigena: string;
  comunidadIndigena: string;
  notaRechazo: string;
  fechaNacimiento: string;
  fechaAfiliacion: string;
  fechaInactivacion: string;
  actividades: number;
};

export type ReportCoverage = {
  TIP_DE_BENEFICIARIO: string;
  TIP_IDENTIFICACION_ESTUDIANTE: string;
  NUM_IDENTIFICACION_ESTUDIANTE: string;
  PRI_NOMBRE_ESTUDIANTE: string;
  SEG_NOMBRE_ESTUDIANTE: string;
  PRI_APELLIDO_ESTUDIANTE: string;
  SEG_APELLIDO_ESTUDIANTE: string;
  GENERO_BENEFICIARIO: string;
  FEC_NACIMIENTO_BENEFICIARIO: string;
  PAI_NACIMIENTO_BENEFICIARIO: string;
  COD_DEPARTAMENTO_NACIMIENTO_DANE: string;
  COD_MUNICIPIO_NACIMIENTO_DANE: string;
  COD_MUNICIPIO_RESIDENCIA_DANE: string;
  COD_ZONA_UBICACION_RESIDENCIA: string;
  DIR_RESIDENCIA_BENEFICIARIO: string;
  MOD_JEC: string;
  ARE_GEOGRAFICA: string;
  COD_INFRAESTRUCTURA_CCF: string;
  COD_COLEGIO_ESTUDIANTE: string;
  SEDE_ESTABLECIMIENTO_EDUCATIVO: string;
  NIVEL_ESCOLARIDAD: string;
  GRADO: string;
  TIP_SECTOR: string;
  TIP_JORNADA: string;
  COD_GRUPO_ETNICO_BENEFICIARIO: string;
  COD_RESGUARDO: string;
  COD_PUB_INDIGENA: string;
  COD_FACTOR_VULNERABILIDAD: string;
};

export type ReportMicrodato = {
  TIP_DE_BENEFICIARIO: string;
  TIP_IDENTIFICACION_BENEFICIARIO: string;
  NUM_IDENTIFICACION_BENEFICIARIO: string;
  PRI_NOMBRE_BENEFICIARIO: string;
  SEG_NOMBRE_BENEFICIARIO: string;
  PRI_APELLIDO_BENEFICIARIO: string;
  SEG_APELLIDO_BENEFICIARIO: string;
  GENERO_BENEFICIARIO: string;
  FEC_NACIMIENTO_BENEFICIARIO: string;
  PAI_NACIMIENTO_BENEFICIARIO: string;
  COD_DEPARTAMENTO_NACIMIENTO_DANE: string;
  COD_MUNICIPIO_NACIMIENTO_DANE: string;
  COD_DEPARTAMENTO_RESIDENCIA_DANE: string;
  COD_MUNICIPIO_RESIDENCIA_DANE: string;
  COD_ZONA_UBICACION_RESIDENCIA: string;
  DIR_RESIDENCIA_BENEFICIARIO: string;
  FEC_VINCULACION_BENEFICIARIO: string;
  FEC_INACTIVACION_BENEFICIARIO: string;
  MOTIVO_INACTIVACION_BENEFICIARIO: string;
  COD_GRUPO_ETNICO_BENEFICIARIO: string;
  COD_RESGUARDO: string;
  COD_PUB_INDIGENA: string;
  COD_FACTOR_VULNERABILIDAD: string;
  RESP_BENEFICIARIO: string;
  TIP_IDENTIFICACION_MADRE_PADRE_ACUDIENTE: string;
  NUM_IDENTIFICACION_MADRE_PADRE_ACUDIENTE: string;
  PRI_NOMBRE_MADRE_PADRE_ACUDIENTE: string;
  SEG_NOMBRE_MADRE_PADRE_ACUDIENTE: string;
  PRI_APELLIDO_MADRE_PADRE_ACUDIENTE: string;
  SEG_APELLIDO_MADRE_PADRE_ACUDIENTE: string;
  TEL_MADRE_PADRE_ACUDIENTE: string;
  COD_SERVICIO_AIPI: string;
  COD_DE_LA_INFRAESTRUCTURA: string;
  COD_DADO_MINISTERIO_EDUCACION: string;
};

export type ReportProgramResources = {
  recurso: string;
  cantidad: number;
};
