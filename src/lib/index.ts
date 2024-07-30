// place files you want to import through the `$lib` alias in this folder.
export const installation_urls = {
	chrome: "https://microsoftedge.microsoft.com/addons/detail/desker/ajpemghcnjlhdfppiicpjkkfjjnogade",
	firefox: "https://addons.mozilla.org/fr/firefox/addon/desker/",
};
export const get_installation_url = () =>
	navigator.userAgent.toLowerCase().includes("firefox")
		? installation_urls.firefox
		: installation_urls.chrome;
