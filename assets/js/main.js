(() => {
  const root = document.documentElement;
  const storageKey = "slow-load-theme";
  const themeButton = document.querySelector("[data-theme-toggle]");
  const themeLabel = document.querySelector("[data-theme-label]");
  const themeIcon = document.querySelector("[data-theme-icon]");

  const preferredTheme = () => {
    const stored = localStorage.getItem(storageKey);
    if (stored === "light" || stored === "dark") return stored;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  };

  const applyTheme = (theme) => {
    root.dataset.theme = theme;
    const isDark = theme === "dark";
    if (themeButton) themeButton.setAttribute("aria-pressed", String(isDark));
    if (themeLabel) themeLabel.textContent = isDark ? "浅色" : "深色";
    if (themeIcon) themeIcon.textContent = isDark ? "☀" : "◐";
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) metaTheme.setAttribute("content", isDark ? "#191c1a" : "#f4efe6");
  };

  applyTheme(preferredTheme());

  themeButton?.addEventListener("click", () => {
    const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
    localStorage.setItem(storageKey, nextTheme);
    applyTheme(nextTheme);
  });

  document.querySelectorAll("[data-current-year]").forEach((element) => {
    element.textContent = String(new Date().getFullYear());
  });

  const greetings = [
    "今天也慢一点，没关系。",
    "愿你碰到一段刚好有风的路。",
    "先喝口水，再打开下一条通知。",
    "把十分钟留给窗外。",
    "今天想记录哪一个小瞬间？"
  ];

  const greetingButton = document.querySelector("[data-greeting-button]");
  const greetingText = document.querySelector("[data-greeting]");
  let greetingIndex = 0;

  greetingButton?.addEventListener("click", () => {
    greetingIndex = (greetingIndex + 1) % greetings.length;
    if (greetingText) greetingText.textContent = greetings[greetingIndex];
  });

  const checkButton = document.querySelector("[data-resource-check]");
  const imageStatus = document.querySelector("[data-image-status]");
  const fetchStatus = document.querySelector("[data-fetch-status]");
  const checkDetail = document.querySelector("[data-check-detail]");

  const setStatus = (element, text, state) => {
    if (!element) return;
    element.textContent = text;
    element.classList.remove("status-ok", "status-error", "status-running");
    if (state) element.classList.add(`status-${state}`);
  };

  const waitForImage = (image) => new Promise((resolve) => {
    if (image.complete) {
      resolve(image.naturalWidth > 0);
      return;
    }
    image.addEventListener("load", () => resolve(true), { once: true });
    image.addEventListener("error", () => resolve(false), { once: true });
  });

  checkButton?.addEventListener("click", async () => {
    checkButton.disabled = true;
    setStatus(imageStatus, "检查中", "running");
    setStatus(fetchStatus, "检查中", "running");
    if (checkDetail) checkDetail.textContent = "正在从当前域名请求本地资源…";

    const localImages = [...document.querySelectorAll("[data-local-image]")];
    const imageResults = await Promise.all(localImages.map(waitForImage));
    const allImagesReady = imageResults.every(Boolean);
    setStatus(imageStatus, allImagesReady ? "全部正常" : "发现异常", allImagesReady ? "ok" : "error");

    const resources = [
      "assets/css/styles.css",
      "assets/js/main.js",
      "assets/images/canal-morning.svg",
      "assets/images/desk-notes.svg",
      "posts/",
      "about/"
    ];

    const results = await Promise.all(resources.map(async (path) => {
      try {
        const response = await fetch(new URL(path, document.baseURI), { cache: "no-store" });
        return { path, ok: response.ok, status: response.status };
      } catch (error) {
        return { path, ok: false, status: 0 };
      }
    }));

    const passed = results.filter((item) => item.ok).length;
    const failed = results.filter((item) => !item.ok);
    setStatus(fetchStatus, failed.length === 0 ? "6 / 6 正常" : `${passed} / 6 正常`, failed.length === 0 ? "ok" : "error");

    if (checkDetail) {
      checkDetail.textContent = failed.length === 0
        ? "CSS、JS、2 张图片和 2 个子页面均返回成功状态。"
        : `异常资源：${failed.map((item) => `${item.path} (${item.status || "网络错误"})`).join("、")}`;
    }

    checkButton.disabled = false;
  });
})();
