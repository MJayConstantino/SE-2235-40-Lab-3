import { Student } from "@prisma/client";

const correctDataStudent: Partial<Student> = {
  firstName: "John",
  lastName: "Doe",
  groupName: "Group A",
  role: "Student",
  expectedSalary: 50000,
  expectedDateOfDefense: new Date("2025-12-01"),
};

/**
 * Type of `firstName` and `lastName` should be string (wrong type)
 */
const wrongDataStudent = {
  firstName: 1000,
  lastName: 500,
  groupName: "Group B",
  role: "Student",
  expectedSalary: 50000,
  expectedDateOfDefense: new Date("2025-12-01"),
};

/**
 * Wrong field names
 */
const badRequestStudent = {
  first_name: "Jane",
  last_name: "Doe",
  group_name: "Group C",
  role: "Student",
  expected_salary: 50000,
  expected_date: new Date("2025-12-01"),
};

export {
  correctDataStudent,
  wrongDataStudent,
  badRequestStudent,
}