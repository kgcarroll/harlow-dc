<?php

// This file holds the different custom functions.  Most of these functions refer to
// fields created with the ACF plugin, and will not work unless the fields have been defined.
// There is a .json file that is included with the respository that can be imported to create the fields.

// Responsive Images for ACF fields
function print_responsive_image($image,$image_size,$max_width){
  // Check the image ID is not blank
  if($image['ID'] != '') {
    // Set the default src image size
    $image_src = wp_get_attachment_image_url( $image['ID'], $image_size );
    // Set the srcset with various image sizes
    $image_srcset = wp_get_attachment_image_srcset( $image['ID'], $image_size );
    // Generate the markup for the responsive image
    return 'src="'.$image_src.'" srcset="'.$image_srcset.'" sizes="(max-width: '.$max_width.') 100vw, '.$max_width.'"';
  }
}

function print_lease_link() {
  if($lease = get_field('lease_now_link','options')) {
    echo '<div id="lease-now" class="">';
      echo '<a href="'.$lease.'" target="_blank">Lease Now <span class="icon-arrow"></span></a>';
    echo '</div>';
  }
}

// Header functions
function print_logo(){
  if($logo = get_field('logo', 'options')) {
    echo '<div id="logo">';
 	  	echo '<a href="'. home_url('') .'">';
        echo '<img '.print_responsive_image($logo,'full', '180px').'  alt="'.$logo['alt'].'" />';
    	echo '</a>';
    echo '</div>';
  }
}

function print_trigger() {
  echo '<div id="nav-trigger-container">';
    echo '<div id="nav-trigger" class="" aria-label="Open Navigation" aria-pressed="false">';
      echo '<div class="trigger-wrap">';
  	    echo '<span class="line"></span>';
  	    echo '<span class="line"></span>';
        echo '<div class="label">Menu</div>';
      echo '</div>';
    echo '</div>';
  echo '</div>';
}

function print_specials_flyout($class) {
  $title = get_field('title','options');
  echo '<div id="slideout" aria-expanded="" role="region" class="inactive slideout">';
    echo '<div class="outer-wrapper">';
      echo '<div class="button-wrap '.$class.'" role="button" tabindex="0" aria-label="Open Special Content" aria-pressed="false">Specials</div>';
      echo '<div class="inner-wrap">';
        echo '<div class="content">';
         echo '<div class="title">'.$title.'</div>';
          if($copy = get_field('copy','options')) {
            echo '<div class="copy">'.$copy.'</div>';
          }
        echo '</div>';
      echo '</div>';
     echo '</div>';
  echo '</div>';
}

// Print the pops out if it meets the logic below.
// function print_specials() {
function print_popouts(){
  $signupActivated = !get_field('hide_sign_up_form', 'options');
  $specialActivated = get_field('activate_specials','options');

  // Check if scheduled. (Overrides default activation switch.)
  if($scheduled = get_field('schedule_specials','options')) {
    $start = strtotime(get_field('start_time','options'));
    $end = strtotime(get_field('end_time','options'));
    $today = (time() - 14400);  // UTC with 4 hours subtracted to make Eastern Time.
    // Checks to make sure today is within scheduled time.
    if($today >= $start && $today <= $end) {
      if ($signupActivated) {
        print_signup('half'); 
        print_specials_flyout('half');
      } else {
        print_specials_flyout('full');
      }

    }
  }
  // Print both, if both active.
  elseif ($signupActivated && $specialActivated) {
    print_signup('half');
    print_specials_flyout('half');
  }
  // Print specials if active, and sign up inactive
  elseif (!$signupActivated && $specialActivated) {
    print_specials_flyout('full');
  }
  // Print sign up if active, and specials inactive
  elseif ($signupActivated && !$specialActivated) {
    print_signup('full');
  }
}


