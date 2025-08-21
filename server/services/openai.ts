import OpenAI from "openai";
import { DiagnosisInput, DiagnosisResponse } from "@shared/schema";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key"
});

export async function generateDifferentialDiagnosis(input: DiagnosisInput): Promise<DiagnosisResponse> {
  try {
    const { primarySymptom, associatedSymptoms = [], age, gender } = input;
    
    const demographicInfo = [
      age && `Age: ${age}`,
      gender && `Gender: ${gender}`
    ].filter(Boolean).join(", ");

    const prompt = `You are an expert medical AI assistant specializing in differential diagnosis. Analyze the following patient presentation and provide a ranked list of potential diagnoses.

Patient Presentation:
- Primary Symptom: ${primarySymptom}
${associatedSymptoms.length > 0 ? `- Associated Symptoms: ${associatedSymptoms.join(", ")}` : ""}
${demographicInfo ? `- Patient Demographics: ${demographicInfo}` : ""}

Please provide your analysis in the following JSON format:
{
  "summary": "Brief analysis summary explaining the approach and key considerations",
  "results": [
    {
      "condition": "Medical condition name",
      "probability": 85,
      "explanation": "Clear explanation of why this condition fits the symptoms",
      "urgency": "urgent|moderate|mild",
      "matchingSymptoms": ["symptom1", "symptom2"],
      "recommendations": ["specific recommendation 1", "specific recommendation 2"]
    }
  ],
  "recommendations": ["Overall recommendations for next steps", "General advice"],
  "analysisTimestamp": "${new Date().toISOString()}"
}

Guidelines:
- Provide 3-6 differential diagnoses ranked by likelihood
- Include probability percentages (0-100)
- Consider red flag symptoms that require urgent attention
- Provide specific, actionable recommendations
- Use proper medical terminology but explain clearly
- Consider age and gender when relevant to the diagnosis
- Mark urgent conditions that require immediate medical attention
- Focus on the most likely conditions based on symptom correlation

Remember: This is for educational purposes only and should not replace professional medical evaluation.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a medical AI specialist providing differential diagnosis assistance. Always respond with valid JSON and maintain professional medical standards."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
      max_tokens: 2000
    });

    const result = JSON.parse(response.choices[0].message.content!);
    
    // Validate the response structure
    if (!result.summary || !Array.isArray(result.results)) {
      throw new Error("Invalid response format from AI service");
    }

    return result as DiagnosisResponse;
  } catch (error) {
    console.error("Error generating differential diagnosis:", error);
    throw new Error("Failed to generate differential diagnosis. Please try again.");
  }
}
