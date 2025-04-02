import { beforeEach, describe } from "node:test";
import { prisma, app } from "../../server";
import request from "supertest";

const route = "/students";

const testStudent = {
  id: 1,
  firstName: "John",
  lastName: "Doe",
  groupName: "Group A",
  role: "Student",
  expectedSalary: 50000,
  expectedDateOfDefense: new Date("2023-12-01"),
  createdAt: new Date("2023-01-01T00:00:00Z"),
  updatedAt: new Date("2023-01-01T00:00:00Z"),
};

const wrongDataStudent = {
  id: 2,
  firstName: 1000,
  lastName: 500,
  groupName: "Group B",
  role: "Student",
  expectedSalary: 50000,
  expectedDateOfDefense: new Date("2023-12-01"),
  createdAt: new Date("2023-01-01T00:00:00Z"),
  updatedAt: new Date("2023-01-01T00:00:00Z"),
};

const badRequestStudent = {
  id: 3,
  first_name: "Jane", // int in the firstName and lastName
  last_name: "Doe",
  group_name: "Group C",
  role: "Student",
  expected_salary: 50000,
  expected_date: new Date("2023-12-01"),
  created_at: new Date("2023-01-01T00:00:00Z"),
  updated_at: new Date("2023-01-01T00:00:00Z"),
};

describe("The Student endpoint", () => {
  afterAll(async () => {
    await prisma.student.deleteMany();
    await prisma.$disconnect();
  });

  // POST ROUTE HAPPY PATH
  it("should create a new student successfully", async () => {
    const response = await request(app).post(route).send(testStudent);

    expect(response.status).toBe(201);
    expect(response.body).toBeDefined();
    expect({
      firstName: response.body.firstName,
      lastName: response.body.lastName,
      groupName: response.body.groupName,
      role: response.body.role,
      expectedSalary: response.body.expectedSalary,
    }).toEqual({
      firstName: testStudent.firstName,
      lastName: testStudent.lastName,
      groupName: testStudent.groupName,
      role: testStudent.role,
      expectedSalary: testStudent.expectedSalary,
    });
  }, 20000);

  // POST ROUTE SAD PATH
  it("should fail in creating a new student because of wrong data ", async () => {
    const response = await request(app).post(route).send(wrongDataStudent);

    expect(response.status).toBe(500);
    expect(response.body).toBeDefined();
  });

  it("should fail in creating a new student because of bad data request", async () => {
    const response = await request(app).post(route).send(badRequestStudent);

    expect(response.status).toBe(500);
    expect(response.body).toBeDefined();
  });

  // GET ROUTE HAPPY PATH
  it("should fetch all students successfully", async () => {
    const response = await request(app).get(route);

    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
    expect({
      firstName: response.body[0].firstName,
      lastName: response.body[0].lastName,
      groupName: response.body[0].groupName,
      role: response.body[0].role,
      expectedSalary: response.body[0].expectedSalary,
    }).toEqual({
      firstName: testStudent.firstName,
      lastName: testStudent.lastName,
      groupName: testStudent.groupName,
      role: testStudent.role,
      expectedSalary: testStudent.expectedSalary,
    });
  });

  // GET ROUTE SAD PATH
  it("should fail in fetching a because it would fetch a studnet that does not exist", async () => {
    const response = await request(app).get(`${route}/1000`);

    expect(response.status).toBe(404);
    expect(response.body).toBeDefined();
  });

  it("should fail in fetching a because it would fetch with a bad request", async () => {
    const response = await request(app).get(`${route}/wrongId`);

    expect(response.status).toBe(500);
    expect(response.body).toBeDefined();
  });
});
