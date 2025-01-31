package com.location.search;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class NearbyAPI {

    private final RestTemplate restTemplate = new RestTemplate();
    private static final String API_URL = "https://places.googleapis.com/v1/places:searchNearby";
    private static final String API_KEY = "AIzaSyBPsw3y4GcHJ-KNfOAaeSMHwUC01GDkGFA";  // Replace with your actual API Key

    public Map<String, Object> searchNearbyPlaces(double latitude, double longitude, double radius, String placeType, String sortOption) {
        // Create request body
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("includedTypes", Collections.singletonList(placeType));
        requestBody.put("maxResultCount", 15);

        Map<String, Object> locationRestriction = new HashMap<>();
        Map<String, Object> circle = new HashMap<>();
        Map<String, Object> center = new HashMap<>();
        center.put("latitude", latitude);
        center.put("longitude", longitude);
        circle.put("center", center);
        circle.put("radius", radius);
        locationRestriction.put("circle", circle);

        requestBody.put("locationRestriction", locationRestriction);

        // Set headers
        HttpHeaders headers = new HttpHeaders();
        headers.set("Content-Type", "application/json");
        headers.set("X-Goog-Api-Key", API_KEY);
        headers.set("X-Goog-FieldMask", "places.displayName,places.formattedAddress,places.rating,places.location,places.price_level,places.websiteUri");

        // Wrap request in HttpEntity
        HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(requestBody, headers);

        // Send POST request
        ResponseEntity<Map> responseEntity = restTemplate.exchange(API_URL, HttpMethod.POST, requestEntity, Map.class);
        System.out.println("=== responseEntity ===");
        System.out.println(responseEntity);

        // Calculate distances and attach to places
        List<Map<String, Object>> placesList = (List<Map<String, Object>>) responseEntity.getBody().get("places");
        for (Map<String, Object> place : placesList) {
            Map<String, Object> placeLocation = (Map<String, Object>) place.get("location");
            double placeLatitude = (double) placeLocation.get("latitude");
            double placeLongitude = (double) placeLocation.get("longitude");

            double distance = DistanceCalculator.calculateDistance(latitude, longitude, placeLatitude, placeLongitude);
            place.put("distance", distance);

            if ("rating".equals(sortOption)) {
                Object ratingObject = place.get("rating");
                double rating = ratingObject != null ? Double.valueOf(ratingObject.toString()) : 0.0;
                place.put("ratingValue", rating);
            }

            if ("price".equals(sortOption)) {
                String priceLevel = (String) place.get("priceLevel");
                priceLevel = (priceLevel != null) ? priceLevel : "Price level not available";
                if ("Price level not available".equals(priceLevel) || "PRICE_LEVEL_FREE".equals(priceLevel)) {
                    place.put("priceLevelValue", 0);
                } else if ("PRICE_LEVEL_INEXPENSIVE".equals(priceLevel)) {
                    place.put("priceLevelValue", 1);
                } else if ("PRICE_LEVEL_MODERATE".equals(priceLevel)) {
                    place.put("priceLevelValue", 2);
                } else if ("PRICE_LEVEL_EXPENSIVE".equals(priceLevel)) {
                    place.put("priceLevelValue", 3);
                } else if ("PRICE_LEVEL_VERY_EXPENSIVE".equals(priceLevel)) {
                    place.put("priceLevelValue", 4);
                }
            }
        }

        // Sort based on sortOption
        Comparator<Map<String, Object>> comparator = null;

        if ("distance".equals(sortOption)) {
            comparator = Comparator.comparingDouble(p -> (double) p.get("distance"));
        } else if ("price".equals(sortOption)) {
            comparator = Comparator.comparingInt(p -> (int) p.getOrDefault("priceLevelValue", Integer.MAX_VALUE));
            //comparator = comparator.reversed(); uncomment if we want from expensive to cheap, right now its cheap to expensive
        } else if ("rating".equals(sortOption)) {
            comparator = Comparator.comparingDouble(p -> (double) p.getOrDefault("ratingValue", 0.0));
            comparator = comparator.reversed();
        }

        if (comparator != null) {
            placesList.sort(comparator);
        }

        Map<String, Object> sortedResponse = new HashMap<>();
        sortedResponse.put("places", placesList);
        return sortedResponse;
        //return responseEntity.getBody();  // Return the response as a String
    }
}
