const suspects = [
  {id:'min',name:'김민재',role:'연구 조교',meta:'27세 · 피해자의 공동 연구원',color:'#455c6b',intro:'저는 계속 3호차 제 자리에 있었습니다. 박사님 노트북이 사라진 건 정말 몰라요.',agitation:12,
   answers:{time:'11시 20분부터 계속 제 자리에 있었어요. 이어폰을 끼고 논문을 보고 있었습니다.',where:'3호차 8C석이요. 승무원이 지나가는 것도 봤습니다.',victim:'박사님과 연구 방향 때문에 다툰 적은 있지만, 훔칠 이유는 없습니다. 논문 3저자로 밀린 건 조금… 많이 억울했지만요.',bag:'제 가방에는 태블릿과 충전기뿐입니다. 간식 봉지는 증거품이 아니길 바랍니다.',card:'출입 카드는 박사님만 가지고 있었습니다. 적어도 저는 그렇게 알고 있어요.',power:'정전 때도 자리에 있었습니다. 옆자리 승객이 증명할 겁니다.'}},
  {id:'seo',name:'서지우',role:'테크 기자',meta:'31세 · 피해자 인터뷰 예정',color:'#873e35',intro:'취재하러 탄 건 맞지만 절 도둑 취급하진 마세요. 11시 반에는 식당칸에서 커피를 마시고 있었어요.',agitation:18,
   answers:{time:'11시 15분부터… 아니, 20분쯤부터 식당칸에 있었습니다. 정확히는 기억 안 나요.',where:'식당칸이요. 커피 영수증도 있습니다. 커피 맛은 끔찍했지만 알리바이로는 훌륭하죠.',victim:'한 박사가 인터뷰를 일방적으로 취소했어요. 화는 났지만 그게 범죄 동기는 아니죠.',bag:'카메라와 취재 수첩뿐이에요. 노트북 같은 건 없습니다.',card:'카드요? 그런 게 있는지도 몰랐습니다.',power:'불이 꺼졌을 땐 식당칸에 있었습니다. 직원에게 물어보세요.'}},
  {id:'park',name:'박정호',role:'열차 승무원',meta:'44세 · 4호차 담당 승무원',color:'#4f5543',intro:'제가 담당 구역을 비운 사이 벌어진 일입니다. 11시 25분경에는 2호차에서 승객 민원을 처리 중이었습니다.',agitation:9,
   answers:{time:'11시 18분부터 32분까지 2호차에 있었습니다. 업무 기록도 남아 있습니다.',where:'2호차입니다. 12B 승객의 좌석 문제를 처리했습니다.',victim:'오늘 처음 본 분입니다. 특별한 관계는 없습니다.',bag:'승무원 가방과 검표 단말기뿐입니다. 분실물 양말 한 짝도 있는데, 그건 제 것이 아닙니다.',card:'객실 마스터키는 제게 있지만 사용 기록이 남습니다. 그 시간엔 사용하지 않았습니다.',power:'정전 원인을 확인하려 기관실에 연락했습니다. 약 90초간 지속됐습니다.'}}
];
const evidence = [
  {id:'receipt',name:'카페 영수증',desc:'결제 시각 23:08'},
  {id:'card',name:'출입 카드',desc:'플랫폼 카페에서 발견'},
  {id:'cctv',name:'통로 CCTV',desc:'23:31 청소 카트 이동'},
  {id:'log',name:'승무 기록',desc:'2호차 민원 처리 서명'},
  {id:'fiber',name:'붉은 섬유',desc:'카트 손잡이에 부착'}
];
const state={current:0,selectedEvidence:null,clues:new Set(),asked:{},started:false,time:300,timerId:null};
const $=s=>document.querySelector(s);
const els={intro:$('#intro'),game:$('#game'),tabs:$('#suspectTabs'),name:$('#suspectName'),role:$('#role'),meta:$('#suspectMeta'),portrait:$('#portrait'),trustBar:$('#trustBar'),trustValue:$('#trustValue'),chat:$('#chat'),suggestions:$('#suggestions'),evidence:$('#evidenceList'),clues:$('#clueLog')};

