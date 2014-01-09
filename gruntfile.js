module.exports = function(grunt){

	require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

		less: {
		  development: {
		    files: {
		      "h0110w.css": "h0110w.less"
		    }
		  }
		},

		uglify: {
			dependencies: {
			  files: {
			    'js/dependencies.min.js': ['js/dependencies/*.js']
			  }
			},
			app: {
				files: {
					'js/h0110w.min.js': ['js/h0110w.js'],
					'js/h0110w2.min.js': ['js/h0110w2.js']
				}
			}

		},

		watch: {
		    css: {
		        files: ['*.less'],
		        tasks: ['buildcss']
		    },
		    js: {
		    	files: ['js/**/*.js','!js/**/*.min.js'],
		    	tasks: ['buildjs']
		    }
		}

    });

    grunt.registerTask('default', ['build']);

	grunt.registerTask('buildcss',  ['less']);
	grunt.registerTask('buildjs',  ['uglify']);

	grunt.registerTask('build',  ['buildcss', 'buildjs']);
};