// Print Signup.
function print_signup($class){
  echo '<div id="signup" aria-expanded="" role="region" class="inactive slideout">';
    echo '<div class="outer-wrapper">';
      echo '<div class="button-wrap '.$class.'" role="button" tabindex="0" aria-label="Open Sign Up Form" aria-pressed="false">Sign Up</div>';
      echo '<div class="inner-wrap">';
        echo FrmFormsController::get_form_shortcode( array( 'id' => 3, 'title' => false, 'description' => false ) );
      echo '</div>';
    echo '</div>';
  echo '</div>';
}

function print_social(){
  if ($rows = get_field('social_media','options')){
    echo '<div class="icons social">';
      foreach($rows as $row){
        echo '<a class="icon" href="'.$row['url'].'" target="_blank">';
       		echo '<i class="fab '.$row['social_media_type'].'"></i>';
        echo '</a>';
      }
    echo '</div>';
  }
}

// Footer functions
function print_phone_number(){
  if ($phone = get_field('phone','options')){
    echo '<div class="phone">';
      echo '<a href="tel:+1'.clean_phone($phone).'" class="phone-number">'.$phone.'</a>';
    echo '</div>';
  }
}

function print_schedule_tour() {
  if($tour = get_field('schedule_tour','options')) {
    echo '<div class="schedule-tour">';
      echo '<a href="'.$tour.'"><i class="fas fa-calendar-alt"></i></a>';
    echo '</div>';
  }
}

function print_chat(){
  if($chat = get_field('chat_link','options')) {
    echo '<div class="chat-link">';
      echo '<a href="'.$chat.'" target="_blank"><i class="fas fa-comments"></i></a>';
    echo '</div>';
  }
}

function print_address() {
  $address = get_field('address','options');
  $city = get_field('city','options');
  $state = get_field('state','options');
  $zip = get_field('zip','options');
  if($address){
      echo '<div class="address">';
        echo '<a href="https://www.google.com/maps/place/'.$address.'+'.$city.'+'.$state.'+'.$zip.'" class="'.$class.'" target="_blank">';
          echo '<span class="line">'.$address.'</span><span class="break">, </span><span class="line">'.$city.', '.$state.' '.$zip.'</span></a>';
      echo '</div>';
    }
}

function print_plain_address() {
  $address = get_field('address','options');
  $city = get_field('city','options');
  $state = get_field('state','options');
  $zip = get_field('zip','options');
  if($address){
      echo '<div class="address"><span class="line">'.$address.'</span><span class="break">, </span><span class="line">'.$city.', '.$state.' '.$zip.'</span></a></div>';
    }
}

function print_directions() { 
  $directions_link = get_field('google_place_directions_link','options');
  $address = get_field('address','options');
  $city = get_field('city','options');
  $state = get_field('state','options');
  $zip = get_field('zip','options');
  $lat = get_field('latitude','options');
  $long = get_field('longitude','options');
  if($directions_link) {
    echo '<div class="directions">';
      echo '<a href="'.$directions_link['url'].'" target="'.$directions_link['target'].'">'.$directions_link['title'].' <span class="icon-arrow"></span></a>';
    echo '</div>';
  } elseif($address){
    echo '<div class="directions">';
      echo '<a href="//www.google.com/maps/dir//'.$address.',+'.$city.',+'.$state.'+'.$zip.'/@'.$lat.','.$long.'" target="_blank">Get Directions <span class="icon-arrow"></span></a>';
    echo '</div>';
  }
}



// Header Functions
function print_header_image($prefix=null) {
  if($prefix) {
    $featured_image = get_field($prefix.'featured_image','options');
    $headline = get_field($prefix.'concept_headline','options');
  } else {
    $featured_image = get_field('featured_image');
    $headline = get_field('concept_headline');
  }
  if($featured_image) {
    echo '<div id="main-image-content">';
      echo '<img class="main-image" '.print_responsive_image($featured_image,'full', '1057px').'  alt="'.$featured_image['alt'].'" />';
      echo '<div class="headline-wrapper"><div class="headline"><h2>'.$headline.'</h2></div></div>';
    echo '</div>';
  }
}

