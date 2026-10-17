
/* =========================================================
   산업혁명 증언 수사국 | script.js (로컬 학습 / 시연 버전)
   - 기존 index.html 및 style.css에 맞춘 JavaScript
   - 같은 브라우저의 localStorage에 저장
   - 서로 다른 학생 기기 간 실시간 공유는 지원하지 않음
   - 실제 공개수업 공동 게시판은 Firebase 등 별도 연결 필요
   ========================================================= */

"use strict";

const STORAGE = {
  records: "why_industrial_records_v1",
  evidence: "why_industrial_evidence_v1",
  settings: "why_industrial_settings_v1",
  lastStudent: "why_industrial_last_student_v1"
};

const OPINIONS = {
  positive: "긍정적인 변화가 더 컸다",
  neutral: "아직 판단하기 어렵다",
  negative: "부정적인 변화가 더 컸다"
};

// 아래 글은 역사 기록의 '학습용 요약·재구성'입니다.
// 1차 사료 원문을 그대로 옮긴 직접 인용문이 아닙니다.
const SOURCES = {
  1: {
    code: "증언 파일 A",
    year: "1835년",
    name: "앤드루 유어",
    role: "공장제 생산과 기술 발전을 설명한 학자",
    avatar: "⚙️",
    text: "유어는 공장제 생산을 설명하며 증기기관과 기계가 사람의 힘을 대신해 더 많은 물건을 만들 수 있다고 보았다. 그는 생산 능력의 향상과 저렴한 상품의 공급을 기계 도입의 장점으로 평가하였다.",
    reference: "앤드루 유어, 『제조업의 철학』(1835). 학습용 요약·재구성(원문 직접 인용 아님).",
    referenceUrl: "https://sourcebooks.web.fordham.edu/mod/1835ure.asp",
    sampleFact: "기계와 증기기관을 이용한 공장제 생산이 생산량을 증가시키고 상품 가격을 낮추는 데 기여했다.",
    sampleMeaning: "생산과 경제 발전이라는 측면에서 산업혁명의 긍정적 변화를 보여준다."
  },
  2: {
    code: "증언 파일 B",
    year: "1832년",
    name: "엘리자베스 벤틀리",
    role: "어린 시절 공장에서 일했던 노동자",
    avatar: "🧵",
    text: "벤틀리는 의회 조사에서 어린 시절 공장에서 오랜 시간 일했던 경험을 진술하였다. 공장이 바쁠 때는 이른 아침부터 밤늦게까지 노동했고, 지각하면 임금이 깎이는 일도 있었다고 설명하였다.",
    reference: "엘리자베스 벤틀리, 영국 의회 새들러 위원회 증언(1832). 학습용 요약·재구성(원문 직접 인용 아님).",
    referenceUrl: "https://victorianweb.org/victorian/history/workers1.html",
    sampleFact: "아동 노동자가 장시간 일하고 지각에 따른 임금 공제를 경험하기도 했다.",
    sampleMeaning: "노동자의 처지에서 본 산업혁명의 어려움을 보여준다."
  },
  3: {
    code: "증언 파일 C",
    year: "1830년",
    name: "패니 켐블",
    role: "증기기관차를 타본 경험을 기록한 배우",
    avatar: "🚂",
    text: "켐블은 1830년 증기기관차를 타고 이동한 경험을 편지에 남겼다. 그는 새로운 기관차의 구조와 움직임을 자세히 묘사하고, 철도를 이용한 여행에서 느낀 놀라움과 감탄을 전하였다.",
    reference: "패니 켐블, 증기기관차 여행을 기록한 편지(1830). 학습용 요약·재구성(원문 직접 인용 아님).",
    referenceUrl: "https://www.bl.uk/collection-items/",
    sampleFact: "1830년대 사람들이 증기기관차를 직접 경험하고 그 변화에 놀라움을 나타냈다.",
    sampleMeaning: "교통 기술이 이동 경험을 바꾸었다는 사실을 보여준다."
  },
  4: {
    code: "증언 파일 D",
    year: "1836년",
    name: "영국 공장 감독관",
    role: "공장법 준수 여부를 조사한 감독관",
    avatar: "📋",
    text: "1836년 한 공장 감독관은 어린 노동자들에게 직접 질문하여 매우 긴 시간 일했다는 진술을 확보하였다. 감독관은 이를 확인하고 공장 경영자에게 법 위반의 심각성을 지적하였다. 공장법이 생긴 뒤에도 현장의 문제가 계속되었음을 보여준다.",
    reference: "영국 공장 감독관 보고서(1836), 영국 국립문서보관소 학습 자료. 학습용 요약·재구성(원문 직접 인용 아님).",
    referenceUrl: "https://www.nationalarchives.gov.uk/education/resources/1833-factory-act/source-1/",
    sampleFact: "아동 노동을 규제하는 법이 마련된 뒤에도 법을 어기는 공장이 존재했다.",
    sampleMeaning: "산업화로 생긴 문제를 해결하기 위해 국가의 감독이 필요했음을 보여준다."
  },
  5: {
    code: "증언 파일 E",
    year: "1816년",
    name: "로버트 오언",
    role: "뉴래너크 공장을 운영하며 개혁을 추진한 인물",
    avatar: "🏫",
    text: "오언은 뉴래너크에서 공장을 운영하면서 노동자의 생활과 아동 교육을 개선하려고 노력했다. 1816년에는 교육 기관의 개설을 알리며 사람의 성격과 삶에 교육 및 환경이 중요하다고 강조하였다.",
    reference: "로버트 오언, 뉴래너크 교육 기관 개설 연설(1816). 학습용 요약·재구성(원문 직접 인용 아님).",
    referenceUrl: "https://collections.soane.org/b5770",
    sampleFact: "일부 공장 경영자는 공장을 운영하면서 노동 환경과 교육을 개선하려 했다.",
    sampleMeaning: "공장제 생산과 노동자의 삶을 개선하려는 노력이 함께 나타날 수 있음을 보여준다."
  }
};

