import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
import {
  addDoc,
  collection,
  doc,
  getFirestore,
  onSnapshot,
  setDoc
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyC2IAgurX44nkiTkSLMRjVEe6hCPLarQGA",
  authDomain: "ibkeri-team-sme.firebaseapp.com",
  projectId: "ibkeri-team-sme",
  storageBucket: "ibkeri-team-sme.firebasestorage.app",
  messagingSenderId: "528354283514",
  appId: "1:528354283514:web:61517916ea841af4609e43"
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const meetingCollection = collection(db, "meetingMinutes");
const issueCollection = collection(db, "weeklyIssues");

const ko = {
  admin: "\uad00\ub9ac\uc790",
  choi: "\ucd5c\uc815\ud6c8",
  loggedIn: "\ub85c\uadf8\uc778 \uc911",
  badLogin: "ID \ub610\ub294 \ube44\ubc00\ubc88\ud638\ub97c \ud655\uc778\ud574\uc8fc\uc138\uc694.",
  saved: "\uac8c\uc2dc\uae00\uc774 \ub4f1\ub85d\ub418\uc5c8\uc2b5\ub2c8\ub2e4.",
  participantRequired: "\ucc38\uc5ec\uc790\ub97c 1\uba85 \uc774\uc0c1 \uc120\ud0dd\ud574\uc8fc\uc138\uc694.",
  regular: "\uc815\uae30",
  occasional: "\uc218\uc2dc",
  allLab: "\uc5f0\uad6c\uc18c \uc804\uccb4",
  underHead: "\uc18c\uc7a5 \uc774\ud558",
  underDirector: "\uc2e4\uc7a5 \uc774\ud558",
  underTeamLead: "\ud300\uc7a5 \uc774\ud558"
};

const VALID_USERS = [
  { id: "admin", password: "admin1234", name: ko.admin, role: "admin" },
  { id: "43222", password: "43222", name: ko.choi, role: "admin" },
  { id: "24810", password: "24810", name: "\uc774\uc6b0\uc885", role: "member" },
  { id: "25360", password: "25360", name: "\ub0a8\uad81\uc124", role: "member" },
  { id: "44975", password: "44975", name: "\uc624\uc815\ud0dd", role: "member" },
  { id: "43343", password: "43343", name: "\uae40\ub0a8\ud76c", role: "member" },
  { id: "42128", password: "42128", name: "\uae40\uc218\uc601", role: "member" }
];

const TYPE_ONE_OPTIONS = [ko.regular, ko.occasional];
const TYPE_TWO_OPTIONS = [ko.allLab, ko.underHead, ko.underDirector, ko.underTeamLead];

let boardItems = [];

const loginView = document.querySelector("#loginView");
const boardView = document.querySelector("#boardView");
const loginForm = document.querySelector("#loginForm");
const loginError = document.querySelector("#loginError");
const loginBadge = document.querySelector("#loginBadge");
const logoutButton = document.querySelector("#logoutButton");
const newPostButton = document.querySelector("#newPostButton");
const cancelPostButton = document.querySelector("#cancelPostButton");
const backToListButton = document.querySelector("#backToListButton");
const editPostButton = document.querySelector("#editPostButton");
const menuListButton = document.querySelector("#menuListButton");
const menuCalendarButton = document.querySelector("#menuCalendarButton");
const menuIssueButton = document.querySelector("#menuIssueButton");
const boldButton = document.querySelector("#boldButton");
const prevMonthButton = document.querySelector("#prevMonthButton");
const nextMonthButton = document.querySelector("#nextMonthButton");
const boardRows = document.querySelector("#boardRows");
const boardList = document.querySelector("#boardList");
const calendarPanel = document.querySelector("#calendarPanel");
const issuePanel = document.querySelector("#issuePanel");
const issueRows = document.querySelector("#issueRows");
const addIssueRowButton = document.querySelector("#addIssueRowButton");
const issueSearchInput = document.querySelector("#issueSearchInput");
const issueCategoryFilter = document.querySelector("#issueCategoryFilter");
const calendarGrid = document.querySelector("#calendarGrid");
const calendarTitle = document.querySelector("#calendarTitle");
const viewHeading = document.querySelector("#viewHeading");
const detailPanel = document.querySelector("#detailPanel");
const searchInput = document.querySelector("#searchInput");
const categoryOne = document.querySelector("#categoryOne");
const categoryTwo = document.querySelector("#categoryTwo");
const postForm = document.querySelector("#postForm");
const postPanel = document.querySelector("#postPanel");
const postDate = document.querySelector("#postDate");
const postPeriod = document.querySelector("#postPeriod");
const postHour = document.querySelector("#postHour");
const postAuthor = document.querySelector("#postAuthor");
const postContent = document.querySelector("#postContent");
const contentFontSize = document.querySelector("#contentFontSize");
const contentColor = document.querySelector("#contentColor");
const postTypeOne = document.querySelector("#postTypeOne");
const postTypeTwo = document.querySelector("#postTypeTwo");
const participantChoices = document.querySelector("#participantChoices");
const formMessage = document.querySelector("#formMessage");
const emptyState = document.querySelector("#emptyState");
const detailDate = document.querySelector("#detailDate");
const detailTitle = document.querySelector("#detailTitle");
const detailTopic = document.querySelector("#detailTopic");
const detailTypeOne = document.querySelector("#detailTypeOne");
const detailTypeTwo = document.querySelector("#detailTypeTwo");
const detailAuthor = document.querySelector("#detailAuthor");
const detailParticipants = document.querySelector("#detailParticipants");
const detailContent = document.querySelector("#detailContent");

let editingPostId = null;
let currentCalendarDate = new Date();
const ISSUE_CATEGORY_OPTIONS = [
  "\uc785\ubc95",
  "\uc870\uc0ac",
  "\ud1b5\uacc4",
  "\uc5b8\ub860\ubcf4\ub3c4",
  "\uc815\ucc45",
  "\ubd84\uc11d",
  "\uae30\ud0c0"
];
let issueItems = [];

const tagColor = {
  [ko.regular]: "brown",
  [ko.occasional]: "brown",
  [ko.allLab]: "gray",
  [ko.underHead]: "red",
  [ko.underDirector]: "blue",
  [ko.underTeamLead]: "green"
};

function createIssueItem() {
  return {
    month: "1",
    week: "1",
    category: ISSUE_CATEGORY_OPTIONS[0],
    topic: "",
    organization: ""
  };
}

function normalizeMeetingPost(id, post) {
  const legacyDate = new Date(post.date);
  const hasLegacyDate = !Number.isNaN(legacyDate.getTime());
  const dateValue = post.dateValue || (hasLegacyDate ? getLocalDateValue(legacyDate) : post.date || "");
  const hour24 = hasLegacyDate ? legacyDate.getHours() : 9;
  const period = post.period || (hour24 >= 12 ? "PM" : "AM");
  const hour = post.hour || String(hour24 % 12 || 12);
  const author = post.authorName || VALID_USERS.find((user) => user.id === post.authorId)?.name || "";

  return {
    id,
    ...post,
    dateValue,
    period,
    hour,
    dateText: formatDateLabel(dateValue, period, hour) || post.dateText || "",
    authorName: author,
    content: post.content || "",
    contentFontSize: post.contentFontSize || "16",
    contentColor: post.contentColor || "#263442",
    participants: Array.isArray(post.participants) ? post.participants : []
  };
}

function normalizeIssueItem(id, item) {
  return {
    id,
    month: item.month || "1",
    week: item.week || "1",
    category: item.category || ISSUE_CATEGORY_OPTIONS[0],
    topic: item.topic || "",
    organization: item.organization || ""
  };
}

function startFirestoreListeners() {
  onSnapshot(meetingCollection, (snapshot) => {
    boardItems = snapshot.docs.map((item) => normalizeMeetingPost(item.id, item.data()));
    renderBoard();
    renderCalendar();
  }, (error) => {
    console.error("회의록을 불러오지 못했습니다.", error);
  });

  onSnapshot(issueCollection, (snapshot) => {
    issueItems = snapshot.docs.map((item) => normalizeIssueItem(item.id, item.data()));
    renderIssueRows();
  }, (error) => {
    console.error("주간이슈 컨텐츠를 불러오지 못했습니다.", error);
  });
}

function getCurrentUser() {
  return JSON.parse(sessionStorage.getItem("currentUser") || "null");
}

function setView(user) {
  if (user) {
    loginView.classList.add("hidden");
    boardView.classList.remove("hidden");
    const roleLabel = user.role === "admin" ? ko.admin : "\uc77c\ubc18";
    loginBadge.textContent = `${user.name} (${roleLabel}) ${ko.loggedIn}`;
    postAuthor.value = user.name;
    setDefaultDate();
    renderBoard();
    return;
  }

  loginView.classList.remove("hidden");
  boardView.classList.add("hidden");
  loginBadge.textContent = "";
  postAuthor.value = "";
}

function getLocalDateValue(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function setDefaultDate() {
  const now = new Date();
  postDate.value = getLocalDateValue(now);
  postPeriod.value = now.getHours() >= 12 ? "PM" : "AM";
  postHour.value = String(now.getHours() % 12 || 12);
}

function setPostFormOpen(isOpen) {
  postPanel.classList.toggle("hidden", !isOpen);
  newPostButton.setAttribute("aria-expanded", String(isOpen));
  newPostButton.textContent = isOpen ? "\uc791\uc131 \ub2eb\uae30" : "\uc0c8\ub85c \ub9cc\ub4e4\uae30";
  document.querySelector("#postFormTitle").textContent = editingPostId ? "\uac8c\uc2dc\uae00 \uc218\uc815" : "\uac8c\uc2dc\uae00 \uc791\uc131";

  if (isOpen) {
    if (!editingPostId) {
      setDefaultDate();
    }
    applyContentInputStyle();
    document.querySelector("#postTitle").focus();
  } else {
    formMessage.textContent = "";
  }
}

function clearPostForm() {
  editingPostId = null;
  postForm.reset();
  postAuthor.value = getCurrentUser()?.name || "";
  setDefaultDate();
  applyContentInputStyle();
  document.querySelector("#postFormTitle").textContent = "\uac8c\uc2dc\uae00 \uc791\uc131";
}

function fillPostForm(post) {
  editingPostId = post.id;
  postDate.value = post.dateValue || post.date;
  postPeriod.value = post.period || "AM";
  postHour.value = post.hour || "9";
  postAuthor.value = post.authorName || getCurrentUser()?.name || "";
  document.querySelector("#postTitle").value = post.title;
  document.querySelector("#postTopic").value = post.topic;
  postContent.value = post.content || "";
  contentFontSize.value = post.contentFontSize || "16";
  contentColor.value = post.contentColor || "#263442";
  postTypeOne.value = post.type1;
  postTypeTwo.value = post.type2;
  document.querySelectorAll('input[name="participants"]').forEach((checkbox) => {
    checkbox.checked = post.participants.includes(checkbox.value);
  });
  applyContentInputStyle();
}

function applyContentInputStyle() {
  postContent.style.fontSize = `${contentFontSize.value}px`;
  postContent.style.color = contentColor.value;
}

function showListView() {
  viewHeading.textContent = "\ud68c\uc758\ub85d - \ubaa9\ub85d";
  viewHeading.classList.remove("hidden");
  detailPanel.classList.add("hidden");
  calendarPanel.classList.add("hidden");
  issuePanel.classList.add("hidden");
  boardList.classList.remove("hidden");
  searchInput.closest(".controls").classList.remove("hidden");
  newPostButton.classList.remove("hidden");
  editPostButton.classList.add("hidden");
  menuListButton.classList.add("active");
  menuCalendarButton.classList.remove("active");
  menuIssueButton.classList.remove("active");
}

function showCalendarView() {
  viewHeading.textContent = "\ud68c\uc758\ub85d - \uce98\ub9b0\ub354";
  viewHeading.classList.remove("hidden");
  detailPanel.classList.add("hidden");
  boardList.classList.add("hidden");
  issuePanel.classList.add("hidden");
  searchInput.closest(".controls").classList.add("hidden");
  calendarPanel.classList.remove("hidden");
  newPostButton.classList.remove("hidden");
  editPostButton.classList.add("hidden");
  menuListButton.classList.remove("active");
  menuCalendarButton.classList.add("active");
  menuIssueButton.classList.remove("active");
  renderCalendar();
}

function showIssueView() {
  viewHeading.textContent = "\uc8fc\uac04\uc774\uc288 \ucee8\ud150\uce20 \uc815\ub9ac";
  viewHeading.classList.remove("hidden");
  detailPanel.classList.add("hidden");
  boardList.classList.add("hidden");
  calendarPanel.classList.add("hidden");
  searchInput.closest(".controls").classList.add("hidden");
  setPostFormOpen(false);
  postPanel.classList.add("hidden");
  issuePanel.classList.remove("hidden");
  newPostButton.classList.add("hidden");
  editPostButton.classList.add("hidden");
  menuListButton.classList.remove("active");
  menuCalendarButton.classList.remove("active");
  menuIssueButton.classList.add("active");
  renderIssueRows();
}

function showDetailView(postId) {
  const post = boardItems.find((item) => item.id === postId);
  if (!post) return;

  setPostFormOpen(false);
  viewHeading.classList.add("hidden");
  boardList.classList.add("hidden");
  calendarPanel.classList.add("hidden");
  issuePanel.classList.add("hidden");
  searchInput.closest(".controls").classList.add("hidden");
  newPostButton.classList.add("hidden");
  detailPanel.classList.remove("hidden");
  editPostButton.classList.toggle("hidden", post.authorId !== getCurrentUser()?.id);
  editPostButton.dataset.postId = post.id;

  detailDate.textContent = post.dateText;
  detailTitle.textContent = post.title;
  detailTopic.textContent = post.topic;
  detailTypeOne.replaceChildren(makeTag(post.type1));
  detailTypeTwo.replaceChildren(makeTag(post.type2));
  detailAuthor.textContent = post.authorName || "";
  detailParticipants.replaceChildren(makeParticipants(post.participants));
  detailContent.style.fontSize = `${post.contentFontSize || "16"}px`;
  detailContent.style.color = post.contentColor || "#263442";
  detailContent.innerHTML = renderMarkdown(post.content || "");
  backToListButton.focus();
}

function getPostDate(post) {
  const value = post.dateValue || post.date;
  const hour = Number(post.hour || 0);
  const hour24 = post.period === "PM" && hour < 12
    ? hour + 12
    : post.period === "AM" && hour === 12
      ? 0
      : hour;
  const paddedHour = String(hour24).padStart(2, "0");
  const date = new Date(value && value.length === 10 ? `${value}T${paddedHour}:00:00` : value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function sortPostsByRecent(posts) {
  return [...posts].sort((a, b) => {
    const dateA = getPostDate(a)?.getTime() || 0;
    const dateB = getPostDate(b)?.getTime() || 0;
    return dateB - dateA;
  });
}

function getDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function renderCalendar() {
  const year = currentCalendarDate.getFullYear();
  const month = currentCalendarDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const postsByDate = new Map();

  boardItems.forEach((post) => {
    const date = getPostDate(post);
    if (!date) return;
    const key = getDateKey(date);
    if (!postsByDate.has(key)) postsByDate.set(key, []);
    postsByDate.get(key).push(post);
  });

  calendarTitle.textContent = `${year}.${String(month + 1).padStart(2, "0")}`;
  calendarGrid.replaceChildren();

  for (let index = 0; index < firstDay.getDay(); index += 1) {
    const blank = document.createElement("div");
    blank.className = "calendar-day muted";
    calendarGrid.append(blank);
  }

  for (let day = 1; day <= lastDay.getDate(); day += 1) {
    const date = new Date(year, month, day);
    const key = getDateKey(date);
    const cell = document.createElement("div");
    cell.className = "calendar-day";

    const dayNumber = document.createElement("span");
    dayNumber.className = "calendar-day-number";
    dayNumber.textContent = day;
    cell.append(dayNumber);

    (postsByDate.get(key) || []).forEach((post) => {
      const button = document.createElement("button");
      button.className = `calendar-event ${tagColor[post.type2] || "blue"}`;
      button.type = "button";
      button.textContent = post.title;
      button.addEventListener("click", () => showDetailView(post.id));
      cell.append(button);
    });

    calendarGrid.append(cell);
  }
}

function makeOptionSelect(value, options, onChange) {
  const select = document.createElement("select");
  options.forEach((option) => {
    const item = document.createElement("option");
    item.value = option.value;
    item.textContent = option.label;
    select.append(item);
  });
  select.value = value;
  select.addEventListener("change", () => onChange(select.value));
  return select;
}

function makeIssueTextInput(value, onInput) {
  const input = document.createElement("input");
  input.type = "text";
  input.value = value;
  input.addEventListener("input", () => onInput(input.value));
  return input;
}

async function updateIssueItem(id, key, value) {
  issueItems = issueItems.map((item) => item.id === id ? { ...item, [key]: value } : item);
  try {
    await setDoc(doc(db, "weeklyIssues", id), { [key]: value }, { merge: true });
  } catch (error) {
    console.error("주간이슈 컨텐츠 저장에 실패했습니다.", error);
  }
  if (key === "week") {
    renderIssueRows();
  }
}

function getIssueGroupClass(item) {
  const week = Number(item.week || 0);
  return `issue-week-${week || 1}`;
}

function renderIssueRows() {
  const monthOptions = Array.from({ length: 12 }, (_, index) => ({
    value: String(index + 1),
    label: `${index + 1}\uc6d4`
  }));
  const weekOptions = Array.from({ length: 5 }, (_, index) => ({
    value: String(index + 1),
    label: `${index + 1}\uc8fc\ucc28`
  }));
  const categoryOptions = ISSUE_CATEGORY_OPTIONS.map((option) => ({ value: option, label: option }));

  const keyword = issueSearchInput.value.trim().toLowerCase();
  const categoryFilter = issueCategoryFilter.value;
  const filteredItems = issueItems.filter((item) => {
    const searchable = [item.topic, item.organization, item.category].join(" ").toLowerCase();
    return (!keyword || searchable.includes(keyword))
      && (!categoryFilter || item.category === categoryFilter);
  });

  issueRows.replaceChildren();
  filteredItems.forEach((item) => {
    const row = document.createElement("tr");
    row.className = getIssueGroupClass(item);

    const month = document.createElement("td");
    month.append(makeOptionSelect(item.month, monthOptions, (value) => updateIssueItem(item.id, "month", value)));

    const week = document.createElement("td");
    week.append(makeOptionSelect(item.week, weekOptions, (value) => updateIssueItem(item.id, "week", value)));

    const category = document.createElement("td");
    category.append(makeOptionSelect(item.category, categoryOptions, (value) => updateIssueItem(item.id, "category", value)));

    const topic = document.createElement("td");
    topic.append(makeIssueTextInput(item.topic, (value) => updateIssueItem(item.id, "topic", value)));

    const organization = document.createElement("td");
    organization.append(makeIssueTextInput(item.organization, (value) => updateIssueItem(item.id, "organization", value)));

    row.append(month, week, category, topic, organization);
    issueRows.append(row);
  });
}

function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function renderInlineMarkdown(value) {
  return escapeHtml(value)
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>");
}

function renderMarkdown(markdown) {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const html = [];
  let listOpen = false;

  lines.forEach((line) => {
    const trimmed = line.trim();
    const heading = trimmed.match(/^(#{1,3})\s+(.+)$/);
    const bullet = trimmed.match(/^[-*]\s+(.+)$/);

    if (!trimmed) {
      if (listOpen) {
        html.push("</ul>");
        listOpen = false;
      }
      return;
    }

    if (heading) {
      if (listOpen) {
        html.push("</ul>");
        listOpen = false;
      }
      const level = heading[1].length + 2;
      html.push(`<h${level}>${renderInlineMarkdown(heading[2])}</h${level}>`);
      return;
    }

    if (bullet) {
      if (!listOpen) {
        html.push("<ul>");
        listOpen = true;
      }
      html.push(`<li>${renderInlineMarkdown(bullet[1])}</li>`);
      return;
    }

    if (listOpen) {
      html.push("</ul>");
      listOpen = false;
    }
    html.push(`<p>${renderInlineMarkdown(line)}</p>`);
  });

  if (listOpen) {
    html.push("</ul>");
  }

  return html.join("");
}

function applyBoldToSelection() {
  const start = postContent.selectionStart;
  const end = postContent.selectionEnd;
  const selected = postContent.value.slice(start, end) || "\uad75\uac8c";
  const before = postContent.value.slice(0, start);
  const after = postContent.value.slice(end);
  const replacement = `**${selected}**`;

  postContent.value = `${before}${replacement}${after}`;
  postContent.focus();
  postContent.setSelectionRange(start + 2, start + 2 + selected.length);
}

function formatDateLabel(dateValue, period, hour) {
  if (!dateValue) return "";
  const date = new Date(`${dateValue}T00:00:00`);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const periodText = period === "PM" ? "\uc624\ud6c4" : "\uc624\uc804";
  return `${month}\uc6d4 ${day}\uc77c ${periodText} ${hour}\uc2dc`;
}

function splitDateLabel(dateText) {
  const match = dateText.match(/^(.+?\uc77c)\s+(.+)$/);
  return match ? [match[1], match[2]] : [dateText, ""];
}

function getInitials(name) {
  return name.slice(0, 1).toUpperCase();
}

function makeTag(text) {
  const tag = document.createElement("span");
  tag.className = `tag ${tagColor[text] || "blue"}`;
  tag.textContent = text;
  return tag;
}

function makeParticipants(people) {
  const wrap = document.createElement("div");
  wrap.className = "participants";

  people.forEach((name) => {
    const person = document.createElement("span");
    person.className = "person";

    const avatar = document.createElement("span");
    avatar.className = "avatar";
    avatar.textContent = getInitials(name);

    const label = document.createElement("span");
    label.textContent = name;

    person.append(avatar, label);
    wrap.append(person);
  });

  return wrap;
}

function appendOptions(select, options, includeAll) {
  if (includeAll) {
    const allOption = document.createElement("option");
    allOption.value = "";
    allOption.textContent = "\uc804\uccb4";
    select.append(allOption);
  }

  options.forEach((type) => {
    const option = document.createElement("option");
    option.value = type;
    option.textContent = type;
    select.append(option);
  });
}

function populateFormControls() {
  appendOptions(categoryOne, TYPE_ONE_OPTIONS, false);
  appendOptions(categoryTwo, TYPE_TWO_OPTIONS, false);
  appendOptions(postTypeOne, TYPE_ONE_OPTIONS, false);
  appendOptions(postTypeTwo, TYPE_TWO_OPTIONS, false);

  ISSUE_CATEGORY_OPTIONS.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    issueCategoryFilter.append(option);
  });

  VALID_USERS.filter((user) => user.id !== "admin").forEach((user) => {
    const label = document.createElement("label");
    label.className = "participant-choice";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.name = "participants";
    checkbox.value = user.name;

    const span = document.createElement("span");
    span.textContent = user.name;

    label.append(checkbox, span);
    participantChoices.append(label);
  });
}

function getFilteredItems() {
  const keyword = searchInput.value.trim().toLowerCase();
  const typeOne = categoryOne.value;
  const typeTwo = categoryTwo.value;

  const filtered = boardItems.filter((item) => {
    const searchable = [
      item.dateText,
      item.title,
      item.topic,
      item.content,
      item.authorName,
      item.type1,
      item.type2,
      item.participants.join(" ")
    ].join(" ").toLowerCase();

    return (!keyword || searchable.includes(keyword))
      && (!typeOne || item.type1 === typeOne)
      && (!typeTwo || item.type2 === typeTwo);
  });

  return sortPostsByRecent(filtered);
}

function renderBoard() {
  const items = getFilteredItems();
  boardRows.replaceChildren();

  items.forEach((item) => {
    const row = document.createElement("tr");
    row.className = tagColor[item.type2] || tagColor[item.type1] || "blue";

    const date = document.createElement("td");
    date.className = "date-cell";
    const [datePart, timePart] = splitDateLabel(item.dateText);
    const dateLine = document.createElement("span");
    dateLine.textContent = datePart;
    const timeLine = document.createElement("span");
    timeLine.className = "time-part";
    timeLine.textContent = `(${timePart})`;
    date.append(dateLine, timeLine);

    const title = document.createElement("td");
    title.className = "title-cell";
    const titleButton = document.createElement("button");
    titleButton.className = "link-button";
    titleButton.type = "button";
    titleButton.textContent = item.title;
    titleButton.addEventListener("click", () => showDetailView(item.id));
    title.append(titleButton);

    const topic = document.createElement("td");
    const topicButton = document.createElement("button");
    topicButton.className = "link-button topic-link";
    topicButton.type = "button";
    topicButton.textContent = item.topic;
    topicButton.addEventListener("click", () => showDetailView(item.id));
    topic.append(topicButton);

    const types = document.createElement("td");
    types.className = "type-cell";
    types.append(makeTag(item.type1));
    const divider = document.createElement("span");
    divider.className = "type-divider";
    divider.textContent = "/";
    types.append(divider, makeTag(item.type2));

    const author = document.createElement("td");
    author.className = "author-cell";
    author.textContent = item.authorName || "";

    row.append(date, title, topic, types, author);
    boardRows.append(row);
  });
  emptyState.classList.toggle("hidden", items.length > 0);
}

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(loginForm);
  const userId = String(formData.get("userId")).trim();
  const password = String(formData.get("password"));
  const user = VALID_USERS.find((item) => item.id === userId && item.password === password);

  if (!user) {
    loginError.textContent = ko.badLogin;
    return;
  }

  loginError.textContent = "";
  sessionStorage.setItem("currentUser", JSON.stringify(user));
  setView(user);
});

postForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(postForm);
  const participants = formData.getAll("participants").map(String);

  if (participants.length === 0) {
    formMessage.textContent = ko.participantRequired;
    return;
  }

  const post = {
    id: String(Date.now()),
    date: String(formData.get("date")),
    dateValue: String(formData.get("date")),
    period: String(formData.get("period")),
    hour: String(formData.get("hour")),
    dateText: formatDateLabel(String(formData.get("date")), String(formData.get("period")), String(formData.get("hour"))),
    title: String(formData.get("title")).trim(),
    topic: String(formData.get("topic")).trim(),
    content: String(formData.get("content")).trim(),
    contentFontSize: String(formData.get("contentFontSize")),
    contentColor: String(formData.get("contentColor")),
    type1: String(formData.get("type1")),
    type2: String(formData.get("type2")),
    participants,
    authorId: getCurrentUser()?.id || "",
    authorName: getCurrentUser()?.name || "",
    createdAt: new Date().toISOString()
  };

  try {
    if (editingPostId) {
      const existingPost = boardItems.find((item) => item.id === editingPostId);
      if (!existingPost || existingPost.authorId !== getCurrentUser()?.id) return;

      await setDoc(doc(db, "meetingMinutes", editingPostId), {
        date: post.date,
        dateValue: post.dateValue,
        period: post.period,
        hour: post.hour,
        dateText: post.dateText,
        title: post.title,
        topic: post.topic,
        content: post.content,
        contentFontSize: post.contentFontSize,
        contentColor: post.contentColor,
        type1: post.type1,
        type2: post.type2,
        participants: post.participants,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } else {
      await addDoc(meetingCollection, post);
    }
  } catch (error) {
    console.error("게시글 저장에 실패했습니다.", error);
    formMessage.textContent = "저장 권한 또는 Firebase 연결 상태를 확인해주세요.";
    return;
  }

  clearPostForm();
  formMessage.textContent = ko.saved;
  setPostFormOpen(false);
  showListView();
});

newPostButton.addEventListener("click", () => {
  if (postPanel.classList.contains("hidden")) {
    clearPostForm();
    setPostFormOpen(true);
    return;
  }
  setPostFormOpen(false);
});

cancelPostButton.addEventListener("click", () => {
  clearPostForm();
  setPostFormOpen(false);
});

editPostButton.addEventListener("click", () => {
  const post = boardItems.find((item) => item.id === editPostButton.dataset.postId);
  if (!post || post.authorId !== getCurrentUser()?.id) return;

  showListView();
  fillPostForm(post);
  setPostFormOpen(true);
});

backToListButton.addEventListener("click", showListView);

menuListButton.addEventListener("click", showListView);

menuCalendarButton.addEventListener("click", showCalendarView);

menuIssueButton.addEventListener("click", showIssueView);

boldButton.addEventListener("click", applyBoldToSelection);

prevMonthButton.addEventListener("click", () => {
  currentCalendarDate = new Date(currentCalendarDate.getFullYear(), currentCalendarDate.getMonth() - 1, 1);
  renderCalendar();
});

nextMonthButton.addEventListener("click", () => {
  currentCalendarDate = new Date(currentCalendarDate.getFullYear(), currentCalendarDate.getMonth() + 1, 1);
  renderCalendar();
});

addIssueRowButton.addEventListener("click", async () => {
  try {
    await addDoc(issueCollection, createIssueItem());
  } catch (error) {
    console.error("주간이슈 컨텐츠 행 추가에 실패했습니다.", error);
  }
});

[issueSearchInput, issueCategoryFilter].forEach((control) => {
  control.addEventListener("input", renderIssueRows);
});

logoutButton.addEventListener("click", () => {
  sessionStorage.removeItem("currentUser");
  loginForm.reset();
  showListView();
  setView(null);
});

[searchInput, categoryOne, categoryTwo].forEach((control) => {
  control.addEventListener("input", renderBoard);
});

[contentFontSize, contentColor].forEach((control) => {
  control.addEventListener("input", applyContentInputStyle);
});

populateFormControls();
applyContentInputStyle();
setView(getCurrentUser());
startFirestoreListeners();
