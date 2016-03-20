import chalk from 'chalk'

export default `
  Usage
    ${chalk.grey('$')} ${chalk.green('trello-burndown')} [${chalk.cyan('build')}/${chalk.cyan('test')}/${chalk.cyan('start')}]

  Options
    ${chalk.italic('-p')}, ${chalk.underline('--production')} Start in production mode
    ${chalk.italic('-d')}, ${chalk.underline('--development')} Start in develepment mode
    ${chalk.italic('-s')}, ${chalk.underline('--staging')} Start in staging mode

  Examples
    ${chalk.grey('$')} ${chalk.green('trello-burndown')} build -p
    ${chalk.grey('$')} ${chalk.green('trello-burndown')} start
`
