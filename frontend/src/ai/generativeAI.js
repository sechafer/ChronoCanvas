import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEN_AI_KEY);

// Define the model
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function generateAIContent(birthDate){
const prompt = `
Given a birth date, provide the following details in JSON format:
- Day of the week (e.g., Monday, Tuesday, etc.)
- Birthstone (the one most popular associated with the birth month)
- Birthstone Symbol (what the birthstone means)
- Western zodiac sign
- Chinese zodiac sign
- Chinese zodiac element
- Birth flower (associated with the birth month)

Use the date "March 15, 1990" as an example and ensure the output is structured as valid JSON.

Example Input: March 15, 1990
Expected Output:
{
  "date": "March 15, 1990",
  "dayOfWeek": "Thursday",
  "birthstone": "Aquamarine",
  "birthstoneSymbol": "Protection, Health, and Tranquility",
  "zodiac": "Pisces",
  "chineseZodiac": "Horse",
  "chineseZodiacElement": "Metal",
  "birthFlower": "Daffodil"
}
Now respond with the JSON object that I can parse for the provided date: ${birthDate}.
`;


    try {
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        console.log("Response Text:", responseText);
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch && jsonMatch[0]) {
            const parsedResult = JSON.parse(jsonMatch[0]); // Parse the matched JSON
            console.log("Parsed JSON:", parsedResult);
            return parsedResult;
        } else {
            throw new Error("No JSON object found in the response text.");
        }
    } catch (error) {
        console.error("Error generating content:", error);
        return null;
    }
}

