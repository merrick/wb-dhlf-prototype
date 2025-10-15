/**
 * Domains API Routes
 * Version: 1.0.0
 */

import { Router } from 'express';
import { eq } from 'drizzle-orm';
import { db } from '../db/connection';
import { domains, subdomains } from '../db/schema';

export const domainsRouter = Router();

// GET /api/domains - List all domains
domainsRouter.get('/', async (req, res) => {
  try {
    const allDomains = await db
      .select()
      .from(domains)
      .orderBy(domains.sort_order);
    
    res.json(allDomains);
  } catch (error) {
    console.error('Error fetching domains:', error);
    res.status(500).json({ error: 'Failed to fetch domains' });
  }
});

// GET /api/domains/:id - Get domain by ID
domainsRouter.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const domain = await db
      .select()
      .from(domains)
      .where(eq(domains.domain_id, id))
      .limit(1);
    
    if (domain.length === 0) {
      return res.status(404).json({ error: 'Domain not found' });
    }
    
    res.json(domain[0]);
  } catch (error) {
    console.error('Error fetching domain:', error);
    res.status(500).json({ error: 'Failed to fetch domain' });
  }
});

// GET /api/domains/:id/subdomains - Get subdomains for a domain
domainsRouter.get('/:id/subdomains', async (req, res) => {
  try {
    const { id } = req.params;
    
    const domainSubdomains = await db
      .select()
      .from(subdomains)
      .where(eq(subdomains.domain_id, id))
      .orderBy(subdomains.sort_order);
    
    res.json(domainSubdomains);
  } catch (error) {
    console.error('Error fetching subdomains:', error);
    res.status(500).json({ error: 'Failed to fetch subdomains' });
  }
});