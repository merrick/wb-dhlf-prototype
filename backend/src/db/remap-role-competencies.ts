/**
 * Role-Competencies UUID Remapping Script
 * Version: 1.0.0
 *
 * Maps old role_competencies to new UUIDs based on competency_code matching
 */

import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { v4 as uuidv4 } from 'uuid';

interface OldRoleCompetency {
  role_competency_id: string;
  role_id: string;
  competency_id: string;
  proficiency_level: string;
  is_required: string;
}

interface Competency {
  competency_id: string;
  competency_code: string;
}

interface Role {
  role_id: string;
  role_code: string;
}

interface NewRoleCompetency {
  role_competency_id: string;
  role_id: string;
  competency_id: string;
  proficiency_level: string;
  is_required: string;
}

function readCSV<T>(filename: string): Promise<T[]> {
  return new Promise((resolve, reject) => {
    const results: T[] = [];
    fs.createReadStream(filename)
      .pipe(csv({
        // Handle BOM (Byte Order Mark) in CSV files
        skipLines: 0,
        mapHeaders: ({ header }) => header.replace(/^\ufeff/, '').trim(),
        mapValues: ({ value }) => value.trim()
      }))
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', (error) => reject(error));
  });
}

async function remapRoleCompetencies() {
  console.log('🔄 Starting role_competencies remapping...');

  const OLD_DATA = path.join(__dirname, '../../../old DHLF-data');
  const NEW_DATA = path.join(__dirname, '../../../new DHLF-data');

  try {
    // Load old mappings
    console.log('📥 Loading old role_competencies...');
    const oldMappings = await readCSV<OldRoleCompetency>(
      path.join(OLD_DATA, 'role_competencies.csv')
    );
    console.log(`   Found ${oldMappings.length} mappings`);

    // Load old competencies (to get codes)
    console.log('📥 Loading old competencies...');
    const oldCompetencies = await readCSV<Competency>(
      path.join(OLD_DATA, 'competencies.csv')
    );
    const oldCompMap = new Map(
      oldCompetencies.map(c => [c.competency_id, c.competency_code])
    );
    console.log(`   Loaded ${oldCompetencies.length} old competencies`);

    // Load new competencies (to get new UUIDs)
    console.log('📥 Loading new competencies...');
    const newCompetencies = await readCSV<Competency>(
      path.join(NEW_DATA, 'competencies.csv')
    );
    const newCompMap = new Map(
      newCompetencies.map(c => [c.competency_code, c.competency_id])
    );
    console.log(`   Loaded ${newCompetencies.length} new competencies`);

    // Load old roles (to get codes)
    console.log('📥 Loading old roles...');
    const oldRoles = await readCSV<Role>(path.join(OLD_DATA, 'roles.csv'));
    const oldRoleMap = new Map(
      oldRoles.map(r => [r.role_id, r.role_code])
    );

    // Load new roles (to get new UUIDs)
    console.log('📥 Loading new roles...');
    const newRoles = await readCSV<Role>(path.join(NEW_DATA, 'roles.csv'));
    const newRoleMap = new Map(
      newRoles.map(r => [r.role_code, r.role_id])
    );

    // Remap
    console.log('🔄 Remapping UUIDs...');
    const newMappings: NewRoleCompetency[] = [];
    let successCount = 0;
    let failCount = 0;

    for (const oldMapping of oldMappings) {
      const competencyCode = oldCompMap.get(oldMapping.competency_id);
      const roleCode = oldRoleMap.get(oldMapping.role_id);

      if (!competencyCode) {
        console.warn(`   ⚠️  Competency ${oldMapping.competency_id} not found in old data`);
        failCount++;
        continue;
      }

      if (!roleCode) {
        console.warn(`   ⚠️  Role ${oldMapping.role_id} not found in old data`);
        failCount++;
        continue;
      }

      const newCompetencyId = newCompMap.get(competencyCode);
      const newRoleId = newRoleMap.get(roleCode);

      if (!newCompetencyId) {
        console.warn(`   ⚠️  Competency code ${competencyCode} not found in new data`);
        failCount++;
        continue;
      }

      if (!newRoleId) {
        console.warn(`   ⚠️  Role code ${roleCode} not found in new data`);
        failCount++;
        continue;
      }

      newMappings.push({
        role_competency_id: uuidv4(),
        role_id: newRoleId,
        competency_id: newCompetencyId,
        proficiency_level: oldMapping.proficiency_level,
        is_required: oldMapping.is_required
      });
      successCount++;
    }

    console.log(`✅ Successfully remapped ${successCount} mappings`);
    if (failCount > 0) {
      console.log(`❌ Failed to remap ${failCount} mappings`);
    }

    // Write to new CSV
    const outputPath = path.join(NEW_DATA, 'role_competencies.csv');
    console.log(`💾 Writing to ${outputPath}...`);

    const csvContent = [
      'role_competency_id,role_id,competency_id,proficiency_level,is_required',
      ...newMappings.map(m =>
        `${m.role_competency_id},${m.role_id},${m.competency_id},${m.proficiency_level},${m.is_required}`
      )
    ].join('\n');

    fs.writeFileSync(outputPath, csvContent, 'utf-8');
    console.log('🎉 Remapping completed successfully!');
    console.log(`   Output: ${outputPath}`);
    console.log(`   Total mappings: ${newMappings.length}`);

  } catch (error) {
    console.error('❌ Remapping failed:', error);
    throw error;
  }
}

// Run if executed directly
if (require.main === module) {
  remapRoleCompetencies()
    .then(() => {
      console.log('✨ Remapping process completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Remapping process failed:', error);
      process.exit(1);
    });
}

export { remapRoleCompetencies };
