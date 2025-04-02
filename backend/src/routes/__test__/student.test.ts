import { beforeEach, describe } from "node:test";
import { prisma, app } from "../../server";
import request from "supertest";

const route = "/students";

const testStudent = {
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
  firstName: 1000, // int in the firstName and lastName
  lastName: 500,
  groupName: "Group A",
  role: "Student",
  expectedSalary: 50000,
  expectedDateOfDefense: new Date("2023-12-01"),
  createdAt: new Date("2023-01-01T00:00:00Z"),
  updatedAt: new Date("2023-01-01T00:00:00Z"),
};

const badRequestStudent = {
  first_name: 1000, // int in the firstName and lastName
  last_name: 500,
  group_name: "Group A",
  role: "Student",
  expected_salary: 50000,
  expected_date: new Date("2023-12-01"),
  created_at: new Date("2023-01-01T00:00:00Z"),
  updated_at: new Date("2023-01-01T00:00:00Z"),
};

let studentId: number;

describe("The Student endpoint", () => {
  beforeEach(async () => {
    const student = await prisma.student.create({
      data: testStudent,
    });
    studentId = student.id;
  });

  afterAll(async () => {
    await prisma.student.deleteMany();
    await prisma.$disconnect();
  });

  it("should create a new student successfully", async () => {
    const response = await request(app).post(route).send(testStudent);

    expect(response.status).toBe(201);
    expect(response.body).toBeDefined();
    expect({
      firstName: response.body.firstName,
      lastName: response.body.lastName,
    }).toEqual({
      firstName: testStudent.firstName,
      lastName: testStudent.lastName,
    });
  }, 20000);

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
});
