AOS.init({
    once: true,
    offset: "0px"
});

const inputSearchCity = document.getElementById("inputSearchCity");
const endpoint = "https://api.geonames.org/searchJSON?name_startsWith=";
let cityList;
let cityDetails;

const datalist = document.getElementById("city-items");
let zdj = document.querySelectorAll("img");
let defaultChecks = document.querySelectorAll(".checkDefault")

let darkMode = false,
    farenheit = false;

let currentLat,
    currentLng;

let degUnit;


let date = new Date();
let weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
]

let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
]


document.addEventListener("DOMContentLoaded", () => {
    
    const userCity = localStorage.getItem("defaultName");
    const userLat = parseFloat(localStorage.getItem("defaultLat"));
    const userLng = parseFloat(localStorage.getItem("defaultLng"));

    const userTheme = parseInt(localStorage.getItem("theme"));

    if(userCity === null)
        setCity("Warszawa", 50.17, 20.99);
    else 
        setCity(userCity, userLat, userLng);

    if(userTheme == 0 || isNaN(userTheme))
        darkMode = false;
    else 
        darkMode = true;

    setTheme(darkMode)
    
    setInterval(() => {
        for(let i = 0; i < zdj.length; i++)
        {
            if(i==8)
                return;
                
            animateWeatherIcons(i)
        }
    }, 0200);
   

    document.querySelector(".s_date h3").innerHTML = `${weekdays[date.getDay()]}, <span style="color: #a5a5a5eb;"> ${months[date.getMonth()]} ${date.getDate()}</span>`;

});

function animateWeatherIcons(i)
{
        zdj[i].className = "";

        if (zdj[i].getAttribute("src") == "img/sun.png") 
            zdj[i].classList.add("sunAnimate");
            
        else if (zdj[i].getAttribute("src") == "img/rainly.png" || zdj[i].getAttribute("src") == "img/rainSun.png" || zdj[i].getAttribute("src") == "img/snow.png")
            zdj[i].classList.add("rainAnimate");

        else if (zdj[i].getAttribute("src") == "img/storm.png" || zdj[i].getAttribute("src") == "img/fog.png")
            zdj[i].classList.add("stormAnimate");
            
        else if (zdj[i].getAttribute("src") == "img/cloudly.png" || zdj[i].getAttribute("src") == "img/sunWithClouds.webp")
            zdj[i].classList.add("cloudsAnimate");
            
}


document.querySelector("#btn_darkMode").addEventListener('click', () => {

    darkMode = !darkMode;
   
    setTheme(darkMode)
})

document.getElementById("farenheit").addEventListener('click', () => {
    
    farenheit = true;
   
    if(!darkMode)
    {
        document.getElementById("celsius").classList.remove("deg_active")
        document.getElementById("farenheit").classList.add("deg_active")
    }
    else 
    {
        document.getElementById("celsius").classList.remove("deg_activeDark")
        document.getElementById("farenheit").classList.add("deg_activeDark")
    }

    setCity(document.querySelector(".s_date h2").innerHTML, currentLat, currentLng)
})

document.getElementById("celsius").addEventListener('click', () => {
    
    if(!darkMode)
    {
        document.getElementById("farenheit").classList.remove("deg_active")
        document.getElementById("celsius").classList.add("deg_active")
    }
    else 
    {
        document.getElementById("farenheit").classList.remove("deg_activeDark")
        document.getElementById("celsius").classList.add("deg_activeDark")
    }

    farenheit = false;

    setCity(document.querySelector(".s_date h2").innerHTML, currentLat, currentLng)
})

