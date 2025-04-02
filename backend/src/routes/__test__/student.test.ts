import { beforeEach, describe } from "node:test";
import { prisma, app } from "../../server";
import request from "supertest";

const route = "/api/students";

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
  id: 1,
  firstName: 1000, // int in the firstName and lastName
  lastName: 500,
  groupName: "Group A",
  role: "Student",
  expectedSalary: 50000,
  expectedDateOfDefense: new Date("2023-12-01"),
  createdAt: new Date("2023-01-01T00:00:00Z"),
  updatedAt: new Date("2023-01-01T00:00:00Z"),
};

const incompleteDataStudent = {
  firstName: "im incomplete",
};

let studentId: number;

describe("The Student endpoint", () => {
  //   beforeEach(async () => {

  //   });

  //   afterEach(async () => {
  //     await prisma.student.deleteMany({
  //       where: { id: studentId },
  //     });
  //   });

  //   afterAll(async () => {
  //     await prisma.$disconnect();
  //   });

  it("should create a new student successfully", async () => {
    const response = await request(app).post(route).send(testStudent);

    expect(response.status).toBe(201);
    expect(response.body).toBeDefined();
    expect({
      firstName: response.body.firstName,
      lastName: response.body.lastName,
    }).toEqual(testStudent);
  });

  it("should fail in creating a new student because of wrong data ", async () => {
    const response = await request(app).post(route).send(wrongDataStudent);

    expect(response.status).toBe(500);
    expect(response.body).toBeDefined();
  });

  it("should fail in creating a new student because of incomplete data", async () => {
    const response = await request(app).post(route).send(incompleteDataStudent);

    expect(response.status).toBe(400);
    expect(response.body).toBeDefined();
  });
});
