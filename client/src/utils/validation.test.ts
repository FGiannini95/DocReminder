import { describe, it, expect } from "vitest";
import { validateEmail } from "./validation";

describe("validateEmail", () => {
  // Valid emails
  it("returns true for a valid email", () => {
    expect(validateEmail("fede@gmail.com")).toBe(true);
  });

  it("returns true for email with subdomain", () => {
    expect(validateEmail("fede@mail.domain.com")).toBe(true);
  });

  // Error cases
  it("returns false for email without @", () => {
    expect(validateEmail("fedegmail.com")).toBe(false);
  });

  it("returns false for email without domain", () => {
    expect(validateEmail("fede@")).toBe(false);
  });

  it("returns false for email without TLD", () => {
    expect(validateEmail("fede@gmail")).toBe(false);
  });

  it("returns false for email with TLD shorter than 2 chars", () => {
    expect(validateEmail("fede@gmail.c")).toBe(false);
  });

  it("returns false for empty string", () => {
    expect(validateEmail("")).toBe(false);
  });

  it("returns false for email with spaces", () => {
    expect(validateEmail("fede @gmail.com")).toBe(false);
  });

  it("returns false for email missing local part", () => {
    expect(validateEmail("@gmail.com")).toBe(false);
  });
});
