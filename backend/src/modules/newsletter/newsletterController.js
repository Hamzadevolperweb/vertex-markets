const { success } = require('../../utils/response');
const { asyncWrapper } = require('../../middleware/error/asyncWrapper');
const newsletterService = require('./newsletterService');

const subscribe = asyncWrapper(async (req, res) => {
  const data = await newsletterService.subscribe(req.body);
  return success(res, { status: 201, message: 'Subscribed successfully', data });
});

const unsubscribe = asyncWrapper(async (req, res) => {
  const data = await newsletterService.unsubscribe(req.body);
  return success(res, { message: 'Unsubscribed successfully', data });
});

const getStatus = asyncWrapper(async (req, res) => {
  const { email } = req.params;
  const data = await newsletterService.getStatus(email);
  return success(res, { message: 'OK', data });
});

const adminList = asyncWrapper(async (req, res) => {
  const result = await newsletterService.adminList(req.query);
  return success(res, { message: 'OK', data: result });
});

const adminGetById = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const item = await newsletterService.adminGetById(id);
  return success(res, { message: 'OK', data: item });
});

const adminUpdateById = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const updated = await newsletterService.adminUpdateById(id, req.body);
  return success(res, { message: 'OK', data: updated });
});

const adminPatchById = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const updated = await newsletterService.adminPatchById(id, req.body);
  return success(res, { message: 'OK', data: updated });
});

const adminDeleteById = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const removed = await newsletterService.adminDeleteById(id);
  return success(res, { message: 'Deleted', data: removed });
});

const adminPatchStatus = asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const updated = await newsletterService.adminPatchStatus(id, req.body);
  return success(res, { message: 'OK', data: updated });
});

module.exports = {
  subscribe,
  unsubscribe,
  getStatus,
  adminList,
  adminGetById,
  adminUpdateById,
  adminPatchById,
  adminDeleteById,
  adminPatchStatus,
};

