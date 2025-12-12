export = typeof window === "undefined" ? fetch : window.fetch.bind(window);
