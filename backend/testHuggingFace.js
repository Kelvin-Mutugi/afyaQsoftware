const { HfInference } = require("@huggingface/inference");
require("dotenv").config();

const hf = new HfInference("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"); // Replace with your API key

async function testHuggingFaceAPI() {
  try {
    const result = await hf.request({
        model: "philippelaban/keep_it_simple", // Use the text summarization model
        inputs: "I have a headache and fever. I feel very weak and tired. What should I do?",
      });
    console.log("Hugging Face API response:", result);
  } catch (error) {
    console.error("Error calling Hugging Face API:", error);
  }
}

testHuggingFaceAPI();