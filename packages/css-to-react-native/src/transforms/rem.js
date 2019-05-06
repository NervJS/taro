export const remToPx = value => {
  return value.replace(
    /(\d*\.?\d+)rem/g,
    (match, m1) => parseFloat(m1, 10) * 16 + "px",
  );
};
