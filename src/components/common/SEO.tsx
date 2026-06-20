import { Helmet, HelmetProvider } from "react-helmet-next";

interface SEOProps {
	title?: string;
	description?: string;
	keywords?: string;
	image?: string;
	url?: string;
	type?: string;
	author?: string;
	publishedTime?: string;
	modifiedTime?: string;
}

const defaultSEO = {
	title: "Md. Anwar Hossain - Senior Software Engineer",
	description:
		"Senior Software Engineer with 6+ years of experience in AWS cloud architecture, full-stack development, and DevOps. Specialized in React, Node.js, and serverless systems.",
	keywords:
		"Senior Software Engineer, AWS Architect, Full Stack Developer, React Developer, Node.js, DevOps, Cloud Computing, JavaScript, TypeScript, System Design",
	image: "https://anwarportfolio.vercel.app/og-image.jpg",
	url: "https://anwarportfolio.vercel.app",
	type: "website",
	author: "Md. Anwar Hossain",
};

export function SEOHead({
	title,
	description = defaultSEO.description,
	keywords = defaultSEO.keywords,
	image = defaultSEO.image,
	url = defaultSEO.url,
	type = defaultSEO.type,
	author = defaultSEO.author,
	publishedTime,
	modifiedTime,
}: SEOProps) {
	const fullTitle = title ? `${title} | ${defaultSEO.title}` : defaultSEO.title;

	return (
		<Helmet>
			{/* Basic Meta Tags */}
			<title>{fullTitle}</title>
			<meta name="description" content={description} />
			<meta name="keywords" content={keywords} />
			<meta name="author" content={author} />
			<meta name="robots" content="index, follow" />
			<meta name="viewport" content="width=device-width, initial-scale=1.0" />
			<link rel="canonical" href={url} />

			{/* Open Graph / Facebook */}
			<meta property="og:type" content={type} />
			<meta property="og:title" content={fullTitle} />
			<meta property="og:description" content={description} />
			<meta property="og:image" content={image} />
			<meta property="og:url" content={url} />
			<meta property="og:site_name" content="Anwar Hossain Portfolio" />
			<meta property="og:locale" content="en_US" />

			{/* Twitter */}
			<meta name="twitter:card" content="summary_large_image" />
			<meta name="twitter:title" content={fullTitle} />
			<meta name="twitter:description" content={description} />
			<meta name="twitter:image" content={image} />
			<meta name="twitter:creator" content="@anwar_dev" />

			{/* Additional Meta Tags */}
			<meta name="theme-color" content="#7c5cfc" />
			<meta name="msapplication-TileColor" content="#7c5cfc" />

			{/* Article specific tags */}
			{publishedTime && (
				<meta property="article:published_time" content={publishedTime} />
			)}
			{modifiedTime && (
				<meta property="article:modified_time" content={modifiedTime} />
			)}
			<meta property="article:author" content={author} />

			{/* Technical SEO */}
			<meta httpEquiv="X-UA-Compatible" content="IE=edge" />
			<meta name="format-detection" content="telephone=no" />

			{/* Structured Data - JSON-LD */}
			<script type="application/ld+json">
				{JSON.stringify({
					"@context": "https://schema.org",
					"@type": "Person",
					name: "Md. Anwar Hossain",
					jobTitle: "Senior Software Engineer",
					description: description,
					url: url,
					image: image,
					sameAs: [
						"https://github.com/AnwarHossainSR",
						"https://www.linkedin.com/in/anwarsr/",
						"https://anwarportfolio.vercel.app",
					],
					address: {
						"@type": "PostalAddress",
						addressLocality: "Dhaka",
						addressCountry: "Bangladesh",
					},
					email: "anwarmahedisr@gmail.com",
					telephone: "+8801729532097",
					worksFor: {
						"@type": "Organization",
						name: "Craftsmen Ltd.",
					},
					hasOccupation: {
						"@type": "Occupation",
						name: "Senior Software Engineer",
						occupationLocation: {
							"@type": "City",
							name: "Dhaka",
						},
						skills:
							"AWS, DevOps, React, Node.js, JavaScript, TypeScript, PHP, Laravel, Next.js, Cloud Computing",
					},
				})}
			</script>
		</Helmet>
	);
}

export function SEOProvider({ children }: { children: React.ReactNode }) {
	return <HelmetProvider>{children}</HelmetProvider>;
}
