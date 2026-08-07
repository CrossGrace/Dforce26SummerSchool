export let teams = [
  ['red1','레드 1','#ff526b'],['red2','레드 2','#c9244b'],['yellow1','옐로 1','#ffd95a'],['yellow2','옐로 2','#e9a916'],
  ['green1','그린 1','#56e39f'],['green2','그린 2','#159d6b'],['blue1','블루 1','#5bbcff'],['blue2','블루 2','#2768d9']
].map(([id,name,color])=>({id,name,color}))

const rounds = [
  {id:'r1',label:'ROUND 1',time:'09:10–09:40'},
  {id:'r2',label:'ROUND 2',time:'09:40–10:10'},
  {id:'r3',label:'ROUND 3',time:'10:20–10:50'},
  {id:'r4',label:'ROUND 4',time:'10:50–11:20'},
]

const pairings = {
  A:[['yellow1','blue1'],['red1','blue2'],['yellow2','green2'],['red2','green1']],
  B:[['red2','blue2'],['yellow2','blue1'],['red1','green1'],['yellow1','green2']],
  C:[['yellow2','green1'],['red2','green2'],['yellow1','blue2'],['red1','blue1']],
  D:[['red1','green2'],['yellow1','green1'],['red2','blue1'],['yellow2','blue2']],
}

const make = (titles, descriptions) => titles.map((title,i)=>({id:`${i+1}`,title,description:descriptions[i],weight:10}))

const A = {
  id:'A', short:'블라인드 양궁', title:'주의 음성을 따라', verse:'요한복음 10:27', icon:'◎', accent:'#ffcf55',
  theme:'세상의 교란시키는 소리를 뒤로하고 참 목자이신 주님의 음성을 분별해요.',
  guide:'안대를 쓴 주자가 아군의 목소리만 따라 과녁으로 이동해 점을 찍습니다.',
  caution:'이동 경로의 장애물을 치우고, 교사는 주자 곁에서 충돌을 방지해 주세요.',
  missions:make(['주의 음성 고백','하이파이브 릴레이','천사의 칭찬','격려의 허그','감사 찬양','팀워크 등 맞대기','성경 구절 암송','상대 팀 축복','박장대소 5초','디포스 탐험대 구호'],[
    '“예수님은 나의 참 목자이십니다!” 크게 선포하기','우리 팀원 전체와 3초 안에 하이파이브 하기','옆 팀원에게 “넌 참 특별한 아이야!” 말해주기','팀원 한 명을 안아주며 “하나님은 너를 사랑해!” 외치기','“당신은 사랑받기 위해 태어난 사람” 1절 떼창하기','팀원 1명과 등 맞대고 5초간 버티기','“나는 하나님이 만드신 특별한 작품이에요!” 크게 외치기','상대 팀을 향해 손하트 만들고 “축복합니다!” 외치기','팀원 전체가 5초간 크게 웃기','“우리는 하나님의 거룩한 디포스 탐험대!” 외치기']),
  items:make(['한 걸음 다가가기','주의 음성 집중 · 더블 점수','소음 차단권','재도전 찬스','목소리 조력자 추가','안대 살짝 힌트','안전 방패 · +10점','골드 스팟 가이드','방해 무효화','팀 전체 보너스'],[
    '출발선을 과녁 앞 1m 당겨 출발','이번 투구 점수를 2배로 인정','10초간 상대 팀의 교란 목소리 금지','과녁을 완전히 벗어나면 1회 재출발','아군 가이드 1명 추가','출발 전 과녁 방향을 3초간 확인','과녁을 벗어나도 기본 보너스 10점','가이드가 과녁 정중앙 앞에서만 안내','상대 팀 방해 아이템 1회 무효','팀 전원에게 보너스 점수 +10점'])
}

const B = {
  id:'B', short:'손등 균형 경주', title:'선한 청지기 릴레이', verse:'에베소서 2:10', icon:'⚖', accent:'#52d9ff',
  theme:'나에게 주신 특별한 모습대로 서로 돕고 성실히 섬겨요.', guide:'서로 다른 물품을 손등에 올리고 반환점을 돌아오는 릴레이입니다.', caution:'바닥이 미끄럽지 않은지 확인하고 주자 간 충분한 간격을 유지해 주세요.',
  missions:make(['청지기 선서','달란트 칭찬','응원의 안마','손하트 3초','감사 문장 완성','미소 발사','격려의 구호','지체 선포','하이파이브 파도타기','기쁨의 점프'],[
    '“나에게 주신 달란트로 최선을 다하겠습니다!” 외치기','팀원 2명의 장점을 하나씩 구체적으로 말하기','앞사람 어깨를 5초간 주물러주기','팀원 3명과 대형 손하트를 만들어 3초 유지','“하나님이 주신 최고의 선물은 (____)입니다!” 완성','상대 팀원들을 바라보며 5초간 미소 짓기','“할 수 있다! 우리는 선한 청지기!” 외치기','“우리는 그리스도 안에서 한 몸입니다!” 외치기','첫 주자부터 마지막 주자까지 연속 하이파이브','팀원 전원이 동시에 제자리점프 3회']),
  items:make(['손가락 살짝 받침권','지름길 이용권','물건 교체권','노 드롭 보험','슬로모션 패널티','시간 차감권 · -5초','구원자의 손길','두 손 자유 찬스','더블 완성 보너스','에이스 지원권'],[
    '둘째 손가락으로 물건 측면을 살짝 받치기','반환점 콘을 1.5m 앞으로 이동','어려운 물건을 종이컵 등으로 교체','떨어진 자리에서 올려놓고 바로 출발','상대 팀 다음 주자가 5초간 까치발 걷기','최종 완주 기록에서 5초 차감','옆 조원이 떨어지는 물건을 1회 잡아주기','한 주자만 손바닥 위에 올려 달리기','해당 주자 무사 완주 시 +20점','주자 2명이 함께 손등을 대어 받치기'])
}

