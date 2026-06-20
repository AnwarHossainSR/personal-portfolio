import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { SEOProvider } from "@/components/common/SEO";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

const queryClient = new QueryClient();

/** Composes all global context providers in one place. */
export function AppProviders({ children }: { children: ReactNode }) {
	return (
		<QueryClientProvider client={queryClient}>
			<SEOProvider>
				<TooltipProvider>
					<Toaster />
					<Sonner />
					{children}
				</TooltipProvider>
			</SEOProvider>
		</QueryClientProvider>
	);
}
