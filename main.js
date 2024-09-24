const list = document.getElementById("list");
const createBtn = document.getElementById("create-btn");

let todos = [];

createBtn.addEventListener('click', createNewTodo);

function createNewTodo() {
	const item = {
		id: new Date().getTime(),
		text: "",
		complete: false,
		image: null // Image field added
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

	// Create a wrapper for checkbox, input, and actions
	const itemContentEl = document.createElement("div");
	itemContentEl.classList.add("item-content");

	// Checkbox element for marking todo as complete
	const checkbox = document.createElement("input");
	checkbox.type = "checkbox";
	checkbox.checked = item.complete;

	// Mark the item as complete if it is checked
	if (item.complete) {
		itemEl.classList.add("complete");
	}

	// Input element for editing the todo text
	const inputEl = document.createElement("input");
	inputEl.type = "text";
	inputEl.value = item.text;
	inputEl.setAttribute("disabled", "");

	// Image element to display uploaded image (if exists)
	const imageEl = document.createElement("img");
	imageEl.classList.add("todo-image");
	if (item.image) {
		imageEl.src = item.image;
		imageEl.style.display = "block";
	} else {
		imageEl.style.display = "none";
	}

	// Actions container for buttons
	const actionsEl = document.createElement("div");
	actionsEl.classList.add("actions");

	// Edit button
	const editBtnEl = document.createElement("button");
	editBtnEl.classList.add("material-icons");
	editBtnEl.innerText = "edit";

	// Remove button
	const removeBtnEl = document.createElement("button");
	removeBtnEl.classList.add("material-icons", "remove-btn");
	removeBtnEl.innerText = "remove_circle";

	// Add image button
	const addImageBtnEl = document.createElement("button");
	addImageBtnEl.classList.add("material-icons", "add-image-btn");
	addImageBtnEl.innerText = "add_photo_alternate";

	// Append buttons to actions element
	actionsEl.append(editBtnEl);
	actionsEl.append(removeBtnEl);
	actionsEl.append(addImageBtnEl);

	// Append checkbox, input, and actions to itemContentEl
	itemContentEl.append(checkbox);
	itemContentEl.append(inputEl);
	itemContentEl.append(actionsEl);

	// Append the item content and image to the item element
	itemEl.append(itemContentEl);
	itemEl.append(imageEl); // Append image below the input field

	// EVENTS
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
		todos = todos.filter(t => t.id != item.id);
		itemEl.remove();
		saveToLocalStorage();
	});

	// Image button event to trigger file selection
	addImageBtnEl.addEventListener("click", () => {
		const fileInput = document.createElement("input");
		fileInput.type = "file";
		fileInput.accept = "image/*";
		fileInput.click();

		// Handle image file selection
		fileInput.addEventListener("change", () => {
			const file = fileInput.files[0];
			if (file) {
				const reader = new FileReader();
				reader.onload = function(e) {
					const imageSrc = e.target.result;
					item.image = imageSrc; // Save image to the item
					imageEl.src = imageSrc;
					imageEl.style.display = "block"; // Show image
					saveToLocalStorage();
				};
				reader.readAsDataURL(file);
			}
		});
	});

	return { itemEl, inputEl, editBtnEl, removeBtnEl };
}

