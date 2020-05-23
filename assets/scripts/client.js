const ul = document.getElementById("my_ul");
const add_msg = document.getElementById("add_msg");
const add_input = document.getElementById("add_input");
const sort_btn = document.getElementById("sort_btn");
const limit_btn = document.getElementById("limit_btn");
const skip_btn = document.getElementById("skip_btn");
let SKIP = "DESC";
let SORT = "DESC";
let LIMIT = "DESC";

limit_btn.addEventListener("click", () => {
  if (LIMIT === "ASC") {
    LIMIT = "DESC";
  } else {
    LIMIT = "ASC";
  }
  getAllMessages();
});
sort_btn.addEventListener("click", () => {
  if (SORT === "ASC") {
    SORT = "DESC";
  } else {
    SORT = "ASC";
  }
  getAllMessages();
});
skip_btn.addEventListener("click", () => {
  if (SKIP === "ASC") {
    SKIP = "DESC";
  } else {
    SKIP = "ASC";
  }
  getAllMessages();
});

add_msg.addEventListener("click", () => {
  fetch("/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(add_input.value)
  }).then(() => getAllMessages());
});

ul.addEventListener("click", e => {
  const et = e.target;
  const upd_inputs = Array.from(document.querySelectorAll(".upd_input"));

  if (et.dataset.del) {
    deleteMessage(et.dataset.del);
  } else if (et.dataset.upd) {
    const current_input_val = upd_inputs.find(
      el => el.dataset.input === et.dataset.upd
    ).value;
    updateMessage(et.dataset.upd, current_input_val);
  }
});

function deleteMessage(id) {
  fetch("/messages/" + id, {
    method: "DELETE"
  }).then(() => getAllMessages());
}

function updateMessage(id, value) {
  fetch("/messages/" + id, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(value)
  }).then(() => getAllMessages());
}

function getAllMessages() {
  ul.innerHTML = ``;
  add_input.value = ``;

  const url = new URL("http://localhost:3000/messages");
  const search_params = url.searchParams;

  search_params.append("sort", SORT);
  search_params.append("limit", LIMIT);
  search_params.append("skip", SKIP);

  url.search = search_params.toString();
  const new_url = url.toString();

  fetch(new_url)
    .then(res => res.json())
    .then(data => {
      data.forEach(el => {
        ul.innerHTML += `
          <li class="li" data-li=${el.id}>${new Date(
          el.createdAt
        ).toDateString()}: ${el.data}</li>
          <button data-del=${el.id} class="del">Delete message</button>
          <input class='upd_input' type="text" data-input=${el.id}>
          <button data-upd=${el.id} class="upd">Update message</button>
          `;
      });
    });
}
getAllMessages();
