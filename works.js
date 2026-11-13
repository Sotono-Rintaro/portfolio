// ファイルを直接開いても表示できるように、CSVと同じ内容を予備データとして保持します。
// GitHub Pages / Live Serverでは works.csv を優先して読み込みます。
const defaultWorks = [
  {
    "title": "タコ",
    "description": "授業の課題で作成したもの",
    "image": "./media/IMG_9944.jpg",
    "link": "#",
    "category": "UED",
    "year": "2026"
  },
  {
    "title": "ルンバ",
    "description": "授業中の課題で作成したもの",
    "image": "./media/IMG_9822.jpg",
    "link": "#",
    "category": "UED",
    "year": "2026"
  },
  {
    "title": "猫と犬",
    "description": "家にいるとき",
    "image": "./media/IMG_0018.jpg",
    "link": "#",
    "category": "cat",
    "year": "2025"
  }
];

function parseWorksCSV(data) {
  const rows = data.replace(/^\uFEFF/, "").trim().split(/\r?\n/);
  const headers = rows[0].split(",");
  return rows.slice(1).filter(Boolean).map(function (row) {
    const values = row.split(",");
    const work = {};
    headers.forEach(function (header, index) { work[header] = (values[index] || "").trim(); });
    return work;
  });
}

const worksPromise = location.protocol === "file:"
  ? Promise.resolve(defaultWorks)
  : fetch("works.csv")
      .then(function (response) {
        if (!response.ok) throw new Error("works.csv: " + response.status);
        return response.text();
      })
      .then(parseWorksCSV)
      .catch(function (error) {
        console.warn("CSVの読み込みに失敗したため予備データを使用します", error);
        return defaultWorks;
      });

worksPromise.then(function (works) {
    const grid = document.getElementById("works-grid");
    const categorySelect = document.getElementById("category");
    const sortSelect = document.getElementById("sort");
    const dialog = document.getElementById("work-dialog");
    const dialogImage = document.getElementById("dialog-image");
    const dialogLink = document.getElementById("dialog-link");
    const closeButton = dialog.querySelector(".dialog-close");
    const categories = [...new Set(works.map(function (work) { return work.category; }))];
    categories.forEach(function (category) {
      const option = document.createElement("option");
      option.value = category;
      option.textContent = category;
      categorySelect.appendChild(option);
    });

    function openWork(work) {
      document.getElementById("dialog-title").textContent = work.title;
      document.getElementById("dialog-description").textContent = work.description;
      document.getElementById("dialog-category").textContent = work.category;
      document.getElementById("dialog-year").textContent = work.year;
      dialogImage.src = work.image;
      dialogImage.alt = work.title;
      // 「#」は未設定のリンクなので表示しない
      if (work.link && work.link !== "#") {
        dialogLink.href = work.link;
        dialogLink.hidden = false;
      } else {
        dialogLink.removeAttribute("href");
        dialogLink.hidden = true;
      }
      dialog.showModal();
    }
    closeButton.addEventListener("click", function () { dialog.close(); });
    dialog.addEventListener("click", function (event) {
      if (event.target === dialog) dialog.close();
    });

    function displayWorks() {
      const selectedCategory = categorySelect.value;
      const sortType = sortSelect.value;
      const filteredWorks = works.filter(function (work) {
        return selectedCategory === "all" || work.category === selectedCategory;
      });
      filteredWorks.sort(function (a, b) {
        if (sortType === "new") return Number(b.year) - Number(a.year);
        if (sortType === "old") return Number(a.year) - Number(b.year);
        return a.title.localeCompare(b.title, "ja");
      });
      grid.replaceChildren();
      filteredWorks.forEach(function (work) {
        const card = document.createElement("article");
        card.className = "work-card";
        const button = document.createElement("button");
        button.type = "button";
        button.setAttribute("aria-label", work.title + "の詳細を見る");
        const img = document.createElement("img");
        img.src = work.image;
        img.alt = work.title;
        const info = document.createElement("div");
        info.className = "work-info";
        const category = document.createElement("p");
        category.className = "work-category";
        category.textContent = work.category;
        const title = document.createElement("h4");
        title.textContent = work.title;
        const description = document.createElement("p");
        description.textContent = work.description;
        const year = document.createElement("p");
        year.className = "work-year";
        year.textContent = work.year;
        info.append(category, title, description, year);
        button.append(img, info);
        button.addEventListener("click", function () { openWork(work); });
        card.appendChild(button);
        grid.appendChild(card);
      });
    }
    categorySelect.addEventListener("change", displayWorks);
    sortSelect.addEventListener("change", displayWorks);
    displayWorks();
  })
  .catch(function (error) {
    console.error("Worksの読み込みに失敗しました", error);
    document.getElementById("works-error").hidden = false;
  });

    var latitude = 35.6895;
    var longitude = 139.6917;

    var weatherUrl =
     "https://api.open-meteo.com/v1/forecast" +
     "?latitude=" + latitude +
     "&longitude=" + longitude +
     "&current=temperature_2m,weather_code" +
     "&timezone=Asia%2FTokyo";
    fetch(weatherUrl)
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        var weatherCode = data.current.weather_code;
        showWeather(weatherCode);
    }); 
    function showWeather(code) {

    var icon = document.getElementById("weather-icon");

    if (code === 0) {
        icon.textContent = "☀";
        document.body.className = "weather-sunny";

    } else if (code >= 1 && code <= 3) {
        icon.textContent = "☁";
        document.body.className = "weather-cloudy";

    } else if (code >= 51 && code <= 67) {
        icon.textContent = "☂";
        document.body.className = "weather-rainy";

    } else {
        icon.textContent = " ☁";
        document.body.className = "weather-cloudy";
    }
}