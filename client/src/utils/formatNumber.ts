const formatNumber = (value: number) => {
  return value.toLocaleString(undefined, { minimumFractionDigits: 0 });
};

export default formatNumber;
