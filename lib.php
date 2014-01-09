<?php

class Shouta {

    public static $markup_rules = array (
        '/\[([^\[]+)\]\(([^\)]+)\)/' => '<a href=\'\2\'>\1</a>',  // links
        '/(\*\*|__)(.*?)\1/' => '<strong>\2</strong>',            // bold
        '/(\*|_)(.*?)\1/' => '<em>\2</em>',                       // emphasis
        '/\~\~(.*?)\~\~/' => '<del>\1</del>',                     // del
        '/\/\//' => '<br/>',                                      // line break

    );


    public static function filter_input() {

        $input = htmlspecialchars( filter_input( INPUT_GET, 'shout', FILTER_SANITIZE_STRING ), ENT_NOQUOTES, 'UTF-8' );

        return $input;

    }


    /**
     * Render some Markdown into HTML.
    */

    public static function render_markup( $text ) {

        $text = $text;
        
        foreach( self::$markup_rules as $regex => $replacement ) {
        
            $text = preg_replace( $regex, $replacement, $text );
        
        }
        
        return trim ( $text );
    
    }

    public static function run( ) {

        $shout = self::render_markup( filter_input() );

        return $shout;

    }

}