function print_blog_header_content() {
  $headline = get_field('headline_h1', get_option('page_for_posts'));
  $copy = get_field('copy', get_option('page_for_posts'));
  if($headline || $copy ) {
    if($headline && $copy) { echo '<div id="main-content">'; }
    else { echo '<div id="main-content" class="solo">'; }
      if($headline) { echo '<h1 class="headline">'.$headline.'</h1>'; }
      if($copy) {
        echo '<div class="copy">';
          echo $copy;
        echo '</div>';
      }
    echo '</div>';
  }
}


function print_blog_footer_buttons(){
  if(is_single() || is_home() || is_archive()) {
    $links = get_field('footer_links', get_option('page_for_posts'));
    if($links) {
      $images = get_field('footer_link_images','options');
      // echo '<pre>'.print_r($images).'</pre>';
      if(!$images) { echo '<div id="footer-links" class="solid">'; }
      else {
        $bg_image = rand(0,(count($images) - 1));
        echo '<div id="footer-links" style="background-image: url('.$images[$bg_image]['url'].'); ">';
      }
        if(count($lists) > 1){ $class = ''; } else { $class = 'solo'; }

        echo '<div class="links '.$class.'">';
          foreach ($links as $page_link) { print_link($page_link['link'],'unskew'); }
        echo '</div>';
      echo '</div>';
    }
  }
}


function print_header_content($prefix=null) {
  if($prefix) {
    $headline = get_field($prefix.'headline_h1','options');
    $copy = get_field($prefix.'copy','options');
    $link = get_field($prefix.'link','options');
  } else {
    $headline = get_field('headline_h1');
    $copy = get_field('copy');
    $link = get_field('link');
  }

  if($headline || $copy ) {
    if($headline && $copy) { echo '<div id="main-content">'; }
    else { echo '<div id="main-content" class="solo">'; }
      if($headline) { echo '<h1 class="headline">'.$headline.'</h1>'; }
      if($copy) {
        echo '<div class="copy">';
          echo $copy;
          if($link) { print_link($link); }
        echo '</div>';
      }
    echo '</div>';
    if (is_page_template('page-templates/thank-you.php')) {
      echo '<div class="icons-wrapper">';
        print_schedule_tour();
        print_social();
      echo '</div>';
    }
  }
}

function print_link($link, $class='button'){
  echo '<div class="button-wrap" role="button">';
    echo '<a class="'.$class.'" target="'.$link['target'].'" href="'.$link['url'].'">';
      echo '<span class="label">'.$link['title'].'<span class="icon-arrow"></span></span>';
    echo '</a>';
  echo '</div>';
}

function print_secondary_content() {
  $secondary_img = get_field('secondary_image');
  $links = get_field('page_links');
  if($secondary_img || $links ) {
    if($secondary_img && $links) { echo '<div id="secondary-content">'; }
    else {
      if($secondary_img) { $class = 'image'; }
      elseif($links) { $class = 'links'; }
      else { $class = ''; }
      echo '<div id="secondary-content" class="'.$class.'">';
    }
    if($secondary_img) { echo '<div class="img-wrap"><img '.print_responsive_image($secondary_img,'full', '713px').'  alt="'.$secondary_img['alt'].'" /></div>'; }
    if($links) {
      echo '<div class="links">';
        foreach ($links as $page_link) { print_link($page_link['link']); }
      echo '</div>';
    }
   echo '</div>';  
 } 
}

function print_amenity_plan_button(){
  if($file = get_field('amenity_plan_pdf')){
    $title = (get_field('amenity_plan_pdf_title') ? get_field('amenity_plan_pdf_title') : 'Download Amenity Plan');
    echo '<div class="pdf-container">';
      echo '<div class="button-wrap" role="button">';
        echo '<a class="button" target="_blank_" href="'.$file['url'].'">';
          echo '<span class="label">'.$title.'<span class="icon-arrow"></span></span>';
        echo '</a>';
      echo '</div>';
    echo '</div>';
  }
}

