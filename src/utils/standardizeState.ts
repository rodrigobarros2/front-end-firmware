export const standardizeState = (state: string) => {
  const normalizedState = state.toLowerCase();

  if (
    normalizedState === "working" ||
    normalizedState === "online" ||
    normalizedState === "dyinggasp"
  ) {
    return "Online";
  } else if (normalizedState === "offline" || normalizedState === "offline") {
    return "Offline";
  }

  return "Unknown";
};
