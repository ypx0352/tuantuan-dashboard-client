import bigDecimal from "js-big-decimal";

const prettifyMoneyNumber = (value) => {
  const roundedPrettyNumber = new bigDecimal(value.toFixed(2)).getPrettyValue();
  return roundedPrettyNumber;
};

export { prettifyMoneyNumber };
