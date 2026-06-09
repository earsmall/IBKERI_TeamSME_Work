const firebaseConfig = {
  apiKey: "AIzaSyC2IAgurX44nkiTkSLMRjVEe6hCPLarQGA",
  authDomain: "ibkeri-team-sme.firebaseapp.com",
  projectId: "ibkeri-team-sme",
  storageBucket: "ibkeri-team-sme.firebasestorage.app",
  messagingSenderId: "528354283514",
  appId: "1:528354283514:web:61517916ea841af4609e43"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const meetingCollection = db.collection("meetingMinutes");
const workCollection = db.collection("workStatus");
const scheduleCollection = db.collection("schedules");
const memoCollection = db.collection("memos");
const adminRolesRef = db.collection("settings").doc("adminRoles");
const passwordSettingsRef = db.collection("settings").doc("passwords");
const userAccessRef = db.collection("settings").doc("userAccess");

function doc(database, collectionName, id) {
  return database.collection(collectionName).doc(id);
}

function setDoc(documentRef, data, options) {
  return documentRef.set(data, options);
}

function addDoc(collectionRef, data) {
  return collectionRef.add(data);
}

function deleteDoc(documentRef) {
  return documentRef.delete();
}

function getDoc(documentRef) {
  return documentRef.get();
}

function onSnapshot(reference, onNext, onError) {
  return reference.onSnapshot(onNext, onError);
}

const ko = {
  admin: "\uad00\ub9ac\uc790",
  choi: "\ucd5c\uc815\ud6c8",
  loggedIn: "\ub85c\uadf8\uc778 \uc911",
  badLogin: "\uc0ac\ubc88\uc744 \ud655\uc778\ud574\uc8fc\uc138\uc694.",
  loginDisabled: "\ub85c\uadf8\uc778 \uad8c\ud55c\uc774 \uc81c\uac70\ub41c \uc0ac\uc6a9\uc790\uc785\ub2c8\ub2e4.",
  badPassword: "\ube44\ubc00\ubc88\ud638\ub97c \ud655\uc778\ud574\uc8fc\uc138\uc694.",
  authFailed: "\uc778\uc99d \uc5f0\uacb0\uc5d0 \uc2e4\ud328\ud588\uc2b5\ub2c8\ub2e4. \uc7a0\uc2dc \ud6c4 \ub2e4\uc2dc \uc2dc\ub3c4\ud574\uc8fc\uc138\uc694.",
  passwordChanged: "\ube44\ubc00\ubc88\ud638\uac00 \ubcc0\uacbd\ub418\uc5c8\uc2b5\ub2c8\ub2e4.",
  passwordMismatch: "\uc0c8 \ube44\ubc00\ubc88\ud638\uac00 \uc11c\ub85c \ub2e4\ub985\ub2c8\ub2e4.",
  passwordTooShort: "\uc0c8 \ube44\ubc00\ubc88\ud638\ub294 4\uc790 \uc774\uc0c1\uc73c\ub85c \uc785\ub825\ud574\uc8fc\uc138\uc694.",
  saved: "\uac8c\uc2dc\uae00\uc774 \ub4f1\ub85d\ub418\uc5c8\uc2b5\ub2c8\ub2e4.",
  participantRequired: "\ucc38\uc5ec\uc790\ub97c 1\uba85 \uc774\uc0c1 \uc120\ud0dd\ud574\uc8fc\uc138\uc694.",
  allLab: "\uc5f0\uad6c\uc18c \uc804\uccb4",
  underHead: "\uc18c\uc7a5 \uc774\ud558",
  underDirector: "\uc2e4\uc7a5 \uc774\ud558",
  underTeamLead: "\ud300\uc7a5 \uc774\ud558"
};

const VALID_USERS = [
  { id: "admin", name: ko.admin, role: "admin" },
  { id: "43222", name: ko.choi, role: "admin" },
  { id: "24810", name: "\uc774\uc6b0\uc885", role: "member" },
  { id: "25360", name: "\ub0a8\uad81\uc124", role: "member" },
  { id: "44975", name: "\uc624\uc815\ud0dd", role: "member" },
  { id: "43343", name: "\uae40\ub0a8\ud76c", role: "member" },
  { id: "42128", name: "\uae40\uc218\uc601", role: "member" },
  { id: "22194", name: "\uc2ec\ud615\uc900", role: "member" }
];

const TYPE_OPTIONS = [ko.underHead, ko.underDirector, ko.underTeamLead];
const WORK_CATEGORY_OPTIONS = [
  "\uc5f0\uad6c\ubcf4\uace0\uc11c",
  "\uc815\uae30\ubcf4\uace0\uc11c",
  "\ube0c\ub9ac\ud504",
  "\uc804\ub9dd",
  "\uae30\ud0c0"
];
const WORK_STATUS_OPTIONS = [
  "\uc9c4\ud589",
  "\uc77c\uc2dc\uc911\uc9c0",
  "\ub300\uae30",
  "\ubcf4\ub958",
  "\uace0\ub824\uc911",
  "\uc644\ub8cc"
];
const WORK_DASHBOARD_STATUS_ORDER = WORK_STATUS_OPTIONS;
const SCHEDULE_CATEGORY_OPTIONS = [
  "\ud589\uc0ac",
  "\ud734\uac00",
  "\ud68c\uc758",
  "\uae30\ud0c0"
];

let boardItems = [];
let workItems = [];
let scheduleItems = [];
let memoItems = [];

const loginView = document.querySelector("#loginView");
const boardView = document.querySelector("#boardView");
const loginForm = document.querySelector("#loginForm");
const loginError = document.querySelector("#loginError");
const loginBadge = document.querySelector("#loginBadge");
const logoutButton = document.querySelector("#logoutButton");
const adminPageButton = document.querySelector("#adminPageButton");
const changePasswordButton = document.querySelector("#changePasswordButton");
const homeButton = document.querySelector("#homeButton");
const brandHomeButton = document.querySelector("#brandHomeButton");
const newPostButton = document.querySelector("#newPostButton");
const deleteSelectedButton = document.querySelector("#deleteSelectedButton");
const boardActions = document.querySelector("#boardActions");
const cancelPostButton = document.querySelector("#cancelPostButton");
const backToListButton = document.querySelector("#backToListButton");
const editPostButton = document.querySelector("#editPostButton");
const deletePostButton = document.querySelector("#deletePostButton");
const menuWorkDashboardButton = document.querySelector("#menuWorkDashboardButton");
const menuWorkListButton = document.querySelector("#menuWorkListButton");
const menuListButton = document.querySelector("#menuListButton");
const menuCalendarButton = document.querySelector("#menuCalendarButton");
const menuScheduleListButton = document.querySelector("#menuScheduleListButton");
const menuScheduleCalendarButton = document.querySelector("#menuScheduleCalendarButton");
const menuMemoListButton = document.querySelector("#menuMemoListButton");
const prevMonthButton = document.querySelector("#prevMonthButton");
const nextMonthButton = document.querySelector("#nextMonthButton");
const boardRows = document.querySelector("#boardRows");
const boardList = document.querySelector("#boardList");
const tableWrap = document.querySelector("#tableWrap");
const deleteSelectHeader = document.querySelector(".delete-select-header");
const selectAllPosts = document.querySelector("#selectAllPosts");
const workDeleteSelectHeader = document.querySelector(".work-delete-select-header");
const selectAllWorkItems = document.querySelector("#selectAllWorkItems");
const pagination = document.querySelector("#pagination");
const workDashboardPanel = document.querySelector("#workDashboardPanel");
const workListPanel = document.querySelector("#workListPanel");
const workFormPanel = document.querySelector("#workFormPanel");
const workForm = document.querySelector("#workForm");
const workFormTitle = document.querySelector("#workFormTitle");
const workStartDate = document.querySelector("#workStartDate");
const workEndDate = document.querySelector("#workEndDate");
const workNoStartDate = document.querySelector("#workNoStartDate");
const workNoEndDate = document.querySelector("#workNoEndDate");
const workAlwaysOn = document.querySelector("#workAlwaysOn");
const workTitle = document.querySelector("#workTitle");
const workAssigneeChoices = document.querySelector("#workAssigneeChoices");
const workStatus = document.querySelector("#workStatus");
const workCategory = document.querySelector("#workCategory");
const workRows = document.querySelector("#workRows");
const workEmptyState = document.querySelector("#workEmptyState");
const workFormMessage = document.querySelector("#workFormMessage");
const cancelWorkButton = document.querySelector("#cancelWorkButton");
const workFilters = document.querySelector("#workFilters");
const workFilterStartDate = document.querySelector("#workFilterStartDate");
const workFilterEndDate = document.querySelector("#workFilterEndDate");
const workFilterAssignee = document.querySelector("#workFilterAssignee");
const workFilterStatus = document.querySelector("#workFilterStatus");
const workFilterCategory = document.querySelector("#workFilterCategory");
const scheduleFormPanel = document.querySelector("#scheduleFormPanel");
const scheduleForm = document.querySelector("#scheduleForm");
const scheduleFormTitle = document.querySelector("#scheduleFormTitle");
const scheduleStartDate = document.querySelector("#scheduleStartDate");
const scheduleEndDate = document.querySelector("#scheduleEndDate");
const scheduleCategory = document.querySelector("#scheduleCategory");
const scheduleDescription = document.querySelector("#scheduleDescription");
const scheduleFormMessage = document.querySelector("#scheduleFormMessage");
const cancelScheduleButton = document.querySelector("#cancelScheduleButton");
const scheduleListPanel = document.querySelector("#scheduleListPanel");
const scheduleRows = document.querySelector("#scheduleRows");
const scheduleEmptyState = document.querySelector("#scheduleEmptyState");
const scheduleDeleteSelectHeader = document.querySelector(".schedule-delete-select-header");
const selectAllSchedules = document.querySelector("#selectAllSchedules");
const scheduleCalendarPanel = document.querySelector("#scheduleCalendarPanel");
const scheduleCalendarGrid = document.querySelector("#scheduleCalendarGrid");
const scheduleCalendarTitle = document.querySelector("#scheduleCalendarTitle");
const prevScheduleMonthButton = document.querySelector("#prevScheduleMonthButton");
const nextScheduleMonthButton = document.querySelector("#nextScheduleMonthButton");
const memoFormPanel = document.querySelector("#memoFormPanel");
const memoForm = document.querySelector("#memoForm");
const memoFormTitle = document.querySelector("#memoFormTitle");
const memoTitle = document.querySelector("#memoTitle");
const memoContent = document.querySelector("#memoContent");
const memoFormMessage = document.querySelector("#memoFormMessage");
const cancelMemoButton = document.querySelector("#cancelMemoButton");
const memoListPanel = document.querySelector("#memoListPanel");
const memoRows = document.querySelector("#memoRows");
const memoEmptyState = document.querySelector("#memoEmptyState");
const memoDeleteSelectHeader = document.querySelector(".memo-delete-select-header");
const selectAllMemos = document.querySelector("#selectAllMemos");
const memoDetailPanel = document.querySelector("#memoDetailPanel");
const deleteMemoButton = document.querySelector("#deleteMemoButton");
const editMemoButton = document.querySelector("#editMemoButton");
const backToMemoListButton = document.querySelector("#backToMemoListButton");
const memoDetailDate = document.querySelector("#memoDetailDate");
const memoDetailTitle = document.querySelector("#memoDetailTitle");
const memoDetailAuthor = document.querySelector("#memoDetailAuthor");
const memoDetailContent = document.querySelector("#memoDetailContent");
const calendarPanel = document.querySelector("#calendarPanel");
const adminPanel = document.querySelector("#adminPanel");
const adminRows = document.querySelector("#adminRows");
const saveAdminRolesButton = document.querySelector("#saveAdminRolesButton");
const adminMessage = document.querySelector("#adminMessage");
const calendarGrid = document.querySelector("#calendarGrid");
const calendarTitle = document.querySelector("#calendarTitle");
const viewHeading = document.querySelector("#viewHeading");
const detailPanel = document.querySelector("#detailPanel");
const workDetailPanel = document.querySelector("#workDetailPanel");
const deleteWorkButton = document.querySelector("#deleteWorkButton");
const editWorkButton = document.querySelector("#editWorkButton");
const backToWorkListButton = document.querySelector("#backToWorkListButton");
const workDetailPeriod = document.querySelector("#workDetailPeriod");
const workDetailTitle = document.querySelector("#workDetailTitle");
const workDetailCategory = document.querySelector("#workDetailCategory");
const workDetailStatus = document.querySelector("#workDetailStatus");
const workDetailAssignees = document.querySelector("#workDetailAssignees");
const workDetailAuthor = document.querySelector("#workDetailAuthor");
const workUpdateForm = document.querySelector("#workUpdateForm");
const workUpdateDate = document.querySelector("#workUpdateDate");
const workUpdateContent = document.querySelector("#workUpdateContent");
const workUpdateRows = document.querySelector("#workUpdateRows");
const workUpdateEmpty = document.querySelector("#workUpdateEmpty");
const searchInput = document.querySelector("#searchInput");
const startDateFilter = document.querySelector("#startDateFilter");
const endDateFilter = document.querySelector("#endDateFilter");
const categoryTwo = document.querySelector("#categoryTwo");
const postForm = document.querySelector("#postForm");
const postPanel = document.querySelector("#postPanel");
const postDate = document.querySelector("#postDate");
const postPeriod = document.querySelector("#postPeriod");
const postHour = document.querySelector("#postHour");
const postAuthor = document.querySelector("#postAuthor");
const postContent = document.querySelector("#postContent");
const markdownControls = document.querySelectorAll("[data-markdown-action]");
const postTypeTwo = document.querySelector("#postTypeTwo");
const participantChoices = document.querySelector("#participantChoices");
const formMessage = document.querySelector("#formMessage");
const emptyState = document.querySelector("#emptyState");
const detailDate = document.querySelector("#detailDate");
const detailTitle = document.querySelector("#detailTitle");
const detailTopic = document.querySelector("#detailTopic");
const detailTypeTwo = document.querySelector("#detailTypeTwo");
const detailAuthor = document.querySelector("#detailAuthor");
const detailParticipants = document.querySelector("#detailParticipants");
const detailContent = document.querySelector("#detailContent");
const deleteConfirmModal = document.querySelector("#deleteConfirmModal");
const confirmDeleteYes = document.querySelector("#confirmDeleteYes");
const confirmDeleteNo = document.querySelector("#confirmDeleteNo");
const passwordModal = document.querySelector("#passwordModal");
const passwordForm = document.querySelector("#passwordForm");
const passwordMessage = document.querySelector("#passwordMessage");
const cancelPasswordButton = document.querySelector("#cancelPasswordButton");

let editingPostId = null;
let editingWorkId = null;
let editingScheduleId = null;
let editingMemoId = null;
let activeView = "work-dashboard";
let workDetailReturnView = "work-list";
let currentCalendarDate = new Date();
let currentScheduleCalendarDate = new Date();
let adminRoleMap = {};
let passwordHashMap = {};
let disabledUserIds = [];
let firestoreUnsubscribers = [];
let pendingDeleteAction = null;
let currentWorkDetailId = null;
let currentBoardPage = 1;
const BOARD_PAGE_SIZE = 20;

const tagColor = {
  [ko.underHead]: "red",
  [ko.underDirector]: "blue",
  [ko.underTeamLead]: "green"
};

function normalizeType(value) {
  return value === ko.allLab ? ko.underHead : value || ko.underHead;
}

function normalizeDateValue(value) {
  if (!value) return "";
  if (/^\d{2}-\d{2}-\d{2}$/.test(value)) {
    return `20${value}`;
  }
  return value;
}

function normalizeMeetingPost(id, post) {
  const legacyDate = new Date(post.date);
  const hasLegacyDate = !Number.isNaN(legacyDate.getTime());
  const dateValue = normalizeDateValue(post.dateValue || (hasLegacyDate ? getLocalDateValue(legacyDate) : post.date || ""));
  const hour24 = hasLegacyDate ? legacyDate.getHours() : 9;
  const period = post.period || (hour24 >= 12 ? "PM" : "AM");
  const hour = post.hour || String(hour24 % 12 || 12);
  const author = post.authorName || VALID_USERS.find((user) => user.id === post.authorId)?.name || "";

  return {
    ...post,
    id,
    legacyId: post.id || "",
    dateValue,
    period,
    hour,
    dateText: formatDateLabel(dateValue, period, hour) || post.dateText || "",
    authorName: author,
    content: post.content || "",
    contentFontSize: post.contentFontSize || "16",
    contentColor: post.contentColor || "#263442",
    type1: "",
    type2: normalizeType(post.type2),
    participants: Array.isArray(post.participants) ? post.participants : []
  };
}

function getUserName(userId) {
  if (userId === "team-sme") return "\uc911\uc18c\uae30\uc5c5\ud300";
  return VALID_USERS.find((user) => user.id === userId)?.name || "";
}

function isUserDisabled(userId) {
  return disabledUserIds.includes(userId);
}

function getActiveUsers() {
  return VALID_USERS.filter((user) => user.id !== "admin" && !isUserDisabled(user.id));
}

function getAssigneeIds(item) {
  if (Array.isArray(item.assigneeIds)) return item.assigneeIds;
  return item.assigneeId ? [item.assigneeId] : [];
}

function getAssigneeNames(item) {
  if (Array.isArray(item.assigneeNames)) return item.assigneeNames;
  return getAssigneeIds(item).map(getUserName).filter(Boolean);
}

function normalizeWorkItem(id, item) {
  const assigneeIds = getAssigneeIds(item);
  const assigneeNames = Array.isArray(item.assigneeNames) ? item.assigneeNames : assigneeIds.map(getUserName).filter(Boolean);
  const authorId = item.authorId || "";
  const updates = Array.isArray(item.updates)
    ? item.updates.map((update) => ({
      id: update.id || String(Date.now()),
      date: normalizeDateValue(update.date || ""),
      content: update.content || ""
    }))
    : [];
  return {
    id,
    startDate: normalizeDateValue(item.startDate || ""),
    endDate: normalizeDateValue(item.endDate || ""),
    noStartDate: Boolean(item.noStartDate || item.alwaysOn),
    noEndDate: Boolean(item.noEndDate),
    alwaysOn: Boolean(item.alwaysOn),
    title: item.title || "",
    assigneeId: assigneeIds[0] || "",
    assigneeIds,
    assigneeName: assigneeNames[0] || "",
    assigneeNames,
    status: item.status || WORK_STATUS_OPTIONS[0],
    category: item.category || WORK_CATEGORY_OPTIONS[0],
    authorId,
    authorName: item.authorName || getUserName(authorId),
    updates,
    createdAt: item.createdAt || ""
  };
}

function normalizeScheduleItem(id, item) {
  const authorId = item.authorId || "";
  return {
    id,
    startDate: normalizeDateValue(item.startDate || ""),
    endDate: normalizeDateValue(item.endDate || item.startDate || ""),
    category: item.category || SCHEDULE_CATEGORY_OPTIONS[0],
    description: item.description || "",
    authorId,
    authorName: item.authorName || getUserName(authorId),
    createdAt: item.createdAt || ""
  };
}

function normalizeMemoItem(id, item) {
  const authorId = item.authorId || "";
  return {
    id,
    title: item.title || "",
    content: item.content || "",
    authorId,
    authorName: item.authorName || getUserName(authorId),
    createdAt: item.createdAt || "",
    updatedAt: item.updatedAt || ""
  };
}

async function hashPassword(password) {
  const bytes = new TextEncoder().encode(password);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

async function loadPasswordSettings() {
  const snapshot = await getDoc(passwordSettingsRef);
  passwordHashMap = snapshot.exists ? snapshot.data().hashes || {} : {};
  return passwordHashMap;
}

async function loadUserAccessSettings() {
  const snapshot = await getDoc(userAccessRef);
  disabledUserIds = snapshot.exists ? snapshot.data().disabledUserIds || [] : [];
  return disabledUserIds;
}

async function isValidPassword(userId, password) {
  const storedHash = passwordHashMap[userId];
  if (!storedHash) return password === userId;
  return storedHash === await hashPassword(password);
}

async function saveUserPassword(userId, password) {
  const passwordHash = await hashPassword(password);
  passwordHashMap = { ...passwordHashMap, [userId]: passwordHash };
  await setDoc(passwordSettingsRef, {
    hashes: passwordHashMap,
    updatedAt: new Date().toISOString()
  }, { merge: true });
}

async function ensureAnonymousAuth() {
  if (auth.currentUser) return auth.currentUser;
  const credential = await auth.signInAnonymously();
  return credential.user;
}

function stopFirestoreListeners() {
  firestoreUnsubscribers.forEach((unsubscribe) => unsubscribe());
  firestoreUnsubscribers = [];
}

function startFirestoreListeners() {
  if (firestoreUnsubscribers.length > 0) return;

  firestoreUnsubscribers.push(onSnapshot(meetingCollection, (snapshot) => {
    boardItems = snapshot.docs.map((item) => normalizeMeetingPost(item.id, item.data()));
    snapshot.docs.forEach((item) => {
      if (item.data().type2 === ko.allLab) {
        setDoc(doc(db, "meetingMinutes", item.id), { type1: "", type2: ko.underHead }, { merge: true });
      }
      if (/^\d{2}-\d{2}-\d{2}$/.test(item.data().dateValue || "")) {
        setDoc(doc(db, "meetingMinutes", item.id), { dateValue: normalizeDateValue(item.data().dateValue) }, { merge: true });
      }
    });
    renderBoard();
    renderCalendar();
  }, (error) => {
    console.error("회의록을 불러오지 못했습니다.", error);
  }));

  firestoreUnsubscribers.push(onSnapshot(adminRolesRef, (snapshot) => {
    adminRoleMap = snapshot.exists ? snapshot.data().roles || {} : {};
    syncCurrentUserRole();
    renderAdminRows();
  }, (error) => {
    console.error("관리자 권한 정보를 불러오지 못했습니다.", error);
  }));

  firestoreUnsubscribers.push(onSnapshot(passwordSettingsRef, (snapshot) => {
    passwordHashMap = snapshot.exists ? snapshot.data().hashes || {} : {};
  }, (error) => {
    console.error("Failed to load password settings.", error);
  }));

  firestoreUnsubscribers.push(onSnapshot(userAccessRef, (snapshot) => {
    disabledUserIds = snapshot.exists ? snapshot.data().disabledUserIds || [] : [];
    const user = getCurrentUser();
    if (user && isUserDisabled(user.id)) {
      sessionStorage.removeItem("currentUser");
      stopFirestoreListeners();
      auth.signOut();
      loginForm.reset();
      setView(null);
      return;
    }
    renderAdminRows();
    renderUserChoices();
  }, (error) => {
    console.error("Failed to load user access settings.", error);
  }));

  firestoreUnsubscribers.push(onSnapshot(workCollection, (snapshot) => {
    workItems = snapshot.docs.map((item) => normalizeWorkItem(item.id, item.data()));
    renderWorkList();
    renderWorkDashboard();
  }, (error) => {
    console.error("Failed to load work status.", error);
  }));

  firestoreUnsubscribers.push(onSnapshot(scheduleCollection, (snapshot) => {
    scheduleItems = snapshot.docs.map((item) => normalizeScheduleItem(item.id, item.data()));
    renderScheduleList();
    renderScheduleCalendar();
  }, (error) => {
    console.error("Failed to load schedules.", error);
  }));

  firestoreUnsubscribers.push(onSnapshot(memoCollection, (snapshot) => {
    memoItems = snapshot.docs.map((item) => normalizeMemoItem(item.id, item.data()));
    renderMemoList();
  }, (error) => {
    console.error("Failed to load memos.", error);
  }));
}

function getCurrentUser() {
  return JSON.parse(sessionStorage.getItem("currentUser") || "null");
}

function getStoredUserRole(userId) {
  if (userId === "admin") return "admin";
  const baseUser = VALID_USERS.find((user) => user.id === userId);
  return adminRoleMap[userId] || baseUser?.role || "member";
}

function isAdminUser(user) {
  return Boolean(user && getStoredUserRole(user.id) === "admin");
}

function syncCurrentUserRole() {
  const user = getCurrentUser();
  if (!user) return;
  const syncedUser = { ...user, role: getStoredUserRole(user.id) };
  sessionStorage.setItem("currentUser", JSON.stringify(syncedUser));
  setView(syncedUser);
  if (!isAdminUser(syncedUser) && !adminPanel.classList.contains("hidden")) {
    showListView();
  }
}

function setView(user) {
  if (user) {
    const wasLoggedOut = boardView.classList.contains("hidden");
    loginView.classList.add("hidden");
    boardView.classList.remove("hidden");
    const roleLabel = isAdminUser(user) ? ko.admin : "\uc77c\ubc18";
    loginBadge.textContent = `${user.name} (${roleLabel}) ${ko.loggedIn}`;
    adminPageButton.classList.toggle("hidden", !isAdminUser(user));
    changePasswordButton.classList.remove("hidden");
    deleteSelectedButton.classList.toggle("hidden", !isAdminUser(user) || boardList.classList.contains("hidden"));
    postAuthor.value = user.name;
    setDefaultDate();
    if (wasLoggedOut) {
      showWorkDashboardView();
    }
    return;
  }

  loginView.classList.remove("hidden");
  boardView.classList.add("hidden");
  loginBadge.textContent = "";
  adminPageButton.classList.add("hidden");
  changePasswordButton.classList.add("hidden");
  deleteSelectedButton.classList.add("hidden");
  postAuthor.value = "";
}

function showWorkDashboardView() {
  activeView = "work-dashboard";
  hideMainPanels();
  viewHeading.textContent = "\uc5c5\ubb34 \ud604\ud669 - \ub300\uc26c\ubcf4\ub4dc";
  viewHeading.classList.remove("hidden");
  workFilters.classList.remove("hidden");
  workDashboardPanel.classList.remove("hidden");
  newPostButton.classList.add("hidden");
  setMenuActive(menuWorkDashboardButton);
  renderWorkDashboard();
}

function showWorkListView() {
  const user = getCurrentUser();
  activeView = "work-list";
  hideMainPanels();
  viewHeading.textContent = "\uc5c5\ubb34 \ud604\ud669 - \ubaa9\ub85d";
  viewHeading.classList.remove("hidden");
  boardActions.classList.remove("hidden");
  workFilters.classList.remove("hidden");
  workListPanel.classList.remove("hidden");
  newPostButton.classList.remove("hidden");
  deleteSelectedButton.classList.toggle("hidden", !isAdminUser(user));
  setMenuActive(menuWorkListButton);
  renderWorkList();
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
  postDate.value = normalizeDateValue(post.dateValue || post.date);
  postPeriod.value = post.period || "AM";
  postHour.value = post.hour || "9";
  postAuthor.value = post.authorName || getCurrentUser()?.name || "";
  document.querySelector("#postTitle").value = post.title;
  document.querySelector("#postTopic").value = post.topic;
  postContent.value = post.content || "";
  postTypeTwo.value = normalizeType(post.type2);
  document.querySelectorAll('input[name="participants"]').forEach((checkbox) => {
    checkbox.checked = post.participants.includes(checkbox.value);
  });
  applyContentInputStyle();
}

function setWorkFormOpen(isOpen) {
  workFormPanel.classList.toggle("hidden", !isOpen);
  newPostButton.setAttribute("aria-expanded", String(isOpen));
  newPostButton.textContent = isOpen ? "\uc791\uc131 \ub2eb\uae30" : "\uc0c8\ub85c \ub9cc\ub4e4\uae30";
  workFormTitle.textContent = editingWorkId ? "\uc5c5\ubb34 \ud604\ud669 \uc218\uc815" : "\uc5c5\ubb34 \ud604\ud669 \uc791\uc131";
  if (isOpen) workTitle.focus();
}

function syncWorkDateControls() {
  const isAlwaysOn = workAlwaysOn.checked;
  if (isAlwaysOn) {
    workNoStartDate.checked = true;
    workNoEndDate.checked = true;
    workStartDate.value = "";
    workEndDate.value = "";
  }

  workStartDate.disabled = isAlwaysOn || workNoStartDate.checked;
  workEndDate.disabled = isAlwaysOn || workNoEndDate.checked;

  if (workNoStartDate.checked) {
    workStartDate.value = "";
  }
  if (workNoEndDate.checked) {
    workEndDate.value = "";
  }
}

function clearWorkForm() {
  editingWorkId = null;
  workForm.reset();
  workStartDate.value = getLocalDateValue(new Date());
  workEndDate.value = getLocalDateValue(new Date());
  workNoStartDate.checked = false;
  workNoEndDate.checked = false;
  workAlwaysOn.checked = false;
  syncWorkDateControls();
  document.querySelectorAll('input[name="workAssignees"]').forEach((checkbox) => {
    checkbox.checked = false;
  });
  workFormMessage.textContent = "";
  workFormTitle.textContent = "\uc5c5\ubb34 \ud604\ud669 \uc791\uc131";
}

function fillWorkForm(item) {
  editingWorkId = item.id;
  workStartDate.value = normalizeDateValue(item.startDate);
  workEndDate.value = normalizeDateValue(item.endDate);
  workNoStartDate.checked = Boolean(item.noStartDate || item.alwaysOn);
  workNoEndDate.checked = Boolean(item.noEndDate);
  workAlwaysOn.checked = Boolean(item.alwaysOn);
  syncWorkDateControls();
  workTitle.value = item.title;
  const assigneeIds = getAssigneeIds(item);
  document.querySelectorAll('input[name="workAssignees"]').forEach((checkbox) => {
    checkbox.checked = assigneeIds.includes(checkbox.value);
  });
  workStatus.value = item.status;
  workCategory.value = item.category;
}

function setScheduleFormOpen(isOpen) {
  scheduleFormPanel.classList.toggle("hidden", !isOpen);
  newPostButton.setAttribute("aria-expanded", String(isOpen));
  newPostButton.textContent = isOpen ? "\uc791\uc131 \ub2eb\uae30" : "\uc0c8\ub85c \ub9cc\ub4e4\uae30";
  scheduleFormTitle.textContent = editingScheduleId ? "\uc77c\uc815 \uc218\uc815" : "\uc77c\uc815 \uc791\uc131";
  if (isOpen) scheduleDescription.focus();
}

function clearScheduleForm() {
  editingScheduleId = null;
  scheduleForm.reset();
  const today = getLocalDateValue(new Date());
  scheduleStartDate.value = today;
  scheduleEndDate.value = today;
  scheduleFormMessage.textContent = "";
  scheduleFormTitle.textContent = "\uc77c\uc815 \uc791\uc131";
}

function fillScheduleForm(item) {
  editingScheduleId = item.id;
  scheduleStartDate.value = normalizeDateValue(item.startDate);
  scheduleEndDate.value = normalizeDateValue(item.endDate || item.startDate);
  scheduleCategory.value = item.category;
  scheduleDescription.value = item.description;
}

function setMemoFormOpen(isOpen) {
  memoFormPanel.classList.toggle("hidden", !isOpen);
  newPostButton.setAttribute("aria-expanded", String(isOpen));
  newPostButton.textContent = isOpen ? "\uc791\uc131 \ub2eb\uae30" : "\uc0c8\ub85c \ub9cc\ub4e4\uae30";
  memoFormTitle.textContent = editingMemoId ? "\uba54\ubaa8 \uc218\uc815" : "\uba54\ubaa8 \uc791\uc131";
  if (isOpen) memoTitle.focus();
}

function clearMemoForm() {
  editingMemoId = null;
  memoForm.reset();
  memoFormMessage.textContent = "";
  memoFormTitle.textContent = "\uba54\ubaa8 \uc791\uc131";
}

function fillMemoForm(item) {
  editingMemoId = item.id;
  memoTitle.value = item.title;
  memoContent.value = item.content;
  memoFormMessage.textContent = "";
  memoFormTitle.textContent = "\uba54\ubaa8 \uc218\uc815";
}

function hideMainPanels() {
  workDashboardPanel.classList.add("hidden");
  workListPanel.classList.add("hidden");
  workFormPanel.classList.add("hidden");
  workFilters.classList.add("hidden");
  scheduleFormPanel.classList.add("hidden");
  scheduleListPanel.classList.add("hidden");
  scheduleCalendarPanel.classList.add("hidden");
  memoFormPanel.classList.add("hidden");
  memoListPanel.classList.add("hidden");
  memoDetailPanel.classList.add("hidden");
  detailPanel.classList.add("hidden");
  workDetailPanel.classList.add("hidden");
  calendarPanel.classList.add("hidden");
  adminPanel.classList.add("hidden");
  boardList.classList.add("hidden");
  searchInput.closest(".controls").classList.add("hidden");
  postPanel.classList.add("hidden");
  pagination.classList.add("hidden");
  boardActions.classList.add("hidden");
  deleteSelectedButton.classList.add("hidden");
  editPostButton.classList.add("hidden");
  deletePostButton.classList.add("hidden");
  editWorkButton.classList.add("hidden");
  deleteWorkButton.classList.add("hidden");
  editMemoButton.classList.add("hidden");
  deleteMemoButton.classList.add("hidden");
}

function setMenuActive(activeButton) {
  [menuWorkDashboardButton, menuWorkListButton, menuListButton, menuCalendarButton, menuScheduleListButton, menuScheduleCalendarButton, menuMemoListButton].forEach((button) => {
    button.classList.toggle("active", button === activeButton);
  });
}

function applyContentInputStyle() {
  postContent.style.fontSize = "16px";
  postContent.style.color = "#263442";
}

function replacePostContentSelection(nextValue, selectionStart, selectionEnd) {
  postContent.value = nextValue;
  postContent.focus();
  postContent.setSelectionRange(selectionStart, selectionEnd);
}

function wrapPostContentSelection(prefix, suffix = prefix, fallback = "text") {
  const start = postContent.selectionStart;
  const end = postContent.selectionEnd;
  const selected = postContent.value.slice(start, end) || fallback;
  const before = postContent.value.slice(0, start);
  const after = postContent.value.slice(end);
  const nextValue = `${before}${prefix}${selected}${suffix}${after}`;
  const nextStart = start + prefix.length;
  const nextEnd = nextStart + selected.length;
  replacePostContentSelection(nextValue, nextStart, nextEnd);
}

function prefixPostContentLines(prefix, fallback = "text") {
  const start = postContent.selectionStart;
  const end = postContent.selectionEnd;
  const selected = postContent.value.slice(start, end) || fallback;
  const before = postContent.value.slice(0, start);
  const after = postContent.value.slice(end);
  const prefixed = selected
    .split("\n")
    .map((line) => line.startsWith(prefix) ? line : `${prefix}${line}`)
    .join("\n");
  replacePostContentSelection(`${before}${prefixed}${after}`, start, start + prefixed.length);
}

function applyMarkdownAction(action) {
  if (action === "heading") {
    prefixPostContentLines("### ");
    return;
  }
  if (action === "bold") {
    wrapPostContentSelection("**");
    return;
  }
  if (action === "italic") {
    wrapPostContentSelection("*");
    return;
  }
  if (action === "list") {
    prefixPostContentLines("- ");
    return;
  }
  if (action === "code") {
    wrapPostContentSelection("`");
  }
}

function showListView() {
  const user = getCurrentUser();
  activeView = "meeting-list";
  hideMainPanels();
  viewHeading.textContent = "\ud68c\uc758\ub85d - \ubaa9\ub85d";
  viewHeading.classList.remove("hidden");
  boardActions.classList.remove("hidden");
  boardList.classList.remove("hidden");
  searchInput.closest(".controls").classList.remove("hidden");
  newPostButton.classList.remove("hidden");
  deleteSelectedButton.classList.toggle("hidden", !isAdminUser(user));
  setMenuActive(menuListButton);
  renderBoard();
}

function showCalendarView() {
  activeView = "meeting-calendar";
  hideMainPanels();
  viewHeading.textContent = "\ud68c\uc758\ub85d - \uce98\ub9b0\ub354";
  viewHeading.classList.remove("hidden");
  boardActions.classList.remove("hidden");
  calendarPanel.classList.remove("hidden");
  newPostButton.classList.remove("hidden");
  setMenuActive(menuCalendarButton);
  renderCalendar();
}

function showScheduleListView() {
  const user = getCurrentUser();
  activeView = "schedule-list";
  hideMainPanels();
  viewHeading.textContent = "\uc77c\uc815 - \ubaa9\ub85d";
  viewHeading.classList.remove("hidden");
  boardActions.classList.remove("hidden");
  scheduleListPanel.classList.remove("hidden");
  newPostButton.classList.remove("hidden");
  deleteSelectedButton.classList.toggle("hidden", !isAdminUser(user));
  setMenuActive(menuScheduleListButton);
  renderScheduleList();
}

function showScheduleCalendarView() {
  activeView = "schedule-calendar";
  hideMainPanels();
  viewHeading.textContent = "\uc77c\uc815 - \uce98\ub9b0\ub354";
  viewHeading.classList.remove("hidden");
  boardActions.classList.remove("hidden");
  scheduleCalendarPanel.classList.remove("hidden");
  newPostButton.classList.remove("hidden");
  setMenuActive(menuScheduleCalendarButton);
  renderScheduleCalendar();
}

function showMemoListView() {
  const user = getCurrentUser();
  activeView = "memo-list";
  hideMainPanels();
  viewHeading.textContent = "\uba54\ubaa8 - \ubaa9\ub85d";
  viewHeading.classList.remove("hidden");
  boardActions.classList.remove("hidden");
  memoListPanel.classList.remove("hidden");
  newPostButton.classList.remove("hidden");
  deleteSelectedButton.classList.toggle("hidden", !isAdminUser(user));
  setMenuActive(menuMemoListButton);
  renderMemoList();
}

function showAdminView() {
  const user = getCurrentUser();
  if (!isAdminUser(user)) return;

  viewHeading.textContent = "\uad00\ub9ac\uc790 \ud398\uc774\uc9c0";
  viewHeading.classList.remove("hidden");
  hideMainPanels();
  setPostFormOpen(false);
  adminPanel.classList.remove("hidden");
  newPostButton.classList.add("hidden");
  setMenuActive(null);
  renderAdminRows();
}

function showDetailView(postId) {
  const post = boardItems.find((item) => item.id === postId);
  if (!post) return;
  const user = getCurrentUser();
  const canDelete = isAdminUser(user) || post.authorId === user?.id || (!post.authorId && post.authorName === user?.name);

  setPostFormOpen(false);
  hideMainPanels();
  viewHeading.classList.add("hidden");
  detailPanel.classList.remove("hidden");
  editPostButton.classList.remove("hidden");
  editPostButton.dataset.postId = post.id;
  deletePostButton.classList.toggle("hidden", !canDelete);
  deletePostButton.dataset.postId = post.id;

  detailDate.textContent = post.dateText;
  detailTitle.textContent = post.title;
  detailTopic.textContent = post.topic;
  detailTypeTwo.replaceChildren(makeTag(normalizeType(post.type2)));
  detailAuthor.textContent = post.authorName || "";
  detailParticipants.replaceChildren(makeParticipants(post.participants));
  detailContent.style.fontSize = `${post.contentFontSize || "16"}px`;
  detailContent.style.color = post.contentColor || "#263442";
  detailContent.innerHTML = renderMarkdown(post.content || "");
  backToListButton.focus();
}

function showWorkDetailView(itemId) {
  const item = workItems.find((workItem) => workItem.id === itemId);
  if (!item) return;
  currentWorkDetailId = item.id;
  workDetailReturnView = activeView === "work-dashboard" ? "work-dashboard" : "work-list";
  const canEdit = canEditWorkItem(item);

  setWorkFormOpen(false);
  hideMainPanels();
  viewHeading.classList.add("hidden");
  workDetailPanel.classList.remove("hidden");
  editWorkButton.classList.toggle("hidden", !canEdit);
  editWorkButton.dataset.workId = item.id;
  deleteWorkButton.classList.toggle("hidden", !canDeleteWorkItem(item));
  deleteWorkButton.dataset.workId = item.id;
  workUpdateForm.classList.toggle("hidden", !canEdit);
  workUpdateForm.reset();
  delete workUpdateForm.dataset.editUpdateId;
  workUpdateDate.value = getLocalDateValue(new Date());

  workDetailPeriod.textContent = formatWorkPeriod(item);
  workDetailTitle.textContent = item.title;
  workDetailCategory.textContent = item.category;
  workDetailStatus.replaceChildren(makeStatusTag(item.status));
  workDetailAssignees.textContent = getAssigneeNames(item).join(", ");
  workDetailAuthor.textContent = item.authorName || "";
  renderWorkUpdates(item);
  backToWorkListButton.focus();
}

function showWorkDetailReturnView() {
  if (workDetailReturnView === "work-dashboard") {
    showWorkDashboardView();
    return;
  }
  showWorkListView();
}

function showMemoDetailView(itemId) {
  const item = memoItems.find((memo) => memo.id === itemId);
  if (!item) return;
  const canManage = canManageMemoItem(item);

  setMemoFormOpen(false);
  hideMainPanels();
  viewHeading.classList.add("hidden");
  memoDetailPanel.classList.remove("hidden");
  editMemoButton.classList.toggle("hidden", !canManage);
  editMemoButton.dataset.memoId = item.id;
  deleteMemoButton.classList.toggle("hidden", !canManage);
  deleteMemoButton.dataset.memoId = item.id;

  memoDetailDate.textContent = formatShortDate((item.createdAt || "").slice(0, 10));
  memoDetailTitle.textContent = item.title;
  memoDetailAuthor.textContent = item.authorName || "";
  memoDetailContent.textContent = item.content || "";
  backToMemoListButton.focus();
}

function getPostDate(post) {
  const value = normalizeDateValue(post.dateValue || post.date);
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
      button.className = `calendar-event ${tagColor[normalizeType(post.type2)] || "blue"}`;
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

function renderAdminRows() {
  if (!adminRows) return;

  const roleOptions = [
    { value: "member", label: "\uc77c\ubc18" },
    { value: "admin", label: "\uad00\ub9ac\uc790" }
  ];
  const accessOptions = [
    { value: "active", label: "\ub85c\uadf8\uc778 \uac00\ub2a5" },
    { value: "disabled", label: "\uc0ad\uc81c" }
  ];
  const teamUsers = VALID_USERS.filter((user) => user.id !== "admin");

  adminRows.replaceChildren();
  teamUsers.forEach((user) => {
    const row = document.createElement("tr");
    const id = document.createElement("td");
    const name = document.createElement("td");
    const role = document.createElement("td");
    const access = document.createElement("td");
    const select = makeOptionSelect(getStoredUserRole(user.id), roleOptions, () => {
      adminMessage.textContent = "";
    });
    const accessSelect = makeOptionSelect(isUserDisabled(user.id) ? "disabled" : "active", accessOptions, () => {
      adminMessage.textContent = "";
    });

    select.dataset.userId = user.id;
    accessSelect.dataset.accessUserId = user.id;
    id.textContent = user.id;
    name.textContent = user.name;
    row.classList.toggle("disabled-user-row", isUserDisabled(user.id));
    role.append(select);
    access.append(accessSelect);
    row.append(id, name, role, access);
    adminRows.append(row);
  });
}

async function saveAdminRoles() {
  const roles = {};
  adminRows.querySelectorAll("select[data-user-id]").forEach((select) => {
    roles[select.dataset.userId] = select.value;
  });
  const disabledIds = [];
  adminRows.querySelectorAll("select[data-access-user-id]").forEach((select) => {
    if (select.value === "disabled") {
      disabledIds.push(select.dataset.accessUserId);
    }
  });

  try {
    await Promise.all([
      setDoc(adminRolesRef, { roles, updatedAt: new Date().toISOString() }, { merge: true }),
      setDoc(userAccessRef, { disabledUserIds: disabledIds, updatedAt: new Date().toISOString() }, { merge: true })
    ]);
    adminMessage.textContent = "\uad00\ub9ac\uc790 \uad8c\ud55c\uacfc \ub85c\uadf8\uc778 \uad8c\ud55c\uc774 \uc800\uc7a5\ub418\uc5c8\uc2b5\ub2c8\ub2e4.";
  } catch (error) {
    console.error("관리자 권한 저장에 실패했습니다.", error);
    adminMessage.textContent = "\uc800\uc7a5 \uad8c\ud55c \ub610\ub294 Firebase \uc5f0\uacb0 \uc0c1\ud0dc\ub97c \ud655\uc778\ud574\uc8fc\uc138\uc694.";
  }
}

function getSelectedPostIds() {
  return Array.from(boardRows.querySelectorAll(".post-delete-checkbox:checked")).map((checkbox) => checkbox.value);
}

function getSelectedWorkIds() {
  return Array.from(workRows.querySelectorAll(".work-delete-checkbox:checked")).map((checkbox) => checkbox.value);
}

function getSelectedScheduleIds() {
  return Array.from(scheduleRows.querySelectorAll(".schedule-delete-checkbox:checked")).map((checkbox) => checkbox.value);
}

function getSelectedMemoIds() {
  return Array.from(memoRows.querySelectorAll(".memo-delete-checkbox:checked")).map((checkbox) => checkbox.value);
}

function getActiveBulkDeleteTarget() {
  if (activeView === "work-list") {
    return { collectionName: "workStatus", selectedIds: getSelectedWorkIds() };
  }

  if (activeView === "schedule-list") {
    return { collectionName: "schedules", selectedIds: getSelectedScheduleIds() };
  }

  if (activeView === "memo-list") {
    return { collectionName: "memos", selectedIds: getSelectedMemoIds() };
  }

  return { collectionName: "meetingMinutes", selectedIds: getSelectedPostIds() };
}

function refreshAfterDelete(collectionName, selectedIds) {
  const deleted = new Set(selectedIds);

  if (collectionName === "meetingMinutes") {
    boardItems = boardItems.filter((item) => !deleted.has(item.id));
    renderBoard();
    renderCalendar();
    return;
  }

  if (collectionName === "workStatus") {
    workItems = workItems.filter((item) => !deleted.has(item.id));
    renderWorkList();
    renderWorkDashboard();
    return;
  }

  if (collectionName === "schedules") {
    scheduleItems = scheduleItems.filter((item) => !deleted.has(item.id));
    renderScheduleList();
    renderScheduleCalendar();
    return;
  }

  if (collectionName === "memos") {
    memoItems = memoItems.filter((item) => !deleted.has(item.id));
    renderMemoList();
  }
}

function setDeleteConfirmOpen(isOpen) {
  deleteConfirmModal.classList.toggle("hidden", !isOpen);
  if (!isOpen) {
    pendingDeleteAction = null;
  }
  if (isOpen) {
    confirmDeleteYes.focus();
  }
}

function requestDelete(action) {
  pendingDeleteAction = action;
  setDeleteConfirmOpen(true);
}

function setPasswordModalOpen(isOpen) {
  passwordModal.classList.toggle("hidden", !isOpen);
  if (isOpen) {
    passwordForm.reset();
    passwordMessage.textContent = "";
    document.querySelector("#currentPassword").focus();
  }
}

async function deleteSelectedPosts(selectedIds, collectionName) {
  if (!isAdminUser(getCurrentUser())) {
    window.alert("\uad00\ub9ac\uc790\ub9cc \uc0ad\uc81c\ud560 \uc218 \uc788\uc2b5\ub2c8\ub2e4.");
    return;
  }
  if (selectedIds.length === 0) {
    window.alert("\uc0ad\uc81c\ud560 \ud56d\ubaa9\uc744 \uc120\ud0dd\ud574\uc8fc\uc138\uc694.");
    return;
  }

  try {
    await Promise.all(selectedIds.map((id) => db.collection(collectionName).doc(id).delete()));
    refreshAfterDelete(collectionName, selectedIds);
    setDeleteConfirmOpen(false);
    selectAllPosts.checked = false;
    selectAllWorkItems.checked = false;
    selectAllSchedules.checked = false;
    selectAllMemos.checked = false;
  } catch (error) {
    console.error("Failed to delete selected items.", error);
    window.alert("\uc0ad\uc81c\ud558\uc9c0 \ubabb\ud588\uc2b5\ub2c8\ub2e4. Firebase \uc5f0\uacb0 \ub610\ub294 \uad8c\ud55c\uc744 \ud655\uc778\ud574\uc8fc\uc138\uc694.");
  }
}

async function runPendingDelete() {
  if (pendingDeleteAction) {
    try {
      await pendingDeleteAction();
      setDeleteConfirmOpen(false);
    } catch (error) {
      console.error("Failed to delete item.", error);
      window.alert("\uc0ad\uc81c\ud558\uc9c0 \ubabb\ud588\uc2b5\ub2c8\ub2e4. Firebase \uc5f0\uacb0 \ub610\ub294 \uad8c\ud55c\uc744 \ud655\uc778\ud574\uc8fc\uc138\uc694.");
    }
    return;
  }

  const { selectedIds, collectionName } = getActiveBulkDeleteTarget();
  await deleteSelectedPosts(selectedIds, collectionName);
}

function renderPagination(totalItems) {
  const totalPages = Math.ceil(totalItems / BOARD_PAGE_SIZE);
  pagination.replaceChildren();
  pagination.classList.toggle("hidden", totalPages <= 1);
  if (totalPages <= 1) return;

  const prevButton = document.createElement("button");
  prevButton.type = "button";
  prevButton.textContent = "\uc774\uc804";
  prevButton.disabled = currentBoardPage === 1;
  prevButton.addEventListener("click", () => {
    currentBoardPage = Math.max(1, currentBoardPage - 1);
    renderBoard();
  });
  pagination.append(prevButton);

  for (let page = 1; page <= totalPages; page += 1) {
    const pageButton = document.createElement("button");
    pageButton.type = "button";
    pageButton.textContent = String(page);
    pageButton.classList.toggle("active", page === currentBoardPage);
    pageButton.setAttribute("aria-current", page === currentBoardPage ? "page" : "false");
    pageButton.addEventListener("click", () => {
      currentBoardPage = page;
      renderBoard();
    });
    pagination.append(pageButton);
  }

  const nextButton = document.createElement("button");
  nextButton.type = "button";
  nextButton.textContent = "\ub2e4\uc74c";
  nextButton.disabled = currentBoardPage === totalPages;
  nextButton.addEventListener("click", () => {
    currentBoardPage = Math.min(totalPages, currentBoardPage + 1);
    renderBoard();
  });
  pagination.append(nextButton);
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

function formatDateLabel(dateValue, period, hour) {
  if (!dateValue) return "";
  const date = new Date(`${normalizeDateValue(dateValue)}T00:00:00`);
  const year = String(date.getFullYear()).slice(-2);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const periodText = period === "PM" ? "\uc624\ud6c4" : "\uc624\uc804";
  return `${year}\ub144 ${month}\uc6d4 ${day}\uc77c ${periodText} ${hour}\uc2dc`;
}

function formatShortDate(dateValue) {
  if (!dateValue) return "";
  const date = new Date(`${normalizeDateValue(dateValue)}T00:00:00`);
  if (Number.isNaN(date.getTime())) return dateValue;
  const year = String(date.getFullYear()).slice(-2);
  return `${year}\ub144 ${date.getMonth() + 1}\uc6d4 ${date.getDate()}\uc77c`;
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

function makeStatusTag(status) {
  const tag = document.createElement("span");
  const classMap = {
    "\uc9c4\ud589": "red",
    "\uc77c\uc2dc\uc911\uc9c0": "yellow",
    "\ub300\uae30": "green",
    "\ubcf4\ub958": "gray",
    "\uace0\ub824\uc911": "purple",
    "\uc644\ub8cc": "blue"
  };
  tag.className = `status-tag ${classMap[status] || "gray"}`;
  tag.textContent = status;
  return tag;
}

function getWorkCategoryClass(category) {
  const classMap = {
    "\uc5f0\uad6c\ubcf4\uace0\uc11c": "red",
    "\uc815\uae30\ubcf4\uace0\uc11c": "green",
    "\ube0c\ub9ac\ud504": "blue",
    "\uc804\ub9dd": "yellow",
    "\uae30\ud0c0": "purple"
  };
  return classMap[category] || "purple";
}

function renderWorkUpdates(item) {
  const updates = [...(item.updates || [])].sort((a, b) => (normalizeDateValue(b.date) || "").localeCompare(normalizeDateValue(a.date) || ""));
  const canEdit = canEditWorkItem(item);
  workUpdateRows.replaceChildren();

  updates.forEach((update) => {
    const row = document.createElement("tr");
    const date = document.createElement("td");
    const content = document.createElement("td");
    const actions = document.createElement("td");

    date.textContent = formatShortDate(update.date);
    content.textContent = update.content;
    actions.className = "action-cell";

    if (canEdit) {
      const edit = document.createElement("button");
      edit.type = "button";
      edit.className = "small-action-button";
      edit.textContent = "\uc218\uc815";
      edit.addEventListener("click", () => {
        workUpdateDate.value = normalizeDateValue(update.date);
        workUpdateContent.value = update.content;
        workUpdateForm.dataset.editUpdateId = update.id;
        workUpdateContent.focus();
      });

      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "small-action-button danger";
      remove.textContent = "\uc0ad\uc81c";
      remove.addEventListener("click", async () => {
        if (!window.confirm("\uc0ad\uc81c\ud558\uc2dc\uaca0\uc2b5\ub2c8\uae4c?")) return;
        const nextUpdates = (item.updates || []).filter((savedUpdate) => savedUpdate.id !== update.id);
        await setDoc(doc(db, "workStatus", item.id), {
          updates: nextUpdates,
          updatedAt: new Date().toISOString()
        }, { merge: true });
        item.updates = nextUpdates;
        renderWorkUpdates(item);
      });

      actions.append(edit, remove);
    }

    row.append(date, content, actions);
    workUpdateRows.append(row);
  });

  workUpdateEmpty.classList.toggle("hidden", updates.length > 0);
}

function getScheduleCategoryClass(category) {
  const classMap = {
    "\ud589\uc0ac": "blue",
    "\ud734\uac00": "red",
    "\ud68c\uc758": "green",
    "\uae30\ud0c0": "purple"
  };
  return classMap[category] || "purple";
}

function formatWorkPeriod(item) {
  if (item.alwaysOn) return "\uc0c1\uc2dc";
  const start = formatWorkStartDate(item);
  const end = formatWorkEndDate(item);
  return `${start} ~ ${end}`;
}

function formatWorkStartDate(item) {
  if (item.alwaysOn) return "\uc0c1\uc2dc";
  if (item.noStartDate) return "\uc2dc\uc791\uc77c \uc5c6\uc74c";
  return formatShortDate(item.startDate);
}

function formatWorkEndDate(item) {
  if (item.alwaysOn) return "\uc0c1\uc2dc";
  if (item.noEndDate) return "\uc885\ub8cc\uc77c \uc5c6\uc74c";
  return formatShortDate(item.endDate);
}

function formatSchedulePeriod(item) {
  const start = formatShortDate(item.startDate);
  const end = formatShortDate(item.endDate || item.startDate);
  return start === end ? start : `${start} ~ ${end}`;
}

function renderWorkDashboard() {
  if (!workDashboardPanel) return;
  const sortedItems = getFilteredWorkItems().sort((a, b) => (normalizeDateValue(a.startDate) || "").localeCompare(normalizeDateValue(b.startDate) || ""));
  workDashboardPanel.replaceChildren();

  WORK_DASHBOARD_STATUS_ORDER.forEach((status) => {
    const section = document.createElement("section");
    section.className = "dashboard-status-section";
    const heading = document.createElement("h2");
    heading.append(makeStatusTag(status));
    section.append(heading);

    const cards = document.createElement("div");
    cards.className = "dashboard-card-grid";

    sortedItems.filter((item) => item.status === status).forEach((item) => {
      const card = document.createElement("article");
      card.className = "dashboard-work-card";

      const title = document.createElement("h3");
      const titleButton = document.createElement("button");
      titleButton.className = "dashboard-title-button";
      titleButton.type = "button";
      titleButton.textContent = item.title;
      titleButton.addEventListener("click", () => showWorkDetailView(item.id));
      title.append(titleButton);

      const category = document.createElement("p");
      category.className = `dashboard-meta category ${getWorkCategoryClass(item.category)}`;
      category.textContent = item.category;

      const assignees = document.createElement("p");
      assignees.className = "dashboard-meta";
      assignees.textContent = getAssigneeNames(item).join(", ");

      const period = document.createElement("p");
      period.className = "dashboard-meta period";
      period.textContent = formatWorkPeriod(item);

      card.append(title, category, assignees, period);
      cards.append(card);
    });

    if (!cards.children.length) {
      const empty = document.createElement("p");
      empty.className = "dashboard-empty";
      empty.textContent = "\ud574\ub2f9 \uc0c1\ud0dc\uc758 \uc5c5\ubb34\uac00 \uc5c6\uc2b5\ub2c8\ub2e4.";
      cards.append(empty);
    }

    section.append(cards);
    workDashboardPanel.append(section);
  });
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

function renderUserChoices() {
  if (!participantChoices || !workAssigneeChoices || !workFilterAssignee) return;

  participantChoices.replaceChildren();
  workAssigneeChoices.replaceChildren();
  workFilterAssignee.querySelectorAll("option:not(:first-child)").forEach((option) => option.remove());

  getActiveUsers().forEach((user) => {
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

  [
    { id: "team-sme", name: "\uc911\uc18c\uae30\uc5c5\ud300" },
    ...getActiveUsers()
  ].forEach((assignee) => {
    const label = document.createElement("label");
    label.className = "participant-choice";
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.name = "workAssignees";
    checkbox.value = assignee.id;
    const span = document.createElement("span");
    span.textContent = assignee.name;
    label.append(checkbox, span);
    workAssigneeChoices.append(label);

    const filterOption = document.createElement("option");
    filterOption.value = assignee.id;
    filterOption.textContent = assignee.name;
    workFilterAssignee.append(filterOption);
  });
}

function populateFormControls() {
  appendOptions(categoryTwo, TYPE_OPTIONS, false);
  appendOptions(postTypeTwo, TYPE_OPTIONS, false);
  appendOptions(workStatus, WORK_STATUS_OPTIONS, false);
  appendOptions(workCategory, WORK_CATEGORY_OPTIONS, false);
  appendOptions(workFilterStatus, WORK_STATUS_OPTIONS, false);
  appendOptions(workFilterCategory, WORK_CATEGORY_OPTIONS, false);
  appendOptions(scheduleCategory, SCHEDULE_CATEGORY_OPTIONS, false);
  renderUserChoices();
}

function getFilteredItems() {
  const keyword = searchInput.value.trim().toLowerCase();
  const startDate = startDateFilter.value;
  const endDate = endDateFilter.value;
  const typeTwo = categoryTwo.value;

  const filtered = boardItems.filter((item) => {
    const type = normalizeType(item.type2);
    const itemDate = normalizeDateValue(item.dateValue || item.date);
    const searchable = [
      item.dateText,
      item.title,
      item.topic,
      item.content,
      item.authorName,
      type,
      item.participants.join(" ")
    ].join(" ").toLowerCase();

    return (!keyword || searchable.includes(keyword))
      && (!startDate || itemDate >= startDate)
      && (!endDate || itemDate <= endDate)
      && (!typeTwo || type === typeTwo);
  });

  return sortPostsByRecent(filtered);
}

function renderBoard() {
  const items = getFilteredItems();
  const totalPages = Math.max(1, Math.ceil(items.length / BOARD_PAGE_SIZE));
  if (currentBoardPage > totalPages) {
    currentBoardPage = totalPages;
  }
  const pageStart = (currentBoardPage - 1) * BOARD_PAGE_SIZE;
  const pageItems = items.slice(pageStart, pageStart + BOARD_PAGE_SIZE);
  const canDelete = isAdminUser(getCurrentUser());
  tableWrap.classList.toggle("admin-delete-mode", canDelete);
  deleteSelectHeader.classList.toggle("hidden", !canDelete);
  selectAllPosts.checked = false;
  boardRows.replaceChildren();

  pageItems.forEach((item) => {
    const type = normalizeType(item.type2);
    const row = document.createElement("tr");
    row.className = "black";

    if (canDelete) {
      const selector = document.createElement("td");
      selector.className = "delete-select-cell";
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.className = "post-delete-checkbox";
      checkbox.value = item.id;
      checkbox.setAttribute("aria-label", `${item.title} \uc120\ud0dd`);
      selector.append(checkbox);
      row.append(selector);
    }

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
    types.append(makeTag(type));

    const author = document.createElement("td");
    author.className = "author-cell";
    author.textContent = item.authorName || "";

    row.append(date, title, topic, types, author);
    boardRows.append(row);
  });
  emptyState.classList.toggle("hidden", items.length > 0);
  renderPagination(items.length);
}

function canEditWorkItem(item) {
  const user = getCurrentUser();
  return Boolean(user) && (isAdminUser(user) || getAssigneeIds(item).includes(user.id) || getAssigneeIds(item).includes("team-sme"));
}

function canDeleteWorkItem(item) {
  const user = getCurrentUser();
  return Boolean(user) && (isAdminUser(user)
    || item.authorId === user?.id
    || (!item.authorId && item.authorName === user?.name)
    || (!item.authorId && getAssigneeIds(item).includes(user?.id))
    || getAssigneeIds(item).includes("team-sme"));
}

function getFilteredWorkItems() {
  const startDate = workFilterStartDate.value;
  const endDate = workFilterEndDate.value;
  const assignee = workFilterAssignee.value;
  const status = workFilterStatus.value;
  const category = workFilterCategory.value;

  return workItems.filter((item) => {
    const itemStart = item.noStartDate || item.alwaysOn ? "0000-01-01" : normalizeDateValue(item.startDate);
    const itemEnd = item.noEndDate || item.alwaysOn ? "9999-12-31" : normalizeDateValue(item.endDate || item.startDate);
    return (!startDate || itemEnd >= startDate)
      && (!endDate || itemStart <= endDate)
      && (!assignee || getAssigneeIds(item).includes(assignee))
      && (!status || item.status === status)
      && (!category || item.category === category);
  });
}

function renderWorkList() {
  if (!workRows) return;
  const sortedItems = getFilteredWorkItems().sort((a, b) => (normalizeDateValue(b.startDate) || "").localeCompare(normalizeDateValue(a.startDate) || ""));
  const canDelete = isAdminUser(getCurrentUser());
  workDeleteSelectHeader.classList.toggle("hidden", !canDelete);
  selectAllWorkItems.checked = false;
  workRows.replaceChildren();

  sortedItems.forEach((item) => {
    const row = document.createElement("tr");
    row.className = "black";

    if (canDelete) {
      const selector = document.createElement("td");
      selector.className = "delete-select-cell";
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.className = "work-delete-checkbox";
      checkbox.value = item.id;
      checkbox.setAttribute("aria-label", `${item.title} \uc120\ud0dd`);
      selector.append(checkbox);
      row.append(selector);
    }

    const start = document.createElement("td");
    start.textContent = formatWorkStartDate(item);

    const end = document.createElement("td");
    end.textContent = formatWorkEndDate(item);

    const title = document.createElement("td");
    title.className = "title-cell";
    const button = document.createElement("button");
    button.className = "link-button";
    button.type = "button";
    button.textContent = item.title;
    button.addEventListener("click", () => showWorkDetailView(item.id));
    title.append(button);

    const assignee = document.createElement("td");
    assignee.textContent = getAssigneeNames(item).join(", ");

    const status = document.createElement("td");
    status.append(makeStatusTag(item.status));

    const category = document.createElement("td");
    category.textContent = item.category;

    row.append(start, end, title, assignee, status, category);
    workRows.append(row);
  });

  workEmptyState.classList.toggle("hidden", sortedItems.length > 0);
}

function canManageScheduleItem(item) {
  const user = getCurrentUser();
  return isAdminUser(user) || item.authorId === user?.id;
}

function canManageMemoItem(item) {
  const user = getCurrentUser();
  return isAdminUser(user) || item.authorId === user?.id;
}

function renderScheduleList() {
  if (!scheduleRows) return;
  const sortedItems = [...scheduleItems].sort((a, b) => (normalizeDateValue(b.startDate) || "").localeCompare(normalizeDateValue(a.startDate) || ""));
  const canDelete = isAdminUser(getCurrentUser());
  scheduleDeleteSelectHeader.classList.toggle("hidden", !canDelete);
  selectAllSchedules.checked = false;
  scheduleRows.replaceChildren();

  sortedItems.forEach((item) => {
    const row = document.createElement("tr");
    row.className = "black";

    if (canDelete) {
      const selector = document.createElement("td");
      selector.className = "delete-select-cell";
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.className = "schedule-delete-checkbox";
      checkbox.value = item.id;
      checkbox.setAttribute("aria-label", `${item.description} \uc120\ud0dd`);
      selector.append(checkbox);
      row.append(selector);
    }

    const date = document.createElement("td");
    date.textContent = formatSchedulePeriod(item);

    const category = document.createElement("td");
    const categoryTag = document.createElement("span");
    categoryTag.className = `schedule-category-tag ${getScheduleCategoryClass(item.category)}`;
    categoryTag.textContent = item.category;
    category.append(categoryTag);

    const description = document.createElement("td");
    description.textContent = item.description;

    const actions = document.createElement("td");
    actions.className = "action-cell";
    if (canManageScheduleItem(item)) {
      const edit = document.createElement("button");
      edit.type = "button";
      edit.className = "small-action-button";
      edit.textContent = "\uc218\uc815";
      edit.addEventListener("click", () => {
        showScheduleListView();
        fillScheduleForm(item);
        setScheduleFormOpen(true);
      });

      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "small-action-button danger";
      remove.textContent = "\uc0ad\uc81c";
      remove.addEventListener("click", async () => {
        if (!window.confirm("\uc0ad\uc81c\ud558\uc2dc\uaca0\uc2b5\ub2c8\uae4c?")) return;
        await deleteDoc(doc(db, "schedules", item.id));
      });
      actions.append(edit, remove);
    }

    row.append(date, category, description, actions);
    scheduleRows.append(row);
  });

  scheduleEmptyState.classList.toggle("hidden", sortedItems.length > 0);
}

function renderMemoList() {
  if (!memoRows) return;
  const sortedItems = [...memoItems].sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
  const canDelete = isAdminUser(getCurrentUser());
  memoDeleteSelectHeader.classList.toggle("hidden", !canDelete);
  selectAllMemos.checked = false;
  memoRows.replaceChildren();

  sortedItems.forEach((item) => {
    const row = document.createElement("tr");
    row.className = "black";

    if (canDelete) {
      const selector = document.createElement("td");
      selector.className = "delete-select-cell";
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.className = "memo-delete-checkbox";
      checkbox.value = item.id;
      checkbox.setAttribute("aria-label", `${item.title} \uc120\ud0dd`);
      selector.append(checkbox);
      row.append(selector);
    }

    const title = document.createElement("td");
    title.className = "title-cell";
    const titleButton = document.createElement("button");
    titleButton.className = "link-button";
    titleButton.type = "button";
    titleButton.textContent = item.title;
    titleButton.addEventListener("click", () => showMemoDetailView(item.id));
    title.append(titleButton);

    const author = document.createElement("td");
    author.textContent = item.authorName || "";

    const created = document.createElement("td");
    created.textContent = formatShortDate((item.createdAt || "").slice(0, 10));

    row.append(title, author, created);
    memoRows.append(row);
  });

  memoEmptyState.classList.toggle("hidden", sortedItems.length > 0);
}

function renderScheduleCalendar() {
  if (!scheduleCalendarGrid) return;
  const year = currentScheduleCalendarDate.getFullYear();
  const month = currentScheduleCalendarDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  scheduleCalendarTitle.textContent = `${year}.${String(month + 1).padStart(2, "0")}`;
  scheduleCalendarGrid.replaceChildren();

  for (let i = 0; i < firstDay.getDay(); i += 1) {
    const empty = document.createElement("div");
    empty.className = "calendar-cell muted";
    scheduleCalendarGrid.append(empty);
  }

  for (let day = 1; day <= lastDay.getDate(); day += 1) {
    const date = new Date(year, month, day);
    const key = getDateKey(date);
    const cell = document.createElement("div");
    cell.className = "calendar-cell";
    const dayNumber = document.createElement("span");
    dayNumber.className = "day-number";
    dayNumber.textContent = String(day);
    cell.append(dayNumber);

    scheduleItems.filter((item) => {
      const start = normalizeDateValue(item.startDate);
      const end = normalizeDateValue(item.endDate || item.startDate);
      return key >= start && key <= end;
    }).forEach((item) => {
      const badge = document.createElement("button");
      badge.className = `calendar-event ${getScheduleCategoryClass(item.category)}`;
      badge.type = "button";
      badge.textContent = `${item.category} ${item.description}`;
      if (canManageScheduleItem(item)) {
        badge.addEventListener("click", () => {
          showScheduleListView();
          fillScheduleForm(item);
          setScheduleFormOpen(true);
        });
      }
      cell.append(badge);
    });

    scheduleCalendarGrid.append(cell);
  }
}

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(loginForm);
  const userId = String(formData.get("userId")).trim();
  const password = String(formData.get("password") || "");
  const user = VALID_USERS.find((item) => item.id === userId);

  if (!user) {
    loginError.textContent = ko.badLogin;
    return;
  }

  loginError.textContent = "";
  try {
    await ensureAnonymousAuth();
    await loadUserAccessSettings();
    if (isUserDisabled(user.id)) {
      loginError.textContent = ko.loginDisabled;
      return;
    }
    await loadPasswordSettings();
    if (!await isValidPassword(user.id, password)) {
      loginError.textContent = ko.badPassword;
      return;
    }
    startFirestoreListeners();
    const loginUser = { ...user, role: getStoredUserRole(user.id) };
    sessionStorage.setItem("currentUser", JSON.stringify(loginUser));
    setView(loginUser);
  } catch (error) {
    console.error("Failed to sign in anonymously.", error);
    loginError.textContent = ko.authFailed;
  }
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
    date: String(formData.get("date")),
    dateValue: String(formData.get("date")),
    period: String(formData.get("period")),
    hour: String(formData.get("hour")),
    dateText: formatDateLabel(String(formData.get("date")), String(formData.get("period")), String(formData.get("hour"))),
    title: String(formData.get("title")).trim(),
    topic: String(formData.get("topic")).trim(),
    content: String(formData.get("content")).trim(),
    contentFontSize: "16",
    contentColor: "#263442",
    type1: "",
    type2: normalizeType(String(formData.get("type2"))),
    participants,
    authorId: getCurrentUser()?.id || "",
    authorName: getCurrentUser()?.name || "",
    createdAt: new Date().toISOString()
  };

  try {
    if (editingPostId) {
      const existingPost = boardItems.find((item) => item.id === editingPostId);
      if (!existingPost) return;

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
        type1: "",
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

workForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(workForm);
  const assigneeIds = formData.getAll("workAssignees").map(String);
  if (assigneeIds.length === 0) {
    workFormMessage.textContent = "\ub2f4\ub2f9\uc790\ub97c 1\uba85 \uc774\uc0c1 \uc120\ud0dd\ud574\uc8fc\uc138\uc694.";
    return;
  }
  const alwaysOn = formData.get("alwaysOn") === "on";
  const noStartDate = alwaysOn || formData.get("noStartDate") === "on";
  const noEndDate = alwaysOn || formData.get("noEndDate") === "on";
  const startDate = noStartDate ? "" : normalizeDateValue(String(formData.get("startDate")));
  const endDate = noEndDate ? "" : normalizeDateValue(String(formData.get("endDate")));

  if (!noStartDate && !startDate) {
    workFormMessage.textContent = "\uc2dc\uc791\uc77c\uc744 \uc120\ud0dd\ud558\uac70\ub098 \uc2dc\uc791\uc77c \uc5c6\uc74c\uc744 \uc120\ud0dd\ud574\uc8fc\uc138\uc694.";
    return;
  }
  if (!noEndDate && !endDate) {
    workFormMessage.textContent = "\uc885\ub8cc\uc77c\uc744 \uc120\ud0dd\ud558\uac70\ub098 \uc885\ub8cc\uc77c \uc5c6\uc74c\uc744 \uc120\ud0dd\ud574\uc8fc\uc138\uc694.";
    return;
  }

  const workItem = {
    startDate,
    endDate,
    noStartDate,
    noEndDate,
    alwaysOn,
    title: String(formData.get("title")).trim(),
    assigneeId: assigneeIds[0],
    assigneeIds,
    assigneeName: getUserName(assigneeIds[0]),
    assigneeNames: assigneeIds.map(getUserName).filter(Boolean),
    status: String(formData.get("status")),
    category: String(formData.get("category")),
    authorId: getCurrentUser()?.id || "",
    authorName: getCurrentUser()?.name || "",
    createdAt: new Date().toISOString()
  };

  try {
    if (editingWorkId) {
      const existingItem = workItems.find((item) => item.id === editingWorkId);
      if (!existingItem || !canEditWorkItem(existingItem)) return;
      await setDoc(doc(db, "workStatus", editingWorkId), {
        startDate: workItem.startDate,
        endDate: workItem.endDate,
        noStartDate: workItem.noStartDate,
        noEndDate: workItem.noEndDate,
        alwaysOn: workItem.alwaysOn,
        title: workItem.title,
        assigneeId: workItem.assigneeId,
        assigneeIds: workItem.assigneeIds,
        assigneeName: workItem.assigneeName,
        assigneeNames: workItem.assigneeNames,
        status: workItem.status,
        category: workItem.category,
        updates: existingItem.updates || [],
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } else {
      await addDoc(workCollection, workItem);
    }
  } catch (error) {
    console.error("Failed to save work status.", error);
    workFormMessage.textContent = "저장 권한 또는 Firebase 연결 상태를 확인해주세요.";
    return;
  }

  clearWorkForm();
  setWorkFormOpen(false);
  showWorkListView();
});

workUpdateForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const item = workItems.find((workItem) => workItem.id === currentWorkDetailId);
  if (!item || !canEditWorkItem(item)) return;

  const formData = new FormData(workUpdateForm);
  const update = {
    id: workUpdateForm.dataset.editUpdateId || String(Date.now()),
    date: normalizeDateValue(String(formData.get("date"))),
    content: String(formData.get("content")).trim()
  };
  if (!update.date || !update.content) return;

  const updates = workUpdateForm.dataset.editUpdateId
    ? (item.updates || []).map((savedUpdate) => savedUpdate.id === update.id ? update : savedUpdate)
    : [...(item.updates || []), update];

  try {
    await setDoc(doc(db, "workStatus", item.id), {
      updates,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    item.updates = updates;
    renderWorkUpdates(item);
    workUpdateForm.reset();
    delete workUpdateForm.dataset.editUpdateId;
    workUpdateDate.value = getLocalDateValue(new Date());
    workUpdateContent.focus();
  } catch (error) {
    console.error("Failed to save work update.", error);
    window.alert("\uc9c4\ud589 \ud604\ud669\uc744 \uc800\uc7a5\ud558\uc9c0 \ubabb\ud588\uc2b5\ub2c8\ub2e4. Firebase \uc5f0\uacb0 \ub610\ub294 \uad8c\ud55c\uc744 \ud655\uc778\ud574\uc8fc\uc138\uc694.");
  }
});

memoForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const user = getCurrentUser();
  const formData = new FormData(memoForm);
  const memo = {
    title: String(formData.get("title")).trim(),
    content: String(formData.get("content")).trim(),
    authorId: user?.id || "",
    authorName: user?.name || "",
    createdAt: new Date().toISOString()
  };

  try {
    if (editingMemoId) {
      const existingMemo = memoItems.find((item) => item.id === editingMemoId);
      if (!existingMemo || !canManageMemoItem(existingMemo)) return;
      await setDoc(doc(db, "memos", editingMemoId), {
        title: memo.title,
        content: memo.content,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } else {
      await addDoc(memoCollection, memo);
    }
  } catch (error) {
    console.error("Failed to save memo.", error);
    memoFormMessage.textContent = "\uc800\uc7a5 \uad8c\ud55c \ub610\ub294 Firebase \uc5f0\uacb0 \uc0c1\ud0dc\ub97c \ud655\uc778\ud574\uc8fc\uc138\uc694.";
    return;
  }

  clearMemoForm();
  setMemoFormOpen(false);
  showMemoListView();
});

scheduleForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const user = getCurrentUser();
  const formData = new FormData(scheduleForm);
  const scheduleItem = {
    startDate: normalizeDateValue(String(formData.get("startDate"))),
    endDate: normalizeDateValue(String(formData.get("endDate"))),
    category: String(formData.get("category")),
    description: String(formData.get("description")).trim(),
    authorId: user?.id || "",
    authorName: user?.name || "",
    createdAt: new Date().toISOString()
  };

  try {
    if (editingScheduleId) {
      const existingItem = scheduleItems.find((item) => item.id === editingScheduleId);
      if (!existingItem || !canManageScheduleItem(existingItem)) return;
      await setDoc(doc(db, "schedules", editingScheduleId), {
        startDate: scheduleItem.startDate,
        endDate: scheduleItem.endDate,
        category: scheduleItem.category,
        description: scheduleItem.description,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } else {
      await addDoc(scheduleCollection, scheduleItem);
    }
  } catch (error) {
    console.error("Failed to save schedule.", error);
    scheduleFormMessage.textContent = "저장 권한 또는 Firebase 연결 상태를 확인해주세요.";
    return;
  }

  clearScheduleForm();
  setScheduleFormOpen(false);
  showScheduleListView();
});

newPostButton.addEventListener("click", () => {
  if (activeView === "memo-list") {
    if (memoFormPanel.classList.contains("hidden")) {
      clearMemoForm();
      setMemoFormOpen(true);
      return;
    }
    setMemoFormOpen(false);
    return;
  }

  if (activeView === "schedule-list" || activeView === "schedule-calendar") {
    if (scheduleFormPanel.classList.contains("hidden")) {
      clearScheduleForm();
      setScheduleFormOpen(true);
      return;
    }
    setScheduleFormOpen(false);
    return;
  }

  if (activeView === "work-list") {
    if (workFormPanel.classList.contains("hidden")) {
      clearWorkForm();
      setWorkFormOpen(true);
      return;
    }
    setWorkFormOpen(false);
    return;
  }

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

cancelWorkButton.addEventListener("click", () => {
  clearWorkForm();
  setWorkFormOpen(false);
});

cancelScheduleButton.addEventListener("click", () => {
  clearScheduleForm();
  setScheduleFormOpen(false);
});

cancelMemoButton.addEventListener("click", () => {
  clearMemoForm();
  setMemoFormOpen(false);
});

workNoStartDate.addEventListener("change", syncWorkDateControls);
workNoEndDate.addEventListener("change", syncWorkDateControls);
workAlwaysOn.addEventListener("change", syncWorkDateControls);

editPostButton.addEventListener("click", () => {
  const post = boardItems.find((item) => item.id === editPostButton.dataset.postId);
  if (!post) return;

  showListView();
  fillPostForm(post);
  setPostFormOpen(true);
});

deleteSelectedButton.addEventListener("click", () => {
  const { selectedIds, collectionName } = getActiveBulkDeleteTarget();
  if (selectedIds.length === 0) {
    window.alert("\uc0ad\uc81c\ud560 \ud56d\ubaa9\uc744 \uc120\ud0dd\ud574\uc8fc\uc138\uc694.");
    return;
  }
  requestDelete(() => deleteSelectedPosts(selectedIds, collectionName));
});

confirmDeleteYes.addEventListener("click", runPendingDelete);

confirmDeleteNo.addEventListener("click", () => setDeleteConfirmOpen(false));

deleteConfirmModal.addEventListener("click", (event) => {
  if (event.target === deleteConfirmModal) {
    setDeleteConfirmOpen(false);
  }
});

selectAllPosts.addEventListener("change", () => {
  boardRows.querySelectorAll(".post-delete-checkbox").forEach((checkbox) => {
    checkbox.checked = selectAllPosts.checked;
  });
});

selectAllWorkItems.addEventListener("change", () => {
  workRows.querySelectorAll(".work-delete-checkbox").forEach((checkbox) => {
    checkbox.checked = selectAllWorkItems.checked;
  });
});

selectAllSchedules.addEventListener("change", () => {
  scheduleRows.querySelectorAll(".schedule-delete-checkbox").forEach((checkbox) => {
    checkbox.checked = selectAllSchedules.checked;
  });
});

selectAllMemos.addEventListener("change", () => {
  memoRows.querySelectorAll(".memo-delete-checkbox").forEach((checkbox) => {
    checkbox.checked = selectAllMemos.checked;
  });
});

backToListButton.addEventListener("click", showListView);

backToWorkListButton.addEventListener("click", showWorkDetailReturnView);

backToMemoListButton.addEventListener("click", showMemoListView);

deletePostButton.addEventListener("click", () => {
  const post = boardItems.find((item) => item.id === deletePostButton.dataset.postId);
  const user = getCurrentUser();
  const canDelete = post && (isAdminUser(user) || post.authorId === user?.id || (!post.authorId && post.authorName === user?.name));
  if (!canDelete) return;

  requestDelete(async () => {
    await deleteDoc(doc(db, "meetingMinutes", post.id));
    showListView();
  });
});

editWorkButton.addEventListener("click", () => {
  const item = workItems.find((workItem) => workItem.id === editWorkButton.dataset.workId);
  if (!item || !canEditWorkItem(item)) return;

  showWorkListView();
  fillWorkForm(item);
  setWorkFormOpen(true);
});

deleteWorkButton.addEventListener("click", () => {
  const item = workItems.find((workItem) => workItem.id === deleteWorkButton.dataset.workId);
  if (!item || !canDeleteWorkItem(item)) return;

  requestDelete(async () => {
    await deleteDoc(doc(db, "workStatus", item.id));
    showWorkListView();
  });
});

editMemoButton.addEventListener("click", () => {
  const item = memoItems.find((memo) => memo.id === editMemoButton.dataset.memoId);
  if (!item || !canManageMemoItem(item)) return;

  showMemoListView();
  fillMemoForm(item);
  setMemoFormOpen(true);
});

deleteMemoButton.addEventListener("click", () => {
  const item = memoItems.find((memo) => memo.id === deleteMemoButton.dataset.memoId);
  if (!item || !canManageMemoItem(item)) return;

  requestDelete(async () => {
    await deleteDoc(doc(db, "memos", item.id));
    showMemoListView();
  });
});

menuWorkDashboardButton.addEventListener("click", showWorkDashboardView);

menuWorkListButton.addEventListener("click", showWorkListView);

menuListButton.addEventListener("click", showListView);

menuCalendarButton.addEventListener("click", showCalendarView);

menuScheduleListButton.addEventListener("click", showScheduleListView);

menuScheduleCalendarButton.addEventListener("click", showScheduleCalendarView);

menuMemoListButton.addEventListener("click", showMemoListView);

adminPageButton.addEventListener("click", showAdminView);

saveAdminRolesButton.addEventListener("click", saveAdminRoles);

markdownControls.forEach((button) => {
  button.addEventListener("click", () => applyMarkdownAction(button.dataset.markdownAction));
});

changePasswordButton.addEventListener("click", () => setPasswordModalOpen(true));

homeButton.addEventListener("click", showWorkDashboardView);

brandHomeButton.addEventListener("click", showWorkDashboardView);

cancelPasswordButton.addEventListener("click", () => setPasswordModalOpen(false));

passwordModal.addEventListener("click", (event) => {
  if (event.target === passwordModal) {
    setPasswordModalOpen(false);
  }
});

passwordForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const user = getCurrentUser();
  if (!user) return;

  const formData = new FormData(passwordForm);
  const currentPassword = String(formData.get("currentPassword") || "");
  const newPassword = String(formData.get("newPassword") || "");
  const confirmPassword = String(formData.get("confirmPassword") || "");

  if (!await isValidPassword(user.id, currentPassword)) {
    passwordMessage.textContent = ko.badPassword;
    return;
  }

  if (newPassword.length < 4) {
    passwordMessage.textContent = ko.passwordTooShort;
    return;
  }

  if (newPassword !== confirmPassword) {
    passwordMessage.textContent = ko.passwordMismatch;
    return;
  }

  try {
    await saveUserPassword(user.id, newPassword);
    passwordMessage.textContent = ko.passwordChanged;
    setTimeout(() => setPasswordModalOpen(false), 700);
  } catch (error) {
    console.error("Failed to change password.", error);
    passwordMessage.textContent = ko.authFailed;
  }
});

prevMonthButton.addEventListener("click", () => {
  currentCalendarDate = new Date(currentCalendarDate.getFullYear(), currentCalendarDate.getMonth() - 1, 1);
  renderCalendar();
});

nextMonthButton.addEventListener("click", () => {
  currentCalendarDate = new Date(currentCalendarDate.getFullYear(), currentCalendarDate.getMonth() + 1, 1);
  renderCalendar();
});

prevScheduleMonthButton.addEventListener("click", () => {
  currentScheduleCalendarDate = new Date(currentScheduleCalendarDate.getFullYear(), currentScheduleCalendarDate.getMonth() - 1, 1);
  renderScheduleCalendar();
});

nextScheduleMonthButton.addEventListener("click", () => {
  currentScheduleCalendarDate = new Date(currentScheduleCalendarDate.getFullYear(), currentScheduleCalendarDate.getMonth() + 1, 1);
  renderScheduleCalendar();
});

logoutButton.addEventListener("click", async () => {
  sessionStorage.removeItem("currentUser");
  stopFirestoreListeners();
  await auth.signOut();
  loginForm.reset();
  showListView();
  setView(null);
});

[searchInput, startDateFilter, endDateFilter, categoryTwo].forEach((control) => {
  control.addEventListener("input", () => {
    currentBoardPage = 1;
    renderBoard();
  });
});

[workFilterStartDate, workFilterEndDate, workFilterAssignee, workFilterStatus, workFilterCategory].forEach((control) => {
  control.addEventListener("input", () => {
    renderWorkList();
    renderWorkDashboard();
  });
});

populateFormControls();
applyContentInputStyle();
const savedUser = getCurrentUser();
setView(savedUser);
if (savedUser) {
  ensureAnonymousAuth()
    .then(startFirestoreListeners)
    .catch((error) => {
      console.error("Failed to restore anonymous auth.", error);
      sessionStorage.removeItem("currentUser");
      setView(null);
    });
}
