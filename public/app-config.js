(function initAppConfig() {
  const localHostnames = new Set(["localhost", "127.0.0.1"]);
  let storedApiBase = "";

  try {
    storedApiBase = window.localStorage.getItem("apiBase") || "";
  } catch (error) {
    storedApiBase = "";
  }

  const fallbackApiBase = localHostnames.has(window.location.hostname)
    ? "http://localhost:3000"
    : window.location.origin;

  const apiBase = (storedApiBase || fallbackApiBase).replace(/\/+$/, "");

  window.APP_CONFIG = Object.freeze({ apiBase });
  window.apiUrl = function apiUrl(path) {
    const normalizedPath = String(path || "");
    if (normalizedPath.startsWith("/")) {
      return `${apiBase}${normalizedPath}`;
    }

    return `${apiBase}/${normalizedPath}`;
  };
})();
