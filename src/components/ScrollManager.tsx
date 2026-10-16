import { useEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

/** How long to keep looking for a hash target that a lazy route has not rendered yet. */
const MAX_FRAMES = 90;

/**
 * Scroll position on client-side navigation, which a single-page app does not
 * get from the browser.
 *
 * Without this, opening a case study from halfway down the home page lands
 * halfway down the case study, and every `/#section` link from another route
 * — the 404 page, the retired /about and /contact redirects, the command
 * palette — arrives at the top of the page instead of at its section.
 *
 * The hash target is polled for across frames because Home is lazy: on a
 * cross-route jump the section does not exist yet when the location changes.
 */
export function ScrollManager() {
	const location = useLocation();
	const navigationType = useNavigationType();

	useEffect(() => {
		const { hash } = location;
		if (!hash) {
			// Back and forward keep whatever position the browser restores.
			if (navigationType === "POP") return;
			window.scrollTo({ top: 0, left: 0, behavior: "instant" });
			return;
		}

		const id = decodeURIComponent(hash.slice(1));
		let frame = 0;
		let tries = 0;
		const attempt = () => {
			const target = document.getElementById(id);
			if (target) {
				target.scrollIntoView?.({ block: "start" });
				return;
			}
			tries += 1;
			if (tries < MAX_FRAMES) frame = requestAnimationFrame(attempt);
		};
		attempt();
		return () => cancelAnimationFrame(frame);
	}, [location, navigationType]);

	return null;
}
