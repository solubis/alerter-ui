module.exports = function (grunt) {

    'use strict';

    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

    require('load-grunt-tasks')(grunt);
    require('time-grunt')(grunt);

    grunt.initConfig({
        app: 'demo',
        src: 'src',
        dist: 'dist',
        build: 'build',

        pkg: grunt.file.readJSON('package.json'),

        ngAnnotate: {
            options: {
                sourceMap: false,
                options: {
                    singleQuotes: true
                }
            },
            lib: {
                files: {
                    '<%= build %>/ui.js': [
                        '<%= src %>/**/*.js',
                        '<%= build %>/html.js'
                    ]
                }
            }
        },

        concat: {
            options: {
                separator: ';\n',
                stripBanners: true
            },

            vendor: {
                src: [
                    'lib/jquery/dist/jquery.min.js',
                    'lib/angular/angular.min.js',
                    'lib/angular-animate/angular-animate.min.js',
                    'lib/angular-aria/angular-aria.min.js',
                    'lib/angular-i18n/angular-locale_pl-pl.js',
                    'lib/angular-sanitize/angular-sanitize.min.js',
                    'lib/angular-bootstrap/ui-bootstrap-tpls.min.js',
                    'lib/angular-ui-router/release/angular-ui-router.min.js',
                    'lib/bootstrap/dist/js/bootstrap.min.js',
                    'lib/jquery.easy-pie-chart/dist/jquery.easypiechart.min.js',
                    'lib/jquery.nicescroll/jquery.nicescroll.min.js',
                    'lib/momentjs/min/moment-with-locales.min.js',
                    'lib/velocity/velocity.min.js',
                    'lib/velocity/velocity.ui.min.js',
                    'lib/waves/dist/waves.min.js'
                ],
                dest: 'dist/js/vendor.min.js',
                nonull: true
            },

            vendorDevelop: {
                options: {
                    sourceMap: true,
                    sourceMapStyle: 'embed'
                },
                src: [
                    'lib/jquery/dist/jquery.js',
                    'lib/angular/angular.js',
                    'lib/angular-animate/angular-animate.js',
                    'lib/angular-aria/angular-aria.js',
                    'lib/angular-i18n/angular-locale_pl-pl.js',
                    'lib/angular-sanitize/angular-sanitize.js',
                    'lib/angular-bootstrap/ui-bootstrap-tpls.js',
                    'lib/angular-ui-router/release/angular-ui-router.js',
                    'lib/bootstrap/dist/js/bootstrap.js',
                    'lib/jquery.easy-pie-chart/dist/jquery.easypiechart.js',
                    'lib/jquery.nicescroll/jquery.nicescroll.js',
                    'lib/momentjs/min/moment-with-locales.js',
                    'lib/velocity/velocity.js',
                    'lib/velocity/velocity.ui.js',
                    'lib/waves/dist/waves.js'
                ],
                dest: 'dist/js/vendor.js',
                nonull: true
            },

            libDevelop: {
                options: {
                    sourceMap: true,
                    sourceMapStyle: 'embed'
                },
                files: {
                    '<%= dist %>/js/ui.js': ['<%= src %>/**/*.js', '<%= build %>/html.js']
                }
            },
        },

        html2js: {
            options: {
                base: '<%= src %>',
                module: 'ui.templates',
                quoteChar: '\'',
                useStrict: true

            },
            modules: {
                src: ['<%= src %>/template/**/*.html'],
                dest: '<%= build %>/html.js'
            }
        },

        ts: {
            options: {
                module: "amd",
                sourceMap: true,
                target: "es5",
                removeComments: false
            },
            demo: {
                src: ["<%= app %>/**/*.ts"]
            }
        },

        less: {
            options: {
                sourceMap: true
            },

            lib: {
                options: {
                    sourceMapURL: 'ui.css.map'
                },
                files: {
                    '<%= dist %>/css/ui.css': '<%= src %>/ui.less'
                }
            },

            demo: {
                options: {
                    sourceMapURL: 'app.css.map',
                    sourceMapBasepath: 'public',
                    sourceMaptpath: '/ui/'
                },
                files: {
                    '<%= app %>/styles/app.css': '<%= app %>/styles/app.less'
                }
            }
        },

        cssmin: {
            lib: {
                files: {
                    '<%= dist %>/css/ui.min.css': [
                        '<%= dist %>/css/ui.css'
                    ]
                }
            }
        },

        uglify: {
            options: {
                mangle: true
            },

            lib: {
                files: {
                    '<%= dist %>/js/ui.min.js': [
                        '<%= build %>/ui.js'
                    ]
                }
            }
        },

        copy: {
            dist: {
                files: [{
                    expand: true,
                    cwd: 'lib/material-design-iconic-font/fonts',
                    src: ['**'],
                    dest: '<%= dist %>/fonts/'
                }, {
                    expand: true,
                    cwd: 'src/fonts',
                    src: ['**'],
                    dest: '<%= dist %>/fonts/'
                }, {
                    expand: true,
                    cwd: 'src/images',
                    src: ['**'],
                    dest: '<%= dist %>/images/'
                }, {
                    expand: true,
                    cwd: 'lib/bootstrap/fonts',
                    src: ['**'],
                    dest: '<%= dist %>/fonts/'
                }]
            }
        },

        connect: {
            develop: {
                options: {
                    hostname: '*',
                    port: 3000,
                    open: 'http://localhost:3000/demo/index.html'
                }
            }
        },

        watch: {
            grunt: {
                files: 'gruntfile.js',
                tasks: 'watch'
            },

            less: {
                files: ['<%= src %>/**/*.less', '<%= app %>/**/*.less'],
                tasks: 'less'
            },

            js: {
                files: ['<%= src %>/**/*.js'],
                tasks: 'concat'
            },

            html: {
                files: ['<%= src %>/template/**/*.html'],
                tasks: 'concat'
            },

            ts: {
                files: ['<%= app %>/**/*.ts'],
                tasks: 'ts'
            }
        },

        karma: {
            unit: {
                configFile: 'test/karma.conf.js'
            }
        },

        conventionalChangelog: {
            options: {
                changelogOpts: {
                    preset: 'angular'
                }
            },
            release: {
                src: 'CHANGELOG.md'
            }
        },

        bump: {
            options: {
                files: ['package.json', 'bower.json', '<%= src %>/ui.js'],
                updateConfigs: ['pkg'],
                commit: true,
                commitMessage: 'Release v%VERSION%',
                commitFiles: ['package.json', 'bower.json', 'CHANGELOG.md', '<%= src %>/ui.js', '<%= dist %>/**/*', 'demo/**/*'],
                createTag: true,
                tagName: 'v%VERSION%',
                tagMessage: 'Version %VERSION%',
                push: true,
                pushTo: 'origin',
                gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d',
                globalReplace: false,
                prereleaseName: 'rc',
                regExp: false
            }
        },

        slack: {
            options: {
                endpoint: 'https://hooks.slack.com/services/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',
                username: 'UI Deploy'
            },
            deploy: {
                text: 'A new version of the iQUI (v<%= pkg.version %>) has been deployed, <https://code.impaqgroup.com/fds-components/ui/blob/develop/CHANGELOG.md|Changelog> :rocket:'
            }
        }

    });

    grunt.registerTask('lib', ['html2js', 'ngAnnotate', 'less:lib', 'uglify', 'cssmin', 'copy']);
    grunt.registerTask('demo', ['ts', 'less:demo']);

    grunt.registerTask('compile', ['html2js', 'concat:libDevelop']);
    grunt.registerTask('build', ['lib', 'concat:vendor', 'demo']);
    grunt.registerTask('develop', ['html2js', 'concat:vendorDevelop', 'concat:libDevelop']);

    grunt.registerTask('test', ['connect:develop', 'karma']);
    grunt.registerTask('server', ['connect:develop', 'watch']);
    grunt.registerTask('release', ['bump-only:patch', 'conventionalChangelog', 'build', 'bump-commit', 'slack']);

    grunt.registerTask('default', ['build']);
};