const C = {
  id:'C', short:'카드 순서 맞추기', title:'마음으로 전하는 이야기', verse:'전도서 4:9-10', icon:'▱', accent:'#9d7bff',
  theme:'내 고집을 내려놓고 지체의 말에 경청하며 하나님의 구원 계획을 완성해요.', guide:'카드를 보여주지 않고 말로 설명해 성경 사건의 순서를 맞춥니다.', caution:'카드를 직접 보여주거나 빼앗지 않고 모든 팀원이 말할 기회를 갖게 해 주세요.',
  missions:make(['경청의 고백','비밀 수호 선서','동행 하이파이브','소통의 칭찬','믿음의 구호','팀원 한마음 퀴즈','하나님 나라 선포','사랑의 안아주기','감사 기도 멘트','우주 탐험대 구호'],[
    '“지체의 목소리에 귀 기울이겠습니다!” 외치기','“내 카드를 절대 보여주지 않겠습니다!” 다짐하기','양옆 팀원과 손을 맞잡고 “함께하자!” 말하기','카드를 설명한 지체에게 “설명 최고야!” 칭찬','“하나님의 선하신 계획은 반드시 이루어집니다!” 선포','“우리 조장님의 성함은?” 맞추고 환호하기','“우리는 하나님 나라의 특별한 주인공!” 외치기','옆 지체를 안아주며 “네 말이 잘 보여!” 말하기','“하나님, 우리 조를 모아주셔서 감사합니다!” 외치기','“디포스 우주 탐험대, 미션 클리어 가자!” 외치기']),
  items:make(['비밀 1장 살짝 공개권','시간 일시정지 · 30초','양끝 확정 힌트','선생님 1회 질문권','자리 교환 찬스','키워드 1개 공개','오답 1회 면제','패스 카드 · 1장 스킵','보너스 성공 점수 · +30점','조력 교사 10초 대입'],[
    '헷갈리는 카드 1장을 조장에게 3초 공개','타이머를 멈추고 30초 자유 토론','첫 카드와 마지막 카드 소유자를 교사가 지정','사건의 앞·뒤 여부를 교사에게 1회 질문','잘못 선 팀원 2명의 위치를 교사가 수정','교사가 핵심 연결 단어 1개 제공','최종 제출 오답 시 1회 수정 기회','난해한 카드 1장을 자동 정답 처리','제한 시간 내 성공 시 +30점','교사가 10초간 소통을 정돈'])
}

const D = {
  id:'D', short:'풍선 다트', title:'하나님의 선함 명중', verse:'창세기 50:20', icon:'✦', accent:'#ff6b78',
  theme:'악을 선으로 바꾸시는 하나님의 선한 꿈과 생명을 조준해요.', guide:'색상별 풍선이 놓인 4×4 타깃을 안전 다트로 조준합니다.', caution:'안전선 밖에서만 투척하고, 회수는 교사 신호 후 진행하며 사람을 향해 던지지 않습니다.',
  missions:make(['선함의 선포','믿음의 조준','안전 준수 서약','상대 팀 응원','하트 릴레이','지체 칭찬','감사 고백','박수 3회','용기의 미소','드림스타 구호'],[
    '“악을 선으로 바꾸시는 하나님을 찬양합니다!” 외치기','“하나님의 선한 꿈을 향해 명중!” 외치기','“선생님의 지도에 순종하여 안전하게 투척하겠습니다!”','상대 팀을 향해 “너희도 화이팅!” 외치기','손하트를 만들고 “하나님 사랑해요!” 외치기','앞서 던진 팀원에게 “멋진 투구였어!” 하이파이브','“나를 특별하게 만드신 하나님 감사합니다!” 외치기','전원이 “짝! 짝! 짝! 명중하자!” 외치기','실패해도 “괜찮아, 다음이 있어!” 말하기','“나는 하나님의 꿈이야!” 손을 들고 외치기']),
  items:make(['한 걸음 다가가기','보너스 핀 +1개','노란 풍선 조준권','상대 점수 방어권','점수 더블 찬스','빅 타깃 스와프','실패 재도전권','생명 구원 보너스 · +20점','아군 풍선 보호막','교사 대리 투구 찬스'],[
    '투척선을 1m 앞으로 이동','다트 핀을 1개 더 받아 총 2회 투척','중앙 보너스 노란 풍선 전용 조준','상대 풍선을 맞춰도 상대 점수 방어','이번 풍선 점수를 2배 적용','더 큰 풍선이 있는 구역으로 투척','빗나간 경우 1회 재투척','노란 풍선을 터뜨리면 +20점','우리 팀 풍선 1개 감점 방지','선생님이 팀원 대신 1회 투척'])
}

