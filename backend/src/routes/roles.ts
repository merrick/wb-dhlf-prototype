/**
 * Roles API Routes
 * Version: 1.0.0
 */

import { Router } from 'express';
import { eq, like, or } from 'drizzle-orm';
import { db } from '../db/connection';
import { roles, role_competencies, competencies, subdomains, domains } from '../db/schema';
import { v4 as uuidv4 } from 'uuid';

export const rolesRouter = Router();

// GET /api/roles - List/search roles
rolesRouter.get('/', async (req, res) => {
  try {
    const { search, type } = req.query;
    
    let query = db.select().from(roles);

    // Apply filters
    if (type) {
      query = query.where(eq(roles.role_type, type as string));
    }

    // Apply search
    if (search) {
      const searchTerm = `%${search}%`;
      query = query.where(
        or(
          like(roles.role_title, searchTerm),
          like(roles.role_description, searchTerm),
          like(roles.role_code, searchTerm)
        )
      );
    }

    const results = await query.orderBy(roles.role_title);
    
    res.json(results);
  } catch (error) {
    console.error('Error fetching roles:', error);
    res.status(500).json({ error: 'Failed to fetch roles' });
  }
});

// GET /api/roles/:id - Get role by ID
rolesRouter.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const role = await db
      .select()
      .from(roles)
      .where(eq(roles.role_id, id))
      .limit(1);
    
    if (role.length === 0) {
      return res.status(404).json({ error: 'Role not found' });
    }
    
    res.json(role[0]);
  } catch (error) {
    console.error('Error fetching role:', error);
    res.status(500).json({ error: 'Failed to fetch role' });
  }
});

// POST /api/roles - Create new role
rolesRouter.post('/', async (req, res) => {
  try {
    const { role_code, role_title, role_type, role_description } = req.body;
    
    // Validate required fields
    if (!role_code || !role_title || !role_type) {
      return res.status(400).json({ 
        error: 'Missing required fields: role_code, role_title, role_type' 
      });
    }

    // Check for duplicate role_code
    const existingRole = await db
      .select()
      .from(roles)
      .where(eq(roles.role_code, role_code))
      .limit(1);
    
    if (existingRole.length > 0) {
      return res.status(400).json({ error: 'Role code already exists' });
    }

    const newRole = {
      role_id: uuidv4(),
      role_code,
      role_title,
      role_type,
      role_description: role_description || null
    };

    await db.insert(roles).values(newRole);
    
    res.status(201).json(newRole);
  } catch (error) {
    console.error('Error creating role:', error);
    res.status(500).json({ error: 'Failed to create role' });
  }
});

// PUT /api/roles/:id - Update role
rolesRouter.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { role_code, role_title, role_type, role_description } = req.body;
    
    // Check if role exists
    const existingRole = await db
      .select()
      .from(roles)
      .where(eq(roles.role_id, id))
      .limit(1);
    
    if (existingRole.length === 0) {
      return res.status(404).json({ error: 'Role not found' });
    }

    // Check for duplicate role_code (excluding current role)
    if (role_code && role_code !== existingRole[0].role_code) {
      const duplicateRole = await db
        .select()
        .from(roles)
        .where(eq(roles.role_code, role_code))
        .limit(1);
      
      if (duplicateRole.length > 0) {
        return res.status(400).json({ error: 'Role code already exists' });
      }
    }

    const updatedRole = {
      role_code: role_code || existingRole[0].role_code,
      role_title: role_title || existingRole[0].role_title,
      role_type: role_type || existingRole[0].role_type,
      role_description: role_description !== undefined ? role_description : existingRole[0].role_description
    };

    await db
      .update(roles)
      .set(updatedRole)
      .where(eq(roles.role_id, id));
    
    res.json({ role_id: id, ...updatedRole });
  } catch (error) {
    console.error('Error updating role:', error);
    res.status(500).json({ error: 'Failed to update role' });
  }
});

// DELETE /api/roles/:id - Delete role
rolesRouter.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if role exists
    const existingRole = await db
      .select()
      .from(roles)
      .where(eq(roles.role_id, id))
      .limit(1);
    
    if (existingRole.length === 0) {
      return res.status(404).json({ error: 'Role not found' });
    }

    // Delete role-competency mappings first
    await db.delete(role_competencies).where(eq(role_competencies.role_id, id));
    
    // Delete role
    await db.delete(roles).where(eq(roles.role_id, id));
    
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting role:', error);
    res.status(500).json({ error: 'Failed to delete role' });
  }
});

// GET /api/roles/:id/competencies - Get competencies for role
rolesRouter.get('/:id/competencies', async (req, res) => {
  try {
    const { id } = req.params;
    
    const roleCompetencies = await db
      .select({
        role_competency_id: role_competencies.role_competency_id,
        competency_id: competencies.competency_id,
        competency_code: competencies.competency_code,
        competency_title: competencies.competency_title,
        competency_statement: competencies.competency_statement,
        proficiency_level: role_competencies.proficiency_level,
        is_required: role_competencies.is_required,
        notes: role_competencies.notes,
        subdomain_name: subdomains.subdomain_name,
        domain_name: domains.domain_name
      })
      .from(role_competencies)
      .innerJoin(competencies, eq(role_competencies.competency_id, competencies.competency_id))
      .innerJoin(subdomains, eq(competencies.subdomain_id, subdomains.subdomain_id))
      .innerJoin(domains, eq(subdomains.domain_id, domains.domain_id))
      .where(eq(role_competencies.role_id, id))
      .orderBy(competencies.sort_order);
    
    res.json(roleCompetencies);
  } catch (error) {
    console.error('Error fetching role competencies:', error);
    res.status(500).json({ error: 'Failed to fetch role competencies' });
  }
});

// POST /api/roles/:id/competencies - Map competencies to role
rolesRouter.post('/:id/competencies', async (req, res) => {
  try {
    const { id } = req.params;
    const { competency_ids, proficiency_level = 'Required', notes } = req.body;
    
    if (!competency_ids || !Array.isArray(competency_ids)) {
      return res.status(400).json({ error: 'competency_ids array is required' });
    }

    // Check if role exists
    const existingRole = await db
      .select()
      .from(roles)
      .where(eq(roles.role_id, id))
      .limit(1);
    
    if (existingRole.length === 0) {
      return res.status(404).json({ error: 'Role not found' });
    }

    // Create mappings
    const mappings = competency_ids.map(competency_id => ({
      role_competency_id: uuidv4(),
      role_id: id,
      competency_id,
      proficiency_level,
      is_required: true,
      notes: notes || null
    }));

    await db.insert(role_competencies).values(mappings);
    
    res.status(201).json({ message: 'Competencies mapped successfully', count: mappings.length });
  } catch (error) {
    console.error('Error mapping competencies:', error);
    res.status(500).json({ error: 'Failed to map competencies' });
  }
});

// DELETE /api/roles/:roleId/competencies/:competencyId - Remove competency mapping
rolesRouter.delete('/:roleId/competencies/:competencyId', async (req, res) => {
  try {
    const { roleId, competencyId } = req.params;
    
    await db
      .delete(role_competencies)
      .where(
        eq(role_competencies.role_id, roleId) && 
        eq(role_competencies.competency_id, competencyId)
      );
    
    res.status(204).send();
  } catch (error) {
    console.error('Error removing competency mapping:', error);
    res.status(500).json({ error: 'Failed to remove competency mapping' });
  }
});