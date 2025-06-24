 document.addEventListener("DOMContentLoaded", function () {
  getPosts();
  setupNewPostForm();
});

function getPosts() {
  fetch("http://localhost:3000/posts")
    .then(function (response) {
      return response.json();
    })
    .then(function (posts) {
      let postList = document.getElementById("post-list");
      postList.innerHTML = "<h2>All Posts</h2>";
      posts.forEach(function (post) {
        let div = document.createElement("div");
        div.textContent = post.title;
        div.addEventListener("click", function () {
          showPostDetails(post);
        });
        postList.appendChild(div);
      });

      if (posts.length > 0) {
        showPostDetails(posts[0]);
      }
    });
}

function showPostDetails(post) {
  let detail = document.getElementById("post-detail");
  detail.innerHTML = `
    <h2>${post.title}</h2>
    <img src="${post.image}" width="100%">
    <p>${post.content}</p>
    <small><strong>Author:</strong> ${post.author}</small><br><br>
    <button id="edit-btn">Edit</button>
    <button id="delete-btn">Delete</button>
  `;

  document.getElementById("edit-btn").addEventListener("click", function () {
    editPost(post);
  });

  document.getElementById("delete-btn").addEventListener("click", function () {
    deletePost(post.id);
  });
}

function setupNewPostForm() {
  let form = document.getElementById("new-post-form");
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    let newPost = {
      title: form.title.value,
      content: form.content.value,
      author: form.author.value,
      image: form.image.value || "https://via.placeholder.com/150"
    };

    fetch("http://localhost:3000/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newPost)
    })
    .then(function (res) {
      return res.json();
    })
    .then(function () {
      form.reset();
      getPosts();
    });
  });
}

function editPost(post) {
  let form = document.getElementById("edit-post-form");
  form.classList.remove("hidden");
  form["edit-title"].value = post.title;
  form["edit-content"].value = post.content;

  form.onsubmit = function (e) {
    e.preventDefault();

    let updated = {
      title: form["edit-title"].value,
      content: form["edit-content"].value
    };

    fetch("http://localhost:3000/posts/" + post.id, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated)
    })
    .then(function () {
      getPosts();
      form.classList.add("hidden");
    });
  };

  document.getElementById("cancel-edit").onclick = function () {
    form.classList.add("hidden");
  };
}

function deletePost(id) {
  fetch("http://localhost:3000/posts/" + id, {
    method: "DELETE"
  })
  .then(function () {
    getPosts();
    document.getElementById("post-detail").innerHTML = "<h2>Select a post to see details</h2>";
  });
}
