import path from "node:path";
import react from "@vitejs/plugin-react-swc";
import { defineConfig, type Plugin, runnerImport } from "vite";

const alias = { "@": path.resolve(__dirname, "./src") };

/** The shape of src/content/llms.ts, stated here so the Node-side config does not typecheck the app. */
interface LlmsModule {
	renderLlmsTxt(): string;
	renderLlmsFullTxt(): string;
}

const LLMS_FILES: Record<string, (mod: LlmsModule) => string> = {
	"llms.txt": (mod) => mod.renderLlmsTxt(),
	"llms-full.txt": (mod) => mod.renderLlmsFullTxt(),
};

/**
 * /llms.txt and /llms-full.txt, rendered from src/content/llms.ts.
 *
 * Generated rather than kept in public/ so they cannot drift from the page:
 * they are built from the same schema-checked content, through Vite's module
 * runner, in the same `vite build` that builds the site — no separate script
 * for CI or the host to forget to run. In development the dev server renders
 * them per request, so an edit to the content shows up on refresh.
 */
function llmsTxt(): Plugin {
	return {
		name: "llms-txt",
		configureServer(server) {
			server.middlewares.use(async (req, res, next) => {
				const file = req.url?.replace(/^\//, "") ?? "";
				const render = LLMS_FILES[file];
				if (!render) return next();
				try {
					const mod = (await server.ssrLoadModule(
						"/src/content/llms.ts",
					)) as LlmsModule;
					res.setHeader("Content-Type", "text/plain; charset=utf-8");
					res.end(render(mod));
				} catch (error) {
					next(error);
				}
			});
		},
		async generateBundle() {
			const { module } = await runnerImport<LlmsModule>(
				path.resolve(__dirname, "src/content/llms.ts"),
				{ configFile: false, resolve: { alias }, logLevel: "silent" },
			);
			for (const [fileName, render] of Object.entries(LLMS_FILES)) {
				this.emitFile({ type: "asset", fileName, source: render(module) });
			}
		},
	};
}

// https://vitejs.dev/config/
export default defineConfig({
	server: {
		host: "::",
		port: 3000,
	},
	plugins: [react(), llmsTxt()],
	resolve: { alias },
});
