<?php

class Hollow {

    public $markup_rules = array (
        '/\[([^\[]+)\]\(([^\)]+)\)/' => '<a href=\'\2\'>\1</a>',    // links
        '/(__)(.*?)\1/' => '<strong>\2</strong>',                   // bold
        '/(_)(.*?)\1/' => '<em>\2</em>',                           // emphasis
        '/(--)(.*?)\1/' => '<del>\2</del>',                       // del
        '/\|/' => '<br/>',                                        // line break

    );


    public function __counstruct() {


    }

    public function filter() {

        if( filter_input( INPUT_GET, 'hollow', FILTER_SANITIZE_STRING ) != '' ) {

            return htmlspecialchars( filter_input( INPUT_GET, 'hollow', FILTER_SANITIZE_STRING ), ENT_NOQUOTES, 'UTF-8' );        

        } else {

            return file_get_contents( 'intro.html' );

        }

    }

    /*

    public function markup( $text ) {

        
        foreach( $this->markup_rules as $regex => $replacement ) {
        
            $text = preg_replace( $regex, $replacement, $text );
        
        }
        
        return trim( $text );
    
    }

    */

    public function write() {

        $in = $this->filter();

        $out = rawurldecode( $in );

        echo $out;

    }

}