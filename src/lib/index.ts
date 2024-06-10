// place files you want to import through the `$lib` alias in this folder.
export const installation_urls = {
	chrome: "https://chrome.com",
	firefox: "https://firefox.com",
};
export const get_installation_url = () =>
	navigator.userAgent.toLowerCase().includes("firefox")
		? installation_urls.firefox
		: installation_urls.chrome;
