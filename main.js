const list = document.getElementById("list");
const createBtn = document.getElementById("create-btn");

let todos = [];

createBtn.addEventListener("click", createNewTodo);

function createNewTodo() {
  const item = {
    id: new Date().getTime(),
    text: "",
    complete: false,
    image: null, // 이미지 필드 추가
  };

  todos.unshift(item);

  const { itemEl, inputEl } = createTodoElement(item);

  list.prepend(itemEl);

  inputEl.removeAttribute("disabled");
  inputEl.focus();

  saveToLocalStorage();
}

function createTodoElement(item) {
  const itemEl = document.createElement("div");
  itemEl.classList.add("item");

  // 체크박스, 입력 필드, 액션 버튼을 담을 래퍼 생성
  const itemContentEl = document.createElement("div");
  itemContentEl.classList.add("item-content");

  // 완료 표시를 위한 체크박스 생성
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = item.complete;

  // 체크된 경우 완료된 항목으로 표시
  if (item.complete) {
    itemEl.classList.add("complete");
  }

  // 텍스트 수정 입력 필드 생성
  const inputEl = document.createElement("input");
  inputEl.type = "text";
  inputEl.value = item.text;
  inputEl.setAttribute("disabled", "");

  // 이미지를 담을 수 있는 크기 조절 가능한 컨테이너 생성
  const imageContainer = document.createElement("div");
  imageContainer.classList.add("resizable");

  // 이미지를 보여줄 이미지 엘리먼트 생성
  const imageEl = document.createElement("img");
  imageEl.classList.add("todo-image");

  if (item.image) {
    imageEl.src = item.image;
    imageContainer.style.display = "block"; // 이미지가 있을 때만 컨테이너 표시
  } else {
    imageContainer.style.display = "none"; // 이미지가 없으면 컨테이너 숨김
  }

  // 이미지 컨테이너에 이미지 추가
  imageContainer.appendChild(imageEl);

  // 버튼을 담을 액션 요소 생성
  const actionsEl = document.createElement("div");
  actionsEl.classList.add("actions");

  // 수정 버튼 생성
  const editBtnEl = document.createElement("button");
  editBtnEl.classList.add("material-icons");
  editBtnEl.innerText = "edit";

  // 삭제 버튼 생성
  const removeBtnEl = document.createElement("button");
  removeBtnEl.classList.add("material-icons", "remove-btn");
  removeBtnEl.innerText = "remove_circle";

  // 이미지 추가 버튼 생성
  const addImageBtnEl = document.createElement("button");
  addImageBtnEl.classList.add("material-icons", "add-image-btn");
  addImageBtnEl.innerText = "add_photo_alternate";

  // 액션 요소에 버튼 추가
  actionsEl.append(editBtnEl);
  actionsEl.append(removeBtnEl);
  actionsEl.append(addImageBtnEl);

  // 체크박스, 입력 필드, 액션 버튼을 itemContentEl에 추가
  itemContentEl.append(checkbox);
  itemContentEl.append(inputEl);
  itemContentEl.append(actionsEl);

  // itemContentEl과 크기 조절 가능한 이미지 컨테이너를 itemEl에 추가
  itemEl.append(itemContentEl);
  itemEl.append(imageContainer); // 이미지 컨테이너를 입력 필드 아래에 추가

  // 이벤트 추가
  checkbox.addEventListener("change", () => {
    item.complete = checkbox.checked;

    if (item.complete) {
      itemEl.classList.add("complete");
    } else {
      itemEl.classList.remove("complete");
    }

    saveToLocalStorage();
  });

  inputEl.addEventListener("input", () => {
    item.text = inputEl.value;
  });

  inputEl.addEventListener("blur", () => {
    inputEl.setAttribute("disabled", "");
    saveToLocalStorage();
  });

  editBtnEl.addEventListener("click", () => {
    inputEl.removeAttribute("disabled");
    inputEl.focus();
  });

  removeBtnEl.addEventListener("click", () => {
    todos = todos.filter((t) => t.id != item.id);
    itemEl.remove();
    saveToLocalStorage();
  });

  // 이미지 추가 버튼 클릭 시 파일 선택 기능 구현
  addImageBtnEl.addEventListener("click", () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.click();

    // 파일 선택 시 이미지 처리
    fileInput.addEventListener("change", () => {
      const file = fileInput.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
          const imageSrc = e.target.result;
          item.image = imageSrc; // 이미지 저장
          imageEl.src = imageSrc;
          imageContainer.style.display = "block"; // 이미지 업로드 시 컨테이너 표시
          saveToLocalStorage();
        };
        reader.readAsDataURL(file);
      }
    });
  });

  return { itemEl, inputEl, editBtnEl, removeBtnEl };
}

function saveToLocalStorage() {
  localStorage.setItem("todos", JSON.stringify(todos));
}
