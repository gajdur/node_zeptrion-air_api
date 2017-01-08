module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jsdoc: {
            dist: {
                src: ['*.js', 'test/*.js', 'src/**/*.js'],
                options: {
                    destination: 'doc',
                    template: "node_modules/ink-docstrap/template",
                    configure: "node_modules/ink-docstrap/template/jsdoc.conf.json"
                }
            }
        },
        jsdoc2md: {
            oneOutputFile: {
                src: ['*.js', 'test/*.js', 'src/**/*.js'],
                dest: 'api/documentation.md'
            }
        }
    });

    grunt.loadNpmTasks('grunt-jsdoc');
    grunt.loadNpmTasks('grunt-jsdoc-to-markdown');

    grunt.registerTask('default', ['jsdoc', 'jsdoc2md']);
    grunt.registerTask('test', ['jsdoc2md']);
}