function print_footer_buttons($prefix=null){
 
  if($prefix) {
    $links = get_field($prefix.'footer_links','options');
  } else {
    $links = get_field('footer_links');
  }

  if($links) {
    $images = get_field('footer_link_images','options');
    // echo '<pre>'.print_r($images).'</pre>';
    if(!$images) { echo '<div id="footer-links" class="solid">'; }
    else {
      $bg_image = rand(0,(count($images) - 1));
      echo '<div id="footer-links" style="background-image: url('.$images[$bg_image]['url'].'); ">';
    }
      if(count($lists) > 1){ $class = ''; } else { $class = 'solo'; }

      echo '<div class="links '.$class.'">';
        foreach ($links as $page_link) { print_link($page_link['link'],'unskew'); }
      echo '</div>';
    echo '</div>';
  }
}

// Features & Amenities
function print_lists(){
  if($lists = get_field('lists')){
    $headline = get_field('list_headline');
    echo '<div id="lists-wrapper">';
      // if($headline) { echo '<h2>'.$headline.'</h2>'; }
      echo '<div class="lists">';
        if(count($lists) > 1){ $class = ''; } else { $class = 'solo'; }
        $count = 0;
        foreach ($lists as $list) { $count++;
          if($count % 2 == 0){ $row = 'even'; } else { $row = 'odd'; }
          echo '<div class="list-row '.$class.' '.$row.'">';
            if($list['image']) { echo '<div class="img-wrap"><img class="list-image" '.print_responsive_image($list['image'],'full', '982px').'  alt="'.$list['image']['alt'].'" /></div>'; }
            if($list['copy'] || $list['link']) {
              echo '<div class="content-wrap">';
                if ($count === 1) { // Check to makes sure we're on first iteration.
                  if($headline) { echo '<h2>'.$headline.'</h2>'; }
                }
                if($list['copy']) { echo '<div class="copy editor">'.$list['copy'].'</div>'; }
                if($list['link']) { print_link($list['link']); }
              echo '</div>';
            }

          echo '</div>';
        }
      echo '</div>';
    echo '</div>';

  }
}

// Contact
function print_office_hours() {
  if($hours = get_field('office_hours','options')) {
    echo '<div class="office-hours">';
      echo '<h3 class="headline">Office Hours</h3>';
      foreach ($hours as $day) {
        echo '<div class="day">'.$day['day'].' '.$day['hours'].'</div>';
      }
    echo '</div>';
  }
}

// Footer
function print_management_logos(){
  echo '<div class="management">';
    // if($developer_link = get_field('developer_link','options')) {
    //   // echo '<div class="developer-wrap">';
    //     // echo '<div class="label">Developed by</div>';
    //     echo '<a href="'.$developer_link['url'].'" target="'.$developer_link['target'].'" title="'.$developer_link['title'].'">';
    //       echo '<span class="icon-fc-logo"></span>';
    //     echo '</a>';
    //   // echo '</div>';
    // } else {
    //   // echo '<div class="developer-wrap">';
    //     // echo '<div class="label">Developed by</div>';
    //     echo '<span class="icon-fc-logo"></span>';
    //     echo '<a href="https://www.urban-atlantic.com" target="_blank"><img class="urban-atlantic-logo" src="'. get_bloginfo('template_directory') .'/images/urban-atlantic-logo.png"></a>';
    //   // echo '</div>';
    // }
    if($management_link = get_field('management_link','options')) {
      // echo '<div class="manager-wrap">';
        // echo '<div class="label">Managed by</div>';
        echo '<a href="'.$management_link['url'].'" target="'.$management_link['target'].'" title="'.$management_link['title'].'">';
         echo '<span class="icon-vantage-management-logo"></span>';
        echo '</a>';
      // echo '</div>';
    } else {
      // echo '<div class="manager-wrap">';
        // echo '<div class="label">Managed by</div>';
        echo '<span class="icon-vantage-management-logo"></span>';
      // echo '</div>';
    }
  echo '</div>';
}

