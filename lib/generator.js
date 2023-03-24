const { getRepoList, getTagList } = require('./http')
const downloadGitRepo = require('download-git-repo')
const util = require('util')
const ora = require('ora')
const chalk = require('chalk')
const inquirer = require('inquirer')
const path = require('path')

class Generator {
    constructor(name, targetDir) {
        // 目录名
        this.name = name
        // 创建位置
        this.targetDir = targetDir
        // 对downloadGitRepo进行promise封装
        this.downloadGitRepo = util.promisify(downloadGitRepo)
    }

    // 获取模板
    async getRepo() {
        // 1. 远程拉取模板数据
        const repoList = await wrapLoading(getRepoList, 'waiting template downloading')

        if (!repoList) return

        // 过滤出我们需要的模板名称
        const repos = repoList.map(item => item.name)

        // 2. 选一个喜欢的模板
        const { repo } = await inquirer.prompt({
            name: 'repo',
            type: 'list',
            choices: repos,
            message: '请选一个模板进行创建'
        })
        return repo;
    }

    // 获取版本
    async getTag(repo) {
        // 1. 拉取对应的tag列表
        const tags = await wrapLoading(getTagList.bind(this, repo), 'waiting tag downloading')

        if (!tags) return

        // 2. 过滤tag名称
        const tagsList = tags.map(item => item.name)

        // 3. 选一个tag版本
        const { tag } = await inquirer.prompt({
            name: 'tag',
            type: 'list',
            choices: tagsList,
            message: '请选一个版本'
        })
        return tag
    }

    // 模板下载
    async download(repo, tag) {
        const requestUrl = `muzhe1228/${repo}${!tag ? '' : '#' + tag}`
        await wrapLoading(
            this.downloadGitRepo,
            'waiting template downloading',
            requestUrl,
            path.resolve(process.cwd(), this.targetDir)
        )
    }

    // 核心创建逻辑
    async create() {
        const repo = await this.getRepo()
        const tag = await this.getTag(repo)

        await this.download(repo, tag)
        console.log(`cd ${chalk.cyan(this.name)}`)
    }
}

// 增加交互
async function wrapLoading(fn, message, ...args) {
    const spinner = ora(message)

    spinner.start()

    try {
        const result = await fn(...args)

        spinner.succeed()
        return result
    } catch (error) {
        // failed
    }
}

module.exports = Generator