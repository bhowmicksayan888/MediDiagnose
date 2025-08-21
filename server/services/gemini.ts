import { GoogleGenAI } from "@google/genai";
import { DiagnosisInput, DiagnosisResponse, DiagnosisResult } from "@shared/schema";
import { verifyDiagnosis } from "./medical-verification";

// Note that the newest Gemini model series is "gemini-2.5-flash" or "gemini-2.5-pro"
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("GEMINI_API_KEY environment variable is required but not set");
}

const ai = new GoogleGenAI({ apiKey: apiKey });

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

Please provide your analysis in the following JSON format with medical validation:
{
  "summary": "Brief analysis summary explaining the approach and key considerations",
  "results": [
    {
      "condition": "Precise medical condition name (use standard medical terminology)",
      "probability": 85,
      "explanation": "Clear explanation of why this condition fits the symptoms based on medical evidence",
      "urgency": "urgent|moderate|mild",
      "matchingSymptoms": ["symptom1", "symptom2"],
      "recommendations": ["specific evidence-based recommendation 1", "specific recommendation 2"]
    }
  ],
  "recommendations": ["Overall recommendations for next steps based on clinical guidelines", "General evidence-based advice"],
  "analysisTimestamp": "${new Date().toISOString()}"
}

Guidelines:
- Provide 3-6 differential diagnoses ranked by likelihood
- Use precise medical terminology from standard textbooks (Harrison's, Park's, etc.)
- Include probability percentages (0-100) based on clinical evidence
- Consider red flag symptoms that require urgent attention
- Provide specific, evidence-based recommendations following clinical guidelines
- Consider age and gender when relevant to the diagnosis
- Mark urgent conditions that require immediate medical attention
- Focus on the most likely conditions based on symptom correlation and medical literature
- Use condition names that can be matched to ICD-10 codes when possible

Medical Standards:
- Base diagnoses on established medical knowledge from Harrison's Principles of Internal Medicine
- Reference Park's Textbook of Preventive and Social Medicine for epidemiological context
- Follow evidence-based medicine principles
- Consider differential diagnosis as taught in standard medical education

Remember: This is for educational purposes only and should not replace professional medical evaluation.`;

    const systemInstruction = `You are a medical AI specialist. Always respond with valid JSON only. Be fast and accurate.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json"
      },
      contents: prompt
    });

    const rawJson = response.text;
    
    if (!rawJson) {
      throw new Error("Empty response from Gemini model");
    }

    const result = JSON.parse(rawJson);
    
    // Validate the response structure
    if (!result.summary || !Array.isArray(result.results)) {
      throw new Error("Invalid response format from AI service");
    }

    // Apply medical verification to each diagnosis
    const verifiedResults = result.results.map((diagnosis: DiagnosisResult) => 
      verifyDiagnosis(diagnosis)
    );

    return {
      ...result,
      results: verifiedResults
    } as DiagnosisResponse;
  } catch (error) {
    console.error("Error generating differential diagnosis:", error);
    throw new Error(`Failed to generate differential diagnosis: ${error}`);
  }
}