const SECRET = {
  title: "한 사료를 뒤집어 읽기 — 기계가 대신한 사람의 일",
  text: "앤드루 유어는 1835년 기계의 장점을 높이 평가하면서도, 기술 발전이 숙련된 노동자의 일을 기계나 숙련도가 낮은 노동으로 대체하고 임금 비용을 줄이는 방향으로 진행된다고 설명하였다. 생산량이 늘어나는 일이 모든 노동자에게 곧바로 이익이 되는 것일까?",
  reference: "앤드루 유어, 『제조업의 철학』(1835). 학습용 요약·재구성(원문 직접 인용 아님)."
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

let currentStudent = null;
let teacherMode = false;
let toastTimer = null;

function readJSON(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch (error) {
    console.warn("저장된 자료를 읽지 못했습니다:", error);
    return fallback;
  }
}

function writeJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error("저장하지 못했습니다:", error);
    alert("이 브라우저에 자료를 저장할 수 없습니다. 저장 공간 및 개인정보 보호 설정을 확인해 주세요.");
    return false;
  }
}

function getAllRecords() {
  const result = readJSON(STORAGE.records, {});
  return result && typeof result === "object" && !Array.isArray(result) ? result : {};
}

function getAllEvidence() {
  const result = readJSON(STORAGE.evidence, {});
  return result && typeof result === "object" && !Array.isArray(result) ? result : {};
}

function getSettings() {
  return {
    stage: 1,
    secretRevealed: false,
    ...readJSON(STORAGE.settings, {})
  };
}

function newStudentRecord(id, group) {
  return {
    studentId: id,
    group,
    step: 1,
    firstOpinion: "",
    firstReason: "",
    analysisFact: "",
    analysisMeaning: "",
    analysisLimit: "",
    reviews: [],
    secretAnswer: "",
    finalOpinion: "",
    positiveEvidence: "",
    negativeEvidence: "",
    importantSource: "",
    finalJudgment: "",
    completed: false,
    updatedAt: new Date().toISOString()
  };
}

function studentKey(id, group) {
  // 같은 기기에서 번호가 같아도 모둠이 다르면 별도 기록
  return `${group}-${id}`;
}

function saveStudent() {
  if (!currentStudent) return false;
  currentStudent.updatedAt = new Date().toISOString();
  const records = getAllRecords();
  records[studentKey(currentStudent.studentId, currentStudent.group)] = currentStudent;
  return writeJSON(STORAGE.records, records);
}

function showToast(message, type = "") {
  const toast = $("#toast");
  if (!toast) return;
  toast.textContent = message;
  toast.className = `toast ${type}`.trim();
  toast.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { toast.hidden = true; }, 3000);
}

