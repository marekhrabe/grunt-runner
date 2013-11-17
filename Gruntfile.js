module.exports = function (grunt) {

	var banner = grunt.file.readJSON('package.json').banner;

	grunt.loadNpmTasks('grunt-recess');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-htmlmin');
	grunt.loadNpmTasks('grunt-plugin-angular-template-inline');
	grunt.loadNpmTasks('grunt-node-webkit-builder');
	grunt.loadNpmTasks('grunt-rename');

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		src: {
			js: ['src/**/*.js', 'dist/tmp/**/*.js'],
			libs: ['libs/*.js'],
			html: ['src/index.html'],
			templates: ['src/modules/**/*.html'],
			less: ['libs/*.less', 'src/modules/**/*.less'],
		},
		clean: {
			dist: {
				src: ['dist']
			},
			tmp: {
				src: ['src/tmp', 'tmp', 'dist/tmp']
			},
			less: {
				src: ['dist/style.less']
			},
			old_nw: {
				src: ['bin/Grunt.app'],
			},
			nw: {
				src: ['bin/releases'],
			},
		},
		concat: {
			options: {
				separator: '\n',
			},
			less: {
				src: ['<%= src.less %>'],
				dest: 'dist/style.less',
			},
		},
		rename: {
			nw: {
				src: 'bin/releases/grunt/mac/Grunt.app',
				dest: 'bin/Grunt.app',
			},
		},
		copy: {
			assets: {
				files: [
					{
						expand: true,
						cwd: 'src/assets/',
						src: '**',
						dest: 'dist/assets/',
					},
				],
			},
			dist: {
				files: [
					{
						expand: true,
						cwd: 'dist/',
						src: '**',
						dest: 'tmp/',
					},
					{
						expand: true,
						cwd: '.',
						src: 'package.json',
						dest: 'tmp/',
					}
				],
			},
			node_modules: {
				files: [
					{
						expand: true,
						cwd: 'libs/node_modules/',
						src: '**/*',
						dest: 'dist/node_modules/',
					}
				],
			},
			icon: {
				files: [
					{
						expand: true,
						cwd: 'src/assets/',
						src: 'nw.icns',
						dest: 'bin/Grunt.app/Contents/Resources/',
					},
				],
			},
		},
		recess: {
			less: {
				options: {
					compile: true,
					compress: true,
				},
				files: {
					'dist/style.css': ['dist/style.less'],
				}
			}
		},
		watch: {
			files: ['<%= src.js %>', '<%= src.less %>', '<%= src.templates %>', '<%= src.html %>'],
			tasks: ['default', 'timestamp'],
			options: {
				livereload: true,
			},
		},
		uglify: {
			libs: {
				beautify: true,
				files: {
					'dist/libs.js': ['<%= src.libs %>'],
				},
			},
			app: {
				options: {
					banner: '/*!\n * ' + banner.join('\n * ') + '\n */\n',
					preserveComments: false,
					mangle: false,
					compress: {
						unused: false,
					},
				},
				files: {
					'dist/app.js': ['<%= src.js %>'],
				}
			},
		},
		htmlmin: {
			index: {
				options: {
					removeComments: true,
					collapseWhitespace: true,
					collapseBooleanAttributes: true,
					removeAttributeQuotes: true,
				},
				files: {
					'dist/index.html': 'dist/index.html',
				},
			},
			templates: {
				options: {
					removeComments: true,
					collapseWhitespace: true,
					collapseBooleanAttributes: true,
					removeAttributeQuotes: true,
				},
				expand: true,
				cwd: 'src/modules/',
				src: ['**/*.html'],
				dest: 'src/tmp/',
			},
		},
		angularTemplateInline: {
			templates: {
				files: [
					{
						src: ['src/tmp/**/*.html'],
						dest: 'dist/index.html',
						baseFile: 'src/tmp/index.html',
					},
				],
			}
		},
		nodewebkit: {
			options: {
				version: '0.7.5',
				build_dir: 'bin',
				mac: true,
				win: false,
				linux32: false,
				linux64: false,
			},
			src: 'tmp/**/*',
		},
	});


	grunt.registerTask('indexBanner', function () {
		var contents = grunt.template.process(grunt.file.read('dist/index.html').replace('<head>', '<head>\n<!--\n ' + banner.join('\n ') + '\n-->\n'));
		grunt.file.write('dist/index.html', contents);
	});

	grunt.registerTask('cssBanner', function () {
		grunt.file.write('dist/style.css', '/*!\n * ' + grunt.template.process(banner.join('\n * ')) + '\n */\n' + grunt.file.read('dist/style.css'));
	});

	// prints a timestamp
	grunt.registerTask('timestamp', function () {
		grunt.log.subhead(Date());
	});

	grunt.registerTask('index', 'Process index.html', function (){
		grunt.file.copy('src/index.html', 'dist/index.html');
		grunt.log.writeln('Index copied.');
	});

	grunt.registerTask('default', ['copy:assets', 'html', 'css', 'js']);

	grunt.registerTask('html', ['index', 'htmlmin:templates', 'angularTemplateInline:templates', 'htmlmin:index', 'indexBanner', 'clean:tmp']);
	grunt.registerTask('css', ['concat:less', 'recess:less', 'clean:less', 'cssBanner']);
	grunt.registerTask('libs', ['uglify:libs']);
	grunt.registerTask('js', ['uglify:app']);

	grunt.registerTask('bin', ['default', 'copy:node_modules', 'copy:dist', 'nodewebkit', 'clean:old_nw', 'rename:nw', 'copy:icon', 'clean:tmp', 'clean:nw']);
};
