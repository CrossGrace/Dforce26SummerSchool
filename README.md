# D:FORCE 2026 Summer School

동탄동산교회 디포스 초등부 여름캠프 레크리에이션 부스 운영 웹앱입니다.

## 로컬 실행

```bash
npm install
npm run dev
```

## 정적 운영 설정

- `public/config/schedule.json`: 팀 이름·색상, 라운드 시간, 부스별 대진
- `public/config/game-a.csv` ~ `game-d.csv`: 게임별 미션 및 아이템
- `public/config/score-config.json`: 게임별 점수 항목과 항목별 최고점

CSV 열은 `kind,id,title,description,weight` 순서입니다.

- `kind`: `mission` 또는 `item`
- `id`: `M-1`, `I-1` 형식의 고유 번호
- `weight`: 랜덤 추첨 가중치. 아이템이 모두 `10`이면 동일 확률입니다.
- 쉼표가 포함된 제목이나 설명은 큰따옴표로 감쌉니다.

설정 파일 오류가 있으면 앱 첫 화면에 대상 파일과 오류 위치가 표시됩니다. GitHub에서 설정 파일을 수정하면 Netlify가 다시 빌드한 뒤 반영됩니다.

## 상태 저장

Netlify Functions와 Netlify Blobs를 사용합니다. 배포 환경에서는 모든 휴대폰이 같은 라운드·점수·미션·아이템 상태를 공유합니다. 로컬 개발 중 Functions가 없으면 브라우저 로컬 저장소로 동작합니다.
