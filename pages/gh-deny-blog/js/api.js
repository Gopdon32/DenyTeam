const API_BASE = "/backend/api";

const api = {


  // ============================
  // AUTH
  // ============================
  async login(username, password) {
    const res = await fetch(`${API_BASE}/auth.php`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    return res.json();
  },


  // ============================
  // POSTS
  // ============================
  async getPosts() {
    const res = await fetch(`${API_BASE}/posts.php`);
    return res.json();
  },

  async getPost(id) {
    const res = await fetch(`${API_BASE}/posts.php?id=${id}`);
    return res.json();
  },

  async createPost(data) {
    const res = await fetch(`${API_BASE}/posts.php`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async updatePost(data) {
    const res = await fetch(`${API_BASE}/posts.php`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async deletePost(id) {
    const res = await fetch(`${API_BASE}/posts.php?id=${id}`, {
      method: "DELETE",
      credentials: "include"
    });
    return res.json();
  },

  async getCategories() {
    const res = await fetch(`${API_BASE}/categories.php`);
    return res.json();
  },



  // ============================
  // UPLOADS
  // ============================
  async uploadCover(file) {
    const form = new FormData();
    form.append("file", file);

    const res = await fetch(`${API_BASE}/upload.php`, {
      method: "POST",
      credentials: "include",
      body: form,
    });
    return res.json();
  },

  async uploadAvatar(file) {
    const form = new FormData();
    form.append("avatar", file);

    const res = await fetch(`${API_BASE}/upload_avatar.php`, {
      method: "POST",
      credentials: "include",
      body: form,
    });
    return res.json();
  },

// ============================
// COMMENTS (оновлено)
// ============================
async getComments(postId, offset = 0, limit = 10) {
  const res = await fetch(
    `${API_BASE}/comments.php?post_id=${postId}&offset=${offset}&limit=${limit}`
  );
  return res.json();
},

async addComment(postId, text) {
  const res = await fetch(`${API_BASE}/comments.php?post_id=${postId}`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  return res.json();
},

async deleteComment(id) {
  const res = await fetch(`${API_BASE}/comments.php?action=delete`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id })
  });
  return res.json();
},

  // ============================
  // LIKES
  // ============================
  async getLikes(postId) {
    const res = await fetch(`${API_BASE}/likes.php?post_id=${postId}`);
    return res.json();
  },

  async toggleLike(postId) {
    const res = await fetch(`${API_BASE}/likes.php?post_id=${postId}`, {
      method: "POST",
      credentials: "include"
    });

    let data;
    try {
      data = await res.json();
    } catch {
      data = { error: "Invalid JSON" };
    }

    data.status = res.status;
    return data;
  },


  // ============================
  // USERS
  // ============================
  async getUsers() {
    const res = await fetch(`${API_BASE}/users.php`, {
      credentials: "include"
    });
    return res.json();
  },

  async updateUser(data) {
    const res = await fetch(`${API_BASE}/users.php`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async deleteUser(id) {
    const res = await fetch(`${API_BASE}/users.php?id=${id}`, {
      method: "DELETE",
      credentials: "include"
    });
    return res.json();
  },

  async getCurrentUser() {
    const res = await fetch(`${API_BASE}/me.php`, {
      credentials: "include"
    });
    return res.json();
  }

};
