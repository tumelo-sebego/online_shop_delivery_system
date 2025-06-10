const isOnline = async () => {
  try {
    await fetch("https://www.google.com/favicon.ico", {
      mode: "no-cors",
    });
    return true;
  } catch {
    return false;
  }
};

module.exports = { isOnline };