function showScreen(id) {
  ["start-screen", "student-screen", "teacher-screen"].forEach((screenId) => {
    const el = document.getElementById(screenId);
    if (el) el.hidden = screenId !== id;
  });
  $("#home-btn").hidden = id === "start-screen";
  window.scrollTo({ top: 0, behavior: "auto" });
}

function updateStudentHeading() {
  $("#student-info").hidden = !currentStudent || teacherMode;
  if (currentStudent && !teacherMode) {
    $("#student-info").textContent = `${currentStudent.group}모둠 · ${currentStudent.studentId}`;
  }
}

function showMission(step) {
  if (!currentStudent) return;
  teacherMode = false;
  showScreen("student-screen");
  const isComplete = step === 6;

  for (let n = 1; n <= 5; n++) {
    $(`#mission-${n}`).hidden = step !== n;
  }
  $("#complete-screen").hidden = !isComplete;

  $$(".progress-step").forEach((el) => {
    const n = Number(el.dataset.step);
    el.classList.toggle("active", !isComplete && n === step);
    el.classList.toggle("completed", isComplete || n < step);
  });

  if (step === 2) renderSource();
  if (step === 3) renderEvidenceBoard();
  if (step === 4) renderSecret();
  if (step === 6) renderSummary();
  updateStudentHeading();
  window.scrollTo({ top: 0, behavior: "auto" });
}

function moveTo(step) {
  if (!currentStudent) return;
  currentStudent.step = step;
  if (saveStudent()) showMission(step);
}

function selectedRadio(name) {
  return document.querySelector(`input[name="${name}"]:checked`)?.value || "";
}

function setRadio(name, value) {
  $$(`input[name="${name}"]`).forEach((input) => {
    input.checked = input.value === value;
  });
}

function textValue(id) {
  return $(id).value.trim();
}

function restoreStudentFields() {
  if (!currentStudent) return;
  const r = currentStudent;
  setRadio("first-opinion", r.firstOpinion);
  $("#first-reason").value = r.firstReason || "";
  $("#analysis-fact").value = r.analysisFact || "";
  $("#analysis-meaning").value = r.analysisMeaning || "";
  $("#analysis-limit").value = r.analysisLimit || "";
  $("#secret-answer").value = r.secretAnswer || "";
  setRadio("final-opinion", r.finalOpinion);
  $("#positive-evidence").value = r.positiveEvidence || "";
  $("#negative-evidence").value = r.negativeEvidence || "";
  $("#important-source").value = r.importantSource || "";
  $("#final-judgment").value = r.finalJudgment || "";
}

function enterStudent(event) {
  event.preventDefault();
  const id = textValue("#student-number");
  const group = Number($("#group-select").value);
  if (!/^[\p{L}\p{N}-]{2,12}$/u.test(id)) {
    return showToast("학생 번호는 2~12자의 문자·숫자로 입력하세요.", "error");
  }
  if (!SOURCES[group]) return showToast("모둠을 선택하세요.", "error");

  const records = getAllRecords();
  const key = studentKey(id, group);
  currentStudent = records[key] || newStudentRecord(id, group);
  teacherMode = false;
  if (!saveStudent()) return;
  writeJSON(STORAGE.lastStudent, { id, group });
  restoreStudentFields();
  showMission(currentStudent.completed ? 6 : Math.max(1, Math.min(5, currentStudent.step || 1)));
  showToast(`${group}모둠 역사 탐정으로 입장했습니다.`, "success");
}

function renderSource() {
  const source = SOURCES[currentStudent.group];
  $("#source-code").textContent = source.code;
  $("#source-year").textContent = source.year;
  $("#source-avatar").textContent = source.avatar;
  $("#source-name").textContent = source.name;
  $("#source-role").textContent = source.role;
  $("#source-text").textContent = source.text;
  $("#source-reference").textContent = source.reference;

  const evidence = getAllEvidence()[currentStudent.group];
  $("#group-evidence").value = evidence?.fact || "";
  $("#group-interpretation").value = evidence?.interpretation || "";
}

function submitFirstOpinion() {
  const opinion = selectedRadio("first-opinion");
  const reason = textValue("#first-reason");
  if (!opinion) return showToast("첫 번째 판단을 선택하세요.", "error");
  if (!reason) return showToast("그렇게 생각한 이유를 적어주세요.", "error");
  currentStudent.firstOpinion = opinion;
  currentStudent.firstReason = reason;
  moveTo(2);
}

