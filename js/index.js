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
 * Todoリストを状態ごとにフィルタリングするラジオボタンの値を取得する関数
 * @returns {string | null} ラジオボタンの状態('すべて' or '作業中' or '完了')
 */
const getSelectedState = () => {
  const radioButtons = document.getElementsByName('radio');
  for (const radioButton of radioButtons) {
    if (radioButton.checked) {
      return radioButton.value;
    }
  }
  return null; // 選択されているラジオボタンがない場合
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
 * タスクの状態切り替えを行う関数
 * @param {string} id タスクID
 */
const toggleTaskState = (id) => {
  // idが一致するTodoを検索する
  const targetTodo = todoList.find((todo) => todo.id === id);

  // Todoが見つからない場合は処理を中断する
  if (!targetTodo) {
    return;
  }
  // Todoの状態を切り替える
  targetTodo.state =
    targetTodo.state === TODO_STATE.PROGRESS
      ? TODO_STATE.DONE
      : TODO_STATE.PROGRESS;
};

/**
 * タスクの状態切り替えボタンを生成する関数
 * @param {string} state タスクの状態
 * @param {string} id タスクのID
 * @returns {HTMLButtonElement} タスクの状態切り替えボタン
 */
const createChangeStateButton = (state, id) => {
  const tdElement = document.createElement('td');
  const buttonElement = document.createElement('button');
  buttonElement.textContent = state;
  buttonElement.id = id;
  tdElement.appendChild(buttonElement);
  buttonElement.addEventListener('click', () => {
    // Todoの状態を切り替える
    toggleTaskState(id);
    // Todoリストを表示する
    displayTodoList();
  });
  return tdElement;
};

/**
 * タスクの削除を行う関数
 * @param {string} id タスクID
 */
const deleteTask = (id) => {
  // idが一致するTodoを検索する
  const targetTodo = todoList.find((todo) => todo.id === id);

  // Todoが見つからない場合は処理を中断する
  if (!targetTodo) {
    return;
  }

  // Todoを削除する
  todoList.splice(todoList.indexOf(targetTodo), 1);
};

/**
 * タスクの削除ボタンを生成する関数
 * @param {string} id タスクID
 * @returns {HTMLButtonElement} タスクの削除ボタン
 */
const createDeleteButton = (id) => {
  const tdElement = document.createElement('td');
  const buttonElement = document.createElement('button');
  buttonElement.textContent = '✕';
  tdElement.appendChild(buttonElement);
  buttonElement.addEventListener('click', () => {
    // Todoを削除する
    deleteTask(id);
    // Todoリストを表示する
    displayTodoList();
  });
  return tdElement;
};

/**
 * Todoリストを表示する関数
 */
const displayTodoList = () => {
  const todoListElement = document.getElementById('todoList');

  // 最初に表示されているTodoリストをresetする
  resetTodoList();

  // ラジオボタンの状態を取得する
  const selectedState = getSelectedState();

  // ラジオボタンの状態に応じてTodoリストをフィルタリングする
  const filteredTodoList =
    selectedState === TODO_STATE.PROGRESS || selectedState === TODO_STATE.DONE
      ? todoList.filter((todo) => todo.state === selectedState)
      : todoList;

  // Todoリストを表示する
  filteredTodoList.forEach((todo, index) => {
    const trElement = document.createElement('tr');
    // todoを配列に展開して、forEachでループ処理する
    Object.entries(todo).forEach(([key, value]) => {
      // IDは配列の何番目かを表示する
      if (key === 'id') {
        trElement.appendChild(createTdElement(index + 1));
        return;
      }
      if (key === 'state') {
        // stateは状態切り替えボタンを表示する
        trElement.appendChild(createChangeStateButton(value, todo.id));
        return;
      }
      // その他の場合はそのまま表示する
      trElement.appendChild(createTdElement(value));
    });
    // 削除ボタンを表示する
    trElement.appendChild(createDeleteButton(todo.id));
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

// 入力フォームのsubmitイベントをキャンセルする
const inputTodoForm = document.getElementById('inputTodoForm');
inputTodoForm.addEventListener('submit', (event) => {
  event.preventDefault(); // デフォルトのイベントをキャンセルする
});
// ⌘ + Enter または ctrl + Enter  でタスクを追加するイベント
inputTodoForm.addEventListener('keydown', (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
    addTodo();
  }
});

// タスクを追加するボタン
const addButton = document.getElementById('addTaskButton');
addButton.addEventListener('click', () => {
  addTodo();
});

// Todoリストを状態ごとにフィルタリングするラジオボタンが変更された時のイベント
const radioButtons = document.getElementsByName('radio');
radioButtons.forEach((radioButton) => {
  radioButton.addEventListener('change', () => {
    displayTodoList();
  });
});
