/**
 * Database Schema for Digital Health Competency Framework
 * Version: 1.0.0
 * 
 * SQLite schema using Drizzle ORM
 */

import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// Domains table
export const domains = sqliteTable('domains', {
  domain_id: text('domain_id').primaryKey(),
  domain_code: text('domain_code').notNull().unique(),
  domain_name: text('domain_name').notNull(),
  domain_title: text('domain_title').notNull(),
  sort_order: integer('sort_order').notNull(),
  created_at: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updated_at: text('updated_at').default(sql`CURRENT_TIMESTAMP`)
});

// Subdomains table
export const subdomains = sqliteTable('subdomains', {
  subdomain_id: text('subdomain_id').primaryKey(),
  domain_id: text('domain_id').notNull().references(() => domains.domain_id),
  subdomain_code: text('subdomain_code').notNull().unique(),
  subdomain_name: text('subdomain_name').notNull(),
  subdomain_title: text('subdomain_title').notNull(),
  sort_order: integer('sort_order').notNull(),
  created_at: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updated_at: text('updated_at').default(sql`CURRENT_TIMESTAMP`)
});

// Competencies table
export const competencies = sqliteTable('competencies', {
  competency_id: text('competency_id').primaryKey(),
  subdomain_id: text('subdomain_id').notNull().references(() => subdomains.subdomain_id),
  competency_code: text('competency_code').notNull().unique(),
  competency_title: text('competency_title').notNull(),
  competency_statement: text('competency_statement'),
  sort_order: integer('sort_order').notNull(),
  created_at: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updated_at: text('updated_at').default(sql`CURRENT_TIMESTAMP`)
});

// Performance Criteria table
export const performance_criteria = sqliteTable('performance_criteria', {
  criteria_id: text('criteria_id').primaryKey(),
  competency_id: text('competency_id').notNull().references(() => competencies.competency_id),
  criteria_text: text('criteria_text').notNull(),
  sort_order: integer('sort_order').notNull(),
  created_at: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updated_at: text('updated_at').default(sql`CURRENT_TIMESTAMP`)
});

// Roles table
export const roles = sqliteTable('roles', {
  role_id: text('role_id').primaryKey(),
  role_code: text('role_code').notNull(),
  role_title: text('role_title').notNull(),
  role_type: text('role_type').notNull(), // Government, Other, World Bank
  role_description: text('role_description'),
  created_at: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updated_at: text('updated_at').default(sql`CURRENT_TIMESTAMP`)
});

// Role-Competency mappings table
export const role_competencies = sqliteTable('role_competencies', {
  role_competency_id: text('role_competency_id').primaryKey(),
  role_id: text('role_id').notNull().references(() => roles.role_id),
  competency_id: text('competency_id').notNull().references(() => competencies.competency_id),
  proficiency_level: text('proficiency_level').notNull().default('Required'), // Required, Basic, Intermediate, Advanced
  is_required: integer('is_required', { mode: 'boolean' }).notNull().default(true),
  notes: text('notes'),
  created_at: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updated_at: text('updated_at').default(sql`CURRENT_TIMESTAMP`)
});

// Courses table (for future use)
export const courses = sqliteTable('courses', {
  course_id: text('course_id').primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  provider: text('provider'),
  duration: text('duration'),
  url: text('url'),
  created_at: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updated_at: text('updated_at').default(sql`CURRENT_TIMESTAMP`)
});

// Course-Competency mappings table (for future use)
export const course_competencies = sqliteTable('course_competencies', {
  course_competency_id: text('course_competency_id').primaryKey(),
  course_id: text('course_id').notNull().references(() => courses.course_id),
  competency_id: text('competency_id').notNull().references(() => competencies.competency_id),
  coverage_level: text('coverage_level'), // Full, Partial, Introduction
  notes: text('notes'),
  created_at: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updated_at: text('updated_at').default(sql`CURRENT_TIMESTAMP`)
});

// Type definitions for TypeScript
export type Domain = typeof domains.$inferSelect;
export type NewDomain = typeof domains.$inferInsert;

export type Subdomain = typeof subdomains.$inferSelect;
export type NewSubdomain = typeof subdomains.$inferInsert;

export type Competency = typeof competencies.$inferSelect;
export type NewCompetency = typeof competencies.$inferInsert;

export type PerformanceCriteria = typeof performance_criteria.$inferSelect;
export type NewPerformanceCriteria = typeof performance_criteria.$inferInsert;

export type Role = typeof roles.$inferSelect;
export type NewRole = typeof roles.$inferInsert;

export type RoleCompetency = typeof role_competencies.$inferSelect;
export type NewRoleCompetency = typeof role_competencies.$inferInsert;

export type Course = typeof courses.$inferSelect;
export type NewCourse = typeof courses.$inferInsert;

export type CourseCompetency = typeof course_competencies.$inferSelect;
export type NewCourseCompetency = typeof course_competencies.$inferInsert;