function storeAnalysis() {
  const fact = textValue("#analysis-fact");
  const meaning = textValue("#analysis-meaning");
  const limit = textValue("#analysis-limit");
  if (!fact || !meaning || !limit) {
    showToast("세 가지 사료 분석 질문에 모두 답하세요.", "error");
    return false;
  }
  Object.assign(currentStudent, {
    analysisFact: fact,
    analysisMeaning: meaning,
    analysisLimit: limit
  });
  if (!saveStudent()) return false;
  showToast("개인 분석 기록을 저장했습니다.", "success");
  return true;
}

function submitGroupEvidence() {
  const fact = textValue("#group-evidence");
  const interpretation = textValue("#group-interpretation");
  if (!fact || !interpretation) {
    return showToast("모둠의 핵심 증거와 해석을 모두 적으세요.", "error");
  }
  const group = currentStudent.group;
  const allEvidence = getAllEvidence();
  if (allEvidence[group] && allEvidence[group].author !== currentStudent.studentId) {
    if (!confirm("이 기기에 저장된 같은 모둠의 기존 제출 내용이 있습니다. 덮어쓸까요?")) return;
  }
  allEvidence[group] = {
    group,
    author: currentStudent.studentId,
    fact,
    interpretation,
    updatedAt: new Date().toISOString()
  };
  if (writeJSON(STORAGE.evidence, allEvidence)) {
    showToast("이 기기에 모둠 증거를 저장했습니다.", "success");
  }
}

function makeElement(tag, className, content) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (content !== undefined) el.textContent = String(content);
  return el;
}

function appendText(parent, tag, className, content) {
  const el = makeElement(tag, className, content);
  parent.appendChild(el);
  return el;
}

function renderEvidenceBoard() {
  if (!currentStudent) return;
  const board = $("#evidence-board");
  const select = $("#review-group");
  board.replaceChildren();
  select.replaceChildren(new Option("모둠을 선택하세요", ""));

  const allEvidence = getAllEvidence();
  for (let group = 1; group <= 5; group++) {
    if (group === currentStudent.group) continue;
    const source = SOURCES[group];
    const submitted = allEvidence[group];

    const card = makeElement("article", "evidence-card");
    appendText(card, "span", "evidence-group", `${group}모둠 · ${source.name}`);
    appendText(card, "h3", "", source.code);
    appendText(card, "p", "", `사료 요약: ${source.text}`);

    if (submitted) {
      appendText(card, "p", "evidence-text", `이 기기에 제출된 근거: ${submitted.fact}`);
      appendText(card, "p", "evidence-interpretation", `제출된 해석: ${submitted.interpretation}`);
      appendText(card, "p", "source-reference", "※ 이 기기에 저장된 제출물입니다. 다른 태블릿과 자동 공유되지 않습니다.");
    } else {
      appendText(card, "p", "evidence-text", `참고 근거 예시: ${source.sampleFact}`);
      appendText(card, "p", "evidence-interpretation", `참고 해석 예시: ${source.sampleMeaning}`);
      appendText(card, "p", "source-reference", "※ 교사가 준비한 참고 예시입니다. 다른 모둠 학생의 실제 분석 결과가 아닙니다.");
    }
    board.appendChild(card);
    select.add(new Option(`${group}모둠 · ${source.name}`, String(group)));
  }
  renderMyReviews();
}

function submitReview() {
  const group = Number($("#review-group").value);
  const type = selectedRadio("review-type");
  const comment = textValue("#review-comment");
  if (!group || group === currentStudent.group) {
    return showToast("다른 모둠을 선택하세요.", "error");
  }
  if (!type) return showToast("검증 방식을 선택하세요.", "error");
  if (!comment) return showToast("검증 의견을 적으세요.", "error");

  currentStudent.reviews ||= [];
  currentStudent.reviews.push({
    group,
    type,
    comment,
    updatedAt: new Date().toISOString()
  });
  if (saveStudent()) {
    $("#review-comment").value = "";
    setRadio("review-type", "");
    renderMyReviews();
    showToast("검증 의견을 기록했습니다.", "success");
  }
}

