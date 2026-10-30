# 첨탑의 메아리 도트 에셋 — 2026-10-30

OpenAI 내장 `image_gen`으로 생성한 팬아트입니다. 원작 캐릭터·적의 IP는 Kuro Games에 있습니다. 공식 에셋 또는 상업 이용 허락을 의미하지 않습니다.

## 1차 제작 기록

- 공명자 8외형: 여성·남성 방랑자, 에이메스, 파수인, 린네, 모니에, 치사, 카멜리아.
- 적 28종: 게임의 `EN` 전체. 명식 레비아탄·알레프 포함.
- `../assets/`: 128×128 정지 PNG 72개(초상·대기), 512×128 공격 시트 8개.
- `contact-sheet.png`: 36종 전체 미리보기. `combat-preview.png`: 실제 게임 전투 캡처.
- `source/`: 생성 원본. `manifest.json`: 각 ID·원본·프레임 규격·출처 대응.

## 제작 기준과 한계

오른쪽을 보는 공명자, 왼쪽을 보는 적, 16비트 계열 도트, 어두운 외곽선, 투명 배경. 생성 결과의 불균등한 간격을 수동 지정 좌표로 분리한 뒤 최근접 축소·64색 팔레트·공통 발 위치로 정규화했습니다. 원본은 보존합니다.

공명자 공격에는 서로 다른 네 자세를 사용합니다. 1차 버전에서는 대기 호흡과 적의 공격·피격·부유에 CSS 모션만 사용했습니다. 아래 2차 버전에서 적의 동작 시트를 추가했습니다. 원작 디자인을 재해석한 생성물이며 의상·무기·세부 실루엣은 공식 모델과 다를 수 있습니다.

게임에 등록된 원화 URL은 403 응답으로 직접 회수하지 못했습니다. 보스 형태 확인에는 [레비아탄 공식 소개](https://wutheringwaves.kurogames.com/fr/main/news/detail/3437)와 [헤카테 공식 소개](https://wutheringwaves.kurogames.com/en/main/news/detail/1967)를 참고했습니다. 나머지는 등록 명칭과 캐릭터 특징을 바탕으로 생성했습니다.

## 프롬프트 세트

공통 지시: “Production sprite atlas for a Wuthering Waves fan deckbuilding RPG. Transparent background, crisp 16-bit pixel clusters, dark outlines, limited palette. Full silhouettes, no text, labels, grids or scenery. Heroes face RIGHT; enemies face LEFT.”

1. 공명자 기준표: 4열×2행. 여성·남성 Rover, Aemeath, Shorekeeper, Lynae, Mornye, Chisa, Camellya 순서. 검은색·금색 방랑자, 분홍 머리 에이메스, 청백색 파수인, 금발·라임색 린네, 은발·기계 장비 모니에, 검정·빨강 치사, 백발·붉은 꽃 카멜리아.
2. 공명자 동작표 A: 기준표를 참조한 4열×4행. 여성 방랑자·남성 방랑자·에이메스·파수인. 각 행 “idle guard, anticipation, forward attack/magic release, recovery”, 일정 크기와 발 위치, 각 셀 여백.
3. 공명자 동작표 B: 같은 규격. 린네 쌍권총·모니에 대검·치사 가위검·카멜리아 붉은 덩굴 공격. 의상과 색상 유지.
4. 경파급: 5열×2행. Snip Snap, Zig Zag, Tick Tack, Gulpuff, Chirpuff, Vanguard Junrock, Fission Junrock, Cruisewing, Fusion Dreadmane, Hoartoise.
5. 거랑급·크라운리스: 4열×2행. Cyan-Feathered Heron, Violet-Feathered Heron, Havoc Dreadmane, Spearback, Viridblaze Saurian, Tambourinist, Autopuppet Scout, Crownless.
6. 정예·명식: 5열×2행. Tempest Mephis, Mourning Aix, Nameless Explorer(우주복), Inferno Rider(오토바이), Feilian Beringal, Dreamless, Bell-Borne Geochelone, Hecate(붉은 세 얼굴 마녀), Leviathan(백발·청흑색 여성형), Aleph-One Construct(기하학적 우주 메카).

## 검증 재실행

Node 환경에 `sharp`와 `playwright`, 로컬 Chrome이 있으면 다음을 실행합니다. 게임 실행에는 이 개발 도구가 필요하지 않습니다.

```
node scripts/prepare-sprites.cjs
node scripts/check-sprites.cjs
```

검증 범위: 36종 누락 여부, 투명도·규격, 공명자 공격 4프레임, 남녀 외형 전환, 마지막 프레임 표시, 대기 복귀, 모션 줄이기 설정, 브라우저 오류. 배포용 설치 파일은 재빌드하지 않았습니다.

## 2차 제작 — 동작·지도·카드

- 공명자 남녀 외형과 에이메스 메카를 포함한 9외형: 공격·방어·피격·시전·궁극기. 적·명식 28종: 공격·시전·피격.
- 추가 동작 시트 121개. 기존 공격 시트와 함께 사용. 128×128 프레임, 초당 8프레임, 투명 배경. 새 동작은 핵심 자세와 유지·복귀 프레임으로 구성하며 모든 프레임이 고유한 중간 그림은 아닙니다. 대기 호흡·부유는 CSS입니다.
- 카드 70종: 144×96 도트 일러스트, 게임 카드 ID와 일대일 대응.
- 4지역의 전투 배경·세로 경로 지도 총 8장, 지도 아이콘 8종.
- 검은 해안·숲·테티스 지하·라하이 로이의 환경을 팬게임용으로 재해석했습니다. 원작 지형의 정확한 복제는 아닙니다.
- 공식 환경 자료: [검은 해안](https://wutheringwaves.kurogames.com/jp/main/news/detail/1358), [라하이 로이](https://wutheringwaves.kurogames.com/es/main/news/detail/3980). 참고 이미지는 references/에 보존했습니다.
- 원본·프롬프트·분할 좌표: source-v2/jobs.json. 출력 목록: manifest-v2.json.
- review.html: 캐릭터·동작·지역 선택과 카드 갤러리. cards-contact-sheet.png: 카드 전체표. combat-preview-v2.png·map-preview-v2.png: 실제 게임 캡처.

재생성: `node scripts/prepare-art-v2.cjs`, `node scripts/build-art-review.cjs`.
검증: `node scripts/check-sprites.cjs` — 37외형, 동작별 파일, 카드 70종 로컬 로딩, 4지역 배경·지도, 남녀 전환, 메카 전환 중 동작 복귀, 방어 카드 동작, 경로 선택, 마지막 프레임, 모션 줄이기, 브라우저 오류.
설치 파일 재빌드와 장시간 전체 플레이는 수행하지 않았습니다.
