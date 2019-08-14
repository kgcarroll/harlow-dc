<?php

add_action ('init', 'init_template');

function init_template(){
  setup_template_theme();
  add_action( 'wp_enqueue_scripts', 'enqueue_template_scripts' );
  add_action( 'wp_enqueue_scripts', 'enqueue_template_styles' );
}

// Override 'Howdy' message, because we're professionals.
function howdy_message($translated_text, $text, $domain) {
  $new_message = str_replace('Howdy', 'Welcome', $text);
  return $new_message;
}
add_filter('gettext', 'howdy_message', 10, 3);


function setup_template_theme(){
  // Remove added padding from Admin Bar
  add_action('get_header', 'remove_admin_login_header');
  function remove_admin_login_header() {
    remove_action('wp_head', '_admin_bar_bump_cb');
  }

  // Setting up theme
  if (function_exists('add_theme_support')) {
    add_theme_support('menus');
    add_theme_support( 'post-thumbnails' );
  }

  if (function_exists('register_sidebar')){
    register_sidebar(array('name'=>'Sidebar %d'));
  }

  if (function_exists('register_nav_menu')) {
    register_nav_menu( 'main_menu', 'Main Menu' );
    register_nav_menu( 'secondary_menu', 'Secondary Menu' );
    register_nav_menu( 'mobile_menu', 'Priority Menu' );
  }

  if (function_exists('add_image_size')){
    // Generic responsive sizes 
    add_image_size('gallery-thumb', 200, 130, true);
    add_image_size('gallery-mobile', 768, 429);
    add_image_size('gallery-large', 1024, 572);
    add_image_size('mobile', 375, 260);
    add_image_size('floorplan-thumb', 240, 270);
    add_image_size('blog', 1475, 875, true);
  }

  if( function_exists('acf_add_options_page') ) {
    acf_add_options_page();
  }

  // Set Google Maps API for Advanced Custom Fields use
  function my_acf_google_map_api( $api ){
      $api['key'] = 'AIzaSyBLGDbL7PkNbZLKg2BRtIb6anAkSnl0Y_Y';
      return $api;
  }
  add_filter('acf/fields/google_map/api', 'my_acf_google_map_api');
}




function enqueue_template_styles() {

  // Style Sheet Theme Information
  wp_register_style('style-css', get_bloginfo('template_directory') . '/style.css' );
  wp_enqueue_style('style-css');

  // Core Stylesheet (compiled sass)
  wp_register_style('screen-css', get_bloginfo('template_directory') . '/css/screen.css' );
  wp_enqueue_style('screen-css');

  // Slick CSS
  wp_register_style('slick-css','https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css');
  wp_enqueue_style('slick-css');

  // Icomoon CSS
  wp_deregister_style( 'icomoon' ); // Icomoon
  wp_register_style('icomoon','//s3.amazonaws.com/icomoon.io/145852/UntitledProject/style.css?5cx1k1');
  wp_enqueue_style('icomoon');

}

