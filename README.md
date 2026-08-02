# D:FORCE 2026 Summer School

동탄동산교회 디포스 초등부 여름캠프 레크리에이션 부스 운영 웹앱입니다.

## 로컬 실행

```bash
npm install
npm run dev
```

## 정적 운영 설정

- `public/config/schedule.json`: 팀 이름·색상, 라운드 시간, 부스별 대진
- `public/config/game-cards.json`: 게임 A~D의 미션 및 아이템 통합 설정
- `public/config/score-config.json`: 게임별 점수 항목과 항목별 최고점

`game-cards.json`에서 각 게임의 `missions`와 `items` 배열만 수정하면 됩니다.

```json
{
  "A": {
    "missions": [
      {"id":"1", "title":"미션 이름", "description":"수행 방법", "weight":1}
    ],
    "items": [
      {"id":"1", "title":"아이템 이름", "description":"효과", "weight":1}
    ]
  }
}
```

- `weight`는 절대 점수가 아닌 상대 추첨 확률입니다. 모두 `1`이면 동일 확률입니다.
- 특정 아이템의 `weight`만 `2`로 바꾸면 다른 `weight: 1` 항목보다 두 배 자주 추첨됩니다.
- `weight`를 생략하면 자동으로 `1`이 적용됩니다.

설정 파일 오류가 있으면 앱 첫 화면에 대상 파일과 오류 위치가 표시됩니다. GitHub에서 설정 파일을 수정하면 Netlify가 다시 빌드한 뒤 반영됩니다.

## 상태 저장

Netlify Functions와 Netlify Blobs를 사용합니다. 배포 환경에서는 모든 휴대폰이 같은 라운드·점수·미션·아이템 상태를 공유합니다. 로컬 개발 중 Functions가 없으면 브라우저 로컬 저장소로 동작합니다.
