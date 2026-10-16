import { SEOHead } from "@/components/SEO";
import { profile } from "@/data/profile";
import { Contact } from "@/sections/Contact";
import { Hero } from "@/sections/Hero";
import { Process } from "@/sections/Process";
import { Proof } from "@/sections/Proof";
import { Showcase } from "@/sections/Showcase";
import { Stack } from "@/sections/Stack";
import { WhatIDo } from "@/sections/WhatIDo";
import { Work } from "@/sections/Work";

export default function Home() {
	return (
		<>
			<SEOHead description={profile.positioning} path="/" />
			<Hero />
			<WhatIDo />
			<Showcase />
			<Work />
			<Process />
			<Stack />
			<Proof />
			<Contact />
		</>
	);
}
