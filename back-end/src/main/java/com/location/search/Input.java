package com.location.search;

public class Input {
    private Double latitude;
    private Double longitude;
    private Double radius;
    private String placeType;
    private String sortOption; // New field

    public Input(Double latitude, Double longitude, Double radius, String placeType, String sortOption) {
        this.latitude = latitude;
        this.longitude = longitude;
        this.radius = radius;
        this.placeType = placeType;
        this.sortOption = sortOption; // Initialize new field
    }

    public Double getLatitude() {
        return latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public Double getRadius() {
        return radius;
    }

    public String getPlaceType() {
        return placeType;
    }
    public String getSortOption() { // New getter
        return sortOption;
    }


    
    
}
