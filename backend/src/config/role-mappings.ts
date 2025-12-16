/**
 * Role Mapping Configuration
 * Version: 1.0.0
 *
 * Maps Excel role names to database role codes for competency mapping imports
 */

export const ROLE_MAPPINGS: Record<string, string> = {
  // Excel Role Name -> Database Role Code
  'Chief Epidemiologist': '1',
  'Department Chief, MoH': '14',
  'DH PIU Coordinator': '8',
  'Task Team Leader (TTL)': '10',
  'Digital Health Enterprise Architect': '6',
  'Digital Transformation Expert': '13',
};

/**
 * Get database role code from Excel role name
 * @param excelRoleName - Role name as it appears in Excel file
 * @returns Database role code or null if not found
 */
export function getRoleCodeFromExcelName(excelRoleName: string): string | null {
  return ROLE_MAPPINGS[excelRoleName] || null;
}
