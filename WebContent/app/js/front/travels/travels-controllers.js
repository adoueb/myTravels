/* Strict Mode is a new feature in ECMAScript 5 that allows you to place
 * a program, or a function, in a "strict" operating context. This strict 
 * context prevents certain actions from being taken and throws more exceptions.
 */
'use strict';

/* Controllers */

angular.module('travels-controllers', [
           'google-maps'.ns(),
           'ngRoute',
           'angularFileUpload',
           'ngDragDrop'])
           
// ------------------------------------------------------------------------
// Configuration.
// ------------------------------------------------------------------------
.config(['GoogleMapApiProvider'.ns(), function (GoogleMapApi) {
  GoogleMapApi.configure({
    key: 'AIzaSyDgJxEkV1ZAgRRZprakChmwJvMdlPvcs7w',
    v: '3.16',
    libraries: 'weather,geometry,visualization'
  });
}])
 
// ------------------------------------------------------------------------
// TravelListCtrl controller
// ------------------------------------------------------------------------
.controller('TravelListCtrl', 
            ['$scope', '$log', 'TravelRest', 'MapService', 'TravelService', 'AlertService', 'GoogleMapApi'.ns(),
		    function($scope, $log, TravelRest, MapService, TravelService, AlertService, GoogleMapApi) {
	
    // --------------------------------------------------------------------
    // Initializations.
    // -------------------------------------------------------------------- 
    TravelService.initTravels();
    
    $scope.selectedTravel = null;
    
    AlertService.initAlerts("main");
    
    TravelRest.query(function(travels) {
		// List of travels.
	    $log.info('travels loaded');
	    $scope.initializeTravels(travels);
    }, function() {
    	$log.info('Error while loading travels');
    	AlertService.addAlert("main", "danger", "The travels can't be loaded. Please retry.");
    });

    // --------------------------------------------------------------------
    // Map.
    // --------------------------------------------------------------------
    /* Init.
     * GoogleMapApi is a promise with a
     * then callback of the google.maps object
     *   @pram: maps = google.maps
     */
     GoogleMapApi.then(function(maps) {
    	 maps.visualRefresh = true;
    	 
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
     });
      
	$scope.onMarkerClicked = function (marker) {
	    marker.showWindow = true;
	    $scope.$apply();
	};
    
    // --------------------------------------------------------------------
    // Manage travels.
    // --------------------------------------------------------------------
    $scope.initializeTravels = function(travels) {
    	var travelsData = TravelService.getTravelsData(travels);
    	$scope.travels = travelsData.travelsList;
    	$scope.selectedTravel = travelsData.selectedTravel;
    	$scope.map = travelsData.map;
    	$scope.markers = travelsData.markers;
    };
    
    $scope.addTravelToList = function (travel) {
    	var travelsData = TravelService.addTravel($scope.travels, travel);
    	$scope.travels = travelsData.travelsList;
    	if (travelsData.selectedTravel != null) {
    		// New selection.
        	$scope.selectedTravel = travelsData.selectedTravel;
        	$scope.map = travelsData.map;
        	$scope.markers = travelsData.markers;
    	}
    };
    
    $scope.updateTravelInList = function (travel) {
    	var updateTravelData = TravelService.updateTravel($scope.travels, $scope.selectedTravel, travel);
    	if (updateTravelData.selectedTravel != null) {
    		$scope.selectedTravel = updateTravelData.selectedTravel;
    	}
	};
	
	$scope.selectTravel = function(travel) {
		var travelData = TravelService.getSelectedTravelData(travel);
		$scope.selectedTravel = travelData.selectedTravel;
    	$scope.map = travelData.map;
    	$scope.markers = travelData.markers;
    };
   
    $scope.refreshTravel = function(id) {
    	TravelRest.queryOne(id, function(travel) {
			// Travel.
		    $log.info("update travel " + id + " / " + travel.country);     
		    $scope.updateTravelInList(travel);
	    }, function(travel) {
	    	$log.info("Failed to update travel " + id + " / " + travel.country);
	    	var msg = "Error while refreshing the travel " + travel.name;
	    	AlertService.addAlert("main", "danger", msg);
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
        
    // --------------------------------------------------------------------
    // Manage popups.
    // --------------------------------------------------------------------
    $scope.initData = function(action, travel, marker) {
    	if (action != '') {
        	AlertService.resetAlerts(action);
    	}
    	if (travel != undefined) {
    		$scope.setCurrentTravel(travel);
    	}
    	if (marker != undefined) {
    		$scope.setCurrentStop(marker);
    	}
    };

    // Set current travel.
    $scope.setCurrentTravel = function(travel) {
        $scope.currentTravel = travel;
        if ($scope.currentTravel.nbSelected == undefined) {
        	$scope.currentTravel.nbSelected = 0;
        }
    };

    // Set current stop.
	$scope.setCurrentStop = function(marker) {
	    $scope.currentStop = marker;
	};

    // Read aloud the description.
	$scope.readAloud = function(marker) {
		speak(marker.title + "   " + marker.description);
	};
	
    // --------------------------------------------------------------------
    // Manage photos.
    // --------------------------------------------------------------------
	$scope.hasPhotos = function(selectedTravel) {
		if (selectedTravel == null) {
			// No selected travel.
			return 0;
		} else if (selectedTravel.images.length == 0) {
			// No photos.
			return 1;
		} else {
			// Some photos.
			return 2;
		}
	};
	
    // --------------------------------------------------------------------
    // Manage itinerary.
    // --------------------------------------------------------------------
	$scope.deleteStop = function(stop) {
		$scope.currentTravel.itinerary.stops.splice(stop.id, 1);
		// Server-side TODO
	};

}])

// ------------------------------------------------------------------------
// AddTravelCtrl controller
// ------------------------------------------------------------------------
.controller('AddTravelCtrl', 
        ['$scope', '$log', 'TravelRest', 'AddTravelService', 'TravelService', 'CommonService', 'AlertService',
		    function($scope, $log, TravelRest, AddTravelService, TravelService, CommonService, AlertService) {
    
    // Create travel.
    $scope.addTravel = function() {
        var newTravel = {year:        $scope.addTravelData.year, 
    			         country:     $scope.addTravelData.country, 
    			         name:        $scope.addTravelData.name, 
    			         description: $scope.addTravelData.description};

	    // POST /travels
	    $log.info("add " +  newTravel.name);
	    TravelRest.save(newTravel, function(travel) {
	 	        $scope.$parent.addTravelToList(travel);
	            $('#addTravel').modal('hide');
	        }, function() {
		        $log.error("There was an error saving");
		        AlertService.addAlert("addTravel", "danger", "The travel can't be added. Please retry.");
	    });
    };
    
    $scope.canAddTravel = function() {
    	return $scope.addTravelForm.$dirty && $scope.addTravelForm.$valid;
    };
   
}])

// ------------------------------------------------------------------------
// UpdateTravelCtrl controller
// ------------------------------------------------------------------------
.controller('UpdateTravelCtrl', 
        ['$scope', '$log', 'TravelRest', 'MapService', 'TravelService', 'CommonService', 'AlertService',
		    function($scope, $log, TravelRest, MapService, TravelService, CommonService, AlertService) {
     
    // Update travel.
    $scope.updateTravel = function(travel) {
        // PUT /travels
    	$log.info("update " +  travel.name);
    	$log.info("selected travel " +  $scope.$parent.selectedTravel.name);
    	
    	// Keep only latitude, longitude, title, description for the stops.
    	var travelToCopy = jQuery.extend(true, {}, travel);
    	MapService.resetStops(travelToCopy.itinerary.stops);
    	
    	TravelRest.update(travelToCopy, function(travel) {
    	        // Update list of travels.
    			$scope.$parent.updateTravelInList(travel);
 	            $('#updateTravel').modal('hide');
    	    }, function() {
    			$log.error("There was an error updating");
    			AlertService.addAlert("updateTravel", "danger", "The travel can't be updated. Please retry.");
    	});
    };

	// Update stop.
	$scope.updateStop = function(stop) {
        // PUT /stops
	    $log.info("update " +  stop.title);
	    $scope.updateTravel($scope.$parent.selectedTravel);
	    // TODO: different error
	    $('#updateStop').modal('hide');
    };
    
}])

// ------------------------------------------------------------------------
// DeleteTravelCtrl controller
// ------------------------------------------------------------------------
.controller('DeleteTravelCtrl', 
        ['$scope', '$log', 'TravelRest', 'DeleteTravelService', 'TravelService', 'CommonService', 'AlertService',
		    function($scope, $log, TravelRest, DeleteTravelService, TravelService, CommonService, AlertService) {    
        	
    // Delete travel.
	$scope.deleteTravel = function(travel) {
        // DELETE /travels
    	$log.info("delete " +  travel.name);
    	TravelRest.remove(travel, function(travels) {
 	       if ($scope.$parent.selectedTravel.id == travel.id) {
 	    	   // Delete the selected travel.
 	    	   $scope.$parent.initializeTravels(travels);	
		   } else {
			   $scope.$parent.travels = TravelService.getOrderedTravels(travels);
		   }
 	       $('#deleteTravel').modal('hide');    		
        }, function() {
        	$log.error("There was an error deleting");
        	AlertService.addAlert("deleteTravel", "danger", "The travel can't be deleted. Please retry.");
        });
    };
        	    
}])

// ------------------------------------------------------------------------
// UploadImagesCtrl controller
// ------------------------------------------------------------------------
.controller('UploadImagesCtrl', 
     ['$scope', '$log', '$timeout', '$upload',
		    function($scope, $log, $timeout, $upload) {    
      	
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
			for (var index = 0; index < $scope.uploaders.length; index++) {
				if ($scope.uploaders[index] != null) {
					$scope.uploaders[index].abort();
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
			$scope.refreshTravel($scope.currentTravel.id);
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
	};
	
	// Upload dialog closed.
	$scope.closeUpload = function() {
		// Iterate through files to upload.
		for (var index = $scope.selectedFiles.length - 1; index >= 0; index--) {
			if ($scope.selectedFiles[index].completed == true) {
				$scope.clearUploads(index);
			}
		}
	};
}])

// ------------------------------------------------------------------------
// ManageImagesCtrl controller
// ------------------------------------------------------------------------
.controller('ManageImagesCtrl', 
     ['$scope', '$log', 'AlertService',
		    function($scope, $log, AlertService) {    
  
    // Toggle photo selection.
    $scope.togglePhotoSelection = function (photoIndex) {
    	var selected = $scope.currentTravel.images[photoIndex].selected;
    	$scope.currentTravel.images[photoIndex].selected = selected == undefined ? true : !selected;
    	if ($scope.currentTravel.images[photoIndex].selected == true) {
    		$scope.currentTravel.nbSelected += 1;
    	} else {
    		$scope.currentTravel.nbSelected -= 1;
    	}
    };
    
    // Delete selected photos.
    $scope.deleteSelectedPhotos = function() {
    	// Iterate on photos for deletion.
    	for (var index = $scope.currentTravel.images.length - 1; index >= 0; index--) {
			if ($scope.currentTravel.images[index].selected == true) {
				$scope.currentTravel.images.splice(index, 1);
				$scope.currentTravel.nbSelected -= 1;
				// Server-side TODO
			}
		}	
    };
    
    // Drag&drop: when drop on photo, set the dragged photo in place.
    $scope.onDropPhoto = function(toIndex, fromIndex){
    	$scope.currentTravel.images.move(fromIndex, toIndex);
    	// Server-side TODO
    };
}])

// ------------------------------------------------------------------------
// ContactCtrl controller
// ------------------------------------------------------------------------
.controller('ContactCtrl', 
        ['$scope', '$log', 'CommonService',
		    function($scope, $log, CommonService) {
        	
    // Send email.
    $scope.sendEmail = function() {
        CommonService.sendEmail($scope.email);
    };
}]);