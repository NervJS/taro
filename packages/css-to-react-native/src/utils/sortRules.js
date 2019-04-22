function isExport(n) {
  return Array.isArray(n) && n[0] === ":export";
}

function byExport(a, b) {
  if (!isExport(a.selectors) && isExport(b.selectors)) {
    return -1;
  }
  if (isExport(a.selectors) && !isExport(b.selectors)) {
    return 1;
  }
  return 0;
}

function byLine(a, b) {
  if (isExport(a.selectors) && isExport(b.selectors)) {
    if (a.position.start.line > b.position.start.line) {
      return 1;
    }
    if (a.position.start.line < b.position.start.line) {
      return -1;
    }
  }
  return 0;
}

export function sortRules(rules) {
  return rules.sort(byExport).sort(byLine);
}
