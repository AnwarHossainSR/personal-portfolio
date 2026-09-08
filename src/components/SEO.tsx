import { Helmet, HelmetProvider } from "react-helmet-next";
import { StructuredData } from "@/components/StructuredData";
import { profile } from "@/data/profile";

const SITE_URL = "https://anwarportfolio.vercel.app";

const defaults = {
	title: `${profile.name} — Senior Software Engineer`,
	description: profile.positioning,
	image: `${SITE_URL}/og.png`,
};

interface SEOProps {
	title?: string;
	description?: string;
	/** Site-relative path, e.g. "/work/vod-ingest". Builds canonical + og:url. */
	path?: string;
	image?: string;
	type?: "website" | "article";
	publishedTime?: string;
	noIndex?: boolean;
}

export function SEOHead({
	title,
	description = defaults.description,
	path = "/",
	image = defaults.image,
	type = "website",
	publishedTime,
	noIndex = false,
}: SEOProps) {
	const fullTitle = title ? `${title} — ${profile.name}` : defaults.title;
	const url = `${SITE_URL}${path}`;

	return (
		<Helmet>
			<title>{fullTitle}</title>
			<meta name="description" content={description} />
			<meta name="author" content={profile.name} />
			<meta
				name="robots"
				content={noIndex ? "noindex, nofollow" : "index, follow"}
			/>
			<link rel="canonical" href={url} />

			<meta property="og:type" content={type} />
			<meta property="og:title" content={fullTitle} />
			<meta property="og:description" content={description} />
			<meta property="og:image" content={image} />
			<meta property="og:url" content={url} />
			<meta property="og:site_name" content={profile.name} />

			<meta name="twitter:card" content="summary_large_image" />
			<meta name="twitter:title" content={fullTitle} />
			<meta name="twitter:description" content={description} />
			<meta name="twitter:image" content={image} />

			{type === "article" && publishedTime && (
				<meta property="article:published_time" content={publishedTime} />
			)}
		</Helmet>
	);
}

export function SEOProvider({ children }: { children: React.ReactNode }) {
	return (
		<HelmetProvider>
			<StructuredData />
			{children}
		</HelmetProvider>
	);
}
