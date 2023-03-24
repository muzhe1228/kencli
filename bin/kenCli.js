#! /usr/bin/env node

// 系统文件在node环境下下执行

// 主系统部分
// console.log('kenCli')

const program = require('commander');

//定义命令参数
program
.command('create <app-name>')
.description('create a cool reoject')
.option('-f --force','如果存在的话进行强行覆盖')
.action((name, options) => {
    console.log(name, options);
    require("../lib/create")(name,options)
})


program.parse(program.argv)
// 注意： 解析用户命令参数要放置在最后