function renderTabs(){els.tabs.innerHTML=suspects.map((s,i)=>`<button class="suspect-tab ${i===state.current?'active':''}" data-i="${i}">용의자 0${i+1}<strong>${s.name}</strong></button>`).join('');els.tabs.querySelectorAll('button').forEach(b=>b.onclick=()=>switchSuspect(+b.dataset.i));}
function switchSuspect(i){state.current=i;const s=suspects[i];renderTabs();els.name.textContent=s.name;els.role.textContent=s.role;els.meta.textContent=s.meta;els.portrait.style.background=s.color;updateAgitation();els.chat.innerHTML='';addMessage(s.intro,'suspect');renderSuggestions();}
function updateAgitation(add=0){const s=suspects[state.current];s.agitation=Math.min(96,s.agitation+add);els.trustBar.style.width=s.agitation+'%';els.trustValue.textContent=s.agitation+'%';}
function addMessage(text,type){const div=document.createElement('div');div.className='message '+type;div.innerHTML=`<small>${type==='player'?'형사':suspects[state.current].name}</small>${text}`;els.chat.appendChild(div);els.chat.scrollTop=els.chat.scrollHeight;return div;}
function renderSuggestions(){const qs=['사건 당시 어디 있었죠?','피해자와 무슨 관계죠?','출입 카드에 대해 아나요?'];els.suggestions.innerHTML=qs.map(q=>`<button>${q}</button>`).join('');els.suggestions.querySelectorAll('button').forEach(b=>b.onclick=()=>ask(b.textContent));}
function classify(q){if(/몇 시|시간|당시/.test(q))return'time';if(/어디|장소|자리/.test(q))return'where';if(/피해자|박사|관계|원한/.test(q))return'victim';if(/가방|소지|물건/.test(q))return'bag';if(/카드|출입/.test(q))return'card';if(/정전|불/.test(q))return'power';return null;}
function evidenceAnswer(s,id){
  const map={
   min:{receipt:'영수증 주인은 제가 아닙니다. 전 식당칸에 가지 않았어요.',card:'처음 보는 카드입니다. 박사님이 잃어버린 건가요?',cctv:'카트를 민 사람이 누군지는 화면으로 확인하기 어렵네요.',log:'승무원 말은 사실인 것 같습니다.',fiber:'붉은 옷이라면 기자분 재킷이 눈에 띄던데요.'},
   seo:{receipt:'결제 시간이 뭐가 이상하죠? 커피를 사고 식당칸에 오래 있었어요.',card:'…제 취재 수첩이 카페에서 떨어졌을 때 같이 있었나 보군요. 전 훔치지 않았어요.',cctv:'카트는 승무원이 옮기는 것 아닌가요? 왜 저한테 묻죠?',log:'그 승무원은 확실히 2호차에 있었겠네요.',fiber:'흔한 빨간색 섬유잖아요. 제 재킷과 같다고 단정할 수 없어요.'},
   park:{receipt:'23시 8분 결제라면 23시 반의 알리바이는 되지 않습니다.',card:'이 카드는 일반 객실 잠금장치를 열 수 있습니다. 피해자의 것으로 보입니다.',cctv:'그 시각 저는 2호차였습니다. 청소 카트를 옮길 사람은 없었어야 합니다.',log:'승객 서명까지 있으니 제 동선은 확인될 겁니다.',fiber:'서 기자가 붉은 재킷을 입고 있습니다. 섬유를 대조해보세요.'}}
  return map[s.id][id];
}
function ask(text){if(!text.trim())return;addMessage(text,'player');$('#questionInput').value='';const typing=addMessage('생각 중','suspect');typing.classList.add('typing');setTimeout(()=>{typing.classList.remove('typing');const s=suspects[state.current];let answer;if(state.selectedEvidence){answer=evidenceAnswer(s,state.selectedEvidence);handleEvidenceClue(s,state.selectedEvidence);state.selectedEvidence=null;renderEvidence();updateAgitation(s.id==='seo'?14:5);}else{const key=classify(text);answer=key?s.answers[key]:`${s.id==='park'?'질문의 의도는 알겠습니다만, ':''}제가 확실히 말씀드릴 수 있는 건 사건 시각의 제 위치와 소지품입니다. 시간, 장소, 가방 중 하나를 더 구체적으로 물어보세요.`;if(key){state.asked[s.id]=(state.asked[s.id]||0)+1;updateAgitation(s.id==='seo'?5:3);if(s.id==='seo'&&key==='time')addClue('흔들리는 알리바이','식당칸에 간 시간을 정확히 말하지 못한다.');}}typing.innerHTML=`<small>${s.name}</small>${answer}`;els.chat.scrollTop=els.chat.scrollHeight;},450);}
function handleEvidenceClue(s,id){if(s.id==='seo'&&id==='receipt')addClue('20분의 공백','영수증은 23:08. 서지우의 23:30 알리바이를 증명하지 못한다.');if(s.id==='seo'&&id==='card')addClue('카드와 기자','서지우는 카드를 몰랐다면서 카페에서 함께 떨어졌다고 해명했다.');if(s.id==='seo'&&id==='fiber')addClue('붉은 섬유','청소 카트의 섬유와 서지우의 재킷 색이 일치한다.');if(id==='cctv')addClue('움직인 청소 카트','정전 직후 누군가 카트를 연결 통로로 옮겼다.');if(s.id==='park'&&id==='log')addClue('확인된 알리바이','박정호는 사건 시각 2호차 승객과 함께 있었다.');}
function addClue(title,text){if(state.clues.has(title))return;state.clues.add(title);if(els.clues.querySelector('.empty-note'))els.clues.innerHTML='';els.clues.insertAdjacentHTML('beforeend',`<div class="clue"><small>모순 발견</small><strong>${title}</strong><br>${text}</div>`);$('#clueCount').textContent=`${Math.min(state.clues.size,3)}/3`;}
function renderEvidence(){els.evidence.innerHTML=evidence.map(e=>`<button class="evidence ${state.selectedEvidence===e.id?'selected':''}" data-id="${e.id}"><b>${e.name}</b><span>${e.desc}</span></button>`).join('');els.evidence.querySelectorAll('button').forEach(b=>b.onclick=()=>{state.selectedEvidence=state.selectedEvidence===b.dataset.id?null:b.dataset.id;renderEvidence();if(state.selectedEvidence)$('#questionInput').placeholder=`${evidence.find(e=>e.id===state.selectedEvidence).name}을 제시하며 질문…`;else $('#questionInput').placeholder='용의자에게 질문하세요…';});}
function openAccuse(){const modal=$('#accuseModal');$('#accuseOptions').innerHTML=suspects.map((s,i)=>`<button class="accuse-option" data-i="${i}">${s.role}<br>${s.name}</button>`).join('');modal.classList.remove('hidden');modal.querySelectorAll('.accuse-option').forEach(b=>b.onclick=()=>showResult(+b.dataset.i));}
function showResult(i){$('#accuseModal').classList.add('hidden');const win=suspects[i].id==='seo';$('#resultEyebrow').textContent=win?'CASE CLOSED':'INVESTIGATION FAILED';$('#resultMark').textContent=win?'✓':'×';$('#resultTitle').textContent=win?'정확한 추리입니다.':'진범을 놓쳤습니다.';$('#resultText').textContent=win?`서지우의 알리바이와 증거 사이의 모순을 밝혀냈습니다. 발견한 단서 ${state.clues.size}개.`:'증거를 다시 살펴보세요. 범인의 알리바이에는 20분의 공백이 있습니다.';$('#resultModal').classList.remove('hidden');}
function reset(){location.reload();}
function start(){els.intro.classList.add('hidden');els.game.classList.remove('hidden');state.started=true;renderTabs();renderEvidence();switchSuspect(0);state.timerId=setInterval(()=>{if(!state.started)return;if(state.time<=0){clearInterval(state.timerId);openAccuse();return;}state.time--;const m=String(Math.floor(state.time/60)).padStart(2,'0'),s=String(state.time%60).padStart(2,'0');$('#timer').textContent=`${m}:${s}`;},1000);}
$('#startBtn').onclick=start;$('#resetBtn').onclick=reset;$('#replayBtn').onclick=reset;$('#accuseBtn').onclick=openAccuse;document.querySelector('[data-close]').onclick=()=>$('#accuseModal').classList.add('hidden');$('#chatForm').onsubmit=e=>{e.preventDefault();ask($('#questionInput').value)};
