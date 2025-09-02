import {
  children,
  cities,
  guardians,
  identifications,
  inventoryTransactionLines,
  inventoryTransactions,
  modalities,
  planModalities,
  planModalityActivities,
  planModalityActivityResources,
  planModalityActivitySchoolChildren,
  planModalityActivitySchoolResources,
  planModalityActivitySchoolProfessionals,
  planModalityActivitySchoolProofChildrenAttendances,
  planModalityActivitySchoolProofFiles,
  planModalityActivitySchoolProofs,
  planModalityActivitySchools,
  plans,
  resourceClassifications,
  resources,
  professionals,
  programs,
  proofFileClassifications,
  schools,
  suppliers,
  resourcesToSuppliers,
  planModalityActivitySchoolProofChildrenResources,
} from '@/server/db/schema';
import { createDrizzleQueryParsers } from '@/server/utils/query';

export const { parseDrizzleFindManyQuery, parseDrizzleFindUniqueQuery } = createDrizzleQueryParsers(
  {
    // children
    child: children,
    children,
    // cities
    city: cities,
    cities,
    // guardians
    guardian: guardians,
    guardians,
    // identifications
    identification: identifications,
    identifications,
    // inventoryTransactionLines
    inventoryTransactionLine: inventoryTransactionLines,
    inventoryTransactionLines,
    // inventoryTransactions
    inventoryTransaction: inventoryTransactions,
    inventoryTransactions,
    // modalities
    modality: modalities,
    modalities,
    // planModalityActivityResources
    planModalityActivityResource: planModalityActivityResources,
    planModalityActivityResources,
    // planModalityActivitySchoolChildren
    planModalityActivitySchoolChild: planModalityActivitySchoolChildren,
    planModalityActivitySchoolChildren,
    // planModalityActivitySchoolResources
    planModalityActivitySchoolResource: planModalityActivitySchoolResources,
    planModalityActivitySchoolResources,
    // planModalityActivitySchoolProfessionals
    planModalityActivitySchoolProfessional: planModalityActivitySchoolProfessionals,
    planModalityActivitySchoolProfessionals,
    // planModalityActivitySchoolProofChildrenAttendances
    planModalityActivitySchoolProofChildrenAttendance:
      planModalityActivitySchoolProofChildrenAttendances,
    planModalityActivitySchoolProofChildrenAttendances,
    // planModalityActivitySchoolProofFiles
    planModalityActivitySchoolProofFile: planModalityActivitySchoolProofFiles,
    planModalityActivitySchoolProofFiles,
    // planModalityActivitySchoolProofs
    planModalityActivitySchoolProof: planModalityActivitySchoolProofs,
    planModalityActivitySchoolProofs,
    // planModalityActivitySchools
    planModalityActivitySchool: planModalityActivitySchools,
    planModalityActivitySchools,
    // planModalityActivities
    planModalityActivity: planModalityActivities,
    planModalityActivities,
    // planModalities
    planModality: planModalities,
    planModalities,
    // plans
    plan: plans,
    plans,
    // resourceClassifications
    resourceClassification: resourceClassifications,
    resourceClassifications,
    // resources
    resource: resources,
    resources,
    // professionals
    professional: professionals,
    professionals,
    // programs
    program: programs,
    programs,
    // proofFileClassifications
    proofFileClassification: proofFileClassifications,
    proofFileClassifications,
    // schools
    school: schools,
    schools,
    // suppliers
    supplier: suppliers,
    suppliers,
    resourcesToSuppliers: resourcesToSuppliers,
    planModalityActivitySchoolProofChildrenResources,
    planModalityActivitySchoolProofChildrenResource:
      planModalityActivitySchoolProofChildrenResources,
  }
);
