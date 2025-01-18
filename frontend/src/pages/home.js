import React from "react";
import DateEntry from "../components/date-entry";
import BirthstoneComponent from "../components/birthstone";
import { useFetchOnDemand } from "../api-access/get-data-on-demand";

export default function Home() {
    const { data: aiData, loading, error, setBirthDate } = useFetchOnDemand();

    const handleDateSelect = (selectedDate) => {
        setBirthDate(selectedDate);
    };

    return (
        <>
            <DateEntry onDateSelect={handleDateSelect} />
            <div>
                {loading && <p>Loading AI Data...</p>}
                {error && <p style={{ color: "red" }}>{error}</p>}
                {aiData && <BirthstoneComponent aiData={aiData} />}
            </div>
        </>
    );
}