export let booths = [A,B,C,D].map(b=>({...b,rounds:rounds.map((r,i)=>({...r,teams:pairings[b.id][i]}))}))
export let teamById = Object.fromEntries(teams.map(t=>[t.id,t]))
export let scoreConfig = {}
export let scheduleBreaks = [{id:'snack',label:'간식',time:'10:10–10:20'}]
export let accessConfig = {adminPassword:'1235',scorePassword:'1111'}

export async function loadStaticConfig(){
  const [schedule,scores,details,cardsConfig,access]=await Promise.all([
    fetch('/config/schedule.json',{cache:'no-store'}).then(r=>{if(!r.ok)throw Error('schedule.json을 불러올 수 없습니다.');return r.json()}),
    fetch('/config/score-config.json',{cache:'no-store'}).then(r=>{if(!r.ok)throw Error('score-config.json을 불러올 수 없습니다.');return r.json()}),
    fetch('/config/game-details.json',{cache:'no-store'}).then(r=>{if(!r.ok)throw Error('game-details.json을 불러올 수 없습니다.');return r.json()}),
    fetch('/config/game-cards.json',{cache:'no-store'}).then(r=>{if(!r.ok)throw Error('game-cards.json을 불러올 수 없습니다.');return r.json()}),
    fetch('/config/access.json',{cache:'no-store'}).then(r=>{if(!r.ok)throw Error('access.json을 불러올 수 없습니다.');return r.json()})
  ])
  if(!Array.isArray(schedule.teams)||!Array.isArray(schedule.rounds)||!schedule.matchups)throw Error('schedule.json 구조가 올바르지 않습니다.')
  const ids=new Set(schedule.teams.map(t=>t.id)); if(ids.size!==schedule.teams.length)throw Error('schedule.json 팀 ID가 중복되었습니다.')
  const base=[A,B,C,D]
  const configured=base.map(b=>{
    const gameCards=cardsConfig[b.id]
    if(!Array.isArray(gameCards?.missions)||!Array.isArray(gameCards?.items)||!Number.isInteger(gameCards?.maxMissions)||gameCards.maxMissions<0)throw Error(`game-cards.json: 게임 ${b.id}의 maxMissions/missions/items를 확인하세요.`)
    const normalize=(cards,kind)=>cards.map((card,index)=>{const weight=Number(card.weight??1);if(!card.title||!card.description||!(weight>0))throw Error(`game-cards.json: 게임 ${b.id} ${kind} ${index+1}번 항목을 확인하세요.`);return {...card,id:String(card.id??index+1),weight}})
    const games=schedule.matchups[b.id]; if(!Array.isArray(games)||games.length!==schedule.rounds.length)throw Error(`schedule.json: 게임 ${b.id}의 대진 수를 확인하세요.`)
    games.flat().forEach(id=>{if(!ids.has(id))throw Error(`schedule.json: 알 수 없는 팀 ID ${id}`)})
    if(!details[b.id]?.title||!Array.isArray(details[b.id]?.rules))throw Error(`game-details.json: 게임 ${b.id} 상세 정보를 확인하세요.`)
    if(gameCards.maxMissions>gameCards.missions.length||gameCards.maxMissions>gameCards.items.length)throw Error(`game-cards.json: 게임 ${b.id}의 maxMissions가 카드 수보다 많습니다.`)
    return {...b,details:details[b.id],maxMissions:gameCards.maxMissions,missions:normalize(gameCards.missions,'missions'),items:normalize(gameCards.items,'items'),rounds:schedule.rounds.map((r,i)=>({...r,teams:games[i]}))}
  })
  teams=schedule.teams; booths=configured; teamById=Object.fromEntries(teams.map(t=>[t.id,t]))
  for(const b of base){if(!Array.isArray(scores[b.id])||!scores[b.id].length)throw Error(`score-config.json: 게임 ${b.id}의 점수 항목이 없습니다.`);for(const c of scores[b.id])if(!c.id||!c.label||!(c.max>0))throw Error(`score-config.json: 게임 ${b.id} 항목 형식을 확인하세요.`)}
  scoreConfig=scores
  scheduleBreaks=Array.isArray(schedule.breaks)?schedule.breaks:scheduleBreaks
  if(!/^\d{4}$/.test(String(access.adminPassword))||!/^\d{4}$/.test(String(access.scorePassword)))throw Error('access.json 비밀번호는 숫자 4자리로 입력해 주세요.')
  accessConfig={adminPassword:String(access.adminPassword),scorePassword:String(access.scorePassword)}
  return {teams,booths,scoreConfig,scheduleBreaks,accessConfig}
}