function enqueue_template_scripts() {
  wp_deregister_script( 'jquery' ); // Google hosted jQuery
  wp_register_script( 'jquery', '//code.jquery.com/jquery-3.3.1.min.js' );
  wp_enqueue_script( 'jquery' );

  wp_deregister_script( 'shiv' ); // Google hosted jQuery
  wp_register_script( 'shiv', get_bloginfo('template_directory') . '/js/html5shiv.js' );
  wp_enqueue_script( 'shiv' );
    
  wp_deregister_script( 'skrollr' ); // Skrollr
  wp_register_script( 'skrollr', '//cdnjs.cloudflare.com/ajax/libs/skrollr/0.6.30/skrollr.min.js', array ( 'jquery','shiv' ), false, true );
  wp_enqueue_script( 'skrollr' );

  wp_deregister_script( 'font-awesome' ); // Font awesome script
  wp_register_script('font-awesome','//use.fontawesome.com/releases/v5.0.8/js/all.js');
  wp_enqueue_script('font-awesome');


  wp_deregister_script( 'custom-js' ); // Combined theme scripts
  wp_register_script( 'custom-js', get_bloginfo('template_directory') . '/js/src/template.js', array ( 'jquery' ), false, true );
  wp_enqueue_script( 'custom-js' );
  
  if(is_page_template('page-templates/neighborhood.php')){
    // Google Maps API
    wp_deregister_script( 'google-maps' ); // Google Maps API
    wp_register_script( 'google-maps', 'https://maps.googleapis.com/maps/api/js?key=AIzaSyBLGDbL7PkNbZLKg2BRtIb6anAkSnl0Y_Y' );
    wp_enqueue_script( 'google-maps' );
    
    // Map JS
    // wp_register_script( 'poi-map-js', get_bloginfo('template_directory') . '/js/src/map.js', array ( 'google-maps' ), false, true);
    wp_register_script( 'poi-map-js', get_bloginfo('template_directory') . '/js/src/poi-map.js', array ( 'google-maps' ), false, true);
    wp_enqueue_script( 'poi-map-js' );
  }

  elseif(is_page_template('page-templates/gallery.php')) {

    wp_register_script('slick-js', '//cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick.min.js', array ( 'jquery' ), false, true );
    wp_enqueue_script('slick-js');

    wp_deregister_script('gallery-js');
    wp_register_script('gallery-js', get_bloginfo('template_directory') . '/js/src/slick-gallery.js', array ( 'jquery', 'slick-js' ), false, true );
    wp_enqueue_script('gallery-js');
  }

  $ajax_theme_data = array(
    'templateURL' => get_bloginfo('template_directory')
  );
  wp_localize_script('custom-js', 'themeData', $ajax_theme_data);
}

// Adds page slug to Body Class function
function add_slug_body_class( $classes ) {
	global $post;
	if ( isset( $post ) ) {
		$classes[] = $post->post_type . '-' . $post->post_name;
	}
	return $classes;
}
add_filter( 'body_class', 'add_slug_body_class' );

// Returns property schema data
function mtc_print_microdata() {
	$microdata = array();
	if (is_page_template('page-templates/contact.php')) {
		// Creating the contact page microdata
		$contactMicrodata = array(
			'@context' => 'http://schema.org',
			'@type' => 'ContactPage'
		);

		// Adding The Elms microdata and then the Contact Page Microdata
		array_push($microdata, mtc_get_microdata());
		array_push($microdata, $contactMicrodata);

	} else {
		$microdata = mtc_get_microdata();
	}

	echo '<script type="application/ld+json">';
	echo json_encode($microdata, JSON_PRETTY_PRINT);
	echo '</script>';
}

function mtc_get_microdata() {
	if (function_exists('get_option')){
		$microdata = array(
			'@context' => 'http://schema.org',
			'@type' => 'Organization',
			'name' => get_field('property_name', 'options'),
			'address' => array(
				'@type' => 'PostalAddress',
				'streetAddress' => get_field('address', 'options'),
				'addressLocality' => get_field('city', 'options').', '.get_field('state', 'options'),
				'postalCode' => get_field('zip', 'options'),
			),
			'telephone' => get_field('phone', 'options'),
			'url' => get_home_url()
		);
		if ($header_logo = get_field('header_logo','options')){
			$microdata['logo'] = $header_logo['url'];
		}
		return $microdata;
	}
}

// Takes an alphabetic character and returns the phone numeric equivalent
function alpha_to_phone($char){
	$conversion = array('a' => 2, 'b' => 2, 'c' => '2', 'd' => 3, 'e' => 3, 'f' => 3, 'g' => 4, 'h' => 4, 'i' => 4, 'j' => 5, 'k' => 5, 'l' => 5, 'm' => 6, 'n' => 6, 'o' => 6, 'p' => 7, 'q' => 7, 'r' => 7, 's' => 7, 't' => 8, 'u' => 8, 'v' => 8, 'w' => 9, 'x' => 9, 'y' => 9, 'z' => 9);
	return $conversion[$char];
}

// Takes phone number, returns cleaned numeric equivalent for mobile link functionality
function clean_phone($phone){
	$chars = str_split(strtolower($phone));
	$phone = '';
	foreach($chars as $char){
		if (ctype_lower($char)){
			$char = alpha_to_phone($char);
		}
		$phone .= $char;
	}
	$phone = preg_replace("/[^0-9]/", "",$phone);
	return $phone;
}

// Create Site Options - uncomment if needed.
 require_once( get_template_directory() . '/incl/acf_site_options.php' );

// Custom Functions
require_once( get_template_directory() . '/incl/custom-functions.php' );