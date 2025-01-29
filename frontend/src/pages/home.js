import React from "react";
import DateEntry from "../components/date-entry";
import { useFetchOnDemand } from "../api-access/get-ai-data-on-demand";
import DataDisplay from "../components/data-display";
import LoadingSpinner from "../components/loading-spinner";


export default function Home() {
    const { data, loading, error, setBirthDate } = useFetchOnDemand();
    //const { data, loading, error, setBirthDate } = useFetchOnDemand();

    const templeData = 
    {
        "_id": {
          "$oid": "678c545358998ebaa3310944"
        },
        "temple": "Los Angeles California Temple",
        "dedication": "11–14 March 1956",
        "dedicatedBy": "David O. McKay"
      };

    const handleDateSelect = (selectedDate) => {
        setBirthDate(selectedDate);
    };

    if (loading)
        return (
          <div>
            <LoadingSpinner />
          </div>
        );

    return (
        <>
            <DateEntry onDateSelect={handleDateSelect} />
            <div>
                {error && <p style={{ color: "red" }}>{error}</p>}
                {data && (
                    <div className="container my-5">
                        <div className="row">
                            {/* Scattered Layout */}
                            <div className="col-md-4">
                                <DataDisplay
                                    title="Birthstone"
                                    name={data.birthstone}
                                    description={data.birthstoneSymbol}
                                />
                            </div>
                            <div className="col-md-4 mt-5 pb-5">
                                <DataDisplay
                                    title="Western Zodiac Sign"
                                    name={data.zodiac}
                                    description={data.zodiacSymbol}
                                    descriptionStyle={{
                                        top: "75%",
                                        backgroundColor: "rgba(18, 217, 21, .9)",
                                      }}
                                />
                            </div>
                            <div className="col-md-4">
                                <DataDisplay
                                    title="Chinese Zodiac Sign"
                                    name={data.chineseZodiac}
                                    description={`Element: ${data.chineseZodiacElement}`}
                                    descriptionStyle={{
                                        top: "40%",
                                        backgroundColor: "rgba(18, 217, 21, .9)",
                                      }}

                                />
                            </div>
                            <div className="col-md-4 mt-5 pt-5">
                                <DataDisplay
                                    title="Birth Flower"
                                    name={data.birthFlower}
                                />
                            </div>
                            <div className="col-md-4">
                                <DataDisplay
                                    title="Temple Dedicated"
                                    name={templeData.temple}
                                    description={<span style={{ fontSize: "11px" }}>Dedicated By: {templeData.dedicatedBy}</span>}
                                    descriptionStyle={{
                                        top: "90%",
                                        backgroundColor: "rgba(18, 217, 21, .9)",
                                      }}
                                />
                            </div>
                            
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