function renderMyReviews() {
  const list = $("#my-review-list");
  list.replaceChildren();
  const reviews = currentStudent?.reviews || [];
  if (!reviews.length) {
    appendText(list, "p", "empty-message", "아직 제출한 검증 의견이 없습니다.");
    return;
  }
  const types = {
    question: "새로운 질문",
    support: "추가 근거",
    limit: "해석의 한계"
  };
  reviews.forEach((item) => {
    const div = makeElement("article", "review-item");
    appendText(div, "strong", "", `${item.group}모둠 · ${types[item.type] || "검증"}`);
    appendText(div, "p", "", item.comment);
    list.appendChild(div);
  });
}

function renderSecret() {
  const unlocked = !!getSettings().secretRevealed;
  $("#secret-title").textContent = SECRET.title;
  $("#secret-text").textContent = SECRET.text;
  $("#secret-reference").textContent = SECRET.reference;
  $("#secret-locked").hidden = unlocked;
  $("#secret-content").hidden = !unlocked;

  // 로컬 버전은 교사 기기에서 학생 기기로 공개 명령이 전달되지 않습니다.
  // 개별 기기에서도 실습을 완료할 수 있도록 수동 열기 기능을 제공합니다.
  if (!unlocked) {
    const locked = $("#secret-locked");
    locked.replaceChildren();
    appendText(locked, "p", "", "로컬 연습 모드에서는 교사의 공개 명령이 다른 기기로 전달되지 않습니다.");
    const button = makeElement("button", "btn btn-secondary", "연습 모드: 증거 열어보기");
    button.type = "button";
    button.addEventListener("click", () => {
      const settings = getSettings();
      settings.secretRevealed = true;
      if (writeJSON(STORAGE.settings, settings)) renderSecret();
    });
    locked.appendChild(button);
  }
}

function saveSecretAnswer() {
  if (!getSettings().secretRevealed) {
    showToast("먼저 새로운 증거를 확인하세요.", "error");
    return false;
  }
  const answer = textValue("#secret-answer");
  if (!answer) {
    showToast("새로운 증거에 대한 해석을 작성하세요.", "error");
    return false;
  }
  currentStudent.secretAnswer = answer;
  if (!saveStudent()) return false;
  showToast("새로운 증거 분석을 저장했습니다.", "success");
  return true;
}

function submitFinal() {
  const finalOpinion = selectedRadio("final-opinion");
  const positiveEvidence = textValue("#positive-evidence");
  const negativeEvidence = textValue("#negative-evidence");
  const importantSource = textValue("#important-source");
  const finalJudgment = textValue("#final-judgment");

  if (![finalOpinion, positiveEvidence, negativeEvidence, importantSource, finalJudgment].every(Boolean)) {
    return showToast("최종 판단과 네 가지 서술 항목을 모두 작성하세요.", "error");
  }
  Object.assign(currentStudent, {
    finalOpinion,
    positiveEvidence,
    negativeEvidence,
    importantSource,
    finalJudgment,
    completed: true,
    step: 6
  });
  if (saveStudent()) {
    showMission(6);
    showToast("역사 탐정 임무를 완료했습니다!", "success");
  }
}

function renderSummary() {
  const target = $("#judgment-summary");
  target.replaceChildren();
  if (!currentStudent) return;
  appendText(target, "h3", "", "나의 판단 변화");
  appendText(target, "p", "", `첫 판단: ${OPINIONS[currentStudent.firstOpinion] || "미응답"}`);
  appendText(target, "p", "", `최종 판단: ${OPINIONS[currentStudent.finalOpinion] || "미응답"}`);
  appendText(target, "p", "", `최종 평가: ${currentStudent.finalJudgment || ""}`);
}

function makePersonalText(r) {
  const source = SOURCES[r.group];
  const typeNames = { question: "질문", support: "근거 보완", limit: "해석의 한계" };
  return [
    "산업혁명 증언 수사국 | 나의 탐구 기록",
    `학생 코드: ${r.studentId} / ${r.group}모둠`,
    "",
    "[첫 판단]",
    `${OPINIONS[r.firstOpinion] || "미응답"}\n${r.firstReason || ""}`,
    "",
    `[우리 모둠 사료: ${source.name}]`,
    source.text,
    source.reference,
    "",
    `[사료에서 확인한 사실]\n${r.analysisFact || ""}`,
    `[나의 해석]\n${r.analysisMeaning || ""}`,
    `[사료의 한계]\n${r.analysisLimit || ""}`,
    "",
    "[다른 모둠 검증]",
    ...(r.reviews || []).map((x) => `${x.group}모둠 / ${typeNames[x.type]}: ${x.comment}`),
    "",
    `[새 증거 해석]\n${r.secretAnswer || ""}`,
    "",
    `[최종 판단]\n${OPINIONS[r.finalOpinion] || "미응답"}`,
    `[긍정 근거]\n${r.positiveEvidence || ""}`,
    `[부정 근거]\n${r.negativeEvidence || ""}`,
    `[가장 중요한 증언]\n${r.importantSource || ""}`,
    `[나의 평가]\n${r.finalJudgment || ""}`,
    "",
    "※ 사료 본문은 역사 기록의 학습용 요약·재구성입니다."
  ].join("\n");
}