inputSearchCity.addEventListener('input', async () => {
    const inputValue = inputSearchCity.value.trim().toLowerCase();
    
    if (inputValue.length < 3) {
        datalist.style.display="none";
        return;
    }

    datalist.style.display="block";
    
    try {
        const response = await fetch(endpoint + inputValue + "&maxRows=7&username=saydi");
        const cities = await response.json();


        cityList = cities.geonames.map(city => {
            return {
              name: city.name,
              country: city.countryName,
              latitude: city.lat,
              longitude: city.lng,
              voivodeship: city.adminName1
            };
          });

        datalist.innerHTML = "";
        for(let i=0; i < cityList.length; i++)
        {
            let li = document.createElement("li")
            let formatCity = document.createTextNode(cityList[i].name)
            li.appendChild(formatCity);

            li.addEventListener('click', () => {
                setCity(cityList[i].name, cityList[i].latitude, cityList[i].longitude)
            })

            if(cityList[i].voivodeship == "")
                li.innerHTML = `<b>  ${li.innerHTML.substring(0, inputValue.length)}</b>${li.innerHTML.substring(inputValue.length)}
                                <div class="detailsCity"> ${cityList[i].country} </div>     
                                <div class="checkDefault" onclick="setDefault(${cityList[i].latitude}, ${cityList[i].longitude})"><i class="fa fa-check" aria-hidden="true"></i></div>`; 
            else 
            {
                li.innerHTML = `<b>  ${li.innerHTML.substring(0, inputValue.length)}</b>${li.innerHTML.substring(inputValue.length)} <div class="detailsCity"> ${cityList[i].voivodeship}, ${cityList[i].country} </div><div class="checkDefault" onclick="setDefault(${cityList[i].latitude}, ${cityList[i].longitude})"><i class="fa fa-check" aria-hidden="true"><div class="zmn">Save as default</div></i>
                </div>`;     
            }   
            
            datalist.appendChild(li);

            if(darkMode)            
                datalist.classList.add("darkSearch");
            
        }

    } catch (error) {
        console.error(error);
    }
});


