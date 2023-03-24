const path = require('path')
const fs = require('fs-extra')
const inquirer = require('inquirer')
const Generator = require('./generator')

// 抛出一个方法用于创建模块
// 接收用户要创建的项目名以及配置参数
module.exports = async function(name, options) {
    const cwd = process.cwd() // 命令行所在目录
    const targetAir = path.join(cwd, name) // 创建目录地址

    // 判断是否存在相同的文件夹
    // 面试题：判断目录是否已经存在
    if (fs.existsSync(targetAir)) {
        // 是否强制创建
        if (options.force) {
            await fs.remove(targetAir)
        } else {
            // 增加反馈 - 是否需要覆盖呢？
            let { 
                action
             } = await inquirer.prompt([{
                name: 'action',
                type: 'list',
                message: '目标路径文件名已经存在',
                choices: [{
                    name: '覆盖',
                    value: 'overwrite'
                }, {
                    name: '取消',
                    value: false
                }]
             }])

             if (!action) {
                return
             } else {
                // 移除原有文件
                await fs.remove(targetAir)
                console.log('removing...')
             }
        }
    }

    const generator = new Generator(name, targetAir)
    generator.create()
}