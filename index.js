#!/usr/bin/env node

const { program } = require('commander');
const fs = require('fs');
const inquirer = require('inquirer');
const ora = require('ora');
const download = require('download-git-repo');
const handlebars = require('handlebars');


const templates = {
    'st-template': {
        url: 'https://github.com/lcx147258369/st-template',
        downloadUrl: 'https://github.com:lcx147258369/st-template#master',
        description: '视推模板'
    },
    'eight-web-template': {
        url: 'https://github.com/lcx147258369/eight-web-template',
        downloadUrl: 'https://github.com:lcx147258369/eight-web-template#main',
        description: '视推模板'
    }
}

program.version('0.0.1', '-v, --version');

program
    .command('init <template> <project>')
    .description('初始化模板')
    .action((templateName, projectName) => {
        const { downloadUrl } = templates[templateName];
        const spinner = ora('正在下载模板...').start();
        download(downloadUrl, projectName, {clone: true}, (err) => {
            if(err) {
                console.log(err + '下载失败');
                spinner.fail();
                return;
            }
            spinner.succeed();
            inquirer.prompt([
                {
                    type: 'input',
                    name: 'name',
                    message: '请输入项目名称'
                },
                {
                    type: 'input',
                    name: 'description',
                    msessage: '请输入项目简介'
                },
                {
                    type: 'input',
                    name: 'author',
                    message: '请输入作者名称'
                }
            ])
            .then((answers) => {
                const packagePath = `${projectName}/package.json`;
                const packageContent = fs.readFileSync(packagePath, 'utf8');
                const packageResult = handlebars.compile(packageContent)(answers);
                fs.writeFileSync(packagePath, packageResult, 'utf8');
            })
        })
    })
    


program
    .command('list')
    .description('查看所有可用模板')
    .action(() => {
        for(let key in templates) {
            console.log(templates[key].description);
        }
    })

program
    .parse(process.argv);