function setCity(name, lat, lng)
{

    datalist.innerHTML = "";
    document.querySelector(".uv-numbers").innerHTML = "";
    datalist.style.display = "none";
    document.querySelector(".s_date h2").innerHTML = name;
    const nextDaysIcon = document.querySelectorAll('.long-term-item img');

    currentLat = lat;
    currentLng = lng;

    let temp_unit = "";

    if(farenheit)
    {
        temp_unit = "&temperature_unit=fahrenheit";
        degUnit = "°F";
    }
    else 
    {
        temp_unit = "";
        degUnit = "°C";
    }

    let endpointWeather = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&hourly=relativehumidity_2m,pressure_msl,visibility&daily=weathercode,precipitation_probability_max,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,rain_sum,snowfall_sum&current_weather=true&timezone=auto${temp_unit}`;  
    
    fetch(endpointWeather)
    .then(response => response.json())
    .then(data => { 

            document.querySelector(".s_degrees h1").innerHTML = data.current_weather.temperature + `<sup>${degUnit}</sup>`;
            document.querySelector("#windspeed").innerHTML = data.current_weather.windspeed;
            document.querySelector("#h_sunrise").innerHTML = data.daily.sunrise[0].substring(11) + " AM"
            document.querySelector("#h_sunset").innerHTML = data.daily.sunset[0].substring(11) + " PM";

            document.querySelector(".highlight-item:nth-child(4) h1").innerHTML = `${data.hourly.relativehumidity_2m[date.getHours()]}%`;
            document.querySelector(".highlight-item:nth-child(5) h1").innerHTML = `${data.hourly.visibility[date.getHours()]} <sup style="font-size: 30px;">km</sup>`;
            document.querySelector(".highlight-item:nth-child(6) h1").innerHTML = `${data.hourly.pressure_msl[date.getHours()]}<span style="text-transform: none;color: #454545;font-size: 0.4em;">hPa</span>`;


            if(data.daily.precipitation_probability_max[0] >= 0 && data.daily.precipitation_probability_max[0] < 30)
                document.getElementById("chanceDesc").innerHTML = `<i class="fa-solid fa-cloud"></i> Low chance of precipitation</p>`;
            
            else if(data.daily.precipitation_probability_max[0] >= 30 && data.daily.precipitation_probability_max[0] < 55)
                document.getElementById("chanceDesc").innerHTML = `<i class="fa-solid fa-cloud"></i> Mid chance of precipitation</p>`;

            else if(data.daily.precipitation_probability_max[0] >= 55 && data.daily.precipitation_probability_max[0] < 85)
                document.getElementById("chanceDesc").innerHTML = `<i class="fa-solid fa-cloud"></i> High chance of precipitation</p>`;

            else 
                document.getElementById("chanceDesc").innerHTML = `<i class="fa-solid fa-cloud"></i> Very high chance of precipitation</p>`;   


            document.getElementById("chancePercent").innerHTML = `<i class='fa fa-pie-chart'></i> ${data.daily.precipitation_probability_max[0]}% </p>`;

                    for(let i = 0; i<=5; i++)
                    {
                        if(!farenheit)
                        {
                            switch(data.daily.weathercode[i]) {
                                case 0:
                                    nextDaysIcon[i].setAttribute('src', 'img/sun.png');
                                    break;
                                case 1:
                                case 2:
                                    nextDaysIcon[i].setAttribute('src', 'img/sunWithClouds.webp');
                                    break;
                                case 45:
                                case 48:
                                    nextDaysIcon[i].setAttribute('src', 'img/fog.png');
                                    break;
                                case 53:
                                case 55:
                                case 56:
                                case 57:
                                case 61:
                                case 63:
                                case 65:
                                case 66:
                                case 67:
                                    nextDaysIcon[i].setAttribute('src', 'img/rainly.png');
                                    break;
                                case 71:
                                case 73:
                                case 75:
                                case 77:
                                case 85:
                                case 86:
                                    nextDaysIcon[i].setAttribute('src', 'img/snow.png');
                                    break;
                                case 95:
                                case 96:
                                case 99:
                                    nextDaysIcon[i].setAttribute('src', 'img/storm.png');
                                    break;
                                default:
                                    nextDaysIcon[i].setAttribute('src', 'img/cloudly.png');
                            }


                            if(date.getHours() >= 22)
                                document.querySelector(`.s_weatherIcon`).innerHTML = `<img src="img/night.png" alt="moon">`;
                            else 
                            {
                                switch(data.current_weather.weathercode) {
                                    case 0:
                                        document.querySelector(`.s_weatherIcon`).innerHTML = `<img src="img/sun.png" alt="sun">`;
                                        break;
                                    case 1:
                                    case 2:
                                        document.querySelector(`.s_weatherIcon`).innerHTML = `<img src="img/sunWithClouds.webp" alt="sun and clouds">`;
                                        break;
                                    case 45:
                                    case 48:
                                        document.querySelector(`.s_weatherIcon`).innerHTML = `<img src="img/fog.png" alt="fog">`;
                                        break;
                                    case 53:
                                    case 55:
                                    case 56:
                                    case 57:
                                    case 61:
                                    case 63:
                                    case 65:
                                    case 66:
                                    case 67:
                                        document.querySelector(`.s_weatherIcon`).innerHTML = `<img src="img/rainly.png" alt="rainly">`; 
                                        break;
                                    case 71:
                                    case 73:
                                    case 75:
                                    case 77:
                                    case 85:
                                    case 86:
                                        document.querySelector(`.s_weatherIcon`).innerHTML = `<img src="img/snow.png" alt="snow">`;
                                        break;
                                    case 95:
                                    case 96:
                                    case 99:
                                        document.querySelector(`.s_weatherIcon`).innerHTML = `<img src="img/storm.png" alt="storm">`;
                                        break;
                                    default:
                                        document.querySelector(`.s_weatherIcon`).innerHTML = `<img src="img/cloudly.png" alt="cloudly">`;
                                }
                            }

                            animateWeatherIcons(i)
                        
                        }
                    
                        document.querySelectorAll(`.long-term-temperature`)[i].innerHTML = `${data.daily.temperature_2m_max[i]}°<span class="nightTemperature">${data.daily.temperature_2m_min[i]}${degUnit}</span>`;
                        
                        if(date.getDay()+i>6)
                            document.querySelectorAll(`.long-term-item h4`)[i].innerHTML = weekdays[-7+(date.getDay()+i)]
                        else 
                            document.querySelectorAll(`.long-term-item h4`)[i].innerHTML = weekdays[date.getDay()+i]     
                
                    }
            
           
           
            
            if(Math.round(data.daily.uv_index_max[0]) == 0)
                document.querySelector(".uv-numbers").innerHTML = "1";
            else 
            {
                    let rozm = 1.1;
                    let opac = 0.1;

                    let currentUvIndex = Math.round(data.daily.uv_index_max[0])

                    for(let i=currentUvIndex-3; i<=currentUvIndex; i++)
                    {
                            if(i==currentUvIndex)
                            {
                                document.querySelector(".uv-numbers").innerHTML += `<span style="font-weight: 700; font-size: 1.55em;">${currentUvIndex}</span>`;
                                
                                /// loop for growing number in uv index
                                for(let j = currentUvIndex+1; j < currentUvIndex+4; j++)
                                {
                                    rozm-=0.1
                                    opac-=0.1
                                    document.querySelector(".uv-numbers").innerHTML += `<span style="font-size: ${rozm}em; opacity: ${opac}">${j}</span>`;  
                                }
                                
                            }

                            /// descent numbers in uv index
                            else 
                                document.querySelector(".uv-numbers").innerHTML += `<span style="font-size: ${rozm}em; opacity: ${opac}">${currentUvIndex - (currentUvIndex-i)}</span>`;
                        

                            opac+=0.1
                            rozm+=0.1;
                    }
            }
    });
}



function setDefault(lat, lng)
{
    setTimeout(() => {
        localStorage.setItem("defaultName", `${document.querySelector(".s_date h2").innerHTML}`)
        localStorage.setItem("defaultLat", `${lat}`)
        localStorage.setItem("defaultLng", `${lng}`)
    }, 0150);
    
}

function setTheme(dark)
{

    let list = document.querySelectorAll(".long-term-item");
    let list2 = document.querySelectorAll(".highlight-item");

    if(dark)
    {
            document.querySelector("body").classList.add("dark");
            document.querySelector(".searchCity").classList.add("dark")
            document.querySelector("#inputSearchCity").classList.add("dark")
            document.querySelector(".summaryLeft").classList.add("darkSummary");

            document.querySelector("#city-items").classList.add('darkSearch');
            
            for (let i = 0; i < list.length; ++i) {
                list[i].classList.add('darkSearch');
            }

            for (let i = 0; i < list2.length; ++i) {
                list2[i].classList.add('darkSearch');
            }

            document.getElementById("celsius").classList.add("darkBtn");
            document.getElementById("farenheit").classList.add("darkBtn");
            document.getElementById("btn_darkMode").innerHTML = `<span style="color: #fff";><i class="fa fa-sun-o" aria-hidden="true"></i></span>`;

            document.querySelector(".windAnimate").setAttribute("src", "img/wind-light.png")

            localStorage.setItem("theme", "1");
        }

        else 
        {
            document.querySelector("body").classList.remove("dark");
            document.querySelector(".searchCity").classList.remove("dark")
            document.querySelector("#inputSearchCity").classList.remove("dark")
            document.querySelector(".summaryLeft").classList.remove("darkSummary");

            document.querySelector("#city-items").classList.remove('darkSearch');

            for (let i = 0; i < list.length; ++i) {
                list[i].classList.remove('darkSearch');
            }

            for (let i = 0; i < list2.length; ++i) {
                list2[i].classList.remove('darkSearch');
            }

            document.getElementById("celsius").classList.remove("darkBtn");
            document.getElementById("farenheit").classList.remove("darkBtn");
            document.getElementById("btn_darkMode").innerHTML = `<span style="color: #000";><i class="fa-regular fa-moon"></i></span>`;

            document.querySelector(".windAnimate").setAttribute("src", "img/wind.png");

            localStorage.setItem("theme", "0");
        }
        
}

document.querySelector("#getUsrLocation").addEventListener('click', () => {
    var geo = navigator.geolocation;

    if(geo) {
    geo.getCurrentPosition(function(location) {

        fetch(`https://api.geonames.org/findNearbyJSON?lat=${location.coords.latitude}&lng=${location.coords.longitude}&username=saydi`)
        .then(response => response.json())
        .then(data => {
            setCity(data.geonames[0].name, location.coords.latitude, location.coords.longitude)
        })
    });
    }
    else {
        alert("Can't get location!");
    }
})