var btn = document.querySelector('.btn');
var box = document.querySelector('.box');
var txt = document.querySelector('#txt');
var loadMoreBtn = document.querySelector('.loadMore');

let allArticles = [];
let currentIndex = 0;
let itemsPerLoad = 9;

const apiKey = 'f04ad820e07d4731a58845b91b53d0ab';

function showData(data) {
    let card = document.createElement('div');
    card.className = "card";

    let image = document.createElement('img');
    image.className = "image";
    image.src = data.urlToImage || "https://via.placeholder.com/400x250?text=No+Image";

    let title = document.createElement('h3');
    title.textContent = data.title || "No title available";

    let publish = document.createElement('p');
    publish.className = "publish";
    let date = new Date(data.publishedAt).toDateString();
    publish.textContent = "Published: " + date;

    let description = document.createElement('p');
    description.textContent = data.description || "No description available.";

    let author = document.createElement('p');
    author.className = "author";
    author.textContent = "Author: " + (data.author || "Unknown");

    let link = document.createElement('a');
    link.href = data.url;
    link.target = "_blank";
    link.textContent = "Read Full Article";
    link.style.display = "block";
    link.style.marginTop = "10px";

    card.appendChild(image);
    card.appendChild(title);
    card.appendChild(publish);
    card.appendChild(description);
    card.appendChild(author);
    card.appendChild(link);

    box.appendChild(card);
}

function loadData() {
    let searchText = txt.value.trim() || "tesla";

    box.innerHTML = "";
    loadMoreBtn.style.display = "none";
    currentIndex = 0;

    const url = `https://newsapi.org/v2/everything?q=${searchText}&sortBy=publishedAt&apiKey=${apiKey}`;

    fetch(url)
        .then(res => res.json())
        .then(data => {
            if (data.status === "ok" && data.articles.length > 0) {
                allArticles = data.articles;
                loadMoreNews();

                if (allArticles.length > itemsPerLoad) {
                    loadMoreBtn.style.display = "block";
                }
            } else {
                box.innerHTML = "<p>No articles found. Please try a different search term.</p>";
            }
        })
        .catch(err => {
            console.log(err);
            box.innerHTML = "<p>Error fetching data.</p>";
        });
}

function loadMoreNews() {
    let nextItems = allArticles.slice(currentIndex, currentIndex + itemsPerLoad);

    nextItems.forEach(showData);

    currentIndex += itemsPerLoad;

    if (currentIndex >= allArticles.length) {
        loadMoreBtn.style.display = "none";
    }
}

btn.addEventListener('click', loadData);
loadMoreBtn.addEventListener('click', loadMoreNews);

txt.addEventListener('keyup', function(event) {
    if (event.key === "Enter") {
        loadData();
    }
});

loadData();