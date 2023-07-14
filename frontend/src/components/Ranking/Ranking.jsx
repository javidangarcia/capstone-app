import "./Ranking.css";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { UserContext } from "../App/App"

export default function Ranking() {
    const [stocksRanking, setStocksRanking] = useState([]);
    const { setError } = useContext(UserContext);


    useEffect(() => {
        const fetchRanking = async () => {
            try {
                const response = await axios.get("http://localhost:3000/ranking", 
                    { withCredentials: true, validateStatus: () => true }
                );

                if (response.status === 200) {
                    setStocksRanking(response.data.stocksRanking);
                }

                if (response.status === 422 || response.status === 401) {
                    setError(response.data.error);
                }

                if (response.status === 500) {
                    setError(`${response.statusText}: Please try again later.`);
                }
            } catch (error) {
                setError(`${error.message}: Please try again later.`);
            }
            
        }
        fetchRanking();
    }, []);
    
    return (
        <div className="ranking">
            <h1>Popular Stocks</h1>
            <p>Recommended based on your profile and history.</p>
            <div className="stock-list">
                {
                    stocksRanking?.map((stock, index) => {
                        return (
                            <div key={stock.ticker} className="stock-margin">
                                <Link key={stock.name} to={`/search/stocks/${stock.ticker}`} className="stock-link">
                                    <div className="stock">
                                        <div className="stock-rank">
                                            <p>{index + 1}</p>
                                        </div>
                                        <img src={stock.logo} alt={`This is a logo of ${stock.name}.`} />
                                        <div className="stock-info">
                                            <p>{stock.name} ({stock.ticker})</p>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    );
}
