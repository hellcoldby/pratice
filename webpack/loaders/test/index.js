function loader(content, map, meta) {
    const logger = this.getLogger();
    const options = this.getOptions();
    logger.info('[custom-loader] running...');
    // logger.info('input content:', content);
    this.callback(null, content, map, meta)
    logger.info('[custom-loader] done.')
      
    return
  }
  
  module.exports = loader
  
