// =============================================================
// AI 홈페이지 제작 페이지 스크립트
// 1) 히어로 문구 바꾸기  2) 탭 전환  3) 프롬프트 만들기
// 4) 실습 단계 체크  5) 푸터 연도 표시
// =============================================================

// ---------- 1. 버튼을 누르면 히어로 문구가 바뀝니다 ----------
const messages = [
  'AI는 제작 속도를 높이는 도구예요.',
  '한 번에 완성보다, 나눠서 요청해요.',
  'AI가 고친 코드도 직접 실행해 봐요.',
  '캡처는 참고만, 복제는 하지 않아요.',
  '최종 이해와 수정은 사람이 해요.'
];
let messageIndex = 0;

const heroMessage = document.getElementById('heroMessage');
const heroButton = document.getElementById('heroButton');

heroButton.addEventListener('click', function () {
  heroMessage.classList.add('fade');            // 잠깐 흐려졌다가
  setTimeout(function () {
    messageIndex = (messageIndex + 1) % messages.length; // 마지막이면 처음으로
    heroMessage.textContent = messages[messageIndex];
    heroMessage.classList.remove('fade');       // 다시 보이게
  }, 200);
});

// ---------- 2. 탭 전환 ----------
const tabs = document.querySelectorAll('.tab');
const panels = document.querySelectorAll('.panel');

tabs.forEach(function (tab) {
  tab.addEventListener('click', function () {
    const target = tab.dataset.tab;             // data-tab 값 읽기

    tabs.forEach(function (t) { t.classList.remove('active'); });
    panels.forEach(function (p) { p.classList.remove('active'); });

    tab.classList.add('active');
    document.querySelector('.panel[data-panel="' + target + '"]').classList.add('active');
  });
});

// ---------- 3. 프롬프트 만들기 ----------
const purposeSelect = document.getElementById('purpose');
const commentCheck = document.getElementById('commentCheck');
const promptResult = document.getElementById('promptResult');
const copyButton = document.getElementById('copyButton');

// 단계별로 AI에게 요청할 문장 (수업 자료 10쪽 예시 참고)
const stepText = {
  html: {
    title: 'HTML 구조를 만들어줘.',
    rules: ['header, nav, main, section, footer 태그를 사용해줘.']
  },
  css: {
    title: '위 HTML에 어울리는 CSS를 작성해줘.',
    rules: ['카드형 레이아웃, 충분한 여백, 읽기 쉬운 글자 크기를 적용해줘.']
  },
  js: {
    title: '버튼을 클릭하면 소개 문장이 바뀌는 JavaScript 기능을 추가해줘.',
    rules: ['querySelector 또는 getElementById를 사용해줘.']
  }
};

let selectedStep = 'html';
let selectedLevel = '초보자';

// 칩 버튼 묶음에서 하나만 선택되게 하는 함수
function setupChips(groupId, onChange) {
  const chips = document.querySelectorAll('#' + groupId + ' .chip');
  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      chips.forEach(function (c) { c.classList.remove('active'); });
      chip.classList.add('active');
      onChange(chip.dataset.value);
      makePrompt();
    });
  });
}

setupChips('stepChips', function (value) { selectedStep = value; });
setupChips('levelChips', function (value) { selectedLevel = value; });

// 선택한 값으로 프롬프트 문장을 조립합니다
function makePrompt() {
  const step = stepText[selectedStep];
  const lines = [];

  lines.push('나는 ' + purposeSelect.value + ' 홈페이지를 만들고 싶어.');
  lines.push(step.title);
  lines.push('');
  lines.push('조건:');
  step.rules.forEach(function (rule) { lines.push('- ' + rule); });
  lines.push('- ' + selectedLevel + ' 수준으로 너무 복잡하지 않게 작성해줘.');
  if (commentCheck.checked) {
    lines.push('- 초보자가 이해할 수 있도록 주석을 달아줘.');
  }
  lines.push('- 결과는 코드 전체를 한 번에 보여줘.');

  promptResult.textContent = lines.join('\n');
}

purposeSelect.addEventListener('change', makePrompt);
commentCheck.addEventListener('change', makePrompt);
makePrompt(); // 처음 한 번 실행

// 복사 버튼
copyButton.addEventListener('click', function () {
  navigator.clipboard.writeText(promptResult.textContent).then(function () {
    copyButton.textContent = '복사했어요';
    setTimeout(function () { copyButton.textContent = '복사하기'; }, 1500);
  }).catch(function () {
    copyButton.textContent = '직접 선택해 복사해 주세요';
  });
});

// ---------- 4. 실습 단계 체크 + 진행률 ----------
const steps = document.querySelectorAll('.step');
const progressCount = document.getElementById('progressCount');
const progressFill = document.getElementById('progressFill');

function updateProgress() {
  const done = document.querySelectorAll('.step.done').length;
  progressCount.textContent = done;
  progressFill.style.width = (done / steps.length * 100) + '%';
}

steps.forEach(function (step) {
  step.addEventListener('click', function () {
    step.classList.toggle('done');   // 누를 때마다 체크/해제
    updateProgress();
  });
});

// ---------- 5. 푸터 연도 ----------
document.getElementById('year').textContent = new Date().getFullYear();
