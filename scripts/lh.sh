#!/usr/bin/env bash
# Usage: scripts/lh.sh <path> <runs> [desktop]
p=$1; n=${2:-3}; preset=""; [ "$3" = desktop ] && preset="--preset=desktop"
out=${LH_OUT:-.}
for i in $(seq 1 $n); do
  f="$out/lh_run_$i.json"
  npx -y lighthouse@12 "http://localhost:4321$p" --quiet --chrome-flags="--headless=new" $preset --output=json --output-path="$f" >/dev/null 2>&1
  node -e "const r=require(process.argv[1]);const c=r.categories;console.log(process.argv[2],Object.values(c).map(x=>x.id.slice(0,4)+':'+Math.round(x.score*100)).join(' '),'LCP',r.audits['largest-contentful-paint'].displayValue,'TBT',r.audits['total-blocking-time'].displayValue,'CLS',r.audits['cumulative-layout-shift'].displayValue)" "$f" "$p"
done
