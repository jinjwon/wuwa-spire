# 이미지 넣는 법

이 폴더에 정해진 이름으로 PNG를 넣으면 게임이 자동으로 인식해요. 코드는 고치지 않아도 돼요.

## 우선순위

1. `<id>_idle.png`: 도트 스프라이트 시트(대기 동작, 반복 재생)
2. `<id>.png`: 정지 이미지(초상화나 전신 일러스트)
3. 위키 프로필 이미지(공명자만, 인터넷 연결 필요)
4. 기본 실루엣

`<id>_attack.png`를 넣으면 공격할 때 한 번 재생되고, 다시 대기 동작으로 돌아가요.

## 파일 이름

| 대상 | id | 예시 |
|---|---|---|
| 방랑자 | `rov` | `rov_idle.png`, `rov_attack.png` |
| 에이메스 | `aem` | `aem_idle.png`, `aem_attack.png` |
| 파수인 | `sk` | `sk_idle.png`, `sk_attack.png` |
| 적 | `enemy_<id>` | `enemy_levia_idle.png`, `enemy_axion.png` |

적 id: `jelly` 해파리, `statue` 석상병, `bat` 박쥐, `flame` 불꽃 도마뱀, `wolf` 늑대, `crab` 갑각 수호자, `mech` 기계 잔상, `storm` 폭풍 날개, `golem` 공명 거신, `lion` 사자, `hunter` 심연 사냥꾼, `levia` 레비아탄, `axion` 더 엑시온

## 스프라이트 시트 규칙

- 정사각형 프레임을 **가로 한 줄로** 이어 붙여요. 예: 128×128 프레임 6장 → 768×128 이미지.
- 프레임 수는 가로 길이 ÷ 세로 길이로 자동 계산돼요.
- 재생 속도는 초당 8프레임이에요.
- 배경은 투명(PNG)이어야 해요.
- 공명자는 **오른쪽**, 적은 **왼쪽**을 바라보게 그려 주세요.
- 발끝이 프레임 아래쪽에 닿게 맞춰야 땅에 서 있는 것처럼 보여요.

## GPT 이미지 생성 프롬프트 예시

```
Pixel art sprite sheet of [캐릭터 설명: 예) a girl with long pink-white hair, white and red futuristic outfit, holding a straight sword],
side view facing right, idle breathing animation, 6 frames in a single horizontal row,
each frame 128x128 pixels, transparent background, consistent character size and position across frames,
feet aligned to the bottom edge, 16-bit SNES style, limited palette, crisp pixels, no anti-aliasing
```

공격 동작은 `idle breathing animation`을 `sword slash attack animation`으로 바꿔서 생성하면 돼요.

GPT가 만든 이미지는 프레임 간격이 정확하지 않을 수 있어요. 그럴 때는 이미지 편집 도구로 프레임을 같은 간격으로 다시 잘라 붙이세요. Aseprite나 Piskel(무료, 웹)을 쓰면 쉬워요.
