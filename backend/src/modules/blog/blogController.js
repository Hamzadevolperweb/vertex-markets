const { success } = require('../../utils/response');
const blogService = require('./blogService');

async function getBlogs(req, res, next) {
  try {
    const data = await blogService.publicList(req.query);
    return success(res, { message: 'Blogs fetched', data });
  } catch (err) {
    return next(err);
  }
}

async function getBlogById(req, res, next) {
  try {
    const data = await blogService.publicGetById(req.params.id);
    return success(res, { message: 'Blog fetched', data });
  } catch (err) {
    return next(err);
  }
}

async function getBlogBySlug(req, res, next) {
  try {
    const data = await blogService.publicGetBySlug(req.params.slug);
    return success(res, { message: 'Blog fetched', data });
  } catch (err) {
    return next(err);
  }
}

async function getCategories(req, res, next) {
  try {
    const data = await blogService.publicListCategories(req.query);
    return success(res, { message: 'Categories fetched', data });
  } catch (err) {
    return next(err);
  }
}

async function getCategoryById(req, res, next) {
  try {
    const data = await blogService.publicGetCategoryById(req.params.id);
    return success(res, { message: 'Category fetched', data });
  } catch (err) {
    return next(err);
  }
}

async function getTags(req, res, next) {
  try {
    const data = await blogService.publicListTags(req.query);
    return success(res, { message: 'Tags fetched', data });
  } catch (err) {
    return next(err);
  }
}

async function getTagById(req, res, next) {
  try {
    const data = await blogService.publicGetTagById(req.params.id);
    return success(res, { message: 'Tag fetched', data });
  } catch (err) {
    return next(err);
  }
}

// ---------------- Admin Blogs ----------------

async function createBlog(req, res, next) {
  try {
    const data = await blogService.adminCreateBlog(req.body);
    return success(res, { message: 'Blog created', data });
  } catch (err) {
    return next(err);
  }
}

async function putBlog(req, res, next) {
  try {
    const data = await blogService.adminPutBlog(req.params.id, req.body);
    return success(res, { message: 'Blog updated', data });
  } catch (err) {
    return next(err);
  }
}

async function patchBlog(req, res, next) {
  try {
    const data = await blogService.adminPatchBlog(req.params.id, req.body);
    return success(res, { message: 'Blog patched', data });
  } catch (err) {
    return next(err);
  }
}

async function deleteBlog(req, res, next) {
  try {
    const data = await blogService.adminDeleteBlog(req.params.id);
    return success(res, { message: 'Blog deleted', data });
  } catch (err) {
    return next(err);
  }
}

// ---------------- Admin Categories ----------------

async function createCategory(req, res, next) {
  try {
    const data = await blogService.adminCreateCategory(req.body);
    return success(res, { message: 'Category created', data });
  } catch (err) {
    return next(err);
  }
}

async function putCategory(req, res, next) {
  try {
    const data = await blogService.adminPutCategory(req.params.id, req.body);
    return success(res, { message: 'Category updated', data });
  } catch (err) {
    return next(err);
  }
}

async function patchCategory(req, res, next) {
  try {
    const data = await blogService.adminPatchCategory(req.params.id, req.body);
    return success(res, { message: 'Category patched', data });
  } catch (err) {
    return next(err);
  }
}

async function deleteCategory(req, res, next) {
  try {
    const data = await blogService.adminDeleteCategory(req.params.id);
    return success(res, { message: 'Category deleted', data });
  } catch (err) {
    return next(err);
  }
}

// ---------------- Admin Tags ----------------

async function createTag(req, res, next) {
  try {
    const data = await blogService.adminCreateTag(req.body);
    return success(res, { message: 'Tag created', data });
  } catch (err) {
    return next(err);
  }
}

async function putTag(req, res, next) {
  try {
    const data = await blogService.adminPutTag(req.params.id, req.body);
    return success(res, { message: 'Tag updated', data });
  } catch (err) {
    return next(err);
  }
}

async function patchTag(req, res, next) {
  try {
    const data = await blogService.adminPatchTag(req.params.id, req.body);
    return success(res, { message: 'Tag patched', data });
  } catch (err) {
    return next(err);
  }
}

async function deleteTag(req, res, next) {
  try {
    const data = await blogService.adminDeleteTag(req.params.id);
    return success(res, { message: 'Tag deleted', data });
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  // public
  getBlogs,
  getBlogById,
  getBlogBySlug,

  getCategories,
  getCategoryById,

  getTags,
  getTagById,

  // admin blogs
  createBlog,
  putBlog,
  patchBlog,
  deleteBlog,

  // admin categories
  createCategory,
  putCategory,
  patchCategory,
  deleteCategory,

  // admin tags
  createTag,
  putTag,
  patchTag,
  deleteTag,
};