function print_legal_icons(){
  echo '<div class="eho"><span class="icon-eho"></span></div>';
  echo '<div class="accessibility"><span class="icon-accessibility"></span></div>';
}

function print_privacy_policy() {
  // if( function_exists( 'the_privacy_policy_link' )) {
  //   echo '<div class="privacy">';
  //     the_privacy_policy_link( '', '<span role="separator" aria-hidden="true"></span>' );
  //   echo '</div>';
  // }
  echo '<div class="privacy"><a class="privacy-policy-link" target="_blank" href="https://www.vmimgmt.com/privacy-policy">Privacy Policy</a><span role="separator" aria-hidden="true"></span></div>';
}


function print_parallax_1() {
  echo '<div class="parallax" id="parallax-1" data-0="bottom: 0%;" data-end="bottom: 125%;"></div>';
}

function print_parallax_2() {
  echo '<div class="parallax" id="parallax-2" data-0="bottom: -100%;" data-end="bottom: 30%;"></div>';
}

function print_parallax_items() {
  print_parallax_1();
  print_parallax_2();
}

// Saves area data to json file on page save
function save_neighborhood_json($post_id){
  if (get_page_template_slug($post_id) == 'page-templates/neighborhood.php'){
    if ($rows = get_field('points_of_interest_map',$post_id)){
      $pois = array(
        'categories' => array()
      );
      // Categories
      foreach($rows as $category){

        // POI Location
        $locations = array();
        if (!empty($category['pois'])){
          foreach ($category['pois'] as $poi){
            $poi_data = array(
              'name' => $poi['name'],
              'url' => $poi['website']
            );
         if ($poi['address']){
            // echo '<pre>'.print_r($poi['address']).'</pre>';die;
              $poi_data['address'] = str_replace(', United States','',$poi['address']); // Strip country which ACF Google Maps plugin sometimes appends
              $poi_data['lat'] = (float) $poi['address']['lat'];
              $poi_data['lng'] = (float) $poi['address']['lng'];
            }
            $locations[] = $poi_data;
          }
        }

        // Marker information array
        $marker = array();

        // Marker Color
        $marker_color = $category['category_color'];
        if(!$marker_color){ $marker_color = '#000000'; } // in case they didn't set a default

        $marker_data = array(
          'width' => 21,
          'height' => 21,
          'color' => $marker_color
        );
        $marker = $marker_data;

        // Assemble Category Array
        $pois['categories'][] = array(
          'name' => $category['category'],
          'marker' => $marker,
          'pois' => $locations
        );
      }


      if($location = get_field('location','options')) {
        $location['address'] = str_replace(', United States','',$location['address']); // Strip country which ACF Google Maps plugin sometimes appends
        $location['lat'] = (float) $location['lat'];
        $location['lng'] = (float) $location['lng'];
       }

      // Property Information
      $property = array(
        'property_name' => get_bloginfo('name'),
        'address' => get_field('address', 'options'),
        'city' => get_field('city', 'options'),
        'state' => get_field('state', 'options'),
        'zip' => get_field('zip', 'options'),
        'lat' => $location['lat'],
        'lng' => $location['lng']
        
      );
      if ($property_map_marker = get_field('property_map_marker', 'options')){
        $property['property_map_marker'] = array(
          'url' => $property_map_marker['url'],
          'width' => $property_map_marker['width'],
          'height' => $property_map_marker['height']
        );
      }

      $pois['property'] = $property;

      file_put_contents(get_template_directory() . '/JSON/neighborhood.json',json_encode($pois));
    }
  }
}
add_action( 'save_post', 'save_neighborhood_json' );

function print_map() {
  echo '<section id="map-container" aria-label="Points of Interest Map">';
    echo '<div id="categories-container">';
      echo '<ul id="categories"></ul>';
    echo '</div>';
    echo '<div id="map"></div>';
  echo '</section>';
}


