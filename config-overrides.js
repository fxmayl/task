/*
 * Copyright: 浙报传媒控股集团有限公司版权所有
 * Copyright (c) 2019, Copyright Zhejiang Daily Media Holding Group Co.,Ltd. All Rights Reserved.
 */
const {injectBabelPlugin} = require('react-app-rewired');
module.exports = function override(config, env) {
    // do stuff with the webpack config...
    config = injectBabelPlugin(
        ['import', {libraryName: 'antd', libraryDirectory: 'es', style: 'css'}],
        config,
    );
    return config;
};