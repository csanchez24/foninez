import { relations, sql } from 'drizzle-orm';
import {
  boolean,
  date,
  datetime,
  float,
  foreignKey,
  index,
  int,
  mysqlEnum,
  mysqlTable,
  text,
  unique,
  varchar,
} from 'drizzle-orm/mysql-core';

// ---------------------------------------------------------
// Cities Table
//
// Mainly used to represent school location.
// ---------------------------------------------------------
export const cities = mysqlTable('cities', {
  id: int('id').autoincrement().primaryKey(),
  code: varchar('code', { length: 10 }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  createdAt: datetime('created_at', { mode: 'date', fsp: 3 })
    .default(sql`CURRENT_TIMESTAMP(3)`)
    .notNull(),
  updatedAt: datetime('updated_at', { mode: 'date', fsp: 3 })
    .default(sql`CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)`)
    .notNull(),
});

export const citiesRelations = relations(cities, ({ many }) => ({
  schools: many(schools),
}));

export type City = typeof cities.$inferSelect;
export type NewCity = typeof cities.$inferInsert;

// ---------------------------------------------------------
// School Table
//
// Activities take place at the school.
// ---------------------------------------------------------
export const schools = mysqlTable('schools', {
  id: int('id').autoincrement().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  infrastructureCode: varchar('infrastructure_code', { length: 255 }).notNull(),
  daneCode: varchar('dane_code', { length: 255 }).notNull(),
  branchCode: varchar('branch_code', { length: 255 }).notNull(),
  areaType: mysqlEnum('area_type', ['urban', 'rural']).notNull(),
  sectorType: mysqlEnum('sector_type', [
    'official / public',
    'private',
    'mixed',
    'not applicable',
  ]).notNull(),
  cityId: int('city_id').notNull(),
  createdAt: datetime('created_at', { mode: 'date', fsp: 3 })
    .default(sql`CURRENT_TIMESTAMP(3)`)
    .notNull(),
  updatedAt: datetime('updated_at', { mode: 'date', fsp: 3 })
    .default(sql`CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)`)
    .notNull(),
});

export const schoolsRelations = relations(schools, ({ one, many }) => ({
  city: one(cities, {
    fields: [schools.cityId],
    references: [cities.id],
  }),
  planModalityActivitySchools: many(planModalityActivitySchools),
}));

export type School = typeof schools.$inferSelect & {
  city?: City;
  planModalityActivitySchools?: PlanModalityActivitySchool[];
};
export type NewSchool = typeof schools.$inferInsert;

// ---------------------------------------------------------
// Inventory Table
//
// Track resource's inventory.
// ---------------------------------------------------------
export const inventories = mysqlTable(
  'inventories',
  {
    id: int('id').autoincrement().primaryKey(),
    qty: int('qty').notNull(),
    resourceId: int('resource_id').notNull(),
    createdAt: datetime('created_at', { mode: 'date', fsp: 3 })
      .default(sql`CURRENT_TIMESTAMP(3)`)
      .notNull(),
    updatedAt: datetime('updated_at', { mode: 'date', fsp: 3 })
      .default(sql`CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)`)
      .notNull(),
  },
  (t) => ({
    resourceFk: foreignKey({
      name: 'inventories_resource_fk',
      columns: [t.resourceId],
      foreignColumns: [resources.id],
    }),
  })
);

export const inventoriesRelations = relations(inventories, ({ one }) => ({
  resource: one(resources, {
    fields: [inventories.resourceId],
    references: [resources.id],
  }),
}));

export type Inventory = typeof inventories.$inferSelect;
export type NewInventory = typeof inventories.$inferInsert;

// ---------------------------------------------------------
// Resource Table
//
// Tangible asset needed/consumed by activity.
// ---------------------------------------------------------
export const resources = mysqlTable(
  'resources',
  {
    id: int('id').autoincrement().primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    price: float('price').notNull(),
    resourceClassificationId: int('resource_classification_id').notNull(),
    type: mysqlEnum('type', ['internal', 'external']).default('internal').notNull(),
    usageType: mysqlEnum('usage_type', ['general', 'individual']).default('general').notNull(),
    createdAt: datetime('created_at', { mode: 'date', fsp: 3 })
      .default(sql`CURRENT_TIMESTAMP(3)`)
      .notNull(),
    updatedAt: datetime('updated_at', { mode: 'date', fsp: 3 })
      .default(sql`CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)`)
      .notNull(),
  },
  (t) => ({
    resourceClassificationFk: foreignKey({
      name: 'resources_resource_classification_fk',
      columns: [t.resourceClassificationId],
      foreignColumns: [resourceClassifications.id],
    }),
  })
);

export const resourcesRelations = relations(resources, ({ one, many }) => ({
  inventoryTransactionLines: many(inventoryTransactionLines),
  planModalityActivityResources: many(planModalityActivityResources),
  resourcesToSuppliers: many(resourcesToSuppliers),
  inventory: one(inventories),
  resourceClassification: one(resourceClassifications, {
    fields: [resources.resourceClassificationId],
    references: [resourceClassifications.id],
  }),
}));

export type Resource = typeof resources.$inferSelect & {
  supplier?: Supplier;
  resourceClassification?: ResourceClassification;
  inventory?: Inventory;
  resourcesToSuppliers?: ResourceToSupplier[];
  inventoryTransactionLines?: InventoryTransactionLine[];
};
export type NewResource = typeof resources.$inferInsert;

// ---------------------------------------------------------
// Resource Supplier  Table
//
//
// ---------------------------------------------------------
export const resourcesToSuppliers = mysqlTable(
  'resourcesToSuppliers',
  {
    id: int('id').autoincrement().primaryKey(),
    supplierId: int('supplier_id').notNull(),
    resourceId: int('resource_id').notNull(),
    createdAt: datetime('created_at', { mode: 'date', fsp: 3 })
      .default(sql`CURRENT_TIMESTAMP(3)`)
      .notNull(),
    updatedAt: datetime('updated_at', { mode: 'date', fsp: 3 })
      .default(sql`CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)`)
      .notNull(),
  },
  (t) => ({
    supplierFk: foreignKey({
      name: 'resources_supplier_fk',
      columns: [t.supplierId],
      foreignColumns: [suppliers.id],
    }),
    resourceFk: foreignKey({
      name: 'resources_resource_fk',
      columns: [t.resourceId],
      foreignColumns: [resources.id],
    }),
  })
);

export const resourcesToSuppliersRelations = relations(resourcesToSuppliers, ({ one }) => ({
  supplier: one(suppliers, {
    fields: [resourcesToSuppliers.supplierId],
    references: [suppliers.id],
  }),
  resource: one(resources, {
    fields: [resourcesToSuppliers.resourceId],
    references: [resources.id],
  }),
}));

export type ResourceToSupplier = typeof resourcesToSuppliers.$inferSelect & {
  supplier?: Supplier;
  resource?: Resource;
};
export type NewResourceToSupplier = typeof resourcesToSuppliers.$inferInsert;

// ---------------------------------------------------------
// Resource Classification Table
//
// Classify resources
// ---------------------------------------------------------
export const resourceClassifications = mysqlTable('resourceClassifications', {
  id: int('id').autoincrement().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  createdAt: datetime('created_at', { mode: 'date', fsp: 3 })
    .default(sql`CURRENT_TIMESTAMP(3)`)
    .notNull(),
  updatedAt: datetime('updated_at', { mode: 'date', fsp: 3 })
    .default(sql`CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)`)
    .notNull(),
});

export const resourceClassificationsRelations = relations(resourceClassifications, ({ many }) => ({
  resources: many(resources),
}));

export type ResourceClassification = typeof resourceClassifications.$inferSelect;
export type NewResourceClassification = typeof resourceClassifications.$inferInsert;

// ---------------------------------------------------------
// Inventory Transactions
//
// Inventory related transactions affecting stocked qty of
// a resource.
// ---------------------------------------------------------
export const inventoryTransactions = mysqlTable(
  'inventoryTransactions',
  {
    id: int('id').autoincrement().primaryKey(),
    note: text('note').notNull(),
    type: mysqlEnum('type', ['stock', 'restock', 'consume', 'adjustment']).notNull(),
    status: mysqlEnum('status', ['pending', 'confirmed', 'rejected']).default('pending').notNull(),
    supplierInvoiceNumber: varchar('supplier_invoice_number', { length: 255 }),
    orderNumber: varchar('order_number', { length: 255 }),
    planModalityActivitySchoolId: int('plan_modality_activity_school_id'),
    rejectionNote: text('rejection_note'),
    approveNote: text('approve_note'),
    createdAt: datetime('created_at', { mode: 'date', fsp: 3 })
      .default(sql`CURRENT_TIMESTAMP(3)`)
      .notNull(),
    updatedAt: datetime('updated_at', { mode: 'date', fsp: 3 })
      .default(sql`CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)`)
      .notNull(),
  },
  (t) => ({
    planModalityActivitySchoolFk: foreignKey({
      name: 'plan_modality_activity_school_inventory_fk',
      columns: [t.planModalityActivitySchoolId],
      foreignColumns: [planModalityActivitySchools.id],
    }),
    supplierInvoiceNumberIdx: index('inv_tran_supplier_invoice_number_idx').on(
      t.supplierInvoiceNumber
    ),
    typeIdx: index('inv_tran_type_idx').on(t.type),
  })
);

export const inventoryTransactionsRelations = relations(inventoryTransactions, ({ many, one }) => ({
  inventoryTransactionLines: many(inventoryTransactionLines),
  planModalityActivitySchool: one(planModalityActivitySchools, {
    fields: [inventoryTransactions.planModalityActivitySchoolId],
    references: [planModalityActivitySchools.id],
  }),
}));

export type InventoryTransaction = typeof inventoryTransactions.$inferSelect & {
  inventoryTransactionLines?: InventoryTransactionLine[];
  planModalityActivitySchool?: PlanModalityActivitySchool | null;
};
export type NewInventoryTransaction = typeof inventoryTransactions.$inferInsert;

// ---------------------------------------------------------
// Inventory Transaction Lines
//
// This is the transaction lines related to the resource.
// ---------------------------------------------------------
export const inventoryTransactionLines = mysqlTable(
  'invetoryTransactionLines',
  {
    id: int('id').autoincrement().primaryKey(),
    qty: int('qty').notNull(),
    resourceId: int('resource_id').notNull(),
    inventoryTransactionId: int('inventory_transaction_id').notNull(),
    createdAt: datetime('created_at', { mode: 'date', fsp: 3 })
      .default(sql`CURRENT_TIMESTAMP(3)`)
      .notNull(),
    updatedAt: datetime('updated_at', { mode: 'date', fsp: 3 })
      .default(sql`CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)`)
      .notNull(),
  },
  (t) => ({
    resourceFk: foreignKey({
      name: 'inv_tran_line_resource_fk',
      columns: [t.resourceId],
      foreignColumns: [resources.id],
    }),
    inventoryTransactionFk: foreignKey({
      name: 'inv_tran_line_inv_tran_fk',
      columns: [t.inventoryTransactionId],
      foreignColumns: [inventoryTransactions.id],
    }),
  })
);

export const inventoryTransactionLinesRelations = relations(
  inventoryTransactionLines,
  ({ one }) => ({
    resource: one(resources, {
      fields: [inventoryTransactionLines.resourceId],
      references: [resources.id],
    }),
    inventoryTransaction: one(inventoryTransactions, {
      fields: [inventoryTransactionLines.inventoryTransactionId],
      references: [inventoryTransactions.id],
    }),
  })
);

export type InventoryTransactionLine = typeof inventoryTransactionLines.$inferSelect & {
  inventoryTransaction?: InventoryTransaction;
  resource?: Resource;
};
export type NewInventoryTransactionLine = typeof inventoryTransactionLines.$inferInsert;

// ---------------------------------------------------------
// Programs Table
//
// Umbrella category that encapsulates mutilple modalities.
//
// As of right now there are two main programs:
// 1. Complementary school
// 2. Early childhood care
// ---------------------------------------------------------
export const programs = mysqlTable('programs', {
  id: int('id').autoincrement().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  createdAt: datetime('created_at', { mode: 'date', fsp: 3 })
    .default(sql`CURRENT_TIMESTAMP(3)`)
    .notNull(),
  updatedAt: datetime('updated_at', { mode: 'date', fsp: 3 })
    .default(sql`CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)`)
    .notNull(),
});

export const programsRelations = relations(programs, ({ many }) => ({
  modalities: many(modalities),
  plans: many(plans),
}));

export type Program = typeof programs.$inferSelect & {
  modalities?: Modality[];
};
export type NewProgram = typeof programs.$inferInsert;

// ---------------------------------------------------------
// Modalities Table
//
// A category-like for the program.
//
// Programs and modalities
// 1. Complementary school
//  a. Recreational and culture
//  b. Technology and Science
//  b. Bilingual
// 2. Early childhood care
//  a. Psychology intervention
//  ...
// ---------------------------------------------------------
export const modalities = mysqlTable(
  'modalities',
  {
    id: int('id').autoincrement().primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    description: text('description'),
    programId: int('program_id').notNull(),
    modalityTypeId: int('modality_type_id').notNull(),
    createdAt: datetime('created_at', { mode: 'date', fsp: 3 })
      .default(sql`CURRENT_TIMESTAMP(3)`)
      .notNull(),
    updatedAt: datetime('updated_at', { mode: 'date', fsp: 3 })
      .default(sql`CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)`)
      .notNull(),
  },
  (t) => ({
    modalityTypesFk: foreignKey({
      name: 'modality_types_fk',
      columns: [t.modalityTypeId],
      foreignColumns: [modalityTypes.id],
    }),
    programFk: foreignKey({
      name: 'modality_program_fk',
      columns: [t.programId],
      foreignColumns: [programs.id],
    }),
  })
);

export const modalitiesRelations = relations(modalities, ({ one, many }) => ({
  program: one(programs, {
    fields: [modalities.programId],
    references: [programs.id],
  }),
  modalityType: one(modalityTypes, {
    fields: [modalities.modalityTypeId],
    references: [modalityTypes.id],
  }),
  planModalities: many(planModalities),
}));

export type Modality = typeof modalities.$inferSelect & {
  program?: Program;
};
export type NewModality = typeof modalities.$inferInsert;

// ---------------------------------------------------------
// Plan Table
//
// Annual Operative Plan is done ahead of time in order to
// lay down the budget for the next year.
//
// There'll be a plan per program every year. As of right
// now we have two programs, thus there will two plans.
// See above ^ for available programs.
// ---------------------------------------------------------
export const plans = mysqlTable(
  'plans',
  {
    id: int('id').autoincrement().primaryKey(),
    year: int('year').notNull(),
    longTermObjective: text('long_term_objective'),
    shortTermObjective: text('short_term_objective'),
    justification: text('justification'),
    description: text('description'),
    status: mysqlEnum('status', [
      'draft',
      'pending review',
      'reviewed',
      'rejected',
      'approved',
    ]).default('draft'),
    rejectionNote: text('rejection_note'),
    programId: int('program_id').notNull(),
    createdAt: datetime('created_at', { mode: 'date', fsp: 3 })
      .default(sql`CURRENT_TIMESTAMP(3)`)
      .notNull(),
    updatedAt: datetime('updated_at', { mode: 'date', fsp: 3 })
      .default(sql`CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)`)
      .notNull(),
  },
  (t) => ({
    programFk: foreignKey({
      name: 'plan_program_fk',
      columns: [t.programId],
      foreignColumns: [programs.id],
    }),
  })
);

export const plansRelations = relations(plans, ({ one, many }) => ({
  program: one(programs, {
    fields: [plans.programId],
    references: [programs.id],
  }),
  planModalities: many(planModalities),
  planModalityActivities: many(planModalityActivities),
}));

export type Plan = typeof plans.$inferSelect & {
  program?: Program;
  planModalities?: PlanModality[];
};
export type NewPlan = typeof plans.$inferInsert;

// ---------------------------------------------------------
// Plan Modalities Table
//
// No necessarily all modilities will make into the annual
// plan for that program. This is where this table plays
// its role in associating program and year(plan) with
// selected modalities to be excersice that year.
// ---------------------------------------------------------
export const planModalities = mysqlTable(
  'planModalities',
  {
    id: int('id').autoincrement().primaryKey(),
    planId: int('plan_id').notNull(),
    modalityId: int('modality_id').notNull(),
    createdAt: datetime('created_at', { mode: 'date', fsp: 3 })
      .default(sql`CURRENT_TIMESTAMP(3)`)
      .notNull(),
    updatedAt: datetime('updated_at', { mode: 'date', fsp: 3 })
      .default(sql`CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)`)
      .notNull(),
  },
  (t) => ({
    planFk: foreignKey({
      name: 'plan_modality_plan_fk',
      columns: [t.planId],
      foreignColumns: [plans.id],
    }),
    modalityFk: foreignKey({
      name: 'plan_modality_modality_fk',
      columns: [t.modalityId],
      foreignColumns: [modalities.id],
    }),
    planModalityUnqIdx: unique().on(t.planId, t.modalityId),
  })
);

export const plansModalitiesRelations = relations(planModalities, ({ one, many }) => ({
  plan: one(plans, {
    fields: [planModalities.planId],
    references: [plans.id],
  }),
  modality: one(modalities, {
    fields: [planModalities.modalityId],
    references: [modalities.id],
  }),
  planModalityActivities: many(planModalityActivities),
}));

export type PlanModality = typeof planModalities.$inferSelect & {
  modality?: Modality;
};
export type NewPlanModality = typeof planModalities.$inferInsert;

// ---------------------------------------------------------
// Plan > Modality > Activities Table
//
// Activities belonging to a modality and plan year.
//
// Programs > modalities > activity
// 1. Complementary school
//  a. Recreational and culture
//    i.  Baseball game
//    ii. Soccer tournament
//    ...
// 2. Early childhood care
//  a. Psychology intervention
//    i. Parental counseling
//    ...
//  ...
// ---------------------------------------------------------
export const planModalityActivities = mysqlTable(
  'planModalityActivities',
  {
    id: int('id').autoincrement().primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    description: text('description'),
    requiredProofOfCompletionCount: int('required_proof_of_completion_count').notNull(),
    planModalityId: int('plan_modality_id').notNull(),
    // NOTE: Add column for sake of simplicity
    planId: int('plan_id').notNull(),
    serviceAipiId: int('service_aipi_id').notNull(),
    startDate: datetime('start_date', { mode: 'date', fsp: 3 }).notNull(),
    endDate: datetime('end_date', { mode: 'date', fsp: 3 }).notNull(),
    createdAt: datetime('created_at', { mode: 'date', fsp: 3 })
      .default(sql`CURRENT_TIMESTAMP(3)`)
      .notNull(),
    updatedAt: datetime('updated_at', { mode: 'date', fsp: 3 })
      .default(sql`CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)`)
      .notNull(),
  },
  (t) => ({
    servicesAipi: foreignKey({
      name: 'plan_modality_activities_aipi_fk',
      columns: [t.serviceAipiId],
      foreignColumns: [servicesAipi.id],
    }),
    planId: foreignKey({
      name: 'plan_modality_activities_plan_fk',
      columns: [t.planId],
      foreignColumns: [plans.id],
    }),
    planModalityFk: foreignKey({
      name: 'plan_modality_activities_modality_fk',
      columns: [t.planModalityId],
      foreignColumns: [planModalities.id],
    }),
    nameIdx: index('plan_modality_name_idx').on(t.name),
  })
);

export const planModalityActivitiesRelations = relations(
  planModalityActivities,
  ({ one, many }) => ({
    serviceAIPI: one(servicesAipi, {
      fields: [planModalityActivities.serviceAipiId],
      references: [servicesAipi.id],
    }),
    planModality: one(planModalities, {
      fields: [planModalityActivities.planModalityId],
      references: [planModalities.id],
    }),
    plan: one(plans, {
      fields: [planModalityActivities.planId],
      references: [plans.id],
    }),
    planModalityActivityResources: many(planModalityActivityResources),
    planModalityActivitySchools: many(planModalityActivitySchools),
    planModalityActivityProofFiles: many(planModalityActivityProofFiles),
  })
);

export type PlanModalityActivity = typeof planModalityActivities.$inferSelect & {
  plan?: Plan;
  serviceAIPI?: ServiceAipi;
  planModality?: PlanModality;
  planModalityActivitySchools?: PlanModalityActivitySchool[];
  planModalityActivityResources?: PlanModalityActivityResource[];
  planModalityActivityProofFiles?: PlanModalityActivityProofFile[];
};
export type NewPlanModalityActivity = typeof planModalityActivities.$inferInsert;

// ---------------------------------------------------------
// Plan > Modality > Activitiy > Resources Table
//
// Resources related that `activity`. E.g. Baseball tournament
// requiring 200 bottles of waters for activity as the whole
// regardless of the location/school. Check down below where
// we break down the resources by location/school where each
// of this location will receive x amount of `waters` in
// this example.
// ---------------------------------------------------------
export const planModalityActivityResources = mysqlTable(
  'planModalityActivityResources',
  {
    id: int('id').autoincrement().primaryKey(),
    qty: int('qty').notNull(),
    resourceId: int('resource_id').notNull(),
    planModalityActivityId: int('plan_modality_activity_id').notNull(),
    createdAt: datetime('created_at', { mode: 'date', fsp: 3 })
      .default(sql`CURRENT_TIMESTAMP(3)`)
      .notNull(),
    updatedAt: datetime('updated_at', { mode: 'date', fsp: 3 })
      .default(sql`CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)`)
      .notNull(),
  },
  (t) => ({
    resourceFk: foreignKey({
      name: 'plan_modality_activity_resource_fk',
      columns: [t.resourceId],
      foreignColumns: [resources.id],
    }),
    planModalityActivityFk: foreignKey({
      name: 'plan_modality_activity_resources_modality_activity_fk',
      columns: [t.planModalityActivityId],
      foreignColumns: [planModalityActivities.id],
    }),
  })
);

export const planModalityActivityResourcesRelations = relations(
  planModalityActivityResources,
  ({ one, many }) => ({
    planModalityActivity: one(planModalityActivities, {
      fields: [planModalityActivityResources.planModalityActivityId],
      references: [planModalityActivities.id],
    }),
    resource: one(resources, {
      fields: [planModalityActivityResources.resourceId],
      references: [resources.id],
    }),
    planModalityActivitySchoolResources: many(planModalityActivitySchoolResources),
  })
);

export type PlanModalityActivityResource = typeof planModalityActivityResources.$inferSelect & {
  resource?: Resource;
  planModalityActivitySchoolResources?: PlanModalityActivitySchoolResource[];
};
export type NewPlanModalityActivityResource = typeof planModalityActivityResources.$inferInsert;

// ---------------------------------------------------------
// Plan > Modality > Activitiy > Schools Table
//
// Here we can associate locations/schools where we'll be
// executing the activity.
// ---------------------------------------------------------
export const planModalityActivitySchools = mysqlTable(
  'planModalityActivitySchools',
  {
    id: int('id').autoincrement().primaryKey(),
    planModalityActivityId: int('plan_modality_activity_id').notNull(),
    schoolId: int('school_id').notNull(),
    startDate: datetime('start_date', { mode: 'date', fsp: 3 }).notNull(),
    endDate: datetime('end_date', { mode: 'date', fsp: 3 }).notNull(),
    participantsQty: int('participants_qty').notNull(),
    rejectionNote: text('rejection_note'),
    status: mysqlEnum('status', [
      'pending',
      'planning',
      'requested_resources',
      'confirmed_resources',
      'active',
      'completed',
      'verified',
      'rejected',
    ])
      .default('pending')
      .notNull(),
    createdAt: datetime('created_at', { mode: 'date', fsp: 3 })
      .default(sql`CURRENT_TIMESTAMP(3)`)
      .notNull(),
    updatedAt: datetime('updated_at', { mode: 'date', fsp: 3 })
      .default(sql`CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)`)
      .notNull(),
  },
  (t) => ({
    schoolFk: foreignKey({
      name: 'plan_modality_activity_school_fk',
      columns: [t.schoolId],
      foreignColumns: [schools.id],
    }),
    planModalityActivityFk: foreignKey({
      name: 'plan_modality_activity_schools_modality_activity_fk',
      columns: [t.planModalityActivityId],
      foreignColumns: [planModalityActivities.id],
    }),
    statusIdx: index('plan_modality_activity_schools_status_idx').on(t.status),
  })
);

export const planModalityActivitySchoolsRelations = relations(
  planModalityActivitySchools,
  ({ one, many }) => ({
    planModalityActivity: one(planModalityActivities, {
      fields: [planModalityActivitySchools.planModalityActivityId],
      references: [planModalityActivities.id],
    }),
    school: one(schools, {
      fields: [planModalityActivitySchools.schoolId],
      references: [schools.id],
    }),
    planModalityActivitySchoolsResources: many(planModalityActivitySchoolResources),
    planModalityActivitySchoolProfessionals: many(planModalityActivitySchoolProfessionals),
    planModalityActivitySchoolChildren: many(planModalityActivitySchoolChildren),
    planModalityActivitySchoolProofs: many(planModalityActivitySchoolProofs),
    inventoryTransactions: many(inventoryTransactions),
  })
);

export type PlanModalityActivitySchool = typeof planModalityActivitySchools.$inferSelect & {
  planModalityActivity?: PlanModalityActivity;
  school?: School;
  planModalityActivitySchoolsResources?: PlanModalityActivitySchoolResource[];
  planModalityActivitySchoolProfessionals?: PlanModalityActivitySchoolProfessional[];
  planModalityActivitySchoolChildren?: PlanModalityActivitySchoolChild[];
  planModalityActivitySchoolProofs?: PlanModalityActivitySchoolProof[];
  inventoryTransactions?: InventoryTransaction[];
};

export type NewPlanModalityActivitySchool = typeof planModalityActivitySchools.$inferInsert;

// ----------------------------------------------------------------------
// Middle table (PlanModalityActivity)Schools < > (PlanModalityActivity)Resources
//
// ----------------------------------------------------------------------
export const planModalityActivitySchoolResources = mysqlTable(
  'planModalityActivitySchoolResources',
  {
    id: int('id').autoincrement().primaryKey(),
    planModalityActivityResourceId: int('plan_modality_activity_resource_id').notNull(),
    planModalityActivitySchoolId: int('plan_modality_activity_school_id').notNull(),
    resourcesQty: int('resources_qty').notNull(),
    resourcesReceivedQty: int('resources_received_qty').notNull().default(0),
    resourcesUsedQty: int('resources_used_qty').notNull().default(0),
    note: text('note'),
    createdAt: datetime('created_at', { mode: 'date', fsp: 3 })
      .default(sql`CURRENT_TIMESTAMP(3)`)
      .notNull(),
    updatedAt: datetime('updated_at', { mode: 'date', fsp: 3 })
      .default(sql`CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)`)
      .notNull(),
  },
  (t) => ({
    planModalityActivitySchoolFk: foreignKey({
      name: 'plan_modality_activity_school_resource_school_fk',
      columns: [t.planModalityActivitySchoolId],
      foreignColumns: [planModalityActivitySchools.id],
    }),
    planModalityActivityResourceFk: foreignKey({
      name: 'plan_modality_activity_school_resource_resource_fk',
      columns: [t.planModalityActivityResourceId],
      foreignColumns: [planModalityActivityResources.id],
    }),
  })
);

export const planModalityActivitySchoolsToResourcesRelations = relations(
  planModalityActivitySchoolResources,
  ({ one, many }) => ({
    planModalityActivitySchool: one(planModalityActivitySchools, {
      fields: [planModalityActivitySchoolResources.planModalityActivitySchoolId],
      references: [planModalityActivitySchools.id],
    }),
    planModalityActivityResource: one(planModalityActivityResources, {
      fields: [planModalityActivitySchoolResources.planModalityActivityResourceId],
      references: [planModalityActivityResources.id],
    }),
    planModalityActivitySchoolProofChildrenResources: many(
      planModalityActivitySchoolProofChildrenResources
    ),
  })
);

export type PlanModalityActivitySchoolResource =
  typeof planModalityActivitySchoolResources.$inferSelect & {
    planModalityActivityResource?: PlanModalityActivityResource;
    planModalityActivitySchoolProofChildrenResources?: PlanModalityActivitySchoolProofChildResource[];
  };
export type NewPlanModalityActivitySchoolResource =
  typeof planModalityActivitySchoolResources.$inferInsert;

// ----------------------------------------------------------------------
// Plan > Modality > Activitiy > Schools > Professinals Table
//
// ----------------------------------------------------------------------
export const planModalityActivitySchoolProfessionals = mysqlTable(
  'planModalityActivitySchoolProfessionals',
  {
    id: int('id').autoincrement().primaryKey(),
    planModalityActivitySchoolId: int('plan_modality_activity_school_id').notNull(),
    professionalId: int('professional_id').notNull(),
    createdAt: datetime('created_at', { mode: 'date', fsp: 3 })
      .default(sql`CURRENT_TIMESTAMP(3)`)
      .notNull(),
    updatedAt: datetime('updated_at', { mode: 'date', fsp: 3 })
      .default(sql`CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)`)
      .notNull(),
  },
  (t) => ({
    planModalityActivitySchoolFk: foreignKey({
      name: 'plan_modality_activity_school_professional_school_fk',
      columns: [t.planModalityActivitySchoolId],
      foreignColumns: [planModalityActivitySchools.id],
    }),
    professionalFk: foreignKey({
      name: 'plan_modality_activity_school_professional_professional_fk',
      columns: [t.professionalId],
      foreignColumns: [professionals.id],
    }),
  })
);

export const planModalityActivitySchoolsProfessionalsRelations = relations(
  planModalityActivitySchoolProfessionals,
  ({ one }) => ({
    planModalityActivitySchool: one(planModalityActivitySchools, {
      fields: [planModalityActivitySchoolProfessionals.planModalityActivitySchoolId],
      references: [planModalityActivitySchools.id],
    }),
    professional: one(professionals, {
      fields: [planModalityActivitySchoolProfessionals.professionalId],
      references: [professionals.id],
    }),
  })
);

export type PlanModalityActivitySchoolProfessional =
  typeof planModalityActivitySchoolProfessionals.$inferSelect & {
    professional?: Professional;
    planModalityActivitySchool?: PlanModalityActivitySchool;
  };
export type NewPlanModalityActivitySchoolProfessional =
  typeof planModalityActivitySchoolProfessionals.$inferInsert;

// ----------------------------------------------------------------------
// Plan > Modality > Activitiy > Schools > Children Table
//
// ----------------------------------------------------------------------
export const planModalityActivitySchoolChildren = mysqlTable(
  'planModalityActivitySchoolChildren',
  {
    id: int('id').autoincrement().primaryKey(),
    planModalityActivitySchoolId: int('plan_modality_activity_school_id').notNull(),
    childId: int('child_id').notNull(),
    status: mysqlEnum('status', ['pending', 'confirmed', 'rejected']).notNull().default('pending'),
    rejectionNote: text('rejection_note'),
    createdAt: datetime('created_at', { mode: 'date', fsp: 3 })
      .default(sql`CURRENT_TIMESTAMP(3)`)
      .notNull(),
    updatedAt: datetime('updated_at', { mode: 'date', fsp: 3 })
      .default(sql`CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)`)
      .notNull(),
  },
  (t) => ({
    planModalityActivitySchoolFk: foreignKey({
      name: 'plan_modality_activity_school_child_school_fk',
      columns: [t.planModalityActivitySchoolId],
      foreignColumns: [planModalityActivitySchools.id],
    }),
    childFk: foreignKey({
      name: 'plan_modality_activity_school_child_child_fk',
      columns: [t.childId],
      foreignColumns: [children.id],
    }),
  })
);

export const planModalityActivitySchoolChildrenRelations = relations(
  planModalityActivitySchoolChildren,
  ({ one, many }) => ({
    planModalityActivitySchool: one(planModalityActivitySchools, {
      fields: [planModalityActivitySchoolChildren.planModalityActivitySchoolId],
      references: [planModalityActivitySchools.id],
    }),
    child: one(children, {
      fields: [planModalityActivitySchoolChildren.childId],
      references: [children.id],
    }),
    planModalityActivitySchoolProofChildrenAttendances: many(
      planModalityActivitySchoolProofChildrenAttendances
    ),
    planModalityActivitySchoolProofChildrenResources: many(
      planModalityActivitySchoolProofChildrenResources
    ),
  })
);

export type PlanModalityActivitySchoolChild =
  typeof planModalityActivitySchoolChildren.$inferSelect & {
    planModalityActivitySchool?: PlanModalityActivitySchool;
    child?: Child;
    planModalityActivitySchoolProofChildrenAttendances?: PlanModalityActivitySchoolProofChildAttendance[];
  };
export type NewPlanModalityActivitySchoolChild =
  typeof planModalityActivitySchoolChildren.$inferInsert;

// ----------------------------------------------------------------------
// Plan > Modality > Activitiy > Schools > Proof Table
//
// Houses a number of files for a single session. Each session can
// can require more than one file as proof of completion so we keep
// this table as the parent of all files related to that session.
// ----------------------------------------------------------------------
export const planModalityActivitySchoolProofs = mysqlTable(
  'planModalityActivitySchoolProofs',
  {
    id: int('id').autoincrement().primaryKey(),
    planModalityActivitySchoolId: int('plan_modality_activity_school_id').notNull(),
    note: text('note'),
    createdAt: datetime('created_at', { mode: 'date', fsp: 3 })
      .default(sql`CURRENT_TIMESTAMP(3)`)
      .notNull(),
    updatedAt: datetime('updated_at', { mode: 'date', fsp: 3 })
      .default(sql`CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)`)
      .notNull(),
  },
  (t) => ({
    planModalityActivitySchoolFk: foreignKey({
      name: 'plan_modality_activity_school_proof_school_fk',
      columns: [t.planModalityActivitySchoolId],
      foreignColumns: [planModalityActivitySchools.id],
    }),
  })
);

export const planModalityActivitySchoolProofsRelations = relations(
  planModalityActivitySchoolProofs,
  ({ one, many }) => ({
    planModalityActivitySchool: one(planModalityActivitySchools, {
      fields: [planModalityActivitySchoolProofs.planModalityActivitySchoolId],
      references: [planModalityActivitySchools.id],
    }),
    planModalityActivitySchoolProofFiles: many(planModalityActivitySchoolProofFiles),
    planModalityActivitySchoolProofChildrenAttendances: many(
      planModalityActivitySchoolProofChildrenAttendances
    ),
    planModalityActivitySchoolProofChildrenResources: many(
      planModalityActivitySchoolProofChildrenResources
    ),
  })
);

export type PlanModalityActivitySchoolProof =
  typeof planModalityActivitySchoolProofs.$inferSelect & {
    planModalityActivitySchoolProofFiles?: PlanModalityActivitySchoolProofFile[];
    planModalityActivitySchoolProofChildrenAttendances?: PlanModalityActivitySchoolProofChildAttendance[];
    planModalityActivitySchoolProofChildrenResources?: PlanModalityActivitySchoolProofChildResource[];
  };
export type NewPlanModalityActivitySchoolProof =
  typeof planModalityActivitySchoolProofs.$inferInsert;

// ----------------------------------------------------------------------
// Plan > Modality > Activitiy > Schools > Proof > Files Table
//
// ----------------------------------------------------------------------
export const planModalityActivitySchoolProofFiles = mysqlTable(
  'planModalityActivitySchoolProofFiles',
  {
    id: int('id').autoincrement().primaryKey(),
    planModalityActivitySchoolProofId: int('plan_modality_activity_school_proof_id').notNull(),
    proofFileClassificationId: int('proof_file_classification_id').notNull(),
    filePath: varchar('file_path', { length: 255 }).notNull(),
    createdAt: datetime('created_at', { mode: 'date', fsp: 3 })
      .default(sql`CURRENT_TIMESTAMP(3)`)
      .notNull(),
    updatedAt: datetime('updated_at', { mode: 'date', fsp: 3 })
      .default(sql`CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)`)
      .notNull(),
  },
  (t) => ({
    planModalityActivitySchoolFk: foreignKey({
      name: 'plan_modality_activity_school_proof_file_school_fk',
      columns: [t.planModalityActivitySchoolProofId],
      foreignColumns: [planModalityActivitySchoolProofs.id],
    }),
    proofFileClassificationFk: foreignKey({
      name: 'proof_file_classification_fk',
      columns: [t.proofFileClassificationId],
      foreignColumns: [proofFileClassifications.id],
    }),
  })
);

export const planModalityActivitySchoolProofFilesRelations = relations(
  planModalityActivitySchoolProofFiles,
  ({ one }) => ({
    planModalityActivitySchoolProof: one(planModalityActivitySchoolProofs, {
      fields: [planModalityActivitySchoolProofFiles.planModalityActivitySchoolProofId],
      references: [planModalityActivitySchoolProofs.id],
    }),
    proofFileClassification: one(proofFileClassifications, {
      fields: [planModalityActivitySchoolProofFiles.proofFileClassificationId],
      references: [proofFileClassifications.id],
    }),
  })
);

export type PlanModalityActivitySchoolProofFile =
  typeof planModalityActivitySchoolProofFiles.$inferSelect & {
    proofFileClassification?: ProofFileClassification;
  };
export type NewPlanModalityActivitySchoolProofFile =
  typeof planModalityActivitySchoolProofFiles.$inferInsert;

// ----------------------------------------------------------------------
// Plan > Modality > Activitiy > Schools > Proof > Children Table
//
// ----------------------------------------------------------------------
export const planModalityActivitySchoolProofChildrenAttendances = mysqlTable(
  'planModalityActivitySchoolProofChildrenAttendances',
  {
    id: int('id').autoincrement().primaryKey(),
    planModalityActivitySchoolProofId: int('plan_modality_activity_school_proof_id').notNull(),
    planModalityActivitySchoolChildId: int('plan_modality_activity_school_child_id').notNull(),
    attended: boolean('attended').default(false).notNull(),
    createdAt: datetime('created_at', { mode: 'date', fsp: 3 })
      .default(sql`CURRENT_TIMESTAMP(3)`)
      .notNull(),
    updatedAt: datetime('updated_at', { mode: 'date', fsp: 3 })
      .default(sql`CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)`)
      .notNull(),
  },
  (t) => ({
    planModalityActivitySchoolProofFk: foreignKey({
      name: 'plan_modality_activity_school_proof_fk',
      columns: [t.planModalityActivitySchoolProofId],
      foreignColumns: [planModalityActivitySchoolProofs.id],
    }),
    planModalityActivitySchoolChildFk: foreignKey({
      name: 'plan_modality_activity_school_proof_children_proof_fk',
      columns: [t.planModalityActivitySchoolChildId],
      foreignColumns: [planModalityActivitySchoolChildren.id],
    }),
  })
);

export const planModalityActivitySchoolProofChildrenAttendancesRelations = relations(
  planModalityActivitySchoolProofChildrenAttendances,
  ({ one }) => ({
    planModalityActivitySchoolProof: one(planModalityActivitySchoolProofs, {
      fields: [
        planModalityActivitySchoolProofChildrenAttendances.planModalityActivitySchoolProofId,
      ],
      references: [planModalityActivitySchoolProofs.id],
    }),
    planModalityActivitySchoolChild: one(planModalityActivitySchoolChildren, {
      fields: [
        planModalityActivitySchoolProofChildrenAttendances.planModalityActivitySchoolChildId,
      ],
      references: [planModalityActivitySchoolChildren.id],
    }),
  })
);

export type PlanModalityActivitySchoolProofChildAttendance =
  typeof planModalityActivitySchoolProofChildrenAttendances.$inferSelect & {
    planModalityActivitySchoolProof?: PlanModalityActivitySchoolProof;
    planModalityActivitySchoolChild?: PlanModalityActivitySchoolChild;
  };
export type NewPlanModalityActivitySchoolProofChildAttendance =
  typeof planModalityActivitySchoolProofChildrenAttendances.$inferInsert;

// ----------------------------------------------------------------------
// Plan > Modality > Activitiy > Schools > Proof > Children > Resources Table
//
// ----------------------------------------------------------------------
export const planModalityActivitySchoolProofChildrenResources = mysqlTable(
  'planModalityActivitySchoolProofChildrenResources',
  {
    id: int('id').autoincrement().primaryKey(),
    planModalityActivitySchoolProofId: int('plan_modality_activity_school_proof_id').notNull(),
    planModalityActivitySchoolChildId: int('plan_modality_activity_school_child_id').notNull(),
    planModalityActivitySchoolResourceId: int(
      'plan_modality_activity_school_resource_id'
    ).notNull(),
    given: boolean('attended').default(false).notNull(),
    createdAt: datetime('created_at', { mode: 'date', fsp: 3 })
      .default(sql`CURRENT_TIMESTAMP(3)`)
      .notNull(),
    updatedAt: datetime('updated_at', { mode: 'date', fsp: 3 })
      .default(sql`CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)`)
      .notNull(),
  },
  (t) => ({
    planModalityActivitySchoolProofFk: foreignKey({
      name: 'plan_modality_activity_school_proof_children_fk',
      columns: [t.planModalityActivitySchoolProofId],
      foreignColumns: [planModalityActivitySchoolProofs.id],
    }),
    planModalityActivitySchoolChildFk: foreignKey({
      name: 'plan_modality_activity_school_proof_children_school_fk',
      columns: [t.planModalityActivitySchoolChildId],
      foreignColumns: [planModalityActivitySchoolChildren.id],
    }),
    planModalityActivitySchoolResourceFk: foreignKey({
      name: 'plan_modality_activity_school_proof_resource_school_fk',
      columns: [t.planModalityActivitySchoolResourceId],
      foreignColumns: [planModalityActivitySchoolResources.id],
    }),
  })
);

export const planModalityActivitySchoolProofChildrenResourcesRelations = relations(
  planModalityActivitySchoolProofChildrenResources,
  ({ one }) => ({
    planModalityActivitySchoolProof: one(planModalityActivitySchoolProofs, {
      fields: [planModalityActivitySchoolProofChildrenResources.planModalityActivitySchoolProofId],
      references: [planModalityActivitySchoolProofs.id],
    }),
    planModalityActivitySchoolChild: one(planModalityActivitySchoolChildren, {
      fields: [planModalityActivitySchoolProofChildrenResources.planModalityActivitySchoolChildId],
      references: [planModalityActivitySchoolChildren.id],
    }),
    planModalityActivitySchoolResource: one(planModalityActivitySchoolResources, {
      fields: [
        planModalityActivitySchoolProofChildrenResources.planModalityActivitySchoolResourceId,
      ],
      references: [planModalityActivitySchoolResources.id],
    }),
  })
);

export type PlanModalityActivitySchoolProofChildResource =
  typeof planModalityActivitySchoolProofChildrenResources.$inferSelect & {
    planModalityActivitySchoolProof?: PlanModalityActivitySchoolProof;
    planModalityActivitySchoolChild?: PlanModalityActivitySchoolChild;
    planModalityActivitySchoolResource?: PlanModalityActivitySchoolResource;
  };
export type NewPlanModalityActivitySchoolProofChildResource =
  typeof planModalityActivitySchoolProofChildrenAttendances.$inferInsert;

// ---------------------------------------------------------
// Proof Classifications
//
// List of preset `classifications` we can select from when
// adding a new proof file e.g. `attendance`, `profile_image`,
// etc...
// ---------------------------------------------------------
export const proofFileClassifications = mysqlTable('proofFileClassifications', {
  id: int('id').autoincrement().primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  createdAt: datetime('created_at', { mode: 'date', fsp: 3 })
    .default(sql`CURRENT_TIMESTAMP(3)`)
    .notNull(),
  updatedAt: datetime('updated_at', { mode: 'date', fsp: 3 })
    .default(sql`CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)`)
    .notNull(),
});

export const proofFileClassificationsRelations = relations(
  proofFileClassifications,
  ({ many }) => ({
    planModalityActivitySchoolProofFiles: many(planModalityActivitySchoolProofFiles),
  })
);

export type ProofFileClassification = typeof proofFileClassifications.$inferSelect;
export type NewProofFileClassification = typeof proofFileClassifications.$inferInsert;

// ---------------------------------------------------------
// TODO: Do we need table. @Carlos ask this on next meeting.
//
// Suppliers Table
//
// Company supplying resource/asset for event.
// ---------------------------------------------------------
export const suppliers = mysqlTable(
  'suppliers',
  {
    id: int('id').autoincrement().primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    createdAt: datetime('created_at', { mode: 'date', fsp: 3 })
      .default(sql`CURRENT_TIMESTAMP(3)`)
      .notNull(),
    updatedAt: datetime('updated_at', { mode: 'date', fsp: 3 })
      .default(sql`CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)`)
      .notNull(),
  },
  (t) => ({
    nameIdx: index('suppliers_name_idx').on(t.name),
  })
);

export const suppliersRelations = relations(suppliers, ({ many }) => ({
  resourcesToSuppliers: many(resourcesToSuppliers),
}));

export type Supplier = typeof suppliers.$inferSelect & {
  resourcesToSuppliers?: ResourceToSupplier[];
};
export type NewSupplier = typeof suppliers.$inferInsert;

// ---------------------------------------------------------
// Children Table
//
// Children receiving benefits.
// ---------------------------------------------------------
export const children = mysqlTable(
  'children',
  {
    id: int('id').autoincrement().primaryKey(),
    idNum: varchar('id_num', { length: 20 }).notNull(),
    firstName: varchar('first_name', { length: 255 }).notNull(),
    middleName: varchar('middle_name', { length: 255 }),
    lastName: varchar('last_name', { length: 255 }).notNull(),
    secondLastName: varchar('second_last_name', { length: 255 }),
    kinshipId: int('kinship_id').notNull(),
    guardianId: int('guardian_id').notNull(),
    identificationId: int('identification_id').notNull(),
    beneficiaryTypeId: int('beneficiary_type_id').notNull(),
    genderId: int('gender_id').notNull(),

    birthDate: date('birth_date').notNull(),
    affiliationDate: date('affiliation_date').notNull(),
    deactivationDate: date('deactivation_date'),

    countryId: int('country_id').notNull(),
    stateId: int('state_id').notNull(),
    cityId: int('city_id').notNull(),
    birthStateId: int('birth_state_id').notNull(),
    birthCityId: int('birth_city_id').notNull(),
    educationLevelId: int('education_level_id').notNull(),
    schoolGradeId: int('school_grade_id').notNull(),

    areaType: mysqlEnum('area_type', ['urban', 'rural']).notNull(),
    address: varchar('address', { length: 255 }),
    ethnicityId: int('ethnicity_id').notNull(),
    populationId: int('population_id').notNull(),
    vulnerabilityFactorId: int('vulnerability_factor_id').notNull(),
    shiftId: int('shift_id').notNull(),
    indigenousReserveId: int('indigenous_reserve_id').notNull(),
    indigenousCommunityId: int('indigenous_community_id').notNull(),
    deactivationReason: text('deactivation_reason'),
    createdAt: datetime('created_at', { mode: 'date', fsp: 3 })
      .default(sql`CURRENT_TIMESTAMP(3)`)
      .notNull(),
    updatedAt: datetime('updated_at', { mode: 'date', fsp: 3 })
      .default(sql`CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)`)
      .notNull(),
  },
  (t) => ({
    childrenKinshipFk: foreignKey({
      name: 'children_kinship_fk',
      columns: [t.kinshipId],
      foreignColumns: [kinships.id],
    }),
    childrenGuardianFk: foreignKey({
      name: 'children_guardian_fk',
      columns: [t.guardianId],
      foreignColumns: [guardians.id],
    }),
    childrenIdentificationFk: foreignKey({
      name: 'children_identification_fk',
      columns: [t.identificationId],
      foreignColumns: [identifications.id],
    }),
    childrenBeneficiaryTypeFk: foreignKey({
      name: 'children_beneficiary_type_fk',
      columns: [t.beneficiaryTypeId],
      foreignColumns: [beneficiaryTypes.id],
    }),
    childrenGenderFk: foreignKey({
      name: 'children_gender_fk',
      columns: [t.genderId],
      foreignColumns: [genders.id],
    }),
    childrenCountryFk: foreignKey({
      name: 'children_country_fk',
      columns: [t.countryId],
      foreignColumns: [countries.id],
    }),
    childrenStateFk: foreignKey({
      name: 'children_state_fk',
      columns: [t.stateId],
      foreignColumns: [states.id],
    }),
    childrenCityFk: foreignKey({
      name: 'children_city_fk',
      columns: [t.cityId],
      foreignColumns: [cities.id],
    }),
    childrenBirthStateFk: foreignKey({
      name: 'children_birth_state_fk',
      columns: [t.birthStateId],
      foreignColumns: [states.id],
    }),
    childrenBirthCityFk: foreignKey({
      name: 'children_birth_city_fk',
      columns: [t.birthCityId],
      foreignColumns: [cities.id],
    }),
    childrenEducationLevelFk: foreignKey({
      name: 'children_education_level_fk',
      columns: [t.educationLevelId],
      foreignColumns: [educationLevels.id],
    }),
    childrenSchoolGradeFk: foreignKey({
      name: 'children_school_grade_fk',
      columns: [t.schoolGradeId],
      foreignColumns: [schoolGrades.id],
    }),
    childrenEthnicityFk: foreignKey({
      name: 'children_ethnicity_fk',
      columns: [t.ethnicityId],
      foreignColumns: [ethnicities.id],
    }),
    childrenPopulationFk: foreignKey({
      name: 'children_population_fk',
      columns: [t.populationId],
      foreignColumns: [populations.id],
    }),
    childrenVulnerabilityFactorFk: foreignKey({
      name: 'children_vulnerability_factor_fk',
      columns: [t.vulnerabilityFactorId],
      foreignColumns: [vulnerabilityFactors.id],
    }),
    childrenShiftFk: foreignKey({
      name: 'children_shift_fk',
      columns: [t.shiftId],
      foreignColumns: [shifts.id],
    }),
    childrenIndigenousReserveFk: foreignKey({
      name: 'children_indigenous_reserve_fk',
      columns: [t.indigenousReserveId],
      foreignColumns: [indigenousReserves.id],
    }),
    childrenIndigenousCommunityFk: foreignKey({
      name: 'children_indigenous_community_fk',
      columns: [t.indigenousCommunityId],
      foreignColumns: [indigenousCommunities.id],
    }),
  })
);

export const childrenRelations = relations(children, ({ one, many }) => ({
  guardian: one(guardians, {
    fields: [children.guardianId],
    references: [guardians.id],
  }),
  kinship: one(kinships, {
    fields: [children.kinshipId],
    references: [kinships.id],
  }),
  identification: one(identifications, {
    fields: [children.identificationId],
    references: [identifications.id],
  }),
  planModalityActivitySchoolChildren: many(planModalityActivitySchoolChildren),
  beneficiaryType: one(beneficiaryTypes, {
    fields: [children.beneficiaryTypeId],
    references: [beneficiaryTypes.id],
  }),
  gender: one(genders, {
    fields: [children.genderId],
    references: [genders.id],
  }),
  country: one(countries, {
    fields: [children.countryId],
    references: [countries.id],
  }),
  state: one(states, {
    fields: [children.stateId],
    references: [states.id],
  }),
  city: one(cities, {
    fields: [children.cityId],
    references: [cities.id],
  }),
  birthState: one(states, {
    fields: [children.birthStateId],
    references: [states.id],
  }),
  birthCity: one(cities, {
    fields: [children.birthCityId],
    references: [cities.id],
  }),
  educationLevel: one(educationLevels, {
    fields: [children.educationLevelId],
    references: [educationLevels.id],
  }),
  schoolGrade: one(schoolGrades, {
    fields: [children.schoolGradeId],
    references: [schoolGrades.id],
  }),
  ethnicity: one(ethnicities, {
    fields: [children.ethnicityId],
    references: [ethnicities.id],
  }),
  population: one(populations, {
    fields: [children.populationId],
    references: [populations.id],
  }),
  vulnerabilityFactor: one(vulnerabilityFactors, {
    fields: [children.vulnerabilityFactorId],
    references: [vulnerabilityFactors.id],
  }),
  shift: one(shifts, {
    fields: [children.shiftId],
    references: [shifts.id],
  }),
  indigenousReserve: one(indigenousReserves, {
    fields: [children.indigenousReserveId],
    references: [indigenousReserves.id],
  }),
  indigenousCommunity: one(indigenousCommunities, {
    fields: [children.indigenousCommunityId],
    references: [indigenousCommunities.id],
  }),
}));

export type Child = typeof children.$inferSelect & {
  guardian?: Guardian;
  kinship?: Kinship;
  identification?: Identification;
  planModalityActivitySchoolChildren?: PlanModalityActivitySchoolChild[];
  beneficiaryType?: BeneficiaryType;
  gender?: Gender;
  country?: Country;
  state?: State;
  city?: City;
  birthState?: State;
  birthCity?: City;
  educationLevel?: EducationLevel;
  schoolGrade?: SchoolGrade;
  ethnicity?: Ethnicity;
  population?: Population;
  vulnerabilityFactor?: VulnerabilityFactor;
  shift?: Shift;
  indigenousReserve?: IndigenousReserve;
  indigenousCommunity?: IndigenousCommunity;
};
export type NewChild = typeof children.$inferInsert;

// ---------------------------------------------------------
// Guardians Table
//
// Guardians of children.
// ---------------------------------------------------------
export const guardians = mysqlTable(
  'guardians',
  {
    id: int('id').autoincrement().primaryKey(),
    idNum: varchar('id_num', { length: 20 }).notNull(),
    firstName: varchar('first_name', { length: 255 }).notNull(),
    middleName: varchar('middle_name', { length: 255 }),
    lastName: varchar('last_name', { length: 255 }).notNull(),
    secondLastName: varchar('second_last_name', { length: 255 }),
    identificationId: int('identification_id'),
    phone: varchar('phone', { length: 10 }),
    createdAt: datetime('created_at', { mode: 'date', fsp: 3 })
      .default(sql`CURRENT_TIMESTAMP(3)`)
      .notNull(),
    updatedAt: datetime('updated_at', { mode: 'date', fsp: 3 })
      .default(sql`CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)`)
      .notNull(),
  },
  (t) => ({
    guardiansIdentificationFk: foreignKey({
      name: 'guardians_identification_fk',
      columns: [t.identificationId],
      foreignColumns: [identifications.id],
    }),
  })
);

export const guardiansRelations = relations(guardians, ({ one, many }) => ({
  children: many(children),
  identification: one(identifications, {
    fields: [guardians.identificationId],
    references: [identifications.id],
  }),
}));

export type Guardian = typeof guardians.$inferSelect & {
  identification?: Identification;
  children?: Child[];
};
export type NewGuardian = typeof guardians.$inferInsert;

// ---------------------------------------------------------
// Identifications Table
// ---------------------------------------------------------
export const identifications = mysqlTable('identifications', {
  id: int('id').autoincrement().primaryKey(),
  code: varchar('code', { length: 5 }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  createdAt: datetime('created_at', { mode: 'date', fsp: 3 })
    .default(sql`CURRENT_TIMESTAMP(3)`)
    .notNull(),
  updatedAt: datetime('updated_at', { mode: 'date', fsp: 3 })
    .default(sql`CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)`)
    .notNull(),
});

export const identificationsRelations = relations(identifications, ({ many }) => ({
  children: many(children),
  professionals: many(professionals),
  guardians: many(guardians),
}));

export type Identification = typeof identifications.$inferSelect;
export type NewIdentification = typeof identifications.$inferInsert;

// ---------------------------------------------------------
// Professionals Table
//
// Employees coodinating/managing the event.
//
// TODO: Add identification to this person and rename
// identification -> identificationClassification
// and create new table to relate identicationClassification
// to person and in this table we can save the id number
// Yet to be confirmed by @Carlos!!!
// ---------------------------------------------------------
export const professionals = mysqlTable(
  'professionals',
  {
    id: int('id').autoincrement().primaryKey(),
    idNum: varchar('id_num', { length: 20 }).notNull(),
    identificationId: int('identification_id'),
    firstName: varchar('first_name', { length: 255 }).notNull(),
    middleName: varchar('middle_name', { length: 255 }),
    lastName: varchar('last_name', { length: 255 }).notNull(),
    secondLastName: varchar('second_last_name', { length: 255 }),
    address: varchar('address', { length: 255 }),
    email: varchar('email', { length: 255 }).notNull().unique(),
    phone: varchar('phone', { length: 10 }),
    authId: int('auth_id').unique().notNull(),
    isActive: boolean('is_active').default(true).notNull(),
    createdAt: datetime('created_at', { mode: 'date', fsp: 3 })
      .default(sql`CURRENT_TIMESTAMP(3)`)
      .notNull(),
    updatedAt: datetime('updated_at', { mode: 'date', fsp: 3 })
      .default(sql`CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)`)
      .notNull(),
  },
  (t) => ({
    professionalsIdentificationFk: foreignKey({
      name: 'professionals_identification_fk',
      columns: [t.identificationId],
      foreignColumns: [identifications.id],
    }),
  })
);

export const professionalsRelations = relations(professionals, ({ many, one }) => ({
  planModalityActivitySchoolProfessionals: many(planModalityActivitySchoolProfessionals),
  identification: one(identifications, {
    fields: [professionals.identificationId],
    references: [identifications.id],
  }),
}));

export type Professional = typeof professionals.$inferSelect & {
  planModalityActivitySchoolProfessionals?: PlanModalityActivitySchoolProfessional[];
  identification?: Identification;
};
export type NewProfessional = typeof professionals.$inferInsert;

// ---------------------------------------------------------
// Beneficiary Type
// ---------------------------------------------------------
export const beneficiaryTypes = mysqlTable('beneficiaryTypes', {
  id: int('id').autoincrement().primaryKey(),
  code: varchar('code', { length: 10 }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  createdAt: datetime('created_at', { mode: 'date', fsp: 3 })
    .default(sql`CURRENT_TIMESTAMP(3)`)
    .notNull(),
  updatedAt: datetime('updated_at', { mode: 'date', fsp: 3 })
    .default(sql`CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)`)
    .notNull(),
});

export const beneficiaryTypesRelations = relations(beneficiaryTypes, ({ many }) => ({
  children: many(children),
}));

export type BeneficiaryType = typeof beneficiaryTypes.$inferSelect;
export type NewBeneficiaryType = typeof beneficiaryTypes.$inferInsert;

// ---------------------------------------------------------
// Gender
// ---------------------------------------------------------
export const genders = mysqlTable('genders', {
  id: int('id').autoincrement().primaryKey(),
  code: varchar('code', { length: 10 }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  createdAt: datetime('created_at', { mode: 'date', fsp: 3 })
    .default(sql`CURRENT_TIMESTAMP(3)`)
    .notNull(),
  updatedAt: datetime('updated_at', { mode: 'date', fsp: 3 })
    .default(sql`CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)`)
    .notNull(),
});

export const genderRelations = relations(genders, ({ many }) => ({
  children: many(children),
}));

export type Gender = typeof genders.$inferSelect;
export type NewGender = typeof genders.$inferInsert;

// ---------------------------------------------------------
// Country
// ---------------------------------------------------------
export const countries = mysqlTable('countries', {
  id: int('id').autoincrement().primaryKey(),
  code: varchar('code', { length: 10 }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  createdAt: datetime('created_at', { mode: 'date', fsp: 3 })
    .default(sql`CURRENT_TIMESTAMP(3)`)
    .notNull(),
  updatedAt: datetime('updated_at', { mode: 'date', fsp: 3 })
    .default(sql`CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)`)
    .notNull(),
});

export const countryRelations = relations(countries, ({ many }) => ({
  children: many(children),
}));

export type Country = typeof countries.$inferSelect;
export type NewCountry = typeof countries.$inferInsert;

// ---------------------------------------------------------
// State
// ---------------------------------------------------------
export const states = mysqlTable('states', {
  id: int('id').autoincrement().primaryKey(),
  code: varchar('code', { length: 10 }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  createdAt: datetime('created_at', { mode: 'date', fsp: 3 })
    .default(sql`CURRENT_TIMESTAMP(3)`)
    .notNull(),
  updatedAt: datetime('updated_at', { mode: 'date', fsp: 3 })
    .default(sql`CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)`)
    .notNull(),
});

export const statesRelations = relations(states, ({ many }) => ({
  children: many(children),
}));

export type State = typeof states.$inferSelect;
export type NewState = typeof states.$inferInsert;

// ---------------------------------------------------------
// Education Level
// ---------------------------------------------------------
export const educationLevels = mysqlTable('educationLevels', {
  id: int('id').autoincrement().primaryKey(),
  code: varchar('code', { length: 10 }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  createdAt: datetime('created_at', { mode: 'date', fsp: 3 })
    .default(sql`CURRENT_TIMESTAMP(3)`)
    .notNull(),
  updatedAt: datetime('updated_at', { mode: 'date', fsp: 3 })
    .default(sql`CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)`)
    .notNull(),
});

export const educationLevelsRelations = relations(educationLevels, ({ many }) => ({
  children: many(children),
}));

export type EducationLevel = typeof educationLevels.$inferSelect;
export type NewEducationLevel = typeof educationLevels.$inferInsert;

// ---------------------------------------------------------
// School Grade
// ---------------------------------------------------------
export const schoolGrades = mysqlTable('schoolGrades', {
  id: int('id').autoincrement().primaryKey(),
  code: varchar('code', { length: 10 }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  createdAt: datetime('created_at', { mode: 'date', fsp: 3 })
    .default(sql`CURRENT_TIMESTAMP(3)`)
    .notNull(),
  updatedAt: datetime('updated_at', { mode: 'date', fsp: 3 })
    .default(sql`CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)`)
    .notNull(),
});

export const schoolGradesRelations = relations(schoolGrades, ({ many }) => ({
  children: many(children),
}));

export type SchoolGrade = typeof schoolGrades.$inferSelect;
export type NewSchoolGrade = typeof schoolGrades.$inferInsert;

// ---------------------------------------------------------
// Ethnicities
// ---------------------------------------------------------
export const ethnicities = mysqlTable('ethnicities', {
  id: int('id').autoincrement().primaryKey(),
  code: varchar('code', { length: 10 }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  createdAt: datetime('created_at', { mode: 'date', fsp: 3 })
    .default(sql`CURRENT_TIMESTAMP(3)`)
    .notNull(),
  updatedAt: datetime('updated_at', { mode: 'date', fsp: 3 })
    .default(sql`CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)`)
    .notNull(),
});

export const ethnicitiesRelations = relations(ethnicities, ({ many }) => ({
  children: many(children),
}));

export type Ethnicity = typeof ethnicities.$inferSelect;
export type NewEthnicity = typeof ethnicities.$inferInsert;

// ---------------------------------------------------------
// Population Code
// ---------------------------------------------------------
export const populations = mysqlTable('population', {
  id: int('id').autoincrement().primaryKey(),
  code: varchar('code', { length: 10 }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  createdAt: datetime('created_at', { mode: 'date', fsp: 3 })
    .default(sql`CURRENT_TIMESTAMP(3)`)
    .notNull(),
  updatedAt: datetime('updated_at', { mode: 'date', fsp: 3 })
    .default(sql`CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)`)
    .notNull(),
});

export const populationRelations = relations(populations, ({ many }) => ({
  children: many(children),
}));

export type Population = typeof populations.$inferSelect;
export type NewPopulation = typeof populations.$inferInsert;

// ---------------------------------------------------------
// vulnerabilityFactor
// ---------------------------------------------------------
export const vulnerabilityFactors = mysqlTable('vulnerabilityFactors', {
  id: int('id').autoincrement().primaryKey(),
  code: varchar('code', { length: 10 }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  createdAt: datetime('created_at', { mode: 'date', fsp: 3 })
    .default(sql`CURRENT_TIMESTAMP(3)`)
    .notNull(),
  updatedAt: datetime('updated_at', { mode: 'date', fsp: 3 })
    .default(sql`CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)`)
    .notNull(),
});

export const vulnerabilityFactorsRelations = relations(vulnerabilityFactors, ({ many }) => ({
  children: many(children),
}));

export type VulnerabilityFactor = typeof vulnerabilityFactors.$inferSelect;
export type NewVulnerabilityFactor = typeof vulnerabilityFactors.$inferInsert;

// ---------------------------------------------------------
// shift
// ---------------------------------------------------------
export const shifts = mysqlTable('shifts', {
  id: int('id').autoincrement().primaryKey(),
  code: varchar('code', { length: 10 }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  createdAt: datetime('created_at', { mode: 'date', fsp: 3 })
    .default(sql`CURRENT_TIMESTAMP(3)`)
    .notNull(),
  updatedAt: datetime('updated_at', { mode: 'date', fsp: 3 })
    .default(sql`CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)`)
    .notNull(),
});

export const shiftsRelations = relations(shifts, ({ many }) => ({
  children: many(children),
}));

export type Shift = typeof shifts.$inferSelect;
export type NewShift = typeof shifts.$inferInsert;

// ---------------------------------------------------------
// indigenousReserve
// ---------------------------------------------------------
export const indigenousReserves = mysqlTable('indigenousReserves', {
  id: int('id').autoincrement().primaryKey(),
  code: varchar('code', { length: 10 }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  createdAt: datetime('created_at', { mode: 'date', fsp: 3 })
    .default(sql`CURRENT_TIMESTAMP(3)`)
    .notNull(),
  updatedAt: datetime('updated_at', { mode: 'date', fsp: 3 })
    .default(sql`CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)`)
    .notNull(),
});

export const indigenousReservesRelations = relations(indigenousReserves, ({ many }) => ({
  children: many(children),
}));

export type IndigenousReserve = typeof indigenousReserves.$inferSelect;
export type NewIndigenousReserve = typeof indigenousReserves.$inferInsert;

// ---------------------------------------------------------
// indigenousCommunity
// ---------------------------------------------------------
export const indigenousCommunities = mysqlTable('indigenousCommunities', {
  id: int('id').autoincrement().primaryKey(),
  code: varchar('code', { length: 10 }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  createdAt: datetime('created_at', { mode: 'date', fsp: 3 })
    .default(sql`CURRENT_TIMESTAMP(3)`)
    .notNull(),
  updatedAt: datetime('updated_at', { mode: 'date', fsp: 3 })
    .default(sql`CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)`)
    .notNull(),
});

export const indigenousCommunitiesRelations = relations(indigenousCommunities, ({ many }) => ({
  children: many(children),
}));

export type IndigenousCommunity = typeof indigenousCommunities.$inferSelect;
export type NewindigenousCommunity = typeof indigenousCommunities.$inferInsert;

export const planModalityActivityProofFiles = mysqlTable(
  'planModalityActivityProofFiles',
  {
    id: int('id').autoincrement().primaryKey(),
    proofFileClassificationId: int('proof_file_classification_id').notNull(),
    planModalityActivityId: int('plan_modality_activity_id').notNull(),
    createdAt: datetime('created_at', { mode: 'date', fsp: 3 })
      .default(sql`CURRENT_TIMESTAMP(3)`)
      .notNull(),
    updatedAt: datetime('updated_at', { mode: 'date', fsp: 3 })
      .default(sql`CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)`)
      .notNull(),
  },
  (t) => ({
    proofFileClassificationFk: foreignKey({
      name: 'plan_proof_file_classification_fk',
      columns: [t.proofFileClassificationId],
      foreignColumns: [proofFileClassifications.id],
    }),
    planModalityActivityFk: foreignKey({
      name: 'plan_modality_activity_proof_file_fk',
      columns: [t.planModalityActivityId],
      foreignColumns: [planModalityActivities.id],
    }),
  })
);

export const planModalityActivityProofFilesRelations = relations(
  planModalityActivityProofFiles,
  ({ one }) => ({
    planModalityActivity: one(planModalityActivities, {
      fields: [planModalityActivityProofFiles.planModalityActivityId],
      references: [planModalityActivities.id],
    }),
    proofFileClassification: one(proofFileClassifications, {
      fields: [planModalityActivityProofFiles.proofFileClassificationId],
      references: [proofFileClassifications.id],
    }),
  })
);

export type PlanModalityActivityProofFile = typeof planModalityActivityProofFiles.$inferSelect & {
  proofFileClassification?: ProofFileClassification;
  planModalityActivity?: PlanModalityActivity;
};
export type NewPlanModalityActivityProofFile = typeof planModalityActivityProofFiles.$inferInsert;

// ---------------------------------------------------------
// modalityTypes
// ---------------------------------------------------------
export const modalityTypes = mysqlTable('modalityTypes', {
  id: int('id').autoincrement().primaryKey(),
  code: varchar('code', { length: 10 }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  createdAt: datetime('created_at', { mode: 'date', fsp: 3 })
    .default(sql`CURRENT_TIMESTAMP(3)`)
    .notNull(),
  updatedAt: datetime('updated_at', { mode: 'date', fsp: 3 })
    .default(sql`CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)`)
    .notNull(),
});

export const modalityTypesRelations = relations(modalityTypes, ({ many }) => ({
  modalities: many(modalities),
}));

export type ModalityType = typeof modalityTypes.$inferSelect;
export type NewModalityType = typeof modalityTypes.$inferInsert;

// ---------------------------------------------------------
// kinships
// ---------------------------------------------------------
export const kinships = mysqlTable('kinships', {
  id: int('id').autoincrement().primaryKey(),
  code: varchar('code', { length: 10 }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  createdAt: datetime('created_at', { mode: 'date', fsp: 3 })
    .default(sql`CURRENT_TIMESTAMP(3)`)
    .notNull(),
  updatedAt: datetime('updated_at', { mode: 'date', fsp: 3 })
    .default(sql`CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)`)
    .notNull(),
});

export const kinshipsRelations = relations(kinships, ({ many }) => ({
  children: many(children),
}));

export type Kinship = typeof kinships.$inferSelect;
export type NewKinship = typeof kinships.$inferInsert;

// ---------------------------------------------------------
// servicies AIPI
// ---------------------------------------------------------
export const servicesAipi = mysqlTable('servicesAipi', {
  id: int('id').autoincrement().primaryKey(),
  code: varchar('code', { length: 10 }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  createdAt: datetime('created_at', { mode: 'date', fsp: 3 })
    .default(sql`CURRENT_TIMESTAMP(3)`)
    .notNull(),
  updatedAt: datetime('updated_at', { mode: 'date', fsp: 3 })
    .default(sql`CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)`)
    .notNull(),
});

export const servicesAipiRelations = relations(servicesAipi, ({ many }) => ({
  planModalityActivities: many(planModalityActivities),
}));

export type ServiceAipi = typeof servicesAipi.$inferSelect;
export type NewServiceAipi = typeof servicesAipi.$inferInsert;
