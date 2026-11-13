export const CHOICES = ["Human", "AI", "Not enough evidence"];

export function evaluateGuess(userChoice, truth) {
  if (truth === "Ambiguous") {
    if (userChoice === "Not enough evidence") {
      return {
        points: 10,
        status: "calibrated",
        badge: "Calibrated Uncertainty (+10 pts)",
        detail: "Smart call — there weren't enough clues here, so holding back earns full points."
      };
    }
    return {
      points: 0,
      status: "overconfident",
      badge: "Overconfident Guess (0 pts)",
      detail: "There wasn't enough evidence here to safely guess Human or AI."
    };
  }

  const article = truth === "AI" ? "an AI" : "a Human";

  if (userChoice === truth) {
    return {
      points: 10,
      status: "exact",
      badge: "Exact Match (+10 pts)",
      detail: `Spot on — this was written by ${article}.`
    };
  }

  if (userChoice === "Not enough evidence") {
    return {
      points: 3,
      status: "cautious",
      badge: "Cautious Pass (+3 pts)",
      detail: `You get 3 points for playing it safe, though clear clues pointed to ${truth}.`
    };
  }

  return {
    points: 0,
    status: "incorrect",
    badge: "Missed Call (0 pts)",
    detail: `Not quite — this was actually written by ${article}.`
  };
}
