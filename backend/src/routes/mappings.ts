/**
 * Mappings Routes
 * Version: 1.1.0
 *
 * API endpoints for Excel mapping import functionality
 * v1.1.0: Fixed competency code matching using or() function
 */

import { Router } from 'express';
import multer from 'multer';
import * as XLSX from 'xlsx';
import { db } from '../db/connection';
import { roles, competencies, role_competencies } from '../db/schema';
import { eq, and, or } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import { getRoleCodeFromExcelName } from '../config/role-mappings';

const router = Router();

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

/**
 * POST /api/mappings/parse
 * Parses an Excel file and extracts role-competency mappings for preview
 */
router.post('/parse', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Parse Excel file from buffer
    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });

    // Find the "competency coded" sheet or fall back to "Sheet1"
    let sheetName = workbook.SheetNames.find(name =>
      name.toLowerCase().includes('competenc') && name.toLowerCase().includes('coded')
    );

    if (!sheetName) {
      sheetName = 'Sheet1';
    }

    if (!workbook.Sheets[sheetName]) {
      return res.status(400).json({
        error: `Could not find "competency coded" tab or "Sheet1" in the Excel file. Available sheets: ${workbook.SheetNames.join(', ')}`
      });
    }

    // Convert sheet to JSON
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet) as Array<{
      Role?: string;
      Domain?: number;
      Subdomain?: string;
      Competencies?: string;
    }>;

    if (data.length === 0) {
      return res.status(400).json({ error: 'The selected sheet is empty' });
    }

    // Extract role name from first row
    const excelRoleName = data[0].Role?.trim();
    if (!excelRoleName) {
      return res.status(400).json({ error: 'Could not find role name in the Excel file' });
    }

    // Map Excel role name to database role code
    const roleCode = getRoleCodeFromExcelName(excelRoleName);
    if (!roleCode) {
      return res.status(400).json({
        error: `Role "${excelRoleName}" not found in mapping configuration. Please update role-mappings.ts`,
        excelRoleName
      });
    }

    // Get role from database
    const [role] = await db.select().from(roles).where(eq(roles.role_code, roleCode));
    if (!role) {
      return res.status(404).json({
        error: `Role with code "${roleCode}" not found in database`,
        roleCode
      });
    }

    // Extract unique competency codes
    const competencyCodes = [...new Set(
      data
        .map(row => row.Competencies?.trim())
        .filter((code): code is string => !!code)
    )];

    if (competencyCodes.length === 0) {
      return res.status(400).json({ error: 'No competency codes found in the Excel file' });
    }

    // Validate all competency codes exist in database
    const foundCompetencies = await db
      .select()
      .from(competencies)
      .where(
        or(...competencyCodes.map(code => eq(competencies.competency_code, code)))
      );

    const foundCodes = new Set(foundCompetencies.map(c => c.competency_code));
    const invalidCodes = competencyCodes.filter(code => !foundCodes.has(code));

    // Get existing mappings count
    const existingMappings = await db
      .select()
      .from(role_competencies)
      .where(eq(role_competencies.role_id, role.role_id));

    // Return preview data with competency codes
    res.json({
      success: true,
      preview: {
        excelRoleName,
        role: {
          roleId: role.role_id,
          roleCode: role.role_code,
          roleTitle: role.role_title,
          roleType: role.role_type
        },
        competencyCount: competencyCodes.length,
        validCompetencies: foundCompetencies.length,
        invalidCompetencies: invalidCodes.length,
        invalidCodes,
        validCodes: competencyCodes.filter(code => foundCodes.has(code)),
        existingMappingsCount: existingMappings.length,
        sheetName
      }
    });

  } catch (error) {
    console.error('Parse error:', error);
    res.status(500).json({
      error: 'Failed to parse Excel file',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * POST /api/mappings/save
 * Saves role-competency mappings (replaces existing mappings for the role)
 */
router.post('/save', async (req, res) => {
  try {
    const { roleCode, competencyCodes } = req.body;

    if (!roleCode || !Array.isArray(competencyCodes)) {
      return res.status(400).json({ error: 'roleCode and competencyCodes array are required' });
    }

    // Get role from database
    const [role] = await db.select().from(roles).where(eq(roles.role_code, roleCode));
    if (!role) {
      return res.status(404).json({ error: `Role with code "${roleCode}" not found` });
    }

    // Get competencies from database
    const foundCompetencies = await db
      .select()
      .from(competencies)
      .where(
        or(...competencyCodes.map(code => eq(competencies.competency_code, code)))
      );

    if (foundCompetencies.length !== competencyCodes.length) {
      const foundCodes = new Set(foundCompetencies.map(c => c.competency_code));
      const missingCodes = competencyCodes.filter(code => !foundCodes.has(code));
      return res.status(400).json({
        error: 'Some competency codes were not found',
        missingCodes
      });
    }

    // Delete existing mappings for this role
    await db.delete(role_competencies).where(eq(role_competencies.role_id, role.role_id));

    // Insert new mappings
    const newMappings = foundCompetencies.map(comp => ({
      role_competency_id: uuidv4(),
      role_id: role.role_id,
      competency_id: comp.competency_id,
      proficiency_level: 'Required',
      is_required: 1, // SQLite uses INTEGER for boolean
      notes: null,
    }));

    if (newMappings.length > 0) {
      await db.insert(role_competencies).values(newMappings);
    }

    res.json({
      success: true,
      message: `Successfully mapped ${newMappings.length} competencies to ${role.role_title}`,
      mappingsCreated: newMappings.length
    });

  } catch (error) {
    console.error('Save error:', error);
    res.status(500).json({
      error: 'Failed to save mappings',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
