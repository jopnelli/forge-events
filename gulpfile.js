const gulp = require('gulp')
const {series} = require('gulp')
const shell = require('gulp-shell')

gulp.task('install-static-dependencies', shell.task('cd ./static && npm install'))
gulp.task('build-content-byline-item', shell.task('cd ./static/contentBylineItem && rm -rf ./build && npm run build'))
gulp.task('build-modal', shell.task('cd ./static/modal && rm -rf ./build && npm run build'))
gulp.task('run-tests', shell.task('npm run test'))
gulp.task('git-check', shell.task(`
if [[ $(git diff --stat) != '' ]]; then
  exit 125
else
  echo 'Git status is clean'
fi
`))
gulp.task('build', series([/*'git-check', */'build-content-byline-item', 'build-modal']))
