import { prisma } from "./prisma";

export const models = {
  profile: prisma.profile,
  education: prisma.education,
  skill: prisma.skill,
  project: prisma.project,
  publication: prisma.publication,
  socialLink: prisma.socialLink,
  resume: prisma.resume,
  portfolioSetting: prisma.portfolioSetting
} as const;

export type ModelKey = keyof typeof models;
