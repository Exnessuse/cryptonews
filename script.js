document.addEventListener("DOMContentLoaded", function () {
    const donationAddresses = {
        BTC: "B1AjCvBBSTs2GFtVd4Pj5dALMVMnHU2wDY2mSnAUBp64",
        ETH: "0x123456789abcdef123456789abcdef123456789a",
        XRP: "r123456789abcdef123456789abcdef123",
        SOL: "So1aNa123456789abcdef123456789abcdef123"
    };

    let apiKeys = [];
    let apiKeyIndex = 0;

    const button = document.getElementById("donateButton");
    const container = document.createElement("div");
    container.style.display = "none";
    container.style.flexDirection = "column";
    container.style.gap = "8px";
    container.style.marginTop = "10px";

    button.addEventListener("click", function () {
        container.style.display = container.style.display === "none" ? "flex" : "none";
    });

    Object.keys(donationAddresses).forEach((coin) => {
        const copyButton = document.createElement("button");
        copyButton.textContent = `Copy ${coin} Address`;
        copyButton.classList.add("copy-button");

        copyButton.onclick = () => {
            navigator.clipboard.writeText(donationAddresses[coin])
                .then(() => alert(`${coin} address copied to clipboard!`))
                .catch(err => console.error("Failed to copy:", err));
        };

        container.appendChild(copyButton);
    });

    button.parentNode.insertBefore(container, button.nextSibling);

    // Fetch API keys securely from Netlify Function
    function fetchApiKeys() {
        return fetch('/.netlify/functions/getApiKeys')
            .then(response => response.json())
            .then(data => {
                if (data.apiKeys && Array.isArray(data.apiKeys) && data.apiKeys.length > 0) {
                    apiKeys = data.apiKeys;
                    console.log("Loaded API keys:", apiKeys);
                } else {
                    console.error("No API keys found in Netlify function response.");
                }
            })
            .catch(error => console.error("Error loading API keys:", error));
    }

    // Fetch Crypto News
    function fetchCryptoNews() {
        if (apiKeys.length === 0) {
            console.error("No API keys available. Skipping fetch.");
            return;
        }

        const newsApiKey = apiKeys[apiKeyIndex];
        apiKeyIndex = (apiKeyIndex + 1) % apiKeys.length; // Rotate API keys

        fetch(`https://min-api.cryptocompare.com/data/v2/news/?lang=EN&api_key=${newsApiKey}`)
            .then(response => response.json())
            .then(data => {
                const newsContainer = document.getElementById("newsContainer");
                newsContainer.innerHTML = "";

                if (data?.Data?.length > 0) {
                    data.Data.forEach(article => {
                        const newsItem = document.createElement("div");
                        newsItem.innerHTML = `
                            <h2>${article.title}</h2>
                            <img src="${article.imageurl}" alt="${article.title}" style="max-width:100%; border-radius:10px;">
                            <p>${article.body.substring(0, 100)}...</p>
                            <a href="${article.url}" target="_blank">Read More</a>
                            <hr>
                        `;
                        newsContainer.appendChild(newsItem);
                    });
                } else {
                    newsContainer.innerHTML = "No news available.";
                }
            })
            .catch(error => {
                console.error("Error fetching news:", error);
                document.getElementById("newsContainer").innerHTML = "Failed to load news.";
            });
    }

    // Load API keys first, then fetch news
    fetchApiKeys().then(() => {
        fetchCryptoNews();
        setInterval(fetchCryptoNews, 3600000); // Refresh news every 1 hour
    });
});
