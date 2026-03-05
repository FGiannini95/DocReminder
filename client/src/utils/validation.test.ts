import { describe, it, expect } from "vitest";
import { validateEmail, validateOtp } from "./validation";

describe("validateEmail", () => {
  it("returns true for a valid email", () => {
    expect(validateEmail("fede@gmail.com")).toBe(true);
  });

  it("returns true for email with subdomain", () => {
    expect(validateEmail("fede@mail.domain.com")).toBe(true);
  });

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

describe("validateOtp", () => {
  it("returns true for 6 digits", () => {
    expect(validateOtp("123456")).toBe(true);
  });
  it("returns false for less than 6 digits", () => {
    expect(validateOtp("123")).toBe(false);
  });
  it("returns false for non numeric characters", () => {
    expect(validateOtp("12345a")).toBe(false);
  });
  it("returns false for empty string", () => {
    expect(validateOtp("")).toBe(false);
  });
});
