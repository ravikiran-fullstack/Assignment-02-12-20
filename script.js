
// Countries API to fetch data using promise and xmlHttpRequest object
function customFetchApi(url, config = { method: 'GET'}) {
  return new Promise((res, rej) => {
    let xhr = new XMLHttpRequest();
    let method = config.method;
    xhr.open(method, url, true);

    xhr.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        res(xhr.responseText);
      } else if (this.readyState == 4 && this.status !== 200) {
        rej("error occurred while fetching data");
      }
    };

    xhr.send();
  });
}

let url = "https://restcountries.eu/rest/v2/all";
let config = {
  method: 'GET'
}
// Call countriesApi to get countries data
customFetchApi(url, config)
  .then((response) => {
    generateHtml(JSON.parse(response));
  })
  .catch((err) => console.error(err));

   async function checkWeather(countryLatLng){
    
    let latLngArr = countryLatLng.split(',');
    
    let latLngArrFormatted = latLngArr.map(ele => (+ele).toFixed(2));
    const lat = latLngArrFormatted[0];
    const lng = latLngArrFormatted[1];
    console.log(lat, lng);

     const weatherData = await fetchWeather(lat, lng);
     console.log(weatherData);
     //document.getElementById('exampleModalCenter').modal();

    // Create a modal using DOM functions
    // Append it to the body of the page
   // createModal();
    
    //Open it and pass weather data to it.
    $("#exampleModalCenter").modal();
    $("#countryName").text(weatherData.name || 'NA');
    $("#temperature").text(formatTemperature(weatherData.main.temp));
    $("#weather").text(weatherData.weather[0].description);
    
    //After the modal is closed destroy/remove it from the body
    $('#exampleModalCenter').on('hidden.bs.modal', function (e) {
        console.log('exampleModalCenter closed/hidden');
    })
  }

  function formatTemperature(temperature){
      return (+temperature - 273).toFixed(2);
  }

  async function fetchWeather(lat,lng){
    let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=d9da5c116c793405f65774bb82a48990`;
    //console.log(url);

    let response = await fetch(url);
    let data = await response.json();
   // console.log(data);
    return data;
  }

//*********************************************************************DOM ******************************************************

//Create Modal Using DOM
function createModal(){
  const modal = createDomElement('div', 'modal fade', 'exampleModalCenter');
  modal.tabindex = '-1';
  modal.role = 'dialog';
  modal.setAttribute('aria-labelledby', 'true');
  modal.setAttribute('aria-hidden', 'true');

    const modalDialog = createDomElement('div', 'modal-dialog modal-dialog-centered');
    modalDialog.setAttribute('role', 'document');

    const modalContent = createDomElement('div', 'modal-content');
      const modalHeader = createDomElement('div', 'modal-header');
        const modalTitle = createDomElement('h5', 'modal-title', 'exampleModalLongTitle');
        modalTitle.innerHTML = 'Weather Report';

      modalHeader.append(modalTitle);

      const modalBody = createDomElement('div', 'modal-body');
        const countryDiv = createDomElement('div');
          const countryP = createDomElement('p');
          countryP.innerHTML = 'Country: ';
          const countryPName = createDomElement('p', '', 'countryName');
        countryDiv.append(countryP, countryPName);

        const temperatureDiv = createDomElement('div');
          const temperatureP = createDomElement('p');
          temperatureP.innerHTML = 'Temperature: ';
          const temperaturePValue = createDomElement('p', 'font-weight-bold', 'temperature');
          const degreeSymbol = createDomElement('span', 'font-weight-bold degreeCelsius');
          degreeSymbol.innerHTML = ' &#8451;';
        temperatureDiv.append(temperatureP, temperaturePValue, degreeSymbol);
        
        const weatherDiv = createDomElement('div');
          const weatherP = createDomElement('p');
          weatherP.innerHTML = 'Weather: ';
          const weatherPValue = createDomElement('p', '', 'weather');
        weatherDiv.append(weatherP, weatherPValue);
      modalBody.append(countryDiv, temperatureDiv, weatherDiv);  
          
      const modalFooter = createDomElement('div', 'modal-footer');
        const modalCloseButton = createDomElement('div', 'btn btn-secondary');
        modalCloseButton.setAttribute('data-dismiss', 'modal');
        modalCloseButton.innerHTML = 'Close';
      modalFooter.append(modalCloseButton);      

      modalContent.append(modalHeader, modalBody, modalFooter);  
    modalDialog.append(modalContent);
  modal.append(modalDialog);

  document.body.append(modal);
}

//Creates individual Card
function createCard(countryObj) {
  const card = createDomElement("div", "card");
    const cardBody = createDomElement("div", "card-body");
      // If the name of the country is too long change the font size
      const cardTitle = createDomElement("h5", "card-title");
      if (countryObj.name.length > 15) {
        cardTitle.classList.add("short-title");
      }
      cardTitle.innerHTML = countryObj.name;

      const image = createDomElement("img", "card-img-top");
        image.src = countryObj.flag;
        image.alt = countryObj.name;
        
      const cardContents = createDomElement("div", "card-contents");

        const capitalP = createDomElement("p", "capital");
          capitalP.innerHTML = "Capital:";
          const capitalPSpan = createDomElement("span");
          if (!countryObj.capital) {
            capitalPSpan.innerHTML = "NA";
          } else {
            capitalPSpan.innerHTML = countryObj.capital;
          }
        capitalP.append(capitalPSpan);

        const countryCodesP = createDomElement("p");
          countryCodesP.innerHTML = "Country Codes: ";
          const countryCodesPSpan = createDomElement("span");
          countryCodesPSpan.innerHTML = `${countryObj.alpha2Code}, ${countryObj.alpha3Code}`;
        countryCodesP.append(countryCodesPSpan);

        const regionP = createDomElement("p");
          regionP.innerHTML = "Region:";
          const regionPSpan = createDomElement("span");
          regionPSpan.innerHTML = countryObj.region;
        regionP.append(regionPSpan);

        const latLongP = createDomElement("p");
          latLongP.innerHTML = "Lat Long:";
          const latLongPSpan = createDomElement("span");
         // console.log(countryObj.latlng);
          latLongPSpan.innerHTML = formatLatLng(countryObj.latlng);
        latLongP.append(latLongPSpan);

        const checkWeatherButton = createDomElement("button", "weatherBtn btn btn-warning", countryObj.alpha2Code);
          checkWeatherButton.innerHTML = "Check weather";
          checkWeatherButton.setAttribute('onclick',`checkWeather('${countryObj.latlng}')`);

      cardContents.append(capitalP, countryCodesP, regionP, latLongP, checkWeatherButton);
      cardBody.append(cardTitle, image, cardContents);
    card.append(cardBody);
  return card;
}

// Formats the latitude and longitude
function formatLatLng(latLngArr) {
  //console.log(latLngArr);
  return latLngArr.map((ele) => ele.toFixed(2)).join(",");
}

// Creates a Dom element and assigns class and id to it, if they are not empty
function createDomElement(ele, eleClass = "", eleId = "") {
  const element = document.createElement(ele);
  eleClass !== "" ? element.setAttribute("class", eleClass): '';
  eleId !== "" ? element.setAttribute("id", eleId): '';
  return element;
}

// Generates Body of the document
function generateHtml(countriesInfo) {
  const container = createDomElement("div", "container-fluid");
    const row = createDomElement("div", "row");
      const column = createDomElement("div", "col-12 countriesInfo");

      countriesInfo.forEach((country) => {
        const card = createCard(country);
        column.append(card);
      });

    row.append(column);
    container.append(row);
  document.body.append(container);
  createModal()
}
