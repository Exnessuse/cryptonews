document.addEventListener("DOMContentLoaded", function() {
    const donationAddresses = {
        BTC: "B1AjCvBBSTs2GFtVd4Pj5dALMVMnHU2wDY2mSnAUBp64",
        ETH: "0x123456789abcdef123456789abcdef123456789a",
        XRP: "r123456789abcdef123456789abcdef123",
        SOL: "So1aNa123456789abcdef123456789abcdef123"
    };

    const apiKeys = [
        "326d530012b012b609239003d7e440baaeb16290fcd9ee997d35096073a1e7f7",
        "b9d207e88abea6603bac7a2e4bd0432a2abc6724a9d1f6ecffa0dabbc5536647",
        "430413d497388e5516243a9f04793f383deab60197ff28b76df00d52b3f713c9",
        "34862f40ab453ea8a50ca78a2404a604d7d6620903940bc36cb886cecf97ad09"
    ];
    let apiKeyIndex = 0;

    const button = document.getElementById("donateButton");
    const container = document.createElement("div");
    container.style.display = "none";
    container.style.flexDirection = "column";
    container.style.gap = "8px";
    container.style.marginTop = "10px";

    button.addEventListener("click", function() {
        container.style.display = container.style.display === "none" ? "flex" : "none";
    });

    Object.keys(donationAddresses).forEach((coin) => {
        const copyButton = document.createElement("button");
        copyButton.textContent = `Copy ${coin} Address`;
        copyButton.classList.add("copy-button");

        copyButton.onclick = () => {
            const tempInput = document.createElement("input");
            tempInput.value = donationAddresses[coin];
            document.body.appendChild(tempInput);
            tempInput.select();
            document.execCommand("copy");
            document.body.removeChild(tempInput);
            alert(`${coin} address copied to clipboard!`);
        };

        container.appendChild(copyButton);
    });

    button.parentNode.insertBefore(container, button.nextSibling);

    // Fetch Crypto News
    function fetchCryptoNews() {
        const newsApiKey = apiKeys[apiKeyIndex];
        fetch(`https://min-api.cryptocompare.com/data/v2/news/?lang=EN&api_key=${newsApiKey}`)
            .then(response => response.json())
            .then(data => {
                const newsContainer = document.getElementById("newsContainer");
                newsContainer.innerHTML = "";
                if (data && data.Data && Array.isArray(data.Data)) {
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

    setInterval(fetchCryptoNews, 3600000); // Refresh news every 1 hour
    fetchCryptoNews();
});
