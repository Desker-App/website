import { error } from "@sveltejs/kit";
import fs from "node:fs";
import path from "node:path";

const policiesFolderPath = path.join(import.meta.dirname, "../../../lib/policies");

export const load = ({ params }) => {
	const filePath = path.join(policiesFolderPath, params.page + ".html");
	if (!fs.existsSync(filePath))
		throw error(404, "This policies has not been written.");

	return {
		html: fs.readFileSync(filePath, { encoding: "utf-8" }),
	};
};
