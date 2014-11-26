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

		imagemin: {
			all: {                        
				files: [{
					expand: true,  
					cwd: 'img/src',
					src: ['**/*.{png,jpeg,jpg,gif}'],
					dest: 'img/'
		     	}]
		    }
	    },

	    svgmin: {                      
	        options: {                 
	            plugins: [
	              { removeViewBox: false },
	              { removeUselessStrokeAndFill: false }
	            ]
	        },
	        dist: {                    
	            files: [{              
	                expand: true,       
	                cwd: 'img/src',     
	                src: ['**/*.svg'],  
	                dest: 'img/'       
	            }]
	        }
	    },

	    svg2png: {
	        all: {
	            files: [{ 
	            	src: ['img/*.svg'], 
	            	dest: 'img/' 
	            }]
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
		    },
		    img_raster: {
		    	files: ['img/src/**.{jpg,jpeg,gif,png}'],
		    	tasks: ['buildimages_raster']
		    },
		    img_vector: {
		    	files: ['img/src/**.svg'],
		    	tasks: ['buildimages_vector']
		    }
		}

    });

    grunt.registerTask('default', ['build']);

	grunt.registerTask('buildcss',  ['less', 'autoprefixer']);
	grunt.registerTask('buildjs',  ['uglify']);
	grunt.registerTask( 'buildimages',  ['imagemin', 'svgmin', 'svg2png'] );
	grunt.registerTask( 'buildimages_raster',  ['imagemin'] );
	grunt.registerTask( 'buildimages_vector',  ['svgmin', 'svg2png'] );

	grunt.registerTask('build',  ['buildcss', 'buildjs', 'buildimages']);
};