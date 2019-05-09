export function generateRandomListContent({rowCount, columnCount, width = 120}) {
  const items = times(rowCount);

  const columns = times(columnCount).map(i => ({
    path: `col${i}`,
    width,
    headerCell: {render: () => `Column #${i + 1} ${generateRandomString()}`},
    bodyCell: {
      render: item => {
        return `Cell ${item + 1}, ${i + 1} ${generateRandomString()}`;
      }
    },
    footerCell: {render: () => `Footer #${i + 1} ${generateRandomString()}`}
  }));

  return {items, columns};
}

function generateRandomString() {
  const letters = 'ABCD EFGH IJKL MNOP';
  const generateRandomLengthContent = length => letters.slice(length);
  const length = parseInt(Math.random() * letters.length, 0);
  return generateRandomLengthContent(length);
}

function times(count) {
  return Array.from([...Array(count)].keys()); // equivalent of Lodash `times()` function
}
