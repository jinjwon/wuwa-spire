#!/usr/bin/env bash
# 브랜치 관리: main(공통·문서) · art(그림) · dev(기능) 3개를 한 번에 본다.
#   npm run branches              상태표: main 대비 앞/뒤, 원격과 차이, 마지막 커밋
#   npm run branches -- sync      art·dev에 main을 합치고 push (작업 시작 전에)
#   npm run branches -- ship      art·dev를 main에 합치고 push (자가 점검·사용자 확인 뒤에)
#   npm run branches -- release 0.12.0   main에서 버전 올리고 v태그 push → GitHub Actions가 설치 파일 빌드
# macOS·윈도우(Git Bash) 둘 다 돈다. 작업 트리가 깨끗해야 움직인다.
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"
WORK=(art dev)
cur=$(git rev-parse --abbrev-ref HEAD)
clean(){ [ -z "$(git status --porcelain)" ] || { echo "✋ 커밋 안 된 변경이 있어요. 먼저 커밋하거나 치워 주세요."; git status --short; exit 1; }; }
back(){ git checkout -q "$cur"; }

status(){
  git fetch -q --prune origin
  printf '%-6s %-12s %-12s %s\n' 브랜치 "main 대비" "원격 대비" "마지막 커밋"
  for b in main "${WORK[@]}"; do
    git rev-parse -q --verify "$b" >/dev/null || { printf '%-6s (없음)\n' "$b"; continue; }
    if [ "$b" = main ]; then rel='-'; else
      read -r behind ahead < <(git rev-list --left-right --count "main...$b")
      rel="+$ahead/-$behind"; fi
    if git rev-parse -q --verify "origin/$b" >/dev/null; then
      read -r rb ra < <(git rev-list --left-right --count "origin/$b...$b")
      [ "$ra$rb" = 00 ] && rr='같음' || rr="↑$ra ↓$rb"
    else rr='원격 없음'; fi
    printf '%-6s %-12s %-12s %s\n' "$b" "$rel" "$rr" "$(git log -1 --format='%cr · %s' "$b" -- | cut -c1-60)"
  done
  extra=$(git for-each-ref --format='%(refname:short)' refs/heads refs/remotes/origin | grep -vE '^(origin/)?(main|art|dev|HEAD)$|^origin$' || true)
  [ -n "$extra" ] && { echo; echo "그 밖의 브랜치(정리 후보):"; echo "$extra" | sed 's/^/  /'; }
  echo; echo "최근 태그: $(git describe --tags --abbrev=0 2>/dev/null || echo 없음) · package.json $(node -p 'require("./package.json").version')"
  echo "범례: +앞선 커밋/-뒤진 커밋, ↑push 안 함 ↓pull 안 함"
}

sync(){
  clean; git fetch -q origin
  git checkout -q main && git merge -q --ff-only origin/main
  for b in "${WORK[@]}"; do
    git checkout -q "$b"; git merge -q --ff-only "origin/$b" 2>/dev/null || true
    git merge -q --no-edit main || { echo "⚠️ $b에서 충돌. 해결 후 다시 실행하세요."; exit 1; }
    git push -q origin "$b"; echo "✅ $b ← main"
  done
  back
}

ship(){
  clean; git fetch -q origin
  git checkout -q main && git merge -q --ff-only origin/main
  for b in "${WORK[@]}"; do
    git merge -q --no-edit "$b" || { echo "⚠️ main ← $b 충돌. 해결·커밋 후 다시 실행하세요."; exit 1; }
    echo "✅ main ← $b"
  done
  git push -q origin main; echo "✅ main push"
  for b in "${WORK[@]}"; do git checkout -q "$b"; git merge -q --ff-only main && git push -q origin "$b"; done
  echo "✅ art·dev를 main과 같은 위치로 맞춤"; back
}

release(){
  v=${1:?버전을 적어 주세요. 예: npm run branches -- release 0.12.0}
  [[ $v =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]] || { echo "버전 형식은 0.12.0"; exit 1; }
  clean; [ "$cur" = main ] || { echo "main에서 실행하세요(지금 $cur)."; exit 1; }
  git rev-parse -q --verify "v$v" >/dev/null && { echo "v$v 태그가 이미 있어요."; exit 1; }
  npm version "$v" --no-git-tag-version >/dev/null
  git commit -qam "release: v$v" && git tag "v$v" && git push -q origin main "v$v"
  echo "🚀 v$v push. 빌드: gh run watch (약 12분) → Releases에 설치 파일과 변경 내역이 올라가요."
}

case "${1:-status}" in
  status) status;; sync) sync;; ship) ship;; release) release "${2:-}";;
  *) sed -n '2,7p' "$0"; exit 1;;
esac
