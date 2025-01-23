import React from "react";
import DateEntry from "../components/date-entry";
import { useFetchOnDemand } from "../api-access/get-data-on-demand";
import AIDataDisplay from "../components/ai-data-display";

export default function Home() {
    const { data, loading, error, setBirthDate } = useFetchOnDemand();

    const handleDateSelect = (selectedDate) => {
        setBirthDate(selectedDate);
    };

    return (
        <>
            <DateEntry onDateSelect={handleDateSelect} />
            <div>
                {loading && <p>Loading...</p>}
                {error && <p style={{ color: "red" }}>{error}</p>}
                {data && (
                    <div className="container my-5">
                        <div className="row">
                            {/* Scattered Layout */}
                            <div className="col-md-6">
                                <AIDataDisplay
                                    title="Birthstone"
                                    data={data.birthstone}
                                    description={data.birthstoneSymbol}
                                />
                            </div>
                            <div className="col-md-6 mt-5 pb-5">
                                <AIDataDisplay
                                    title="Western Zodiac Sign"
                                    data={data.zodiac}
                                    description={data.zodiacSymbol}
                                />
                            </div>
                            <div className="col-md-6">
                                <AIDataDisplay
                                    title="Chinese Zodiac Sign"
                                    data={data.chineseZodiac}
                                    description={`Element: ${data.chineseZodiacElement}`}
                                />
                            </div>
                            <div className="col-md-6 mt-5 pt-5">
                                <AIDataDisplay
                                    title="Birth Flower"
                                    data={data.birthFlower}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
