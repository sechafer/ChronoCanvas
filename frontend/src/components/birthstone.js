import React from 'react';

export default function BirthstoneComponent ({ aiData }){

    if (!aiData || !aiData.birthstone) {
        return <div>Loading...</div>;
    }

    return (
        <>
         <h1>{aiData.birthstone}</h1>
         <p>{aiData.birthstoneSymbol}</p>
        </>
    );
};
