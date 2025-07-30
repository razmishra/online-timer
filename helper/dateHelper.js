const subscriptionDurations = {
  free: { type: "years", value: 100 },
  monthly: { type: "months", value: 1 },
  singleEvent: { type: "days", value: 15 },
};

export function calculateExpirationDate({ subscriptDuration }) {
  const config = subscriptionDurations[subscriptDuration];

  if (!config) {
    throw new Error(`Unknown subscription type: ${subscriptDuration}`);
  }

  let expirationDate = new Date(); // Get current date

  // Add the appropriate duration based on the config
  switch (config.type) {
    case "days":
      expirationDate.setDate(expirationDate.getDate() + config.value);
      break;
    case "months":
      expirationDate.setMonth(expirationDate.getMonth() + config.value);
      break;
    case "years":
      expirationDate.setFullYear(expirationDate.getFullYear() + config.value);
      break;
    default:
      throw new Error("Unknown duration type");
  }

  return expirationDate; // Return as JavaScript Date object
}
