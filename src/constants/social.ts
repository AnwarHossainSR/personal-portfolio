import {
	ExternalLink,
	Github,
	Linkedin,
	type LucideIcon,
	Mail,
	Twitter,
	Youtube,
} from "lucide-react";

/** Maps a social link's `icon` string (from data) to its lucide component. */
export const socialIconMap: Record<string, LucideIcon> = {
	Github,
	Linkedin,
	Mail,
	ExternalLink,
	Twitter,
	Youtube,
};

/** Resolve an icon name to a component, falling back to a sensible default. */
export const getSocialIcon = (name: string): LucideIcon =>
	socialIconMap[name] ?? ExternalLink;
