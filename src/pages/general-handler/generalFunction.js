import bigDecimal from "js-big-decimal";
import { DateTime } from "luxon";

const prettifyMoneyNumber = (value) => {
  const roundedPrettyNumber = new bigDecimal(value.toFixed(2)).getPrettyValue();
  return roundedPrettyNumber;
};

const getTimeInZone = (time, zone) => {
  try {
    const timeInISO = new Date(time).toISOString();
    if (zone === "CST") {
      return DateTime.fromISO(timeInISO)
        .setZone("Asia/Shanghai")
        .toFormat("yyyy-MM-dd HH:mm:ss");
    } else if (zone === "ACST") {
      return DateTime.fromISO(timeInISO)
        .setZone("Australia/Adelaide")
        .toFormat("dd/MM/yyyy HH:mm:ss");
    }
  } catch (error) {
    throw error;
  }
};

export { prettifyMoneyNumber, getTimeInZone };
