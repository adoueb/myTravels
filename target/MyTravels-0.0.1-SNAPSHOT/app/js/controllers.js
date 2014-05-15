/* Strict Mode is a new feature in ECMAScript 5 that allows you to place
 * a program, or a function, in a "strict" operating context. This strict 
 * context prevents certain actions from being taken and throws more exceptions.
 */
'use strict';

/* Controllers */

angular.module('travelApp.controllers', [])
 
// ------------------------------------------------------------------------
// TravelListCtrl controller
// ------------------------------------------------------------------------
.controller('TravelListCtrl', 
            ['$scope', '$log', '$filter', '$timeout', '$upload', 'TravelRest',
		    function($scope, $log, $filter, $timeout, $upload, TravelRest) {
	
    // --------------------------------------------------------------------
    // Initializations.
    // --------------------------------------------------------------------
    $scope.showAddTravelError = false;
    $scope.showUpdateTravelError = false;
    $scope.showDeleteTravelError = false;
    $scope.showEditStopError = false;
    $scope.showUploadImagesTravelError = false;
 
    // Order of travels.
    $scope.orderProp = 'year';

    // Retrieve list of travels from the server.
    /*
    Restangular.all("travels").getList()
	   .then(function(travels) {
		  // List of travels.
	      $log.info('travels loaded');
		  $scope.travels = travels;
	  
		  // Selected travel.
	      if (travels.length >= 1) {
	          $scope.setSelectedTravel(travels[0]);
	      }
    });
    */
    $scope.selectedTravel = null;
    TravelRest.query(function(travels) {
		  // List of travels.
	      $log.info('travels loaded');
		  $scope.initializeTravels(travels);
    }, function() {
    	alert('error while loading the travels');
    });   
	  
    // --------------------------------------------------------------------
    // Map initialization.
    // --------------------------------------------------------------------

	// Enable the new Google Maps visuals until it gets enabled by default.
	// See http://googlegeodevelopers.blogspot.ca/2013/05/a-fresh-new-look-for-maps-api-for-all.html
    google.maps.visualRefresh = true;
      
    // Initialize map.
	$scope.map = {
	            center: {
	    		    latitude: 0,
	    			longitude: 0
	    		},
	    		zoom:23,
	    		draggable: true,
	    		streetViewControl: true,
	    		events: {
	    			tilesloaded: function (map) {
	    				$scope.$apply(function () {
	    					$scope.mapInstance = map;			
	    				});
	    			}
	    		}
    };
	
    // --------------------------------------------------------------------
    // Manage map.
    // --------------------------------------------------------------------
	$scope.setMap = function(position, zoom, markers) {
		$scope.map.center =  {
	        latitude: position.coords.latitude,
	        longitude: position.coords.longitude
	    };
		$scope.map.zoom = (typeof zoom === "undefined") ? 8 : zoom;
		$scope.markers = markers;
    };

	// Call to display map when stops not defined.
	$scope.setDefaultMap = function() {
	    /*
		if(navigator.geolocation) {
            navigator.geolocation.getCurrentPosition($scope.setMap);
		} else {
		    $scope.setMap({coords: {latitude:47, longitude:-122}}, 2);  
		}
		*/
		$scope.setMap({coords: {latitude:47, longitude:-122}}, 2, []);  
    };
	  
	$scope.onMarkerClicked = function (marker) {
	    marker.showWindow = true;
	};
    
    // Compute bounds from stops.
    var computeBounds = function(stops) {
	    var southwest_latitude = stops[0].latitude;
		var southwest_longitude = stops[0].longitude;
		var northeast_latitude = stops[0].latitude;
		var northeast_longitude = stops[0].longitude;
		
		for (var stopIndex=0; stopIndex < stops.length; stopIndex++) {
			var currentStop = stops[stopIndex];
			if (currentStop.latitude < southwest_latitude) {
				southwest_latitude = currentStop.latitude;
			}
			if (currentStop.longitude < southwest_longitude) {
				southwest_longitude = currentStop.longitude;
			}
			if (currentStop.latitude > northeast_latitude) {
				northeast_latitude = currentStop.latitude;
			}
			if (currentStop.longitude > northeast_longitude) {
				northeast_longitude = currentStop.longitude;
			}
		}
		southwest_latitude -= 0.01;
		southwest_longitude -= 0.01;
		northeast_latitude += 0.01;
		northeast_longitude += 0.01;
		
		return {
		    southwest: {
			    latitude: southwest_latitude,
				longitude: southwest_longitude
			},
			northeast: {
			    latitude: northeast_latitude,
			    longitude: northeast_longitude
			}
		};
    };

    // --------------------------------------------------------------------
    // Manage travels.
    // --------------------------------------------------------------------
    // Initialize travels.
    $scope.initializeTravels = function(travels) {
    	$scope.setTravels(travels);
   	  
		// Selected travel.
	    if ($scope.travels.length >= 1) {
	    	
	        $scope.setSelectedTravel($scope.travels[0]);
	    } else {
	        $scope.setSelectedTravel(null);
	    }
    };
    
    // Set travels.
    $scope.setTravels = function(travels) {
    	// Order by date, reverse.
    	// ng-repeat="travel in travels | orderBy:orderProp:true" in HTML.
    	$scope.travels = $filter('orderBy')(travels, $scope.orderProp, true);
    };
    
    $scope.addTravelData = function (travel) {
    	var travelList = $scope.travels;
    	travelList.add(travel);
    	$scope.setTravels(travelList);
    	if (travelList.length == 1) {
    		// First travel creation.
    		$scope.setSelectedTravel($scope.travels[0]);
    	}
    };
	 
    // Set selected travel.
    $scope.setSelectedTravel = function(selectedTravel) {
    	if (selectedTravel != null && selectedTravel != undefined) {
	        // Set selected travel.
	    	$scope.selectedTravel =  selectedTravel;
	    	
	    	// Set map.
	    	if (selectedTravel.itinerary.stops.length >= 1) {
	    	    // Compute southwest and northeast points for all the markers to be displayed.
	    		// Iterate through the stops.
	    	
	    		var bounds = computeBounds(selectedTravel.itinerary.stops);
	    		$scope.map.center = {
		    	    latitude: selectedTravel.itinerary.stops[0].latitude,
		    		longitude: selectedTravel.itinerary.stops[0].longitude
		    	};
	    		$scope.map.zoom = 9;
	    		$scope.map.markers = selectedTravel.itinerary.stops;
	    		$scope.map.bounds = bounds;
		    } else {
		    	$scope.map.markers = [];
		    	$scope.setDefaultMap();
		    }
	    	
	    	// Stops: set icon.
	    	for (var stopIndex=0; stopIndex < $scope.selectedTravel.itinerary.stops.length; stopIndex++) {
			    var currentStop = $scope.selectedTravel.itinerary.stops[stopIndex];
				currentStop.icon = "img/static/blue_Marker" + String.fromCharCode(65 + stopIndex) + ".png";
				currentStop.draggable = true;
	    	}
    	} else {
    		// No selected travel
    		$scope.selectedTravel = null;
    		$scope.setDefaultMap();
    	} 
    		
    };
    
    $scope.refreshTravel = function(id) {
    	TravelRest.queryOne(id, function(travel) {
			  // Travel.
		      $log.info("update travel " + id + " / " + travel.country);
		     
		      // Iterate through travels.
		      for (var indexTravel = 0; indexTravel < $scope.travels.length; indexTravel++) {
		    	  if ($scope.travels[indexTravel].id == travel.id) {
		    		  $scope.travels[indexTravel] = travel;
		    		  // Update selection if so.
		    		  if (id == $scope.selectedTravel.id) {
		    			  $scope.selectedTravel =  travel; 
		    		  }
		    		  break;
		    	  }
		      }
		      $log.info("travel " + id + " / " + travel.country + " refreshed");
	    }, function() {
	    	alert('error while refreshing the travel');
	    }); 
    };
    
    $scope.activeStyle = function(travel) {
    	if (travel.id == $scope.selectedTravel.id) {
    		return {
    			'background-color': '#428BCA'
    		};
    	} else {
    		return {
    			'background-color': ''
    		};
    	}
    };

    // Set edit stop.
	$scope.setEditStop = function(marker) {
		$scope.showEditStopError = false;
	    $scope.setCurrentStop(marker);
	};

    // Set current stop.
	$scope.setCurrentStop = function(marker) {
	    $scope.currentStop = marker;
	};
    
    // --------------------------------------------------------------------
    // Manage stops.
    // --------------------------------------------------------------------
	// Update stop.
	$scope.updateStop = function(stop) {
        // PUT /stops
	    $log.info("update " +  stop.title);
	    $scope.updateTravel($scope.selectedTravel);
	    // TODO: different error
	    $('#updateStop').modal('hide');
    };
    
    // --------------------------------------------------------------------
    // Manage CRUD operations on travels.
    // --------------------------------------------------------------------
    // Create travel.
    $scope.addTravel = function() {
        var newTravel = {year:        $scope.addTravelData.year, 
    			         country:     $scope.addTravelData.country, 
    			         name:        $scope.addTravelData.name, 
    			         description: $scope.addTravelData.description};

	    // POST /travels
	    $log.info("add " +  newTravel.name);
	    /*
	    Restangular.all("travels").post(newTravel).then(function(travels) {
	    	    Restangular.all("travels").getList().then(function(travels) {
	    	        // List of travels.
	 	            $scope.travels = travels;
	    		});
	            $('#addTravel').modal('hide');
	        }, function() {
		        $log.error("There was an error saving");
		        $scope.showAddTravelError = true;
	    });
	    */
	    TravelRest.save(newTravel, function(travels) {
	 	        if ($scope.travels.length == 0) {
	 	        	$scope.initializeTravels(travels);
	 	        } else {
	 	        	$scope.setTravels(travels);
	 	        }
	            $('#addTravel').modal('hide');
	        }, function() {
		        $log.error("There was an error saving");
		        $scope.showAddTravelError = true;
	    });
    };
    
    $scope.canAddTravel = function() {
    	return $scope.addTravelForm.$dirty && $scope.addTravelForm.$valid;
    }
    
    // Update travel.
    $scope.updateTravel = function(travel) {
        // PUT /travels
    	$log.info("update " +  travel.name);
    	/*
    	travel.put().then(function(travels) {
    		    Restangular.all("travels").getList().then(function(travels) {
    	            // List of travels.
 	                $scope.travels = travels;
    		    });
    		    $('#updateTravel').modal('hide');
    	    }, function() {
    			$log.error("There was an error updating");
		        $scope.showUpdateTravelError = true;
		        $scope.showEditStopError = true;
    	});
    	*/
    	TravelRest.update(travel, function(travels) {
    	        // Update list of travels.
    			$scope.setTravels(travels);
 	            $('#updateTravel').modal('hide');
    	    }, function() {
    			$log.error("There was an error updating");
		        $scope.showUpdateTravelError = true;
		        $scope.showEditStopError = true;
    	});
    };
    
    // Delete travel.
    $scope.deleteTravel = function(travel) {
        // DELETE /travels
    	$log.info("delete " +  travel.name);
    	/*
    	travel.remove().then(function(travels) {
    		    Restangular.all("travels").getList().then(function(travels) {
    	            // List of travels.
 	                $scope.travels = travels;
    		    });
		        $('#removeTravel').modal('hide');
		    }, function() {
			    $log.error("There was an error deleting");
		        $scope.showDeleteTravelError = true;
    	});
    	*/
    	TravelRest.remove(travel, function(travels) {
 	        $scope.travels = travels;
 	       if ($scope.selectedTravel.id == travel.id) {
 	    	   // Delete the selected travel.
 	    	   $scope.initializeTravels(travels);	
		   } else {
			   $scope.setTravel(travels);
		   }
 	       $('#removeTravel').modal('hide');
        }, function() {
        	$log.error("There was an error deleting");
	        $scope.showDeleteTravelError = true;
        });
    };

    // Set add travel.
    $scope.setAddTravel = function() {
        $scope.showAddTravelError = false;
    };

    // Set update travel.
    $scope.setUpdateTravel = function(travel) {
        $scope.showUpdateTravelError = false;
    	$scope.setCurrentTravel(travel);
    };

    // Set remove travel.
    $scope.setRemoveTravel = function(travel) {
        $scope.showDeleteTravelError = false;
    	$scope.setCurrentTravel(travel);
    };

    // Set "upload photos" travel.
    $scope.setUploadPhotosTravel = function(travel) {
        $scope.showUploadImagesTravelError = false;
    	$scope.setCurrentTravel(travel);
    };

    // Set current travel.
    $scope.setCurrentTravel = function(travel) {
        $scope.currentTravel = travel;
    };
    
    
    // --------------------------------------------------------------------
    // Photos upload.
    // --------------------------------------------------------------------
    // Upload started.
	$scope.hasUploader = function(index) {
		return $scope.uploaders[index] != null;
	};
	
	// Stop current upload.
	$scope.abort = function(index) {
		$scope.uploaders[index].abort(); 
		$scope.uploaders[index] = null;
	};
	
	// Abort uploads.
	$scope.abortUploads = function() {
		if ($scope.uploaders && $scope.uploaders.length > 0) {
			for (var index = 0; index < $scope.uploaders.length; i++) {
				if ($scope.uploaders[i] != null) {
					$scope.uploaders[i].abort();
				}
			}
		}
	};
	
	// Clear.
	$scope.clearUploads = function(index) {
		if (index == undefined) {
			$scope.selectedFiles = [];
			$scope.dataUrls = [];
			$scope.progress = [];
			$scope.uploaders = [];
			$scope.results = [];
		} else {
			$scope.selectedFiles.splice(index, 1);
			$scope.dataUrls.splice(index, 1);
			$scope.progress.splice(index, 1);
			$scope.uploaders.splice(index, 1);
			$scope.results.splice(index, 1);
		}
	};
	
	// Add files for upload.
	$scope.onFileSelect = function($files) {
		if ($scope.selectedFiles == undefined) {
			$scope.clearUploads();
		}
		var previousFilesCount = $scope.selectedFiles.length;
		
		// Abort the uploads.
		$scope.abortUploads();
		
		$scope.selectedFiles = $scope.selectedFiles.concat($files);

		// Iterate through newly selected files.
		for ( var fileIndex = 0; fileIndex < $files.length; fileIndex++) {
			var $file = $files[fileIndex];
			if (window.FileReader && $file.type.indexOf('image') > -1) {
				var fileReader = new FileReader();
				fileReader.readAsDataURL($files[fileIndex]);
				var loadFile = function(fileReader, index) {
					fileReader.onload = function(e) {
						$timeout(function() {
							$scope.dataUrls[previousFilesCount + index] = e.target.result;
						});
					}
				}(fileReader, fileIndex);
			}
			$scope.progress[previousFilesCount + fileIndex] = -1;
			$scope.results[previousFilesCount + fileIndex] = "";
			if ($scope.uploadRightAway) {
				$scope.start(previousFilesCount + fileIndex);
			}
		}
	};
	
	// Delete file for upload.
	$scope.deleteSelectedFile = function(index) {
		// Abort the uploads.
		$scope.abortUploads();
		
		$scope.clearUploads(index);
	};
	
	// Start upload.
	$scope.start = function(index) {
		$log.info('start ' + index);
		$scope.progress[index] = 0;
		$scope.results[index] = "";
		
		$scope.fileData = {
			"travelId": $scope.currentTravel.id,
			"name": $scope.selectedFiles[index].name,
			"title": $scope.selectedFiles[index].title != undefined ? $scope.selectedFiles[index].title: "",
			"description": $scope.selectedFiles[index].description != undefined ? $scope.selectedFiles[index].description: ""
		};

	    $scope.uploaders[index] = $upload.upload({
	        url: 'upload', //upload.php script, node.js route, or servlet url
	        method: 'POST',
	        headers: {'my-header': 'my-header-value'},
	        // withCredentials: true,
	        data: {fileData: $scope.fileData},
	        file: $scope.selectedFiles[index], // or list of files: $files for html5 only
	        /* set the file formData name ('Content-Desposition'). Default is 'file' */
	        fileFormDataName: 'uploadPhotosTravelForm', //or a list of names for multiple files (html5).
	        /* customize how data is added to formData. See #40#issuecomment-28612000 for sample code */
	        //formDataAppender: function(formData, key, val){}
	      }).progress(function(evt) {
	    	  $log.info('upload progress');
	    	  $scope.progress[index] = parseInt(100.0 * evt.loaded / evt.total);
	      }).success(function(data, status, headers, config) {
	    	  // file is uploaded successfully
	    	  $log.info('upload success');
	    	  console.log(data);
	    	  $scope.updateResult(index, data);
	    	  $scope.selectedFiles[index].completed = true;
	      }).error(function(data, status, headers, config) {
	    	  $scope.updateResult(index, data);
	    	  $log.info('upload error');
	      });
	};
	
	$scope.updateResult = function (index, data) {
		// Display error message if any.
		if (data.errorCode == 0) {
			// No error
			$scope.results[index] = "";
		} else {
			$log.info("error description: " + data.errorDescription);
			$scope.results[index] = data.errorDescription;
		}
		
		// Refresh if last uploaded image.
		if (index == $scope.lastFileIndex) {
			if ( ($scope.currentTravel.id == $scope.selectedTravel.id) || ($scope.areFirstUploads == true) ) {
				$scope.refreshTravel($scope.currentTravel.id);
			}
		}
	};
	
	// Start uploads.
	$scope.startUploads = function() {
		if ($scope.selectedFiles != undefined)  {
			// Initializations.
			$scope.lastFileIndex = $scope.selectedFiles.length - 1;
			$scope.areFirstUploads = $scope.currentTravel.images.length == 0 ? true : false;
			
			// Iterate through files to upload.
			for (var index = 0; index < $scope.selectedFiles.length; index++) {
				if ($scope.selectedFiles[index].completed == undefined) {
					$scope.start(index);
				}
			}
		}
	}
    
    // --------------------------------------------------------------------
    // General actions of navigation bar.
    // --------------------------------------------------------------------
    // Send email.
    $scope.sendEmail = function() {
    	var link = "mailto:" + $scope.address
                 + "&subject=" + escape($scope.subject)
                 + "&body=" + escape($scope.body);

    	window.location.href = link;
    };
    
    $scope.showError = function(ngModelController, error) {
    	return ngModelController.$error[error];
    };
}]);