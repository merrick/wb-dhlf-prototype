/**
 * Learning Modules API Routes
 * Version: 2.0.0
 */

import { Router } from 'express';
import { eq, like, or } from 'drizzle-orm';
import { db } from '../db/connection';
import { learning_modules, learning_module_competencies, competencies, subdomains, domains } from '../db/schema';
import { v4 as uuidv4 } from 'uuid';

export const learningModulesRouter = Router();

// GET /api/learning-modules - List/search learning modules
learningModulesRouter.get('/', async (req, res) => {
  try {
    const { search, provider } = req.query;

    let query = db.select().from(learning_modules);

    // Apply filters
    if (provider) {
      query = query.where(eq(learning_modules.provider, provider as string));
    }

    // Apply search
    if (search) {
      const searchTerm = `%${search}%`;
      query = query.where(
        or(
          like(learning_modules.title, searchTerm),
          like(learning_modules.description, searchTerm),
          like(learning_modules.provider, searchTerm)
        )
      );
    }

    const results = await query.orderBy(learning_modules.title);

    res.json(results);
  } catch (error) {
    console.error('Error fetching learning modules:', error);
    res.status(500).json({ error: 'Failed to fetch learning modules' });
  }
});

// GET /api/learning-modules/:id - Get learning module by ID
learningModulesRouter.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const learningModule = await db
      .select()
      .from(learning_modules)
      .where(eq(learning_modules.learning_module_id, id))
      .limit(1);

    if (learningModule.length === 0) {
      return res.status(404).json({ error: 'Learning module not found' });
    }

    res.json(learningModule[0]);
  } catch (error) {
    console.error('Error fetching learning module:', error);
    res.status(500).json({ error: 'Failed to fetch learning module' });
  }
});

// POST /api/learning-modules - Create new learning module
learningModulesRouter.post('/', async (req, res) => {
  try {
    const { title, description, provider, duration, url } = req.body;

    // Validate required fields
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const newLearningModule = {
      learning_module_id: uuidv4(),
      title,
      description: description || null,
      provider: provider || null,
      duration: duration || null,
      url: url || null
    };

    await db.insert(learning_modules).values(newLearningModule);

    res.status(201).json(newLearningModule);
  } catch (error) {
    console.error('Error creating learning module:', error);
    res.status(500).json({ error: 'Failed to create learning module' });
  }
});

// PUT /api/learning-modules/:id - Update learning module
learningModulesRouter.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, provider, duration, url } = req.body;

    // Check if learning module exists
    const existingModule = await db
      .select()
      .from(learning_modules)
      .where(eq(learning_modules.learning_module_id, id))
      .limit(1);

    if (existingModule.length === 0) {
      return res.status(404).json({ error: 'Learning module not found' });
    }

    const updatedModule = {
      title: title || existingModule[0].title,
      description: description !== undefined ? description : existingModule[0].description,
      provider: provider !== undefined ? provider : existingModule[0].provider,
      duration: duration !== undefined ? duration : existingModule[0].duration,
      url: url !== undefined ? url : existingModule[0].url
    };

    await db
      .update(learning_modules)
      .set(updatedModule)
      .where(eq(learning_modules.learning_module_id, id));

    res.json({ learning_module_id: id, ...updatedModule });
  } catch (error) {
    console.error('Error updating learning module:', error);
    res.status(500).json({ error: 'Failed to update learning module' });
  }
});

// DELETE /api/learning-modules/:id - Delete learning module
learningModulesRouter.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if learning module exists
    const existingModule = await db
      .select()
      .from(learning_modules)
      .where(eq(learning_modules.learning_module_id, id))
      .limit(1);

    if (existingModule.length === 0) {
      return res.status(404).json({ error: 'Learning module not found' });
    }

    // Delete learning module-competency mappings first
    await db.delete(learning_module_competencies).where(eq(learning_module_competencies.learning_module_id, id));

    // Delete learning module
    await db.delete(learning_modules).where(eq(learning_modules.learning_module_id, id));

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting learning module:', error);
    res.status(500).json({ error: 'Failed to delete learning module' });
  }
});
