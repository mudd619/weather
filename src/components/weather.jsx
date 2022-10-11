import { useEffect, useState } from "react";
import { Skeleton, Stack } from "@mui/material"

import "../styles/weather.css";
import App11 from "./chart";
import { getHoursAndMinutes, locationImage, searchImage, useWindowDimensions, weatherSymbol } from "../utils/getWindowDimension";
import { getPlaces, getWeather } from "../services/api";

var id;
const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]


function Weather() {

    const [inp, setInp] = useState("");
    const [dat, setData] = useState([""]);
    const [flex, setFlex] = useState([]);
    const [flexChange, setFlexChange] = useState([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [dayNo, setDayNo] = useState(new Date());
    const [sunset, setSunset] = useState("");
    const [sunrise, setSunrise] = useState("");

    let divOne = document.getElementById("div-one");
    //Function to add border onfocus on the input box
    const handleFocus = () => {
        divOne.style.border = "2px solid rgb(91,179,231)";
        divOne.style.padding = "7px 9px"
    }

    //function to remove border when not focused ont the input box
    const handleBlur = () => {
        divOne.style.border = "1px solid rgb(231,231,232)";
        divOne.style.padding = "8px 10px";
    }

    //to add and remove borders flex component and maintain the main section
    const handleBorder = (i, el) => {
        let border = document.querySelectorAll(".div-two-sub");
        border.forEach((el) => {
            el.style.border = "1px solid rgb(242, 242, 243)";
            el.style.padding = "5px 10px";
        })

        let borDiv = document.getElementById(i);
        borDiv.style.border = "2px solid rgb(91,179,231)";
        borDiv.style.padding = "4px 9px";

        setFlexChange([el]);

        let sunset = getHoursAndMinutes(el.sunset);
        setSunset(`${sunset.hours}:${sunset.minutes}pm`);

        let sunrise = getHoursAndMinutes(el.sunrise);
        setSunrise(`${sunrise.hours}:${sunrise.minutes}am`)
    }

    const handleInp = (e) => {
        let change = document.getElementById("chan");
        let changing = document.getElementById("changing");
        changing.style.display = "none"
        change.style.display = "block"
        setInp(e.target.value)
    }

    function showPosition(position) {
        handleInpData("", "", position.coords.latitude, position.coords.longitude)
    }

    //geoLocation
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition);
        } else {
            return alert("Geolocation not supported on this browser")
        }
    }, [])

    //to find name of the places
    useEffect(() => {
        let dropDown = document.getElementById("drop-down");
        if (inp.length < 2) {
            dropDown.style.display = "none"
            return
        }
        dropDown.style.display = "block"
        if (id) {
            return
        }
        id = setTimeout(() => {
            place();
            id = undefined
        }, 500)
    }, [inp])


    function place() {
        let change = document.getElementById("chan");
        let changing = document.getElementById("changing");
        let input_value = document.getElementById("input-box").value;

        getPlaces(input_value, process.env.REACT_APP_FIRST_KEY)
            .then((res) => {
                setData(res.data.features);
                change.style.display = "none"
                changing.style.display = "block";
            })
            .catch((err) => {
                console.log(err)
            })
    }

    const handleInpData = (city, state, lat, lon) => {
        setLoading(true)
        let input_box = document.getElementById("input-box");
        let changing = document.getElementById("changing");

        changing.style.display = "none";
        input_box.value = city ? state ? `${city} , ${state}` : `${city}` : "";

        getWeather(lat, lon, process.env.REACT_APP_SECOND_KEY)
            .then((res) => {
                setLoading(false)

                setFlex(res.data.daily);
                setFlexChange([res.data.daily[0]])

                let sunset = getHoursAndMinutes(res.data.daily[0].sunset);
                setSunset(`${sunset.hours}:${sunset.minutes}pm`);

                let sunrise = getHoursAndMinutes(res.data.daily[0].sunrise)
                setSunrise(`${sunrise.hours}:${sunrise.minutes}am`)
            })
            .catch((err) => {
                setLoading(false);
                setError(true);
                console.log(err)
            })
    }

    const { width, height } = useWindowDimensions()



    return <div className="container">
        <div id="div-one">
            <img className="img1" src={locationImage} />
            <input autoComplete="off" id="input-box" onChange={handleInp} onBlur={handleBlur} onFocus={handleFocus} placeholder="Enter Location" />
            <img style={{ cursor: "pointer" }} src={searchImage} />
        </div>
        <div id="drop-down">

            <div id="changing">
                {
                    dat[0] ? dat.map((el, i) => {
                        if (!el.properties.name) {
                            return
                        }
                        return <div onClick={() => handleInpData(el.properties.name, el.properties.state, el.properties.lat, el.properties.lon)} key={i} className="drop all"><span style={{ fontWeight: "700" }}>{el.properties.name}</span>{el.properties.state ? ` , ${el.properties.state}` : ""}</div>
                    }) :
                        <div id="change" className="drop">No Places Found</div>
                }
            </div>
            <div id="chan" className="drop">...Loading</div>
        </div>
        {
            loading ? <Stack spacing={1}>
                <Skeleton variant="text" />
                <Skeleton variant="circular" width={40} height={40} />
                <Skeleton variant="rectangular" width={210} height={118} />
            </Stack> : error ? "...error" : <div>
                <div className="div-two">
                    {
                        flex.map((el, i) => {
                            if (i >= 7) {
                                return
                            }
                            return <div style={i === 0 ? { fontWeight: "700", border: "2px solid rgb(91,179,231)", padding: "4px 9px" } : {}} key={i} id={i} onClick={() => handleBorder(i, el)} className="div-two-sub">
                                <span>{days[(Number(dayNo.getDay()) + i) % 7]}</span><br />
                                <span>{(el.temp.day - 273.15).toFixed(2).split(".")[0]}°</span><span style={{ color: "rgb(150,150,151)", marginLeft: "5px" }}>{(el.temp.day - 273.15).toFixed(2).split(".")[1]}°</span><br />
                                <img src={el.weather[0].main === "Clouds" ? weatherSymbol.clouds : el.weather[0].main === "Rain" ? weatherSymbol.rain : el.weather[0].main === "Snow" ? weatherSymbol.snow : weatherSymbol.sun} />
                                <br /><span className="font1" style={{ color: "rgb(150,150,151)" }}>{el.weather[0].main}</span>
                            </div>
                        })
                    }
                </div>
                {
                    flexChange[0] ? <div className="div-three">
                        <div style={{ display: "flex" }}>
                            <span id="div-three-degree">{(flexChange[0].temp.day - 273.15).toFixed(2).split(".")[0]}° C</span>
                            <img src={flexChange[0].weather[0].main === "Clouds" ? weatherSymbol.clouds : flexChange[0].weather[0].main === "Rain" ? weatherSymbol.rain : flexChange[0].weather[0].main === "Snow" ? weatherSymbol.snow : weatherSymbol.sun} />
                        </div>
                        <div id="chart">
                            <App11 dim={[width, height]} vall={[flexChange[0].temp]} />
                        </div>
                        <div className="div-three-sub">
                            <div className="sub-1">
                                <span style={{ fontWeight: "700", color: "black" }}>Pressure</span><br />
                                {flexChange[0].pressure} hpa
                            </div>
                            <div className="sub-1">
                                <span style={{ fontWeight: "700", color: "black" }}>Humidity</span><br />
                                {flexChange[0].humidity} %
                            </div>
                        </div>

                        <div>
                            <div className="contain">
                                <div className="div-above">
                                    <div style={{ width: "10%" }} className="sub-1 sub-3">
                                        <span style={{ fontWeight: "700", color: "black" }}>Sunrise</span><br />
                                        {sunrise}
                                    </div>
                                    <div style={{ width: "10%" }} className="sub-1 sub-2">
                                        <span style={{ fontWeight: "700", color: "black" }}>Sunset</span><br />
                                        {sunset}
                                    </div>
                                </div>
                                <div className="sun">
                                </div>
                            </div>
                        </div>
                    </div> : ""
                }
            </div>
        }
    </div>
}

export { Weather };