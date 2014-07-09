module.exports = function (grunt) {

	// load the task


	grunt.initConfig(
		{

			ts:
			{
				dev: {
					src: [
						"./ts/views/**/*.html.ts",
						"./ts/*.ts"
					],        // The source typescript files, http://gruntjs.com/configuring-tasks#files
					html: ["./ts/views/**/*.html"], // The source html files, https://github.com/basarat/grunt-ts#html-2-typescript-support
					reference: "./ts/reference.ts",  // If specified, generate this file that you can use for your reference management
					//watch: './ts',                     // If specified, watches this directory for changes, and re-runs the current target
					outDir:'./build',
					options: {                         // use to override the default options, http://gruntjs.com/configuring-tasks#options
						target: 'es3',                 // 'es3' (default) | 'es5'
						module: 'commonjs',            // 'amd' (default) | 'commonjs'
						sourceMap: false,               // true (default) | false
						declaration: true,            // true | false (default)
						removeComments: true,           // true (default) | false
						fast:"never"
					}
				},
				tests: {
					src: [
						"./tests/*.ts"
					],        // The source typescript files, http://gruntjs.com/configuring-tasks#files
					outDir:'./tests',
					options: {                         // use to override the default options, http://gruntjs.com/configuring-tasks#options
						target: 'es3',                 // 'es3' (default) | 'es5'
						module: 'commonjs',            // 'amd' (default) | 'commonjs'
						sourceMap: false,               // true (default) | false
						declaration: false,            // true | false (default)
						removeComments: false,           // true (default) | false
						fast:"never"
					}
				}
			},

			watch: {
				typescriptDev: {
					files: ['./ts/*.ts'],
					tasks: ['ts:dev','clean:dev','copy:dev']
				},
				typescriptTests: {
					files: ['./tests/*.ts'],
					tasks: ['ts:tests']
				}
			},
			clean:{
				dev:['build/.baseDir.d.ts','build/.baseDir.js']
			},
			copy:{
				dev:{
					files:[{expand: true, src: ['build/**'], dest: 'tests'}]
				}
			},
			uglify: {
				dev: {
					files: {
						'build/typescript-serializer.min.js': ['build/Serializer.js']
					}
				}
			}


		});


	grunt.loadNpmTasks("grunt-ts");
	grunt.loadNpmTasks("grunt-contrib-watch");
	grunt.loadNpmTasks("grunt-contrib-copy");
	grunt.loadNpmTasks("grunt-contrib-clean");
	grunt.loadNpmTasks("grunt-contrib-uglify");


	grunt.registerTask("default", ["watch"]);
	grunt.registerTask("build", ['ts:dev','clean:dev','uglify','copy:dev']);

}