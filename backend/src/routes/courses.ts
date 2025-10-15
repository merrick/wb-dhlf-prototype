/**
 * Courses API Routes
 * Version: 1.0.0
 */

import { Router } from 'express';
import { eq, like, or } from 'drizzle-orm';
import { db } from '../db/connection';
import { courses, course_competencies, competencies, subdomains, domains } from '../db/schema';
import { v4 as uuidv4 } from 'uuid';

export const coursesRouter = Router();

// GET /api/courses - List/search courses
coursesRouter.get('/', async (req, res) => {
  try {
    const { search, provider } = req.query;
    
    let query = db.select().from(courses);

    // Apply filters
    if (provider) {
      query = query.where(eq(courses.provider, provider as string));
    }

    // Apply search
    if (search) {
      const searchTerm = `%${search}%`;
      query = query.where(
        or(
          like(courses.title, searchTerm),
          like(courses.description, searchTerm),
          like(courses.provider, searchTerm)
        )
      );
    }

    const results = await query.orderBy(courses.title);
    
    res.json(results);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
});

// GET /api/courses/:id - Get course by ID
coursesRouter.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const course = await db
      .select()
      .from(courses)
      .where(eq(courses.course_id, id))
      .limit(1);
    
    if (course.length === 0) {
      return res.status(404).json({ error: 'Course not found' });
    }
    
    res.json(course[0]);
  } catch (error) {
    console.error('Error fetching course:', error);
    res.status(500).json({ error: 'Failed to fetch course' });
  }
});

// POST /api/courses - Create new course
coursesRouter.post('/', async (req, res) => {
  try {
    const { title, description, provider, duration, url } = req.body;
    
    // Validate required fields
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const newCourse = {
      course_id: uuidv4(),
      title,
      description: description || null,
      provider: provider || null,
      duration: duration || null,
      url: url || null
    };

    await db.insert(courses).values(newCourse);
    
    res.status(201).json(newCourse);
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(500).json({ error: 'Failed to create course' });
  }
});

// PUT /api/courses/:id - Update course
coursesRouter.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, provider, duration, url } = req.body;
    
    // Check if course exists
    const existingCourse = await db
      .select()
      .from(courses)
      .where(eq(courses.course_id, id))
      .limit(1);
    
    if (existingCourse.length === 0) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const updatedCourse = {
      title: title || existingCourse[0].title,
      description: description !== undefined ? description : existingCourse[0].description,
      provider: provider !== undefined ? provider : existingCourse[0].provider,
      duration: duration !== undefined ? duration : existingCourse[0].duration,
      url: url !== undefined ? url : existingCourse[0].url
    };

    await db
      .update(courses)
      .set(updatedCourse)
      .where(eq(courses.course_id, id));
    
    res.json({ course_id: id, ...updatedCourse });
  } catch (error) {
    console.error('Error updating course:', error);
    res.status(500).json({ error: 'Failed to update course' });
  }
});

// DELETE /api/courses/:id - Delete course
coursesRouter.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if course exists
    const existingCourse = await db
      .select()
      .from(courses)
      .where(eq(courses.course_id, id))
      .limit(1);
    
    if (existingCourse.length === 0) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Delete course-competency mappings first
    await db.delete(course_competencies).where(eq(course_competencies.course_id, id));
    
    // Delete course
    await db.delete(courses).where(eq(courses.course_id, id));
    
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({ error: 'Failed to delete course' });
  }
});