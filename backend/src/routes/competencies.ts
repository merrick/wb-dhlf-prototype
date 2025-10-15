/**
 * Competencies API Routes
 * Version: 1.0.0
 */

import { Router } from 'express';
import { eq, like, or } from 'drizzle-orm';
import { db } from '../db/connection';
import { competencies, performance_criteria, subdomains, domains } from '../db/schema';

export const competenciesRouter = Router();

// GET /api/competencies - List/search competencies
competenciesRouter.get('/', async (req, res) => {
  try {
    const { search, subdomain_id, domain_id } = req.query;
    
    let query = db
      .select({
        competency_id: competencies.competency_id,
        competency_code: competencies.competency_code,
        competency_title: competencies.competency_title,
        competency_statement: competencies.competency_statement,
        sort_order: competencies.sort_order,
        subdomain_id: competencies.subdomain_id,
        subdomain_name: subdomains.subdomain_name,
        subdomain_title: subdomains.subdomain_title,
        domain_id: domains.domain_id,
        domain_name: domains.domain_name,
        domain_title: domains.domain_title
      })
      .from(competencies)
      .innerJoin(subdomains, eq(competencies.subdomain_id, subdomains.subdomain_id))
      .innerJoin(domains, eq(subdomains.domain_id, domains.domain_id));

    // Apply filters
    if (subdomain_id) {
      query = query.where(eq(competencies.subdomain_id, subdomain_id as string));
    } else if (domain_id) {
      query = query.where(eq(domains.domain_id, domain_id as string));
    }

    // Apply search
    if (search) {
      const searchTerm = `%${search}%`;
      query = query.where(
        or(
          like(competencies.competency_title, searchTerm),
          like(competencies.competency_statement, searchTerm),
          like(competencies.competency_code, searchTerm)
        )
      );
    }

    const results = await query.orderBy(competencies.sort_order);
    
    res.json(results);
  } catch (error) {
    console.error('Error fetching competencies:', error);
    res.status(500).json({ error: 'Failed to fetch competencies' });
  }
});

// GET /api/competencies/:id - Get competency with performance criteria
competenciesRouter.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get competency details
    const competency = await db
      .select({
        competency_id: competencies.competency_id,
        competency_code: competencies.competency_code,
        competency_title: competencies.competency_title,
        competency_statement: competencies.competency_statement,
        sort_order: competencies.sort_order,
        subdomain_id: competencies.subdomain_id,
        subdomain_name: subdomains.subdomain_name,
        subdomain_title: subdomains.subdomain_title,
        domain_id: domains.domain_id,
        domain_name: domains.domain_name,
        domain_title: domains.domain_title
      })
      .from(competencies)
      .innerJoin(subdomains, eq(competencies.subdomain_id, subdomains.subdomain_id))
      .innerJoin(domains, eq(subdomains.domain_id, domains.domain_id))
      .where(eq(competencies.competency_id, id))
      .limit(1);
    
    if (competency.length === 0) {
      return res.status(404).json({ error: 'Competency not found' });
    }

    // Get performance criteria
    const criteria = await db
      .select()
      .from(performance_criteria)
      .where(eq(performance_criteria.competency_id, id))
      .orderBy(performance_criteria.sort_order);
    
    res.json({
      ...competency[0],
      performance_criteria: criteria
    });
  } catch (error) {
    console.error('Error fetching competency:', error);
    res.status(500).json({ error: 'Failed to fetch competency' });
  }
});