// Static Floor Plans
function print_floor_plans() {
  if($units = get_field('floor_plan')) {
    echo '<div id="floorplan-container">';
      foreach ($units as $unit) {
        if($unit['pdf']) {
          echo '<div class="unit-container">';
            echo '<a class="button" target="_blank" href="'.$unit['pdf'].'">';
              echo '<img src="'.$unit['floor_plan_image']['sizes']['floorplan-thumb'].'" />';
              echo '<div class="info-container">';
                echo '<div class="name">'.$unit['unit_name'].'</div>';

                if($unit['townhome']){
                  $bed = $unit['bed'].' Bedroom';
                } else {
                  $bed = ($unit['bed'] > 1 ? $unit['bed'].' Bedrooms' : $unit['bed'].' Bedroom');
                }
                
                $baths = ($unit['bath'] > 1 ? $unit['bath'].' Bathrooms' : $unit['bath'].' Bathroom');
                
                $den = ($unit['den'] == 0 ? '' : ' / Den');
                
                $townhome = ($unit['townhome'] == 0 ? '' : ' Townhome');
                
                echo '<div class="unit-info">'.$bed.$townhome.' / '.$baths.$den.'</div>';
              echo '</div>';
            echo '</a>';
          echo '</div>';
        } else {
          echo '<div class="unit-container">';
            echo '<img src="'.$unit['floor_plan_image']['sizes']['floorplan-thumb'].'" />';
            echo '<div class="info-container">';
              echo '<div class="name">'.$unit['unit_name'].'</div>';
              $bed = ($unit['bed'] > 1 ? $unit['bed'].' Bedrooms' : $unit['bed'].' Bedroom');
              $baths = ($unit['bath'] > 1 ? $unit['bath'].' Bathrooms' : $unit['bath'].' Bathroom');
              $den = ($unit['den'] == 0 ? '' : ' / Den');
              $townhome = ($unit['townhome'] == 0 ? '' : ' Townhome');
              echo '<div class="unit-info">'.$bed.$townhome.' / '.$baths.$den.'</div>';
            echo '</div>';
          echo '</div>';
        }
      }
    echo '</div>';
  }
  if($disclaimer = get_field('disclaimer')){
    echo '<div id="disclaimer">'.$disclaimer.'</div>';
  }
}


// Gallery
function save_gallery_json($post_id){
  if (get_page_template_slug($post_id) == 'page-templates/gallery.php'){
    if ($rows = get_field('gallery',$post_id)){
      $gallery = array();
      // Categories
      foreach($rows as $row){
        // Content
        $content = array();
        if (!empty($row['images'])){
          foreach ($row['images'] as $row2){
            $content[] = array(
              'thumb' => $row2['image']['sizes']['gallery-thumb'],
              'mobile_url' => $row2['image']['sizes']['gallery-mobile'],
              'large_url' => $row2['image']['sizes']['gallery-large'],
              'full_url' => $row2['image']['url'],
              'img_width' => $row2['image']['sizes']['gallery-large-width'],
              'full_width' => $row2['image']['width'],
              'caption' => $row2['caption'],
              'alt' => $row2['image']['alt']
            );
          }
        }
        $gallery[] = array(
          'category_name' => $row['category_name'],
          'content' => $content
        );
      }
      file_put_contents(get_template_directory() . '/JSON/gallery.json',json_encode($gallery));
    }
  }
}
add_action( 'save_post', 'save_gallery_json' );


function print_gallery() {
  echo '<div class="gallery-container">';
    echo '<div class="slick-wrapper">';
      echo '<div id="gallery-container">';
        echo '<ul id="categories"></ul>';
      echo '</div>';
      echo '<ul id="slick" class="slick"></ul>';
    echo '</div>';
    echo '<div class="slick-thumbs-wrapper">';
      echo '<ul id="slick-thumbs" class="slick-thumbs" ></ul>';
    echo '</div>';
  echo '</div>';
}


?>