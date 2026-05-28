const items = [
  "Сделать проектную работу",
  "Полить цветы",
  "Пройти туториал по Реакту",
  "Сделать фронт для своего проекта",
  "Прогуляться по улице в солнечный день",
  "Помыть посуду",
];

const listElement = document.querySelector(".to-do__list");
const formElement = document.querySelector(".to-do__form");
const inputElement = document.querySelector(".to-do__input");

function loadTasks() {
  const savedTasks = localStorage.getItem('tasks');

  if (savedTasks) {
    try {
      const parsedTasks = JSON.parse(savedTasks);

      if (Array.isArray(parsedTasks)) {
        return parsedTasks;
      }
    } catch (error) {
		console.error("Ошибка при загрузке задач из localStorage:", error);
	}
  }

  return items;
}

function createItem(item) {
  const template = document.getElementById("to-do__item-template");
  const itemElement = template.content.querySelector(".to-do__item").cloneNode(true);
  const textElement = itemElement.querySelector(".to-do__item-text");
  const deleteButton = itemElement.querySelector(".to-do__item-button_type_delete");
  const duplicateButton = itemElement.querySelector(".to-do__item-button_type_duplicate");
  const editButton = itemElement.querySelector(".to-do__item-button_type_edit");

  textElement.textContent = item;

  deleteButton.addEventListener("click", () => {
    itemElement.remove();
    saveTasks(getTasksFromDOM());
  });

  duplicateButton.addEventListener("click", () => {
    const duplicatedItem = createItem(textElement.textContent);
    listElement.prepend(duplicatedItem);
    saveTasks(getTasksFromDOM());
  });

  editButton.addEventListener("click", () => {
    textElement.setAttribute("contenteditable", "true");
    textElement.focus();

    const handleBlur = () => {
      textElement.setAttribute("contenteditable", "false");
      textElement.removeEventListener("blur", handleBlur);
      saveTasks(getTasksFromDOM());
    };

    textElement.addEventListener("blur", handleBlur);
  });

  return itemElement;
}

function getTasksFromDOM() {
  const taskElements = listElement.querySelectorAll(".to-do__item-text");
  const tasks = [];

  taskElements.forEach((taskElement) => {
    tasks.push(taskElement.textContent);
  });

  return tasks;
}

function saveTasks(tasks) {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

const initialTasks = loadTasks();

initialTasks.forEach((task) => {
  const itemElement = createItem(task);
  listElement.append(itemElement);
});

formElement.addEventListener("submit", (event) => {
  event.preventDefault();

  const newTask = inputElement.value.trim();

  if (newTask === "") {
    return;
  }

  const itemElement = createItem(newTask);
  listElement.prepend(itemElement);
  saveTasks(getTasksFromDOM());

  inputElement.value = "";
});
