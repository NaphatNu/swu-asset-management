const fs = require('fs');
const path = require('path');

function walk(dir, acc = []) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) {
      if (!['node_modules', '.git', '.next'].includes(f)) walk(p, acc);
    } else if (p.endsWith('.tsx')) acc.push(p);
  }
  return acc;
}

const badClose = '</' + 'motion.div>';
for (const p of walk(__dirname)) {
  let t = fs.readFileSync(p, 'utf8');
  if (!t.includes('motion.div')) continue;
  const nt = t.split(badClose).join('</div>');
  if (nt !== t) fs.writeFileSync(p, nt);
}
