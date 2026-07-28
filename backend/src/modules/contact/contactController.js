const { success, failure } = require('../../utils/response');
const { asyncWrapper } = require('../../middleware/error/asyncWrapper');

const contactService = require('./contactService');

function buildValidationErrors(errDetails) {
  return errDetails;
}

const postContact = asyncWrapper(async (req, res) => {
  const created = await contactService.createContact(req.body);
  return success(res, { status: 201, message: 'Contact created', data: created });
});

const getContactStatus = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const data = await contactService.getStatus(id);
  return success(res, { message: 'OK', data });
});

const adminList = asyncWrapper(async (req, res) => {
  const result = await contactService.adminList(req.query);
  return success(res, { message: 'OK', data: result });
});

const adminGetById = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const item = await contactService.adminGetById(id);
  return success(res, { message: 'OK', data: item });
});

const adminUpdateById = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const updated = await contactService.adminUpdateById(id, req.body);
  return success(res, { message: 'OK', data: updated });
});

const adminPatchById = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const updated = await contactService.adminPatchById(id, req.body);
  return success(res, { message: 'OK', data: updated });
});

const adminDeleteById = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const removed = await contactService.adminDeleteById(id);
  return success(res, { message: 'Deleted', data: removed });
});

const adminPatchStatus = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const updated = await contactService.adminPatchStatus(id, req.body);
  return success(res, { message: 'OK', data: updated });
});

const adminAssign = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const updated = await contactService.adminAssign(id, req.body);
  return success(res, { message: 'OK', data: updated });
});

const adminReply = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const updated = await contactService.adminReply(id, req.body);
  return success(res, { message: 'OK', data: updated });
});

module.exports = {
  postContact,
  getContactStatus,
  adminList,
  adminGetById,
  adminUpdateById,
  adminPatchById,
  adminDeleteById,
  adminPatchStatus,
  adminAssign,
  adminReply,
};

