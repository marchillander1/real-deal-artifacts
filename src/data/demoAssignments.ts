
import { Assignment } from '../types/consultant';

export const demoAssignments: Assignment[] = [
  {
    id: 1,
    title: "Senior React Developer för E-commerce Platform",
    description: "Vi söker en erfaren React-utvecklare för att bygga nästa generation av vår e-handelsplattform. Du kommer arbeta med moderna teknologier som React 18, TypeScript, och GraphQL.",
    company: "TechStart AB",
    clientLogo: "🛒",
    requiredSkills: ["React", "TypeScript", "GraphQL", "Node.js", "PostgreSQL"],
    workload: "Heltid (40h/vecka)",
    duration: "6 månader",
    budget: "45,000-55,000 SEK/månad",
    remote: "Hybrid (2-3 dagar på kontoret)",
    urgency: "High" as const,
    teamSize: "4-6 utvecklare",
    teamCulture: "Agil, innovativ och samarbetsinriktad kultur med fokus på kontinuerlig förbättring",
    industry: "E-commerce",
    status: "open" as const,
    createdAt: "2024-01-15"
  },
  {
    id: 2,
    title: "DevOps Engineer för Fintech Startup",
    description: "Hjälp oss att skala vår finansiella plattform med robust infrastruktur och automatisering. Erfaren inom Kubernetes, AWS och CI/CD pipelines.",
    company: "FinanceFlow",
    clientLogo: "💰",
    requiredSkills: ["Kubernetes", "AWS", "Docker", "Terraform", "Python"],
    workload: "Heltid",
    duration: "12 månader",
    budget: "50,000-65,000 SEK/månad",
    remote: "Fully Remote",
    urgency: "Medium" as const,
    teamSize: "2-3 DevOps engineers",
    teamCulture: "Startup-miljö med snabba beslut och högt tempo",
    industry: "Fintech",
    status: "open" as const,
    createdAt: "2024-01-10"
  }
];
