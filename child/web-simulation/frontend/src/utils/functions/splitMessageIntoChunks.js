// Function to split message into chunks of max 5 words
const splitMessageIntoChunks = (message) => {
  const words = message.split(" ");
  const chunks = [];

  for (let i = 0; i < words.length; i += 5) {
    chunks.push(words.slice(i, i + 5).join(" "));
  }
  return chunks;
};

export default splitMessageIntoChunks;
