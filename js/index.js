/**
 * Todoの状態を表す定数
 * @type {{DONE: string, PROGRESS: string}}
 */
const TODO_STATE = {
  PROGRESS: '作業中',
  DONE: '完了',
};

/**
 * ランダムな文字列を生成するutil関数
 * @returns {string} ランダムな文字列
 */
const generateId = () => Math.random().toString(32).substring(2); // 2文字目から末尾までを返す

/**
 * Todoリストの配列
 * @type {{id: string, taskName: string, limit: string, state: string}[]}
 * - id: TodoのID
 * - taskName: Todoのタスク名
 * - limit: Todoの期限
 * - state: Todoの状態(作業中 or 完了)
 */
const todoList = [
  {
    id: generateId(),
    taskName: 'JavaScriptの基礎',
    // タイムスタンプで現在時間を取得
    limit: '2024-01-01',
    state: TODO_STATE.PROGRESS,
  },
  {
    id: generateId(),
    taskName: '非同期処理',
    // タイムスタンプで現在時間を取得
    limit: '2024-12-31',
    state: TODO_STATE.DONE,
  },
  {
    id: generateId(),
    taskName: 'オブジェクト指向',
    // タイムスタンプで現在時間を取得
    limit: '2025-01-01',
    state: TODO_STATE.PROGRESS,
  },
];

/**
 * 表示されているTodoリストをresetする関数
 */
const resetTodoList = () => {
  const todoListElement = document.getElementById('todoList');
  while (todoListElement.firstChild) {
    todoListElement.removeChild(todoListElement.firstChild);
  }
};

/**
 * todoの各プロパティをtd要素に格納する関数
 * @param {HTMLElement | string} element td要素に格納する要素
 * @returns {HTMLTableCellElement} td要素
 */
const createTdElement = (element) => {
  const tdElement = document.createElement('td');
  // elementがDOM要素の場合はinnerHTMLに、文字列や数字の場合はtextContentに格納する
  element instanceof HTMLElement
    ? (tdElement.innerHTML = element.outerHTML)
    : (tdElement.textContent = element);
  return tdElement;
};

/**
 * Todoリストを表示する関数
 */
const displayTodoList = () => {
  // FIXME: デバッグ用
  console.log('todoList', todoList);

  const todoListElement = document.getElementById('todoList');

  // 最初に表示されているTodoリストをresetする
  resetTodoList();

  // Todoリストを表示する
  todoList.forEach((todo, index) => {
    const trElement = document.createElement('tr');
    // todoを配列に展開して、forEachでループ処理する
    Object.entries(todo).forEach(([key, value]) => {
      // IDの場合は例外として配列の何番目かを表示する
      if (key === 'id') {
        trElement.appendChild(createTdElement(index + 1));
        return;
      }
      trElement.appendChild(createTdElement(value));
    });
    todoListElement.appendChild(trElement);
  });
};

// 初回画面読み込み時にTodoリストを表示する
displayTodoList();

/**
 * Todoリストにタスクを追加する関数
 */
const addTodo = () => {
  const taskName = document.getElementById('taskName').value;
  const limit = document.getElementById('limit').value || '期限なし';

  // タスク名が空の場合は処理を中断する
  if (!taskName) {
    alert('タスク名を入力してください');
    return;
  }

  // Todoリストにタスクを追加する
  todoList.push({
    id: generateId(),
    taskName,
    limit,
    state: TODO_STATE.PROGRESS,
  });

  // Todoリストを表示する
  displayTodoList();

  // 入力欄を空にする
  document.getElementById('taskName').value = '';
  document.getElementById('limit').value = '';
};

// Todoリストにタスクを追加するイベント
const inputTodoForm = document.getElementById('inputTodoForm');
inputTodoForm.addEventListener('submit', (event) => {
  event.preventDefault(); // デフォルトのイベントをキャンセルする
  addTodo();
});
