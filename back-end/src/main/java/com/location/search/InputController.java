package com.location.search;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PostMapping;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
public class InputController {

    @CrossOrigin(origins = "http://localhost:5173")
    @PostMapping("/search")
    public Map<String, Object> search(@RequestBody Input input) {
        System.out.println("=== search ===");
        Map<String, Object> response = new HashMap<>();

        // Validate the inputs
        if (input.getLatitude() < -90 || input.getLatitude() > 90 || input.getLongitude() < -180 || input.getLongitude() > 180 || input.getRadius() < 0) {
            response.put("status", "error");
            response.put("message", String.format("Invalid input: latitude %f, longitude %f, radius %f", input.getLatitude(), input.getLongitude(), input.getRadius()));
            return response;
        }

        NearbyAPI nearbyAPI = new NearbyAPI();
        Map<String, Object> result = nearbyAPI.searchNearbyPlaces(input.getLatitude(), input.getLongitude(), input.getRadius(), input.getPlaceType(), input.getSortOption());
        
        System.out.println("=== result ===");
        System.out.println(result);
        
        if (result != null && result.containsKey("places")) {
            List<Map<String, Object>> places = (List<Map<String, Object>>) result.get("places");
            List<Map<String, String>> locations = new ArrayList<>();

            for (Map<String, Object> place : places) {
                System.out.println(place);

                Object displayNameObject = place.get("displayName");
                String displayName;
                if (displayNameObject instanceof Map) {
                    Map<String, Object> displayNameMap = (Map<String, Object>) displayNameObject;
                    displayName = (String) displayNameMap.get("text");
                } else {
                    displayName = (String) displayNameObject;
                }

                String formattedAddress = (String) place.get("formattedAddress");

                Object ratingObject = place.get("rating");
                String rating = ratingObject != null ? ratingObject.toString() : "N/A";

                Map<String, Object> locationMap = (Map<String, Object>) place.get("location");
                String latitude = locationMap != null ? locationMap.get("latitude").toString() : "Unknown";
                String longitude = locationMap != null ? locationMap.get("longitude").toString() : "Unknown";

                double placeLat = Double.parseDouble(latitude);
                double placeLon = Double.parseDouble(longitude);
                double distance = DistanceCalculator.calculateDistance(input.getLatitude(), input.getLongitude(), placeLat, placeLon);

                String priceLevel = (String) place.get("priceLevel");
                priceLevel = (priceLevel != null) ? priceLevel : "Price level not available";

                Map<String, String> location = new HashMap<>();
                location.put("name", displayName);
                location.put("address", formattedAddress != null ? formattedAddress : "Address not available");
                location.put("rating", rating);
                location.put("latitude", latitude);
                location.put("longitude", longitude);
                location.put("distance", String.format("%.2f", distance));
                location.put("priceLevel", priceLevel);
                Object websiteObject = place.get("websiteUri");
                String website = websiteObject != null ? websiteObject.toString() : "Website not available";
                location.put("website", website);

                locations.add(location);
            }

            response.put("results", locations);
        } else {
            response.put("results", new Map[] {});
        }

        response.put("status", "success");
        response.put("latitude", input.getLatitude());
        response.put("longitude", input.getLongitude());
        response.put("radius", input.getRadius());
        response.put("sortOption", input.getSortOption());

        return response;
    }

    @GetMapping("/input-javaconfig")
    public String inputJavaConfig(@RequestParam Double latitude, @RequestParam Double longitude, @RequestParam Double radius) {
        System.out.println("=== inputJavaConfig ===");
        return String.format("Valid input: latitude %f, longitude %f, radius %f", latitude, longitude, radius);
    }
}
