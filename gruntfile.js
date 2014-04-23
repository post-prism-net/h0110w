module.exports = function(grunt){

	require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

		less: {
		  development: {
		    files: {
		      "css/h0110w.css": "css/h0110w.less"
		    }
		  }
		},

		autoprefixer: {
		    style: {
		      src: 'css/h0110w.css',
		      dest: 'css/h0110w.css'
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
					'js/h0110w.min.js': ['js/h0110w.js']
				}
			}

		},
		
		watch: {
		    css: {
		        files: ['css/*.less'],
		        tasks: ['buildcss']
		    },
		    js: {
		    	files: ['js/**/*.js','!js/**/*.min.js'],
		    	tasks: ['buildjs']
		    }
		}

    });

    grunt.registerTask('default', ['build']);

	grunt.registerTask('buildcss',  ['less', 'autoprefixer']);
	grunt.registerTask('buildjs',  ['uglify']);

	grunt.registerTask('build',  ['buildcss', 'buildjs']);
};