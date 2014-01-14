$( document ).ready( function() {

	var text = $( '.content' ).html();

	var table = $( '<table></table>' );


	// original 

	var tr = $( '<tr><td>original</td><td>' + text.length + '</td><td></td></tr>' );
	tr.appendTo( table );	


	// base64

	var time_start = new Date();
	var output = $.base64.encode( text );
	var time_end = new Date() - time_start;

	var ratio = parseInt( ( output.length / text.length * 100 ) );

	var tr = $( '<tr><td>base64</td><td>' + output.length + ' (' + ratio + '%)</td><td>' + time_end + 'ms</td><td>' + output + '</td></tr>' );
	tr.appendTo( table );


	// lzwCompress
	var time_start = new Date();
	var output = lzwCompress.pack( { 'text' : text } );
	var time_end = new Date() - time_start;

	var ratio = parseInt( ( output.length / text.length * 100 ) );

	var tr = $( '<tr><td>lzwCompress</td><td>' + output.length + ' (' + ratio + '%)</td><td>' + time_end + 'ms</td><td>' + output + '</td></tr>' );
	tr.appendTo( table );


	table.prependTo( 'body' );

	// lzstring
	var time_start = new Date();
	var output = LZString.compress( text );
	var time_end = new Date() - time_start;

	var ratio = parseInt( ( output.length / text.length * 100 ) );

	var tr = $( '<tr><td>LZString</td><td>' + output.length + ' (' + ratio + '%)</td><td>' + time_end + 'ms</td><td>' + output + '</td></tr>' );
	tr.appendTo( table );


	// lzstring UTF16
	var time_start = new Date();
	var output = LZString.compressToUTF16( text );
	var time_end = new Date() - time_start;


	var ratio = parseInt( ( output.length / text.length * 100 ) );

	var tr = $( '<tr><td>LZString UTF16</td><td>' + output.length + ' (' + ratio + '%)</td><td>' + time_end + 'ms</td><td>' + output + '</td></tr>' );
	tr.appendTo( table );

	table.prependTo( 'body' );


	// lzstring base64
	var time_start = new Date();
	var output = LZString.compressToBase64( text );
	var time_end = new Date() - time_start;


	var ratio = parseInt( ( output.length / text.length * 100 ) );

	var tr = $( '<tr><td>LZString base64</td><td>' + output.length + ' (' + ratio + '%)</td><td>' + time_end + 'ms</td><td>' + output + '</td></tr>' );
	tr.appendTo( table );

	table.prependTo( 'body' );



	// lz77

	/*
	console.log( LZ77 );

	var time_start = new Date();
	var output = LZ77.compress( text );
	var time_end = new Date() - time_start;


	var ratio = parseInt( ( output.length / text.length * 100 ) );

	var tr = $( '<tr><td>lz77</td><td>' + output.length + ' (' + ratio + '%)</td><td>' + time_end + 'ms</td><td>' + output + '</td></tr>' );
	tr.appendTo( table );
	*/

	table.prependTo( 'body' );

});