const getMonthDifference = (date1, date2) => {
  return (date1.getFullYear() - date2.getFullYear()) * 12 + (date1.getMonth() - date2.getMonth());
};

module.exports = { getMonthDifference };