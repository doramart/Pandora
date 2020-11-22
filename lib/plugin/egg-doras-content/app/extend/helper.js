/*
 * @Author: doramart 
 * @Date: 2020-11-15 15:32:37 
 * @Last Modified by:   doramart 
 * @Last Modified time: 2020-11-15 15:32:37 
 */


module.exports = {
  async addTagRecords(ctx, conentId, tags) {
    await ctx.service.contentAndTag.removes(conentId, "content_id");
    for (const tagItem of tags) {
      await ctx.service.contentAndTag.create({
        content_id: Number(conentId),
        tag_id: Number(tagItem),
      });
    }
  },
  async addCategoryRecords(ctx, conentId, categories) {
    await ctx.service.contentAndCategory.removes(conentId, "content_id");
    for (const cateItem of categories) {
      await ctx.service.contentAndCategory.create({
        content_id: Number(conentId),
        category_id: Number(cateItem),
      });
    }
  },
};
