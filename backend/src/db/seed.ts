/**
 * Database Seeding Script
 * Version: 1.1.0
 *
 * Imports CSV data into SQLite database
 * Updated to use new DHLF-data folder with BOM handling
 */

import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { db } from './connection';
import {
  domains,
  subdomains,
  competencies,
  performance_criteria,
  roles,
  role_competencies
} from './schema';

const CSV_DATA_PATH = '../../../new DHLF-data';

interface CSVRow {
  [key: string]: string;
}

function readCSV(filename: string): Promise<CSVRow[]> {
  return new Promise((resolve, reject) => {
    const results: CSVRow[] = [];
    const filePath = path.join(__dirname, CSV_DATA_PATH, filename);

    fs.createReadStream(filePath)
      .pipe(csv({
        // Handle BOM (Byte Order Mark) in CSV files
        skipLines: 0,
        mapHeaders: ({ header }) => header.replace(/^\ufeff/, '').trim()
      }))
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', (error) => reject(error));
  });
}

async function seedDatabase() {
  console.log('🌱 Starting database seeding...');

  try {
    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await db.delete(role_competencies);
    await db.delete(performance_criteria);
    await db.delete(competencies);
    await db.delete(subdomains);
    await db.delete(domains);
    await db.delete(roles);

    // Import domains
    console.log('📂 Importing domains...');
    const domainData = await readCSV('domains.csv');
    await db.insert(domains).values(
      domainData.map(row => ({
        domain_id: row.domain_id,
        domain_code: row.domain_code,
        domain_name: row.domain_name,
        domain_title: row.domain_title,
        sort_order: parseInt(row.sort_order)
      }))
    );
    console.log(`✅ Imported ${domainData.length} domains`);

    // Import subdomains
    console.log('📁 Importing subdomains...');
    const subdomainData = await readCSV('subdomains.csv');
    await db.insert(subdomains).values(
      subdomainData.map(row => ({
        subdomain_id: row.subdomain_id,
        domain_id: row.domain_id,
        subdomain_code: row.subdomain_code,
        subdomain_name: row.subdomain_name,
        subdomain_title: row.subdomain_title,
        sort_order: parseInt(row.sort_order)
      }))
    );
    console.log(`✅ Imported ${subdomainData.length} subdomains`);

    // Import competencies
    console.log('🎯 Importing competencies...');
    const competencyData = await readCSV('competencies.csv');
    await db.insert(competencies).values(
      competencyData.map(row => ({
        competency_id: row.competency_id,
        subdomain_id: row.subdomain_id,
        competency_code: row.competency_code,
        competency_title: row.competency_title,
        competency_statement: row.competency_statement || null,
        sort_order: parseInt(row.sort_order)
      }))
    );
    console.log(`✅ Imported ${competencyData.length} competencies`);

    // Import performance criteria
    console.log('📋 Importing performance criteria...');
    const criteriaData = await readCSV('performance_criteria.csv');
    await db.insert(performance_criteria).values(
      criteriaData.map(row => ({
        criteria_id: row.criteria_id,
        competency_id: row.competency_id,
        criteria_text: row.criteria_text,
        sort_order: parseInt(row.sort_order)
      }))
    );
    console.log(`✅ Imported ${criteriaData.length} performance criteria`);

    // Import roles
    console.log('👥 Importing roles...');
    const roleData = await readCSV('roles.csv');
    await db.insert(roles).values(
      roleData.map(row => ({
        role_id: row.role_id,
        role_code: row.role_code,
        role_title: row.role_title,
        role_type: row.role_type,
        role_description: row.role_description || null
      }))
    );
    console.log(`✅ Imported ${roleData.length} roles`);

    // Import role-competency mappings
    console.log('🔗 Importing role-competency mappings...');
    const mappingData = await readCSV('role_competencies.csv');
    await db.insert(role_competencies).values(
      mappingData.map(row => ({
        role_competency_id: row.role_competency_id,
        role_id: row.role_id,
        competency_id: row.competency_id,
        proficiency_level: row.proficiency_level,
        is_required: row.is_required === 'True'
      }))
    );
    console.log(`✅ Imported ${mappingData.length} role-competency mappings`);

    console.log('🎉 Database seeding completed successfully!');

  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  }
}

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('✨ Seeding process completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Seeding process failed:', error);
      process.exit(1);
    });
}

export { seedDatabase };