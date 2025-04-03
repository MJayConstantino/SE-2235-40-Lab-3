import { prisma, app } from "../../server";
import request from "supertest";
import { badRequestStudent, correctDataStudent, wrongDataStudent } from "./mockData";
import { Student } from "@prisma/client";

const route = "/students";

describe("Student routes", () => {
  afterAll(async () => {
    await prisma.student.deleteMany();
    await prisma.$disconnect();
  }, 30000);

  describe("POST API endpoint ", () => {
    // POST ROUTE HAPPY PATH
    it("should create a new student successfully", async () => {
      const { body, statusCode } = await request(app).post(route).send(correctDataStudent);

      expect(statusCode).toBe(201);
      expect(body).toBeDefined();
    }, 10000);

    // POST ROUTE SAD PATH
    it("should fail in creating a new student because of wrong data ", async () => {
      const { statusCode } = await request(app).post(route).send(wrongDataStudent);

      expect(statusCode).toBe(500);
    }, 10000);

    it("should fail in creating a new student because of bad data request", async () => {
      const { statusCode } = await request(app).post(route).send(badRequestStudent);
  
      expect(statusCode).toBe(500);
    }, 10000);
  });

  describe("GET API endpoint ", () => {
    let createdStudent: Student;

    beforeEach(async () => {
      const response = await request(app).post(route).send(correctDataStudent);
      createdStudent = response.body;
    });

    afterEach(async () => {
      if (createdStudent?.id) {
        await prisma.student.delete({ where: { id: createdStudent.id } });
      }
    });

    // GET ROUTE HAPPY PATH
    it("should fetch an existing student successfully", async () => {
      const { statusCode, body } = await request(app).get(`${route}/${createdStudent.id}`);
      expect(statusCode).toBe(200);
      expect(body).toBeDefined();
      expect(body.id).toBe(createdStudent.id);
    }, 10000);

    // GET ROUTE SAD PATH
    it("should fail in fetching a because it would fetch a student that does not exist", async () => {
      const doesNotExistId = 9999;
      const response = await request(app).get(`${route}/${doesNotExistId}`);

      expect(response.status).toBe(404);
    }, 10000);

    it("should fail in fetching a because it would fetch with a bad request", async () => {
      const badRequestId = "badRequestId";
      const response = await request(app).get(`${route}/${badRequestId}`);

      expect(response.status).toBe(500);
    }, 10000);
  });

  describe("PUT API endpoint", () => {
    let createdStudent: Student;
    
    beforeEach(async () => {
      const response = await request(app).post(route).send(correctDataStudent);
      createdStudent = response.body;
    });

    afterEach(async () => {
      if (createdStudent?.id) {
        await prisma.student.delete({ where: { id: createdStudent.id } });
      }
    }, 10000);
  
    it("should update an existing student successfully", async () => {
      const updateData = {
        firstName: "Johnny",
        expectedSalary: 60000,
        expectedDateOfDefense: new Date("2026-01-15"),
      };
  
      const { statusCode, body } = await request(app)
        .put(`${route}/${createdStudent.id}`)
        .send(updateData);
  
      expect(statusCode).toBe(200);
      expect(body.firstName).toBe(updateData.firstName);
      expect(body.expectedSalary).toBe(updateData.expectedSalary);
    }, 10000);
  
    // PUT ROUTE SAD PATH
    it("should fail updating a student with invalid data", async () => {
      // Invalid update data (wrong type for firstName and bad date format).
      const invalidData = {
        firstName: 12345,
        expectedDateOfDefense: "invalid-date",
      };

      const { statusCode } = await request(app)
        .put(`${route}/${createdStudent.id}`)
        .send(invalidData);

      expect(statusCode).toBe(500);
    }, 10000);
  
    it("should fail updating a non-existent student", async () => {
      const updateData = {
        firstName: "Jane",
        expectedDateOfDefense: new Date("2026-01-15"),
      };
  
      const nonExistentId = 9999;
  
      const { statusCode } = await request(app)
        .put(`${route}/${nonExistentId}`)
        .send(updateData);
  
      expect(statusCode).toBe(500);
    }, 10000);
  });

});
