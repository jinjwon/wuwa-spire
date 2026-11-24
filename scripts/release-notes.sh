#!/usr/bin/env bash
# 릴리스 노트: 이전 v태그부터 지금 태그까지 커밋 제목을 종류별로 묶는다.
#   bash scripts/release-notes.sh v0.11.0 > notes.md
# GitHub Actions(build.yml)가 태그 push 때 이 결과를 Releases 본문으로 쓴다.
set -euo pipefail
tag=${1:-$(git describe --tags --abbrev=0)}
prev=$(git describe --tags --abbrev=0 "$tag^" 2>/dev/null || true)
range=${prev:+$prev..}$tag
repo=https://github.com/${GITHUB_REPOSITORY:-$(git remote get-url origin | sed -E 's#(git@github.com:|https://github.com/)##;s#\.git$##')}
log=$(git log --no-merges --format='%s' "$range" | grep -vE '^release:|^chore: v[0-9]' || true)
section(){ # 제목, 접두어 정규식
  local items; items=$(printf '%s\n' "$log" | grep -E "^($2)(\(.*\))?: " | sed -E "s/^($2)(\([^)]*\))?: /- /" || true)
  [ -n "$items" ] && printf '### %s\n%s\n\n' "$1" "$items"
  return 0
}
echo "## ${tag} 변경 내역"; echo
section '✨ 새 기능' 'feat'
section '🐛 수정' 'fix'
section '🎨 그림·에셋' 'art'
section '📝 문서' 'docs'
section '🧹 정리' 'chore|refactor|style|perf|test|build|ci'
other=$(printf '%s\n' "$log" | grep -vE '^(feat|fix|art|docs|chore|refactor|style|perf|test|build|ci)(\(.*\))?: ' | sed '/^$/d;s/^/- /' || true)
[ -n "$other" ] && printf '### 기타\n%s\n\n' "$other"
echo "---"
echo "**받을 파일**: 윈도우 \`win-setup.exe\`(설치) · \`win-portable.exe\`(바로 실행) · 맥 \`mac-arm64.dmg\`(M1~M4) · \`mac-x64.dmg\`(인텔). 실행 방법은 [README]($repo#-3분-만에-시작하기)."
[ -n "$prev" ] && echo "전체 비교: [\`$prev...$tag\`]($repo/compare/$prev...$tag)"
