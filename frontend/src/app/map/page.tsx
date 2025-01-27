"use client"

import { useState, useEffect } from "react"
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api"

const MapPage = () => {
  const [currentPosition, setCurrentPosition] = useState(null)
  const [distance, setDistance] = useState(0)
  const [transportMode, setTransportMode] = useState("walking")

  useEffect(() => {
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          setCurrentPosition({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
          // Here we would calculate distance and determine transport mode
          // For now, we'll just increment distance randomly
          setDistance((prev) => prev + Math.random() * 10)
        },
        (error) => console.error(error),
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
      )
      return () => navigator.geolocation.clearWatch(watchId)
    }
  }, [])

  const mapContainerStyle = {
    width: "100%",
    height: "400px",
  }

  const center = currentPosition || { lat: 35.6762, lng: 139.6503 } // Default to Tokyo

  return (
    <div className="container">
      <h1 className="display-6 mb-4">あなたの移動</h1>
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">統計</h5>
              <p className="card-text">距離: {distance.toFixed(2)} メートル</p>
              <p className="card-text">移動手段: {transportMode === "walking" ? "徒歩" : "自転車"}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="card">
        <div className="card-body">
          <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
            <GoogleMap mapContainerStyle={mapContainerStyle} zoom={15} center={center}>
              {currentPosition && <Marker position={currentPosition} />}
            </GoogleMap>
          </LoadScript>
        </div>
      </div>
    </div>
  )
}

export default MapPage

