import React, { useState, useCallback, useRef, useEffect} from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { Navigate } from 'react-router-dom';
import './Map.css';
import { useAuth } from './Authentication';

const containerStyle = {
  width: '100%',
  height: '400px',
};

const Map = () => {
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: 'AIzaSyBPsw3y4GcHJ-KNfOAaeSMHwUC01GDkGFA',
    });

    // the default map view when the user lands on /map page
    // center of atlanta at zoom 8, which is quite big
    const [center, setCenter] = useState({
        lat:  33.772781185138015,
        lng:  -84.39330177974736
      });
    const [zoom, setZoom] = useState(8);

    // user input they can edit to change the marker outputs
    const [latitude, setLatitude] = useState('')
    const [longitude, setLongitude] = useState('')
    const [radius, setRadius] = useState('')
    const [placeType, setPlaceType] = useState('restaurant')
    const [ratingRange, setRatingRange] = useState('0')
    const [numberPlaces, setNumberPlaces] = useState('15')

    // center red marker for the location the user picked
    const [marker, setMarker] = useState(null)

    // list of results based on the location picked
    const [results, setResults] = useState([])

    // current pin/marker the mouse is hovering over
    // hoever_timeout used to ensure that react state is changed correctly when mouse is moving really fast
    const [activePlacePanel, setActivePlacePanel] = useState(null)
    const [hover_timeout, setHover_timeout] = useState(null);
    const [placeOptions, setPlaceOptions] = useState([]);


    const [error, setError] = useState('')
    const [sortOption, setSortOption] = useState('price');

    const onClick = useCallback((e) => {
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();
        setLatitude(lat);
        setLongitude(lng);
        setMarker({ lat, lng });
        setRadius(prevRadius => prevRadius || 1500);
        setPlaceType(preResta => preResta || 'restaurant');
        setRatingRange(prevRange => prevRange || 0);
        setNumberPlaces(prevNumber => prevNumber || 15);
        console.log(radius);
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault()

        // Validate inputs
        if (!latitude || !longitude || !radius) {
            setError('Please fill in all fields.');
            setResults([])
            return;
        }

        // Ensure data integrity
        if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180
            || radius < 0) {
            setError('Please provide valid values.');
            setResults([])
            return;
        }
        
        setError(''); // Clear any previous errors

        // Recenter the google map once the user picks a location
        setCenter({
            lat: parseFloat(latitude),
            lng: parseFloat(longitude)
        });
        var k = 8, q = parseFloat(radius);
        if (q <= 1000) k = 16;
        else if (q <= 5000) k = 14;
        else if (q <= 10000) k = 12;
        setZoom(k);
        console.log(`The map is recentered at: (${latitude}, ${longitude}) with zoom of ${zoom}`)

        console.log("Sending latitute, longitude, radius, placeType, sortOption: ", latitude, longitude, radius, placeType, sortOption)

        fetch("http://localhost:8080/search", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                latitude: latitude,
                longitude: longitude,
                radius: radius,
                placeType: placeType,
                sortOption: sortOption
            })
        })
        .then(response => response.json())
        .then(data => {
            const filteredResults = data.results.filter(place => place.rating >= ratingRange);
            console.log(filteredResults)
            setResults(filteredResults || [])

            // Set the maximum value for number of places based on filteredResults length
            var maxPlaces = filteredResults.length;
            if (maxPlaces > 15) {
                maxPlaces = 15;
            }
            setNumberPlaces(maxPlaces);
            setPlaceOptions(Array.from({ length: maxPlaces }, (_, i) => i + 1));
        })
        .catch((error => {
            console.error("Error fetching data: ", error)
            setResults([])
        }))
    }

    const handleSortChange = (e) => {
        setSortOption(e.target.value);
        // Trigger fetching or sorting of locations based on selected option
      };

    const [modalWithStuff, setModalWithStuff] = useState(null);

    const loggedIn = useAuth();

    if (!loggedIn.loggedIn) {
        console.log("Nope, can't access this page because the use is not logged in!")
        return <Navigate to="/login" />;
    }
    return (
        <>  
        <div className="container">
            <div className="row">
                <h1 className="text-start display-4">Location Search</h1>
                <hr className="mb-4"/>
            </div>
            <div className="row align-items-center column-gap-3" style={{ marginBottom: '20px' }}>
                <input className="form-control col" type="text" placeholder="Latitude (-90 to 90)" name="latitude" value={latitude} onChange={(e) => setLatitude(e.target.value)}/>
                <input className="form-control col" type="text" placeholder="Longitude (-180 to 180)" name="longitude" value={longitude} onChange={(e) => setLongitude(e.target.value)}/>
                <input className="form-control col" type="text" placeholder="Radius (in meters)" name="radius" value={radius}onChange={(e) => setRadius(e.target.value)}/>

                <select className="form-select col" value={placeType} onChange={(e) => setPlaceType(e.target.value)}>
                    <option value="">Select Place Type</option>
                    <option value="restaurant">Restaurant</option>
                    <option value="hospital">Hospital</option>
                    <option value="store">Store</option>
                    <option value="library">Library</option>
                </select>

                <select className="form-select col" value={ratingRange} onChange={(e) => setRatingRange(e.target.value)}>
                    <option value="">Select Rating Range</option>
                    <option value="0">Any rating</option>
                    <option value="2">2 or higher</option>
                    <option value="2.5">2.5 or higher</option>
                    <option value="3">3 or higher</option>
                    <option value="3.5">3.5 or higher</option>
                    <option value="4">4 or higher</option>
                    <option value="4.5">4.5 or higher</option>
                </select>

                <label htmlFor="sortOptions" style={{ marginTop: '10px' }}>Sort by:</label>
                <select id="sortOptions" value={sortOption} onChange={handleSortChange} style={{ marginBottom: '20px' }}>
                <option value="price">Price</option>
                <option value="rating">Rating</option>
                <option value="distance">Distance</option>
                </select>

                <button className="btn btn-outline-dark col" onClick={handleSubmit}>Submit</button>
            </div>
            <div className="row" style={{ marginBottom: '20px' }}>
                {isLoaded ? (
                    <GoogleMap
                        mapContainerStyle={containerStyle}
                        center={center}
                        zoom={zoom} 
                        onClick={onClick}
                    >
                        {marker && <Marker position={marker} />}
                        {results.slice(0, numberPlaces).map((result, index) => (
                            <Marker 
                                key={index}
                                position={{
                                    lat: parseFloat(result.latitude),
                                    lng: parseFloat(result.longitude)
                                }} 
                                title={result.name}
                                icon={{
                                    url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png", // Custom icon URL
                                }}
                                onMouseOver={(e) => {
                                    if (hover_timeout)
                                        clearTimeout(hover_timeout);
                                    const n_timeout = setTimeout(() => {
                                        setActivePlacePanel(result); // Set the active place after delay
                                    }, 10);

                                    setHover_timeout(n_timeout);
                                    console.log(activePlacePanel)
                                }}
                                onMouseOut={(e) => {
                                    if (hover_timeout) 
                                        clearTimeout(hover_timeout);
                                    setActivePlacePanel(null);
                                    console.log(activePlacePanel)
                                }}
                                onClick={() => {
                                    if (modalWithStuff)
                                        setModalWithStuff(null)
                                    else
                                        setModalWithStuff(result)
                                }}>
                            {activePlacePanel && activePlacePanel.name == result.name && (
                                <InfoWindow
                                    position={{
                                        lat: parseFloat(activePlacePanel.latitude),
                                        lng: parseFloat(activePlacePanel.longitude)
                                    }}
                                    options={{ disableAutoPan: true }}
                                    onCloseClick={(e) => {
                                        setActivePlacePanel(null)
                                    }}
                                >
                                <div>
                                    <h5>{activePlacePanel.name}</h5>
                                    <h5>{activePlacePanel.address}</h5>
                                    <h5>{activePlacePanel.priceLevel}</h5>
                                    <h5>{activePlacePanel.rating}/5</h5>
                                    <h5>{activePlacePanel.distance}</h5>
                                </div>
                                </InfoWindow>
                            )}
                            </Marker>
                            ))}
                    </GoogleMap>
                ) : <></>}
            </div>

            {error && ( // Added conditional rendering for error message
                    <div className="row" style={{ marginBottom: '20px' }}>
                        <div className="alert alert-danger" role="alert" style={{ marginTop: '20px' }}>
                            {error}
                        </div>
                    </div>
            )}

            <select className="form-select col" value={numberPlaces} onChange={(e) => setNumberPlaces(e.target.value)}>
                    <option value="">Select Number of Places</option>
                    {placeOptions.map((value) => (
                        <option value={value}>{value}</option>
                    ))}
            </select>

            <div className="row mt-4">
                <h2>Search Results:</h2>
                <div className="results-container">
                
                {results.length > 0 ? (
                        <ul>
                            {results.slice(0, numberPlaces).map((result, index) => (
                                <li key={index} onClick={() => {
                                    if (modalWithStuff)
                                        setModalWithStuff(null)
                                    else
                                        setModalWithStuff(result)
                                }}>
                                    {result.name} - {result.address} - {result.priceLevel} - {result.distance} meters - {result.rating}/5
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No results found.</p>
                    )}
                </div>
            </div>
            <MySomewhatKoolModal
                showModal={modalWithStuff}
                result={modalWithStuff}
                onClose={() => setModalWithStuff(null)}
            />
        </div>
        </>
    )
}

const MySomewhatKoolModal = ({showModal, result, onClose}) => {
    
    return showModal && result ? (
        <div className='modal-overlay'>
          <div className='modal-content'>
            <button className="close-button" onClick={onClose}>X</button>
            <h2>{result.name}</h2>
            <p>Address: {result.address}</p>
            <p>Price Level: {result.priceLevel}</p>
            <p>Distance: {result.distance} meters</p>
            <p>Rating: {result.rating}/5</p>
            {result.website && result.website !== "Website not available" ? (
                <p>Website: <a href={result.website} target="_blank" rel="noopener noreferrer">{result.website}</a></p>
            ) : (
                <p>Website: {result.website}</p>
            )}
          </div>
        </div>
      ) : null;
}

export default Map