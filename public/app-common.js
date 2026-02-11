(function initAppCommon() {
  function getToken() {
    try {
      return window.localStorage.getItem("token") || "";
    } catch (error) {
      return "";
    }
  }

  function getUser() {
    try {
      const raw = window.localStorage.getItem("user");
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      return null;
    }
  }

  function setAuth(token, user) {
    try {
      window.localStorage.setItem("token", token || "");
      window.localStorage.setItem("user", JSON.stringify(user || null));
    } catch (error) {
      // Ignore localStorage write errors in private mode/restricted contexts.
    }
  }

  function clearAuth() {
    try {
      window.localStorage.removeItem("token");
      window.localStorage.removeItem("user");
    } catch (error) {
      // Ignore localStorage write errors in private mode/restricted contexts.
    }
  }

  function parseJsonSafe(response) {
    return response.json().catch(() => ({}));
  }

  function readDetailPath(path) {
    if (Array.isArray(path) && path.length) {
      return path.map((item) => String(item)).join(".");
    }

    if (typeof path === "string" && path.trim()) {
      return path.trim();
    }

    return "";
  }

  function detailToMessage(detail) {
    if (typeof detail === "string" && detail.trim()) {
      return detail.trim();
    }

    if (!detail || typeof detail !== "object") {
      return "";
    }

    const message = typeof detail.message === "string" ? detail.message.trim() : "";
    const path = readDetailPath(detail.path);

    if (message && path) {
      return `${path}: ${message}`;
    }

    return message || path;
  }

  function collectDetailMessages(data) {
    const messages = [];

    if (Array.isArray(data.details)) {
      for (const detail of data.details) {
        const line = detailToMessage(detail);
        if (line) {
          messages.push(line);
        }
      }
    } else if (typeof data.details === "string" && data.details.trim()) {
      messages.push(data.details.trim());
    } else if (data.details && typeof data.details === "object") {
      for (const [key, value] of Object.entries(data.details)) {
        if (value === undefined || value === null) {
          continue;
        }
        messages.push(`${key}: ${String(value)}`);
      }
    }

    if (Array.isArray(data.errors)) {
      for (const detail of data.errors) {
        const line = detailToMessage(detail);
        if (line) {
          messages.push(line);
        }
      }
    }

    return [...new Set(messages)];
  }

  function formatApiErrorMessage(data, status) {
    const fallback = `Request failed (${status})`;
    if (!data || typeof data !== "object") {
      return fallback;
    }

    const base = typeof data.message === "string" && data.message.trim() ? data.message.trim() : fallback;
    const details = collectDetailMessages(data);

    if (!details.length) {
      return base;
    }

    return `${base}\n${details.map((line) => `- ${line}`).join("\n")}`;
  }

  function createApiClient(token) {
    async function request(path, options) {
      const settings = options || {};
      const method = settings.method || "GET";
      const body = settings.body;
      const authMode = settings.auth || "optional";
      const customHeaders = settings.headers || {};
      const headers = { ...customHeaders };

      if (body !== undefined && !headers["Content-Type"]) {
        headers["Content-Type"] = "application/json";
      }

      if (token && authMode !== "none") {
        headers.Authorization = `Bearer ${token}`;
      }

      if (authMode === "required" && !token) {
        const error = new Error("Authorization required");
        error.status = 401;
        throw error;
      }

      const payload = body === undefined || typeof body === "string" ? body : JSON.stringify(body);
      const response = await fetch(window.apiUrl(path), {
        method,
        headers,
        body: payload,
      });

      const data = await parseJsonSafe(response);

      if (!response.ok) {
        const error = new Error(formatApiErrorMessage(data, response.status));
        error.status = response.status;
        error.payload = data;
        throw error;
      }

      return data;
    }

    return Object.freeze({ request });
  }

  function showAlert(element, message, type, autoHideMs) {
    if (!element) {
      return;
    }

    const kind = type || "danger";
    element.className = `alert alert-${kind} app-alert`;
    element.textContent = message;

    const timeout = Number(autoHideMs || 0);
    if (timeout > 0) {
      window.setTimeout(() => {
        if (element.textContent === message) {
          element.className = "alert d-none";
          element.textContent = "";
        }
      }, timeout);
    }
  }

  function setButtonBusy(button, busy, idleText, busyText) {
    if (!button) {
      return;
    }

    const finalBusy = Boolean(busy);
    const idle = idleText || button.dataset.idleText || button.textContent || "Submit";
    const loading = busyText || "Please wait...";

    if (!button.dataset.idleText) {
      button.dataset.idleText = idle;
    }

    button.disabled = finalBusy;
    button.textContent = finalBusy ? loading : idle;
  }

  function csvToArray(value) {
    return String(value || "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  function arrayToCsv(values) {
    if (!Array.isArray(values) || values.length === 0) {
      return "";
    }

    return values.join(", ");
  }

  function getSelectValues(selectElement) {
    if (!selectElement) {
      return [];
    }

    const selected = [];
    for (const option of selectElement.options) {
      if (option.selected) {
        selected.push(option.value);
      }
    }
    return selected;
  }

  function setSelectValues(selectElement, values) {
    if (!selectElement) {
      return;
    }

    const set = new Set((values || []).map((value) => String(value)));
    for (const option of selectElement.options) {
      option.selected = set.has(option.value);
    }
  }

  function formatDate(value) {
    if (!value) {
      return "Unknown";
    }

    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
      return "Unknown";
    }

    return parsed.toLocaleString();
  }

  function shortText(value, limit) {
    const text = String(value || "");
    const max = Number(limit || 160);
    if (text.length <= max) {
      return text;
    }
    return `${text.slice(0, max - 1)}…`;
  }

  window.AppCommon = Object.freeze({
    getToken,
    getUser,
    setAuth,
    clearAuth,
    createApiClient,
    showAlert,
    setButtonBusy,
    csvToArray,
    arrayToCsv,
    getSelectValues,
    setSelectValues,
    formatDate,
    shortText,
  });
})();
