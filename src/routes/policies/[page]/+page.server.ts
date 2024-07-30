import { error } from "@sveltejs/kit";

const policies = Object.entries(
	import.meta.glob<string>("$lib/policies/*.html", {
		query: "?raw",
		import: "default",
	})
);

export const load = async ({ params }) => {
	const policy = policies.find(([path, _]) =>
		path.endsWith(`${params.page}.html`)
	);
	if (!policy) throw error(404, "This policies has not been written.");

	return {
		html: await policy[1](),
	};
};
