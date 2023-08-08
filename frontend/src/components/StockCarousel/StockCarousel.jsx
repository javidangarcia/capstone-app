import "./StockCarousel.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Carousel from "react-bootstrap/Carousel";
import { useDispatch } from "react-redux";
import { setLoading } from "../../redux/loading";
import { NetworkError, ServerError } from "../../utils";

export default function StockCarousel() {
    const [stocks, setStocks] = useState([]);
    const [stocksNotFound, setStocksNotFound] = useState(false);
    const dispatch = useDispatch();
    const [hasRendered, setHasRendered] = useState(false);

    useEffect(() => {
        const fetchStocks = async () => {
            try {
                dispatch(setLoading(true));
                const response = await axios.get(
                    `${import.meta.env.VITE_HOST}/stocks`,
                    { withCredentials: true, validateStatus: () => true }
                );

                if (response.status === 200) {
                    setStocks(response.data.stocks);
                }

                if (response.status === 404) {
                    setStocksNotFound(true);
                }

                if (response.status === 500) {
                    ServerError();
                }
                dispatch(setLoading(false));
            } catch (error) {
                dispatch(setLoading(false));
                NetworkError(error);
            }
        };


        if (hasRendered) {
            fetchStocks();
        } else {
            setHasRendered(true);
        }
    }, [hasRendered]);

    return (
        <>
            {stocksNotFound ? (
                <div
                    className="alert alert-info d-flex justify-content-center w-50 no-stocks"
                    role="alert"
                >
                    There are no stocks currently in the database, search for a
                    stock to gain access to the carousel.
                </div>
            ) : null}

            {stocks.length > 0 ? (
                <Carousel
                    className="carousel mb-5"
                    data-bs-theme="light"
                    interval={700}
                >
                    {stocks.map((stock) => (
                        <Carousel.Item
                            key={stock.ticker}
                            className="carousel-item"
                        >
                            <Link
                                to={`/search/stocks/${stock.ticker}`}
                                className="stock-link"
                            >
                                <img
                                    className="d-block w-100"
                                    src={stock.logo}
                                    alt={stock.name}
                                />
                            </Link>
                            <Carousel.Caption>
                                <div className="text-white carousel-info">
                                    <h5>{stock.ticker}</h5>
                                    <p>{stock.name}</p>
                                </div>
                            </Carousel.Caption>
                        </Carousel.Item>
                    ))}
                </Carousel>
            ) : null}
        </>
    );
}
