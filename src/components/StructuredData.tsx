import { Helmet } from "react-helmet-next";
import { profile } from "@/data/profile";
import { roles } from "@/data/roles";
import { SITE_URL } from "@/data/site";

export function StructuredData() {
	const data = {
		"@context": "https://schema.org",
		"@type": "Person",
		name: profile.name,
		jobTitle: "Senior Software Engineer",
		email: `mailto:${profile.email}`,
		url: SITE_URL,
		address: { "@type": "PostalAddress", addressLocality: profile.location },
		sameAs: profile.links.map((link) => link.href),
		worksFor: { "@type": "Organization", name: roles[0].company },
		description: profile.positioning,
	};

	return (
		<Helmet>
			<script type="application/ld+json">{JSON.stringify(data)}</script>
		</Helmet>
	);
}
