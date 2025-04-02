import { Router } from "express";
import type { Request, Response } from "express";
import { prisma } from "../server";

const router = Router();

// Get all students
router.get('/', async (_req: Request, res: Response) => {
  try {
    const students = await prisma.student.findMany();
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});

// Get a single student
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const student = await prisma.student.findUnique({
      where: { id: Number(req.params.id) },
    });
    if (!student) {
      res.status(404).json({ error: 'Student not found' });
      return
    }
    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch student' });
  }
});

// Create a student
router.post('/', async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const student = await prisma.student.create({
      data: {
        ...data,
        expectedDateOfDefense: new Date(data.expectedDateOfDefense),
      },
    });
    res.status(201).json(student);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create student' });
  }
});

// Update a student
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const data = req.body;
    const student = await prisma.student.update({
      where: { id: Number(req.params.id) },
      data: {
        ...data,
        updatedAt: new Date(),
        expectedDateOfDefense: new Date(data.expectedDateOfDefense),
      },
    });
    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update student' });
  }
});

// Delete a student
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    await prisma.student.delete({
      where: { id: Number(req.params.id) },
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete student' });
  }
});

export default router;
