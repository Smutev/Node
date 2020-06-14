const ul = document.getElementById("messages");

fetch("/messages")
  .then(res => res.json())
  .then(data => {
    data.forEach(({ text, author, createdAt }) => {
      const li = document.createElement("li");
      li.innerHTML = `${createdAt.toLocaleString()}
      <p>${author}</p> 
      <p>${text}</p>`;
      ul.appendChild(li);
    });
  });
