import { initContract } from '@ts-rest/core';
import { child } from './child';
import { city } from './city';
import { guardian } from './guardian';
import { identification } from './identification';
import { inventory } from './inventory';
import { inventoryTransaction } from './inventory-transaction';
import { inventoryTransactionLine } from './inventory-transaction-line';
import { modality } from './modality';
import { plan } from './plan';
import { planModality } from './plan-modality';
import { planModalityActivity } from './plan-modality-activity';
import { planModalityActivityResource } from './plan-modality-activity-resource';
import { planModalityActivitySchool } from './plan-modality-activity-school';
import { planModalityActivitySchoolChild } from './plan-modality-activity-school-child';
import { planModalityActivitySchoolResource } from './plan-modality-activity-school-resource';
import { planModalityActivitySchoolProfessional } from './plan-modality-activity-school-professional';
import { planModalityActivitySchoolProof } from './plan-modality-activity-school-proof';
import { planModalityActivitySchoolProofChildAttendance } from './plan-modality-activity-school-proof-child-attendance';
import { planModalityActivitySchoolProofFile } from './plan-modality-activity-school-proof-file';
import { resource } from './resource';
import { resourceClassification } from './resource-classification';
import { professional } from './professional';
import { program } from './program';
import { proofFileClassification } from './proof-file-classification';
import { school } from './school';
import { supplier } from './supplier';
import { resourceToSupplier } from './resource-to-supplier';
import { dashboard } from './dashboard';
import { beneficiaryType } from './beneficiary-type';
import { gender } from './gender';
import { country } from './country';
import { state } from './state';
import { educationLevel } from './education-level';
import { schoolGrade } from './school-grade';
import { ethnicity } from './ethnicity';
import { population } from './population';
import { vulnerabilityFactor } from './vulnerability-factor';
import { shift } from './shift';
import { indigenousReserve } from './indigenous-reserve';
import { indigenousCommunity } from './indigenous-community';
import { report } from './report';
import { modalityType } from './modality-type';
import { kinship } from './kinship';
import { serviceAipi } from './service-aipi';

const c = initContract();

export const contract = c.router(
  {
    child,
    city,
    guardian,
    identification,
    inventoryTransactionLine,
    inventoryTransaction,
    inventory,
    modality,
    planModalityActivityResource,
    planModalityActivitySchoolChild,
    planModalityActivitySchoolResource,
    planModalityActivitySchoolProfessional,
    planModalityActivitySchoolProofChildAttendance,
    planModalityActivitySchoolProofFile,
    planModalityActivitySchoolProof,
    planModalityActivitySchool,
    planModalityActivity,
    planModality,
    plan,
    resourceClassification,
    resource,
    professional,
    program,
    proofFileClassification,
    school,
    supplier,
    resourceToSupplier,
    dashboard,
    beneficiaryType,
    gender,
    country,
    state,
    educationLevel,
    schoolGrade,
    ethnicity,
    population,
    vulnerabilityFactor,
    shift,
    indigenousReserve,
    indigenousCommunity,
    report,
    modalityType,
    kinship,
    serviceAipi,
  },
  {
    pathPrefix: '/api/v1',
  }
);

export type Contract = typeof contract;
