const uuid = require( 'uuid' );
const PageModuleType = require( '../model/pageModuleType' );

module.exports = {
  'GET /api/pageModule/module/type/detail/:moduleTypeId': async( ctx ) => {
    let pageModuleTypes = await PageModuleType.findAll( { where: { moduleParentId: ctx.params.moduleTypeId } } );
    let childPageModuleTypes = await Promise.all( pageModuleTypes.map( async( pageModule ) => await PageModuleType.findAll( { where: { moduleParentId: pageModule.moduleTypeId }, raw: true } ) ) );

    pageModuleTypes = pageModuleTypes.map( ( pageModule, index ) => {
      return {
        id: pageModule.moduleTypeId,
        pId: pageModule.moduleParentId,
        name: pageModule.moduleTypeName,
        parent: childPageModuleTypes[index]&&childPageModuleTypes[index].length > 0? 1: 0
      };
    } );
    ctx.rest( { nodes: pageModuleTypes } );
  },
  'POST /api/pageModuleType/module/type': async( ctx ) => {
    await PageModuleType.create( {
      ...ctx.request.body,
      moduleTypeId: uuid().replace( /-/g, '' ),
      createDate: ctx.state.nowDate,
      updateDate: ctx.state.nowDate
    } );
    ctx.rest( { code: 201, message: '添加组件类型成功' } );
  },
  'PUT /api/pageModuleType/module/type/update/:moduleTypeId': async( ctx ) => {
    await PageModuleType.update( {
      ...ctx.request.body,
      updateDate: ctx.state.nowDate
    }, { where: { moduleTypeId: ctx.params.moduleTypeId } } );
    ctx.rest( { code: 204, message: '修改组件类型信息成功' } );
  },
  'DELETE /api/pageModuleType/module/type/delete/:moduleTypeId': async( ctx ) => {
    await PageModuleType.destroy( { where: { moduleTypeId: ctx.params.moduleTypeId } } );
    ctx.rest( { code: 200, message: '删除组件类型信息成功' } );
  }
};