/**
 * Shared domain types used across the portfolio.
 */

export type SkillLevel = "Expert" | "Advanced" | "Intermediate" | "Beginner";

export interface Skill {
	name: string;
	level: SkillLevel;
	yearsOfExperience?: string;
	inProduction?: boolean;
}

export interface SkillCategory {
	name: string;
	description: string;
	icon: string;
	skills: Skill[];
}

export interface Project {
	id: string;
	title: string;
	description: string;
	longDescription?: string;
	image?: string;
	category: string;
	technologies: string[];
	features?: string[];
	metrics?: Record<string, string>;
	role?: string;
	duration?: string;
	year: string;
	status?: string;
	githubUrl?: string;
	liveUrl?: string;
	highlights?: string[];
}

export interface ExperienceItem {
	id: string;
	company: string;
	position: string;
	duration: string;
	period?: string;
	location?: string;
	type: string;
	description: string;
	achievements: string[];
	technologies: string[];
	highlights?: string[];
}

export interface SocialLink {
	name: string;
	url: string;
	icon: string;
}

export interface NavItem {
	name: string;
	href: string;
}
