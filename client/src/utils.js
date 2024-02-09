import Swal from "sweetalert2";
import { format } from "date-fns";

// Functions

export const formatDate = timestamp => {
    const date = new Date(timestamp * 1000);
    const options = { year: "numeric", month: "long", day: "numeric" };
    return date.toLocaleDateString("en-US", options);
};

export const capitalize = sentence => {
    const words = sentence.split(" ");

    const capitalizedWords = words.map(
        word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    );

    return capitalizedWords.join(" ");
};

export const isValidStock = stock =>
    stock.currency === "USD" &&
    stock.instrument_type === "Common Stock" &&
    (stock.exchange === "NYSE" || stock.exchange === "NASDAQ");

export const formatDateTime = dateTimeString => {
    const dateTime = new Date(dateTimeString);

    return format(dateTime, "MMMM do, yyyy 'at' h:mm aa");
};

export const compareCommentsByDate = (firstDate, secondDate) =>
    new Date(secondDate.createdAt) - new Date(firstDate.createdAt);

export const getCurrentDate = () => {
    const currentDate = new Date();
    return currentDate.toLocaleDateString("en-CA");
};

export const formatDateToMonth = inputDate => {
    const [year, month, day] = inputDate.split("-");
    const dateObject = new Date(year, month - 1, day, 0, 0, 0);

    const formattedDate = new Intl.DateTimeFormat("en", {
        month: "short",
    }).format(dateObject);

    return formattedDate;
};

export const formatDateToMonthDay = inputDate => {
    const [year, month, day] = inputDate.split("-");
    const dateObject = new Date(year, month - 1, day, 0, 0, 0);

    const formattedMonth = new Intl.DateTimeFormat("en", {
        month: "short",
    }).format(dateObject);

    const formattedDay = new Intl.DateTimeFormat("en", {
        day: "numeric",
    }).format(dateObject);

    return `${formattedMonth} ${formattedDay}`;
};

export const getCurrentTime = () => new Date().getTime();

function getTwoWeeksAgoDate() {
    const today = new Date();
    const twoWeeksAgo = new Date(today.getTime() - 14 * 24 * 60 * 60 * 1000);
    const year = twoWeeksAgo.getFullYear();
    const month = String(twoWeeksAgo.getMonth() + 1).padStart(2, "0");
    const day = String(twoWeeksAgo.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

export function isValidArticle(currentStock, article) {
    return (
        article.image !== "" &&
        article.summary.length < 1000 &&
        (article.headline.includes(currentStock.ticker) ||
            article.summary.includes(currentStock.ticker) ||
            article.headline.includes(currentStock.name) ||
            article.summary.includes(currentStock.name))
    );
}

export const comparePostsByDate = (firstDate, secondDate) =>
    new Date(secondDate.createdAt) - new Date(firstDate.createdAt);

// URLs

export function getStockOverviewUrl(ticker) {
    const stockOverviewUrl = new URL(
        "https://www.alphavantage.co/query/?function=OVERVIEW"
    );
    stockOverviewUrl.searchParams.append("symbol", ticker);
    stockOverviewUrl.searchParams.append("apikey", import.meta.env.VITE_ALPHA);
    return stockOverviewUrl.href;
}

export function getStockPriceUrl(ticker) {
    const stockPriceUrl = new URL("https://finnhub.io/api/v1/quote");
    stockPriceUrl.searchParams.append("symbol", ticker);
    stockPriceUrl.searchParams.append("token", import.meta.env.VITE_FINNHUB);
    return stockPriceUrl.href;
}

export function getStockLogoUrl(ticker) {
    const stockLogoUrl = new URL("https://finnhub.io/api/v1/stock/profile2");
    stockLogoUrl.searchParams.append("symbol", ticker);
    stockLogoUrl.searchParams.append("token", import.meta.env.VITE_FINNHUB);
    return stockLogoUrl.href;
}

export function getMarketNewsUrl() {
    const marketNewsUrl = new URL("https://finnhub.io/api/v1/news");
    marketNewsUrl.searchParams.append("category", "forex");
    marketNewsUrl.searchParams.append("minId", "10");
    marketNewsUrl.searchParams.append("token", import.meta.env.VITE_FINNHUB);
    return marketNewsUrl.href;
}

export function getStockNewsUrl(currentStock) {
    const stockNewsUrl = new URL("https://finnhub.io/api/v1/company-news");
    stockNewsUrl.searchParams.append("symbol", currentStock.ticker);
    stockNewsUrl.searchParams.append("from", getTwoWeeksAgoDate());
    stockNewsUrl.searchParams.append("to", getCurrentDate());
    stockNewsUrl.searchParams.append("token", import.meta.env.VITE_FINNHUB);
    return stockNewsUrl.href;
}

// Error Alerts

export function ResponseError(message) {
    Swal.fire({
        icon: "error",
        text: `${message}`,
    });
}

export function ServerError() {
    Swal.fire({
        icon: "error",
        title: "Internal Server Error",
        text: "Please try again later.",
    });
}

export function NetworkError(error) {
    Swal.fire({
        icon: "error",
        title: `${error.message}`,
        text: "Please try again later.",
    });
}