function downloadFile(filename, data, mimeType) {
  const blob = new Blob([data], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function downloadPersonalRecord() {
  if (!currentStudent) return;
  const name = `산업혁명_탐구기록_${currentStudent.group}모둠_${currentStudent.studentId}.txt`;
  downloadFile(name, "\uFEFF" + makePersonalText(currentStudent), "text/plain;charset=utf-8");
}

function enterTeacher() {
  // 주의: 이 화면은 보안 인증이 없는 로컬 시연용입니다.
  // 학생 응답 전체를 관리하는 실제 교사 권한은 서버 측 인증이 필요합니다.
  teacherMode = true;
  showScreen("teacher-screen");
  updateStudentHeading();
  renderTeacher();
  showToast("교사용 로컬 시연 화면입니다. 다른 기기 응답은 표시되지 않습니다.");
}

function createChart(targetId, records, field) {
  const target = $(targetId);
  target.replaceChildren();
  const total = records.length;
  const items = [
    ["positive", "긍정"],
    ["neutral", "판단 유보"],
    ["negative", "부정"]
  ];
  if (!total) {
    appendText(target, "p", "empty-message", "이 브라우저에 저장된 응답이 없습니다.");
    return;
  }
  items.forEach(([value, label]) => {
    const count = records.filter((r) => r[field] === value).length;
    const percentage = Math.round((count / total) * 100);
    const row = makeElement("div", "chart-row");
    const title = makeElement("div", "chart-label");
    appendText(title, "span", "", label);
    appendText(title, "span", "", `${count}명 (${percentage}%)`);
    row.appendChild(title);
    const track = makeElement("div", "chart-track");
    const bar = makeElement("div", `chart-bar ${value}`);
    bar.style.width = `${percentage}%`;
    track.appendChild(bar);
    row.appendChild(track);
    target.appendChild(row);
  });
}

function renderTeacher() {
  const records = Object.values(getAllRecords());
  $("#stat-students").textContent = String(records.length);
  $("#stat-analysis").textContent = String(records.filter((r) => r.analysisFact && r.analysisMeaning && r.analysisLimit).length);
  $("#stat-review").textContent = String(records.filter((r) => (r.reviews || []).length).length);
  $("#stat-final").textContent = String(records.filter((r) => r.completed).length);

  const settings = getSettings();
  $("#teacher-stage").value = String(settings.stage);
  $("#secret-status").textContent = settings.secretRevealed
    ? "현재 상태: 이 브라우저에서 공개됨"
    : "현재 상태: 이 브라우저에서 비공개";
  $("#reveal-secret").textContent = settings.secretRevealed
    ? "🔒 이 브라우저에서 다시 비공개"
    : "🔓 이 브라우저에서 비밀 증거 공개";

  const board = $("#teacher-evidence-board");
  board.replaceChildren();
  const evidence = getAllEvidence();
  for (let group = 1; group <= 5; group++) {
    const card = makeElement("article", "evidence-card");
    appendText(card, "span", "evidence-group", `${group}모둠`);
    appendText(card, "h3", "", SOURCES[group].name);
    if (evidence[group]) {
      appendText(card, "p", "evidence-text", evidence[group].fact);
      appendText(card, "p", "evidence-interpretation", evidence[group].interpretation);
    } else {
      appendText(card, "p", "empty-message", "이 브라우저에 제출된 모둠 증거가 없습니다.");
    }
    board.appendChild(card);
  }

  createChart("#first-opinion-chart", records.filter((r) => r.firstOpinion), "firstOpinion");
  createChart("#final-opinion-chart", records.filter((r) => r.finalOpinion), "finalOpinion");
}

function changeStage() {
  const settings = getSettings();
  settings.stage = Number($("#teacher-stage").value);
  if (writeJSON(STORAGE.settings, settings)) {
    showToast("이 브라우저의 수업 단계 설정만 변경했습니다.", "success");
  }
}

function toggleSecret() {
  const settings = getSettings();
  settings.secretRevealed = !settings.secretRevealed;
  if (writeJSON(STORAGE.settings, settings)) {
    renderTeacher();
    showToast("비밀 증거 상태를 이 브라우저에서 변경했습니다.", "success");
  }
}

function csvCell(value) {
  // Excel 수식 삽입 방지: 사용자 입력이 =, +, -, @로 시작하면 문자로 취급
  let result = String(value ?? "").replace(/\r?\n/g, " ");
  if (/^\s*[=+\-@]/.test(result)) result = "'" + result;
  return `"${result.replace(/"/g, '""')}"`;
}

function exportData() {
  const records = Object.values(getAllRecords());
  if (!records.length) return showToast("이 브라우저에 저장된 학생 응답이 없습니다.", "error");
  const headers = [
    "학생코드", "모둠", "첫판단", "첫판단이유", "사료속사실",
    "사료해석", "사료의한계", "검증의견", "새증거해석",
    "최종판단", "긍정근거", "부정근거", "중요한증언",
    "최종평가", "완료여부", "마지막저장"
  ];
  const rows = records.map((r) => [
    r.studentId, r.group, OPINIONS[r.firstOpinion] || "", r.firstReason,
    r.analysisFact, r.analysisMeaning, r.analysisLimit,
    (r.reviews || []).map((v) => `${v.group}모둠: ${v.comment}`).join(" / "),
    r.secretAnswer, OPINIONS[r.finalOpinion] || "", r.positiveEvidence,
    r.negativeEvidence, r.importantSource, r.finalJudgment,
    r.completed ? "완료" : "진행중", r.updatedAt
  ]);
  const csv = [headers, ...rows].map((row) => row.map(csvCell).join(",")).join("\r\n");
  downloadFile("산업혁명_학습기록_로컬기기.csv", "\uFEFF" + csv, "text/csv;charset=utf-8");
  showToast("이 브라우저의 기록을 CSV로 저장했습니다.", "success");
}

function goHome() {
  // 홈 이동은 저장 데이터를 삭제하지 않음
  teacherMode = false;
  currentStudent = null;
  $("#student-info").hidden = true;
  showScreen("start-screen");
}

function bindEvents() {
  $("#login-form").addEventListener("submit", enterStudent);
  $("#home-btn").addEventListener("click", goHome);
  $("#teacher-login-btn").addEventListener("click", enterTeacher);
  $("#submit-first-opinion").addEventListener("click", submitFirstOpinion);
  $("#save-analysis").addEventListener("click", storeAnalysis);
  $("#submit-group-evidence").addEventListener("click", submitGroupEvidence);
  $("#go-mission-3").addEventListener("click", () => {
    if (storeAnalysis()) moveTo(3);
  });
  $("#submit-review").addEventListener("click", submitReview);
  $("#go-mission-4").addEventListener("click", () => {
    if (!(currentStudent.reviews || []).length) {
      return showToast("다른 모둠의 증거를 검증한 의견을 한 번 이상 제출하세요.", "error");
    }
    moveTo(4);
  });
  $("#save-secret-answer").addEventListener("click", saveSecretAnswer);
  $("#go-mission-5").addEventListener("click", () => {
    if (saveSecretAnswer()) moveTo(5);
  });
  $("#submit-final").addEventListener("click", submitFinal);
  $("#download-record").addEventListener("click", downloadPersonalRecord);
  $("#change-stage").addEventListener("click", changeStage);
  $("#reveal-secret").addEventListener("click", toggleSecret);
  $("#export-data").addEventListener("click", exportData);
}

function init() {
  bindEvents();
  showScreen("start-screen");
  const last = readJSON(STORAGE.lastStudent, null);
  if (last && typeof last.id === "string" && SOURCES[last.group]) {
    $("#student-number").value = last.id;
    $("#group-select").value = String(last.group);
  }
  console.info("산업혁명 증언 수사국: 로컬 시연 모드 (학생 기기 간 실시간 공유 미지원)");
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
